# Ventlore v0.3 · Tài Liệu Tái Thiết Kế Giao Diện (UI Redesign v2)

Tài liệu này ghi lại toàn bộ các cải tiến thị giác, bố cục và trải nghiệm người dùng (UX) được triển khai trong phiên bản v2 cho Chặng 01 (FE-01: Luồng Độc Giả & Khám Phá Công Khai).

---

## 1. Nâng Cấp Hệ Thống Thị Giác & Bảng Màu Thương Hiệu

### 1.1. Header Forest Green `#173F35` & Logo Ivory Sáng
- **Hiện trạng v1:** Header màu trắng/kem nhạt khiến logo Forest Green chìm, thiếu cá tính nhận diện thương hiệu thám hiểm thiên nhiên.
- **Nâng cấp v2:**
  - Nền Header chuyển sang màu xanh rừng sâu thẳm **Forest Green `#173F35`** (`border-b border-[#1f4e42]`).
  - Sử dụng **Logo Ivory sáng (`Ventlore_Logo_Ivory.png`)** tương phản mạnh, sắc nét và sang trọng.
  - Các liên kết điều hướng sử dụng màu ngà mờ `text-ivory/80`, khi hover chuyển sang `text-ivory bg-white/10`, và khi active có nền kính mờ `bg-white/15 text-ivory font-bold shadow-xs`.
  - Tích hợp trực tiếp **Bộ chuyển đổi ngôn ngữ (LanguageSwitcher)** với icon quả địa cầu `GlobeIcon` và tên bản ngữ của 6 quốc gia.

### 1.2. Hero Khám Phá (Hero Section) Có Chiều Sâu
- Bổ sung tài nguyên đồ họa vector phong cảnh ven biển hùng vĩ `/destinations/hero-coastal.svg` kết hợp lớp phủ gradient chiều sâu từ Forest `#173F35` sang transparent.
- Khẩu hiệu chính thức nổi bật: *"Hiểu nơi đến. Vững bước đi."*
- Bổ sung huy hiệu kiểm định độc lập và tag danh mục khám phá thực địa.

### 1.3. Thanh Tìm Kiếm 56px Chuẩn Công Thái Học
- Tăng chiều cao thanh tìm kiếm lên **56px** (`h-14` / `min-h-[56px]`), viền bo mềm `rounded-control`, focus ring màu Forest Green.
- Nút xóa từ khóa tìm kiếm nhanh khi có ký tự nhập vào.
- Tìm kiếm hỗ trợ gõ không dấu, chữ thường và chuyển đổi `d/đ` ("cat ba" khớp "Cát Bà").

---

## 2. Bố Cục Thẻ Địa Điểm Tỷ Lệ Vàng 16:10

### 2.1. Đồ Họa Cảnh Quan Độc Quyền
Mỗi địa điểm mạo hiểm được gắn hình ảnh minh họa vector sắc nét (SVG), tỷ lệ khung hình chuẩn **16:10** (`aspect-[16/10]`):
- **Vịnh Cát Cò 3 (`PLC-000001`):** `/destinations/cat-co-3.svg` (Bãi cát, vách đá granit và lối mòn ven biển).
- **Vách Đá Móng Rồng Cô Tô (`PLC-000004`):** `/destinations/co-to.svg` (Các tầng đá trầm tích uốn nếp bình minh).
- **Đỉnh Tây Côn Lĩnh (`PLC-000005`):** `/destinations/tay-con-linh.svg` (Biển mây rừng chè cổ thụ và dốc hiểm trở).
- **Hang Múa / Tam Cốc (`PLC-000002`):** `/destinations/hang-mua.svg` (Sống lưng rồng đá vôi nhìn ra dòng sông Ngô Đồng).

### 2.2. Tinh Chỉnh Thông Tin Thẻ (Card Information Architecture)
- **Loại bỏ mã kỹ thuật thô khỏi tiêu đề thẻ:** Mã `PLC-000001` được dời vào thông tin chi tiết, tiêu đề thẻ ưu tiên hiển thị Tên Địa Điểm tự nhiên và Vùng Miền.
- **Cảnh báo thực địa nổi bật:** Box cảnh báo rủi ro màu hổ phách ấm (`bg-amber/15 border-amber/30`), không dùng màu đỏ gắt gây hoảng loạn vô lý.
- **Nút hành động rõ ràng:** Bổ sung nút CTA *"Xem địa điểm"* kèm icon mũi tên chuyển động vi mô khi hover.

---

## 3. Xử Lý Chế Độ Xem Bản Đồ (Map Preview) Tránh Khung Trống

- Khi người dùng bấm chuyển sang chế độ "Bản đồ", giao diện hiển thị bản đồ địa hình minh họa vector có chiều sâu (`hero-coastal.svg`) kèm các điểm waypoint thực tế.
- Lưới tọa độ bên dưới hiển thị danh sách các trạm waypoint thực địa với tọa độ chuẩn `20.7250°N, 107.0520°E` (hoàn toàn không còn lỗi hiển thị tọa độ rỗng `(, )`).

---

## 4. Banner Cộng Đồng ("Bạn Hiểu Nơi Này?")

- Đặt tại cuối trang Khám phá: Khuyến khích thành viên và người dân địa phương gửi đề xuất điểm đến mới hoặc cập nhật thực địa.
- Nút bấm dẫn tới quy trình đóng góp mới với kiểm định độc lập.

---

## 5. Trình Đọc Báo Cáo Thực Địa (Post Reader & Markdown Rendering)

- **Markdown Semantic Renderer (`MarkdownView.tsx`):** Chuyển đổi toàn bộ cú pháp markdown thô (`###`, `##`, `**in đậm**`, `- gạch đầu dòng`) thành HTML typography tiêu chuẩn, dễ đọc, khoảng cách dòng thoáng đãng.
- **Thông báo bài viết gốc:** Đối với bài viết chưa có bản dịch sang ngôn ngữ đang chọn (`isTranslated: false`), hiển thị banner thông báo nhã nhặn: *"Bài viết này hiện chỉ có bản gốc tiếng Việt. Bản dịch cho ngôn ngữ hiện tại đang được cộng đồng thực địa cập nhật."*
- **Cam kết an toàn chuẩn mực:** Toàn bộ hệ thống tuyệt đối không sử dụng cụm từ "địa điểm an toàn tuyệt đối". Mọi trang đều có disclaimer rõ ràng về rủi ro khách quan của địa hình tự nhiên.
