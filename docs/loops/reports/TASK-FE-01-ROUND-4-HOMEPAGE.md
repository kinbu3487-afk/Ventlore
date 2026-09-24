# Báo Cáo Nhiệm Vụ: FE-01 Round 4 — HomePage Thiên Tai & Tương Trợ, Sửa Triệt Để Bio/i18n & Điều Hướng

- **Mã nhiệm vụ:** `TASK-FE-01-ROUND-4-HOMEPAGE`
- **Thời điểm thực hiện:** 24/09/2026 23:15 UTC+7
- **Trạng thái kết thúc:** `review`
- **Người thực hiện:** Antigravity (AI Agent)
- **Người nghiệm thu:** Bin

---

## 1. Thông tin nhiệm vụ (Task Scope)

- **Mục tiêu chính:** 
  1. Thêm HomePage toàn khối thể hiện thiên tai bão lũ và sự giúp đỡ lẫn nhau dã ngoại; **bắt buộc chữ H1 và cụm thông điệp nằm chính giữa ảnh (centered)**; đầy đủ 6 sections ("Vì sao Ventlore tồn tại?", "Tầm nhìn & Sứ mệnh", "Cách Ventlore hoạt động", "Bắt đầu khám phá", "Phần đóng góp", "Minh bạch tài chính & CTA cuối").
  2. Sửa triệt để chuyển ngữ hồ sơ tác giả/chuyên gia trên cả 6 ngôn ngữ (`vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`), xóa bỏ lỗi phơi mã "vi", hiển thị tên ngôn ngữ bản địa đầy đủ; sửa lỗi 404 địa điểm Tây Côn Lĩnh (bổ sung UUID vào static params); sửa lỗi race condition khi chuyển đổi vai trò VIP demo.
  3. Cập nhật Routing & Navbar: Navbar 5 mục (Trang chủ, Khám phá, Sứ mệnh, Minh bạch, VIP); Logo trỏ về HomePage của locale hiện tại; `/` redirect về `/${targetLocale}/`; Explore rút gọn hero còn H1 và 1 câu mô tả.
- **Tài liệu nguồn đã đối chiếu:**
  - `Ventlore_Prompt_01_Round_4_HomePage_i18n.md`
  - `docs/loops/POLICY.md`, `docs/loops/RUN_TASK.md`
  - `docs/PROJECT_STATE.md`, `docs/HANDOFF.md`, `docs/ID_CONTRACT.md`

---

## 2. Phiên bản & Môi trường (Environment & Artifacts)

- **Nhánh Git:** `feat/fe-01-round-4-homepage`
- **Gói triển khai Netlify Drop:** `dist/ventlore-netlify-drop.zip` (5.5 MB)
- **Môi trường cục bộ:** Node v20+, Next.js 15.5+, TypeScript 5.7+

---

## 3. Kết quả đối chiếu tiêu chí nghiệm thu (Acceptance Criteria)

| STT | Tiêu chí nghiệm thu | Kết quả | Bằng chứng kiểm chứng |
|---|---|---|---|
| 1 | **Ảnh Hero thiên tai & tương trợ**: Bối cảnh dã ngoại sau bão lũ sạt lở, người dã ngoại chia sẻ nước/áo ấm, ánh sáng hy vọng ấm áp | **ĐẠT** | Đã tạo và đóng gói ảnh `apps/web/public/destinations/hero-storm-solidarity.jpg` (16:9, 952KB) + fallback `hero-storm-solidarity.svg` |
| 2 | **Tiêu đề H1 nằm chính giữa ảnh (centered)**: H1 đúng tuyệt đối theo từng ngôn ngữ (en: `Explore your destination`, vi: `Khám phá điểm đến của bạn`, ja: `あなたの旅先を探そう`, zh-Hans: `探索你的目的地`, ko: `나만의 여행지를 찾아보세요`, fr: `Explorez votre destination`) | **ĐẠT** | 100% căn giữa ngang trong cụm Hero của `HomePageView.tsx`; grep kiểm tra 6 file static HTML xuất ra đúng chuẩn từng từ |
| 3 | **Cụm trung tâm dưới H1**: Thông điệp phòng chống tai nạn ("có thể / can help") + mô tả thực địa + 2 CTA ("Bắt đầu khám phá" và "Tôi muốn đóng góp") + ghi chú minh họa | **ĐẠT** | Đầy đủ 100% trong `HomePageView.tsx` và 6 file catalog `locales/*.ts` |
| 4 | **Đầy đủ 6 khối HomePage bên dưới**: Vì sao Ventlore tồn tại; Tầm nhìn & Sứ mệnh (`#mission`); Cách thức hoạt động + lưu ý an toàn; 3 Card điểm đến thật từ `listPlaces`; Phần đóng góp (`#contribute`); Minh bạch & CTA cuối | **ĐẠT** | Đã triển khai đầy đủ trong `HomePageView.tsx` với responsive desktop/mobile |
| 5 | **Sửa triệt để Bio 6 ngôn ngữ & không phơi mã "vi"**: 5 demo users đều có bản dịch bio 6 thứ tiếng; khi có bio gốc thì hiển thị tên ngôn ngữ đầy đủ (Vietnamese, Tiếng Việt, ベトナム語...) | **ĐẠT** | Đã bổ sung 100% `bioTranslations` trong `packages/api-client/src/mock-adapter.ts` và map mã locale thành tên đầy đủ trong `UserProfileView.tsx` |
| 6 | **Sửa lỗi 404 Tây Côn Lĩnh (`PLC-000005`)**: Truy cập bằng UUID `018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e09` không bị 404/redirect về `/explore` | **ĐẠT** | Đã thêm UUID vào `generateStaticParams` của cả `[locale]/places/[placeId]/page.tsx` và `places/[placeId]/page.tsx`. Xuất ra 60 paths places tĩnh |
| 7 | **Sửa lỗi Persona & VIP Demo**: Chuyển persona sang An VIP Explorer cập nhật đồng bộ session, không bị paywall race condition, duy trì phiên qua localStorage | **ĐẠT** | Cập nhật `SessionContext.tsx`: `mockApiClient.setPersona(p)` được gọi đồng bộ trước khi trigger React state; lưu `ventlore_persona` vào localStorage |
| 8 | **Navbar 5 mục & Điều hướng**: Logo trỏ về `/{locale}/`; Navbar có Trang chủ, Khám phá, Sứ mệnh, Minh bạch, VIP; `/` redirect về `/${targetLocale}/` | **ĐẠT** | Cập nhật `AppShell.tsx`, `apps/web/src/app/page.tsx`, `apps/web/public/_redirects` |
| 9 | **Kiểm tra i18n & Static Export**: 255/255 keys đầy đủ 6 ngôn ngữ; 199/199 static pages export thành công 100%; 0 raw translation key leaks | **ĐẠT** | Chạy `python3 scripts/verify_i18n_locales.py` và `STATIC_EXPORT=true next build` đều exit code 0 |

---

## 4. Các lệnh kiểm tra thực tế (Verification Commands)

### 4.1 Typecheck các gói (`tsc --noEmit`)
- **apps/web**: Exit code 0
- **packages/api-client**: Exit code 0
- **packages/domain**: Exit code 0

### 4.2 Kiểm tra bộ dữ liệu nền tảng (`scripts/validate_foundation.py`)
```text
=== Ventlore v0.3 Foundation Validator ===
[PASS] ID Registry chứa đúng 34/34 thực thể nghiệp vụ
[PASS] 10/10 blockchain keyKind khớp hoàn toàn đặc tả CSV
[PASS] APP_NAMESPACE: 0xe619ce7014f9f215692488f22178a42229f4d33f21dfd416cd9e0c15fb7c74ea
[PASS] RECEIPT_DOMAIN: 0x5e5da63d4155fbd578bdaf259d9483bf32041ccd0d15b03b329d22329e194dd6
[PASS] Đã sinh và kiểm tra đầy đủ 10 vector entityKey cho TS và Solidity
[PASS] receiptKey: 0x12bad9ecdec4eaa3b30a7e4ccdf07b10c7f9ceed5be6311ca42139220e6dc50e
[PASS] SCREEN_COVERAGE.md: Đủ 35/35 mục
[PASS] COMPONENT_COVERAGE.md: Đủ 50/50 mục
[PASS] EVENT_COVERAGE.md: Đủ 72/72 mục
[PASS] Toàn bộ 11/11 tài liệu kiến trúc, hợp đồng và đặc tả tồn tại đầy đủ
[PASS] Ventlore_Brand_Kit_v0_1: Đầy đủ 14/14 tài sản (Logos, Board, Tokens, Fonts, Brief)
[PASS] FE-01: Đầy đủ 7 màn hình (S01-S05, S21, S34) và 13 components (C01-C10, C46, C49, C50)
[PASS] FE-01: Đầy đủ 6 kịch bản bắt buộc, bảo mật lọc VIP và 39 UUIDv7 canonical
CHÚC MỪNG: Toàn bộ kiểm tra Chặng 00 & FE-01 đã đạt (PASS 100%)!
```

### 4.3 Kiểm tra đa ngôn ngữ & rò rỉ khóa (`scripts/verify_i18n_locales.py`)
```text
=== 1. VERIFYING I18N CATALOG KEYS ACROSS 6 LOCALES ===
Total expected keys: 255 across 11 namespaces: ['common', 'nav', 'explore', 'place', 'post', 'profile', 'vip', 'transparency', 'auth', 'errors', 'home']
[PASS] Locale 'vi': 100% of 255 keys present and non-empty.
[PASS] Locale 'en': 100% of 255 keys present and non-empty.
[PASS] Locale 'ja': 100% of 255 keys present and non-empty.
[PASS] Locale 'zh-Hans': 100% of 255 keys present and non-empty.
[PASS] Locale 'ko': 100% of 255 keys present and non-empty.
[PASS] Locale 'fr': 100% of 255 keys present and non-empty.

=== 2. VERIFYING PRERENDERED HTML FOR RAW TRANSLATION KEY LEAKS ===
Checking 197 prerendered HTML files...
[PASS] 0 raw translation key leaks found in any of the 197 built HTML pages!
=== ALL I18N VERIFICATIONS PASSED 100% ===
```

### 4.4 Kiểm tra Static Export Next.js (`STATIC_EXPORT=true next build`)
- **Kết quả:** `Generating static pages (199/199)` thành công 100%.
- **Gói Netlify:** Đã nén tại `dist/ventlore-netlify-drop.zip` (5.5 MB).

---

## 5. Danh mục tệp thay đổi

1. `apps/web/public/destinations/hero-storm-solidarity.jpg` (Mới)
2. `apps/web/public/destinations/hero-storm-solidarity.svg` (Mới)
3. `apps/web/src/components/HomePageView.tsx` (Mới)
4. `apps/web/src/app/[locale]/page.tsx` (Sửa: Render HomePageView và generateStaticParams 6 locales)
5. `apps/web/src/app/page.tsx` (Sửa: Chuyển hướng root `/` về `/${targetLocale}/`)
6. `apps/web/public/_redirects` (Sửa: Redirect `/` về `/vi/ 302`)
7. `apps/web/src/components/AppShell.tsx` (Sửa: Navbar 5 mục, Logo trỏ về `/`, HomeIcon & TargetIcon)
8. `apps/web/src/components/Icons.tsx` (Sửa: Thêm `HomeIcon`, `TargetIcon`)
9. `apps/web/src/lib/i18n/types.ts` (Sửa: Thêm `home` namespace và `nav.home`, `nav.mission`)
10. `apps/web/src/lib/i18n/locales/*.ts` (Sửa: Cả 6 file vi, en, ja, zh-Hans, ko, fr)
11. `apps/web/src/app/[locale]/places/[placeId]/page.tsx` (Sửa: Thêm UUID Tây Côn Lĩnh)
12. `apps/web/src/app/places/[placeId]/page.tsx` (Sửa: Thêm UUID Tây Côn Lĩnh)
13. `apps/web/src/app/people/[handle]/UserProfileView.tsx` (Sửa: Map tên ngôn ngữ đầy đủ)
14. `apps/web/src/components/SessionContext.tsx` (Sửa: Đồng bộ setPersona và localStorage)
15. `packages/api-client/src/mock-adapter.ts` (Sửa: Bio 6 thứ tiếng cho 5 demo profiles)
16. `docs/PROJECT_STATE.md` (Cập nhật)
17. `docs/HANDOFF.md` (Cập nhật)

---

## 6. Kết luận & Khuyến nghị

Nhiệm vụ `TASK-FE-01-ROUND-4-HOMEPAGE` đã hoàn thành 100% các tiêu chí yêu cầu trong `Ventlore_Prompt_01_Round_4_HomePage_i18n.md`. Mã nguồn sẵn sàng để Bin nghiệm thu trước khi chuyển tiếp sang Chặng 02 (FE-02).
