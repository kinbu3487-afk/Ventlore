---
name: Nhiệm vụ phát triển (Task)
about: Mẫu giao việc chuẩn cho 5 Loop của Ventlore (Execution, Task, Product)
title: '[MÃ-TASK]: <Tên nhiệm vụ ngắn gọn>'
labels: ['ready']
assignees: ''
---

## 1. Mục tiêu (Objective)
<!-- Mô tả rõ kết quả mong đợi sau khi nhiệm vụ này hoàn thành. Cần giải quyết vấn đề gì? -->

## 2. Phạm vi (Scope)
- **Trong phạm vi (In-Scope):**
  - <!-- Liệt kê các phần việc, module, màn hình, chức năng cụ thể được phép sửa/thêm -->
- **Ngoài phạm vi (Out-of-Scope):**
  - <!-- Liệt kê những phần việc không được đụng tới hoặc thuộc về các task khác -->

## 3. Tài liệu nguồn & Ràng buộc kiến trúc (Source Docs & Invariants)
- [ ] `AGENTS.md` (Quy tắc bắt buộc, bảo mật, không lộ secrets)
- [ ] `docs/DOMAIN_RULES.md` (Quy tắc nghiệp vụ liên quan)
- [ ] `docs/ID_CONTRACT.md` (Hợp đồng định danh, UUIDv7, displayCode)
- [ ] `docs/PROJECT_STATE.md` & `docs/HANDOFF.md` (Trạng thái hiện tại & bàn giao)
- [ ] <!-- Tài liệu khác nếu có, ví dụ: SCREEN_COVERAGE, COMPONENT_COVERAGE, CHAIN_INTERFACE -->

## 4. Phụ thuộc (Dependencies)
<!-- Những điều kiện tiền đề cần hoàn thành trước khi task này bắt đầu. Nếu chưa đủ phụ thuộc, gắn nhãn blocked -->
- Không có / hoặc: <!-- Danh sách phụ thuộc -->

## 5. Tiêu chí nghiệm thu (Acceptance Criteria)
<!-- Tiêu chí phải kiểm chứng được, rõ ràng và bất biến trong suốt lượt chạy -->
- [ ] 1. <!-- Tiêu chí 1 -->
- [ ] 2. <!-- Tiêu chí 2 -->
- [ ] 3. <!-- Tiêu chí 3 -->
- [ ] 4. Lệnh kiểm tra `pnpm run verify` chạy thành công (PASS 100%).

## 6. Cách kiểm tra & Bằng chứng nghiệm thu (Verification Method)
<!-- Hướng dẫn cách kiểm chứng: lệnh terminal, script test, hoặc các bước kiểm tra giao diện bằng trình duyệt -->
```bash
# Ví dụ lệnh kiểm tra
pnpm run verify
```
