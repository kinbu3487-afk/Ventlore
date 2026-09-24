# Hướng Dẫn Thực Hiện Nhiệm Vụ (RUN_TASK)

Tài liệu này hướng dẫn chi tiết quy trình từng bước cho Agent (Antigravity) khi thực hiện một nhiệm vụ trên repository **Ventlore** theo chu trình kết hợp **Execution Loop + Task Loop + Product Loop**.

---

## 1. Chuẩn bị & Khởi động (Pre-flight)

1. **Đọc tài liệu bắt buộc trước khi code:**
   - `AGENTS.md` (các quy tắc bất biến, bảo mật, và hợp đồng định danh).
   - `docs/loops/POLICY.md` (chính sách vận hành).
   - `docs/PROJECT_STATE.md` (trạng thái hệ thống thực tế).
   - `docs/HANDOFF.md` (bàn giao chặng gần nhất).
   - Các tài liệu đặc tả liên quan đến nhiệm vụ: `DOMAIN_RULES.md`, `ID_CONTRACT.md`, `PERMISSIONS.md`, `STATE_MACHINES.md`.

2. **Kiểm tra trạng thái Git và công cụ:**
   - Kiểm tra `git status` xem có thay đổi nào chưa commit không.
   - Xác nhận môi trường: Node.js, pnpm, Python, GitHub CLI (`gh`).

3. **Chọn nhiệm vụ (Product Loop):**
   - **Ưu tiên 1:** Nếu có một Issue / PR đang làm dở dang được ghi nhận trong `docs/HANDOFF.md`, tiếp tục trên nhánh đó.
   - **Ưu tiên 2:** Nếu bắt đầu nhiệm vụ mới, chọn duy nhất **một** Issue có nhãn `ready` do Bin chỉ định.
   - Không chọn Issue đang ở trạng thái `backlog` hoặc `blocked` khi chưa có quyết định của Bin.
   - Nếu không có Issue nào ở trạng thái `ready`, dừng lại và báo cáo Bin.

4. **Khởi tạo trạng thái thực hiện:**
   - Chuyển nhãn Issue từ `ready` sang `in-progress` (chỉ duy nhất 1 nhãn trạng thái active).
   - Tạo nhánh làm việc theo định dạng: `<loại>/<tên-ngắn-issue>` (ví dụ: `feat/fe-01-reader-flow`, `fix/receipt-key-calc`).
   - Kiểm tra nhánh remote xem đã có nhánh trùng tên hay chưa trước khi tạo.

---

## 2. Triển khai & Vòng lặp Nhiệm vụ (Execution & Task Loop)

1. **Triển khai mã nguồn:**
   - Bám sát tiêu chí nghiệm thu (Acceptance Criteria) được mô tả trong Issue.
   - Tôn trọng các bất biến kiến trúc (ADR trong `docs/DECISIONS.md`): không đảo ngược stack, không đổi công thức Keccak-256 ABI encode, không gộp tài khoản user, không đổi tỷ lệ tip 80/20.
   - Giữ nguyên vẹn các file không thuộc phạm vi nhiệm vụ.

2. **Chạy kiểm tra cục bộ:**
   - Chạy lệnh kiểm tra tổng hợp:
     ```bash
     pnpm run verify
     ```
   - Chạy các kiểm tra bổ sung theo đặc thù nhiệm vụ (ví dụ: kiểm tra giao diện bằng trình duyệt nếu là nhiệm vụ Frontend, kiểm tra script nếu là dữ liệu).
   - Tuyệt đối không thêm `skip` hay xóa assertion để che giấu lỗi.

3. **Xử lý phản hồi lỗi (Task Loop - Tối đa 3 vòng sửa):**
   - **Vòng 1-3:** Nếu lệnh kiểm tra hoặc build báo lỗi:
     1. Đọc kỹ log báo lỗi, xác định nguyên nhân gốc rễ.
     2. Đưa ra phương án sửa đổi mã nguồn hoặc cấu hình.
     3. Thực hiện sửa đổi và chạy lại `pnpm run verify`.
     4. Ghi nhận số vòng sửa đã sử dụng và nguyên nhân vào nhật ký lượt chạy.
   - **Nếu vượt quá 3 vòng sửa hoặc gặp sự cố bị chặn:**
     - Đổi nhãn Issue sang `blocked`.
     - Ghi nhận chi tiết: lỗi gặp phải, các giải pháp đã thử, nguyên nhân không tiến triển, và thông tin/quyết định cần Bin hỗ trợ.
     - Dừng lại, không tiếp tục sửa mò.

---

## 3. Đẩy thay đổi & Theo dõi CI (Product Loop)

1. **Commit & Push:**
   - Commit mã nguồn với thông điệp rõ ràng theo chuẩn Conventional Commits (ví dụ: `feat(web): hoàn thiện luồng khám phá FE-01`).
   - Push nhánh lên GitHub remote:
     ```bash
     git push -u origin <tên-nhánh>
     ```

2. **Tạo / Cập nhật Pull Request:**
   - Mở PR hướng về nhánh `main` sử dụng mẫu `.github/pull_request_template.md`.
   - Tiêu đề PR thể hiện rõ mã nhiệm vụ (ví dụ: `[FE-01] Hoàn thiện luồng Khám phá → Địa điểm → Bài viết`).
   - Điền đầy đủ thông tin: liên kết Issue (`Closes #...`), tóm tắt thay đổi, đối chiếu từng tiêu chí nghiệm thu, lệnh kiểm tra đã chạy, và cách mở bản thử (preview).

3. **Đọc kết quả GitHub Actions CI:**
   - Dùng GitHub CLI kiểm tra trạng thái CI:
     ```bash
     gh pr checks
     ```
   - Nếu workflow CI thất bại, coi đây là một phản hồi cần sửa trong giới hạn 3 vòng của Task Loop. Đọc log lỗi bằng `gh run view --log-failed` và tiến hành sửa chữa.

---

## 4. Bàn giao & Chờ nghiệm thu (Handoff to Oversight)

1. **Lập báo cáo nhiệm vụ:**
   - Tạo file báo cáo tại `docs/loops/reports/<MÃ-NHIỆM-VỤ>.md` theo mẫu `docs/loops/REPORT_TEMPLATE.md`.

2. **Cập nhật tài liệu trạng thái:**
   - Cập nhật `docs/PROJECT_STATE.md` với các tính năng/thành phần thực tế đã được xây dựng và kiểm chứng.
   - Cập nhật `docs/HANDOFF.md`: ghi nhận commit hash, PR link, trạng thái CI, các lệnh kiểm tra đã chạy, và hướng dẫn cho người nghiệm thu.

3. **Cập nhật nhãn Issue:**
   - Gỡ nhãn `in-progress`, gắn nhãn `review`.

4. **Dừng lại bàn giao cho Bin:**
   - Thông báo cho Bin gói nghiệm thu gồm: URL PR, liên kết kết quả CI, tóm tắt các tiêu chí đã đối chiếu, và cách chạy thử nghiệm.
   - **DỪNG LẠI TẠI ĐÂY.** Không tự ý merge PR, không tự động nhận Issue tiếp theo.
