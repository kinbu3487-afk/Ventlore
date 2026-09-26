# Tài Liệu Bàn Giao (HANDOFF)

**Chặng hoàn thành gần nhất:** FE-Fix v1.1 — Sửa lỗi P0 (Revision reactive & Chặn Guest mua VIP), Header/i18n, Phân lập Tab/Drafts, Phân quyền Demo & Quyền lợi tác giả  
**Nhiệm vụ tiếp theo:** Bin trực tiếp trải nghiệm và nghiệm thu cục bộ trên `http://localhost:3000`; Chốt các quyết định kỹ thuật trong `docs/FE_DATA_MAP.md` trước khi sang Backend  
**Thời điểm bàn giao:** 26/09/2026 12:00 UTC+7  
**Tài liệu kèm theo:** `docs/FE_QA.md`, `docs/FE_DATA_MAP.md`, `docs/FE_COVERAGE.md`, `docs/FE_REVIEW.md`, `docs/FE_HANDOFF.md`  

---

## 1. Kết quả đạt được tại Chặng Sửa Lỗi FE-Fix v1.1

1. **Sửa dứt điểm 2 lỗi P0:**
   - **P0-01 (Revision Switching Reactive):** Chuyển đổi giữa các phiên bản bài viết (`/posts/[postId]?revisionId=...`) tức thời, không cần tải lại trang F5 (dùng `<Suspense>` boundary và `useSearchParams()` phản ứng). Nút Tip tự động khóa đối với phiên bản chưa hoàn tất kiểm định thực địa. Bổ sung thẻ thông báo lỗi rõ ràng nếu `revisionId` không tồn tại.
   - **P0-02 (Chặn Guest Mua VIP Demo):** Khách vãng lai (Guest) tuyệt đối không thể tạo đơn hay thanh toán mua VIP demo (mở Gate yêu cầu đăng nhập tài khoản). Với Member, gia hạn giữ nguyên `membershipId` và cộng dồn 365 ngày UTC. Đã loại bỏ chuỗi mã giao dịch giả lập `txHashDemo: 0xmock...`.

2. **Hoàn thiện các hạng mục P1 & P2:**
   - **P1-01 (Bố cục Header chuẩn mực):** Bỏ persona dropdown thừa khỏi header (dùng ReviewToolbar góc phải dưới), không đè chữ ở mọi kích thước (1440px, 1366px, 430px, 390px). Tên hiển thị truncate max 130px.
   - **P1-02 (Đa ngôn ngữ 6 Locales):** Bảo toàn search query params khi đổi ngôn ngữ, dịch chuẩn toàn bộ các trạng thái và nhãn giao diện.
   - **P1-03 (Hai luồng đóng góp & Phân lập bản nháp):** Đồng bộ 2 chiều giữa URL query `?tab=existing|candidate` và giao diện. Nháp lưu riêng biệt theo người dùng và theo tab trong `localStorage` (`ventlore_draft_${userId}_${tab}`).
   - **P1-04 (Ngữ cảnh thanh toán & Quyền lợi trung thực):** Khóa chức năng đổi mode trong `PaymentModal` để tôn trọng đúng ngữ cảnh gọi (Home $\to$ PROJECT; Post $\to$ POST_TIP; VIP $\to$ MEMBERSHIP). Tài khoản có 0 bài viết được duyệt không còn hiển thị fake `OFFERED` hay nút Claim; chỉ tác giả Minh có bài duyệt mới mở 4 khối quyền lợi. Bổ sung chức năng sửa thông tin Profile demo.
   - **P1-05 (Phân quyền Demo Chuyên gia & Quản trị):** Thêm màn hình Gate giới thiệu chuyên môn khi Guest/Member vào `/expert` hoặc `/admin`, có nút chuyển vai trò 1-click hoặc đăng nhập.
   - **P1-06 (Single-Hero Trang chủ & Nâng cấp ReviewToolbar 14 Kịch bản):** Gỡ bỏ toàn bộ nhãn kỹ thuật nội bộ (Data Map 16 cột, Xem Data Map, Tải .md) khỏi Header và Hero trang chủ, giữ đúng 2 CTA trải nghiệm du lịch dã ngoại. Nâng cấp `ReviewToolbar` lên `z-[9999]`, phản hồi click tức thời 0ms kèm thông báo Toast, tự động ghi nhớ kịch bản qua `sessionStorage`, bổ sung nút Thu nhỏ thông minh (`Clear view`) và đồng bộ chuẩn xác toàn bộ 14 kịch bản (Explore, Preset Cát Cò, Admin tabs, Benefits, PaymentModal).
   - **P2 (Từ ngữ thân thiện):** Loại bỏ toàn bộ từ ngữ kỹ thuật `placeId`, `CANDIDATE`, `REVIEW_ONLY`, `UUIDv7`, `409 Conflict`, thay bằng từ ngữ gần gũi với người dùng dã ngoại.
   - **Kiểm thử toàn diện:** `pnpm run verify` đạt 100% PASS (234 trang static export). Không có lỗi typecheck hay lint.

1. **Brand System & Design Tokens:**
   - Cài đặt đầy đủ các màu sắc chuẩn Brand Guide v0.1: Forest `#173F35`, Jade `#2C7563`, Sage `#DCE8DA`, Ivory `#F5F1E8`, Waypoint `#F0A44B`, Ink `#182522`.
   - Cài đặt phông chữ nội bộ Be Vietnam Pro (400, 500, 600, 700) tại `apps/web/public/fonts/` và khai báo qua `@font-face` trong `apps/web/src/app/globals.css`.
   - Chiều cao điều khiển tối thiểu 48px, vùng chạm di động >= 44px, bo góc thẻ 16px, bo góc nút bấm 12px, focus outline `#225A91`.

2. **13 UI Components Cốt Lõi:**
   - C01 (`AppShell`): Khung điều hướng responsive (desktop header, mobile bottom nav >= 44px) tích hợp Persona Switcher.
   - C02 (`SearchFilters`): Bộ lọc từ khóa, vùng miền, hoạt động, xử lý từ chối GPS không chặn thao tác.
   - C03 (`PlaceResults`): Danh sách thẻ địa điểm kèm cảnh báo rủi ro, chuyển đổi danh sách/bản đồ với placeholder provider.
   - C04 (`PlaceSummary`): Chi tiết địa điểm, cảnh báo an toàn, hiển thị banner điều hướng với địa điểm đã sáp nhập (MERGED).
   - C05 (`PostReader`): Trình đọc bài viết gắn liền với revisionId bất biến, thông tin tác giả, claims, tỷ lệ tip 80/20, cam kết không dùng nhãn "an toàn tuyệt đối".
   - C06 (`VerificationPanel`): Bảng huy hiệu kiểm định 8 trạng thái (kèm icon và text rõ ràng), hiển thị scope claims, ngày kiểm tra và thời hạn.
   - C07 (`RevisionSelector`): Chuyển đổi giữa các phiên bản bài viết qua query param `?revisionId=`.
   - C08 (`AccessGate`): Chặn truy cập nội dung VIP hoặc yêu cầu đăng nhập, hỗ trợ chuyển persona ngay trên gate.
   - C09 (`SocialLogin`): Luồng đăng nhập demo với xác thực allowlist URL chuyển hướng cùng origin.
   - C10 (`WalletBinding`): Mô phỏng trạng thái ví Web3 (chưa liên kết, đã kết nối, đã xác thực).
   - C46 (`AsyncState`): Xử lý trạng thái tải dữ liệu, rỗng, lỗi 401–429, timeout, offline. Số dư chưa tải hiển thị skeleton thay vì hiển thị 0.
   - C49 (`PermissionGate`): Kiểm soát hiển thị tính năng dựa trên capability của session người dùng.
   - C50 (`PublicLedger`): Sổ cái công khai số dư khả dụng/cam kết/đã chi, cơ cấu nguồn thu và giải ngân minh bạch.

3. **7 Màn hình App Router & Điều Hướng:**
   - S01: `/explore` — Khám phá địa điểm và bài viết mới nhất.
   - S02: `/places/[placeId]` — Chi tiết địa điểm (hỗ trợ hiển thị điểm đã sáp nhập).
   - S03: `/posts/[postId]` — Đọc bài viết theo phiên bản (hỗ trợ chuyển đổi revision).
   - S04: `/people/[handle]` — Trang hồ sơ cá nhân và đóng góp của tác giả.
   - S05: `/login` — Đăng nhập và liên kết tài khoản.
   - S21: `/vip` — Đăng ký/gia hạn gói VIP (1500 USD cents / 12 tháng UTC).
   - S34: `/transparency` — Sổ cái tài chính cộng đồng công khai.
   - Route gốc `/` chuyển hướng HTTP 307 về `/explore`.

4. **Fixture Mock Adapter Đạt 6 Kịch Bản Bắt Buộc:**
   - Kịch bản 1: Bài viết nhiều revision (`PST-000001` có `REV-000001` và `REV-000002`).
   - Kịch bản 2: Địa điểm đã sáp nhập (`PLC-000002` sáp nhập vào `PLC-000001`).
   - Kịch bản 3: Bài viết chưa kiểm định (`PST-000003` - `UNVERIFIED`).
   - Kịch bản 4: Phiên bản hết hạn kiểm định (`PST-000001` xem `REV-000001` - `EXPIRED`).
   - Kịch bản 5: Bài viết có nội dung VIP (`PST-000004` - nội dung bí mật được redact tại server, DOM không rò rỉ tọa độ).
   - Kịch bản 6: Điểm đề xuất ứng viên (`PLC-000004` - `CANDIDATE` chỉ hiển thị cho Author hoặc Expert, ẩn với Khách).
   - Toàn bộ 38 định danh mẫu đều tuân thủ 100% định dạng canonical UUIDv7 hợp lệ.

5. **Bộ Kiểm Tra Tổng Hợp (`pnpm run verify`):**
   - Vượt qua cả 7 bước kiểm tra hợp quy trong `scripts/validate_foundation.py`.
   - Vượt qua 100% typecheck và lint trên toàn bộ các gói trong monorepo.
   - Build thành công ứng dụng Next.js với 8/8 routes tĩnh và động.

---

## 2. Hướng dẫn nghiệm thu dành cho Bin

Bin có thể chạy thử ứng dụng cục bộ để kiểm tra giao diện và tính năng theo các bước sau:

```bash
# 1. Chuyển sang nhánh FE-01 (nếu đang ở nhánh khác)
git checkout feat/fe-01-reader-flow

# 2. Chạy lệnh kiểm tra tổng hợp
pnpm run verify

# 3. Khởi chạy ứng dụng Web
pnpm --filter @ventlore/web dev
```

Mở trình duyệt tại `http://localhost:3000` và kiểm tra các tính năng:
- **Khám phá:** Duyệt danh sách địa điểm, tìm kiếm theo từ khóa, lọc theo vùng miền tại `/explore`.
- **Xem bài viết & Đổi phiên bản:** Vào `/posts/PST-000001`, chọn đổi giữa phiên bản v2 (Hiệu lực) và v1 (Hết hạn).
- **Địa điểm sáp nhập:** Vào `/places/PLC-000002` để xem banner thông báo địa điểm đã sáp nhập vào Hang Múa (`PLC-000001`).
- **Bảo mật nội dung VIP:**
  - Ở persona mặc định là "Khách", vào `/posts/PST-000004`, nội dung bí mật bị khóa và hiển thị hộp thoại `AccessGate`.
  - Bấm vào thanh điều hướng trên cùng, chọn Persona "VIP Member", bài viết sẽ mở khóa hiển thị đầy đủ tọa độ và ghi chú bí mật.
- **Trang VIP:** Vào `/vip` để xem gói thành viên 1500 USD cents / 12 tháng UTC.
- **Sổ cái minh bạch:** Vào `/transparency` xem biểu đồ và bảng dòng tiền thu - chi.
- **Bản đồ dữ liệu FE (Data Map):**
  - Truy cập trực tiếp `/data-map` (hoặc `/vi/data-map`) để xem ma trận 16 cột tương tác có tìm kiếm, lọc theo nguồn dữ liệu đích và xem 5 quyết định cần chốt.
  - Bấm nút **"Tải .md"** trên thanh header, dưới 2 nút CTA ở trang chủ, trên thanh menu điều hướng, ở chân trang (footer), hoặc trong Review Toolbar để tải file `FE_DATA_MAP.md` về máy.
  - Đường dẫn file tĩnh tải trực tiếp: `/docs/FE_DATA_MAP.md`.

### 2.1 Triển khai xem trước trực tiếp trên Netlify (Netlify Drop)
Để đưa lên Netlify xem ngay trên thiết bị thực tế mà không cần chạy server cục bộ:
```bash
# Đóng gói static export và tạo file zip
pnpm run package:netlify
```
- Mở **https://app.netlify.com/drop**
- Kéo thả file `dist/ventlore-netlify-drop.zip` vào để nhận link xem ngay lập tức!
- Chi tiết hướng dẫn: xem `docs/NETLIFY_DEPLOYMENT.md`
- Báo cáo đánh giá UI toàn diện: xem `docs/UI_EVALUATION.md`

---

## 3. Các bước tiếp theo

1. Agent mở Pull Request hướng về `main` với tiêu đề `[FE-01] Front-end nền tảng và trải nghiệm người đọc (S01-S05, S21, S34)`.
2. Agent theo dõi trạng thái GitHub Actions CI trên PR.
3. Cập nhật nhãn Issue #2 từ `in-progress` sang `review`.
4. Agent dừng lại, nhường quyền cho Bin trực tiếp kiểm tra và nhấn nút Merge PR trên GitHub.
5. Sau khi Bin merge PR, sẽ tiếp tục kích hoạt Chặng 02 (Prompt 02 / BE-01).
