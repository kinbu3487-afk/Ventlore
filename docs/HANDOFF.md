# Tài Liệu Bàn Giao (HANDOFF)

**Chặng hoàn thành gần nhất:** FE-Continue v1.2 — Hoàn thiện URL 2 chiều Account, Đa ngôn ngữ 6 locales, Chuẩn hóa an toàn & Nhãn demo, Di chuyển ReviewToolbar sang Bottom-Left, Chỉnh đốn Data Map 38 dòng  
**Nhiệm vụ tiếp theo:** Bin trực tiếp trải nghiệm và nghiệm thu cục bộ trên `http://localhost:3000`; Chốt các quyết định kỹ thuật trong `docs/FE_DATA_MAP.md` trước khi bàn giao Backend  
**Thời điểm bàn giao:** 26/09/2026 16:30 UTC+7  
**Tài liệu kèm theo:** `docs/FE_QA.md`, `docs/FE_DATA_MAP.md`, `docs/FE_COVERAGE.md`, `docs/FE_REVIEW.md`, `docs/FE_HANDOFF.md`, `docs/PROJECT_STATE.md`  

---

## 1. Kết quả đạt được tại Chặng FE-Continue v1.2

1. **FE-12-01 (Đồng bộ 2 chiều URL Query cho Trang Tài Khoản /account):**
   - Hỗ trợ đầy đủ 5 tab qua URL: `?tab=profile`, `?tab=contributions`, `?tab=vip`, `?tab=benefits`, `?tab=expert`.
   - Sử dụng `router.push(..., { scroll: false })` giúp lưu giữ lịch sử Back/Forward của trình duyệt để lật qua lại giữa các tab mượt mà.
   - Tự động chuẩn hóa (normalize) bằng `router.replace` khi query không hợp lệ (e.g. `?tab=xyz`) hoặc khi người dùng thường cố truy cập `?tab=expert`.
   - Giữ nguyên toàn bộ search query string trong `returnTo` khi Guest bấm đăng nhập (e.g. `/login?returnTo=/account?tab=benefits`).

2. **FE-12-02 (Đa ngôn ngữ trọn vẹn 6 Locales):**
   - Bổ sung schema và dịch 100% key parity trên cả 6 ngôn ngữ: Tiếng Việt (`vi`), English (`en`), 日本語 (`ja`), 简体中文 (`zh-Hans`), 한국어 (`ko`), Français (`fr`).
   - Bao phủ toàn diện: Trang `/account` (5 tab, hồ sơ, ví, 4 khối quyền lợi sau duyệt), `/contribute` (cả 2 tab, form fields, claims, candidate place, preview), `/vip` (nút đăng ký/gia hạn ngữ cảnh), `PaymentModal` (3 chế độ, phân bổ 80/20, lỗi sai mạng, tiến trình, màn hình thành công), thanh điều hướng Header và Footer.
   - Loại bỏ triệt để hardcoded tiếng Việt và hiện tượng fallback nhầm ngôn ngữ.

3. **FE-12-03 (Chỉnh đốn FE Data Map 38 Dòng & Trang /data-map):**
   - Loại bỏ dòng số 3 (Home Highlights thừa từ thiết kế cũ) khỏi bảng đối soát, giảm số thành phần xuống đúng **38 dòng thực tế** theo Masterboard v1.1.
   - Cập nhật dòng 1 & 2 chuẩn Single-Hero (2 CTA, 4 thẻ đóng góp).
   - Chuẩn hóa toàn bộ vòng đời ID theo ID Registry v0.3: `placeId (CANDIDATE, REVIEW_ONLY)` + `postId (DISCOVERY)` + `revisionId`; `reviewCaseId` cho phân công thẩm định; Tách bạch Quyết định 1 (`acceptanceId` -> `payableId`) và Quyết định 2 (`decisionId`).
   - Thống kê trên giao diện `/data-map` được tính động hoàn toàn theo dữ liệu mảng.
   - Đồng bộ 100% nội dung giữa `apps/web/src/lib/data-map-data.ts`, `docs/FE_DATA_MAP.md` và `apps/web/public/docs/FE_DATA_MAP.md`.

4. **FE-12-04 (Chuẩn hóa Ngữ nghĩa An toàn & Nhãn Mô phỏng Demo):**
   - Áp dụng văn bản chuẩn hoá an toàn cho đề xuất điểm mới tại `/contribute`: *"Hồ sơ được công khai sau khi xét duyệt. Kết quả kiểm định, nếu có, thể hiện rõ phạm vi, thời điểm và các cảnh báo liên quan."*
   - Xóa bỏ triệt để các cách diễn đạt mang tính cam kết chung ("xác nhận an toàn", "điểm đến an toàn").
   - Loại bỏ thuật ngữ kỹ thuật thuật toán (`floor(amount / 5)`, `UUIDv7`, `Canonical User`).
   - Dán nhãn mô phỏng rõ ràng: "Ví liên kết (Mô phỏng demo)", "Đã xác minh (Mô phỏng demo)", "Số dư khả dụng (Mô phỏng demo)".
   - Khối Author NFT ghi rõ: *Mỗi bài viết hoàn tất kiểm định chỉ được phát hành tối đa 1 Author NFT độc bản (`AUTHOR_CONTRIBUTION`)*.

5. **FE-12-05 (Di dời ReviewToolbar sang Bottom-Left tránh Netlify Badge):**
   - Cố định thanh ReviewToolbar ở góc dưới bên trái: `bottom-16 sm:bottom-4 left-3 sm:left-4`.
   - Toast thông báo neo lề trái (`left-0`), Drawer mở bung lên trên neo theo lề trái (`origin-bottom-left`).
   - Chiều rộng responsive an toàn: `w-[calc(100vw-24px)] sm:w-[440px] max-w-[440px]`.
   - Giải quyết triệt để xung đột click với badge Deploy Preview của Netlify ở góc phải dưới.

---

## 2. Danh Sách Các File Đã Chỉnh Sửa

- `apps/web/src/lib/i18n/types.ts`: Khai báo schema bản dịch cho `account`, `contribute`, `payment`, `vip`, `nav`.
- `apps/web/src/lib/i18n/locales/{vi,en,ja,zh-Hans,ko,fr}.ts`: 6 file từ điển bản địa hóa chuẩn xác 100%.
- `apps/web/src/components/AccountView.tsx`: URL query 2 chiều, Back/Forward history, đa ngôn ngữ 6 locales, loại bỏ jargon.
- `apps/web/src/components/AppShell.tsx`: URL tracking an toàn SSR, đa ngôn ngữ header/footer/dropdown, loại bỏ hardcoded.
- `apps/web/src/app/vip/page.tsx`: Nút CTA theo ngữ cảnh người dùng và đa ngôn ngữ.
- `apps/web/src/components/ContributeView.tsx`: Chuẩn hoá văn bản an toàn, đa ngôn ngữ toàn bộ form.
- `apps/web/src/components/PaymentModal.tsx`: Đa ngôn ngữ, phân bổ 80/20 rõ ràng, dán nhãn mô phỏng demo.
- `apps/web/src/components/WalletBinding.tsx`: Dán nhãn ví demo, bỏ code tick `userId`.
- `apps/web/src/components/ReviewToolbar.tsx`: Chuyển vị trí sang góc dưới bên trái `bottom-left`.
- `apps/web/src/lib/data-map-data.ts`: Xóa dòng 3, cập nhật 38 dòng chuẩn ID Registry v0.3.
- `apps/web/src/components/DataMapView.tsx`: Thống kê động, cập nhật nhãn phiên bản v1.2 (26/09/2026).
- `docs/FE_DATA_MAP.md` & `apps/web/public/docs/FE_DATA_MAP.md`: Đồng bộ bảng 38 dòng tương ứng.
- `docs/FE_QA.md`: Cập nhật bảng nghiệm thu 15 tiêu chí QA-01 đến QA-15 (100% PASS).

---

## 3. Kết Quả Kiểm Tra Kỹ Thuật

- **TypeScript Typecheck (`pnpm -r run typecheck`):** 0 lỗi (PASS 100% trên 6 packages).
- **ESLint (`pnpm -r run lint`):** 0 lỗi.
- **Production Build (`pnpm --filter @ventlore/web build`):** Biên dịch thành công **234/234 trang SSG**.
- **Foundation Validator (`validate_foundation.py`):** Đạt 34/34 thực thể, 10/10 vectors (PASS 100%).

---

## 4. Hướng Dẫn Nghiệm Thu Cục Bộ Cho Bin

```bash
# 1. Khởi động server (đã chạy sẵn hoặc chạy lại)
pnpm --filter @ventlore/web dev
```

Mở trình duyệt tại: `http://localhost:3000`

1. **ReviewToolbar:** Quan sát nút thuốc (pill) ở góc dưới bên trái màn hình. Bấm mở panel 14 scenarios thử nghiệm, click nhạy và không bị cản trở bởi Netlify badge.
2. **Account Tabs & Query:** Vào `/account`, bấm chuyển tab, quan sát URL cập nhật và bấm Back/Forward trình duyệt.
3. **Đa ngôn ngữ:** Thử chuyển sang English, 日本語, 한국어, Français và duyệt các trang `/account`, `/contribute`, `/vip`, `/data-map`.
4. **Data Map:** Vào `/data-map`, kiểm tra đủ 38 dòng, bấm tải file `.md`.
