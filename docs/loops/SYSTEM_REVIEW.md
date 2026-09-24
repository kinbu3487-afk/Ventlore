# Hướng Dẫn Đánh Giá Hệ Thống (SYSTEM_REVIEW)

Tài liệu này hướng dẫn cách vận hành **System Loop** trên repository **Ventlore** nhằm cải tiến liên tục quy trình, prompt, công cụ và tài liệu dựa trên dữ liệu thực tế từ các lần chạy.

---

## 1. Thời điểm & Mục đích kích hoạt

- **Chu kỳ thực hiện:** Kích hoạt định kỳ sau một cụm khoảng **5 nhiệm vụ** đã hoàn thành có lưu báo cáo tại `docs/loops/reports/`.
- **Mục tiêu:**
  - Phát hiện các điểm nghẽn có tính lặp lại (vấn đề hay gặp, hiểu nhầm spec, lỗi ID, xung đột kiểu dữ liệu).
  - Tối ưu hóa bộ quy tắc (rules), hướng dẫn (prompts) hoặc công cụ bổ trợ (test scripts, linters).
  - Giảm thiểu số vòng sửa lỗi (repair rounds) và thời gian thực thi của các nhiệm vụ tiếp theo.

---

## 2. Quy trình 6 bước thực hiện System Review

1. **Tổng hợp dữ liệu thực tế từ các báo cáo:**
   - Đọc toàn bộ các file báo cáo trong thư mục `docs/loops/reports/`.
   - Thống kê:
     - Các loại lỗi lặp đi lặp lại nhiều lần.
     - Số vòng sửa lỗi trung bình của mỗi nhiệm vụ.
     - Các tiêu chí nghiệm thu thường bị bỏ sót trong lần chạy đầu tiên.
     - Các điểm mơ hồ trong tài liệu khiến Agent phải hỏi lại Bin hoặc bị `blocked`.

2. **Đề xuất duy nhất một cải tiến trọng tâm (Single Targeted Hypothesis):**
   - Đề xuất đúng **một** thay đổi nhỏ, rõ ràng vào:
     - Hệ thống prompt hoặc tài liệu quy tắc (`AGENTS.md`, `POLICY.md`, `RUN_TASK.md`).
     - Tài liệu hợp đồng hoặc đặc tả (`ID_CONTRACT.md`, `DOMAIN_RULES.md`).
     - Script kiểm tra tự động hoặc cấu hình công cụ.
   - Nêu rõ giả thuyết tác dụng: *“Nếu bổ sung quy tắc X vào AGENTS.md, tỷ lệ lỗi Y sẽ giảm xuống Z%”*.

3. **Thiết kế phép thử nghiệm đối chứng (A/B hoặc Baseline Comparison):**
   - So sánh cấu hình cũ và cấu hình mới trên các nhiệm vụ thử tương đương.
   - Dùng cùng một snapshot mã nguồn ban đầu, cùng điều kiện môi trường và bộ tiêu chí kiểm tra độc lập.
   - Giữ một số nhiệm vụ chưa từng dùng để kiểm tra ngoài các ví dụ đã biết (chống overfitting vào prompt).

4. **Đo lường & Đánh giá kết quả:**
   - **Ưu tiên 1 - Tính đúng đắn:** Tỷ lệ đạt tiêu chí nghiệm thu ngay vòng đầu tiên (First-pass acceptance rate).
   - **Ưu tiên 2 - Hiệu năng:** Số vòng sửa lỗi trung bình (Task loop iterations).
   - **Ưu tiên 3 - Tài nguyên:** Thời gian thực thi và chi phí token (nếu có công cụ đo).
   - Tuyệt đối không đánh đổi độ chính xác hay chất lượng mã nguồn để lấy tốc độ hoặc tiết kiệm token.

5. **Lập hồ sơ đề xuất thay đổi (RFC / System Change Proposal):**
   - Ghi nhận chi tiết: lý do thay đổi, dữ liệu đối chứng, tác động thực tế, phương án quay lại (rollback plan) nếu phát sinh tác dụng phụ ngoài ý muốn.

6. **Phê duyệt & Áp dụng:**
   - Trình bày hồ sơ cho Bin xem xét.
   - Khi Bin đồng ý, cập nhật quyết định vào `docs/DECISIONS.md`, cập nhật file quy tắc tương ứng và mở PR thay đổi quy trình.
   - Nếu đề xuất không mang lại hiệu quả đo lường được, giữ nguyên cấu hình cũ.
