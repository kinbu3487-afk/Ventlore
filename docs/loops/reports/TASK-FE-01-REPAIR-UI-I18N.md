# Báo Cáo Nhiệm Vụ: FE-01 Repair · Khắc Phục Giao Diện & Đa Ngôn Ngữ 6 Locales

- **Mã nhiệm vụ:** `TASK-FE-01-REPAIR`
- **Thời điểm thực hiện:** 2026-09-24 19:25 UTC+7
- **Trạng thái kết thúc:** `review` (Dừng ở review chờ nghiệm thu theo đúng POLICY.md)
- **Người thực hiện:** Antigravity (AI Agent)
- **Người nghiệm thu:** Bin

---

## 1. Thông tin nhiệm vụ (Task Scope)

- **Đặc tả nhiệm vụ:** `Ventlore_Prompt_01_Repair_UI_i18n_v1.md`
- **Review URL tham chiếu:** https://deploy-preview-3--ventlore.netlify.app/explore
- **Mục tiêu chính:**
  1. **Sửa lỗi lộ raw key dịch (P0):** `common.demoNotice`, `common.role`, `explore.searchPlaceholder`, `explore.allRegions`, `explore.viewPlace`, `post.verifiedTitle`, `vip.mainTitle`.
  2. **Bản dịch 6 locales hoàn chỉnh (P0):** Dịch cả nhãn UI lẫn nội dung mock/fixture (warnings, activities, scope, inspectorNotes, claims, VIP benefits). Không lộ raw dot key.
  3. **Tái thiết kế Explore (P1):** Hero desktop 2 cột (trái nền Ivory `#F5F1E8`, phải ảnh phong cảnh); thanh tìm kiếm gọn gàng; lưới địa điểm 3 cột trên desktop rộng (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`); giảm chiều cao tổng thể để hàng địa điểm đầu tiên hiển thị ngay trên màn hình 1440x900 (above the fold); cảnh báo trên thẻ có tóm tắt + nút "Đọc đầy đủ" / "Thu gọn".
  4. **Ảnh riêng biệt theo địa điểm (P1):** Thẻ địa điểm dùng đúng ảnh riêng (`/destinations/cat-co-3.svg`, `co-to.svg`, `tay-con-linh.svg`).
  5. **Bản đồ tương tác thực tế (P1):** Tích hợp Leaflet / OpenStreetMap tương tác (zoom, pan, marker theo tọa độ, popup tên + link), desktop chia 2 cột danh sách + bản đồ, mobile chuyển tab mượt mà.
  6. **Lọc hồ sơ sáp nhập (P1):** Dùng `canonicalPlaceId`, không hiển thị `PLC-000003` thành một thẻ địa điểm độc lập khi tìm kiếm `cat ba` hay trong danh sách chính.
  7. **Trang S03 (PostReader) & S21 (VIP) (P1):** S03 cột đọc tối ưu 65-75 ký tự/dòng (`max-w-[70ch]`), accordion lịch sử phiên bản thu gọn không tràn badge; trang VIP hiển thị giá $15 (ẩn "1500 USD cents"), bỏ marketing "tọa độ khẩn cấp" / "hốc trú bão bí mật".

---

## 2. Phiên bản & Môi trường (Environment & Artifacts)

- **Nhánh Git:** `feat/fe-01-reader-flow`
- **Pull Request:** https://github.com/kinbu3487-afk/Ventlore/pull/3
- **Môi trường cục bộ:** Node v20.19.43, pnpm v10.29.3, Python 3.9+, macOS.

---

## 3. Kết quả đối chiếu tiêu chí nghiệm thu

| STT | Vấn đề / Tiêu chí | Trạng thái | Giải pháp & Chi tiết triển khai |
|---|---|---|---|
| 1 | Lỗi hiển thị dot key (`common.demoNotice`, `explore.searchPlaceholder`, ...) | **ĐÃ SỬA TRIỆT ĐỂ** | Mở rộng schema `TranslationCatalog` chuẩn 166 keys trên 9 namespaces. Nâng cấp hàm `t()` trong `context.tsx` với cơ chế fallback thông minh (tách camelCase, viết hoa) và cảnh báo console, triệt tiêu việc lộ chuỗi thô có dấu chấm. |
| 2 | Đa ngôn ngữ 6 locales (`vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`) | **ĐẠT 100%** | Dịch đầy đủ cả 6 catalog `apps/web/src/lib/i18n/locales/*.ts`. Mở rộng `mock-adapter.ts` hỗ trợ đa ngôn ngữ cho warnings, activities, scope, inspectorNotes, claims, vip benefits. |
| 3 | Hero desktop 2 cột & Above-the-fold | **ĐÃ CẢI TIẾN** | Hero Explore chia 2 cột: Cột trái nền Ivory `#F5F1E8`, text "Hiểu nơi đến. Vững bước đi.", 2 CTA button; cột phải là hình ảnh phong cảnh tỉ lệ 4:3. Chiều cao tối ưu để hàng thẻ địa điểm đầu tiên hiển thị ngay trên màn hình 1440x900. |
| 4 | Ảnh thẻ địa điểm bị lặp ảnh mặc định | **ĐÃ SỬA TRIỆT ĐỂ** | Sửa mapping trong `mock-adapter.ts`: gán đúng `coverImageUrl` (Cát Cò 3: `/destinations/cat-co-3.svg`, Cô Tô: `/destinations/co-to.svg`, Tây Côn Lĩnh: `/destinations/tay-con-linh.svg`). |
| 5 | Bản đồ Leaflet tương tác | **ĐÃ TÍCH HỢP** | Tạo `apps/web/src/components/PlaceMap.tsx` dùng Leaflet + OpenStreetMap client-side dynamic loading. Marker Pine Pin tùy biến theo tọa độ, popup liên kết chi tiết, graceful fallback nếu mạng offline. |
| 6 | Hồ sơ sáp nhập `PLC-000003` xuất hiện khi tìm kiếm | **ĐÃ SỬA TRIỆT ĐỂ** | Cập nhật bộ lọc `listPlaces` trong `mock-adapter.ts` luôn loại bỏ trạng thái `MERGED` khỏi danh sách khám phá trừ khi cờ `includeMerged=true` được bật tường minh. |
| 7 | Cảnh báo trên thẻ địa điểm quá dài | **ĐÃ CẢI TIẾN** | Thêm nút chuyển đổi "Đọc đầy đủ" / "Thu gọn" cho khối cảnh báo trên mỗi thẻ địa điểm. |
| 8 | Trang S03 (PostReader) | **ĐÃ CẢI TIẾN** | Cột bài đọc co về `max-w-[70ch]` tối ưu cho đọc văn bản, accordion phiên bản thu gọn không tràn badge trên màn hình hẹp, collapsible cho "Thông tin kỹ thuật phiên bản". |
| 9 | Trang S21 (VIP) | **ĐÃ CẢI TIẾN** | Ẩn số cent thô ("1500 USD cents"), hiển thị `$15 / 12 tháng`, bản dịch chuẩn 6 thứ tiếng, loại bỏ hoàn toàn các câu marketing không đúng đặc tả ("tọa độ khẩn cấp", "hốc trú bão bí mật"). |

---

## 4. Các lệnh kiểm tra thực tế (Verification Commands)

### 4.1 Lệnh kiểm tra bản dịch tự động (`verify_i18n_locales.py`)
- **Lệnh:** `python3 scripts/verify_i18n_locales.py`
- **Kết quả:** **PASS 100% (0 errors)**
```text
=== KIỂM TRA ĐA NGÔN NGỮ 6 LOCALES TRÊN VENTLORE ===
[PASS] Catalog vi: đủ 166/166 khóa dịch
[PASS] Catalog en: đủ 166/166 khóa dịch
[PASS] Catalog ja: đủ 166/166 khóa dịch
[PASS] Catalog zh-Hans: đủ 166/166 khóa dịch
[PASS] Catalog ko: đủ 166/166 khóa dịch
[PASS] Catalog fr: đủ 166/166 khóa dịch
-> Tổng số khóa dịch mỗi ngôn ngữ: 166
-> Toàn bộ 6 ngôn ngữ đều đồng nhất 100% cấu trúc schema!

[PASS] Đã kiểm tra 126 tệp HTML prerendered: 0 lỗi lộ mã raw dot key!
```

### 4.2 Lệnh kiểm tra nền tảng (`validate_foundation.py`)
- **Lệnh:** `python3 scripts/validate_foundation.py`
- **Kết quả:** **PASS 100%** (7/7 checks)

### 4.3 Lệnh build Next.js
- **Lệnh:** `pnpm --filter @ventlore/web build`
- **Kết quả:** **PASS (Exit 0)** - Sinh thành công 192 static pages cho 6 ngôn ngữ.
