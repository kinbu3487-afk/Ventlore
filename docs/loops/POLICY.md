# Chính Sách Vận Hành 5 Loop (POLICY)

Tài liệu này xác định các chính sách bắt buộc khi vận hành 5 loop (Execution, Task, Product, System, Oversight) trên repository **Ventlore**.

---

## 1. Nguyên tắc cốt lõi giai đoạn đầu

1. **Một việc tại một thời điểm:**
   - Mỗi lượt chỉ xử lý đúng một GitHub Issue đã được Bin chốt yêu cầu, phạm vi và gắn nhãn `ready`.
   - Tuyệt đối không tự ý lấy nhiệm vụ mới khi nhiệm vụ hiện tại chưa được bàn giao hoặc nghiệm thu.

2. **Một Issue - Một nhánh - Một PR:**
   - Mỗi Issue gắn liền với một nhánh làm việc và một Pull Request (PR) tương ứng.
   - Nếu Issue đã có nhánh hoặc PR đang dở dang, Agent phải tiếp tục trên đúng nhánh đó thay vì tạo nhánh mới làm phân mảnh lịch sử.

3. **Tiêu chí nghiệm thu bất biến (Immutable Acceptance Criteria):**
   - Tiêu chí nghiệm thu (Acceptance Criteria) trong Issue phải kiểm chứng được bằng lệnh chạy thực tế hoặc bằng chứng cụ thể.
   - Tiêu chí phải giữ ổn định trong suốt lượt chạy; không tự ý hạ tiêu chí, thêm `skip` hay xóa bỏ kiểm thử chỉ để có kết quả xanh. Thay đổi tiêu chí phải do Bin quyết định và chốt lại trong Issue.

4. **Phạm vi quyền hạn của Agent:**
   - **Được phép:** Đọc và sửa đổi mã nguồn dự án trong phạm vi Issue; cài đặt dependency cần thiết trong repo; chạy các lệnh kiểm tra (verify, test, lint, typecheck); commit mã nguồn; push nhánh lên remote; tạo hoặc cập nhật Issue và PR.
   - **Điểm dừng bắt buộc:** Agent hoàn thành việc và dừng lại ở trạng thái `review` để Bin nghiệm thu thực tế.
   - **Quyền riêng của Bin:** Quyết định merge PR vào nhánh `main`, phát hành sản phẩm (release/deploy) và thực hiện các giao dịch tiền tệ/onchain thật thuộc thẩm quyền duy nhất của Bin.

5. **Giới hạn 3 vòng sửa lỗi (Task Loop Limit):**
   - Sau lần triển khai đầu tiên, Agent được phép thực hiện tối đa **3 vòng sửa lỗi** (tính tổng cộng các phản hồi từ kiểm tra cục bộ, kết quả CI của GitHub Actions, và ý kiến review).
   - Nếu sau 3 vòng vẫn không tiến triển, hoặc gặp rào cản thiếu quyền hạn/thiếu đầu vào/môi trường bị chặn:
     - Gắn nhãn trạng thái `blocked` cho Issue.
     - Lưu lại chi tiết tiến độ đã làm, nguyên nhân tắc nghẽn và câu hỏi cần giải quyết vào báo cáo và `docs/HANDOFF.md`.
     - Dừng lại báo cáo cho Bin, không lặp lại vô tận.

6. **Tính toàn vẹn của kiểm thử (Test Integrity):**
   - Báo cáo kết quả trung thực: chỉ báo `PASS` cho các lệnh đã thực sự chạy và thành công.
   - Khi kiểm thử thất bại, phải tìm đúng nguyên nhân gốc rễ và sửa đổi mã nguồn. Nếu test case bị sai so với đặc tả, việc sửa test phải đi kèm lý do rõ ràng và bằng chứng đối chiếu tài liệu nguồn.

7. **Tuân thủ Hợp đồng định danh (ID Contract):**
   - Mọi định danh nghiệp vụ trong mã nguồn và cơ sở dữ liệu phải dùng UUIDv7 theo đúng `docs/ID_CONTRACT.md`.
   - Số hiệu Issue (ví dụ: `#12`, `FE-01`) chỉ là mã quản lý công việc của GitHub, tuyệt đối không thay thế cho `taskId` (UUID) hay các ID chuẩn trong miền dữ liệu của Ventlore.

---

## 2. Vòng đời trạng thái Issue (Product Loop States)

Mỗi Issue trên GitHub chỉ mang duy nhất một nhãn trạng thái hoạt động tại một thời điểm:

```text
[backlog] ──(Bin chốt spec)──> [ready] ──(Agent nhận việc)──> [in-progress]
                                                                  │
                              ┌───────────────────────────────────┼──────────────────────────────────┐
                              │                                   │                                  │
                              ▼                                   ▼                                  ▼
                         [blocked]                            [review]                           [closed]
                   (Hết 3 vòng sửa hoặc                (CI xanh, test đạt,               (Bin nghiệm thu thực tế
                    thiếu quyền/đầu vào)                sẵn sàng nghiệm thu)              và merge PR vào main)
```

- **`backlog`**: Ý tưởng hoặc yêu cầu cần làm, chưa đủ chi tiết hoặc chưa được ưu tiên.
- **`ready`**: Bin đã chốt mục tiêu, phạm vi, tài liệu nguồn, phụ thuộc và tiêu chí nghiệm thu rõ ràng; sẵn sàng để Agent tiếp nhận.
- **`in-progress`**: Agent đang triển khai code, kiểm thử hoặc sửa lỗi trên nhánh tương ứng.
- **`blocked`**: Bị chặn do vượt quá 3 vòng sửa lỗi, lỗi môi trường/hạ tầng, hoặc cần Bin làm rõ quyết định.
- **`review`**: Agent đã hoàn thành triển khai, toàn bộ kiểm tra `verify` và CI đạt, đã nộp báo cáo và sẵn sàng để Bin nghiệm thu.
- **Đóng Issue (`closed`)**: Chỉ thực hiện sau khi Bin đã nghiệm thu thực tế và PR đã được merge vào `main`.

---

## 3. Nguồn thông tin chuẩn (Single Source of Truth)

- **Quy tắc & Bất biến:** `AGENTS.md`, `docs/DOMAIN_RULES.md`, `docs/ID_CONTRACT.md`, `docs/PERMISSIONS.md`, `docs/STATE_MACHINES.md`.
- **Trạng thái thực tế:** `docs/PROJECT_STATE.md` (những gì đã chạy thật, những gì còn scaffold/thiếu).
- **Bàn giao chặng:** `docs/HANDOFF.md` (nhánh, commit, PR, lệnh kiểm tra, công việc tiếp theo).
- **Quyết định kiến trúc:** `docs/DECISIONS.md` (ADR).
- **Vấn đề mở:** `docs/OPEN_QUESTIONS.md`.
- **Lịch sử các lượt chạy:** `docs/loops/reports/` (báo cáo chi tiết từng lần chạy).
