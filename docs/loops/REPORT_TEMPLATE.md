# Mẫu Báo Cáo Nhiệm Vụ (REPORT_TEMPLATE)

File báo cáo của từng nhiệm vụ được lưu tại `docs/loops/reports/<MÃ-NHIỆM-VỤ>.md` (ví dụ: `LOOP-00-setup.md`, `FE-01-reader-flow.md`).

---

# Báo Cáo Nhiệm Vụ: [TÊN_NHIỆM_VỤ]

- **Mã nhiệm vụ:** `[MÃ_NHIỆM_VỤ]` (ví dụ: LOOP-00, FE-01)
- **Thời điểm thực hiện:** `[YYYY-MM-DD HH:mm UTC+7]`
- **Trạng thái kết thúc:** `[review | blocked | in-progress]`
- **Người thực hiện:** Antigravity (AI Agent)
- **Người nghiệm thu:** Bin

---

## 1. Thông tin nhiệm vụ (Task Scope)

- **GitHub Issue:** `[URL hoặc #Issue]`
- **Mục tiêu chính:** `[Mô tả ngắn gọn mục tiêu của nhiệm vụ]`
- **Tài liệu nguồn đã đối chiếu:**
  - `[File 1]`
  - `[File 2]`
- **Phụ thuộc:** `[Liệt kê các phụ thuộc cần thiết hoặc "Không có"]`

---

## 2. Phiên bản & Môi trường (Environment & Artifacts)

- **Nhánh Git:** `[tên nhánh, ví dụ: chore/loop-setup]`
- **Commit SHA:** `[hash commit đã kiểm tra]`
- **Pull Request:** `[URL PR]`
- **GitHub Actions CI Run:** `[URL hoặc trạng thái CI]`
- **Môi trường cục bộ:** Node `[version]`, pnpm `[version]`, Python `[version]`, gh `[version]`.

---

## 3. Kết quả đối chiếu tiêu chí nghiệm thu (Acceptance Criteria)

| STT | Tiêu chí nghiệm thu | Kết quả | Bằng chứng kiểm chứng |
|---|---|---|---|
| 1 | `[Tiêu chí 1]` | `[ĐẠT / CHƯA ĐẠT / CHƯA KIỂM TRA]` | `[Lệnh, log hoặc ảnh chụp màn hình]` |
| 2 | `[Tiêu chí 2]` | `[ĐẠT / CHƯA ĐẠT / CHƯA KIỂM TRA]` | `[Lệnh, log hoặc ảnh chụp màn hình]` |

---

## 4. Các lệnh kiểm tra thực tế (Verification Commands)

### 4.1 Lệnh kiểm tra tổng hợp
- **Lệnh:** `pnpm run verify`
- **Kết quả:** `[PASS / FAIL]`
- **Chi tiết kết quả:**
  ```text
  [Trích xuất output thật từ terminal]
  ```

### 4.2 Các kiểm tra bổ sung (nếu có)
- **Lệnh:** `[Lệnh bổ sung, ví dụ: E2E, UI test, Python script]`
- **Kết quả:** `[PASS / FAIL]`

---

## 5. Nhật ký các vòng sửa lỗi (Task Loop Iterations)

- **Tổng số vòng sửa sau lần triển khai đầu:** `[0 / 1 / 2 / 3]` (Tối đa 3 vòng)
- **Chi tiết từng vòng:**
  - **Vòng 1:**
    - *Hiện tượng/Lỗi:* `[Mô tả lỗi]`
    - *Nguyên nhân:* `[Phân tích nguyên nhân]`
    - *Cách khắc phục:* `[File và thay đổi đã thực hiện]`
  - **Vòng 2:** *(nếu có)*
  - **Vòng 3:** *(nếu có)*

---

## 6. Đánh giá & Rà soát (Review & Caveats)

- **Những phần đã hoàn thành:** `[Tóm tắt code và tính năng đã xong]`
- **Những phần chưa kiểm tra / chưa triển khai:** `[Ghi rõ các giới hạn kỹ thuật, stub, mock adapter]`
- **Phát hiện / Đề xuất cải tiến:** `[Ghi chú thêm nếu phát hiện vấn đề kỹ thuật liên quan]`

---

## 7. Tiến độ & Bàn giao tiếp theo (Next Steps)

- **Trạng thái bàn giao:** Dừng ở trạng thái `review` để Bin nghiệm thu thực tế.
- **Hướng dẫn mở bản thử nghiệm (Preview instructions):**
  ```bash
  [Các bước chạy để Bin kiểm tra bản chạy thử]
  ```
- **Nhiệm vụ tiếp theo đề xuất:** `[Mã nhiệm vụ tiếp theo]`
