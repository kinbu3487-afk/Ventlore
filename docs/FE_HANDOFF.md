# Ventlore · Tài Liệu Bàn Giao Kỹ Thuật Cho Đội Ngũ BE & Smart Contract (FE Handoff)

Tài liệu này tổng hợp toàn bộ các giao diện dữ liệu (Data Interfaces), hợp đồng định danh (ID Contract), mã quyền hạn (Capabilities), mã lý do lỗi (Reason Codes) và ranh giới tích hợp giữa Front-End, Backend API và Smart Contract.

---

## 1. Bản Đồ Giao Diện Dữ Liệu Front-End Đang Sử Dụng

Toàn bộ Front-End gọi dữ liệu qua client `@ventlore/api-client`. Dưới đây là các DTO cốt lõi đã được kiểm định kiểu chặt chẽ trong mã nguồn:

### 1.1 Khám phá & Địa điểm (Places)
- `PlaceSummaryDTO`: Dùng cho danh sách tìm kiếm Explore và thẻ nổi bật Home.
  - Trường: `placeId` (UUIDv7), `displayCode` (`PLC-00000X`), `name`, `regionId`, `regionName`, `status` (`PlaceStatus`), `summary`, `warnings[]`, `activities[]`, `imageUrl`, `coverImageUrl`.
- `PlaceDetailDTO`: Dùng cho trang chi tiết địa điểm `/places/[placeId]`.
  - Bao gồm toàn bộ `PlaceSummaryDTO` + `coordinates` (`lat`, `lng`), `description`, `postsCount`, `posts[]` (danh sách tóm tắt bài viết gắn với điểm này).

### 1.2 Bài viết & Lịch sử sửa đổi (Posts & Revisions)
- `PostDetailDTO`: Dùng cho màn hình đọc bài `/posts/[postId]`.
  - `postId` (UUIDv7), `displayCode` (`PST-00000X`), `placeId`, `place` info, `author` (`userId`, `handle`, `displayName`, `avatarUrl`, `bio`), `currentRevisionId`, `visibility` (`PostVisibility`).
  - `revision`: `PostRevisionDTO` (chứa `revisionId`, `displayCode`, `versionNumber`, `title`, `content` dạng Markdown, `claims[]` nhận định kiểm chứng, `sources[]`, `verificationStatus`, `scope`, `checkedAt`, `validUntil`).
  - `revisionsList`: Mảng tóm tắt các phiên bản lịch sử phục vụ chuyển đổi đối soát (`revisionsList[]`).

### 1.3 Đóng góp của Người dùng (Contributions)
- `CreatePostInput`: Input gửi bài viết cho điểm có sẵn.
  - `placeId`, `title`, `contributionType` (`DISCOVERY` | `GUIDE` | `EXPERIENCE`), `observedAt`, `content`, `claims[]`, `sources[]`, `accessTier` (`PUBLIC` | `VIP`).
- `ProposeCandidatePlaceInput`: Input đề xuất điểm mới.
  - `name`, `regionId`, `regionName`, `coordinates`, `summary`, `description`, `warnings[]`, `activities[]`, `postTitle`, `postContent`, `postClaims[]`.
  - **Quy tắc BE bắt buộc:** Phải tạo đồng thời `placeId` (trạng thái `CANDIDATE`) + `postId` (loại `DISCOVERY`) + `revisionId` trong **cùng một database transaction**.

### 1.4 Quyền lợi Tác giả & Bốn Khối Sau Duyệt (Benefits)
- `BenefitsDTO`:
  - `userId`: UUIDv7.
  - `verifiedContentCount`: Số bài viết đã được duyệt `VERIFIED`.
  - `sbt`: `{ credentialId, title, status: NOT_ELIGIBLE | OFFERED | AWAITING_WALLET | CLAIMED_DEMO | ISSUED_DEMO, issuedAt, tokenId }`.
  - `nft`: `{ collectibleId, title, postTitle, status: OFFERED | CLAIMED_DEMO | ISSUED_DEMO, tokenId, imageUrl }`.
  - `tipRoute`: `{ routeId, status: TipRouteStatus, authorPercent: 80, treasuryPercent: 20, consentGiven: boolean, walletAddress }`.

### 1.5 Hoạt động Vận hành Chuyên gia (Expert Tasks & Payables)
- `ExpertTaskDTO`:
  - `taskId` (UUIDv7), `displayCode` (`TSK-00000X`), `type`, `postId`, `postTitle`, `placeName`, `revisionId`, `scope`, `claims[]`, `deadline`, `rewardAmountFormatted`, `rewardAsset` (`USDC`), `workStatus` (`TaskWorkStatus`), `acceptanceCriteria[]`, `submissions[]`.
- `ExpertPayableDTO`:
  - `payableId` (UUIDv7), `taskId`, `taskDisplayCode`, `postTitle`, `amountFormatted`, `asset`, `status` (`PayableStatus`: `OPEN` | `PAID`), `acceptedAt`.

### 1.6 Tiếp nhận & Quyết định Quản trị (Admin Intake & Cases)
- `AdminIntakeItemDTO`:
  - `intakeId`, `type` (`PROPOSAL_NEW_PLACE` | `NEW_POST` | `USER_REPORT`), `entityId`, `title`, `submittedByHandle`, `submittedAt`, `summary`, `potentialDuplicates[]`.
- `AdminReviewCaseDTO`:
  - `caseId`, `postId`, `postTitle`, `revisionId`, `placeName`, `authorHandle`, `authorUserId`, `status` (`OPEN` | `ASSIGNED` | `EVALUATING` | `DECIDED`), `assignedExpertHandle`, `taskId`, `taskWorkStatus`, `submissionCount`, `acceptanceStatus` (`PENDING` | `ACCEPTED_WORK` | `REJECTED_WORK`), `contentDecision` (`APPROVED` | `REJECTED` | `CHANGES_REQUESTED` | `INCONCLUSIVE`), `payableId`, `isAppHold`.

---

## 2. Hợp Đồng Định Danh (ID Contract)

1. **UUIDv7 Canonical:**
   - Mọi thực thể nghiệp vụ mới khi lưu vào PostgreSQL bắt buộc phải được cấp mã UUIDv7 theo chuẩn RFC 9562 (có tính đơn điệu theo thời gian).
   - Tên trường trong JSON dùng `camelCase` (`postId`, `revisionId`, `payableId`), trong PostgreSQL dùng `snake_case` (`post_id`, `revision_id`, `payable_id`).
2. **Display Code:**
   - Cấp qua Sequence an toàn: `PLC-000001`, `PST-000001`, `REV-000001`, `TSK-000001`. Chỉ dùng để người dùng đọc/tra cứu, không dùng làm khóa ngoại `FOREIGN KEY`.
3. **Blockchain Key Derivation (Băm Onchain):**
   - `APP_NAMESPACE = keccak256(UTF8("VENTLORE_V1"))`
   - `entityKey(kind, uuid) = keccak256(abi.encode(APP_NAMESPACE, kind, bytes16(uuid)))`
   - 10 giá trị `kind` cố định: `post`, `revision`, `claim`, `route`, `donation-request`, `payable`, `credential`, `collectible`, `region`, `reason`.
   - `RECEIPT_DOMAIN = keccak256(UTF8("VENTLORE_RECEIPT_V1"))`
   - `receiptKey = keccak256(abi.encode(RECEIPT_DOMAIN, chainId, splitterAddress, donorAddress, requestKey))`

---

## 3. Ma Trận Quyền Hạn (Capabilities) & Lý Do Chặn (Reason Codes)

Front-End kiểm tra năng lực hành động thông qua mảng `capabilities[]` trong phiên đăng nhập:
- `can_read_vip`: Được phép đọc nội dung bài viết đánh dấu `VIP`.
- `can_propose_place`: Được phép gửi đề xuất điểm mới.
- `can_create_post`: Được phép viết bài về điểm có sẵn.
- `can_review_tasks`: Được quyền truy cập Bảng việc Chuyên gia (`/expert`).
- `can_manage_system`: Được quyền truy cập Không gian Quản trị (`/admin`).

Các mã lý do chặn (`Reason Codes`) khi nút hành động bị mờ:
- `ERR_NOT_VERIFIED`: Chưa được kiểm định thực địa.
- `ERR_APP_HOLD`: Đang trong diện tạm dừng khẩn cấp do khiếu nại.
- `ERR_MISSING_CONSENT`: Tác giả chưa ký thỏa thuận đồng ý nhận tip 80/20.
- `ERR_MISSING_WALLET`: Tác giả chưa liên kết địa chỉ ví Web3.
- `ERR_EXPIRED`: Hồ sơ kiểm định đã quá hạn hiệu lực 12 tháng.

---

## 4. Danh Sách Tích Hợp Cần Hoàn Thiện Khi Chuyển Sang BE

1. **Xác thực người dùng (Auth Server):**
   - Triển khai OAuth2 / OpenID Connect (Google, Apple) hoặc giải pháp Session Cookie bảo mật phía server.
   - Chuyển `SessionContext` từ mock sang gọi endpoint `/api/v1/auth/me`.
2. **PostgreSQL Database & Migration:**
   - Tạo schema theo 34 thực thể nghiệp vụ đã kiểm tra trong `docs/ID_CONTRACT.md`.
   - Cài đặt extension `pgcrypto` hoặc thư viện sinh UUIDv7 cho primary keys.
3. **Smart Contract Splitter & Token:**
   - Triển khai `PaymentSplitter` cho tỷ lệ 80/20 trên Arbitrum.
   - Triển khai Contributor SBT (ERC-5192) và Author NFT (ERC-721).
   - Thiết lập Indexer/Worker lắng nghe sự kiện để cập nhật bảng `PublicLedger` và `payables`.
