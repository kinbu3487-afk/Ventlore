# Ventlore Code Ownership (OWNERSHIP.md)

**Phiên bản:** 2.0  
**Ngày thiết lập:** 25/09/2026  
**Chủ trì:** Integration Coordinator (Merge Lane)  
**Mục đích:** Xác lập rõ ranh giới quyền sở hữu file, ngăn chặn xung đột mã nguồn giữa 3 lane song song (FE, BE, CHAIN).

---

## 1. Ma Trận Quyền Sở Hữu Đường Dẫn (File Ownership Matrix)

| Đường dẫn / Mẫu tập tin | Chủ trì chính | Mô tả và quy định |
|---|---|---|
| `apps/web/src/app/**/page.tsx`<br>`apps/web/src/app/**/layout.tsx`<br>`apps/web/src/app/globals.css` | **FE** | Giao diện các trang App Router, bố cục tổng thể, styling Tailwind & tokens. |
| `apps/web/src/components/**` | **FE** | Toàn bộ 50 UI components (C01–C50), modal dialogs, persona switcher, navigation. |
| `apps/web/public/**` | **FE** | Tài nguyên tĩnh, hình ảnh, phông chữ `Be Vietnam Pro`, favicon, logo. |
| `packages/api-client/src/mock-adapter.ts` | **FE** | Fixture và in-memory mock adapter phục vụ phát triển giao diện độc lập. |
| `apps/web/src/app/api/**` | **BE** | Tuyệt đối thuộc BE. Next.js Route Handlers triển khai các endpoint `/api/v1`. FE không sửa file trong thư mục này. |
| `apps/worker/**` | **BE** | Tiến trình nền Node.js: Outbox dispatcher, block indexer, expiry sweeper. |
| `packages/db/**` | **BE** | PostgreSQL schema Drizzle, migrations, query repositories, database connection. |
| `packages/domain/**` | **BE** *(chủ trì)* | Pure domain rules, Zod schemas, validation, enums. (Thay đổi dùng chung phải báo Merge). |
| `packages/api-client/src/types.ts`<br>`packages/api-client/src/index.ts` | **BE** *(chủ trì)* | Định nghĩa types và typed client cho API. Merge phê duyệt đồng bộ sang FE. |
| `contracts/**` | **CHAIN** | Toàn bộ mã nguồn Foundry/Solidity (`src/`, `test/`, `script/`), `foundry.toml`. |
| `packages/chain/**` | **CHAIN** | Thư viện tính key derivation, generated ABI JSON, TypeScript contract types, deployment manifest. |
| `docs/api/openapi.yaml` | **BE** *(chủ trì)* | Đặc tả OpenAPI 3.1. BE đề xuất thay đổi; Merge kiểm tra tương thích và cập nhật. |
| `package.json`<br>`pnpm-lock.yaml`<br>`pnpm-workspace.yaml`<br>`tsconfig.base.json` | **MERGE** | Cấu hình monorepo, quản lý gói phụ thuộc và lockfile. Các lane không tự ý chỉnh sửa trực tiếp. |
| `.github/**` | **MERGE** | CI/CD GitHub Actions workflows, Issue templates, PR templates. |
| `scripts/**` | **MERGE** | Scripts kiểm tra hợp quy foundation, verify monorepo, build deployment. |
| `docs/parallel/**` | **MERGE** | Bộ tài liệu điều phối chung (`BASELINE`, `CONTRACTS`, `OWNERSHIP`, `WORKSPACES`, `SYNC`, `ACCEPTANCE`). |
| `docs/parallel/requests/**` | **Từng Lane** | Nơi FE/BE/CHAIN tạo file đề xuất cross-lane changes. |

---

## 2. Quy Tắc Giải Quyết Tách Biệt trong `apps/web`

Do `apps/web` là ứng dụng Next.js chứa đồng thời cả giao diện người dùng và API Route Handlers:
1. **Ranh giới bất khả xâm phạm:**
   - Thư mục `apps/web/src/app/api/` thuộc **toàn quyền của BE**. FE tuyệt đối không chạm vào thư mục này.
   - Thư mục `apps/web/src/components/`, `apps/web/public/`, và các file `page.tsx` thuộc **toàn quyền của FE**. BE không sửa UI hay CSS.
2. **Khi cần kết nối giữa FE và BE (Mốc I1):**
   - FE sử dụng client gọi API qua URL chuẩn `/api/v1/...` (do `packages/api-client` cung cấp).
   - Merge Lane sẽ chịu trách nhiệm chuyển cấu hình của FE từ chế độ `mock` sang chế độ gọi Route Handlers thật của BE tại mốc tích hợp I1.

---

## 3. Quy Trình Đề Xuất Thay Đổi File Dùng Chung (Cross-Lane Request)

Khi một lane cần thêm trường dữ liệu, thay đổi endpoint, hoặc bổ sung thư viện:
1. Lane tạo file yêu cầu tại `docs/parallel/requests/<LANE>-<tên-ngắn>.md` (ví dụ `FE-add-place-filter.md` hoặc `BE-new-claim-endpoint.md`).
2. Nội dung file gồm:
   - Lý do cần thay đổi.
   - Schema / interface trước và sau khi đổi.
   - Các lane chịu ảnh hưởng.
   - Kế hoạch kiểm tra tương thích ngược.
3. Trong phiên làm việc của mình, lane tiếp tục thực hiện các công việc độc lập khác không bị chặn.
4. Merge Lane sẽ tiếp nhận yêu cầu, cập nhật vào `CONTRACTS.md` / `openapi.yaml`, sinh lại types/lockfile và phân phối về các worktree tại mốc Checkpoint gần nhất.
