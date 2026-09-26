# Ventlore Synchronization Log (SYNC.md)

**Phiên bản:** 2.0  
**Ngày thiết lập:** 25/09/2026  
**Chủ trì:** Integration Coordinator (Merge Lane)  
**Tài liệu điều phối:** `docs/prompts/Ventlore_04_Merge_Parallel_v2.md`  

---

## 1. Điểm Chốt Nền Chung (Base Baseline Ref)

- **Base Tag Ref:** `v2-parallel-base`
- **Thời điểm chốt:** Giai đoạn A hoàn tất
- **Trạng thái hợp đồng:**
  - ID Contract v0.3 (34 định danh, 10 blockchain key kinds)
  - OpenAPI 3.1 (`docs/api/openapi.yaml`)
  - Domain Rules v0.3, State Machines v0.3, Permissions v0.3
  - UI Round 5 Single-Hero HomePage, 6 ngôn ngữ, export 199/199 HTML
  - CI Baseline: `pnpm run verify` PASS 100%

---

## 2. Nhật Ký Đồng Bộ & Checkpoint (Sync History)

| Thời điểm | Thao tác / Mốc | Nhánh gửi | Commit SHA nguồn | Hợp đồng thay đổi | Nhánh đã nhận | Ghi chú & Kiểm thử |
|---|---|---|---|---|---|---|
| **2026-09-25** | **Khởi tạo Giai đoạn A** | `MERGE` | Tag: `v2-parallel-base` | Khởi tạo baseline chung v0.3.0 | `parallel/v2-fe`<br>`parallel/v2-be`<br>`parallel/v2-chain`<br>`parallel/v2-integration` | Thiết lập 4 worktree độc lập từ cùng một base ref cố định. Verify đạt 100%. |
| *Chờ* | **Mốc I1 (Đọc & Ngôn ngữ)** | `FE` & `BE` | *Chờ checkpoint* | API Read DTO, i18n catalogs | `MERGE` (tổng hợp) | Nối FE Reader với BE API & PostgreSQL. |
| *Chờ* | **Mốc I2 (Đóng góp & Review)**| `FE` & `BE` | *Chờ checkpoint* | Review & Task APIs | `MERGE` (tổng hợp) | Nối S06–S12, S24–S27, S30 với Review lifecycle. |
| *Chờ* | **Mốc I3 (Ví, Tiền & Quyền lợi)**| `FE`, `BE`, `CHAIN` | *Chờ checkpoint* | Smart contracts ABI, Manifest | `MERGE` (tổng hợp) | Tích hợp Route, Payments, SBT, NFT trên Anvil. |

---

## 3. Quy Trình Đồng Bộ Giữa Các Nhánh (Sync Protocol)

1. **Trước khi đồng bộ:**
   - Lane gửi yêu cầu đồng bộ phải tạo commit cục bộ có thông điệp rõ ràng trên nhánh của mình.
   - Worktree của lane gửi phải ở trạng thái sạch (`git status` clean), không có file dở dang.
   - Tạm dừng ghi mã nguồn trong cửa sổ đồng bộ.
2. **Tại Worktree MERGE:**
   - Merge Lane fetch/cherry-pick hoặc merge commit từ nhánh lane tương ứng.
   - Giải quyết conflict theo ý nghĩa nghiệp vụ tại `docs/parallel/CONTRACTS.md`.
   - Nếu có thay đổi `package.json`, chạy `pnpm install` để cập nhật `pnpm-lock.yaml`.
   - Chạy kiểm thử xác minh `pnpm run verify`.
3. **Phân phối về các Lane:**
   - Commit hợp nhất được fast-forward hoặc merge về các nhánh `parallel/v2-fe`, `parallel/v2-be`, `parallel/v2-chain`.
   - Các lane cập nhật lại và chạy kiểm tra trước khi tiếp tục công việc.
