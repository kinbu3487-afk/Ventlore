# Ventlore · Quy tắc và Chỉ dẫn dành cho AI Agent

Tài liệu này chứa các quy tắc xuyên suốt cho mọi lượt làm việc của AI Agent (Antigravity) trong repository Ventlore. Chi tiết kỹ thuật đầy đủ được lưu tại thư mục `docs/`.

---

## 0. Quy trình vận hành 5 Loop (Execution, Task, Product, System, Oversight)

Mọi hoạt động phát triển của AI Agent trên repository Ventlore phải tuân thủ nghiêm ngặt bộ tài liệu quy trình tại `docs/loops/`:
- [Chính sách vận hành (POLICY.md)](docs/loops/POLICY.md): Quy định 1 Issue tại 1 thời điểm (nhãn `ready`), 1 nhánh/PR tương ứng, tối đa 3 vòng sửa lỗi (Task loop), dừng ở `review` để Bin nghiệm thu, không hạ gate kiểm thử, dùng UUIDv7 theo ID Contract.
- [Hướng dẫn thực hiện nhiệm vụ (RUN_TASK.md)](docs/loops/RUN_TASK.md): Chu trình các bước từ nhận việc, code, verify cục bộ (`pnpm run verify`), push nhánh, mở PR và theo dõi CI.
- [Đánh giá hệ thống (SYSTEM_REVIEW.md)](docs/loops/SYSTEM_REVIEW.md): Vận hành System loop định kỳ sau mỗi cụm ~5 nhiệm vụ có báo cáo.
- [Mẫu báo cáo nhiệm vụ (REPORT_TEMPLATE.md)](docs/loops/REPORT_TEMPLATE.md): Mẫu báo cáo bắt buộc lưu tại thư mục `docs/loops/reports/<MÃ-TASK>.md`.

---

## 1. Quy trình làm việc bắt buộc cho mỗi chặng

1. **Khởi động:**
   - Đọc `docs/PROJECT_STATE.md` và `docs/HANDOFF.md` trước khi code.
   - Kiểm tra `git status` và mã nguồn hiện có; không tạo lại repository hoặc đảo ngược stack đã chọn.
2. **Kế hoạch & Triển khai:**
   - Lập kế hoạch ngắn gọn, thực hiện đầy đủ trong phạm vi prompt.
   - Không chỉ trả về pseudocode hoặc `TODO` cho các phần việc thuộc phạm vi của chặng.
   - Tham khảo tài liệu chính thức của thư viện khi chưa chắc chắn; tuyệt đối không bịa đặt endpoint, ABI, địa chỉ token, transaction hash hay kết quả kiểm thử.
3. **Bảo mật & Biến môi trường:**
   - Bí mật (API keys, private keys, database credentials) chỉ nằm ở file `.env` hoặc server secret store. File `.env.example` chỉ chứa placeholder mẫu.
   - Tuyệt đối không log bí mật, không đưa service role key / private key vào client bundle, không yêu cầu người dùng dán seed phrase hay private key vào chat.
   - Backend và indexer không lưu trữ hay quản lý private key để ký thay người dùng onchain.
4. **Kiểm thử & Tính trung thực:**
   - Chạy các lệnh kiểm tra thực tế phù hợp với chặng (test, lint, typecheck, validation script).
   - Tự sửa các lỗi do mình tạo ra trong phạm vi phụ trách.
   - Tuyệt đối không sửa test assertion để che giấu lỗi; không bao giờ báo `PASS` cho lệnh chưa chạy thực tế.
   - Trở ngại về thông tin xác thực (credentials/RPC) chỉ chặn phần cần credentials; vẫn phải hoàn thành toàn bộ phần logic cục bộ có thể làm.
5. **Bàn giao:**
   - Cập nhật `docs/PROJECT_STATE.md` và `docs/HANDOFF.md` sau khi hoàn thành chặng.
   - Báo cáo rõ ràng: những gì đã tạo/sửa, các kiểm tra đã chạy và kết quả, các điểm còn thiếu hoặc cần cấu hình trước khi sang chặng tiếp theo.

---

## 2. Các bất biến kiến trúc (Invariants) không được làm lệch

- **Một tài khoản cho mọi vai trò:** Một `userId` duy nhất đại diện cho một con người xuyên suốt mọi vai trò (thành viên, tác giả, chuyên gia, operator, admin). Ví (`walletBindingId`), gói VIP (`membershipId`), chứng nhận (`credentialId`) và vai trò (`roleAssignmentId`) là các quan hệ độc lập trỏ về cùng `userId`. Người đọc (Guest) xem nội dung public không cần đăng nhập hay kết nối ví.
- **Hai luồng đóng góp:**
  - Đề xuất điểm mới: Tạo đồng thời `placeId` (CANDIDATE) + `postId` (DISCOVERY) + `revisionId` trong một transaction; trạng thái hiển thị là `REVIEW_ONLY` trước khi được duyệt. Không sử dụng mã `contributionId`.
  - Bài về điểm đã biết: Sử dụng `placeId` có sẵn; bài viết có thể đăng `PUBLISHED` + `UNVERIFIED` sau sàng lọc cơ bản.
- **Tính bất biến của dữ liệu:** Tác giả (`authorUserId`) và địa điểm gốc của bài viết là cố định. Snapshot phiên bản nội dung (`revisions`), báo cáo bằng chứng (`submissions`), biên nhận (`receipts`) và quyết định (`decisions`) đã nộp/đóng băng là bất biến (immutable), không `UPDATE` hay `DELETE`. Phiên bản sửa đổi tạo `revisionId` mới và trỏ `parentRevisionId`, không tự động thừa hưởng nhãn kiểm định hay route nhận tip của bản cũ.
- **Kiểm định độc lập:** Review gắn chặt với cặp `(revisionId, scopeClaimIds)`. Tuyệt đối không tự kiểm định bài viết của chính mình; không coi hai tài khoản của cùng một người là độc lập. Thiếu chuyên gia độc lập thì giữ trạng thái `WAITING_CAPACITY`.
- **Ba quyết định độc lập:**
  1. Đánh giá chất lượng thực hiện công việc của chuyên gia (`acceptanceId` -> `payableId`).
  2. Kết luận tính chính xác của nội dung bài viết (`decisionId`).
  3. Đối soát và xác nhận thanh toán/tiền tệ onchain/offchain.
  *Hệ quả:* Bài viết bị từ chối (`REJECTED`) nhưng chuyên gia thực hiện đúng quy trình vẫn được nghiệm thu và nhận tiền công. Không dùng một cờ "đã hoàn thành" chung cho cả ba.
- **Bốn nhánh sau duyệt tách biệt:** Khi một bài được `APPROVED`, bốn quyền lợi được kích hoạt độc lập:
  1. Nhãn kiểm tra (hiển thị trên web, không cần ví).
  2. Chứng nhận Contributor SBT (tác giả chủ động claim bằng ví đã liên kết).
  3. Author NFT (tác giả chủ động claim bằng ví đã liên kết, tối đa 1 NFT `AUTHOR_CONTRIBUTION` cho mỗi post).
  4. Route nhận tip (tác giả ký thông điệp đồng ý, operator đăng ký route onchain).
- **Quy tắc phân bổ tiền & quy đổi:**
  - Quyên góp dự án (`PROJECT`): 100% chuyển vào ví quỹ.
  - Tip bài viết (`POST_TIP`): 80% chuyển tới tác giả, 20% chuyển vào ví quỹ (`projectAmount = floor(amount / 5)`, `authorAmount = amount - projectAmount`).
  - Tiền tệ onchain tính bằng đơn vị nguyên tử (`atomic units`, kiểu số nguyên / BigInt / string), không dùng số thực JavaScript (float). Chi phí gas là riêng biệt, không trừ ngầm vào tỷ lệ chia sẻ.
- **Quy tắc VIP:** Gói VIP niêm yết 1500 USD cents (15 USD/năm), kỳ hạn 12 tháng lịch UTC tính từ thời điểm kích hoạt hoặc cộng nối tiếp kỳ hiện tại. Người dùng gia hạn chủ động, không tự động trừ tiền. Quyên góp (`DON`) không cấp VIP; VIP không cấp điểm uy tín hay quyền duyệt.
- **Idempotency & Concurrency:** Mọi mutation API phải hỗ trợ `Idempotency-Key` (phạm vi theo actor + operation + payload hash). Cùng key khác payload trả lỗi 409 Conflict. Sửa bản nháp dùng `expectedVersion`.
- **Chính sách đề xuất:** Các mã `P01–P08` và `UI-P01–UI-P06` là baseline đề xuất. Các thành phần chưa được phê duyệt chính thức sử dụng test adapter / configuration flag, không giả vờ là dịch vụ đã hoàn chỉnh.

---

## 3. Hợp đồng định danh bắt buộc (ID Contract)

1. **Lớp 1 - Business UUID:**
   - Định danh canonical là UUIDv7 do API sinh, lưu kiểu `uuid` trong PostgreSQL.
   - JSON dùng camelCase (`postId`), PostgreSQL dùng snake_case (`post_id`), nhưng giá trị UUID là duy nhất và xuyên suốt.
   - Client chỉ có temporary key cho bản nháp cục bộ chưa đồng bộ; không biến temporary key thành canonical ID.
2. **Lớp 2 - Display Code:**
   - Định dạng `PREFIX-000001` (ví dụ: `PST-000001`, `REV-000001`), tối thiểu 6 chữ số, duy nhất theo môi trường và prefix.
   - Do server cấp qua sequence/transaction an toàn; chỉ dùng để tìm kiếm ra UUID canonical một lần, không dùng display code làm Foreign Key hoặc khóa JOIN.
3. **Lớp 3 - Blockchain Key Derivation:**
   - `APP_NAMESPACE = keccak256(UTF8("VENTLORE_V1"))`
   - `entityKey(kind, uuid) = keccak256(abi.encode(APP_NAMESPACE, kind, bytes16(uuid)))`
   - Kiểu ABI: `(bytes32, string, bytes16)`. UUID chuyển thành 16 bytes nhị phân thực tế (không hash chuỗi text có dấu gạch ngang, không dùng SHA3-256, không dùng abi.encodePacked).
   - 10 giá trị `kind` cố định theo registry CSV:
     `post`, `revision`, `claim`, `route`, `donation-request`, `payable`, `credential`, `collectible`, `region`, `reason`.
   - `RECEIPT_DOMAIN = keccak256(UTF8("VENTLORE_RECEIPT_V1"))`
   - `receiptKey = keccak256(abi.encode(RECEIPT_DOMAIN, chainId, splitterAddress, donorAddress, requestKey))`
     với kiểu ABI: `(bytes32, uint256, address, address, bytes32)`.
   - Token ID onchain:
     - Author NFT `tokenId = uint256(collectibleKey)`
     - Contributor SBT `tokenId = uint256(credentialKey)`
   - Tuyệt đối không tạo `userKey` public onchain từ mạng xã hội; không suy ngược UUID từ hash.

---

## 4. Danh mục tài liệu tham chiếu

- [PROJECT_STATE.md](file:///Users/johnlebin/Downloads/Ventlore/docs/PROJECT_STATE.md) - Trạng thái hiện tại của dự án.
- [HANDOFF.md](file:///Users/johnlebin/Downloads/Ventlore/docs/HANDOFF.md) - Bàn giao giữa các chặng.
- [DECISIONS.md](file:///Users/johnlebin/Downloads/Ventlore/docs/DECISIONS.md) - Các quyết định kiến trúc (ADR).
- [OPEN_QUESTIONS.md](file:///Users/johnlebin/Downloads/Ventlore/docs/OPEN_QUESTIONS.md) - Các chính sách và câu hỏi đang mở.
- [DOMAIN_RULES.md](file:///Users/johnlebin/Downloads/Ventlore/docs/DOMAIN_RULES.md) - Đặc tả nghiệp vụ chi tiết F01–F10.
- [ID_CONTRACT.md](file:///Users/johnlebin/Downloads/Ventlore/docs/ID_CONTRACT.md) - Hợp đồng định danh, 34 loại ID và công thức băm.
- [STATE_MACHINES.md](file:///Users/johnlebin/Downloads/Ventlore/docs/STATE_MACHINES.md) - Máy trạng thái tách biệt cho từng thực thể.
- [PERMISSIONS.md](file:///Users/johnlebin/Downloads/Ventlore/docs/PERMISSIONS.md) - Ma trận phân quyền và capabilities.
- [CHAIN_INTERFACE.md](file:///Users/johnlebin/Downloads/Ventlore/docs/CHAIN_INTERFACE.md) - Thiết kế giao diện smart contract.
- [SCREEN_COVERAGE.md](file:///Users/johnlebin/Downloads/Ventlore/docs/SCREEN_COVERAGE.md) - Ma trận bao phủ 35 màn hình S01–S35.
- [COMPONENT_COVERAGE.md](file:///Users/johnlebin/Downloads/Ventlore/docs/COMPONENT_COVERAGE.md) - Ma trận bao phủ 50 component C01–C50.
- [EVENT_COVERAGE.md](file:///Users/johnlebin/Downloads/Ventlore/docs/EVENT_COVERAGE.md) - Ma trận bao phủ 72 bước sự kiện U01-E01 đến U12-E06.
- [openapi.yaml](file:///Users/johnlebin/Downloads/Ventlore/docs/api/openapi.yaml) - Đặc tả OpenAPI 3.1 cho `/api/v1`.
