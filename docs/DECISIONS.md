# Các Quyết Định Kiến Trúc (DECISIONS - ADR)

Tài liệu này ghi lại các Quyết định Kiến trúc Phần mềm (Architecture Decision Records) cho Ventlore v0.3.

---

## ADR-001: Kiến trúc Monorepo với pnpm Workspace

- **Bối cảnh:** Ventlore bao gồm ứng dụng web (Next.js), tiến trình công nhân nền (Worker Node.js), smart contract (Foundry/Solidity), cùng các thư viện dùng chung cho dữ liệu, hợp đồng API và blockchain.
- **Quyết định:** Sử dụng pnpm workspace với cấu trúc:
  - `apps/web`: Ứng dụng Next.js (App Router, Tailwind CSS, Route Handlers tại `/api/v1`).
  - `apps/worker`: Tiến trình độc lập xử lý outbox, quét logs blockchain (indexer) và kiểm tra hạn (expiry).
  - `packages/domain`: Các kiểu dữ liệu thuần, enum, quy tắc nghiệp vụ và schema Zod dùng chung.
  - `packages/api-client`: Client TypeScript có kiểu mạnh và mock adapter.
  - `packages/db`: Schema Drizzle ORM / PostgreSQL migrations và server repositories.
  - `packages/chain`: Công thức suy dẫn khóa, TypeScript bindings và contract manifests.
  - `contracts`: Foundry workspace cho Solidity contract.
- **Hệ quả:** Ranh giới phụ thuộc rõ ràng; các module UI/client không import trực tiếp schema DB hay server secret; dễ dàng tái sử dụng logic tính khóa và schema validation giữa web và worker.

---

## ADR-002: Kiến trúc Hệ thống Định danh Ba Lớp (3-Layer ID Architecture)

- **Bối cảnh:** Hệ thống cần khóa chính đáng tin cậy trong cơ sở dữ liệu, mã hiển thị ngắn gọn cho người dùng và khóa 32 bytes tối ưu cho blockchain.
- **Quyết định:**
  1. **Lớp 1 - Khóa Nghiệp vụ (Business UUID):** Canonical UUIDv7 do API sinh. Lưu kiểu `uuid` trong PostgreSQL, trả chuỗi UUID chuẩn trong JSON (`postId` camelCase trong API, `post_id` snake_case trong DB, cùng một giá trị UUID). Tuyệt đối không cấp ID mới giữa các tầng.
  2. **Lớp 2 - Mã hiển thị (Display Code):** Định dạng `PREFIX-000001` (tối thiểu 6 chữ số, duy nhất theo `(environment, prefix, sequence)`). Chỉ dùng để tra cứu tìm ra UUID canonical một lần; không dùng display code làm khóa ngoại (FK) hoặc khóa JOIN trong cơ sở dữ liệu.
  3. **Lớp 3 - Khóa Blockchain (Blockchain Keys):**
     - `APP_NAMESPACE = keccak256(UTF8("VENTLORE_V1"))`
     - `entityKey(kind, uuid) = keccak256(abi.encode(APP_NAMESPACE, kind, bytes16(uuid)))` với các kiểu ABI `(bytes32, string, bytes16)`. UUID chuyển thành 16 bytes nhị phân thực tế; không hash chuỗi có dấu gạch ngang, không dùng SHA3-256 hay `abi.encodePacked`.
     - 10 giá trị `kind` cố định: `post`, `revision`, `claim`, `route`, `donation-request`, `payable`, `credential`, `collectible`, `region`, `reason`.
     - `RECEIPT_DOMAIN = keccak256(UTF8("VENTLORE_RECEIPT_V1"))`
     - `receiptKey = keccak256(abi.encode(RECEIPT_DOMAIN, chainId, splitterAddress, donorAddress, requestKey))` với kiểu `(bytes32, uint256, address, address, bytes32)`.
     - Token ID onchain: Author NFT `tokenId = uint256(collectibleKey)`; Contributor SBT `tokenId = uint256(credentialKey)`.
- **Hệ quả:** Dữ liệu hoàn toàn nhất quán; không giải mã ngược hash để tìm UUID; các bảng DB lưu sẵn cột khóa bytes32 có index để tra cứu hai chiều.

---

## ADR-003: Một `userId` Duy Nhất Xuyên Suốt Mọi Vai Trò

- **Bối cảnh:** Một người dùng có thể đồng thời là người đọc, tác giả đóng góp, chuyên gia kiểm định thực địa, operator hoặc người quản trị.
- **Quyết định:** Duy trì một `userId` duy nhất cho mỗi con người (bảng `users`). Các vai trò, gói VIP, liên kết ví và chứng nhận là các thực thể quan hệ riêng biệt (`role_assignments`, `memberships`, `wallet_bindings`, `credentials`) tham chiếu về `userId`.
- **Hệ quả:** Không tạo các bảng `Guest`, `Author`, `Expert` riêng; việc chuyển đổi tab vai trò trên giao diện không làm thay đổi `userId`. Khách (Guest) đọc nội dung công khai không cần tài khoản hay ví.

---

## ADR-004: Tách Biệt Hai Tuyến Đóng Góp Điểm Đến

- **Bối cảnh:** Người dùng có thể đề xuất một địa điểm hoàn toàn mới hoặc viết bài chia sẻ về một địa điểm đã tồn tại trong danh mục.
- **Quyết định:**
  - Tuyến đề xuất điểm mới (F02/U02): Tạo đồng thời `placeId` (trạng thái `CANDIDATE`), bài viết `postId` (loại `DISCOVERY`) và phiên bản snapshot `revisionId` trong một database transaction. Trạng thái hiển thị là `REVIEW_ONLY` cho đến khi được duyệt. Không sử dụng mã `contributionId`.
  - Tuyến bài viết ở điểm đã biết (F03/U03): Tạo `postId` (loại `GUIDE` hoặc `EXPERIENCE`) trỏ vào `placeId` có sẵn. Sau khi qua bộ lọc tự động, bài viết được đăng ngay ở trạng thái `PUBLIC` + `UNVERIFIED`.
- **Hệ quả:** Tránh tạo nháp điểm đến rác trên database trước khi nộp; phân định rõ trách nhiệm kiểm định giữa điểm mới và bài mới.

---

## ADR-005: Tách Biệt Ba Quyết Định Độc Lập

- **Bối cảnh:** Khi chuyên gia kiểm định một bài viết và phát hiện thông tin bài viết là sai lệch hoặc không chính xác.
- **Quyết định:** Tách biệt hoàn toàn ba quyết định:
  1. Quyết định nghiệm thu công việc của chuyên gia (`acceptanceId` -> `payableId`): Đánh giá chất lượng thực địa của chuyên gia. Nếu chuyên gia thực hiện đúng quy trình và đưa ra bằng chứng xác đáng chứng minh bài viết sai, công việc vẫn được chấp nhận (`ACCEPTED_WORK`) và được thanh toán tiền công đầy đủ.
  2. Quyết định nội dung bài viết (`decisionId`): Đánh giá tính chính xác của thông tin bài viết (`APPROVED`, `CHANGES_REQUESTED`, `INCONCLUSIVE`, `REJECTED`).
  3. Quyết định thanh toán/tiền tệ: Ghi nhận trạng thái tiền thực tế sau khi giao dịch onchain/offchain hoàn tất đối soát (`PAID`).
- **Hệ quả:** Hệ thống không tạo động lực tiêu cực để chuyên gia phải xác nhận đúng cho bài viết nhằm nhận tiền công.

---

## ADR-006: Bốn Nhánh Quyền Lợi Sau Khi Duyệt Bài (`APPROVED`)

- **Bối cảnh:** Khi một bài viết đạt kết luận `APPROVED`, tác giả được hưởng nhiều quyền lợi khác nhau.
- **Quyết định:** Chia thành 4 nhánh hoàn toàn độc lập, không nhánh nào chặn nhánh nào:
  1. Nhãn kiểm tra (`Verification Badge`): Hiển thị công khai trên giao diện web, gắn đúng `revisionId` và phạm vi kiểm định; không yêu cầu tác giả phải có ví tiền điện tử.
  2. Chứng nhận Contributor SBT (`credentialId`): Cấp cho tác giả có đóng góp hợp lệ đầu tiên (tối đa 1 SBT active/user); tác giả chủ động claim bằng ví.
  3. Author NFT (`collectibleId`): Cấp vật phẩm kỷ niệm ghi nhận bài viết (tối đa 1 NFT `AUTHOR_CONTRIBUTION` cho mỗi post); tác giả chủ động claim.
  4. Tip Route (`routeId`): Tác giả ký thông điệp đồng ý (consent), sau đó Operator đăng ký route lên smart contract Splitter để mở nút nhận tiền tip.
- **Hệ quả:** Lỗi mint token hoặc thiếu ví không làm mất nhãn kiểm định trên web; các quyền lợi được thực thi tuần tự và an toàn.

---

## ADR-007: Quy Tắc Tài Chính, Phân Bổ và Đơn Vị Tiền Tệ

- **Bối cảnh:** Xử lý dòng tiền ủng hộ (Donation/Tip) và chi trả thù lao kiểm định.
- **Quyết định:**
  - Quyên góp dự án (`PROJECT`): 100% chuyển vào ví quỹ dự án.
  - Tip bài viết (`POST_TIP`): 80% chuyển tới tác giả, 20% chuyển vào ví quỹ (`projectAmount = floor(amount / 5)`, `authorAmount = amount - projectAmount`).
  - Tiền tệ onchain tính bằng đơn vị nguyên tử (`atomic units`), biểu diễn dưới dạng số nguyên / chuỗi (`string` / `BigInt`), không dùng số thực JavaScript (float).
  - Phí gas blockchain do người gửi giao dịch chi trả, tách riêng biệt và không trừ ngầm vào tỷ lệ chia tiền.
- **Hệ quả:** Không có sai số làm tròn số thực; giao dịch POST_TIP thực hiện nguyên tử (atomic): nếu một trong hai chuyển tiền thất bại thì toàn bộ giao dịch revert.

---

## ADR-008: Mô Hình Gói Thành Viên VIP

- **Bối cảnh:** Khai thác nội dung cao cấp về các điểm đến mới đã qua kiểm định để tạo nguồn thu duy trì quỹ.
- **Quyết định:**
  - Gói VIP niêm yết mức giá 1500 USD cents (tương đương 15 USD/năm).
  - Kỳ hạn là 12 tháng lịch UTC, tính từ `max(confirmedAt, currentEndsAt)`. Người dùng gia hạn chủ động, không tự động trừ tiền kỳ tiếp theo.
  - Một khoản thanh toán đã xác nhận (`CONFIRMED`) chỉ cấp duy nhất một kỳ hạn 12 tháng.
  - Quyên góp (`DON`) không bao giờ cấp VIP; VIP không cấp điểm uy tín hay quyền hạn kiểm duyệt.
  - Server kiểm tra quyền VIP tại thời điểm người dùng đọc nội dung; không render nội dung VIP vào DOM rồi giấu bằng CSS.
- **Hệ quả:** Đảm bảo an toàn nội dung trả phí; tách biệt hoàn toàn dòng tiền mua dịch vụ với dòng tiền quyên góp cộng đồng.

---

## ADR-009: Kiến Trúc Phân Lập Tiến Trình Nền (Worker Process)

- **Bối cảnh:** Việc quét log blockchain (indexer), gửi notification qua outbox và kiểm tra hạn định kỳ không nên chạy trong vòng đời request HTTP ngắn của serverless/web container.
- **Quyết định:** Tạo tiến trình độc lập `apps/worker` xử lý:
  - Outbox event processor với cơ chế lease/retry/dead-letter queue.
  - Blockchain log scanner quét log theo window block, xác minh tính canonical và finality.
  - Scheduled resource expiry processor.
  - Worker không lưu trữ private key để ký giao dịch, chỉ đọc blockchain và cập nhật cơ sở dữ liệu.
- **Hệ quả:** Đảm bảo tính sẵn sàng cao của web server; khắc phục tình trạng mất sự kiện hoặc thiếu đồng bộ do giới hạn timeout của HTTP request.

---

## ADR-010: Khóa Baseline Đề Xuất P01–P08 và UI-P01–UI-P06

- **Bối cảnh:** Tài liệu nguồn chứa một số quy ước nghiệp vụ và giao diện đang ở dạng phác thảo đề xuất cần kiểm chứng.
- **Quyết định:** Áp dụng toàn bộ P01-P08 và UI-P01 đến UI-P06 làm baseline kỹ thuật chính thức cho quá trình triển khai, nhưng gắn nhãn rõ ràng trong tài liệu và code để sẵn sàng điều chỉnh khi có quyết định kinh doanh mới từ chủ dự án.
- **Hệ quả:** Dự án có khung chuẩn hóa vững chắc để tiến hành xây dựng mà không bị gián đoạn vì các câu hỏi chính sách chưa chốt.
