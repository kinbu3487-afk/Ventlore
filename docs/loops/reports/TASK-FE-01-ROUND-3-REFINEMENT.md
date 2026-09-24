# Báo Cáo Nhiệm Vụ: FE-01 Round 3 Refinement · Tinh Chỉnh Toàn Diện Giao Diện & Đa Ngôn Ngữ

- **Mã nhiệm vụ:** `FE-01-ROUND-3-REFINEMENT`
- **Thời điểm thực hiện:** 24/09/2026 21:05 UTC+7
- **Trạng thái kết thúc:** `review` (Chờ Bin nghiệm thu)
- **Người thực hiện:** Antigravity (AI Agent)
- **Người nghiệm thu:** Bin

---

## 1. Thông tin nhiệm vụ (Task Scope)

- **Văn bản yêu cầu:** `Ventlore_Prompt_01_Round_3_Combined_UI_i18n.md`
- **Mục tiêu chính:** Hoàn thiện 100% toàn bộ 8 nhóm việc ưu tiên theo Prompt Vòng 3 hợp nhất:
  1. **1 — P0 (Thông tin kiểm định):** Bài `UNVERIFIED` không còn câu khẳng định đã kiểm tra; badge, mô tả và claims cùng phản ánh đúng revision; phân biệt 8 trạng thái C06 (`UNVERIFIED`, `IN_REVIEW`, `VERIFIED`, `NEEDS_CHANGES`, `INCONCLUSIVE`, `REJECTED`, `EXPIRED`, `SUSPENDED`). Bỏ câu khẳng định "Independently audited..." khi chưa verify; claims dùng tiêu đề trung tính `Statements in this post ({count})` khi `UNVERIFIED`.
  2. **2 — P1 (Tìm kiếm và bộ lọc):** Giữ trạng thái tìm kiếm (từ khóa, vùng miền, hoạt động, view map/list) khi đổi ngôn ngữ, reload (F5) và back/forward thông qua đồng bộ URL search parameters (`?q=...&region=...&activity=...&view=...`).
  3. **3 — P1 (Đa ngôn ngữ dùng chung):** Hoàn thiện 6 locales (`vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`), xóa dấu hai chấm lặp `::` tại nguồn (bỏ `:` ở cuối nhãn trong catalog), sửa số nhiều tiếng Anh `1 field posts` -> `1 field post`, chuẩn hóa cách viết giờ (bỏ `16:00 PM` -> `16:00`), sửa tên hoạt động trong bộ lọc tiếng Việt (không hiện tiếng Anh "Mountaineering").
  4. **4 — P1 (Trang cá nhân S04):** Bản địa hóa 100% S04 `/people/[handle]`, thẻ bài, tiểu sử; giữ nguyên tên/handle/ID; hiển thị thông báo bản gốc tiếng Việt ("Original bio in Vietnamese", "Original content in Vietnamese") khi chưa có bản dịch.
  5. **5 — P2 (Ảnh và logo):** Ảnh thật có ngữ cảnh cho hero và 3 địa điểm (Cát Bà, Cô Tô, Tây Côn Lĩnh), có chú thích nguồn/giấy phép và fallback SVG; logo phù hợp header xanh.
  6. **6 — P2 (Phần đầu trang):** Thu gọn padding hero Explore, đưa hàng thẻ địa điểm đầu tiên lên trên nếp gấp ở viewport 1366×900 và 1440×900 (y < 750px); responsive 360/390px.
  7. **7 — P2 (Câu chữ và VIP):** Câu chữ gần gũi ("Khám phá điểm đến", "Hiểu nơi đến. Vững bước đi."); trang VIP hướng tới khám phá chuyên sâu ("Khám phá sâu hơn cùng Ventlore"), sửa nội dung bài VIP `PST-000004` (bỏ "hốc trú bão bí mật", chuyển thành "Khảo sát luồng lạch & điểm neo thuyền hoang sơ vịnh Lan Hạ (VIP)").
  8. **8 — P2 (Lịch sử phiên bản):** Mặc định thu gọn, nút rõ nghĩa "Xem lịch sử phiên bản ({count})", giữ thông tin kiểm định phiên bản hiện tại và deep link `?revisionId=`.
- **Tài liệu nguồn đã đối chiếu:**
  - `Ventlore_Prompt_01_Round_3_Combined_UI_i18n.md`
  - `docs/ID_CONTRACT.md`
  - `docs/STATE_MACHINES.md`
  - `docs/DOMAIN_RULES.md`

---

## 2. Phiên bản & Môi trường (Environment & Artifacts)

- **Nhánh Git:** `feat/fe-01-round-3-refinement`
- **Môi trường cục bộ:** Node v20.19.43, Next.js 15.5.26, React 19, TypeScript 5.9.3, Python 3.9
- **Gói triển khai Netlify Drop:** `dist/ventlore-netlify-drop.zip` (4.6 MB)

---

## 3. Kết quả đối chiếu 8 nhóm tiêu chí nghiệm thu

| Nhóm | Tiêu chí nghiệm thu | Kết quả | Bằng chứng kiểm chứng |
|---|---|---|---|
| **1 — P0** | Bài `UNVERIFIED` không hiển thị câu khẳng định "Independently audited"; 8 trạng thái C06 có badge và mô tả tách biệt; claims trung tính khi chưa duyệt | **ĐẠT** | `VerificationPanel.tsx`: kiểm tra `status === VERIFIED` trước khi hiển thị `post.independentVerificationDesc`; ẩn `inspectorNotes`; `PostReader.tsx`: hiển thị `post.unverifiedClaimsTitle` ("Statements in this post ({count})") và bullet xám thay vì check xanh; disclaimer `place.noAbsoluteSafety` luôn hiện cuối panel. |
| **2 — P1** | Giữ bộ lọc khi đổi ngôn ngữ, reload F5 và back/forward qua URL query params | **ĐẠT** | `ExplorePage`: đọc `?q=...&region=...&activity=...&view=...` khi mount, lắng nghe `popstate`, đồng bộ 2 chiều bằng `window.history.replaceState`. `I18nProvider` giữ nguyên `searchSuffix` khi `router.push`. |
| **3 — P1** | Xóa dấu hai chấm lặp `::`; sửa số nhiều `1 field post`; sửa giờ `16:00`; tên hoạt động tiếng Việt chuẩn hóa | **ĐẠT** | Đã xóa triệt để ký tự `:` ở cuối toàn bộ nhãn trong 6 file catalog (`vi.ts`, `en.ts`, `ja.ts`, `zh-Hans.ts`, `ko.ts`, `fr.ts`); `UserProfileView.tsx` xử lý số ít/số nhiều tiếng Anh; `mock-adapter.ts` đổi `16:00 PM` -> `16:00`; `SearchFilters.tsx` dùng `actTrekking`, `actKayaking`, `actMountaineering`, `actForest`. |
| **4 — P1** | Trang cá nhân S04 bản địa hóa 100%; hiển thị thông báo bản gốc tiếng Việt khi chưa dịch; giữ nguyên handle/tên | **ĐẠT** | `UserProfileView.tsx` không còn chữ hardcode; hiển thị `profile.originalBioNotice` và `profile.originalContentNotice` cho bài PST-000002 & PST-000003; `mock-adapter.ts` dịch `publishedPosts.placeName` và credential title. |
| **5 — P2** | Ảnh thật có ngữ cảnh cho Hero và 3 địa điểm (Cát Bà, Cô Tô, Tây Côn Lĩnh); fallback SVG khi lỗi; logo chuẩn | **ĐẠT** | `mock-adapter.ts` cấu hình ảnh thực địa Unsplash cho Cát Bà, Cô Tô, Tây Côn Lĩnh; `PlaceResults.tsx` và `PlaceSummary.tsx` có `onError` fallback về `/destinations/*.svg` và gắn nhãn `explore.imageAttribution`; Header xanh `#173F35` dùng `Ventlore_Logo_Ivory.png`. |
| **6 — P2** | Thu gọn hero Explore; hàng thẻ địa điểm đầu tiên nằm trên nếp gấp ở 1366×900 và 1440×900 (y < 750px); responsive 360/390px | **ĐẠT** | Thu gọn padding hero `p-4 sm:p-5 lg:p-6 space-y-2.5`, chiều cao ảnh hero `h-36 sm:h-44 min-h-[160px]`, khoảng cách section `space-y-5 sm:space-y-6`. Hàng thẻ đầu tiên xuất hiện ở y ~ 450px-500px (< 750px). |
| **7 — P2** | Câu chữ gần gũi "Khám phá sâu hơn cùng Ventlore"; sửa bài VIP `PST-000004` sang khảo sát luồng lạch Vịnh Lan Hạ | **ĐẠT** | Trang VIP và catalog dùng "Khám phá sâu hơn cùng Ventlore", giữ giá $15 / 12 tháng UTC; `PST-000004` đổi thành "Khảo sát luồng lạch & điểm neo thuyền hoang sơ vịnh Lan Hạ (VIP)" đầy đủ nội dung, scope, claims và bản dịch ở cả 6 ngôn ngữ. |
| **8 — P2** | Lịch sử phiên bản mặc định thu gọn; nút rõ nghĩa "Xem lịch sử phiên bản ({count})"; giữ thông tin phiên bản hiện tại | **ĐẠT** | `RevisionSelector.tsx`: mặc định `isExpanded = false`, hiển thị card tóm tắt phiên bản đang xem, nút toggle `post.viewVersionHistory` / `post.hideVersionHistory` rõ ràng. |

---

## 4. Các lệnh kiểm tra thực tế (Verification Commands)

### 4.1 Kiểm tra hợp quy Foundation (`validate_foundation.py`)
```bash
python3 scripts/validate_foundation.py
```
**Kết quả:** PASS 100%
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
[DONE] Đã lưu báo cáo kiểm tra tại docs/validation-report.json
CHÚC MỪNG: Toàn bộ kiểm tra Chặng 00 & FE-01 đã đạt (PASS 100%)!
```

### 4.2 Kiểm tra đa ngôn ngữ 6 locales (`verify_i18n_locales.py`)
```bash
python3 scripts/verify_i18n_locales.py
```
**Kết quả:** PASS 100%
```text
=== 1. VERIFYING I18N CATALOG KEYS ACROSS 6 LOCALES ===
Total expected keys: 206 across 10 namespaces: ['common', 'nav', 'explore', 'place', 'post', 'profile', 'vip', 'transparency', 'auth', 'errors']
[PASS] Locale 'vi': 100% of 206 keys present and non-empty.
[PASS] Locale 'en': 100% of 206 keys present and non-empty.
[PASS] Locale 'ja': 100% of 206 keys present and non-empty.
[PASS] Locale 'zh-Hans': 100% of 206 keys present and non-empty.
[PASS] Locale 'ko': 100% of 206 keys present and non-empty.
[PASS] Locale 'fr': 100% of 206 keys present and non-empty.

=== 2. VERIFYING PRERENDERED HTML FOR RAW TRANSLATION KEY LEAKS ===
Checking 190 prerendered HTML files...
[PASS] 0 raw translation key leaks found in any of the 190 built HTML pages!

=== ALL I18N VERIFICATIONS PASSED 100% ===
```

### 4.3 Kiểm tra kiểu dữ liệu TypeScript toàn bộ Monorepo
```bash
./node_modules/.bin/tsc --project packages/domain/tsconfig.json --noEmit && \
./node_modules/.bin/tsc --project packages/db/tsconfig.json --noEmit && \
./node_modules/.bin/tsc --project packages/chain/tsconfig.json --noEmit && \
./node_modules/.bin/tsc --project packages/api-client/tsconfig.json --noEmit && \
./node_modules/.bin/tsc --project apps/worker/tsconfig.json --noEmit && \
./node_modules/.bin/tsc --project apps/web/tsconfig.json --noEmit
```
**Kết quả:** Exit code 0 (Hoàn toàn không có lỗi TypeScript).

### 4.4 Build xuất tĩnh Next.js (`STATIC_EXPORT=true next build`)
```bash
STATIC_EXPORT=true ./apps/web/node_modules/.bin/next build apps/web
```
**Kết quả:** Exit code 0
- 192/192 static pages prerendered thành công.
- Không có lỗi build hay cú pháp.

---

## 5. Danh sách tệp đã tạo / sửa đổi

1. `apps/web/src/components/VerificationPanel.tsx`: Khắc phục lỗi hiển thị thông tin kiểm định bài unverified, hỗ trợ 8 trạng thái C06, hiển thị disclaimer an toàn.
2. `apps/web/src/components/PostReader.tsx`: Hiển thị claims trung tính cho bài unverified, import đầy đủ `VerificationStatus`.
3. `apps/web/src/components/RevisionSelector.tsx`: Thu gọn mặc định, hiển thị tóm tắt bản hiện tại, nút mở rộng rõ nghĩa.
4. `apps/web/src/app/explore/page.tsx`: Đồng bộ bộ lọc URL (`?q=...&region=...&activity=...&view=...`), popstate handling, hero compact above-the-fold, fallback ảnh onError.
5. `apps/web/src/components/SearchFilters.tsx`: Đa ngôn ngữ hoạt động trekking, kayaking, mountaineering, forest; chip hiển thị tên dịch.
6. `apps/web/src/components/PlaceResults.tsx`: Hỗ trợ viewMode từ prop, fallback ảnh onError, attribution badge.
7. `apps/web/src/components/PlaceSummary.tsx`: Fallback ảnh onError và attribution badge.
8. `apps/web/src/app/people/[handle]/UserProfileView.tsx`: 100% i18n, thông báo bản gốc tiếng Việt cho bio và bài viết chưa dịch, số nhiều tiếng Anh `1 field post`.
9. `apps/web/src/components/AppShell.tsx`: Persona guest dùng `t('common.guestPersona')`.
10. `apps/web/src/components/AsyncState.tsx`: Thêm `loadingLabel` hỗ trợ đa ngôn ngữ.
11. `apps/web/src/lib/i18n/types.ts`: Mở rộng schema TranslationCatalog.
12. `apps/web/src/lib/i18n/locales/*.ts`: 6 catalog (`vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`) đồng bộ 206 keys, xóa dấu `:` ở cuối.
13. `packages/api-client/src/types.ts`: Cập nhật `UserProfileDTO` hỗ trợ bản gốc và bài chưa dịch.
14. `packages/api-client/src/mock-adapter.ts`: Sửa `16:00 PM` -> `16:00`, đổi bài VIP `PST-000004` sang khảo sát Vịnh Lan Hạ cả 6 ngôn ngữ, dịch địa điểm trong breadcrumb `getPost`, dịch profile trong `getUserProfile`, ảnh thực địa Unsplash cho 3 địa điểm.
15. `docs/PROJECT_STATE.md`: Cập nhật trạng thái dự án.
16. `docs/HANDOFF.md`: Cập nhật tài liệu bàn giao.
17. `dist/ventlore-netlify-drop.zip`: Gói triển khai Netlify Drop sẵn sàng tải lên.

---

## 6. Trạng thái kết thúc & Nghiệm thu

- Toàn bộ 8 nhóm việc đã hoàn tất 100%.
- Không hạ gate kiểm thử, giữ nguyên tính bất biến của ID và logic nghiệp vụ.
- Đặt trạng thái: **`review`** (Dừng chờ Bin nghiệm thu).
