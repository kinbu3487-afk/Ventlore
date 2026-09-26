# Ventlore · FE Coverage Matrix (Ma Trận Bao Phủ Giao Diện & Hành Trình Nghiệm Thu)

Tài liệu này đối chiếu toàn bộ các luồng nghiệp vụ trên Masterboard (`Ventlore_Journeys_FE_BE_Chain_Masterboard_v1_1.pdf`), phân loại theo Actor, điểm vào từ Trang chủ, các component giao diện tương ứng, mã kịch bản thử nghiệm và các định danh dữ liệu vào/ra.

---

## 1. Bảng Đối Chiếu Bao Phủ Hành Trình (Masterboard Coverage)

| Mã Luồng | Hành trình Masterboard | Vai trò (Actor) | Điểm vào từ Home | Tuyến đường (Page/Route) | Thành phần UI (Components) | Mã Kịch bản (Scenario) | ID Đầu vào | ID Đầu ra | Trạng thái FE |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **U01** | Đọc bài & Khám phá địa điểm | Guest / All | Hero "Khám phá ngay" hoặc Menu | `/explore`, `/places/[placeId]`, `/posts/[postId]` | `HomePageView`, `SearchFilters`, `PlaceResults`, `PlaceSummary`, `PostReader` | `#1`, `#2` | `placeId`, `postId`, `revisionId` | Không sinh ID | **HOÀN TẤT** |
| **U02** | Xem lịch sử đối soát & Phiên bản | Guest / All | Tiêu đề bài viết $\to$ Tab Lịch sử | `/posts/[postId]` | `PostReader`, `RevisionSelector`, `VerificationPanel` | `#1`, `#13` | `postId` | `revisionId` (chọn đọc) | **HOÀN TẤT** |
| **U03** | Đăng nhập & Chuyển đổi ngữ cảnh | All | Nút Đăng nhập trên Header / Avatar | `/login`, `SocialLogin`, `ReviewToolbar` | `AppShell`, `SocialLogin`, `SessionContext` | `#1`, `#3` | `returnTo` | `userId` (canonical session) | **HOÀN TẤT** |
| **U04** | Viết bài khảo sát điểm đã biết | Member / Author | "Tôi muốn đóng góp" $\to$ Viết bài | `/contribute?tab=existing` | `ContributeDialog`, `ContributeView`, `MarkdownView` | `#3` | `placeId`, `userId` | `postId`, `revisionId` (UNVERIFIED) | **HOÀN TẤT** |
| **U05** | Đề xuất địa điểm mới (Candidate) | Member / Author | "Tôi muốn đóng góp" $\to$ Đề xuất điểm | `/contribute?tab=candidate` | `ContributeView`, Duplicate Detector | `#4` | `userId`, GPS coords | `placeId` (CANDIDATE) + `postId` + `revisionId` (REVIEW_ONLY) | **HOÀN TẤT** |
| **U06** | Xung đột phiên bản khi nộp (409) | Member / Author | Nút "Mô phỏng xung đột 409" | `/contribute` | `ContributeView` Conflict Dialog | `#3` | `expectedVersion` | Giữ cả 2 bản so sánh | **HOÀN TẤT** |
| **U07** | Quản lý đóng góp cá nhân & Sửa bài | Member / Author | Avatar $\to$ Đóng góp của tôi | `/account?tab=contributions` | `AccountView`, New Revision Drawer | `#3` | `userId`, `postId` | `revisionId` mới (v+1) trỏ parent | **HOÀN TẤT** |
| **U08** | Ủng hộ Quỹ dự án (Donation 100%) | Guest / Member | "Ủng hộ Ventlore" (Home/Nav) | `PaymentModal` (mode PROJECT) | `PaymentModal`, `PaymentContext` | `#5`, `#8` | `targetId` | `paymentId` (SIMULATED) | **HOÀN TẤT** |
| **U09** | Tip bài viết (Author 80% / Quỹ 20%) | Member / VIP | Nút "Tip tác giả" trong bài viết | `PaymentModal` (mode POST_TIP) | `PostReader`, `PaymentModal` | `#6`, `#8` | `postId`, `revisionId`, `routeId` | `paymentId` (80/20 atomic split) | **HOÀN TẤT** |
| **U10** | Đăng ký & Gia hạn Hội viên VIP | Member / Author | "Khám phá gói VIP" hoặc Tab VIP | `/vip`, `/account?tab=vip` | `VipPage`, `PaymentModal` (MEMBERSHIP) | `#7` | `userId`, `planCode` | `paymentId`, `membershipId` | **HOÀN TẤT** |
| **U11** | Nhận quyền lợi Contributor SBT | Author | Tab Quyền lợi đóng góp | `/account?tab=benefits` | `AccountView` (Khối 2) | `#9` | `userId`, `credentialId` | `tokenId` (uint256 SBT) | **HOÀN TẤT** |
| **U12** | Nhận quyền lợi Author NFT | Author | Tab Quyền lợi đóng góp | `/account?tab=benefits` | `AccountView` (Khối 3) | `#9` | `userId`, `collectibleId` | `tokenId` (uint256 NFT) | **HOÀN TẤT** |
| **U13** | Ký thỏa thuận tuyến nhận tip (Route) | Author | Tab Quyền lợi đóng góp | `/account?tab=benefits` | `AccountView` (Khối 4) | `#9` | `userId`, `walletBindingId` | `routeId` (ACTIVE consent) | **HOÀN TẤT** |
| **U14** | Nhận nhiệm vụ thẩm định thực địa | Expert | Menu Chuyên gia $\to$ Bảng việc | `/expert` | `ExpertWorkspaceView` | `#10` | `expertUserId`, `taskId` | `taskId` (IN_PROGRESS) | **HOÀN TẤT** |
| **U15** | Nộp hồ sơ bằng chứng đối chứng | Expert | Bấm "Nộp báo cáo" trên task | `/expert` | `ExpertWorkspaceView` Evidence Form | `#10` | `taskId`, claims assessment | `submissionId` (v1/v2) | **HOÀN TẤT** |
| **U16** | Xem thù lao thẩm định phải nhận | Expert | Tab Công phải nhận | `/expert` | `ExpertWorkspaceView` Payables | `#10`, `#11` | `expertUserId` | `payableId` (OPEN / PAID) | **HOÀN TẤT** |
| **U17** | Sàng lọc tiếp nhận & So sánh trùng | Admin | Menu Quản trị $\to$ Hàng đợi tiếp nhận | `/admin` | `AdminWorkspaceView` Intake & Compare | `#4`, `#12` | `intakeId` | Mở hồ sơ `caseId` | **HOÀN TẤT** |
| **U18** | Giao việc cho chuyên gia kiểm định | Admin | Tab Hồ sơ $\to$ Nút Giao việc | `/admin` | `AdminWorkspaceView` Assign Modal | `#10` | `caseId`, `expertUserId` | Sinh `taskId` | **HOÀN TẤT** |
| **U19** | Nghiệm thu công việc chuyên gia (QĐ 1) | Admin | Tab Hồ sơ $\to$ Nghiệm thu công | `/admin` | `AdminWorkspaceView` WorkAccept Modal | `#11` | `taskId`, `submissionId` | Sinh `payableId` (ACCEPTED_WORK) | **HOÀN TẤT** |
| **U20** | Ban hành quyết định nội dung bài (QĐ 2) | Admin | Tab Hồ sơ $\to$ Quyết định nội dung | `/admin` | `AdminWorkspaceView` Decision Modal | `#11` | `caseId`, `revisionId` | Sinh `decisionId` (APPROVED/REJECTED) | **HOÀN TẤT** |
| **U21** | Tạm dừng khẩn cấp (App Hold) | Admin | Nút "Đặt App Hold" trên hồ sơ | `/admin` | `AdminWorkspaceView` Hold Toggle | `#12` | `revisionId` | Cờ `isAppHold = true` | **HOÀN TẤT** |
| **U22** | Báo cáo thông tin sai lệch từ cộng đồng | Member / All | Nút "Báo sai" trên bài viết | `/posts/[postId]` | `ReportDialog` | `#12` | `postId`, `claimId`, `userId` | `reportId` (UUIDv7) | **HOÀN TẤT** |
| **U23** | Sổ cái minh bạch & Đối soát live | Guest / All | Menu "Minh bạch" | `/transparency` | `PublicLedger`, DemoPaymentsStream | `#14` | Năm tài chính | Danh sách giao dịch demo | **HOÀN TẤT** |

---

## 2. Các Phân Nhánh Ngoại Vi Được Tạm Hoãn (Deferred Out-of-Scope Features)

Theo đúng định hướng tại tài liệu Prompt Triển khai và Masterboard:
1. **DEX Token Swap / Cross-chain Bridge:** Việc hoán đổi tự động token ERC-20 khác sang USDC trước khi tip/donate được tạm hoãn sang giai đoạn phát triển Smart Contract nâng cao. Hiện tại FE hỗ trợ thanh toán trực tiếp bằng USDC chuẩn ERC-20 và ETH native.
2. **Thị trường mua bán NFT thứ cấp (Secondary Marketplace):** Ventlore chỉ quản lý chứng nhận đóng góp và quyền sở hữu ban đầu (Primary Issuance). Luồng mua bán/chuyển nhượng Author NFT trên sàn phi tập trung thuộc phạm vi tích hợp sau.
3. **Đồng bộ bản nháp lên đám mây (Cloud Draft Persistence):** Trong giai đoạn FE-First, bản nháp được lưu tại `localStorage` của trình duyệt người dùng. Việc xây dựng hệ thống WebSocket / API lưu nháp đa thiết bị sẽ triển khai cùng BE API.
