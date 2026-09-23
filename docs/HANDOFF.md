# Tài Liệu Bàn Giao Chặng 00 (HANDOFF)

**Chặng hoàn thành:** Prompt 00 — Đọc nguồn, khóa quy tắc và dựng nền tảng  
**Chặng tiếp theo:** Prompt 01 — Front-end nền tảng và trải nghiệm người đọc  
**Thời điểm bàn giao:** 24/09/2026

---

## 1. Kết quả đạt được tại Chặng 00

1. **Đọc và đối chiếu toàn diện 6 tài liệu nguồn:**
   - Hoàn thành trích xuất và phân tích toàn bộ nội dung từ 6 tài liệu trong `docs/source/`.
   - Xác định chính xác các tài liệu được nhắc tới nhưng chưa có trong repo (`data/example-records.json`, `source/build_ids.py`, `sql/002_lookup_examples.sql`, `validation-report.json`, các tệp logo/font riêng lẻ) và đánh dấu `MISSING_REFERENCE`.
2. **Khởi tạo kiến trúc Monorepo pnpm:**
   - Cấu trúc thư mục phân tách độc lập: `apps/web`, `apps/worker`, `packages/domain`, `packages/api-client`, `packages/db`, `packages/chain`, `contracts`.
   - Cấu hình TypeScript nghiêm ngặt (`tsconfig.base.json`), `pnpm-workspace.yaml`, và `package.json` gốc.
3. **Bộ tài liệu hợp đồng và đặc tả hoàn chỉnh:**
   - `AGENTS.md`: Khóa các quy tắc bắt buộc, bảo mật, và hợp đồng định danh.
   - `docs/DOMAIN_RULES.md`: Chuyển hóa toàn bộ quy tắc nghiệp vụ F01–F10.
   - `docs/ID_CONTRACT.md`: Quy định chi tiết 3 lớp định danh (34 UUIDv7, displayCode, Keccak-256 entityKey/receiptKey).
   - `docs/STATE_MACHINES.md`: Định nghĩa 10 máy trạng thái độc lập.
   - `docs/PERMISSIONS.md`: Ma trận phân quyền và capabilities theo vai trò.
   - `docs/SCREEN_COVERAGE.md`: Ma trận bao phủ 35 màn hình S01–S35.
   - `docs/COMPONENT_COVERAGE.md`: Ma trận bao phủ 50 component C01–C50.
   - `docs/EVENT_COVERAGE.md`: Ma trận bao phủ 72 bước sự kiện U01-E01 đến U12-E06.
   - `docs/CHAIN_INTERFACE.md`: Thiết kế giao diện smart contract và các điểm cần khóa ở Chặng 07.
   - `docs/api/openapi.yaml`: Đặc tả OpenAPI 3.1 cho API `/api/v1`.
4. **Mã nguồn nền tảng & Bộ kiểm tra tự động:**
   - Các packages `domain`, `chain`, `api-client`, `db` đã có kiểu dữ liệu, schema Zod và hàm tính khóa TypeScript.
   - Script kiểm tra `scripts/validate_foundation.py` chạy qua Python 3.13, xác thực 100% ID registry CSV, công thức Keccak-256 ABI encode, UUIDv7, và độ phủ toàn bộ tài liệu đặc tả.

---

## 2. Hướng dẫn thực hiện Prompt 01

### 2.1 Mục tiêu Chặng 01
Xây dựng giao diện Front-end nền tảng cho trải nghiệm người đọc bằng Next.js App Router và Tailwind CSS, tích hợp mock adapter từ `packages/api-client`. Không kết nối cơ sở dữ liệu thật hay blockchain thật ở chặng này.

### 2.2 Các nhiệm vụ cốt lõi của Chặng 01
1. **Design Tokens từ Brand Guide:**
   - Màu sắc chuẩn: Forest `#173F35`, Jade `#2C7563`, Sage `#DCE8DA`, Ivory `#F5F1E8`, Waypoint `#F0A44B`, Ink `#182522`.
   - Phông chữ: `Be Vietnam Pro` (400, 500, 600, 700), body 16/26px, lưới khoảng cách 4/8/12/16/24/32/48/64px, card radius 16px, button radius 12px, chiều cao input/button 48px, vùng chạm tối thiểu 44px.
   - Tạo bộ tokens Tailwind CSS và CSS variables tương ứng. Do chưa có file vector logo riêng lẻ, sử dụng wordmark chữ "ventlore" tạm thời theo hướng dẫn.
2. **Khung sườn ứng dụng (AppShell & Navigation):**
   - Dựng component `C01 - AppShell / RoleNav`, hỗ trợ mobile drawer và desktop header.
   - Bảo đảm phím tắt, focus outline (màu lam rõ ràng), nhãn trợ năng và responsive không tràn ngang ở 390px (mobile) và 1440px (desktop).
3. **Các màn hình đọc chính cần hoàn thiện:**
   - `S01 - Khám phá (/explore)`: Tìm kiếm, lọc theo vùng/độ mới, danh sách địa điểm, map adapter tùy chọn (không bắt buộc có GPS).
   - `S02 - Chi tiết địa điểm (/places/{placeId})`: Thông tin địa điểm canonical, cảnh báo an toàn công khai, danh sách bài viết.
   - `S03 - Bài viết & Phiên bản (/posts/{postId}?revisionId={revisionId})`: Trình đọc bài, chọn phiên bản, hiển thị ngày trải nghiệm, nhãn kiểm định, route nhận tip theo đúng phiên bản.
   - `S04 - Hồ sơ công khai (/people/{handle})`: Tên công khai, danh sách bài đóng góp, các chứng nhận đã nhận.
   - `S05 - Đăng nhập (/login?returnTo=...)`: Đăng nhập giả lập mạng xã hội, giữ ý định điều hướng an toàn (chỉ cùng origin/allowlist).
   - `S21 - Giới thiệu gói VIP (/vip)`: Giới thiệu quyền lợi 15 USD/năm, danh sách kênh thanh toán.
   - `S34 - Minh bạch quỹ (/transparency)`: Sổ quỹ đã redacted, chỉ hiển thị số liệu projection công khai.
4. **Cơ chế Mock Adapter và AccessGate:**
   - Sử dụng Mock Adapter từ `packages/api-client` tuân thủ đúng schema của OpenAPI/Zod.
   - `C08 - AccessGate`: Server/adapter lọc dữ liệu trước khi trả về; tuyệt đối không đưa dữ liệu VIP/private vào DOM rồi giấu bằng CSS.

---

## 3. Lệnh kích hoạt Prompt 01

Người dùng chỉ cần dán nội dung sau vào cuộc hội thoại:

```text
Tiếp tục repository Ventlore đang mở, thực hiện Prompt 01 trong docs/Ventlore_Antigravity_Prompt_Pack_v1_0.md.
Trước khi code, đọc AGENTS.md, docs/PROJECT_STATE.md, docs/HANDOFF.md, các quyết định và handoff liên quan; kiểm git status và mã đang có.
Xác nhận ngắn trạng thái thực tế rồi thực hiện đúng chặng, không dựng lại repo, không đổi hợp đồng ID/API/ABI hoặc business rules để tiện code. Nếu báo cáo cũ lệch mã hiện tại, kiểm chứng và cập nhật có lý do.
Hoàn thành phần có thể làm, chạy kiểm tra phù hợp, sửa lỗi do thay đổi, lưu bàn giao để phiên sau tiếp tục. Không báo PASS cho việc chưa chạy.
```
