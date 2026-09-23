# Thiết Kế Giao Diện Blockchain (CHAIN_INTERFACE)

**Trạng thái Chặng 00:** Thiết kế giao diện dự kiến (Proposed Interface Design). Chưa tuyên bố có ABI contract đã compile thực tế. Toàn bộ chi tiết kỹ thuật bên dưới sẽ được khóa cứng tại Chặng 07–08.

---

## 1. Mục Tiêu & Kiến Trúc Module Contract

Hệ thống smart contract trên Arbitrum (Local Anvil / Arbitrum Sepolia `421614` / Arbitrum One `42161`) được phân tách thành 4 hợp đồng độc lập:

1. **`VentloreRegistry`:** Quản lý tuyến nhận tip (`tip_routes`), cờ chặn phiên bản bài viết (`revision_blocks`) và quyền quản trị nội dung.
2. **`VentlorePayments`:** Thực hiện chia tách tiền tip (`POST_TIP`), thu quỹ dự án (`PROJECT`), chi trả thù lao chuyên gia (`payTask`), chống trùng lặp và phát sinh biên nhận (`receiptKey`). Địa chỉ hợp đồng này chính là `splitterAddress` trong công thức tính receipt.
3. **`ContributorSBT` (Chặng 08):** Chứng nhận người đóng góp bất khả chuyển nhượng tuân thủ chuẩn ERC-5192.
4. **`AuthorContributionNFT` (Chặng 08):** Vật phẩm kỷ niệm ghi nhận bài viết được duyệt chuẩn ERC-721.

> [!NOTE]
> Không tạo token quản trị Ventlore, sàn giao dịch nội bộ, cơ chế staking, cầu nối cross-chain hay nâng cấp proxy (upgradeable proxy) trong phạm vi baseline 0.3 này.

---

## 2. Thông Số Mạng & Đồng Tiền Thử Nghiệm

- **Mạng thử nghiệm mục tiêu:** Arbitrum Sepolia (Chain ID: `421614`).
  - RPC URL: `https://sepolia-rollup.arbitrum.io/rpc`
  - Block Explorer: `https://sepolia.arbiscan.io`
- **Mạng sản xuất tương lai:** Arbitrum One (Chain ID: `42161`).
  - RPC URL: `https://arb1.arbitrum.io/rpc`
  - Block Explorer: `https://arbiscan.io`
- **Tài sản thanh toán thử nghiệm:** ERC-20 tiêu chuẩn (`MockERC20`), biểu diễn dưới dạng đơn vị nguyên tử (`atomic units`, ví dụ 6 hoặc 18 decimals). ETH chỉ dùng để trả phí gas giao dịch.

---

## 3. Danh Sách Thao Tác Onchain Dự Kiến

### 3.1 Nhóm Registry & Điều Khiển Tuyến (`VentloreRegistry`)

1. **`registerRoute`**
   - **Mục đích:** Đăng ký tuyến nhận tip cho một phiên bản bài viết đã được duyệt (`APPROVED`).
   - **Tham số:**
     - `bytes32 routeKey`: Khóa tuyến nhận tip (`entityKey("route", routeId)`).
     - `bytes32 revisionKey`: Khóa phiên bản bài viết (`entityKey("revision", revisionId)`).
     - `bytes32 postKey`: Khóa bài viết (`entityKey("post", postId)`).
     - `address beneficiary`: Địa chỉ ví tác giả nhận tiền.
     - `uint64 validUntil`: Thời điểm hết hạn hiệu lực của tuyến (timestamp UTC).
     - `bytes32 previousRouteKey`: Khóa tuyến cũ bị thay thế (nếu có, hoặc `bytes32(0)`).
     - `bytes memory authorConsentSignature`: Chữ ký EIP-712 của tác giả chấp thuận các điều khoản.
   - **Người ký & Trả gas:** Ví Operator (`W_OPS`).
   - **Sự kiện phát ra:** `RouteRegistered(bytes32 indexed routeKey, bytes32 indexed revisionKey, bytes32 indexed postKey, address beneficiary, uint64 validUntil)`.

2. **`setRevisionBlocked`**
   - **Mục đích:** Đặt hoặc gỡ cờ chặn khẩn cấp đối với một phiên bản bài viết khi phát hiện sai phạm thực địa.
   - **Tham số:**
     - `bytes32 revisionKey`: Khóa phiên bản bị chặn.
     - `bytes32 reasonKey`: Khóa cam kết lý do chặn (`entityKey("reason", reasonId)`).
     - `bool isBlocked`: `true` để chặn, `false` để gỡ chặn.
   - **Người ký & Trả gas:** Ví Operator (`W_OPS`) để chặn; Ví Quản trị viên (`W_ADMIN`) để gỡ chặn.
   - **Sự kiện phát ra:** `RevisionBlocked(bytes32 indexed revisionKey, bytes32 indexed reasonKey, bool isBlocked)`.

### 3.2 Nhóm Thanh Toán & Phân Bổ Tiền (`VentlorePayments`)

1. **`donateProject`**
   - **Mục đích:** Quyên góp 100% số tiền vào ví ngân quỹ dự án (`treasuryAddress`).
   - **Tham số:**
     - `bytes32 requestKey`: Khóa ý định quyên góp (`entityKey("donation-request", donationId)`).
     - `uint256 amount`: Số tiền quyên góp tính theo đơn vị nguyên tử (`atomic units`).
   - **Người ký & Trả gas:** Người ủng hộ (`W_DONOR`).
   - **Quy tắc:** Kiểm tra chống trùng theo `(donorAddress, requestKey)`. Revert nếu chuyển token thất bại.
   - **Sự kiện phát ra:** `DonationRecorded(bytes32 indexed requestKey, bytes32 indexed routeKey, address indexed donor, uint256 totalAmount, uint256 authorAmount, uint256 projectAmount, bytes32 receiptKey)` (với `routeKey = bytes32(0)`, `authorAmount = 0`, `projectAmount = amount`).

2. **`tipContribution`**
   - **Mục đích:** Ủng hộ bài viết; tự động chia 80% cho tác giả và 20% cho quỹ.
   - **Tham số:**
     - `bytes32 requestKey`: Khóa ý định quyên góp (`entityKey("donation-request", donationId)`).
     - `bytes32 routeKey`: Khóa tuyến nhận tip đang có hiệu lực.
     - `uint256 amount`: Số tiền ủng hộ.
   - **Người ký & Trả gas:** Người ủng hộ (`W_DONOR`).
   - **Quy tắc phân bổ:**
     - `projectAmount = amount / 5` (tương đương 20%).
     - `authorAmount = amount - projectAmount` (tương đương 80%).
     - Tuyến phải đang hoạt động (`isActive == true`), bài không bị chặn (`!isBlocked`), và `block.timestamp < validUntil`.
     - Hai lần chuyển tiền (sang ví tác giả và ví quỹ) thực hiện nguyên tử: nếu một trong hai thất bại thì revert toàn bộ.
   - **Sự kiện phát ra:** `DonationRecorded(bytes32 indexed requestKey, bytes32 indexed routeKey, address indexed donor, uint256 totalAmount, uint256 authorAmount, uint256 projectAmount, bytes32 receiptKey)`.

3. **`payTask`**
   - **Mục đích:** Chi trả thù lao kiểm định cho chuyên gia sau khi công việc được nghiệm thu.
   - **Tham số:**
     - `bytes32 payableKey`: Khóa khoản phải trả (`entityKey("payable", payableId)`).
     - `address payee`: Địa chỉ ví của chuyên gia nhận tiền.
     - `uint256 amount`: Số tiền thù lao đã chốt trong hợp đồng nhiệm vụ.
   - **Người ký & Trả gas:** Ví Quản lý Quỹ (`W_TREASURY`).
   - **Quy tắc:** Kiểm tra chống chi trả lặp lại theo `payableKey`. Ghi nhận trạng thái đã xử lý trước khi thực hiện chuyển tiền (Checks-Effects-Interactions).
   - **Sự kiện phát ra:** `TaskPaid(bytes32 indexed payableKey, address indexed payee, uint256 amount)`.

---

## 4. Công Thức Khóa & Nguồn Sự Thật (Source of Truth)

1. **Nguồn sự thật tài chính:**
   - Sự kiện `DonationRecorded` và `TaskPaid` trên blockchain là nguồn sự thật duy nhất ghi nhận tiền đã hoàn tất thực thi.
   - Biên nhận `receiptKey` lưu trữ cố định: `(chainId, splitterAddress, donorAddress, requestKey)`.
2. **Nguồn sự thật thông tin:**
   - Cơ sở dữ liệu offchain là nguồn sự thật cho nội dung bài viết, dữ liệu bằng chứng, kết quả đánh giá và thông tin người dùng.
   - Blockchain chỉ lưu trữ các cam kết băm (`contentHash`, `decisionHash`) và các khóa định danh liên kết.

---

## 5. Các Chi Tiết Cần Khóa Cứng Tại Chặng 07

Tại Chặng 07 (Smart contract Arbitrum), agent và kỹ sư bắt buộc phải xác minh và khóa cứng:
1. **Phiên bản Solidity & Compiler:** Pin chính xác Solidity `0.8.28` và OpenZeppelin Contracts `v5.x` trong `foundry.toml`.
2. **EVM Target:** Đặt `cancun` hoặc `paris` tương thích tuyệt đối với Arbitrum Nitro rollup.
3. **Cấu trúc EIP-712 Typed Data:** Định nghĩa `EIP712Domain` chuẩn và struct `AuthorConsent(bytes32 routeKey, bytes32 revisionKey, address beneficiary, uint64 validUntil, uint256 nonce)`.
4. **Cơ chế Replay Protection:** Tiêu thụ nonce dùng một lần hoặc đánh dấu khóa đã sử dụng để chống phát lại chữ ký.
5. **Safe / Multi-sig Handling:** Kiểm tra điều kiện khi ví quỹ hoặc ví admin là Gnosis Safe đa chữ ký.
