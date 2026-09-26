# Ventlore · Hướng Dẫn Nghiệm Thu Trực Tiếp Dành Cho Bin (FE Review Guide)

Tài liệu này hướng dẫn chi tiết cách khởi động ứng dụng Front-End cục bộ, sử dụng thanh điều khiển **Review Toolbar**, chuyển đổi 5 nhóm vai trò (Personas) và trải nghiệm 14 kịch bản nghiệm thu thực tế mà không cần khởi chạy Backend hoặc Database thật.

---

## 1. Lệnh Khởi Động Ứng Dụng Xem Trước (Local Preview)

Mở Terminal tại thư mục gốc repository `Ventlore` và chạy lệnh:

```bash
# 1. Kiểm tra toàn bộ mã nguồn (Kiểm thử, Typescript, ESLint, Static Build)
pnpm run verify

# 2. Khởi động máy chủ phát triển cục bộ
pnpm --filter @ventlore/web dev
```

Mở trình duyệt truy cập: **`http://localhost:3000/vi/`** (hoặc `http://localhost:3000/en/`).

---

## 2. Công Cụ Trợ Giúp Nghiệm Thu: Review Toolbar

Ở góc dưới bên phải màn hình (Bottom-Right), bạn sẽ thấy nút nổi:
**`Review Toolbar (14 Scenarios) [PERSONA]`**

Khi bấm mở, bảng điều khiển cung cấp:
1. **Chuyển nhanh Persona:** `guest`, `author` (Minh), `vip` (Lan), `expert` (Hoàng), `admin` (Linh).
2. **Danh sách 14 Kịch bản:** Bấm vào từng kịch bản sẽ tự động chuyển persona phù hợp và điều hướng thẳng đến màn hình cần kiểm tra, kèm hướng dẫn ngắn gọn.
3. **Lối tắt nhanh:** Nút mở nhanh `PaymentModal` và `Vào Dashboard Cá nhân`.

---

## 3. Hướng Dẫn Từng Kịch Bản Nghiệm Thu (14 Scenarios)

### Kịch bản 1: Người đọc mới (Read Journeys)
- **Persona:** `guest`
- **Mục tiêu:** Trải nghiệm đọc công khai từ Home $\to$ Khám phá $\to$ Địa điểm $\to$ Đọc bài $\to$ Lịch sử revision $\to$ Trang cá nhân tác giả.
- **Thao tác:** Bấm Scenario #1 trên thanh công cụ. Thử đổi ngôn ngữ (VI $\leftrightarrow$ EN $\leftrightarrow$ JA), đổi bộ lọc vùng tại Explore, bấm vào bài viết Cô Tô để xem nội dung Markdown và danh sách nhận định (claims). Không có bất kỳ rào cản kết nối ví nào!

### Kịch bản 2: Không có dữ liệu & Trạng thái lỗi (Empty / Error States)
- **Persona:** `guest`
- **Mục tiêu:** Kiểm tra cách ứng dụng phản hồi khi người dùng tìm kiếm chuỗi không tồn tại.
- **Thao tác:** Bấm Scenario #2. Màn hình Explore hiển thị hộp thông báo rỗng thân thiện: "Không tìm thấy địa điểm nào khớp với tiêu chí", kèm nút "Xóa tất cả bộ lọc" để quay lại danh sách đầy đủ.

### Kịch bản 3: Đóng góp bài viết thực địa (Contribute Post)
- **Persona:** `author` (Minh Hướng Dẫn Viên)
- **Mục tiêu:** Soạn bài khảo sát điểm có sẵn, xem trước Markdown, lưu nháp cục bộ và gửi bài.
- **Thao tác:** Bấm Scenario #3. Chọn địa điểm "Vịnh Cát Cò 3", nhập tiêu đề, thêm 2 nhận định kiểm chứng, bật nút "Xem trước live" để kiểm tra định dạng chữ đậm/danh sách. Bấm "Thử nghiệm lỗi xung đột 409" để xem hộp so sánh 2 phiên bản song song. Bấm "Gửi bài viết (Demo)" $\to$ hệ thống thông báo thành công và chuyển sang "Đóng góp của tôi" ở trạng thái `PUBLISHED + UNVERIFIED`.

### Kịch bản 4: Đề xuất điểm mới & Cảnh báo trùng lặp (Duplicate Place Detector)
- **Persona:** `author`
- **Mục tiêu:** Trải nghiệm cơ chế cảnh báo trùng lặp thông minh khi người dùng tạo điểm mới.
- **Thao tác:** Bấm Scenario #4 (Tab Đề xuất điểm mới). Nhập vào ô tên địa điểm chữ: **`Cát Cò`**. Ngay lập tức một hộp cảnh báo màu cam nổi bật xuất hiện: *"CẢNH BÁO TRÙNG LẶP ĐỊA ĐIỂM TIỀM NĂNG: Hệ thống tìm thấy địa điểm có sẵn Vịnh Cát Cò 3"*. Có 2 lựa chọn: Bấm "Viết bài cho điểm đã có này" (chuyển sang Tab 1) hoặc "Tôi xác nhận đây là điểm hoàn toàn khác".

### Kịch bản 5: Ủng hộ Quỹ Ventlore (Project Donation)
- **Persona:** `guest` hoặc `member`
- **Mục tiêu:** Trải nghiệm thanh toán quyên góp 100% vào Quỹ dự án.
- **Thao tác:** Bấm Scenario #5 (hoặc bấm nút "Ủng hộ" trên Header). `PaymentModal` mở ra ở chế độ `PROJECT`: Mục tiêu "Quỹ phát triển cộng đồng Ventlore", tỷ lệ phân bổ ghi rõ "100% Quỹ phát triển". Chọn số tiền $10 hoặc $25, chọn mạng Arbitrum One, bấm "Thử thanh toán (demo)" $\to$ Giao dịch chuyển sang trạng thái pending rồi hoàn tất thành công.

### Kịch bản 6: Tip bài viết cho tác giả (80/20 Atomic Post Tip)
- **Persona:** `vip` hoặc `member`
- **Mục tiêu:** Kiểm tra công thức chia tiền nguyên tử: 80% tác giả, 20% Quỹ dự án.
- **Thao tác:** Bấm Scenario #6 $\to$ mở bài viết Vịnh Cát Cò 3. Cuộn xuống cuối bài bấm nút **"Tip tác giả"**. `PaymentModal` mở ở chế độ `POST_TIP`. Quan sát bảng phân bổ: Nhập $10 $\to$ Tác giả nhận $8.00 (80%), Quỹ nhận $2.00 (20%). Phép chia được tính bằng BigInt nguyên tử: `treasury = floor(amount/5)`, `author = amount - treasury`. Bấm thanh toán demo.

### Kịch bản 7: Đăng ký & Gia hạn Hội viên VIP (15 USD/năm)
- **Persona:** `author`
- **Mục tiêu:** Mua gói VIP và kiểm tra quyền VIP gắn với tài khoản người dùng (`userId`), không gắn với ví.
- **Thao tác:** Bấm Scenario #7 $\to$ mở trang `/vip`. Bấm "Đăng ký Hội viên VIP (15 USD/năm)". `PaymentModal` mở ở chế độ `MEMBERSHIP`. Hoàn tất thanh toán demo $\to$ tài khoản được cấp quyền VIP và trên thanh điều hướng xuất hiện huy hiệu VIP.

### Kịch bản 8: Xử lý ngoại lệ ví Web3 (Wallet Exceptions)
- **Persona:** `guest`
- **Mục tiêu:** Xem các trạng thái giả lập: chưa kết nối ví, sai mạng (Wrong Network), thiếu số dư.
- **Thao tác:** Bấm Scenario #8 $\to$ mở `PaymentModal`. Thử chuyển dropdown mạng sang mạng không được hỗ trợ (hoặc bấm Đổi mạng Sepolia $\leftrightarrow$ Arbitrum One). Hệ thống hiển thị cảnh báo trực quan trước khi cho phép xác nhận.

### Kịch bản 9: Bốn khối quyền lợi sau phê duyệt (4-Block Benefits)
- **Persona:** `author`
- **Mục tiêu:** Kiểm tra 4 quyền lợi sau khi bài được duyệt:
  1. Nhãn kiểm tra (hiển thị trên web).
  2. Huy hiệu Contributor SBT (bấm "Nhận Contributor SBT Demo" $\to$ cấp Token ID).
  3. Author NFT (bấm "Nhận Author NFT Demo" $\to$ cấp Token ID).
  4. Tuyến nhận tip onchain (bật/tắt nút đồng ý chữ ký consent 80/20).
- **Thao tác:** Bấm Scenario #9 $\to$ vào `/account?tab=benefits`. Thử nghiệm nhận SBT và NFT trực tiếp!

### Kịch bản 10: Không gian Chuyên gia Thẩm định (Expert Workspace)
- **Persona:** `expert` (Hoàng Kiểm Định Viên)
- **Mục tiêu:** Thao tác quy trình nhận việc, khảo sát từng claim và nộp bằng chứng đối chứng.
- **Thao tác:** Bấm Scenario #10 $\to$ mở `/expert`. Xem bảng nhiệm vụ: Bấm "Nhận nhiệm vụ" ở tab Offered $\to$ chuyển sang In Progress. Bấm "Nộp báo cáo thực địa", đánh giá từng claim (Đúng/Sai) và nhập kết luận an toàn. Chuyển sang tab "Công phải nhận" để xem danh sách thù lao.

### Kịch bản 11: Kịch bản Bắt buộc: Công đạt nhưng Bài không đạt
- **Persona:** `admin` (Linh Quản Trị Viên)
- **Mục tiêu:** Minh chứng tính độc lập tuyệt đối giữa **Nghiệm thu công việc của Chuyên gia** (`acceptanceId` $\to$ `payableId`) và **Kết luận nội dung bài viết** (`decisionId` $\to$ `REJECTED`).
- **Thao tác:** Bấm Scenario #11 $\to$ mở `/admin`. Bấm ngay nút nổi màu vàng: **"Chạy thử: Công Đạt (Trả tiền) & Bài Bác (REJECTED)"**. Hệ thống sẽ tự động ghi nhận Chuyên gia hoàn thành đúng quy trình $\to$ sinh công nợ thù lao 50 USDC trong mục Công phải nhận, trong khi bài viết bị gắn nhãn REJECTED!

### Kịch bản 12: Khiếu nại từ cộng đồng & Cơ chế App Hold
- **Persona:** `admin`
- **Mục tiêu:** Xem báo cáo khiếu nại trong Tiếp nhận và thử nghiệm nút bật/tắt App Hold tức thời trên ứng dụng.
- **Thao tác:** Bấm Scenario #12 $\to$ mở `/admin`. Ở tab Hồ sơ thẩm định, bấm nút "Đặt App Hold" trên một bài viết. Cờ đỏ APP HOLD bật sáng, luồng nhận tip của bài viết đó bị tạm ngừng ngay lập tức trên giao diện.

### Kịch bản 13: Xử lý bài viết hết hạn kiểm định (Expired Status)
- **Persona:** `guest`
- **Mục tiêu:** Xem bài viết Tây Côn Lĩnh có chứng nhận kiểm định đã hết hạn.
- **Thao tác:** Bấm Scenario #13 $\to$ mở bài viết Tây Côn Lĩnh. Khung kiểm định hiển thị nhãn màu xám: **HẾT HẠN KIỂM ĐỊNH**. Dữ liệu bài viết và lịch sử vẫn được lưu giữ nguyên vẹn để đối soát cộng đồng.

### Kịch bản 14: Sổ cái minh bạch & Đối soát giao dịch thời gian thực (Public Ledger)
- **Persona:** `guest`
- **Mục tiêu:** Kiểm tra sổ cái quỹ phân tách theo tài sản (USDC, ETH), các nguồn thu và bảng nhật ký giao dịch demo vừa thực hiện.
- **Thao tác:** Bấm Scenario #14 $\to$ mở `/transparency`. Cuộn xuống mục **"Nhật ký Giao dịch Thanh toán Mô phỏng"** để thấy ngay các đơn Tip, Quyên góp hoặc Mua VIP bạn vừa thử nghiệm ở các bước trước được cập nhật tự động!

---

## 4. Danh sách các Quyết định Kỹ thuật Chờ Ý kiến Của Bin

Sau khi trải nghiệm toàn bộ 14 kịch bản trên giao diện thực tế, kính đề nghị Bin xem xét và chốt các điểm sau trước khi chuyển sang chặng lập trình Backend:

1. **Giao diện Editor:** Form viết bài hiện tại đã đủ chi tiết chưa? Có cần thêm tính năng kéo-thả nhiều ảnh cùng lúc hay nhúng video tracklog không?
2. **Mức thù lao Chuyên gia:** Hiện tại mức thù lao mặc định đang để 50 USDC/task kiểm định thực địa. Có cần phân loại thù lao theo cấp độ khó của địa hình (Leo núi cao / Đảo xa / Ven biển) không?
3. **Chính sách App Hold:** Khi một bài viết bị đưa vào diện App Hold (do có tranh chấp an toàn), nội dung bài viết nên bị ẩn hoàn toàn khỏi danh sách tìm kiếm, hay vẫn hiển thị kèm biển cảnh báo màu đỏ cho người đọc?
4. **Trải nghiệm Đăng nhập:** Hệ thống hiện tách rõ quyền đọc công khai (không cần đăng nhập) và quyền đóng góp/VIP (cần tài khoản). Thiết kế này đã đạt kỳ vọng về tính cởi mở của cộng đồng chưa?
