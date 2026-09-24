# Cross-Lane Change Requests (`docs/parallel/requests/`)

Thư mục này là nơi các Lane (FE, BE, CHAIN) gửi yêu cầu thay đổi hợp đồng giao tiếp chung (Cross-layer changes), ví dụ: bổ sung trường dữ liệu API, thay đổi endpoint, hoặc đề xuất cập nhật ABI smart contract.

---

## Quy Ước Đặt Tên File

- Tên file bắt đầu bằng tiền tố lane:
  - `FE-<tên-ngắn>.md` (ví dụ `FE-place-filter-params.md`)
  - `BE-<tên-ngắn>.md` (ví dụ `BE-author-nft-claim-endpoint.md`)
  - `CHAIN-<tên-ngắn>.md` (ví dụ `CHAIN-registry-event-signature.md`)

---

## Mẫu Nội Dung Yêu Cầu

```markdown
# Yêu Cầu Thay Đổi: [Tiêu đề yêu cầu]

- **Lane đề xuất:** FE | BE | CHAIN
- **Ngày đề xuất:** YYYY-MM-DD
- **Mức độ ảnh hưởng:** BREAKING | NON-BREAKING | ENHANCEMENT

### 1. Lý do cần thay đổi
[Mô tả tại sao cần thay đổi, tính năng liên quan]

### 2. Chi tiết thay đổi hợp đồng (Schema Before / After)
\`\`\`typescript
// Trước
// Sau
\`\`\`

### 3. Các Consumer bị ảnh hưởng
- [ ] FE
- [ ] BE
- [ ] CHAIN

### 4. Phương án kiểm tra tương thích ngược
[Các ca kiểm thử để đảm bảo hệ thống không bị hồi quy]
```
