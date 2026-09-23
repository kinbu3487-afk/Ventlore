# Đặc Tả Quy Tắc Nghiệp Vụ Ventlore (DOMAIN_RULES)

Tài liệu này hệ thống hóa toàn bộ các luồng nghiệp vụ cốt lõi từ `Ventlore_Logic_ID_DB_v0_3.pdf` (F01–F10), bộ sơ đồ khối `Ventlore_So_do_Khoi_v0_3.pdf` (D01–D11) và các chính sách đề xuất P01–P08.

---

## F01. Tài Khoản, Vai Trò và Liên Kết Ví (D01, D11)

1. **Một tài khoản cho mọi vai trò:**
   - Người dùng đăng nhập qua mạng xã hội (`social login`), xác thực cặp `(provider, providerSubject)` để tạo hoặc lấy `userId` duy nhất trong bảng `users`.
   - Mọi chủ thể (thành viên, tác giả `authorUserId`, chuyên gia `assigneeUserId`, người kiểm duyệt `reviewerUserId`, người ủng hộ `donorUserId`, người nhận thù lao `payeeUserId`, chủ thể chứng nhận `subjectUserId`) đều trỏ về cùng một khóa ngoại `users.user_id`.
   - Không tự động gộp hai tài khoản vì trùng tên hiển thị hoặc email; liên kết bổ sung phải qua luồng xác thực độc lập.
2. **Khách (Guest):**
   - Khách xem nội dung công khai (bài viết public, danh mục điểm đến, trang minh bạch quỹ) mà không cần đăng nhập tài khoản và không cần kết nối ví.
   - Chỉ yêu cầu đăng nhập khi thực hiện các hành động ghi dữ liệu: soạn bài, gửi đề xuất, mua gói VIP, nhận nhiệm vụ chuyên gia, hoặc tạo ý định ủng hộ trong ứng dụng.
3. **Liên kết ví (Wallet Binding):**
   - Kết nối ví trên giao diện (`connected`) chưa phải là đã xác thực (`verified`).
   - Người dùng phải ký một thông điệp thử thách chứa `nonce` dùng một lần, domain, chain context, địa chỉ ví và thời gian hết hạn (`expiry`).
   - Khi chữ ký hợp lệ, server tạo bản ghi `walletBindingId` trong bảng `wallet_bindings`.
   - Kết nối ví không làm thay đổi `userId`. Thay đổi ví tạo bản ghi binding mới, không sửa đổi lịch sử. Trong một namespace mạng, một địa chỉ ví chỉ liên kết với một user tại một thời điểm.

---

## F02. Tuyến Đóng Góp Điểm Đến Mới (D01, D02)

1. **Gửi đề xuất:**
   - Thành viên nhập tên địa điểm, vị trí địa lý, loại hoạt động, ngày trải nghiệm thực tế, điều kiện tiếp cận, rủi ro quan sát được và hình ảnh/bằng chứng.
   - Trước khi gửi, hệ thống hỗ trợ kiểm tra trùng lặp trên giao diện (`duplicate-check`). Khoảng cách địa lý gần không tự động kết luận là cùng một địa điểm.
2. **Tạo hồ sơ trong transaction:**
   - Khi người dùng gửi đề xuất hợp lệ: hệ thống tạo đồng thời địa điểm `placeId` (trạng thái `CANDIDATE`), bài viết `postId` (loại `DISCOVERY`), và phiên bản nội dung đầu tiên `revisionId` chứa snapshot dữ liệu trong một database transaction.
   - Không phát sinh mã `contributionId` song song.
3. **Quyền riêng tư trước khi duyệt:**
   - Theo chính sách P02, đề xuất điểm đến mới nằm ở trạng thái hiển thị `REVIEW_ONLY`; chỉ tác giả và người có thẩm quyền xử lý mới được xem chi tiết.
   - Tuyệt đối không bán hoặc đưa thông tin điểm đến chưa qua kiểm định vào gói VIP.
4. **Xử lý trùng lặp & Gộp địa điểm:**
   - Nếu xác định trùng với địa điểm đã có, địa điểm cũ chuyển sang trạng thái `MERGED` và trỏ `canonical_place_id` về địa điểm chuẩn; không tạo chu trình lặp. Bài viết vẫn giữ `placeId` gốc làm bằng chứng lịch sử, khi truy vấn danh mục sẽ tự động resolve về canonical place.
5. **Sau khi được duyệt:**
   - Địa điểm chuyển sang trạng thái `ACTIVE`. Dữ liệu công khai chỉ hiển thị trong phạm vi đã được duyệt, ghi rõ nguồn `revisionId`.
   - Việc công nhận "mới" chỉ có ý nghĩa là mới trong danh mục Ventlore, không xác lập quyền sở hữu địa danh hay người đầu tiên khám phá ngoài đời thực.

---

## F03. Tuyến Bài Viết Về Địa Điểm Đã Biết & Vòng Chỉnh Sửa (D01, D03)

1. **Đăng bài mới:**
   - Thành viên chọn một địa điểm đang hoạt động (`ACTIVE placeId`) -> tạo bài viết `postId` (loại `GUIDE` hoặc `EXPERIENCE`) -> soạn thảo bản nháp.
   - Khi gửi bài, hệ thống tạo bản ghi `revisionId` đóng băng bất biến kèm ngày trải nghiệm, nguồn trích dẫn và các nhận định cần kiểm định (`claims`).
   - Sau khi qua bộ lọc tự động cơ bản, bài viết được xuất bản ngay ở trạng thái `PUBLIC` + `UNVERIFIED`. Bài viết không bắt buộc phải được kiểm định ngay lập tức.
2. **Chỉnh sửa nội dung:**
   - Mã bài viết `postId` giữ nguyên xuyên suốt.
   - Mỗi lần công bố bản chỉnh sửa sẽ tạo ra một `revisionId` mới và trỏ `parentRevisionId` về phiên bản cũ. Snapshot của phiên bản cũ giữ nguyên vẹn.
   - Phiên bản mới bắt đầu ở trạng thái chưa kiểm định (`UNVERIFIED`), không tự động thừa hưởng nhãn kiểm định hay route nhận tip của phiên bản cũ.
3. **Chỉnh sửa khi đang kiểm định:**
   - Một hồ sơ kiểm định (`reviewCaseId`) luôn khóa chặt vào một `revisionId` cụ thể.
   - Nếu tác giả gửi bản sửa khi chuyên gia đang kiểm định, hệ thống không tráo đổi nội dung dưới nhiệm vụ đang giao. Operator có quyền đóng vòng cũ có lý do hoặc để chuyên gia hoàn tất nhiệm vụ hiện tại; công việc chuyên gia đã làm hợp lệ vẫn được nghiệm thu.

---

## F04. Sàng Lọc, Ưu Tiên KPI và Quản Lý Vòng Kiểm Định (D01, D03, D04)

1. **Sàng lọc tự động:**
   - Kiểm tra nội dung thiếu trường bắt buộc, rà soát spam, phát hiện trùng lặp cơ bản và loại bỏ thông tin nhạy cảm. Sàng lọc đạt không đồng nghĩa với việc cấp nhãn `VERIFIED`.
2. **Bộ tiêu chí ưu tiên KPI:**
   - Đánh giá theo 5 nhóm:
     1. *Tác động an toàn:* Mức độ rủi ro nếu thông tin sai lệch, có cảnh báo mới.
     2. *Nhu cầu sử dụng:* Lượng tìm kiếm, lượt xem, câu hỏi quan tâm.
     3. *Khoảng trống dữ liệu:* Khu vực chưa có hướng dẫn, điểm mới trong danh mục.
     4. *Độ mới:* Thời gian trải nghiệm thực địa gần đây.
     5. *Khả năng kiểm định:* Tính rõ ràng của bằng chứng, nguồn tin và phạm vi.
   - Điểm số KPI chỉ phục vụ sắp xếp thứ tự trong hàng đợi xử lý của Operator, không chứng minh bài viết là đúng sự thật. Số lượt donate, like hay mua VIP không tự động kích hoạt trạng thái `VERIFIED`.
3. **Giao việc và cam kết ngân sách:**
   - Operator mở vòng kiểm định `reviewCaseId`, khóa chặt `revisionId` và danh sách nhận định trong phạm vi kiểm tra (`scopeClaimIds`).
   - Trước khi gửi lời mời cho chuyên gia, hệ thống phải kiểm tra ngân sách quỹ và tạo bản ghi cam kết quỹ (`reservationId`). Tuyệt đối không giao việc có thù lao khi chưa giữ đủ nguồn tiền bảo đảm.
4. **Kiểm soát xung đột lợi ích:**
   - Chuyên gia không được kiểm định bài viết do chính mình viết. Không chấp nhận hai tài khoản của cùng một người để tạo sự độc lập giả tạo.
   - Nếu Operator là tác giả hoặc có xung đột, phải chuyển cho Operator khác. Nếu không có chuyên gia độc lập phù hợp, hồ sơ dừng ở trạng thái `WAITING_CAPACITY`.
5. **Bốn kết luận nội dung bài viết:**
   - `APPROVED`: Bài viết chính xác trong phạm vi kiểm tra, có thời hạn hiệu lực `validUntil`.
   - `CHANGES_REQUESTED`: Chưa đạt; chỉ rõ các nhận định cần sửa đổi hoặc bổ sung nguồn tin.
   - `INCONCLUSIVE`: Chưa đủ căn cứ thực địa để kết luận; không được hiểu là bài viết sai.
   - `REJECTED`: Thông tin sai lệch, không đạt yêu cầu.
   - Mỗi `reviewCase` có tối đa một quyết định kết thúc (`decisionId`). Quyết định đã lưu là bất biến.

---

## F05. Chuyên Gia: Giao Việc, Nộp Bằng Chứng và Nghiệm Thu (D01, D04)

1. **Tuyển dụng và giao nhiệm vụ:**
   - Tuyển từ thành viên có đóng góp chất lượng cao -> đánh giá chuyên môn theo vùng địa lý -> gửi lời mời -> chấp nhận -> cấp vai trò `roleAssignmentId` có phạm vi và thời hạn.
   - Hai loại nhiệm vụ (`taskType`):
     - `NEW_PLACE_REVIEW`: Kiểm định đề xuất địa điểm mới.
     - `EXISTING_PLACE_POST_REVIEW`: Kiểm định bài viết mới tại địa điểm đã biết.
   - Mỗi task xác định rõ: `revisionId`, `scope`, `assigneeUserId`, mức thù lao, tài sản thanh toán, thời hạn nộp (`deadline`), tiêu chuẩn nghiệm thu và điều khoản hủy.
2. **Quá trình thực hiện & Nộp kết quả:**
   - Chuyên gia nhận việc (`ACCEPTED`) -> bắt đầu thực hiện (`IN_PROGRESS`).
   - Nộp báo cáo kiểm định tạo bản ghi `submissionId` đóng băng bất biến kèm các bằng chứng `evidenceId`.
   - Nếu Operator yêu cầu bổ sung (`NEEDS_MORE`), hệ thống giữ nguyên `taskId` và chuyên gia nộp bản báo cáo mới (tạo `submissionId` mới theo cơ chế append-only).
   - Từ chối việc hoặc hết hạn lời mời: Đóng task cũ và giao cho chuyên gia khác bằng một `taskId` mới.
3. **Nghiệm thu độc lập:**
   - Khi chuyên gia thực hiện đúng quy trình và phạm vi đã giao, Operator thực hiện nghiệm thu công việc (`ACCEPTED_WORK`).
   - Nghiệm thu tạo đồng thời bản ghi `acceptanceId` và nghĩa vụ thanh toán `payableId` đúng một lần trong transaction.
   - **Bất biến sống còn:** Quyết định nội dung là `REJECTED` thì công việc của chuyên gia vẫn có thể được `ACCEPTED_WORK` và nhận tiền công bình thường.

---

## F06. Bốn Nhánh Quyền Lợi Độc Lập Sau Khi Duyệt (`APPROVED`) (D01, D05)

Khi bài viết nhận quyết định `APPROVED`, bốn nhánh sau được kích hoạt riêng biệt:
1. **Nhãn kiểm tra (Verification Badge):**
   - Hiển thị công khai trên giao diện web, gắn đúng phiên bản `revisionId`, phạm vi kiểm tra và ngày hết hạn `validUntil`.
   - Không yêu cầu tác giả phải có ví hay token blockchain.
2. **Chứng nhận Contributor SBT (Soulbound Token):**
   - Cấp cho tác giả có đóng góp hợp lệ đầu tiên theo chính sách P05. Duy trì tối đa 1 chứng nhận Contributor đang có hiệu lực cho mỗi người dùng.
   - Token ID: `tokenId = uint256(credentialKey)`. SBT bị khóa chuyển nhượng theo ERC-5192. Tác giả chủ động claim về ví cá nhân.
3. **Author NFT (Kỷ niệm bài viết):**
   - Cấp cho tác giả bài viết được tuyển chọn theo chính sách P06. Tối đa 1 NFT `AUTHOR_CONTRIBUTION` cho mỗi `postId`.
   - Token ID: `tokenId = uint256(collectibleKey)`. Khi bài viết có bản chỉnh sửa mới hoặc khi NFT được chuyển nhượng, không phát hành thêm NFT mới cho post đó.
4. **Route Nhận Tip (Tip Route):**
   - Điều kiện: Quyết định duyệt còn hiệu lực, bài viết không bị đặt cờ tạm dừng (hold), và ví tác giả đã ký thông điệp đồng ý (`consent`).
   - Operator gửi giao dịch đăng ký route lên smart contract Splitter. Khi giao dịch onchain hoàn tất và được indexer xác nhận, nút nhận donate cho bài viết chuyển sang trạng thái `ACTIVE`.
   - Chưa có ví hoặc claim token thất bại tuyệt đối không làm ảnh hưởng đến nhãn kiểm định trên web.

---

## F07. Quyên Góp và Kế Toán Sổ Quỹ (D01, D06, D09)

1. **Hai loại quyên góp trong cùng chức năng Donation:**
   - `PROJECT`: Quyên góp vào quỹ chung của dự án -> 100% số tiền chuyển vào ví quỹ.
   - `POST_TIP`: Ủng hộ tác giả bài viết -> 80% chuyển tới tác giả, 20% chuyển vào ví quỹ.
2. **Quy tắc làm tròn và đơn vị nguyên tử:**
   - Tính toán bằng số nguyên theo đơn vị nhỏ nhất của token (`atomic units`):
     - `projectAmount = floor(amount / 5)`
     - `authorAmount = amount - projectAmount`
   - Chuyển tiền trong `POST_TIP` là nguyên tử: Nếu chuyển tiền cho tác giả hoặc quỹ bị lỗi, toàn bộ giao dịch smart contract phải revert.
3. **Phân loại nguồn tiền quỹ:**
   - Sổ quỹ phân biệt rõ ràng 6 loại nguồn tiền theo từng loại tài sản:
     1. `OWNER_FUNDING`: Vốn ban đầu do chủ dự án cấp.
     2. `PROJECT_DONATION`: Quyên góp 100% cho dự án.
     3. `POST_TIP_SHARE`: 20% phần chia từ tip bài viết.
     4. `VIP_REVENUE`: Doanh thu từ bán gói thành viên VIP.
     5. `TASK_PAYOUT`: Khoản chi trả thù lao cho chuyên gia.
     6. `REFUND`: Khoản hoàn tiền được duyệt theo hồ sơ riêng.
   - Không được gom chung các loại token khác nhau thành một con số tổng duy nhất. Tiền chi ngoài ứng dụng vẫn phải được đối soát đầy đủ trước khi tính vào số dư khả dụng.

---

## F08. Gói Thành Viên VIP (D01, D07)

1. **Định giá & Kỳ hạn:**
   - Niêm yết 1500 USD cents (tương đương 15 USD/năm).
   - Kỳ hạn: 12 tháng lịch UTC tính từ `max(confirmedAt, currentEndsAt)`. Nếu ngày tương ứng không tồn tại ở tháng kết thúc (ví dụ ngày 29 tháng 2), lấy ngày cuối cùng của tháng đó.
   - Người dùng chủ động thanh toán khi gia hạn; hệ thống không tự động trừ tiền kỳ tiếp theo.
2. **Nguyên tắc phân định:**
   - Một giao dịch thanh toán thành công (`CONFIRMED`) chỉ cấp đúng một kỳ hạn 12 tháng.
   - Tiền quyên góp (`DON`) không bao giờ được dùng để kích hoạt gói VIP.
   - VIP là quyền đọc nội dung có thời hạn, không phải là thước đo uy tín hay cấp quyền kiểm duyệt.
3. **Bảo vệ nội dung:**
   - Server kiểm tra quyền VIP tại thời điểm người dùng truy cập; nội dung VIP không bao giờ được gửi vào HTML/DOM của khách chưa đăng ký.
   - Khi gói VIP hết hạn, tài khoản người dùng, các bài viết đóng góp và chứng nhận token vẫn được bảo toàn nguyên vẹn.

---

## F09. Báo Sai, Tạm Dừng và Khôi Phục (D01, D10)

1. **Tiếp nhận báo sai:**
   - Người dùng gửi báo cáo `reportId` gắn cụ thể với `revisionId` và nhận định `claimId`. Báo cáo không tự động chứng minh là bài viết sai.
2. **Tạm dừng hai lớp (App Hold vs Chain Block):**
   - *App Hold (`SUSPENDED`):* Operator đặt cờ tạm dừng trực tiếp trên ứng dụng ngay khi có căn cứ hợp lý; API lập tức khóa nút donate và ẩn nội dung quảng bá.
   - *Chain Block (`BLOCKED`):* Operator hoặc Admin gửi giao dịch khóa route trên smart contract; trạng thái trên web hiển thị `ONCHAIN_BLOCK_PENDING` cho đến khi giao dịch onchain được xác nhận `FINALIZED`.
3. **Khôi phục hoặc thu hồi:**
   - Việc khôi phục yêu cầu một quyết định duyệt mới hợp lệ và các cổng kiểm soát trên chain đã sẵn sàng.
   - Hết hạn kiểm tra (`EXPIRED`): Tự động ngừng nhận tip theo route cũ; không cần gửi giao dịch tốn gas nếu contract tự kiểm tra thời gian hết hạn (`block.timestamp < validUntil`).

---

## F10. Ma Trận Chữ Ký và Chi Phí Gas (D01, D09, D10)

| Bước nghiệp vụ | Chủ thể thực hiện / ký | Phương thức xác thực | Bên chịu phí gas |
|---|---|---|---|
| Đăng nhập, gửi bài, nộp task, review | User theo đúng session | Session JWT / Cookie | Không có gas |
| Xác minh liên kết ví | Chủ sở hữu ví | Ký thông điệp cá nhân (Sign Message) | Không có gas |
| Đồng ý nhận tip (`consent`) | Tác giả (`W_AUTHOR`) | Ký thông điệp EIP-712 offchain | Không có gas |
| Đăng ký route nhận tip | Operator (`W_OPS`) | Giao dịch contract `registerRoute` | Ví `W_OPS` trả gas |
| Cấp quyền nhận SBT / NFT | Operator (`W_OPS`) | Giao dịch contract `authorize` | Ví `W_OPS` trả gas |
| Tác giả claim SBT / NFT | Tác giả (`W_AUTHOR`) | Giao dịch contract `claim` | Tác giả trả gas |
| Phê duyệt token (`approve`) | Người ủng hộ (`W_DONOR`) | Giao dịch ERC-20 `approve` | `W_DONOR` trả gas |
| Gửi tiền ủng hộ (`donate`) | Người ủng hộ (`W_DONOR`) | Giao dịch contract `donate` | `W_DONOR` trả gas |
| Nhận tiền tip / thù lao | Tác giả / Chuyên gia | Nhận token tự động qua chuyển khoản | Không phải ký, không gas |
| Phê duyệt chi quỹ (`approve`) | Quản lý quỹ (`W_TREASURY`) | Giao dịch ERC-20 `approve` | `W_TREASURY` trả gas |
| Chi trả tiền công (`payTask`) | Quản lý quỹ (`W_TREASURY`) | Giao dịch contract `payTask` | `W_TREASURY` trả gas |
| Khóa route / tạm dừng khẩn cấp | Operator (`W_OPS`) | Giao dịch contract `setBlock` | `W_OPS` trả gas |
| Mở khóa / quản trị quyền / unpause | Quản trị viên (`W_ADMIN`) | Giao dịch contract `unpause` | `W_ADMIN` trả gas |
| Đọc log blockchain, đối soát | Worker daemon | Gọi RPC `eth_getLogs` / `eth_call` | Không có gas |
