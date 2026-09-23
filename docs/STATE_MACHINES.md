# Các Máy Trạng Thái Thực Thể (STATE_MACHINES)

Tài liệu này định nghĩa độc lập các máy trạng thái theo `Ventlore_Logic_ID_DB_v0_3.pdf` (Mục 09) và `Ventlore_Event_UI_Spec_v0_3.pdf` (Mục 07).

> [!IMPORTANT]
> Tuyệt đối không gộp chung các trục trạng thái khác nhau (như visibility, accessTier, verification, task work, payable, grant, route) thành một huy hiệu hoặc một cột enum duy nhất.

---

## 1. Vòng Đời Địa Điểm (Place Lifecycle)

Áp dụng cho bảng `places` (`placeId`).

```mermaid
stateDiagram-v2
    [*] --> CANDIDATE: Đề xuất điểm mới (U02)
    CANDIDATE --> ACTIVE: Được duyệt (APPROVED)
    CANDIDATE --> MERGED: Phát hiện trùng lặp với điểm đã có
    CANDIDATE --> REJECTED: Từ chối đề xuất
    ACTIVE --> MERGED: Gộp vào địa điểm canonical khác
    ACTIVE --> ARCHIVED: Lưu trữ / Ngừng hoạt động
```

- **`CANDIDATE`**: Điểm mới được đề xuất; chưa công nhận; chưa công khai thông tin chi tiết.
- **`ACTIVE`**: Điểm đến hợp lệ, có bài viết nguồn đã được duyệt.
- **`MERGED`**: Điểm trùng lặp; trỏ `canonical_place_id` về địa điểm gốc, không có chu trình.
- **`REJECTED`**: Đề xuất không đạt yêu cầu hoặc không có thực.
- **`ARCHIVED`**: Địa điểm ngừng tiếp cận hoặc lưu trữ.

---

## 2. Quyền Hiển Thị Bài Viết (Visibility)

Áp dụng cho bảng `posts` (`postId`).

```mermaid
stateDiagram-v2
    [*] --> REVIEW_ONLY: Điểm mới đề xuất (P02)
    [*] --> PUBLISHED: Bài tại điểm đã biết (F03)
    REVIEW_ONLY --> PUBLISHED: Điểm được duyệt & xuất bản
    PUBLISHED --> HIDDEN: Operator ẩn do vi phạm / hold
    HIDDEN --> PUBLISHED: Khôi phục sau kiểm tra
```

- **`REVIEW_ONLY`**: Chỉ tác giả và người có thẩm quyền kiểm duyệt xem được nội dung.
- **`PUBLISHED`**: Đã xuất bản công khai cho mọi người đọc.
- **`HIDDEN`**: Tạm ẩn khỏi danh mục công khai.

---

## 3. Phân Cấp Truy Cập (Access Tier)

Áp dụng cho nội dung bài viết (`posts`/`revisions`).

- **`PUBLIC`**: Khách và thành viên đọc tự do; bao gồm thông tin tóm tắt, điều kiện tiếp cận cơ bản, và các cảnh báo an toàn bắt buộc.
- **`VIP`**: Hướng dẫn chuyên sâu tuyển chọn; chỉ thành viên có gói VIP còn hạn mới đọc được. Server kiểm tra quyền trước khi trả dữ liệu.

---

## 4. Trạng Thái Kiểm Định Nội Dung (Verification Status)

Gắn chặt với từng phiên bản nội dung (`revisions.revision_id`), không gắn theo bài viết hay tác giả.

```mermaid
stateDiagram-v2
    [*] --> UNVERIFIED: Bài mới công bố sau lọc
    UNVERIFIED --> IN_REVIEW: Operator mở reviewCase
    IN_REVIEW --> VERIFIED: Quyết định APPROVED
    IN_REVIEW --> NEEDS_CHANGES: Quyết định CHANGES_REQUESTED
    IN_REVIEW --> INCONCLUSIVE: Chưa đủ căn cứ thực địa
    IN_REVIEW --> REJECTED: Quyết định REJECTED
    VERIFIED --> EXPIRED: Hết hạn kiểm tra (validUntil)
    VERIFIED --> SUSPENDED: Tạm dừng do báo sai (Hold)
    SUSPENDED --> VERIFIED: Khôi phục sau vòng kiểm tra lại
    SUSPENDED --> REJECTED: Thu hồi kết quả kiểm định
```

---

## 5. Nhiệm Vụ Của Chuyên Gia (Task Work Status)

Áp dụng cho bảng `tasks` (`taskId`).

```mermaid
stateDiagram-v2
    [*] --> OFFERED: Operator gửi lời mời kèm reserve
    OFFERED --> ACCEPTED: Chuyên gia đồng ý nhận việc
    OFFERED --> DECLINED: Chuyên gia từ chối
    OFFERED --> OFFER_EXPIRED: Quá hạn nhận việc
    OFFERED --> CANCELLED: Operator hủy trước khi nhận
    ACCEPTED --> IN_PROGRESS: Chuyên gia bấm bắt đầu làm
    ACCEPTED --> CANCELLED: Hủy theo điều khoản
    IN_PROGRESS --> SUBMITTED: Nộp báo cáo kiểm định
    IN_PROGRESS --> CANCELLED: Hủy theo điều khoản
    SUBMITTED --> NEEDS_MORE: Operator yêu cầu bổ sung
    NEEDS_MORE --> SUBMITTED: Nộp báo cáo bổ sung
    SUBMITTED --> ACCEPTED_WORK: Nghiệm thu công việc đạt
    SUBMITTED --> REJECTED_WORK: Bác bỏ chất lượng công việc
```

---

## 6. Nghĩa Vụ Trả Thù Lao (Payable Status)

Áp dụng cho bảng `payables` (`payableId`). Độc lập với quyết định nội dung bài viết.

```mermaid
stateDiagram-v2
    [*] --> OPEN: Sinh ra khi ACCEPTED_WORK
    OPEN --> PAYMENT_PENDING: Quỹ chuẩn bị lệnh chi (payout)
    PAYMENT_PENDING --> PAID: Giao dịch onchain finalized
    PAYMENT_PENDING --> UNKNOWN: Giao dịch timeout / mất kết nối
    UNKNOWN --> PAYMENT_PENDING: Sau khi đối soát business key
    UNKNOWN --> PAID: Sau khi indexer tìm thấy receipt
    OPEN --> CANCELLED: Hủy theo hồ sơ điều chỉnh
```

---

## 7. Cấp Quyền Token (Grant SBT / NFT)

Áp dụng cho bảng `credentials` (`credentialId`) và `author_collectibles` (`collectibleId`).

```mermaid
stateDiagram-v2
    [*] --> ELIGIBLE: Bài được APPROVED
    ELIGIBLE --> AUTHORIZED: Tác giả có ví & Operator authorize
    AUTHORIZED --> PENDING: Tác giả ký giao dịch claim
    PENDING --> ISSUED: Indexer xác nhận mint thành công
    ISSUED --> REVOKED: Thu hồi do gian lận có hồ sơ
```

---

## 8. Tuyến Nhận Tip (Tip Route Status)

Áp dụng cho bảng `tip_routes` (`routeId`).

```mermaid
stateDiagram-v2
    [*] --> AWAITING_CONSENT: Chuẩn bị sau khi bài APPROVED
    AWAITING_CONSENT --> PENDING: Tác giả ký consent & Operator gửi tx
    PENDING --> ACTIVE: Giao dịch đăng ký route finalized
    ACTIVE --> PAUSED: Tạm dừng theo yêu cầu
    PAUSED --> ACTIVE: Mở lại tuyến
    ACTIVE --> EXPIRED: Hết hạn hiệu lực (validUntil)
    ACTIVE --> REVOKED: Đổi ví mới hoặc bị khóa
```

---

## 9. Lần Gửi Giao Dịch Blockchain (Transaction Attempt Status)

Áp dụng cho bảng `transaction_attempts` (`attemptId`).

```mermaid
stateDiagram-v2
    [*] --> SUBMITTED: Ví phát sóng giao dịch (broadcast)
    SUBMITTED --> OBSERVED: Indexer quan sát thấy trong mempool/block
    OBSERVED --> FINALIZED: Đạt chính sách finality của mạng
    SUBMITTED --> REJECTED: Bị node từ chối
    SUBMITTED --> REVERTED: Giao dịch thực thi thất bại trên chain
    SUBMITTED --> UNKNOWN: Mất kết nối / timeout
    SUBMITTED --> REPLACED: Bị thay thế bằng nonce mới
    OBSERVED --> REORGED: Bị đảo ngược do reorg (chờ rescan)
```

---

## 10. Gói Thành Viên VIP (Membership Term Status)

Áp dụng cho bảng `membership_terms` theo `paymentId`.

```mermaid
stateDiagram-v2
    [*] --> PENDING: Tạo đơn thanh toán VIP (paymentId)
    PENDING --> ACTIVE: Cổng thanh toán xác nhận (CONFIRMED)
    ACTIVE --> EXPIRED: Server clock vượt quá endsAt (12 tháng)
```
