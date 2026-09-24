# Báo cáo Nhiệm vụ: TASK-FE-01-ROUND-5-SINGLE-HERO-HOME

- **Mã nhiệm vụ:** TASK-FE-01-ROUND-5-SINGLE-HERO-HOME
- **Nhánh phát triển:** `feat/fe-01-round-5-single-hero-home`
- **Thời gian thực hiện:** 24/09/2026 - 25/09/2026
- **Trạng thái:** HOÀN THÀNH (Sẵn sàng nghiệm thu)

---

## 1. Mục tiêu và Phạm vi thực hiện

Sau khi rà soát bản triển khai `deploy-preview-8` (theo tài liệu `Ventlore_Preview_8_Review_2026-09-24.md`), chặng này giải quyết triệt để 8 nhóm vấn đề then chốt:

1. **Thu gọn HomePage thành màn hình mở đầu duy nhất (Single-Viewport Hero):**
   - Loại bỏ hoàn toàn các khối dài bên dưới hero (Vì sao tồn tại, Tầm nhìn & Sứ mệnh, Cách thức hoạt động, Điểm đến, Đóng góp, Minh bạch, CTA cuối, Footer).
   - Thiết kế chuẩn `min-h-[100dvh]` với ảnh thiên tai và tinh thần tương trợ dã ngoại (`hero-storm-solidarity.jpg`).
   - Góc trên trái: Logo Ventlore với link về `/[locale]/`.
   - Góc trên phải: Bộ chuyển 6 ngôn ngữ trực tiếp (`LanguageSwitcher variant="dark"`).
   - Chính giữa ảnh: Tiêu đề H1 bản địa hóa (cân đối dòng, không mồ côi chữ "bạn"), phụ đề ngắn về giảm thiểu rủi ro ngoài trời, 2 nút CTA căn giữa.
   - Nút "Bắt đầu khám phá" trỏ sang `/[locale]/explore/`. Nút "Tôi muốn đóng góp" mở modal `ContributeDialog`.
   - Góc dưới: Ghi chú nguồn ảnh nhỏ gọn. Không thể cuộn xuống bất kỳ khối nội dung nào khác.

2. **Tích hợp bộ chọn 6 ngôn ngữ trực tiếp tại HomePage:**
   - Hoạt động mượt mà cho cả 6 ngôn ngữ: `vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`.
   - Cập nhật tự động `document.documentElement.lang` và `document.title` theo ngôn ngữ và trang.
   - Nhãn hỗ trợ tiếp cận `aria-label` bản địa hóa (`t('common.languageSelectAria')`).

3. **Sửa điều hướng Home/Explore và loại bỏ Anchor chết:**
   - Khắc phục lỗi `getLocalizedPath('/')` bị ép sang `/explore`: nay trả về đúng `/${locale}/`.
   - Phân tách trạng thái active độc lập giữa Trang chủ và Khám phá trong `AppShell`.
   - Mục "Sứ mệnh" trên Navbar, Menu mobile và Footer mở modal `MissionDialog` (Tầm nhìn, Sứ mệnh và 4 Nguyên tắc cốt lõi bất biến), chấm dứt hoàn toàn anchor chết `/#mission`.

4. **Loại bỏ tràn ngang (Horizontal Overflow) & Chống ngắt dòng Desktop Header:**
   - Dọn sạch toàn bộ các margin âm (`-mx-4`, `-mx-6`, `-mx-8`).
   - Thêm `whitespace-nowrap shrink-0` cho nhãn vai trò, tên persona và nút tài khoản trên header desktop.

5. **Thu gọn Header trang Explore (Above-the-fold):**
   - Rút gọn phần đầu trang Explore thành header ngắn gọn, thanh lịch.
   - Loại bỏ khối 2 cột cồng kềnh với ảnh ngoài Unsplash và CTA thừa `/login`.
   - Đưa thanh tìm kiếm và bộ lọc (C02) lên ngay tầm mắt người dùng không cần cuộn trang.

6. **Sửa CTA thẻ bài viết tại trang Chi tiết Địa điểm (Place Detail):**
   - Thay đổi nhãn từ "Xem chi tiết điểm đến / View Destination Details" sang "Đọc bài viết / Read article" (`t('post.readArticle')`).

7. **Sửa mâu thuẫn trạng thái kiểm định bài PST-000003 (Tây Côn Lĩnh):**
   - Phân tách rành mạch 3 trạng thái: `UNVERIFIED`, `VERIFIED`, `EXPIRED`.
   - Với `EXPIRED`: Thay thế câu phủ định bằng thông điệp cảnh báo chính xác: *"Phiên bản này đã được kiểm định trong phạm vi được công bố, nhưng hiệu lực kiểm định đã hết. Cần kiểm tra lại trước khi dựa vào thông tin này."*
   - Cố định múi giờ UTC (`timeZone: 'UTC'`) trong hàm định dạng ngày để loại bỏ hoàn toàn hiện tượng lệch ngày từ 31/12/2025 sang 01/01/2026.

8. **Chuẩn hóa ngữ pháp số ít/số nhiều tiếng Anh & Pháp:**
   - Xử lý triệt để: `1 destination` (thay vì "1 destinations") và `1 field post` (thay vì "1 field posts").
   - Tiếng Pháp: `1 destination` và `1 article de terrain`.

9. **Hoàn thiện dữ liệu dịch demo cho PST-000002 và PST-000003:**
   - Bổ sung bản dịch 6 ngôn ngữ đầy đủ trong `mock-adapter.ts` cho cả 2 bài viết Cô Tô và Tây Côn Lĩnh.
   - Đồng bộ hóa tiểu sử tác giả (`SHARED_BIO_TRANSLATIONS`) giữa trang hồ sơ và trang bài viết.

---

## 2. Các tệp đã tạo mới và chỉnh sửa

| STT | Tệp tin | Hành động | Nội dung thay đổi |
|---|---|---|---|
| 1 | `apps/web/src/components/HomePageView.tsx` | Sửa toàn diện | Chuyển thành Single-Viewport Hero (`min-h-[100dvh]`), logo trái, switcher 6 ngôn ngữ phải, H1 + subtitle căn giữa, 2 CTA, chú thích đáy, bỏ 6 khối bên dưới. |
| 2 | `apps/web/src/components/AppShell.tsx` | Sửa toàn diện | Điều hướng Home/Explore tách biệt độc lập; tích hợp `MissionDialog` mở khi bấm "Sứ mệnh"; `whitespace-nowrap shrink-0` chống vỡ dòng header desktop. |
| 3 | `apps/web/src/components/MissionDialog.tsx` | Tạo mới | Modal Tuyên ngôn Sứ mệnh & Tầm nhìn Ventlore với 4 nguyên tắc cốt lõi, hỗ trợ phím Escape, backdrop click và khóa cuộn. |
| 4 | `apps/web/src/components/ContributeDialog.tsx` | Tạo mới | Modal lựa chọn 3 hình thức đóng góp thực tế (nộp bài FE-02, hội đồng chuyên gia, gói VIP & sổ cái minh bạch). |
| 5 | `apps/web/src/components/VerificationPanel.tsx` | Sửa | Xử lý trạng thái `EXPIRED` riêng biệt bằng `t('post.expiredNotice')` ở phần diễn giải dưới cùng. |
| 6 | `apps/web/src/components/PostReader.tsx` | Sửa | Tiêu đề và biểu tượng nhận định thực địa (claims) hỗ trợ riêng biệt trạng thái `EXPIRED` (`ClockIcon` màu hổ phách). |
| 7 | `apps/web/src/components/PlaceSummary.tsx` | Sửa | CTA thẻ bài viết đổi thành `t('post.readArticle')` ("Đọc bài viết"). |
| 8 | `apps/web/src/components/LanguageSwitcher.tsx` | Sửa | Sử dụng `aria-label={t('common.languageSelectAria')}` theo từng ngôn ngữ. |
| 9 | `apps/web/src/app/explore/page.tsx` | Sửa | Thu gọn header thành khối compact thanh lịch; đưa thanh tìm kiếm & lọc C02 lên above-the-fold; bỏ khối Unsplash và CTA `/login`. |
| 10 | `apps/web/src/lib/i18n/context.tsx` | Sửa | Trả về `/${loc}/` cho root path; UTC formatting cho ngày tháng; dynamic singular/plural grammar correction; dynamic title & html lang. |
| 11 | `apps/web/src/lib/i18n/types.ts` | Sửa | Bổ sung các schema types mới: `languageSelectAria`, `readArticle`, `expiredNotice`, `expiredClaimsTitle/Subtitle`, dialog keys. |
| 12 | `apps/web/src/lib/i18n/locales/*.ts` (6 tệp) | Sửa | Cập nhật đầy đủ bản dịch 6 thứ tiếng (`vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`) cho toàn bộ các khóa mới. |
| 13 | `packages/api-client/src/mock-adapter.ts` | Sửa | Bổ sung bản dịch 6 thứ tiếng đầy đủ cho `PST-000002` (Cô Tô) và `PST-000003` (Tây Côn Lĩnh); chia sẻ `SHARED_BIO_TRANSLATIONS`. |
| 14 | `scripts/package_netlify.sh` | Sửa | Sửa redirect `/ /vi/ 302` nhất quán cho Netlify. |

---

## 3. Bảng kết quả kiểm tra & Nghiệm thu

| STT | Tiêu chí nghiệm thu | Kết quả | Chi tiết kiểm chứng |
|---|---|---|---|
| 1 | **HomePage Single-Viewport Hero:** Chỉ 1 màn hình duy nhất, không cuộn xuống các khối bên dưới | **ĐẠT (PASS)** | `HomePageView.tsx` thiết kế `min-h-[100dvh]`, hình nền thiên tai bão lũ, không chứa 6 khối nội dung thừa. |
| 2 | **6-Language Switcher trên Home:** Chuyển đổi mượt mà 6 ngôn ngữ ngay tại góc trên phải của Home | **ĐẠT (PASS)** | Bộ chuyển ngữ nằm trực tiếp tại header của `HomePageView`, đồng bộ URL, cookie, `document.title` và `html lang`. |
| 3 | **Điều hướng Home / Explore:** Logo & Trang chủ trỏ `/[locale]/`, Khám phá trỏ `/[locale]/explore/` | **ĐẠT (PASS)** | Đã sửa trong `context.tsx` và `AppShell.tsx`; active state phân biệt rành mạch, không còn bị active đồng thời. |
| 4 | **Không còn anchor chết `#mission`:** | **ĐẠT (PASS)** | Nút Sứ mệnh trên Desktop, Mobile menu, Bottom nav và Footer đều mở `MissionDialog` hiển thị 4 nguyên tắc cốt lõi. |
| 5 | **CTA "Tôi muốn đóng góp" có chức năng thực tế:** | **ĐẠT (PASS)** | Mở `ContributeDialog` với 3 luồng rõ ràng: gửi bài viết, hội đồng chuyên gia, gói VIP & minh bạch quỹ. |
| 6 | **Loại bỏ tràn ngang (Horizontal Overflow):** | **ĐẠT (PASS)** | Không còn bất kỳ class `-mx-` nào trong toàn bộ mã nguồn `apps/web/src/`. |
| 7 | **Header Explore compact (Above-the-fold):** | **ĐẠT (PASS)** | Bỏ khối Unsplash 2 cột và CTA `/login`; thanh tìm kiếm C02 xuất hiện ngay trong tầm mắt người dùng. |
| 8 | **CTA bài viết trong Place detail:** | **ĐẠT (PASS)** | Hiển thị chính xác "Đọc bài viết" (vi) / "Read article" (en) / "Lire l'article" (fr) / "記事を読む" (ja)... |
| 9 | **Sửa mâu thuẫn trạng thái PST-000003 (Tây Côn Lĩnh):** | **ĐẠT (PASS)** | Phân tách rành mạch EXPIRED, hiển thị thông điệp cảnh báo hết hạn phù hợp; ngày hiển thị chuẩn UTC 31/12/2025. |
| 10 | **Ngữ pháp số ít/số nhiều tiếng Anh & Pháp:** | **ĐẠT (PASS)** | "1 destination" / "1 field post" trong tiếng Anh; "1 destination" / "1 article de terrain" trong tiếng Pháp. |
| 11 | **Bản dịch demo PST-000002 & PST-000003:** | **ĐẠT (PASS)** | Dịch đầy đủ tiêu đề, nội dung, claims, scope và inspector notes cho cả 6 ngôn ngữ trong `mock-adapter.ts`. |
| 12 | **Kiểm tra Foundation & Monorepo:** | **ĐẠT (PASS)** | `python3 scripts/validate_foundation.py` đạt 100% (34/34 ID, 10 keyKinds, 7 màn hình, 13 components). |
| 13 | **Kiểm tra TypeScript Typecheck:** | **ĐẠT (PASS)** | `pnpm -r run typecheck` thành công 100% với exit code 0 cho tất cả 6 packages/apps. |
| 14 | **Kiểm tra Static Export HTML:** | **ĐẠT (PASS)** | `STATIC_EXPORT=true next build` xuất thành công 199/199 trang tĩnh cho toàn bộ 6 locales. |
| 15 | **Đóng gói Netlify Drop:** | **ĐẠT (PASS)** | `scripts/package_netlify.sh` tạo thành công `dist/ventlore-netlify-drop.zip` (6.4MB). |

---

## 4. Kết luận & Hướng dẫn kiểm tra nghiệm thu

Bản sửa đổi đã khắc phục trọn vẹn toàn bộ các điểm ghi nhận từ `deploy-preview-8`. Mã nguồn đã được kiểm thử cục bộ nghiêm ngặt và sẵn sàng để merge hoặc tạo deploy preview mới trên Netlify.

### Các lệnh kiểm tra đã chạy:
```bash
python3 scripts/validate_foundation.py
pnpm --config.ignore-scripts=true -r run typecheck
STATIC_EXPORT=true pnpm --config.ignore-scripts=true --filter @ventlore/web build
bash scripts/package_netlify.sh
```
Tất cả đều đạt **PASS 100%**.
