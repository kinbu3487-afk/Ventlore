# Hợp Đồng Định Danh Hệ Thống (ID_CONTRACT)

Tài liệu này quy định chi tiết cấu trúc định danh ba lớp (3-Layer ID Architecture) của Ventlore theo đặc tả `Ventlore_Logic_ID_DB_v0_3.pdf` (Mục 13–15, 21) và bảng đăng ký `docs/source/Ventlore_ID_Registry_v0_3.csv`.

---

## 1. Ba Lớp Định Danh

### 1.1 Lớp 1: Khóa Nghiệp Vụ Chuẩn (Business UUID)
- **Chuẩn định dạng:** UUIDv7 (theo RFC 9562) được cấp bởi API server.
- **Lưu trữ DB:** Kiểu dữ liệu `uuid` trong PostgreSQL.
- **Giao diện API:** Trả chuỗi UUID chuẩn định dạng 8-4-4-4-12 ký tự hex (ví dụ: `018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e6f`).
- **Quy ước đặt tên:**
  - Trong API JSON: Định dạng `camelCase` (ví dụ: `postId`, `revisionId`, `taskSubmissionId`).
  - Trong PostgreSQL: Định dạng `snake_case` (ví dụ: `post_id`, `revision_id`, `task_submission_id`).
  - **Bất biến:** Khác biệt tên trường giữa JSON và SQL chỉ là quy ước chuyển đổi (serialization); giá trị chuỗi UUID là hoàn toàn trùng khớp và bất biến xuyên suốt mọi tầng. Không bao giờ phát sinh một ID mới giữa frontend, API và DB.
- **Client Drafts:** Client chỉ sử dụng temporary key cục bộ cho các bản nháp chưa gửi lên server; tuyệt đối không tự nâng temporary key thành canonical ID.

### 1.2 Lớp 2: Mã Hiển Thị Người Dùng (Display Code)
- **Chuẩn định dạng:** `PREFIX-000001` (tối thiểu 6 chữ số, tiếp tục tăng khi vượt 999999).
- **Phạm vi duy nhất:** UNIQUE theo bộ ba `(environment, prefix, sequence)`.
- **Cơ chế cấp:** Do server cấp bằng sequence/transaction an toàn khi tạo bản ghi; không đếm số dòng ở client.
- **Mục đích:** Chỉ phục vụ giao diện người dùng, mã tra cứu nhanh trên màn hình và hỗ trợ khách hàng.
- **Bất biến:** Hệ thống không dùng display code làm Foreign Key hoặc khóa JOIN trong cơ sở dữ liệu. Khi người dùng nhập display code (ví dụ `PST-000001`), server chỉ tra cứu một lần ra UUID canonical (`post_id`) rồi thực hiện toàn bộ truy vấn bằng UUID.

### 1.3 Lớp 3: Khóa Blockchain (Blockchain Keys)
- Chỉ cấp cho các thực thể cần đối chiếu hoặc xác thực trên smart contract.
- **Không gian tên ứng dụng (Namespace):**
  ```solidity
  bytes32 constant APP_NAMESPACE = keccak256(bytes("VENTLORE_V1"));
  ```
- **Công thức suy dẫn khóa thực thể (`entityKey`):**
  ```solidity
  function entityKey(string memory kind, bytes16 uuidBytes) public pure returns (bytes32) {
      return keccak256(abi.encode(APP_NAMESPACE, kind, uuidBytes));
  }
  ```
  - **Kiểu dữ liệu ABI:** `(bytes32, string, bytes16)`.
  - **Quy tắc chuyển đổi UUID:** Chuỗi UUID canonical được giải mã thành đúng **16 bytes nhị phân thực tế** (128-bit big-endian).
  - **Nghiêm cấm:** Không băm chuỗi văn bản UUID có dấu gạch ngang; không sử dụng hàm băm SHA3-256 (FIPS 202); không sử dụng `abi.encodePacked`.
- **10 loại `kind` cố định theo registry CSV:**
  1. `post` (cho `postId`)
  2. `revision` (cho `revisionId`)
  3. `claim` (cho `claimId`)
  4. `route` (cho `routeId`)
  5. `donation-request` (cho `donationId`)
  6. `payable` (cho `payableId`)
  7. `credential` (cho `credentialId`)
  8. `collectible` (cho `collectibleId`)
  9. `region` (cho `regionId`)
  10. `reason` (cho `reasonId`)
- **Công thức biên nhận ủng hộ (`receiptKey`):**
  ```solidity
  bytes32 constant RECEIPT_DOMAIN = keccak256(bytes("VENTLORE_RECEIPT_V1"));
  
  function getReceiptKey(
      uint256 chainId,
      address splitterAddress,
      address donorAddress,
      bytes32 requestKey
  ) public pure returns (bytes32) {
      return keccak256(abi.encode(RECEIPT_DOMAIN, chainId, splitterAddress, donorAddress, requestKey));
  }
  ```
  - **Kiểu dữ liệu ABI:** `(bytes32, uint256, address, address, bytes32)`.
- **Định danh Token onchain:**
  - Author Contribution NFT `tokenId = uint256(collectibleKey)`.
  - Contributor SBT `tokenId = uint256(credentialKey)`.
  - Định danh toàn cục `tokenIdentity`: Bộ ba `(chainId, contractAddress, tokenId)`.
- **Định danh Log sự kiện:** `(chainId, blockHash, txHash, logIndex)`.
- **Định danh Biên nhận onchain:** `(chainId, splitterAddress, receiptKey)`.

---

## 2. Bảng Đăng Ký 34 Định Danh Nghiệp Vụ (ID Registry)

*Dữ liệu đối chiếu chuẩn xác với `docs/source/Ventlore_ID_Registry_v0_3.csv`:*

| STT | API Field (`camelCase`) | Prefix | Tên nghiệp vụ | Thời điểm sinh | Tham chiếu | Tính duy nhất | Blockchain `keyKind` | Bảng DB (`snake_case`) | Khóa chính DB |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `userId` | `USR` | Tài khoản | Social login đầu tiên | identity; mọi actor là userId | Một provider + providerSubject chỉ trỏ một user | - | `users` | `user_id` |
| 2 | `walletBindingId` | `WLT` | Liên kết ví | Sau chứng minh quyền kiểm soát | userId; chainNamespace; walletAddress | Một địa chỉ đang active thuộc một user/namespace | - | `wallet_bindings` | `wallet_binding_id` |
| 3 | `roleAssignmentId` | `ROL` | Quyền vai trò | Mời và chấp nhận/cấp quyền | userId; role; scope; validUntil | Không trùng role + scope đang active cho cùng user | - | `role_assignments` | `role_assignment_id` |
| 4 | `membershipId` | `MEM` | Hồ sơ VIP | Lần đầu bắt đầu đăng ký plan | userId; planCode; các paymentId | UNIQUE(userId, planCode) | - | `memberships` | `membership_id` |
| 5 | `paymentId` | `VPM` | Khoản mua/gia hạn VIP | Tạo một đơn mua kỳ VIP | membershipId; payerUserId; externalPaymentRef/actionId | Một provider event/receipt chỉ thanh toán một payment; một payment cấp một kỳ | - | `vip_payments` | `payment_id` |
| 6 | `placeId` | `PLC` | Địa điểm | Gửi đề xuất địa điểm mới | canonicalPlaceId nếu merged; sourceRevisionId | Không lấy tên/toạ độ làm PK; canonical không có chu trình | - | `places` | `place_id` |
| 7 | `postId` | `PST` | Bài đóng góp | Lưu nháp bài đầu tiên | placeId; authorUserId; contributionType | Một bài có nhiều revision; author cố định | `post` | `posts` | `post_id` |
| 8 | `revisionId` | `REV` | Phiên bản nội dung | Công bố/gửi snapshot | postId; parentRevisionId; claimIds; contentHash | Snapshot bất biến; không sửa bytes đã freeze | `revision` | `revisions` | `revision_id` |
| 9 | `claimId` | `CLM` | Nhận định cần kiểm tra | Freeze từng nhận định của revision | revisionId; text; evidenceIds | Claim thuộc đúng một revision; bản mới có claim mới | `claim` | `claims` | `claim_id` |
| 10 | `reviewCaseId` | `RVC` | Vòng kiểm tra | Operator mở vòng review | revisionId; scopeClaimIds; previousCaseId | Một case có tối đa một decision kết thúc | - | `review_cases` | `review_case_id` |
| 11 | `taskId` | `TSK` | Nhiệm vụ/một lần giao | Gửi offer cho một chuyên gia | reviewCaseId; assigneeUserId; reservationId | Một task một assignee cố định; đổi người tạo task mới | - | `tasks` | `task_id` |
| 12 | `reservationId` | `RSV` | Cam kết ngân sách | Trước khi giao task | taskId; asset; amount | UNIQUE(taskId) trong baseline một mức công cố định | - | `reservations` | `reservation_id` |
| 13 | `submissionId` | `SUB` | Lần nộp kết quả | Chuyên gia nộp hoặc bổ sung | taskId; evidenceIds; submittedByUserId | Không ghi đè bản nộp cũ | - | `submissions` | `submission_id` |
| 14 | `evidenceId` | `EVD` | Bằng chứng | Nộp bằng chứng có quyền truy cập | ownerUserId; mediaId tùy loại; checksum | URL không là ID; file private kiểm quyền riêng | - | `evidence` | `evidence_id` |
| 15 | `mediaId` | `MED` | Tệp ảnh/tài liệu | Upload và xử lý hoàn tất | ownerUserId; storage key; checksum | ID không thay khi đổi signed URL | - | `media` | `media_id` |
| 16 | `decisionId` | `DEC` | Quyết định nội dung | Kết thúc reviewCase | reviewCaseId; revisionId; reviewerUserId; scopeClaimIds | UNIQUE(reviewCaseId); bất biến | - | `decisions` | `decision_id` |
| 17 | `acceptanceId` | `ACP` | Nghiệm thu công | Chấp nhận công việc của task | taskId; submissionId; acceptedByUserId | UNIQUE(taskId) cho nghiệm thu toàn bộ một mức công | - | `acceptances` | `acceptance_id` |
| 18 | `payableId` | `PAY` | Khoản công phải trả | Nghiệm thu tạo nghĩa vụ trả | acceptanceId; payeeUserId; asset; amount | UNIQUE(acceptanceId); giữ nguyên khi retry | `payable` | `payables` | `payable_id` |
| 19 | `payoutId` | `OUT` | Lệnh chi | Quỹ chuẩn bị một lần thực thi trả | payableId; actionId | Không có hai lệnh pending/unknown cho một payable | - | `payouts` | `payout_id` |
| 20 | `routeId` | `RTE` | Cấu hình nhận tip | Chuẩn bị mở/đổi ví/gia hạn | revisionId; decisionId; beneficiaryBindingId; previousRouteId | Một route bất biến; tối đa một route active/revision/deployment | `route` | `tip_routes` | `route_id` |
| 21 | `donationId` | `DON` | Ý định donate | Chốt một ý định ủng hộ | donorUserId tùy nguồn; donorAddress; kind; routeId nếu POST_TIP | Retry giữ ID; đổi ý định/số tiền tạo ID mới | `donation-request` | `donations` | `donation_id` |
| 22 | `credentialId` | `CRD` | Chứng nhận SBT | Tạo offer cấp chứng nhận | subjectUserId; type; sourceDecisionId; supersedesCredentialId | Tối đa một CONTRIBUTOR đang active/user; replacement có lịch sử | `credential` | `credentials` | `credential_id` |
| 23 | `collectibleId` | `COL` | NFT ghi nhận bài | Tạo offer NFT tác giả đầu tiên | postId; originalAuthorUserId; sourceRevisionId; sourceDecisionId | UNIQUE(type=AUTHOR_CONTRIBUTION, postId) kể cả burn | `collectible` | `author_collectibles` | `collectible_id` |
| 24 | `reportId` | `RPT` | Báo thông tin sai | Người dùng gửi report | reporterUserId; revisionId; claimId tùy chọn | Không gom nhiều reporter thành một ID rồi mất tác giả báo cáo | - | `reports` | `report_id` |
| 25 | `fundingId` | `FND` | Góp vốn vào quỹ | Ghi nhận nguồn vốn | source wallet; asset; sourceEventKey | Một dòng tiền nguồn chỉ ghi OWNER_FUNDING một lần | - | `fundings` | `funding_id` |
| 26 | `refundId` | `RFD` | Khoản hoàn riêng | Duyệt nghĩa vụ hoàn | sourceType + sourceIdentity; payer; recipient; amount | Không sửa receipt gốc; kiểm tổng hoàn theo nguồn | - | `refunds` | `refund_id` |
| 27 | `actionId` | `ACT` | Thao tác chain dự kiến | Chuẩn bị payload cần ký | purpose; businessId; deploymentId; expectedCaller | Một action gắn một payload/purpose; nhiều attempt | - | `chain_actions` | `action_id` |
| 28 | `attemptId` | `ATT` | Lần gửi giao dịch | Phát sinh một lần gửi hoặc replacement | actionId; chainId; txHash; sender; nonce | UNIQUE(chainId, txHash) nếu đã biết hash | - | `transaction_attempts` | `attempt_id` |
| 29 | `outboxId` | `OBX` | Công việc nền | Cùng DB transaction nghiệp vụ | eventType; entityId; payloadVersion | Handler dedupe theo outboxId + handler | - | `outbox_events` | `outbox_id` |
| 30 | `auditEventId` | `AUD` | Nhật ký quyết định/thao tác | Mỗi thay đổi quan trọng | actorUserId; action; entityType; entityId; requestTraceId | Append-only, không dùng thay business ID | - | `audit_events` | `audit_event_id` |
| 31 | `requestTraceId` | `TRC` | Truy vết request | Mỗi request API | logs; actor; idempotencyKey | Không dùng trace mới làm ý định thanh toán mới | - | `request_traces` | `request_trace_id` |
| 32 | `deploymentId` | `DPL` | Bộ triển khai chain | Chuẩn bị manifest môi trường | chainId; contract addresses; token; finality policy | Tên môi trường không thay thế deploymentId | - | `deployments` | `deployment_id` |
| 33 | `regionId` | `RGN` | Phạm vi địa phương | Tạo phạm vi chuẩn | roles; review routing | Không lấy tên vùng làm khóa | `region` | `regions` | `region_id` |
| 34 | `reasonId` | `RSN` | Lý do quyết định onchain | Cần cam kết lý do block/revoke | reportId/reviewCaseId; public reason summary | Không hash dữ liệu cá nhân thô | `reason` | `reasons` | `reason_id` |

---

## 3. Các Tài Liệu Tham Chiếu Bị Thiếu (MISSING_REFERENCE)

Trong các tài liệu nguồn PDF có đề cập đến một số tệp dữ liệu mẫu và mã nguồn. Qua kiểm kê thực tế tại Chặng 00, các tệp sau **không tồn tại trong repository**:
1. `data/example-records.json` (hoặc `example-records.json`): Đánh dấu `MISSING_REFERENCE`. Các vector kiểm thử được khởi tạo mới hoàn toàn từ đặc tả chuẩn trong module `packages/chain` và script `scripts/validate_foundation.py`.
2. `source/build_ids.py`: Đánh dấu `MISSING_REFERENCE`. Được cài đặt lại chuẩn xác trong `packages/chain/src/key-derivation.ts` và `scripts/validate_foundation.py`.
3. `sql/002_lookup_examples.sql`: Đánh dấu `MISSING_REFERENCE`. Được xây dựng thành bộ truy vấn mẫu Q01–Q10 trong `packages/db`.
4. `validation-report.json`: Đánh dấu `MISSING_REFERENCE`. Được tạo mới tự động sau khi chạy kiểm thử nền tảng tại `docs/validation-report.json`.
