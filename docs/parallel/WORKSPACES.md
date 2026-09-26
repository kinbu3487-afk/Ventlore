# Ventlore Workspaces & Environments (WORKSPACES.md)

**Phiên bản:** 2.0  
**Ngày thiết lập:** 25/09/2026  
**Chủ trì:** Integration Coordinator (Merge Lane)  
**Tài liệu điều phối:** `docs/prompts/Ventlore_04_Merge_Parallel_v2.md`  

---

## 1. Bảng Phân Phối Worktree & Nhánh Phát Triển

| Kênh (Lane) | Thư mục Worktree đầy đủ | Nhánh Git | Base Ref | Cổng mạng (Ports) | Cơ chế dữ liệu | File Prompt chỉ định |
|---|---|---|---|---|---|---|
| **FE** (Front-end) | `/Users/johnlebin/Downloads/Ventlore-FE` | `parallel/v2-fe` | `v2-parallel-base` | Web: `3001` | MockAdapter in-memory | `docs/prompts/Ventlore_01_Frontend_Parallel_v2.md` |
| **BE** (Back-end) | `/Users/johnlebin/Downloads/Ventlore-BE` | `parallel/v2-be` | `v2-parallel-base` | API: `3002`<br>DB: `5433` | PostgreSQL BE instance | `docs/prompts/Ventlore_02_Backend_Parallel_v2.md` |
| **CHAIN** (On-chain) | `/Users/johnlebin/Downloads/Ventlore-Chain` | `parallel/v2-chain` | `v2-parallel-base` | Anvil: `8546` | Anvil Local Chain | `docs/prompts/Ventlore_03_Onchain_Parallel_v2.md` |
| **MERGE** (Tích hợp) | `/Users/johnlebin/Downloads/Ventlore-Merge` | `parallel/v2-integration` | `v2-parallel-base` | Web: `3000`<br>Anvil: `8545`<br>DB: `5432` | Integration Full-stack | `docs/prompts/Ventlore_04_Merge_Parallel_v2.md` |

*(Ghi chú: Thư mục gốc `/Users/johnlebin/Downloads/Ventlore` được bảo toàn nguyên trạng làm kho gốc quản trị repository).*

---

## 2. Lệnh Khởi Chạy Từng Worktree

### 2.1 FE Worktree (`/Users/johnlebin/Downloads/Ventlore-FE`)
```bash
# 1. Chuyển vào thư mục worktree FE
cd /Users/johnlebin/Downloads/Ventlore-FE

# 2. Khởi chạy Web Server ở cổng 3001 với MockAdapter
PORT=3001 pnpm --filter @ventlore/web dev

# 3. Kiểm tra kiểm thử và typecheck UI
pnpm --filter @ventlore/web test
pnpm --filter @ventlore/web typecheck
```

### 2.2 BE Worktree (`/Users/johnlebin/Downloads/Ventlore-BE`)
```bash
# 1. Chuyển vào thư mục worktree BE
cd /Users/johnlebin/Downloads/Ventlore-BE

# 2. Khởi chạy API Server ở cổng 3002
PORT=3002 pnpm --filter @ventlore/web dev

# 3. Khởi chạy Worker Outbox/Indexer
pnpm --filter @ventlore/worker dev

# 4. Chạy kiểm thử DB và API
pnpm --filter @ventlore/db test
pnpm --filter @ventlore/domain test
```

### 2.3 CHAIN Worktree (`/Users/johnlebin/Downloads/Ventlore-Chain`)
```bash
# 1. Chuyển vào thư mục worktree CHAIN
cd /Users/johnlebin/Downloads/Ventlore-Chain

# 2. Khởi chạy Anvil Local Chain ở cổng 8546
anvil --port 8546

# 3. Biên dịch và kiểm thử Smart Contracts
cd contracts
forge build
forge test -vvv
```

### 2.4 MERGE Worktree (`/Users/johnlebin/Downloads/Ventlore-Merge`)
```bash
# 1. Chuyển vào thư mục worktree MERGE
cd /Users/johnlebin/Downloads/Ventlore-Merge

# 2. Khởi chạy toàn bộ hệ thống tích hợp mốc I1/I2/I3
PORT=3000 pnpm --filter @ventlore/web dev
anvil --port 8545

# 3. Chạy bộ kiểm tra tích hợp toàn diện
pnpm run verify
```

---

## 3. Quy Tắc Cô Lập Môi Trường (Environment Isolation)

1. **Tuyệt đối không dùng symlink:**
   - Không symlink thư mục `.next/`, `node_modules/` hay `dist/` giữa các worktree.
   - Mỗi worktree duy trì thư mục `node_modules/` và bộ build cache hoàn toàn độc lập để tránh race condition khi biên dịch đồng thời.
2. **Cô lập Database & Docker:**
   - BE sử dụng cơ sở dữ liệu `ventlore_be` (hoặc cổng `5433`).
   - MERGE sử dụng cơ sở dữ liệu `ventlore_integration` (hoặc cổng `5432`).
   - Không chạy cùng một migration/seed lên database đang chia sẻ.
3. **Cô lập Blockchain State:**
   - CHAIN phát triển và kiểm thử trên Anvil instance tại cổng `8546` với `chainId: 31337`.
   - MERGE nghiệm thu trên Anvil instance tại cổng `8545` để không làm ô nhiễm trạng thái giao dịch đang thử nghiệm của CHAIN.
4. **Biến môi trường (.env):**
   - File `.env` thực tế không được Git theo dõi.
   - Mỗi worktree tạo file `.env.local` từ mẫu `.env.example` với các thông số cổng và kết nối phù hợp với lane của mình.

---

## 4. Hướng Dẫn Mở Worktree Trong Công Cụ Lập Trình (IDE / Agent)

- Khi giao việc cho AI Agent (hoặc mở cửa sổ Cursor / VS Code / Antigravity):
  - **Mở đúng thư mục của worktree được chỉ định** (ví dụ File > Open Folder > `/Users/johnlebin/Downloads/Ventlore-FE`).
  - **Tuyệt đối không mở nhiều chat trong cùng một thư mục gốc** để giả lập làm việc song song, vì điều này sẽ dẫn tới ghi đè file và xung đột git index.
  - Giao toàn bộ nội dung file prompt tương ứng (`Ventlore_01_Frontend_Parallel_v2.md` cho FE, `Ventlore_02_Backend_Parallel_v2.md` cho BE, `Ventlore_03_Onchain_Parallel_v2.md` cho CHAIN).
