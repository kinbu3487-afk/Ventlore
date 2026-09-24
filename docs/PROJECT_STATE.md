# Trạng Thái Dự Án Ventlore (PROJECT_STATE)

**Cập nhật lần cuối:** 25/09/2026 (Parallel v2 Giai đoạn A · Chốt nền chung, bộ tài liệu docs/parallel/ & Thiết lập 4 Worktree FE, BE, CHAIN, MERGE)  
**Phiên bản đặc tả cơ sở:** Logic-ID-DB v0.3, Event UI Spec v0.3, Brand Guide v0.1, Prompt 04 Merge Parallel v2 Giai đoạn A

---

## 1. Mốc hiện tại: Hoàn thành Giai đoạn A (Parallel v2 · Chốt nền chung và tạo nơi làm việc 4 Worktrees)

| Chặng | Tên chặng | Trạng thái | Ghi chú |
|---|---|---|---|
| **00** | **Đọc nguồn, khóa quy tắc và dựng nền tảng** | **HOÀN THÀNH** | Đọc đủ 6 tài liệu nguồn; dựng cấu trúc workspace pnpm, AGENTS.md, OpenAPI, toàn bộ tài liệu kiến trúc/hợp đồng dữ liệu, ma trận coverage S01-S35 / C01-C50 / U01-U12, thư viện TypeScript và test runner kiểm tra ID. |
| **LOOP-00** | **Thiết lập quy trình 5 loop & CI baseline** | **HOÀN THÀNH** | Bổ sung `docs/loops/` (POLICY, RUN_TASK, SYSTEM_REVIEW, REPORT_TEMPLATE), mẫu Issue/PR, GitHub Actions `quality.yml`, lệnh `pnpm run verify` đạt 100%, khóa `pnpm-lock.yaml`. |
| **01 (FE-01 Round 5)** | **Single-Hero HomePage & Hoàn thiện Review Preview 8** | **HOÀN THÀNH** | Hoàn thành cả 8 nhóm: 1. Thu gọn HomePage thành single-viewport hero min-h-[100dvh], bỏ 6 khối bên dưới; 2. LanguageSwitcher 6 ngôn ngữ trực tiếp góc trên phải Home; 3. Sửa điều hướng Home/Explore độc lập; 4. Sứ mệnh mở MissionDialog (không còn anchor chết #mission); 5. ContributeDialog cho CTA đóng góp; 6. Loại bỏ tràn ngang; 7. Sửa mâu thuẫn trạng thái EXPIRED trên PST-000003; 8. Ngữ pháp số nhiều tiếng Anh/Pháp và bản dịch PST-000002/PST-000003. 199/199 static pages export thành công. |
| **Parallel v2 - Giai đoạn A** | **Chốt nền chung & Tạo nơi làm việc (4 Worktrees)** | **HOÀN THÀNH** | Kiểm kê Prompt 00–01 PASS 100%, thiết lập bộ tài liệu `docs/parallel/` (BASELINE, CONTRACTS, OWNERSHIP, WORKSPACES, SYNC, ACCEPTANCE, requests/), tạo `.env.example`, khóa base ref cố định `v2-parallel-base`, thiết lập 4 worktree độc lập (FE, BE, CHAIN, MERGE). |
| Parallel v2 - FE | Front-end song song (FE-A, FE-B, FE-C) | SẴN SÀNG | Worktree `Ventlore-FE`, nhánh `parallel/v2-fe`, port 3001, MockAdapter. |
| Parallel v2 - BE | Back-end song song (BE-A, BE-B, BE-C) | SẴN SÀNG | Worktree `Ventlore-BE`, nhánh `parallel/v2-be`, port 3002, DB/worker. |
| Parallel v2 - CHAIN | On-chain song song (CHAIN-A, CHAIN-B, CHAIN-C) | SẴN SÀNG | Worktree `Ventlore-Chain`, nhánh `parallel/v2-chain`, port 8546 Anvil. |
| Parallel v2 - MERGE | Tích hợp từng mốc & Nghiệm thu (I1, I2, I3) | SẴN SÀNG | Worktree `Ventlore-Merge`, nhánh `parallel/v2-integration`, port 3000. |

---

## 2. Kiểm kê mã nguồn và tài nguyên hiện có

### 2.1 Tài liệu nguồn & Bộ nhận diện (`docs/source/`)
1. `docs/source/Ventlore_Logic_ID_DB_v0_3.pdf` (17 trang) - Đã đọc đủ.
2. `docs/source/Ventlore_ID_Registry_v0_3.csv` (36 dòng, 34 ID chuẩn) - Đã đọc và kiểm tra.
3. `docs/source/Ventlore_So_do_Khoi_v0_3.pdf` (11 trang D01-D11) - Đã đọc đủ.
4. `docs/source/Ventlore_Event_UI_Spec_v0_3.pdf` (22 trang) - Đã đọc đủ.
5. `docs/source/Ventlore_Event_UI_Wireframes_v0_3.pdf` (16 trang) - Đã đọc đủ.
6. `docs/source/Ventlore_Brand_Guide_v0_1.pdf` (12 trang) - Đã đọc đủ.
7. `docs/source/Ventlore_Brand_Kit_v0_1/` (Đã xác minh đầy đủ 14/14 tài sản):
   - `01_Logos/`: Logo sáng (`Ventlore_Logo_Ivory.png`), logo tối (`Ventlore_Logo_Forest.png`), avatar (`Ventlore_Avatar_Forest.png`).
   - `02_Brand_Board/`: Bảng tổng thể minh họa (`Ventlore_Identity_Board.png`).
   - `03_Guidelines/`: Cẩm nang PDF tiếng Việt.
   - `04_UI_Tokens/`: `ventlore-tokens.json` và `ventlore-theme.css`.
   - `05_Fonts/`: Phông chữ `Be Vietnam Pro` (400, 500, 600, 700) + giấy phép OFL.
   - `06_Creative_Brief/`: `Ventlore_Creative_Brief.md` và `Generation_Prompts.json`.

### 2.2 Các tài liệu nhắc trong PDF nhưng không có sẵn (Được đánh dấu MISSING_REFERENCE)
- `data/example-records.json` (hoặc `example-records.json`): Không có sẵn trong repo. Test vectors được sinh mới từ đặc tả trong chặng 00.
- `source/build_ids.py`: Không có sẵn trong repo. Được thay thế bằng script kiểm tra mới `scripts/validate_foundation.py`.
- `sql/002_lookup_examples.sql`: Không có sẵn trong repo. Truy vấn Q01-Q10 được đặc tả và tạo mới trong `packages/db`.

---

## 3. Cấu trúc Monorepo Workspace (pnpm)

```text
/Users/johnlebin/Downloads/Ventlore
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── task.md                    # Mẫu Issue chuẩn hóa cho các nhiệm vụ
│   │   └── config.yml                 # Cấu hình GitHub Issue forms
│   ├── pull_request_template.md       # Mẫu PR chuẩn hóa
│   └── workflows/
│       └── quality.yml                # GitHub Actions CI workflow (verify, typecheck, lint, build)
├── AGENTS.md                          # Quy tắc xuyên suốt & dẫn chiếu 5 loop
├── package.json                       # Root package config & pnpm run verify
├── pnpm-lock.yaml                     # Khóa dependencies monorepo pnpm 9.15.4
├── pnpm-workspace.yaml                # Cấu hình workspace
├── tsconfig.base.json                 # Cấu hình TypeScript nghiêm ngặt chung
├── apps/
│   ├── web/                           # Next.js App Router (Giao diện + /api/v1 handlers)
│   └── worker/                        # Tiến trình nền Node.js (Outbox, Indexer, Expiry)
├── packages/
│   ├── domain/                        # Pure domain rules, types, enums, Zod schemas
│   ├── api-client/                    # Typed API client & Mock Adapters
│   ├── db/                            # Schema PostgreSQL, Drizzle, migrations, repositories
│   └── chain/                         # Key derivation, ABI generator, contract manifests
├── contracts/                         # Foundry workspace (Solidity 0.8.28, Arbitrum target)
├── scripts/
│   └── validate_foundation.py         # Script kiểm tra hợp đồng ID và registry
└── docs/
    ├── loops/                         # Tài liệu vận hành quy trình 5 loop
    │   ├── POLICY.md                  # Chính sách và quy tắc cốt lõi
    │   ├── RUN_TASK.md                # Hướng dẫn thực hiện từng nhiệm vụ
    │   ├── SYSTEM_REVIEW.md           # Hướng dẫn rà soát hệ thống định kỳ
    │   ├── REPORT_TEMPLATE.md         # Mẫu báo cáo nhiệm vụ chuẩn
    │   └── reports/                   # Thư mục lưu báo cáo từng lần chạy
    │       └── LOOP-00-setup.md       # Báo cáo nhiệm vụ LOOP-00
    ├── Ventlore_Antigravity_Prompt_Pack_v1_0.md
    ├── PROJECT_STATE.md               # Tài liệu này
    ├── DECISIONS.md                   # Các quyết định kiến trúc (ADR)
    ├── OPEN_QUESTIONS.md              # Câu hỏi & chính sách mở
    ├── HANDOFF.md                     # Hướng dẫn bàn giao
    ├── DOMAIN_RULES.md                # Quy tắc nghiệp vụ F01-F10
    ├── ID_CONTRACT.md                 # Hợp đồng ID 3 lớp chi tiết
    ├── STATE_MACHINES.md              # Máy trạng thái thực thể
    ├── PERMISSIONS.md                 # Phân quyền & ma trận vai trò
    ├── CHAIN_INTERFACE.md             # Giao diện tương tác blockchain
    ├── SCREEN_COVERAGE.md             # Ma trận bao phủ S01-S35
    ├── COMPONENT_COVERAGE.md          # Ma trận bao phủ C01-C50
    ├── EVENT_COVERAGE.md              # Ma trận bao phủ 72 bước sự kiện
    ├── validation-report.json         # Báo cáo kết quả kiểm tra Chặng 00
    ├── api/
    │   └── openapi.yaml               # OpenAPI 3.1 cho /api/v1
    └── source/                        # 6 tài liệu nguồn gốc & Brand Kit v0.1
```

---

## 4. Trạng thái môi trường máy chủ
- **Hệ điều hành:** macOS (Darwin arm64).
- **Node.js:** v24.21.0.
- **pnpm:** 9.15.4 (đã cài đặt vào `/opt/homebrew/bin/pnpm`, đã khóa `pnpm-lock.yaml`).
- **GitHub CLI (`gh`):** 2.101.0 (đã cài đặt vào `/opt/homebrew/bin/gh`).
- **Python:** 3.13.7 (sử dụng cho `validate_foundation.py`).
- **Homebrew:** 4.6.14.
- **Bộ kiểm tra CI (`pnpm run verify`):** Đã cấu hình và kiểm chứng đạt 100% (Foundation ID validator + typecheck 6 projects + Next.js lint + production build).
- **GitHub Actions:** Workflow `.github/workflows/quality.yml` sẵn sàng kích hoạt tự động trên các PR và push vào `main`.

