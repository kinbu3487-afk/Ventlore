# Tài Liệu Bàn Giao (HANDOFF)

**Chặng hoàn thành gần nhất:** LOOP-00 — Thiết lập quy trình 5 loop, CI baseline và bộ kiểm tra tổng hợp  
**Nhiệm vụ tiếp theo:** Nghiệm thu FE-01 — Khám phá → Địa điểm → Bài viết (Mục 5 trong hướng dẫn)  
**Thời điểm bàn giao:** 24/09/2026 10:15 UTC+7  
**Nhánh làm việc:** `chore/loop-setup`  
**Báo cáo chi tiết:** `docs/loops/reports/LOOP-00-setup.md`

---

## 1. Kết quả đạt được tại LOOP-00

1. **Khóa quy trình vận hành 5 Loop:**
   - Cập nhật [AGENTS.md](AGENTS.md) bổ sung Mục 0 trỏ đến toàn bộ tài liệu quy trình.
   - Hoàn thành bộ 4 tài liệu tại `docs/loops/`:
     - [POLICY.md](loops/POLICY.md): Chính sách 1 issue tại 1 thời điểm (`ready`), 1 PR tương ứng, tối đa 3 vòng sửa lỗi (Task loop), dừng ở `review` để Bin nghiệm thu, không hạ gate kiểm thử, dùng UUIDv7 theo ID Contract.
     - [RUN_TASK.md](loops/RUN_TASK.md): Hướng dẫn từng bước từ nhận việc, code, verify cục bộ, push nhánh, mở PR và theo dõi CI.
     - [SYSTEM_REVIEW.md](loops/SYSTEM_REVIEW.md): Hướng dẫn đánh giá hệ thống định kỳ sau mỗi cụm ~5 nhiệm vụ.
     - [REPORT_TEMPLATE.md](loops/REPORT_TEMPLATE.md): Mẫu báo cáo nhiệm vụ chuẩn.
   - Thư mục `docs/loops/reports/` lưu trữ báo cáo thực tế, khởi đầu với `LOOP-00-setup.md`.

2. **Chuẩn hóa mẫu GitHub Issue và Pull Request:**
   - `.github/ISSUE_TEMPLATE/task.md`: Mẫu Issue gồm 6 mục (Mục tiêu, Trong/Ngoài phạm vi, Tài liệu nguồn, Phụ thuộc, Tiêu chí nghiệm thu, Cách kiểm tra).
   - `.github/ISSUE_TEMPLATE/config.yml`: Cấu hình Issue forms trỏ về tài liệu policy.
   - `.github/pull_request_template.md`: Mẫu PR chuẩn gồm liên kết Issue (`Closes #...`), tóm tắt thay đổi, ma trận tiêu chí, bằng chứng kiểm tra, caveats và hướng dẫn chạy thử.

3. **Thiết lập lệnh kiểm tra tổng hợp (`pnpm run verify`):**
   - Lệnh `pnpm run verify` kiểm tra thực tế 4 lớp và đạt **PASS 100%**:
     1. `python3 scripts/validate_foundation.py`: Xác thực 34/34 ID Registry, Keccak-256 ABI encode, UUIDv7, Brand Kit 14/14 assets, 35 màn hình, 50 components, 72 sự kiện.
     2. `pnpm -r run typecheck`: Typecheck nghiêm ngặt trên toàn bộ 6 workspace projects (không có lỗi TS).
     3. `pnpm -r run lint`: Lint ứng dụng Next.js với cấu hình ESLint 8 / next-lint ổn định.
     4. `pnpm -r run build`: Build Next.js production và Worker TypeScript ra `dist/`.

4. **Workflow CI GitHub Actions (`.github/workflows/quality.yml`):**
   - Kích hoạt khi có PR vào `main` hoặc push trực tiếp vào `main`.
   - Cơ chế concurrency hủy lượt chạy cũ khi có commit mới trên cùng PR (`cancel-in-progress: true`).
   - Timeout 15 phút, cài Node 20.x, pnpm 9.15.4 theo `pnpm-lock.yaml`, Python 3.13, và chạy `pnpm run verify`.

5. **Sửa lỗi thực tế phát sinh (Task Loop):**
   - Sửa lỗi TypeScript TS1470 trong `@ventlore/worker` bằng cách thêm `"type": "module"`.
   - Tạo root layout chuẩn `apps/web/src/app/layout.tsx` cho Next.js 15 App Router.
   - Cài đặt cấu hình ESLint tương thích cho Next.js web application.

---

## 2. Hướng dẫn thiết lập bảo vệ nhánh `main` (Branch Protection)

Sau khi PR của nhánh `chore/loop-setup` được tạo và kiểm tra CI chạy lần đầu trên GitHub, Bin thực hiện cấu hình bảo vệ nhánh `main` theo các bước:

1. Mở trang quản trị repository trên trình duyệt:  
   `https://github.com/kinbu3487-afk/Ventlore/settings/branches` (hoặc `Rules > Rulesets`).
2. Nhấn **Add rule** (hoặc **New ruleset**) với tên `Protect Main`.
3. Áp dụng cho target branch: `main` (hoặc `fnmatch: main`).
4. Bật tùy chọn: **Require a pull request before merging** (Yêu cầu thay đổi phải đi qua PR).
5. Bật tùy chọn: **Require status checks to pass before merging** (Yêu cầu kiểm tra CI phải đạt trước khi merge).
6. Trong danh sách status checks, chọn đúng tên check do workflow `quality.yml` báo:
   - **`Lint, Typecheck & Verification`** (tên job trong `quality.yml`).
7. Bật tùy chọn: **Require branches to be up to date before merging**.
8. Với mô hình phát triển cá nhân một người, không cần bật "Require approvals" từ người khác. Bin là người trực tiếp đọc PR, kiểm tra kết quả và quyết định nhấn merge.

---

## 3. Hướng dẫn kích hoạt nhiệm vụ tiếp theo (FE-01)

Sau khi Bin nghiệm thu và merge PR `chore/loop-setup` vào `main`:

1. Tạo một GitHub Issue mới bằng mẫu **Nhiệm vụ phát triển (Task)** với tiêu đề:
   `[FE-01]: Nghiệm thu FE-01: Khám phá → Địa điểm → Bài viết`
   và gắn nhãn `ready`.
2. Hoặc dán prompt sau vào Antigravity để tiếp tục:

```text
Đọc AGENTS.md, docs/loops/POLICY.md, RUN_TASK.md, PROJECT_STATE.md và HANDOFF.md.

Thực hiện một chu kỳ Product loop trên kinbu3487-afk/Ventlore:
- Ưu tiên tiếp tục Issue/PR đang làm dở nếu đúng nhiệm vụ và chưa có agent khác xử lý.
- Nếu không có việc đang làm, chọn đúng một Issue ready theo ưu tiên Bin đã chốt và đã đủ phụ thuộc. Không có việc phù hợp thì dừng.
- Xác nhận Issue, tiêu chí nghiệm thu và nhánh sẽ dùng; cập nhật in-progress.
- Đọc các tài liệu nghiệp vụ liên quan; thực hiện phần code cần thiết.
- Chạy kiểm tra local và đối chiếu từng tiêu chí.
- Push nhánh, tạo/cập nhật PR liên kết Issue và đọc kết quả GitHub Actions.
- Nếu lỗi, đọc log, sửa nguyên nhân và kiểm tra lại. Tổng tối đa ba vòng sửa sau lần triển khai đầu.
- Nếu hết giới hạn, thiếu đầu vào hoặc không tiến triển, cập nhật blocked, lưu tiến độ và nêu điều cần quyết định.
- Nếu đạt, cập nhật review; ghi báo cáo, PROJECT_STATE và HANDOFF; đưa link PR, CI và cách mở bản thử.

Tôi cho phép sửa code trong phạm vi Issue, chạy kiểm tra, commit/push nhánh, tạo/cập nhật Issue và PR. Dừng để tôi nghiệm thu trước merge và trước khi lấy Issue tiếp theo.
```
