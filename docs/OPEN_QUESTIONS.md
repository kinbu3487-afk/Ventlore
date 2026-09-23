# Danh Sách Câu Hỏi & Chính Sách Mở (OPEN_QUESTIONS)

Tài liệu này ghi nhận các vấn đề chính sách nghiệp vụ và tích hợp đối tác bên ngoài chưa được chốt chung trong tài liệu nguồn. Chúng được quản lý bằng cấu hình (configuration flags) và test adapters, không giả định là quyết định cuối cùng.

---

## 1. Trạng thái các chính sách đề xuất (P01–P08)

| Mã | Nội dung đề xuất | Trạng thái hiện tại | Hướng xử lý kỹ thuật |
|---|---|---|---|
| **P01** | Khách đọc public không cần tài khoản; đăng nhập để viết/task/VIP. Quyên góp trực tiếp trên chain vẫn được ghi nhận. | Baseline đề xuất | Triển khai trong middleware/auth guard; API hỗ trợ ghi nhận biên nhận chain trực tiếp (`DIRECT_CHAIN`). |
| **P02** | Đề xuất điểm mới ở trạng thái `REVIEW_ONLY` trước duyệt. Bài tại điểm đã có đăng `UNVERIFIED` sau lọc cơ bản. | Baseline đề xuất | Ràng buộc trong database và API creation handlers; không cấp quyền xem điểm mới cho public trước duyệt. |
| **P03** | Nội dung VIP tuyển chọn từ bài đã duyệt và có sự đồng ý của tác giả (`authorConsent`). Cảnh báo rủi ro vẫn public; không khóa ngược bài đã public. | Baseline đề xuất | Bảng `vip_curations` ghi nhận sự đồng ý; filter API tách biệt phần tóm tắt công khai và hướng dẫn VIP. |
| **P04** | Một chuyên gia + một operator duyệt thông thường; rủi ro cao dùng thêm chuyên gia độc lập; thiếu người giữ `WAITING_CAPACITY`. | Baseline đề xuất | State machine của `review_cases` hỗ trợ trạng thái `WAITING_CAPACITY`; kiểm tra xung đột lợi ích ở server. |
| **P05** | Cấp SBT Contributor khi có đóng góp đầu tiên đủ điều kiện; tối đa 1 SBT active/user. Quyền chuyên gia cấp riêng. | Baseline đề xuất | Unique constraint trên backend; contract ERC-5192 có cơ chế revoke/replace khi đổi ví. |
| **P06** | NFT tác giả ghi nhận bài được duyệt; tối đa 1 NFT `AUTHOR_CONTRIBUTION` cho mỗi post. Sửa bài không mint thêm. | Baseline đề xuất | Khóa `(type, post_id)` duy nhất cả trong DB và mapping contract; tombstone khi burn/transfer. |
| **P07** | VIP 1500 USD cents, 12 tháng lịch UTC, gia hạn chủ động, không tự trừ tiền. Một payment chỉ cấp một kỳ. | Baseline đề xuất | Logic tính ngày chuẩn UTC trong domain module; lock dòng membership khi kích hoạt kỳ. |
| **P08** | Không thưởng cố định tự động cho tác giả chỉ vì bài được duyệt. Thù lao chuyên gia có hợp đồng nhiệm vụ. | Baseline đề xuất | Phân định rạch ròi ngân sách thù lao task (`reservations`) với quỹ thưởng; không tự động chi tiền ngoài hợp đồng. |

---

## 2. Các điểm mở cần quyết định trước khi vận hành thực tế

### 2.1 Cổng thanh toán gói VIP (Fiat vs Crypto)
- **Vấn đề:** Chưa chọn đối tác cổng thanh toán (ví dụ: Stripe, LemonSqueezy, hay thanh toán bằng stablecoin USDC qua smart contract).
- **Giải pháp kỹ thuật:** Xây dựng `PaymentAdapter` đa năng với mock/test adapter cho môi trường phát triển. Trạng thái mặc định là `NOT_CONFIGURED` trên production cho đến khi đối tác được tích hợp.

### 2.2 Biểu phí thù lao và thời hạn kiểm định thực địa
- **Vấn đề:** Mức thù lao cụ thể cho từng loại nhiệm vụ (`NEW_PLACE_REVIEW` và `EXISTING_PLACE_POST_REVIEW`), thời hạn hoàn thành của chuyên gia và điều khoản phạt khi quá hạn chưa được chốt.
- **Giải pháp kỹ thuật:** Đưa vào bảng cấu hình chính sách có phiên bản (`policy_versions`), không hardcode số tiền trong mã nguồn. Dữ liệu thử nghiệm được gắn nhãn `DEMO`.

### 2.3 Địa chỉ ví quỹ, Token thanh toán và Người giữ quyền onchain
- **Vấn đề:** Địa chỉ ví đa chữ ký (Safe) của Quỹ, địa chỉ ví Operator và token ERC-20 thanh toán chính thức trên Arbitrum One chưa được xác định.
- **Giải pháp kỹ thuật:** Sử dụng token thử nghiệm (`MockERC20`) trên mạng kiểm thử local Anvil và Arbitrum Sepolia; toàn bộ địa chỉ được cấu hình qua biến môi trường manifest và file `.env`.

### 2.4 Chính sách hoàn tiền và xử lý khiếu nại
- **Vấn đề:** Quỹ không thể tự động thu hồi 80% số tiền tip đã chuyển trực tiếp vào ví tác giả khi có khiếu nại hoặc bài viết bị phát hiện vi phạm sau này.
- **Giải pháp kỹ thuật:** Thiết kế hồ sơ hoàn tiền riêng (`refunds`), ghi nhận rõ trách nhiệm từng bên; không viết lại receipt blockchain gốc; tắt tính năng tự động hoàn tiền cho đến khi có quy trình duyệt hoàn chỉnh.

### 2.5 Nhà cung cấp bản đồ và dữ liệu GPS
- **Vấn đề:** Chưa ký kết dịch vụ bản đồ thương mại (như Mapbox, Google Maps).
- **Giải pháp kỹ thuật:** Thiết kế UI hỗ trợ danh sách và tìm kiếm địa lý thuần túy hoạt động độc lập trước; bản đồ là một Map Adapter tùy chọn; từ chối quyền GPS không làm gián đoạn trải nghiệm của người dùng.
