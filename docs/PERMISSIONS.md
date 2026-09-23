# Ma Trận Phân Quyền & Vai Trò (PERMISSIONS)

Tài liệu này quy định quyền hạn, năng lực hệ thống (`capabilities`) và nguyên tắc tách biệt nghĩa vụ (Separation of Duties) theo `Ventlore_Logic_ID_DB_v0_3.pdf` (Mục 02, 10) và `Ventlore_Event_UI_Spec_v0_3.pdf` (Mục 06, UI-P03).

---

## 1. Các Vai Trò Trong Hệ Thống

Toàn bộ các vai trò được gắn với cùng một `userId` duy nhất:

| Vai trò | Cơ chế nhận diện | Phạm vi hiệu lực | Mô tả |
|---|---|---|---|
| **Guest** | Không có session | Toàn cục | Khách vãng lai, chưa đăng nhập; chỉ đọc nội dung công khai. |
| **Member** | Có session đăng nhập (`userId`) | Tài khoản cá nhân | Thành viên cơ bản; viết bài, đề xuất điểm mới, mua VIP, donate, báo sai. |
| **Author** | `userId == posts.author_user_id` | Từng bài viết cụ thể | Tác giả bài viết; sở hữu bản nháp, ký đồng ý nhận tip, claim token kỷ niệm. |
| **Expert** | `role_assignments` active theo vùng | Theo khu vực (`regionId`) và chuyên môn | Chuyên gia kiểm định thực địa; nhận/từ chối task, nộp báo cáo bằng chứng. |
| **Operator** | `role_assignments` active role=OPERATOR | Vận hành nội dung | Lọc bài, mở reviewCase, giao task, đánh giá kết quả, ra quyết định nội dung, quản lý hold. |
| **Treasury** | Quyền chi quỹ riêng biệt | Kế toán và ngân sách | Quản lý sổ quỹ, phê duyệt lệnh chi và ký giao dịch thanh toán thù lao. |
| **Admin** | `role_assignments` active role=ADMIN | Quản trị toàn hệ thống | Quản trị vai trò, unpause smart contract, cập nhật manifest triển khai. |

---

## 2. Ma Trận Phân Quyền Thao Tác (RBAC Matrix)

| Hành động nghiệp vụ | Guest | Member | Author | Expert | Operator | Treasury | Admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Xem danh mục & bài viết public | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Xem nội dung VIP | ❌ | Có gói VIP | Có gói VIP | Có gói VIP | Có gói VIP | Có gói VIP | Có gói VIP |
| Gửi đề xuất điểm đến mới (F02) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Soạn & đăng bài viết mới (F03) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Chỉnh sửa bài viết cũ | ❌ | ❌ | ✅ (chính chủ) | ❌ | ❌ | ❌ | ❌ |
| Ký liên kết ví cá nhân | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tạo ý định quyên góp (Donation) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mua / gia hạn gói VIP | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Gửi báo cáo sai lệch (Report) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mở vòng kiểm định (`reviewCase`) | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Cam kết ngân sách & Giao task | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Nhận / Từ chối nhiệm vụ | ❌ | ❌ | ❌ | ✅ (được giao) | ❌ | ❌ | ❌ |
| Nộp báo cáo bằng chứng thực địa | ❌ | ❌ | ❌ | ✅ (assignee) | ❌ | ❌ | ❌ |
| Nghiệm thu công việc (`acceptance`) | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Quyết định nội dung bài (`decision`) | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Ký thông điệp consent nhận tip | ❌ | ❌ | ✅ (tác giả bài) | ❌ | ❌ | ❌ | ❌ |
| Đăng ký tip route onchain | ❌ | ❌ | ❌ | ❌ | ✅ (có ví OPS)| ❌ | ✅ |
| Cấp quyền token (authorize onchain) | ❌ | ❌ | ❌ | ❌ | ✅ (có ví OPS)| ❌ | ✅ |
| Claim SBT / NFT của mình | ❌ | ❌ | ✅ (chủ token) | ✅ (chủ SBT) | ❌ | ❌ | ❌ |
| Đặt cờ tạm dừng app (`App Hold`) | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Ký giao dịch chặn route onchain | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Chuẩn bị lệnh chi thù lao | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Ký thanh toán thù lao (`payTask`) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (ví quỹ) | ❌ |
| Mở khóa / Unpause smart contract | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (ví ADMIN) |

---

## 3. Nguyên Tắc Tách Biệt Nghĩa Vụ (Separation of Duties)

1. **Tuyệt đối không tự kiểm định (No Self-Review):**
   - Chuyên gia không bao giờ được nhận nhiệm vụ kiểm định bài viết do chính mình làm tác giả (`assigneeUserId != authorUserId`).
   - Hai tài khoản mạng xã hội của cùng một người không được coi là hai chủ thể độc lập.
2. **Tách quyền vận hành nội dung khỏi quyền chi ngân quỹ:**
   - Vai trò `Operator` chỉ có thẩm quyền nghiệm thu công việc (`acceptanceId`) để tạo ra khoản phải trả (`payableId`).
   - Vai trò `Treasury` là bên duy nhất có quyền ký duyệt lệnh chi (`payoutId`) và thực thi giao dịch `payTask` trên blockchain. Operator không thể tự chi tiền từ quỹ.
3. **Thẩm quyền mở khóa (Unblock / Unpause):**
   - Operator có thể kích hoạt `App Hold` và ký gửi lệnh chặn khẩn cấp onchain (`BLOCKED`).
   - Tuy nhiên, việc mở lại (`UNBLOCK` hoặc `UNPAUSE`) yêu cầu quyền quản trị cao nhất của Quản trị viên (`Admin` / `W_ADMIN`) để tránh xung đột lợi ích.
4. **Kiểm tra quyền phía Server:**
   - Ẩn nút trên giao diện không thay thế cho việc kiểm tra quyền tại API.
   - Endpoint `/api/v1/me` tính toán danh sách `capabilities` thời gian thực dựa trên session, quyền hạn, phạm vi và thời hạn còn hiệu lực; mọi Route Handler của API kiểm tra lại quyền độc lập trước mỗi mutation.
