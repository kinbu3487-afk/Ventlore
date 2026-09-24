# Trạng Thái Dự Án Ventlore (PROJECT_STATE)

**Cập nhật lần cuối:** 24/09/2026 (FE-01 Round 4 · Thêm HomePage Thiên tai & Tương trợ, Căn giữa H1, Sửa triệt để Bio/i18n & Tây Côn Lĩnh 404)  
**Phiên bản đặc tả cơ sở:** Logic-ID-DB v0.3, Event UI Spec v0.3, Brand Guide v0.1, Prompt 01 Round 4 HomePage & i18n

---

## 1. Mốc hiện tại: Hoàn thành Chặng 01 / FE-01 Round 4 (HomePage Thiên tai & Tương trợ · Tinh chỉnh Bio & Sửa Lỗi Điều Hướng/404)

| Chặng | Tên chặng | Trạng thái | Ghi chú |
|---|---|---|---|
| **00** | **Đọc nguồn, khóa quy tắc và dựng nền tảng** | **HOÀN THÀNH** | Đọc đủ 6 tài liệu nguồn; dựng cấu trúc workspace pnpm, AGENTS.md, OpenAPI, toàn bộ tài liệu kiến trúc/hợp đồng dữ liệu, ma trận coverage S01-S35 / C01-C50 / U01-U12, thư viện TypeScript và test runner kiểm tra ID. |
| **LOOP-00** | **Thiết lập quy trình 5 loop & CI baseline** | **HOÀN THÀNH** | Bổ sung `docs/loops/` (POLICY, RUN_TASK, SYSTEM_REVIEW, REPORT_TEMPLATE), mẫu Issue/PR, GitHub Actions `quality.yml`, lệnh `pnpm run verify` đạt 100%, khóa `pnpm-lock.yaml`. |
| **01 (FE-01 Round 4)** | **Thêm HomePage & Hoàn thiện Đa ngôn ngữ 6 Locales** | **HOÀN THÀNH** | Hoàn thành cả 3 nhóm: 1. HomePage toàn khối bão lũ & tương trợ dã ngoại, H1 căn chính giữa ảnh, 6 sections; 2. Sửa bio 6 ngôn ngữ 5 demo profiles, tên ngôn ngữ bản địa, sửa 404 Tây Côn Lĩnh UUID, sửa race condition VIP demo; 3. Navbar 5 mục (Trang chủ, Khám phá, Sứ mệnh, Minh bạch, VIP), 199/199 static pages export thành công 100%, 0 raw translation key leaks. |
| 02 | Front-end đóng góp, chuyên gia và vận hành | SẴN SÀNG | Mục tiêu kế tiếp (FE-02): S06-S12, S17-S19, S24-S27, S30, S31, S35. |
| 03 | Front-end tiền, quyền lợi và bàn giao API | CHƯA BẮT ĐẦU | S13-S16, S20, S22, S23, S28, S29, S32-S34, hoàn thành C01-C50, FE_HANDOFF. |
| 04 | Back-end dữ liệu, đăng nhập và phân quyền | CHƯA BẮT ĐẦU | Schema PostgreSQL 34 bảng, Supabase Auth, wallet challenge, API foundation. |
| 05 | Back-end nội dung, review và nghĩa vụ trả công | CHƯA BẮT ĐẦU | Business services, duplicate detection, review lifecycle, budget reserve, BE_HANDOFF. |
| 06 | Back-end thanh toán, VIP, outbox và indexer | CHƯA BẮT ĐẦU | Worker process, outbox pattern, payment adapter, accounting ledger. |
| 07 | Smart contract Arbitrum: route, donate và trả công | CHƯA BẮT ĐẦU | Foundry, VentloreRegistry, VentlorePayments, EIP-712 route consent, CONTRACTS_HANDOFF. |
| 08 | Smart contract SBT và NFT tác giả | CHƯA BẮT ĐẦU | ContributorSBT (ERC-5192), AuthorContributionNFT (ERC-721), token identity. |
| 09 | Nối ba lớp và chuẩn bị Arbitrum Sepolia | CHƯA BẮT ĐẦU | Local end-to-end integration, Arbitrum Sepolia testnet package. |
| 10 | Rà soát, sửa lỗi và bàn giao bản chạy được | CHƯA BẮT ĐẦU | QA01-QA25 verification, runbooks, readiness report. |

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

