# Ventlore Parallel Baseline (BASELINE.md)

**Phiên bản:** 2.0  
**Ngày thiết lập:** 25/09/2026  
**Chủ trì:** Integration Coordinator (Merge Lane)  
**Tài liệu điều phối:** `docs/prompts/Ventlore_04_Merge_Parallel_v2.md`  

---

## 1. Nguồn Gốc & Thông Tin Điểm Chốt (Base Ref)

- **Source Commit trước chốt:** `e125bd7` (`feat(web): single-hero homepage, 6-language switcher, fix home/explore routing, and resolve expired verification conflict`)
- **Tên Base Ref cố định:** `v2-parallel-base` (Git tag local trỏ trực tiếp vào commit chốt Giai đoạn A)
- **Danh mục đặc tả nguồn chuẩn đã xác minh:**
  1. `docs/source/Ventlore_Logic_ID_DB_v0_3.pdf` (17 trang nghiệp vụ, quy tắc, ràng buộc C01–C22)
  2. `docs/source/Ventlore_ID_Registry_v0_3.csv` (34 định danh canonical, keyKind, prefix)
  3. `docs/source/Ventlore_So_do_Khoi_v0_3.pdf` (11 trang sơ đồ D01–D11)
  4. `docs/source/Ventlore_Event_UI_Spec_v0_3.pdf` (22 trang S01–S35, C01–C50, U01–U12 72 bước sự kiện, QA01–QA25)
  5. `docs/source/Ventlore_Event_UI_Wireframes_v0_3.pdf` (16 trang khung dây wireframes)
  6. `docs/source/Ventlore_Brand_Guide_v0_1.pdf` & `docs/source/Ventlore_Brand_Kit_v0_1/` (14/14 tài sản: phông Be Vietnam Pro, tokens, logo Ivory/Forest)
  7. `docs/Ventlore_Prompt_01_Round_4_HomePage_i18n.md` & `docs/loops/reports/TASK-FE-01-ROUND-5-SINGLE-HERO-HOME.md`

---

## 2. Phân Loại Hiện Trạng (KEEP / FIX / BUILD / BLOCKED / NOT_VERIFIED)

### 2.1 KEEP (Giữ nguyên toàn bộ thành quả đã kiểm chứng)
- **Nền tảng Prompt 00:**
  - Hợp đồng định danh 3 lớp: UUIDv7 canonical, displayCode sequence, blockchain key derivation (`APP_NAMESPACE`, `RECEIPT_DOMAIN`, `entityKey`, `receiptKey`).
  - Toàn bộ 10/10 blockchain keyKind khớp hoàn toàn đặc tả CSV.
  - Script kiểm tra nền tảng `scripts/validate_foundation.py` đạt 100% PASS.
  - Cấu trúc monorepo pnpm 9.15.4 (`apps/web`, `apps/worker`, `packages/domain`, `packages/db`, `packages/api-client`, `packages/chain`, `contracts`).
  - Bộ quy tắc 5 loop (`docs/loops/`: POLICY, RUN_TASK, SYSTEM_REVIEW, REPORT_TEMPLATE) và CI workflow `.github/workflows/quality.yml`.
- **Giao diện Prompt 01 Round 5:**
  - HomePage tinh gọn dạng Single-Hero (`min-h-[100dvh]`), chữ H1 cân đối ("Khám phá điểm đến của bạn" / "Explore your destination"), thông điệp an toàn, CTA Explore + Contribute.
  - Bộ chuyển đổi 6 ngôn ngữ trực tiếp góc trên phải (`LanguageSwitcher`: vi, en, ja, zh-Hans, ko, fr).
  - Điều hướng tách bạch giữa Home (`/`) và Explore (`/explore`).
  - Hộp thoại sứ mệnh `MissionDialog` và đóng góp `ContributeDialog`.
  - Khắc phục triệt để tràn ngang di động (horizontal overflow) và mâu thuẫn trạng thái EXPIRED trên bài viết `PST-000003`.
  - 13 components cốt lõi: C01 (`AppShell`), C02 (`SearchFilters`), C03 (`PlaceResults`), C04 (`PlaceSummary`), C05 (`PostReader`), C06 (`VerificationPanel`), C07 (`RevisionSelector`), C08 (`AccessGate`), C09 (`SocialLogin`), C10 (`WalletBinding`), C46 (`AsyncState`), C49 (`PermissionGate`), C50 (`PublicLedger`).
  - 7 màn hình cơ sở: S01 (`/explore`), S02 (`/places/[placeId]`), S03 (`/posts/[postId]`), S04 (`/people/[handle]`), S05 (`/login`), S21 (`/vip`), S34 (`/transparency`).
  - 199/199 trang tĩnh export thành công qua static build.

### 2.2 FIX (Khắc phục lỗi nền)
- **Hiện tại:** Không có lỗi cản trở hợp đồng, build hay routing. `pnpm run verify` đạt 100% (Foundation validator + typecheck 6 projects + Next.js lint + Next.js build).
- **Tồn đọng phi chặn:** Một số tinh chỉnh nội dung bản dịch chi tiết của các bài viết mở rộng sẽ tiếp tục hoàn thiện trong FE lane theo lộ trình FE-A mà không chặn BE và CHAIN.

### 2.3 BUILD (Phạm vi cần triển khai tiếp theo từng nhánh)
- **Front-end Lane (FE):**
  - **FE-A:** Hoàn thiện các tiểu tiết còn lại của Prompt 01 (bio 6 ngôn ngữ đồng nhất, deep link Tây Côn Lĩnh, map placeholder provider).
  - **FE-B:** Đóng góp, chuyên gia và vận hành (S06–S12, S17–S19, S24–S27, S30, S31, S35; components C11–C27, C39–C41, C47–C49).
  - **FE-C:** Ví, tiền và quyền lợi (S13–S16, S20, S22, S23, S28, S29, S32–S34; components C28–C38, C42–C45).
- **Back-end Lane (BE):**
  - **BE-A:** PostgreSQL schema 34 bảng (Drizzle migrations), auth `/me` capabilities, Route Handlers `/api/v1` thay thế MockAdapter cho luồng đọc đa ngôn ngữ.
  - **BE-B:** Nghiệp vụ đóng góp, duplicate check, review case, assignment, budget reservation, payable.
  - **BE-C:** Outbox pattern worker, indexer quét block Anvil/Arbitrum, accounting ledger, VIP payment adapter.
- **On-chain Lane (CHAIN):**
  - **CHAIN-A:** Khóa Solidity interface, sinh ABI compile thật, kiểm tra chéo test vectors TS và Solidity.
  - **CHAIN-B:** `VentloreRegistry`, `VentlorePayments`, EIP-712 consent, luồng donate (PROJECT 100%, POST_TIP 80/20) và `payTask`.
  - **CHAIN-C:** `ContributorSBT` (ERC-5192), `AuthorContributionNFT` (ERC-721), token identity và authorization claim.
- **Merge Lane (MERGE):**
  - Ghép tích hợp theo các mốc I1 (Đọc và ngôn ngữ), I2 (Đóng góp và công việc), I3 (Ví, tiền và quyền lợi).
  - Nghiệm thu cục bộ và chuẩn bị gói Arbitrum Sepolia dry-run.

### 2.4 BLOCKED (Các điểm bị chặn)
- Hiện tại **KHÔNG CÓ BLOCKER** nào cản trở việc tách worktree và bắt đầu làm việc song song.
- Cả 3 lane đều có thể hoạt động độc lập ngay lập tức dựa trên bộ hợp đồng chuẩn trong `docs/parallel/CONTRACTS.md`.

### 2.5 NOT_VERIFIED (Chưa kiểm chứng thực tế ngoài local)
- Live OAuth Provider (Google): Chưa cấu hình Client Secret thực tế -> Đánh dấu `NOT_CONFIGURED`, dùng demo login allowlist.
- Testnet Arbitrum Sepolia broadcast: Chưa có private key signer ví quỹ thật -> Đánh dấu `NOT_CONFIGURED`, hoàn thành 100% local Anvil trước.
- Cổng thanh toán thẻ VIP thực tế (Stripe): Chưa cấu hình webhook secret -> Đánh dấu `NOT_CONFIGURED`, dùng test adapter.

---

## 3. Trạng Thái Mock vs Thực Tế

| Thành phần | Trạng thái hiện tại | Kế hoạch chuyển đổi |
|---|---|---|
| **FE API Data** | `MOCK` (MockAdapter trong `@ventlore/api-client`) | Mốc I1 chuyển sang `LOCAL_REAL` với BE API |
| **Database** | `SCHEMA_ONLY` (Đã định nghĩa schema Drizzle, chưa migrate DB) | BE-A dựng local PostgreSQL Docker/instance |
| **Worker / Indexer**| `SCAFFOLD` (Đã có package, chưa chạy polling) | BE-C hoàn thiện tiến trình worker |
| **Smart Contracts** | `DESIGN_ONLY` (Interface & key derivation TS, contracts trống) | CHAIN-A viết Solidity và compile ABI |
| **Blockchain Chain**| `NOT_RUN` (Chưa khởi chạy Anvil) | CHAIN-A khởi chạy Anvil local port 8546 |

---

## 4. Điều Kiện Tiên Quyết Mở Nhánh (Lane Gates)

- [x] **Gate 1 - Foundation:** ID Contract 34 entities, namespace, domain hash PASS 100%.
- [x] **Gate 2 - Quality CI:** `pnpm run verify` PASS 100% (Typecheck 6 projects, Next.js lint, build).
- [x] **Gate 3 - UI Baseline:** Home & Explore tách biệt, 6 ngôn ngữ, Single Hero, responsive đạt.
- [x] **Gate 4 - Worktree Ready:** Tạo 4 worktree độc lập với cổng, môi trường và branch riêng.
