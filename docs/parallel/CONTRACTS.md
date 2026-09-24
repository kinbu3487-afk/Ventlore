# Ventlore Architecture Contracts (CONTRACTS.md)

**Phiên bản chuẩn:** 0.3.0  
**Ngày thiết lập:** 25/09/2026  
**Chủ trì:** Integration Coordinator (Merge Lane)  
**Phạm vi áp dụng:** Bắt buộc xuyên suốt FE, BE, CHAIN và MERGE.  

---

## 1. Nguồn Sự Thật Canonical (Sources of Truth)

Mọi thay đổi về định dạng dữ liệu, quy tắc logic và giao diện giao tiếp phải tuân theo các tài liệu chuẩn sau:

| Lĩnh vực | Tài liệu đặc tả chuẩn | Đường dẫn trong repository |
|---|---|---|
| **Hợp đồng định danh (ID)** | ID Contract v0.3 & CSV Registry | [ID_CONTRACT.md](file:///Users/johnlebin/Downloads/Ventlore/docs/ID_CONTRACT.md) & [Ventlore_ID_Registry_v0_3.csv](file:///Users/johnlebin/Downloads/Ventlore/docs/source/Ventlore_ID_Registry_v0_3.csv) |
| **Giao diện HTTP API** | OpenAPI 3.1 Specification | [openapi.yaml](file:///Users/johnlebin/Downloads/Ventlore/docs/api/openapi.yaml) |
| **Quy tắc nghiệp vụ** | Domain Rules F01–F10 | [DOMAIN_RULES.md](file:///Users/johnlebin/Downloads/Ventlore/docs/DOMAIN_RULES.md) |
| **Máy trạng thái thực thể** | State Machines Specification | [STATE_MACHINES.md](file:///Users/johnlebin/Downloads/Ventlore/docs/STATE_MACHINES.md) |
| **Phân quyền & Khả năng** | Permissions & Role Matrix | [PERMISSIONS.md](file:///Users/johnlebin/Downloads/Ventlore/docs/PERMISSIONS.md) |
| **Giao diện Blockchain** | Smart Contract Interface Design | [CHAIN_INTERFACE.md](file:///Users/johnlebin/Downloads/Ventlore/docs/CHAIN_INTERFACE.md) |
| **Độ bao phủ màn hình** | Screen Coverage S01–S35 | [SCREEN_COVERAGE.md](file:///Users/johnlebin/Downloads/Ventlore/docs/SCREEN_COVERAGE.md) |
| **Độ bao phủ thành phần**| Component Coverage C01–C50 | [COMPONENT_COVERAGE.md](file:///Users/johnlebin/Downloads/Ventlore/docs/COMPONENT_COVERAGE.md) |
| **Độ bao phủ sự kiện** | Event Steps U01-E01 đến U12-E06 | [EVENT_COVERAGE.md](file:///Users/johnlebin/Downloads/Ventlore/docs/EVENT_COVERAGE.md) |

---

## 2. Hợp Đồng Định Danh 3 Lớp (ID Contract)

1. **Lớp 1 — Business UUID:**
   - Canonical ID luôn là UUIDv7 do API/server sinh. Kiểu dữ liệu trong DB là `uuid`, JSON trả camelCase (`postId`, `revisionId`, `decisionId`).
   - Cấm client tự sinh canonical ID. Temporary ID phía client chỉ dùng cho bản nháp cục bộ chưa gửi và bị hủy ngay khi API trả kết quả.
2. **Lớp 2 — Display Code:**
   - Định dạng: `PREFIX-000001` (ví dụ `PLC-000001`, `PST-000001`, `REV-000001`).
   - Do PostgreSQL sequence cấp trong transaction an toàn; chỉ dùng để tìm kiếm URL/UI, tuyệt đối không dùng làm Foreign Key hoặc khóa JOIN.
3. **Lớp 3 — Blockchain Key Derivation:**
   - `APP_NAMESPACE = keccak256(UTF8("VENTLORE_V1"))` = `0xe619ce7014f9f215692488f22178a42229f4d33f21dfd416cd9e0c15fb7c74ea`
   - `entityKey(kind, uuid) = keccak256(abi.encode(APP_NAMESPACE, kind, bytes16(uuid)))`
   - ABI types: `(bytes32, string, bytes16)`. UUID chuyển thành đúng 16 byte nhị phân thô (không hash string text có dấu gạch nối, không dùng `abi.encodePacked`, không SHA3-256).
   - 10 `kind` cố định trong registry CSV:
     `post`, `revision`, `claim`, `route`, `donation-request`, `payable`, `credential`, `collectible`, `region`, `reason`.
   - `RECEIPT_DOMAIN = keccak256(UTF8("VENTLORE_RECEIPT_V1"))` = `0x5e5da63d4155fbd578bdaf259d9483bf32041ccd0d15b03b329d22329e194dd6`
   - `receiptKey = keccak256(abi.encode(RECEIPT_DOMAIN, chainId, splitterAddress, donorAddress, requestKey))` với types `(bytes32, uint256, address, address, bytes32)`.
   - Onchain Token IDs:
     - Author NFT: `tokenId = uint256(collectibleKey)`
     - Contributor SBT: `tokenId = uint256(credentialKey)`

---

## 3. Hợp Đồng HTTP API & Idempotency

- **Tiền tố:** Mọi API endpoint đều nằm tại `/api/v1`.
- **Mutation Idempotency:**
  - Mọi thao tác `POST`, `PUT`, `PATCH`, `DELETE` bắt buộc gửi header `Idempotency-Key` (UUIDv7 hợp lệ).
  - Scope lưu trữ: `actorUserId + endpoint + payloadHash`.
  - Gửi lại cùng key và cùng payload: Trả về kết quả đã cache thành công (200/201).
  - Gửi lại cùng key nhưng khác payload: Bắt buộc trả lỗi `409 Conflict`.
- **Concurrency Control:**
  - Chỉnh sửa bản nháp / nội dung phải gửi kèm header `If-Match: "<expectedVersion>"` hoặc query `expectedVersion`.
  - Phiên bản không khớp trả về lỗi `409 Version Conflict` kèm `latestVersion` và diff để người dùng so sánh.
- **Phân trang (Pagination):**
  - Sử dụng Cursor Pagination (`limit`, `cursor`). Cursor mã hóa từ `(createdAt, canonicalUuid)`.
- **Định dạng lỗi chuẩn (Standard Error Envelope):**
  ```json
  {
    "error": {
      "code": "BAD_REQUEST | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | CONFLICT | RATE_LIMITED | INTERNAL_ERROR",
      "message": "Thông điệp lỗi thân thiện đã được bản địa hóa",
      "details": [],
      "requestTraceId": "01923e45-6789-7abc-def0-123456789abc"
    }
  }
  ```

---

## 4. Hợp Đồng Tiền Tệ & Phân Bổ (Financial Contract)

1. **Đơn vị nguyên tử (Atomic Units):**
   - Tuyệt đối không dùng số thực JavaScript (`number` / float) cho tiền tệ onchain.
   - Toàn bộ giá trị tiền tệ trong JSON, DB, Smart Contracts và Client state phải dùng kiểu chuỗi ký tự biểu diễn số nguyên BigInt (`amountAtomic: string`).
2. **Quy tắc phân bổ:**
   - **Quyên góp dự án (`PROJECT`):** 100% chuyển vào ví quỹ cộng đồng (`treasuryAddress`).
   - **Tip bài viết (`POST_TIP`):**
     - Quỹ dự án nhận 20%: `projectAmount = floor(amount / 5)`
     - Tác giả nhận 80%: `authorAmount = amount - projectAmount`
     - Chi phí gas mạng do người gửi thanh toán riêng, tuyệt đối không trừ ngầm vào tỷ lệ chia sẻ 80/20.
3. **Gói VIP:**
   - Mức niêm yết: `1500` USD cents (tương đương 15 USD/năm).
   - Kỳ hạn: Đúng 12 tháng lịch UTC tính từ thời điểm kích hoạt hoặc cộng nối tiếp kỳ hiện tại (`startAt = max(now, currentEndsAt)`).
   - Gia hạn chủ động, không tự động trừ tiền (no auto-recurring charge).
   - Quyên góp không cấp VIP; VIP không cấp điểm uy tín hay quyền duyệt bài.

---

## 5. Bất Biến Về Dữ Liệu & Tính Độc Lập

- **Một tài khoản cho mọi vai trò:** Một `userId` duy nhất đại diện cho một con người. Khách xem nội dung công khai không cần tài khoản hay kết nối ví.
- **Tính bất biến của Snapshot:** `revisions`, `submissions`, `decisions`, `receipts` đã nộp là bất biến, không `UPDATE` hay `DELETE`. Bản sửa đổi tạo `revisionId` mới trỏ `parentRevisionId`.
- **Ba quyết định độc lập:**
  1. Nghiệm thu công chuyên gia (`acceptanceId` -> `payableId`).
  2. Quyết định nội dung bài viết (`decisionId`: APPROVED / REJECTED).
  3. Đối soát và thanh toán onchain/offchain (`paidAt`, `receiptKey`).
  *Hệ quả:* Bài viết bị `REJECTED` nhưng chuyên gia làm đúng quy trình vẫn được nghiệm thu và nhận tiền công.
- **Bốn nhánh sau duyệt tách biệt:** Khi bài được `APPROVED`:
  1. Nhãn kiểm tra (hiển thị web, không cần ví).
  2. Contributor SBT (tác giả tự claim bằng ví).
  3. Author NFT (tác giả tự claim bằng ví, tối đa 1 NFT `AUTHOR_CONTRIBUTION`/post).
  4. Route nhận tip (tác giả ký consent, operator đăng ký route).

---

## 6. Quy Tắc Tương Thích & Đề Xuất Thay Đổi

1. Không một lane nào được tự ý thay đổi các trường trong hợp đồng này.
2. Mọi đề xuất thay đổi phải tạo file yêu cầu tại `docs/parallel/requests/<LANE>-<slug>.md` và được Merge Lane tổng hợp, kiểm tra tương thích ngược trước khi đưa vào baseline chung.
