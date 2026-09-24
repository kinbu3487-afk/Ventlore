# Ventlore — 03 · On-chain song song

Phiên bản 2.0 · 24/09/2026 · Tiếp tục repository hiện có.

## Cách dùng

Lưu bốn file v2 vào `docs/prompts/`, chạy **file 04 — Merge, giai đoạn A** trước. Mở worktree CHAIN được ghi trong WORKSPACES và giao toàn bộ file này cho agent. Không phải chờ FE/BE hoàn tất; sử dụng hợp đồng dữ liệu và giao diện chain đã thống nhất.

Phạm vi tương ứng Prompt 07–08 cũ, được tách khỏi yêu cầu đợi BE_HANDOFF hoàn chỉnh. Giữ nền ID/schema và mọi phần đang hoạt động từ Prompt 00–01 cùng các lần sửa; không dựng lại repository. Không giả định contract đã có hoặc đã deploy chỉ vì UI hiển thị ví/NFT/donate.

## Vai trò và ranh giới

Bạn phụ trách smart contracts Ventlore, thư viện nối ID, generated ABI/types, deployment manifest và kiểm thử chain. Trực tiếp triển khai phần còn thiếu, giữ code đang đúng; trả lời tiếng Việt.

1. Đọc AGENTS/hướng dẫn repo, trạng thái/handoff, `docs/parallel/BASELINE.md`, `CONTRACTS.md`, `OWNERSHIP.md`, `WORKSPACES.md`, ID Registry, Logic 0.3 và Event/UI liên quan tiền/role/quyền lợi. Kiểm tra branch/worktree/HEAD/git status.
2. Kiểm kê contract/deployment có thật. Nếu có deployment, ghi chain/address/ABI/source commit và tác động tương thích; không sửa namespace/key formula để nâng version hoặc mặc định contract cũ chưa có người dùng.
3. Chỉ sửa contracts, chain package/generated artifacts, local tests/scripts và tài liệu CHAIN được giao. Không sửa DB, worker decoder thủ công, API hoặc UI. Consumer cần đổi thì ghi request để Merge điều phối.
4. Giữ toolchain đang phù hợp. Nếu chưa có, dùng baseline Solidity/Foundry/OpenZeppelin, kiểm tài liệu chính thức và khóa compiler/dependency/EVM target tương thích môi trường dự kiến. Thay đổi root lockfile/config qua Merge; không tự chọn canary.
5. Hợp đồng giao tiếp phải nêu function/struct/event/error, người ký, role, business key và replay scope. ABI JSON phải sinh từ compile, không copy tay hoặc bịa để FE/BE code trước.
6. CHAIN có thể hoàn thiện và test local không cần DB/API thật. Dùng fixture cùng schema/ID vector đã chốt; fixture không tự thành quyết định hoặc receipt thật của backend.
7. Được commit phần mình. Local deploy chỉ vào Anvil/test instance được xác định, với tài sản/khóa thử nghiệm riêng. Không tự broadcast testnet/mainnet, push/publish hoặc dùng ví thật; chuẩn bị dry-run/runbook cho người vận hành.

## CHAIN-A — Khóa interface và kiểm ID chéo

Đây là mốc sớm để BE viết decoder/adapter và FE viết luồng ví; không đợi hoàn thành cả bộ contract mới công bố interface.

- Giữ chain interface từ baseline; hoàn thiện phần thiếu bằng đề xuất nhỏ có version. Function/event/tuple order, error và caller được ghi chính xác; mọi đổi breaking phải qua Merge trước khi consumer dựa vào.
- `APP_NAMESPACE = keccak256(UTF8("VENTLORE_V1"))`.
- `entityKey(kind, uuid) = keccak256(abi.encode(APP_NAMESPACE, kind, bytes16(uuid)))`; ABI types `bytes32,string,bytes16`. Dùng đúng 16 byte UUID, không hash chuỗi UUID, không SHA3-256, không encodePacked.
- Kind theo CSV: `post`, `revision`, `claim`, `route`, `donation-request`, `payable`, `credential`, `collectible`, `region`, `reason`. Không tạo keyKind cho mọi UUID hoặc tự thêm payment/funding/refund key.
- `RECEIPT_DOMAIN = keccak256(UTF8("VENTLORE_RECEIPT_V1"))`.
- `receiptKey = keccak256(abi.encode(RECEIPT_DOMAIN, chainId, splitterAddress, donorAddress, requestKey))`; types `bytes32,uint256,address,address,bytes32`.
- `NFT tokenId = uint256(collectibleKey)`; `SBT tokenId = uint256(credentialKey)`. Token identity đầy đủ là chainId+contractAddress+tokenId.
- Không công khai userKey từ social userId; không suy ngược UUID từ hash. Mapping DB và backup thuộc BE/Merge.
- Viết test độc lập TypeScript và Solidity cho cùng vector: UUID→bytes16→key, receipt, tokenId và các trường hợp sai encoding/kind/domain. Vector mới phải ghi là tạo từ đặc tả, không nhận là vector gốc nếu thiếu nguồn.
- Xuất ABI từ interface/contract đã compile được, gắn commit/hash và trạng thái `INTERFACE_ONLY` hoặc `IMPLEMENTED`. Một ABI compile được chưa chứng minh implementation đã đủ hoặc deployment tồn tại.

**Bàn giao CHAIN-A:** keys TS/Solidity khớp, interface có code compile và ABI thật, role/caller/events/errors rõ, các câu hỏi chưa chốt có nhãn. Merge đồng bộ ABI/schema với BE/FE; không tự sửa consumer ngoài phạm vi.

## CHAIN-B — Registry, donate và trả công

Kiến trúc baseline: registry cho route/block/roles; payments cho donate/payTask. Tên contract giữ tên thực tế trong repo nếu phù hợp. Không thêm token Ventlore giao dịch, marketplace, staking, DAO, bridge hay upgrade proxy vào phạm vi này.

### Tài sản, split và quyền ký

- Một ERC-20 tiêu chuẩn được cấu hình cho mỗi payments deployment; local dùng MockERC20 rõ nhãn, ETH chỉ gas. Tài sản tiền thật chưa chốt thì giữ configuration placeholder.
- Treasury recipient và dependencies bất biến theo deployment như thiết kế đã thống nhất. Thay thông tin bất biến cần deployment/migration plan, không đổi lịch sử route/receipt.
- PROJECT: 100% amount từ donor vào quỹ. POST_TIP: projectAmount=floor(amount/5), authorAmount=amount-projectAmount vào beneficiary trong route; hai chuyển atomic, một lỗi revert toàn bộ. Gas riêng.
- Amount nguyên/positive/minimum minh bạch; allowance đúng spender. Không hỗ trợ fee-on-transfer/rebasing bằng giả định ngầm: từ chối/giới hạn token hoặc kiểm balance delta phù hợp, để receipt không sai số tiền thực.
- Kiểm các địa chỉ trùng, self-transfer, treasury trùng beneficiary hoặc donor theo chính sách kỹ thuật đã ghi; event/ledger consumer phải hiểu đúng dòng tiền, không tạo thu nhập giả.
- payTask dùng payableKey/recipient/asset/amount đã chốt; ví TREASURY có quyền ký chi, backend không ký. Contract không tự đọc DB nghiệm thu: vẫn có trust assumption về treasury signer và quy trình backend, phải ghi rõ.
- ADMIN quản lý role/unpause/unblock theo thiết kế; OPS thao tác nội dung trong phạm vi, không có quyền chi quỹ. Permission matrix tách authorize/register/block với chi tiền và mở chặn.

### Route và consent

- Route bất biến chứa routeKey, revisionKey, postKey, decision/content commitment phù hợp, beneficiary, validUntil và previousRouteKey nếu thay. Tối đa một current route/revision/deployment.
- Đổi ví/gia hạn tạo route mới, thay pointer atomically; receipt cũ vẫn gắn beneficiary cũ. NFT owner không quyết định beneficiary.
- Register đúng role và có consent beneficiary. EIP-712 domain chainId+verifyingContract+version; payload ràng buộc đầy đủ điều khoản, source keys, beneficiary, expiry, split/treasury/token/payment-contract context liên quan, previous route, nonce/deadline.
- Chống replay bằng consumed nonce/authorization; EIP-712 không tự thay điều này. Wrong chain/contract/payload/recipient, expired/used signature đều bị chặn. Hỗ trợ ERC-1271/contract wallet nếu scope có, dùng thư viện phù hợp.
- Revision block là state riêng, register/late event không tự gỡ block. Donate trực tiếp phải kiểm current route, validity, expiry, pause/revoke/block bằng state contract tại execution.
- validUntil không vượt approval/consent đã được authorize. Hết hạn dùng block.timestamp, không phụ thuộc cron/UI.
- Không viết setter boolean chung vô tình cho OPS cả quyền unblock của ADMIN. Nêu rõ việc app hold có khoảng trễ trước khi chain block được thực thi.

### Dedupe và sự kiện

- Donation dedupe donor+requestKey trong cùng payments deployment, dùng chung PROJECT/POST_TIP. Key đã dùng không cho đổi kind/route/amount rồi chuyển lại; retry không chuyển lần hai.
- payTask dedupe payableKey, giữ processed qua pause/role changes. Mark trước external call; transfer fail revert toàn bộ state.
- Event donation/payout chỉ sau thực thi thành công, chứa đủ source keys, payer/payee, token và split amounts để BE kiểm. Tên/field/order theo ABI đã chốt, không chỉ dựa ERC20 Transfer để kết sổ donate.
- Không emit userId social/private evidence. Reason dùng public commitment an toàn, không hash thô PII ít entropy.
- Dedupe có phạm vi deployment. Contract mới không tự biết nghĩa vụ/key đã dùng ở contract cũ; bàn giao kế hoạch đóng luồng cũ/đối soát/migration, không tuyên bố chống trả trùng xuyên deployment khi chưa có cơ chế.

**Kiểm thử CHAIN-B:** split bảo toàn tổng ở amount biên; PROJECT 100%; transfer thứ hai fail rollback; duplicate donate/payTask; wrong caller; consent invalid/expired/replayed; wrong domain; route cũ/hết hạn/bị chặn; pause/unpause; role escalation; malicious token/receiver và reentrancy. Dùng SafeERC20/access control/reentrancy guard đúng phiên bản và tests hành vi, không chỉ import tên thư viện.

## CHAIN-C — Contributor SBT và NFT tác giả

### Contributor SBT

- Contract riêng theo ERC-721 khóa chuyển/ ERC-5192 nếu chọn baseline này; không mở đường transfer qua approval. Mint/burn/revoke/expiry semantics ghi rõ; token tồn tại khác chứng nhận còn hiệu lực.
- tokenId theo credentialKey. OPS authorize đúng recipient/source; chủ ví được authorize tự claim. Replay/wrong caller/wrong recipient/expired authorization bị từ chối.
- Ràng buộc một Contributor active/user nằm ở BE theo user identity; chain chỉ biết authorization/ví, không thể chứng minh một con người từ địa chỉ ví.
- Thay ví có supersedes và quy trình revoke credential cũ trước khi kích hoạt mới; chưa xác nhận revoke thì replacement còn pending. Chứng nhận lịch sử không tự mất chỉ vì một bài hết hạn.

### Author Contribution NFT

- tokenId theo collectibleKey, authorization gắn postKey/sourceRevisionKey/decision commitment và original-author recipient.
- Lifetime một AUTHOR_CONTRIBUTION/postKey và một mint/collectibleKey. Tombstone không reset khi burn/transfer/revoke; revision mới hoặc key mới cho cùng post không mở mint lần hai.
- Nếu có transfer ERC-721, ownerOf chỉ chủ token; không đổi tác giả gốc, tác quyền, tip beneficiary, quyền VIP/quản trị hoặc quyền với địa điểm.
- Thiếu ví giữ eligibility ở BE; không mint vào ví suy đoán. SBT/NFT có action/authorization riêng; một nhánh lỗi không xóa nhãn offchain hoặc quyền lợi độc lập khác.
- Safe-mint callback là external call: đánh dấu claimed/minted trước callback, bảo vệ reentrancy. URI/metadata không lộ identity/evidence/GPS riêng; có version/policy và nguồn được phép public.

**Kiểm thử CHAIN-C:** unauthorized authorize/claim/revoke; replay/expiry/recipient; SBT transfer/approval; replacement khi revoke chưa xong; mint NFT lại sau burn/transfer/revision mới/đổi collectibleKey; callback reentrancy; NFT đổi chủ nhưng tip không đổi. Đối chiếu tokenId và keys với TypeScript.

## Artifacts cho các nhánh khác

Ở mỗi mốc cung cấp:

- ABI/types/events/errors sinh từ build artifact, build/source commit và hash để kiểm drift. Một nguồn chuẩn, không nhiều ABI copy tay.
- Manifest schema gồm deploymentId, environment, chainId, addresses, token/decimals, deploymentBlock, ABI hash/version, compiler/EVM target/source commit, role addresses và finality policy. Chỉ manifest deployment thực mới có address/block/tx thực; mẫu dùng placeholder có nhãn.
- Script local deploy có chain assertion, config checks, role separation và MockERC20; dữ liệu local tách testnet. Local signer thử nghiệm không dùng làm ví quỹ thật.
- Kịch bản thao tác: author consent → OPS register; OPS authorize → subject claim; donor approve → donate; treasury approve → payTask. Ghi expected caller, action business IDs, required events và lỗi cho từng bước.
- Consumer package đủ để BE decode và FE simulate/encode bằng ABI thật; việc ghép consumer thuộc Merge. Không coi receipt approve là receipt donate.
- `docs/parallel/CHAIN_HANDOFF.md`, `CHAIN_COVERAGE.md`, `CHAIN_QA.md`, threat model và phần trust assumptions thực tế.

## Testnet, đồng bộ và điều kiện dừng

- Chuẩn bị Arbitrum Sepolia theo baseline chainId 421614; xác minh lại RPC/explorer/finality/EVM support bằng tài liệu chính thức tại thời điểm triển khai. Không nhầm Ethereum Sepolia 11155111 hoặc mainnet 42161.
- Chỉ chuẩn bị testnet dry-run khi chưa có lệnh deploy tương ứng. Không bịa token “USDC chính thức”, địa chỉ ví, txHash hoặc kết quả explorer verification. Thiếu signer/RPC không chặn hoàn thành local tests và package triển khai.
- Không suy finality Arbitrum từ số block Anvil. Chain emits execution events; chính sách quan sát/đối soát/finalized nằm trong hợp đồng phối hợp với BE.
- Chạy unit/fuzz/invariant local; fork tests có provider thì báo riêng, không giả PASS. Build thành công không phải audit độc lập hoặc production-ready.
- `docs/parallel/requests/CHAIN-<slug>.md` ghi mọi đề xuất interface/role/manifest mới. Cập nhật tương thích qua Merge trước khi mở luồng consumer.
- Ở mốc đồng bộ: checkpoint commit, worktree sạch và tạm dừng sửa; Merge tích hợp/đồng bộ, sau đó đọc SYNC.md để tiếp tục.
- Hai vòng sửa cùng lỗi không tiến triển thì ghi blocker/tái hiện, tiếp tục phần độc lập. Không tự mở agent phụ, nâng model hoặc chạy thử nghiệm vô hạn.

Hoàn thành khi contract local có bằng chứng chức năng/bất biến, ABI và key vectors đúng, artifacts có thể tích hợp. Testnet/mainnet chỉ được ghi đã chạy khi có execution thật đúng phạm vi được phép.
