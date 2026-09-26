# Ventlore · Báo Cáo Đảm Bảo Chất Lượng & Kiểm Thử Front-End (FE QA Report v1.2)

Tài liệu này ghi nhận kết quả chạy kiểm thử thực tế, kiểm tra giao diện phản hồi (Responsive), kiểm tra đa ngôn ngữ (6 Locales), đồng bộ dữ liệu Data Map và nghiệm thu 15 tiêu chí (QA-01 đến QA-15) được yêu cầu trong `Ventlore_Antigravity_FE_Continue_v1_2.md` ngày 26/09/2026.

---

## 1. Lệnh Kiểm Tra Thực Tế & Kết Quả (Verification Pipeline)

Toàn bộ quy trình kiểm định chất lượng được thực thi cục bộ trên repository:

```bash
# 1. Kiểm tra toàn bộ Typescript & Quy tắc ID
pnpm -r run typecheck

# 2. Kiểm tra linter Next.js & React
pnpm -r run lint

# 3. Biên dịch và xuất bản Static Site Generation (SSG)
pnpm --filter @ventlore/web build

# 4. Kiểm tra bộ dữ liệu nền tảng
python3 scripts/validate_foundation.py
```

**Kết quả ghi nhận thực tế (100% PASS):**
- **TypeScript Typecheck (`pnpm -r run typecheck`):**
  - `packages/domain`: PASS (0 errors)
  - `packages/chain`: PASS (0 errors)
  - `packages/api-client`: PASS (0 errors)
  - `packages/db`: PASS (0 errors)
  - `apps/web`: PASS (0 errors)
  - `apps/worker`: PASS (0 errors)
- **ESLint Linting (`pnpm -r run lint`):**
  - PASS (0 errors) trên toàn bộ repository.
- **Next.js Static Site Generation Build (`pnpm -r run build`):**
  - Biên dịch và prerender thành công **234/234 trang tĩnh (SSG)** bao phủ toàn bộ 6 ngôn ngữ (`vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`) mà không có bất kỳ lỗi SSG hay Suspense nào.
- **Validator Script (`validate_foundation.py`):**
  - Đạt 34/34 thực thể nghiệp vụ chuẩn hóa theo ID Registry.
  - Đạt 10/10 vector băm blockchain `entityKey` khớp tuyệt đối giữa TypeScript và Solidity contract.
  - Đạt 35/35 màn hình, 50/50 components, 72/72 sự kiện Masterboard.
  - Đạt 14/14 tài sản Brand Kit.

---

## 2. Báo Cáo Nghiệm Thu 15 Tiêu Chí Chi Tiết (QA-01 — QA-15)

| Mã QA | Nội dung kiểm tra | Kết quả | Chi tiết thực hiện |
| :--- | :--- | :--- | :--- |
| **QA-01** | Truy cập `/account?tab=contributions` trực tiếp từ URL | **PASS** | Đọc query param `tab` khi mount và kích hoạt đúng tab Đóng góp ngay khi tải trang. |
| **QA-02** | Bấm chuyển tab trên `/account` cập nhật URL & History | **PASS** | `handleTabChange` gọi `router.push(?tab=...)`; nút Back/Forward trình duyệt chuyển tab mượt mà. |
| **QA-03** | Chuẩn hóa query không hợp lệ trên `/account` | **PASS** | Query lạ (e.g. `?tab=invalid` hoặc `?tab=expert` khi chưa là expert/admin) tự động gọi `router.replace` chuẩn hóa về `profile`. |
| **QA-04** | Giữ nguyên query trong `returnTo` khi Guest đăng nhập | **PASS** | Header và AccountView lưu giữ toàn bộ search params (e.g. `/login?returnTo=/account?tab=benefits`), đăng nhập xong quay lại đúng tab. |
| **QA-05** | Đa ngôn ngữ 6 locales trên `/account` | **PASS** | 100% key parity trên 6 ngôn ngữ (`vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`) cho cả 5 tab, nhãn hồ sơ, ví và 4 khối quyền lợi. |
| **QA-06** | Đa ngôn ngữ 6 locales trên `/contribute` | **PASS** | Cả hai tab (Điểm đã biết & Đề xuất điểm mới), form trường, claims, hướng dẫn và preview đều đã được dịch trọn vẹn. |
| **QA-07** | Đa ngôn ngữ 6 locales trên `PaymentModal` | **PASS** | Toàn bộ tiêu đề modal, nhãn số tiền, phân bổ 80/20, selector mạng, thông báo lỗi mạng và màn hình thành công đều được bản địa hóa. |
| **QA-08** | Nút hành động và thông báo VIP theo ngữ cảnh | **PASS** | User thường thấy "Đăng Ký Hội Viên VIP ($15/năm)"; User VIP thấy "Gia Hạn Thêm 1 Năm ($15)" kèm ghi chú cộng dồn 365 ngày; bản dịch chuẩn 6 locales. |
| **QA-09** | Bản địa hóa Header / Navigation | **PASS** | Nút "Đóng góp", "Ủng hộ quỹ", user menu ("Tài khoản của tôi", "Đóng góp của tôi", "Quyền lợi") hiển thị đúng theo ngôn ngữ được chọn. |
| **QA-10** | Bản địa hóa Footer nút "Tải .md" | **PASS** | Thay hardcode "Tải .md" bằng `t('common.downloadMd')` trên cả 6 ngôn ngữ. |
| **QA-11** | Chuẩn hóa ngữ nghĩa an toàn cho điểm mới | **PASS** | Áp dụng văn bản chuẩn mực: *"Hồ sơ được công khai sau khi xét duyệt. Kết quả kiểm định, nếu có, thể hiện rõ phạm vi, thời điểm và các cảnh báo liên quan."* |
| **QA-12** | Loại bỏ cam kết an toàn chung & thuật ngữ kỹ thuật | **PASS** | Loại bỏ toàn bộ từ "xác nhận an toàn", "điểm đến an toàn"; thay `UUIDv7`, `Canonical User` bằng "Mã định danh", "Tài khoản cá nhân". |
| **QA-13** | Quy tắc Author NFT tối đa 1 NFT / post | **PASS** | Ghi rõ trong Tab Quyền lợi: mỗi bài viết hoàn tất kiểm định chỉ được phát hành tối đa 1 Author NFT độc bản (`AUTHOR_CONTRIBUTION`). |
| **QA-14** | Vị trí ReviewToolbar tránh che khuất | **PASS** | Di dời cố định về góc dưới bên trái (`bottom-16 sm:bottom-4 left-3 sm:left-4`), toast và drawer bung từ bên trái, không bị Netlify badge che khuất. |
| **QA-15** | Đối soát Data Map 38 dòng chuẩn Masterboard | **PASS** | Xóa bỏ dòng Home Highlights thừa; cập nhật đúng 38 dòng thực tế tại `/data-map`, `FE_DATA_MAP.md` và `data-map-data.ts`. Thống kê hiển thị động. |

---

## 3. Bảng Kiểm Tra Giao Diện Phản Hồi (Responsive Matrix v1.2)

| Kích thước | Thiết bị mẫu | Header & Navigation | ReviewToolbar (Bottom-Left) | Tab & Form (/account, /contribute) | PaymentModal |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **390px** | iPhone 13/14 | Gọn gàng, logo ivory, bottom nav chuẩn | Cách đáy 4rem (`bottom-16`), không che bottom nav | Tab cuộn ngang mượt, form co giãn 100% | Bottom sheet trượt lên, touch target >= 44px |
| **430px** | iPhone Pro Max | Căn lề 16px cân đối, không đè chữ | Neo góc trái thoáng đạt, drawer mở vừa vặn màn hình | Grid 1 cột thoáng, nhãn rõ ràng | Cân đối, nút hành động to rõ |
| **1366px** | Laptop Standard | Không vỡ hàng, user menu hiển thị gọn | Góc dưới trái cố định, không xung đột Netlify badge | 2 cột quyền lợi, 2 chiều URL sync | Pop-up modal căn giữa màn hình |
| **1440px** | Desktop Retina | Khoảng cách thoáng đạt `max-w-7xl` | Góc dưới trái tinh tế, 1-click test 14 kịch bản | Bảng điều khiển đầy đủ thông tin | Pop-up modal căn giữa màn hình |

---

## 4. Hướng Dẫn Khởi Động & Nghiệm Thu Cục Bộ Cho Bin

```bash
# Khởi động server Next.js tại cổng 3000
pnpm --filter @ventlore/web dev
```

Mở trình duyệt tại: `http://localhost:3000`

### Trọng tâm các bước nghiệm thu nhanh:
1. **Kiểm tra ReviewToolbar mới (QA-14):**
   - Quan sát thanh ReviewToolbar đã nằm ở **góc dưới bên trái**.
   - Bấm vào thanh -> panel mở bung lên trên từ góc trái (`origin-bottom-left`), click chuyển đổi vai trò và 14 kịch bản lập tức phản hồi.
2. **Kiểm tra URL Query 2 chiều trên Account (QA-01, QA-02, QA-03):**
   - Click các tab: Hồ sơ, Đóng góp, Hội viên VIP, Quyền lợi.
   - Quan sát URL tự động chuyển: `?tab=profile`, `?tab=contributions`, `?tab=vip`, `?tab=benefits`.
   - Bấm nút Back/Forward trên trình duyệt để thấy các tab lật lại tương ứng.
   - Gõ thử `?tab=xyz` trên thanh địa chỉ -> URL tự động chuẩn hóa về `profile`.
3. **Kiểm tra Đa ngôn ngữ (QA-05, QA-06, QA-07, QA-08, QA-09, QA-10):**
   - Bấm đổi ngôn ngữ sang **English, 日本語, 繁/简体, 한국어, Français**.
   - Xem trang `/account`, `/contribute`, `/vip`, `/data-map` và thanh Header/Footer: 100% dịch chuẩn, không sót nhãn tiếng Việt nào.
4. **Kiểm tra Đề xuất điểm mới & Chuẩn hóa an toàn (QA-11, QA-12, QA-13):**
   - Vào `/contribute?tab=candidate`: Đọc dòng thông báo quy chuẩn an toàn.
   - Vào `/account?tab=benefits`: Đọc mô tả Author NFT (tối đa 1 NFT / post).
5. **Kiểm tra FE Data Map (QA-15):**
   - Vào `/data-map`: Kiểm tra tổng số 38 dòng, số components tính tự động, bấm nút "Tải file FE_DATA_MAP.md (.md)" tải file 38 dòng hoàn chỉnh.
