# Báo Cáo Kiểm Thử Chặng 01 v2 (QA Report: FE-01 Multilingual UI)

**Dự án:** Ventlore Platform v0.3  
**Chặng:** FE-01 v2 · Tái Thiết Kế Giao Diện & Hoàn Thiện Đa Ngôn Ngữ  
**Ngày thực hiện:** 24/09/2026  
**Môi trường:** Production Build (Next.js 15.5.26 / Node v20 / pnpm v10)  
**Tình trạng:** **ĐẠT (PASS 100%)**

---

## 1. Tóm Tắt Kết Quả Kiểm Thử Tự Động (Automated Test Suite)

| Bộ Kiểm Tra | Lệnh Chạy Thực Tế | Kết Quả | Chi Tiết |
|---|---|---|---|
| **Foundation Validator** | `python3 scripts/validate_foundation.py` | **PASS (7/7 Checks)** | Đủ 34 thực thể, 10 keyKinds, 10 entityKeys, 35 màn hình, 50 components, 72 bước sự kiện, Brand Kit, FE-01 screens/components |
| **API Client Types** | `pnpm --filter @ventlore/api-client typecheck` | **PASS** | 0 lỗi TypeScript |
| **Web App Types** | `pnpm --filter @ventlore/web typecheck` | **PASS** | 0 lỗi TypeScript |
| **Production Build** | `pnpm --filter @ventlore/web build` | **PASS** | Tạo thành công 192 static pages cho cả 6 locales |
| **Toàn Bộ Monorepo** | `pnpm run verify` | **PASS (Exit 0)** | Chạy qua toàn bộ pipeline kiểm định cục bộ |

---

## 2. Kết Quả Kiểm Thử Chức Năng Chi Tiết (Functional QA)

### 2.1. Đa Ngôn Ngữ (6 Locales Verification)
- **`vi` (Tiếng Việt):** Hoạt động chuẩn xác làm ngôn ngữ gốc. Header, nút bấm, nhãn trạng thái và nội dung bài viết hiển thị hoàn hảo.
- **`en` (English):** Tiêu đề, khẩu hiệu ("Know where you go. Step forward with certainty."), thanh tìm kiếm, và bài viết `PST-000001` hiển thị tiếng Anh tự nhiên.
- **`ja` (日本語):** Khẩu hiệu "行く先を知り、確かな一歩を。", tiêu đề bài viết và các thuật ngữ kiểm định hiển thị chuẩn xác, không lỗi font CJK.
- **`zh-Hans` (中文（简体）):** Khẩu hiệu "知其所向，笃步前行。", tên địa điểm và bài viết dịch chuẩn chữ Hán giản thể.
- **`ko` (한국어):** Khẩu hiệu "가야 할 곳을 알고, 당당하게 내딛다.", giao diện và bài viết hiển thị chuẩn xác.
- **`fr` (Français):** Khẩu hiệu "Connaître sa destination. Avancer avec certitude.", giao diện tiếng Pháp chuẩn ngữ pháp.

### 2.2. Tìm Kiếm Không Dấu & Xử Lý Tiếng Việt ("cat ba" -> "Cát Bà")
- **Test case 1:** Nhập từ khóa `"cat ba"` -> Trả về chính xác `Vịnh Cát Cò 3 - Hải Trình Ven Đảo` và `Vịnh Cát Cò (Điểm Cũ - Đã Sáp Nhập)`.
- **Test case 2:** Nhập từ khóa `"co to"` -> Trả về chính xác `Vách Đá Móng Rồng Đảo Cô Tô`.
- **Test case 3:** Nhập từ khóa `"tay con linh"` -> Trả về chính xác `Đỉnh Tây Côn Lĩnh Hoàng Su Phì`.
- **Nút xóa tìm kiếm:** Click icon xóa từ khóa -> Ô tìm kiếm được reset tức thì và danh sách cập nhật đầy đủ.

### 2.3. Lọc Hồ Sơ Sáp Nhập (MERGED Place Filtering)
- **Mặc định:** Hồ sơ `PLC-000003` (Vịnh Cát Cò cũ - Đã sáp nhập) không đếm riêng trong danh sách mặc định để tránh phân mảnh dữ liệu.
- **Khi tìm kiếm cụ thể:** Nếu tìm kiếm `"cat ba"` hoặc `"Cát Cò"`, hồ sơ sáp nhập xuất hiện kèm nhãn trung tính `"Đã sáp nhập vào hồ sơ chính"` và banner hướng dẫn chuyển sang địa điểm chuẩn `PLC-000001`.

### 2.4. Trình Đọc Báo Cáo & Markdown Rendering
- **Kiểm tra hiển thị:** Các cú pháp `### 1. Thời điểm xuất phát...`, `**Lưu ý an toàn:**`, `- Giày leo núi...` được chuyển đổi thành HTML thẻ `<h3>`, `<strong>`, `<ul>/<li>` sạch sẽ, không còn tình trạng lộ ký tự thô.
- **Xử lý bài thiếu bản dịch:** Xem bài viết `PST-000003` (chỉ có tiếng Việt) trên các ngôn ngữ `en`, `ja`, `zh-Hans`, `ko`, `fr`: Hệ thống hiển thị nguyên văn tiếng Việt kèm nhãn fallback rõ ràng: *"Bài viết này hiện chỉ có bản gốc tiếng Việt. Bản dịch cho ngôn ngữ hiện tại đang được cộng đồng thực địa cập nhật."*
- **Cam kết an toàn:** Không có bất kỳ dòng chữ nào ghi "địa điểm an toàn tuyệt đối". Mọi trang đều kèm disclaimer về rủi ro địa hình và thời tiết.

### 2.5. Bảo Mật Lọc Nội Dung VIP (VIP Content Redaction)
- **Khi người dùng là Guest / Member thường:** Nội dung tọa độ GNSS và hốc trú bão bị loại bỏ từ cấp Adapter, thay bằng thông báo đặc quyền VIP được bản địa hóa theo đúng ngôn ngữ đang xem.
- **Khi người dùng chuyển sang VIP (`an_vip_explorer`):** Toàn bộ tọa độ chi tiết và bản đồ tiếp cận khẩn cấp mở khóa đầy đủ.
- **Giá niêm yết VIP:** Cố định **15 USD** (hoặc `$15.00` / `1500 USD cents`) ở mọi ngôn ngữ, không tự ý đổi sang VND hay JPY.

---

## 3. Kết Quả Kiểm Thử Giao Diện & Bố Cục (Visual & Layout QA)

- **Header:** Nền Forest Green `#173F35`, logo `Ventlore_Logo_Ivory.png` nổi bật, tương phản đạt chuẩn WCAG AAA.
- **Thanh tìm kiếm:** Chiều cao 56px, cân đối, icon to, trải nghiệm gõ phím mượt mà.
- **Thẻ địa điểm 16:10:** Hiển thị ảnh SVG độ phân giải cao (`cat-co-3.svg`, `co-to.svg`, `tay-con-linh.svg`, `hang-mua.svg`), loại bỏ mã thô `PLC-...` khỏi tiêu đề.
- **Bố cục 2 cột Desktop:** Cân đối giữa danh sách thẻ và khung xem trước waypoint địa hình.
- **Mobile Responsive:** Thanh điều hướng đáy (Bottom Navigation Bar) có chiều cao tối thiểu 44px đảm bảo touch target chuẩn công thái học.
