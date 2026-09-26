# Ventlore — 02 · Back-end song song

Phiên bản 2.0 · 24/09/2026 · Tiếp tục repository hiện có.

## Cách dùng

Lưu bốn file v2 vào `docs/prompts/`. Chạy **file 04 — Merge, giai đoạn A** để chốt nền chung trước. Mở worktree BE đã được tạo và giao toàn bộ file này cho agent. Không cần chờ front-end hoàn thiện hoặc smart contract được deploy.

Phạm vi thay thế cách thực thi tuần tự của Prompt 04–06 cũ. Giữ code/schema/hợp đồng ID đã làm trong Prompt 00–01; chỉ bổ sung phần thiếu. Việc nối trang UI thuộc Merge, không làm lại màn hình trong nhánh BE.

## Vai trò, đầu vào và giới hạn

Bạn phụ trách back-end Ventlore: API, database, auth, nghiệp vụ, thanh toán/VIP adapter và worker. Đọc code rồi trực tiếp triển khai, kiểm tra và bàn giao. Trả lời tiếng Việt; code/identifier tiếng Anh.

1. Đọc hướng dẫn repo, trạng thái/handoff, `docs/parallel/BASELINE.md`, `CONTRACTS.md`, `OWNERSHIP.md`, `WORKSPACES.md`; xác nhận worktree/branch/base SHA và git status.
2. Đọc CSV ID Registry, Logic-ID-DB 0.3, các bảng Event/UI về API, quyền, state và QA. Sơ đồ là nguồn đối chiếu luồng; không lấy tên label UI thay enum nghiệp vụ.
3. Kiểm kê API/schema/service/test đang có: KEEP/FIX/BUILD/BLOCKED. Không suy từ UI demo rằng backend đã hoạt động. Không reset DB để khớp fixture.
4. Giữ stack đang phù hợp. Theo thiết kế hiện có, Route Handlers có thể nằm trong `apps/web`, services/DB ở package riêng, worker chạy tiến trình riêng. Không bắt buộc tạo backend service/repository thứ hai.
5. Chỉ sửa file BE theo ownership. Không sửa UI/catalog/CSS, contract Solidity hoặc ABI sinh từ compile. Đề xuất thay đổi root config, lockfile, API/schema chung bằng request qua Merge.
6. OpenAPI/schema đã pin là hợp đồng của các consumer. Bạn là chủ trì thay đổi nghiệp vụ API, nhưng thay đổi dùng chung phải có compatibility/migration và được đưa qua mốc đồng bộ; không âm thầm thay field/enum để tests của BE chạy.
7. Cài/chạy dependencies theo lockfile và môi trường local/test đã xác định. Dùng database/schema/instance dành cho BE, khác integration/production. Không trỏ seed/migration thử vào DB chưa xác định.
8. Được commit phần của mình. Không tự push, deploy, gửi tx, thay secrets/role production hoặc merge branch. Không nhận private key/seed phrase trong chat; server/worker không giữ khóa ký chain.

## BE-A — Nền dữ liệu, quyền và API đọc

### Schema và ID

- Bám 34 trường ID trong CSV, giữ PK/FK UUID canonical; UUIDv7 mới do API cấp. Giữ ID đã tồn tại; không tái sinh ID lịch sử để “chuẩn hóa”. Provider identity, displayCode, handle, wallet và txHash không thay userId/business ID.
- Không tạo contributionId hoặc eventId nghiệp vụ thay postId/revisionId/outboxId. Bảng kỹ thuật có thể bổ sung với mục đích và constraint rõ, không tạo một registry song song.
- Kiểm quan hệ: revision/parent cùng post; claim đúng revision; decision đúng case/revision/scope; submission đúng task; acceptance đúng task/submission; payable đúng acceptance/assignee; route/NFT đúng nguồn bài/decision.
- Author/place gốc của post, assignee task, snapshot đã nộp, decision và nghĩa vụ tiền không sửa đè. Draft tách khỏi snapshot. Không cascade xóa lịch sử tiền/quyết định khi ẩn nội dung/tài khoản.
- Unique tối thiểu: provider+subject; decision/case; acceptance/task; payable/acceptance; membership/user+plan; term/payment; AUTHOR_CONTRIBUTION/post kể cả sau burn; tối đa một Contributor active/user; một payout pending/unknown cho payable và một lần hoàn tất nghĩa vụ.
- FK/check/unique/transaction có enforcement ở PostgreSQL; không chỉ validator TypeScript. Quản lý displayCode đồng thời an toàn; resolve một lần về UUID rồi JOIN bằng PK/FK.
- Chain mapping có deployment scope; chỉ đối tượng có keyKind trong registry mới cần chain key. Giữ đúng công thức trong CONTRACTS/ID_CONTRACT, test vector dùng chung và reverse mapping được backup.
- Viết migration bổ sung có lịch sử. Với database đang có dữ liệu, kiểm tác động, backfill rõ; không sửa lịch sử migration đã áp dụng hoặc xóa dữ liệu để test qua.

### Auth, capability và privacy

- Xác thực session/JWT bằng provider thực tế đã dùng; Google là baseline nếu chưa có provider. Không tin userId/role/capability do client tự khai. Không tự ghép tài khoản vì trùng email/tên.
- /me trả capabilities đã tính theo role, scope/ownership, validUntil, conflict và membership. VIP/SBT/NFT không tự cấp quyền chuyên gia/operator/quỹ.
- Kiểm cookie/session, CSRF/origin, OAuth state và redirect/returnTo allowlist. Guest vẫn đọc public không cần tài khoản/ví.
- Wallet binding dùng challenge một lần có nonce/domain/origin/purpose/address/chain context/issuedAt/expiry, gắn đúng session. Kiểm chữ ký và contract wallet nếu hỗ trợ. Đổi ví tạo binding mới; disconnect UI không tự thu hồi mọi quyền onchain.
- Core tables và Storage private có grants/RLS/quyền truy cập phù hợp kiến trúc. Không cho client ghi role/decision/payable hoặc đọc evidence/private bằng cách gọi DB trực tiếp.
- Signed media URL có hạn và kiểm quyền; xử lý owner, MIME thực, dung lượng, checksum/trạng thái và metadata riêng tư. Public profile/ledger có DTO riêng đã lọc.
- Nội dung REVIEW_ONLY/VIP/private không rò qua HTML, SSR, API, search, cache, preview, URL tải, logs hoặc token metadata. Locale mới không tạo đường vòng qua quyền.

### API và đọc đa ngôn ngữ

- Giữ route/version thực tế; baseline `/api/v1`, error contract, cursor pagination, expectedVersion và requestTraceId. RequestTraceId không thay idempotency key.
- Mutation dedupe theo actor+operation+key+payload hash; cùng key/cùng payload trả cùng kết quả, khác payload 409. DB commit nghiệp vụ+audit+outbox cùng transaction.
- JSON amountAtomic/bigint là chuỗi; timestamp UTC; date-only giữ nghĩa ngày, không ép thành thời điểm rồi lệch múi giờ.
- Hỗ trợ Home/Explore/place/post/revision/public profile bằng cùng nguồn canonical; search alias/không dấu, merged resolve không đếm trùng. Endpoint trả đúng revision trong post, không chấp nhận revision của post khác.
- Bổ sung locale/content translations theo thiết kế hiện có. Bio cùng user dùng một nguồn; bài dịch gắn revision/hash nguồn thích hợp. Locale không tạo user/place/post ID mới hoặc đổi nguồn kiểm định.
- Fixture demo đủ sáu locale theo hợp đồng FE; dữ liệu thật thiếu bản dịch thì trả metadata ngôn ngữ nguồn/fallback có chủ đích. Không dịch động trả phí mỗi request. Không đưa nội dung private vào public catalogs.
- Nếu DB đã có demo, thêm dữ liệu dịch bằng migration/backfill idempotent có phạm vi rõ; sửa seed đơn thuần không đủ, không seed lại bằng cách xóa dữ liệu người dùng.
- Cache key/invalidation theo quyền, user phù hợp, entity/revision, locale và deployment khi liên quan; logout/expired membership/hold không giữ payload có quyền cũ.

**Bàn giao BE-A:** OpenAPI/schema đúng phiên bản; read/auth API thật local, DB tests và quyền guest có bằng chứng. Thiếu OAuth credential chỉ chặn kiểm live OAuth; không giả login đã chạy. Đây là mốc cho Merge nối luồng đọc sớm.

## BE-B — Nội dung, kiểm tra và nghĩa vụ trả công

- Đề xuất địa điểm: validate/lọc → candidate place+DISCOVERY post+revision/claims trong transaction; REVIEW_ONLY trước duyệt. Nếu điểm có sẵn dùng post/revision với place hiện có. Nháp chưa gửi không tự tạo reviewCase.
- Duplicate-check là gợi ý có lọc quyền; không unique tên/tọa độ để khẳng định trùng. Merge có canonical resolve, khóa/chống chu trình, giữ ID/hash/lịch sử gốc.
- Gửi/sửa bài tạo snapshot bất biến; canonical serialization/hash có version. Bản mới không thừa hưởng verification hoặc tip route. Bài thường PUBLIC+UNVERIFIED sau lọc theo policy hiện hành.
- ReviewCase khóa revision/scopeClaimIds/policyVersion. Assignment kiểm role/region/skill/conflict, không self-review. Không đủ người giữ WAITING_CAPACITY; hai account không chứng minh độc lập.
- Offer/task+reservation+outbox cùng transaction có lock ngân sách. Không reserve vượt nguồn đã đối soát; mức công/asset/payee/điều khoản không lấy từ client.
- Đổi assignee tạo task mới; NEEDS_MORE giữ task, nộp lại tạo submission mới. Luồng nhận/từ chối/expiry/start/submit/needs-more/accept/reject/cancel theo state machine đã chốt.
- Blind review lọc ở server theo mốc cho phép; không trả kết luận của người khác rồi trông chờ UI giấu. Evidence có quyền riêng.
- ACCEPTED_WORK tạo acceptance+payable đúng một lần. Decision nội dung độc lập: APPROVED/CHANGES_REQUESTED/INCONCLUSIVE/REJECTED; case terminal có tối đa một decision bất biến. Công đạt+bài REJECTED vẫn tạo payable.
- APPROVED có scope/ngày/hạn nguồn; bốn nhánh nhãn/SBT/NFT/tip xét độc lập và idempotent. Thiếu ví không mất nhãn; chưa thấy chain event hợp lệ không ISSUED/ACTIVE.
- Reservation chuyển thành nghĩa vụ không trừ hai lần; PAID không bị tính nghĩa vụ chưa trả nữa. Hủy/từ chối giải phóng reserve đúng điều khoản, không xóa công đã làm.
- Ngân sách backend là cam kết vận hành, không mặc định là escrow onchain khóa vốn. Reconcile chi ngoài app/balance trước khi offer khi cần; nguồn không chắc thì ngừng cam kết mới.
- Report gắn revision/claim và từng reporter; báo sai không tự REJECTED. App hold có hiệu lực ngay tại read/mutation gates, chain block là quá trình riêng. Event ACTIVE đến muộn không thắng hold mới; restore xét tất cả hold/decision/chain gates.
- Tuyển VIP cần approval+consent, giữ cảnh báo thiết yếu public và không tự khóa ngược nội dung đã public.

**Bàn giao BE-B:** kiểm thử PostgreSQL cho race reservation/acceptance, self-review, blind leakage, wrong revision, draft conflict, merge cycle, sửa khi review, rejected nhưng có công, approved chưa ví và hold trong lúc chain pending. Dùng API tests độc lập; không sửa UI để tạo bằng chứng giả.

## BE-C — Tiền, VIP, outbox và indexer

### Intent, action và preparation

- Donation lưu immutable kind, donor binding/address, amountAtomic, asset, revision/route nếu POST_TIP, deployment và requestKey. Retry giữ ID; đổi ý định thực hiện quy trình mới rõ ràng.
- Mỗi approve/approve(0)/donate/payTask/register/authorize/claim có actionId riêng gắn purpose/payload/deployment/expectedCaller; một action có nhiều attempt. Payout gắn payable; unknown/pending không tạo lệnh chi cạnh tranh.
- API chuẩn bị tx kiểm quyền/gates/manifest, trả payload typed để ví đúng actor ký. Không ký thay; không lấy client toast/receipt approve làm xác nhận nghiệp vụ.
- Funding/refund cần FK riêng đến nguồn tương ứng và constraints; không nhét ID tùy ý vào JSON hoặc lạm dụng action purpose khác.
- CHAIN chưa bàn giao ABI thì giữ adapter typed theo interface thiết kế và test doubles ghi rõ. Không tự viết ABI giả/deployed address giả. Adapter thật chỉ dùng ABI compile từ phiên bản CHAIN đã đồng bộ.

### Worker và sổ quỹ

- Worker độc lập request web; outbox lock/lease/retry/backoff/dead-letter, dedupe outboxId+handler. Restart/crash không nhân đôi tác dụng.
- Quét logs theo manifest/deploymentBlock bằng cửa sổ hữu hạn/checkpoint. Có HTTP polling nếu RPC không hỗ trợ WebSocket. Bắt được giao dịch ngoài app/mất browser callback.
- Raw identity: chainId+blockHash+txHash+logIndex; business receipt: chainId+contract+receiptKey. Kiểm contract/chain/ABI/caller/token/amount/beneficiary/business key/canonical block.
- OBSERVED và FINALIZED khác nhau. Áp finality policy đã xác minh cho deployment; không lấy số block tùy ý hoặc tín hiệu local để khẳng định finality Arbitrum. Không chứng minh được thì giữ pending.
- Reorg: continuity/parentHash/common ancestor, gỡ projection provisional/rescan/idempotent; không xóa raw history. Nếu có bất thường sau mốc được coi finalized, dừng kết sổ phần ảnh hưởng và báo điều tra, không tự che bằng ghi đè ledger.
- DonationRecorded là nguồn ghi donate, ERC20 Transfer chỉ đối chiếu; không đếm hai lần. Direct-chain không có userId/donationId vẫn ghi donorAddress/receipt và liên kết chỉ khi khớp payload.
- Safe outer success chưa đủ; cần thực thi/event bên trong đúng nghiệp vụ. Trạng thái route/grant/payable dựa projection của từng loại.
- Tách OWNER_FUNDING, PROJECT_DONATION, POST_TIP_SHARE, VIP_REVENUE, TASK_PAYOUT, REFUND theo asset/deployment. Raw transfer chưa rõ nguồn chưa thành tiền donate/available.
- PROJECT vào quỹ toàn bộ; POST_TIP projectAmount=floor(amount/5), tác giả nhận phần còn lại, atomic units/gas riêng. Self-transfer/tài khoản nhận trùng không tạo thu nhập quỹ giả.
- Refund là nghĩa vụ riêng có nguồn, giới hạn tổng và lịch sử. Không sửa receipt gốc hoặc cho rằng quỹ kéo lại 80% đã vào ví tác giả; người hoàn tiền thực tế phải ký đúng phần của mình.

### Membership

- PaymentAdapter trung lập provider: quote/createCheckout/verifyNotification/reconcile. Test adapter chỉ trong test/demo được cấu hình rõ. Không có provider thật trả NOT_CONFIGURED, không mở fake checkout trong production.
- Baseline 1500 USD cents, 12 tháng lịch UTC, gia hạn chủ động. Nếu crypto được chọn sau này, quote immutable asset/rate/amount/expiry, không mặc định stablecoin luôn bằng USD.
- Chỉ payment confirmed đúng provider/receipt mới cấp term; lock membership, unique term/payment. startAt=max(confirmedAt,currentEndsAt); cộng 12 tháng lịch, clamp cuối tháng; hiệu lực [startAt,endsAt).
- Duplicate/out-of-order callbacks và gia hạn đồng thời không cấp lặp. Donation không gia hạn VIP. Kiểm server clock mỗi request, không đợi cron mới hết quyền.
- Refund/chargeback tác động term theo policy có lịch sử; policy chưa chốt thì ghi chờ quyết định, không tự sáng tác hoặc xóa payment.

**Bàn giao BE-C:** tests duplicate/out-of-order logs, restart/reorg/RPC thiếu finality, Safe inner fail, unknown payout, direct donation, nguồn quỹ không đếm đôi; VIP duplicate/concurrent callbacks, pending/expiry và ngày 29/2. Phân biệt fixture/local chain/provider thật.

## Đồng bộ và nghiệm thu nhánh

- Trong worktree BE, chỉ chạy môi trường BE đã xác định; integration có DB/ports/manifest riêng. Worktree tách file không tự tách database, secrets hoặc chain state.
- `docs/parallel/requests/BE-<slug>.md` ghi dependency/cross-layer change. Không gọi FE/CHAIN sửa bằng cách tự đổi code trong worktree của họ.
- Ở mỗi mốc tạo commit và cập nhật `BE_HANDOFF.md`, `BE_COVERAGE.md`, `BE_QA.md`: base/head SHA, contract version, endpoint status, migration/backfill, env placeholders, test data, lệnh/kết quả và phần chưa thật.
- Khi Merge đồng bộ: checkpoint, worktree sạch, tạm dừng ghi; tiếp tục sau khi đọc `SYNC.md`. Không tự pull/rebase/force-push trong lúc agent khác tích hợp.
- Chạy typecheck/build và tests có ý nghĩa theo scripts thực. Không hạ constraint/authorization/assertion để thông qua. Hai vòng sửa cùng lỗi không tiến triển thì ghi blocker và chuyển việc độc lập.
- Secret chỉ local env/secret store phù hợp, log có redaction. Không ghi private key trong repo/server/worker/browser. Không seed tài khoản quyền cao hoặc dev role-switcher vào production.
- Không tự chốt token tiền thật, ví quỹ/admin, provider VIP, mức công hay chính sách refund còn mở. Hoàn thành interfaces/local tests được phép, ghi rõ phần chờ cấu hình/quyết định.

Nhánh hoàn thành khi API/nghiệp vụ và worker trong phạm vi có bằng chứng local phù hợp. UI đã nối, testnet chạy và production sẵn sàng là những mốc khác, do Merge xác minh riêng.
