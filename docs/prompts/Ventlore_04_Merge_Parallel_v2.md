# Ventlore — 04 · Chuẩn bị, đồng bộ và merge

Phiên bản 2.0 · 24/09/2026 · Bộ bốn prompt tiếp nối Prompt 00–01 đã gần hoàn tất.

## Bin dùng bộ này như thế nào?

Đưa cả bốn file vào `docs/prompts/` của repository Ventlore đang làm:

| File | Nơi chạy | Phạm vi |
|---|---|---|
| `Ventlore_01_Frontend_Parallel_v2.md` | Worktree FE | Giữ/sửa phần còn thiếu của 01; làm tiếp UI của 02–03 cũ |
| `Ventlore_02_Backend_Parallel_v2.md` | Worktree BE | Phần dữ liệu/API/worker của 04–06 cũ |
| `Ventlore_03_Onchain_Parallel_v2.md` | Worktree CHAIN | Phần contracts của 07–08 cũ |
| `Ventlore_04_Merge_Parallel_v2.md` | Repo hiện tại lúc chuẩn bị, rồi worktree MERGE | Chốt nền chung, tạo worktree; đồng bộ, tích hợp và nghiệm thu của 09–10 cũ |

**Thứ tự sử dụng:**

1. Chạy file này ở **Giai đoạn A — Chuẩn bị**. Đây là kiểm tra và bổ sung nền còn thiếu, không chạy lại Prompt 00/01.
2. Khi A báo đủ điều kiện, mở FE, BE, CHAIN ở ba cửa sổ/project riêng và giao file tương ứng. Mỗi cửa sổ chỉ mở workspace được chỉ định.
3. Ở mỗi mốc bàn giao hoặc khi cần thay hợp đồng chung, chạy **Giai đoạn B — Tích hợp** trong worktree MERGE; checkpoint các nhánh liên quan trước khi đồng bộ.
4. Khi các mốc chức năng đủ, chạy **Giai đoạn C — Nghiệm thu** trong worktree MERGE.

Không cần agent MERGE chạy liên tục song song với ba agent triển khai. Nó làm việc lúc chuẩn bị, đồng bộ hoặc kiểm tra kết quả. Prompt không tự tạo một hệ điều phối AI chạy nền; Bin vẫn cần khởi động phiên/đưa lệnh tiếp tục nếu công cụ chưa có orchestration tương ứng.

Nếu không nêu giai đoạn: kiểm tra hiện trạng. Chưa có baseline/worktrees thì chạy A; đã có thì chạy B cho các checkpoint sẵn sàng, sau đó C khi đủ phạm vi. Không tự chạy lại A hoặc tạo worktrees trùng.

---

## Vai trò chung

Bạn là người tích hợp Ventlore. Mục tiêu là giữ thành quả Prompt 00–01 và các lần sửa, cho phép ba nhánh phát triển độc lập rồi tạo một bản hợp nhất có thể kiểm tra. Trực tiếp làm việc trong repo theo giai đoạn được giao, không chỉ viết kế hoạch.

Các quyết định đã có:

- Dự án tiếp tục trong một repository, không tạo ba repository độc lập hoặc scaffold lại.
- UI/i18n/Home đã sửa qua nhiều vòng. Phần đạt giữ nguyên; phần chưa đạt có bằng chứng mới sửa.
- Ba lớp dùng chung nghiệp vụ/ID/API/chain interface. Agent không có quyền tự đổi business rules để thuận tiện code.
- Triển khai local, tạo commit/worktree/nhánh và ghép nhánh tích hợp local nằm trong phạm vi prompt. Không tự merge vào nhánh production/main, push kích hoạt deploy, publish website, chạy migration production hoặc broadcast chain ngoài local khi chưa có chỉ dẫn tương ứng.
- Bản này là hướng dẫn thực thi; chưa phải chứng nhận repository hiện tại đã đủ nền chung hoặc mọi gate đã đạt.
- Dùng model/coding agent có quyền truy cập repo thực tế; không giả định tài khoản có một model cụ thể, không tự mua dịch vụ hoặc đổi chính sách quyền của công cụ.

## Nguồn và cách giải quyết khác biệt

Đọc `AGENTS.md`/hướng dẫn repo, Git và code/test thật, PROJECT_STATE/HANDOFF/DECISIONS/OPEN_QUESTIONS, rồi đối chiếu:

- `Ventlore_ID_Registry_v0_3.csv` — 34 trường định danh, PK/FK, prefix và keyKind.
- `Ventlore_Logic_ID_DB_v0_3.pdf` — nghiệp vụ, trạng thái, ID, constraint và C01–C22.
- `Ventlore_So_do_Khoi_v0_3.pdf` — D01–D11.
- `Ventlore_Event_UI_Spec_v0_3(1).pdf` — S01–S35, C01–C50, U01–U12/72 bước, QA01–QA25.
- `Ventlore_Event_UI_Wireframes_v0_3(1).pdf` và `Ventlore_Brand_Guide_v0_1.pdf`.
- Các prompt UI đã có, đặc biệt `Ventlore_Prompt_01_Round_4_HomePage_i18n.md`; bộ prompt gốc `Ventlore_Antigravity_Prompt_Pack_v1_0.md` làm nguồn truy vết phạm vi.

Tên file có thể đã chuẩn hóa: tìm và lập mapping tên thật. Source SQL/example JSON/assets được PDF nhắc nhưng không tồn tại phải ghi thiếu, không nhận đã đọc. Không cần đọc lại toàn bộ PDF mỗi lượt nếu đã có bản trích quy tắc được kiểm và pin nguồn.

Yêu cầu mới nhất của Bin có ưu tiên trong phạm vi nó sửa đổi. Code thực tế cho biết đã làm gì, không tự chứng minh hành vi sai trở thành đặc tả. Nếu code và nguồn xung đột, xác định nguyên nhân/bằng chứng và mức ảnh hưởng; sửa theo quyết định rõ hoặc ghi điểm cần quyết định, không suy đoán chính sách kinh doanh.

Bản v2 thay cách tổ chức tuần tự của bộ cũ. Nó không hủy yêu cầu nghiệp vụ còn hiệu lực. Đặc biệt không áp lại hero Explore cũ/mặc định locale cũ lên Home/i18n vòng 4.

## Giai đoạn A — Chốt nền chung và tạo nơi làm việc

### A1. Kiểm kê phần đã làm

1. Xác nhận thư mục repo, current branch, HEAD, `git status`, worktree list, scripts/toolchain, remote và trạng thái deploy nếu có dữ liệu. Không mặc định code local, GitHub và production cùng SHA.
2. Bảo toàn công việc chưa commit. Không reset/clean/rebase lịch sử người dùng. Chỉ stage nội dung đã kiểm, không `git add .` mù; loại secrets/artifacts ngoài scope. Nếu còn agent cũ đang ghi, đưa nó đến checkpoint trước khi chốt base.
3. Đọc code cho Prompt 00/01 và các vòng sửa; phân loại KEEP/FIX/BUILD/BLOCKED/NOT_VERIFIED. Chạy baseline typecheck/build và smoke tối thiểu bằng lệnh thực tế để biết lỗi sẵn có.
4. Ghi lỗi nền: lỗi cản contract/build/routing/capability phải sửa đủ trước khi mở nhánh bị ảnh hưởng; lỗi hình ảnh/câu chữ riêng FE có thể đưa backlog để BE/CHAIN đi tiếp. Không ép sửa toàn bộ UI mới được tách.
5. Đối chiếu Home + Explore + bài/profile + sáu locale, trạng thái verification/VIP và nguyên tắc dữ liệu private. Không đánh dấu backend/onchain xong chỉ vì UI có mock.

### A2. Tạo hoặc bổ sung bộ tài liệu chung

Tận dụng file đang có; `docs/parallel/` là lớp điều phối mỏng, không sao chép thành nhiều nguồn sự thật. Nếu repo đã có cấu trúc tương đương, ghi mapping và dùng lại.

| Tài liệu | Nội dung phải có |
|---|---|
| `BASELINE.md` | Nguồn/version, source SHA trước chốt, tên base ref sẽ dùng, KEEP/FIX/BUILD, trạng thái mock/real, lỗi nền và gate mở từng nhánh |
| `CONTRACTS.md` | Trỏ đến schema/OpenAPI/ID/state/permissions/chain interface chuẩn; phiên bản chung, payload mẫu, error/capability, mock và quy tắc tương thích |
| `OWNERSHIP.md` | Danh sách đường dẫn thực, chủ trì và cách xử lý file chung; phân biệt rõ pages/components với Route Handlers/server code |
| `WORKSPACES.md` | Worktree/branch/base ref, port, DB/test instance/Anvil/manifest/environment của FE/BE/CHAIN/MERGE |
| `SYNC.md` | Lịch sử checkpoint/base/head/integration SHA và hợp đồng nào thay đổi, nhánh nào đã nhận |
| `ACCEPTANCE.md` | Mốc I1/I2/I3, mapping nguồn → tiêu chí → kiểm tra, phần đã làm và phần chờ |

Tài liệu trạng thái từng lane do chính lane đó ghi; coverage/handoff tổng do Merge cập nhật. `requests/FE-*.md`, `BE-*.md`, `CHAIN-*.md` là nơi đề xuất đổi interface/config có chủ thể rõ; không dùng một file hàng đợi để ba agent cùng sửa.

### A3. Hợp đồng tối thiểu cần sẵn sàng

- **Dữ liệu/ID:** giá trị canonical UUID giữ xuyên lớp, key formula/registry, DTO liên kết đúng post/revision/decision, atomic amount string, date/UTC, version/idempotency.
- **API:** request/response/error/capability cho các module sắp làm. Tài liệu chuẩn OpenAPI/Zod hoặc tương đương có thể kiểm máy, không chỉ ghi “BE sẽ làm sau”. Endpoint chưa implement có nhãn rõ. Mock phải validate theo cùng hợp đồng.
- **Chain interface thiết kế:** functions/events/errors/caller/source keys/manifest/finality responsibilities. Chưa compile chỉ gọi là thiết kế; CHAIN-A cung cấp ABI compile thật. Không tạo ABI/addresses giả.
- **UI→state:** phân biệt verification, access, task/work, payable, grant, route, tx. Xác định nguồn có thẩm quyền cho từng field; label dịch không trở thành enum/ID.
- **Locale:** sáu locale, URL giữ context, root fallback theo quyết định vòng 4 (`en` nếu chưa có lựa chọn/ngôn ngữ trình duyệt phù hợp), content translations và private payload; consumer dùng một cách chọn nguồn.
- **Môi trường:** mock/demo, API thật local, chain local, testnet, production tách rõ. Không có cấu hình thì NOT_CONFIGURED, không fallback fake-success. Mode không được client tùy ý bật để lấy role/quyền thật.

Chỉ bổ sung phần tối thiểu còn thiếu của Prompt 00. CHAIN có thể bắt đầu local theo thiết kế interface trong khi ABI đang hoàn thiện; FE/BE không dùng ABI tưởng tượng làm kết nối thật. Phụ thuộc nào chỉ chặn một module thì ghi module đó, cho phần độc lập tiếp tục.

### A4. Quyền sở hữu file

Lập mapping theo repo thật; bảng sau là mẫu, không được dùng glob quá rộng để bỏ qua xung đột:

| Loại file | Chủ trì |
|---|---|
| Pages/layout/UI components/styles/assets/catalog/mock UI tests | FE |
| Route Handlers, services, DB/migrations, auth, worker và tests BE | BE |
| Solidity/Foundry, chain key implementation theo đặc tả, ABI/types sinh từ compile và scripts chain | CHAIN |
| OpenAPI/domain schema/HTTP client interface | BE chủ trì đề xuất, Merge đưa vào baseline/đồng bộ consumer |
| Shared mock adapter FE và fixtures | FE; schema hoặc fixture chuẩn dùng chung phải qua Merge |
| ABI/manifest schema dùng chung | CHAIN chủ trì, Merge kiểm BE/FE tương thích |
| Root package/lockfile/tsconfig/CI/deploy config, tài liệu tổng | Merge |

Nếu một file chứa cả UI và logic server, không cho hai chủ ghi cùng file. Dùng ranh giới nhỏ hiện có hoặc refactor tối thiểu trước tách; không đổi toàn bộ kiến trúc.

Thay đổi file chung phải ghi yêu cầu gồm lý do, schema trước/sau, consumer ảnh hưởng và kiểm tra. Chủ trì triển khai thay đổi cụ thể trong nhánh có checkpoint; Merge tiếp nhận, sửa consumer phối hợp và đồng bộ. Không để mỗi nhánh duy trì bản OpenAPI/ABI khác nhau rồi gọi tất cả là chuẩn.

### A5. Git worktree và môi trường

1. Chốt code nền đã kiểm và tài liệu chung bằng commit local có scope rõ. Dùng một **base ref cố định** (tag local hoặc SHA đã ghi ngoài chính commit đó); không lấy `main` theo phỏng đoán. Có thể đặt tên tag trước trong BASELINE rồi trỏ tag vào commit cuối, tránh cố ghi hash của commit vào chính nó.
2. Tạo/reuse các worktree với nhánh riêng từ cùng base; mỗi worktree chứa đầy đủ repo:

| Worktree gợi ý cạnh repo | Branch gợi ý |
|---|---|
| `Ventlore-FE` | `parallel/v2-fe` |
| `Ventlore-BE` | `parallel/v2-be` |
| `Ventlore-Chain` | `parallel/v2-chain` |
| `Ventlore-Merge` | `parallel/v2-integration` |

3. Dùng `git worktree add -b <branch> <path> <base-ref>` với giá trị thực đã kiểm. Nếu tên đã tồn tại, kiểm đúng repo/base/purpose rồi reuse hoặc chọn suffix rõ; không dùng `-B`, `--force` hay xóa thư mục để vượt lỗi. Giữ nguyên worktree gốc.
4. Cài dependency theo package manager/lockfile thật trong từng worktree cần chạy. Không symlink chia sẻ build output hoặc `.next`; mỗi dev server có port khác. Mẫu: FE 3001, BE 3002, MERGE 3000, Anvil CHAIN 8546, Anvil integration 8545, chỉ dùng nếu các port trống và script hỗ trợ.
5. Worktree không tự cô lập DB, env, Docker project/volumes hoặc chain state. BE và MERGE cần DB/test instances riêng; CHAIN và integration cần Anvil/data/manifest riêng; nếu chạy Supabase/Docker, tách project/port/volume phù hợp. Không chạy cùng seed/migration lên một DB chia sẻ.
6. File env bị Git ignore không tự đi theo worktree. Chuẩn bị env placeholders và cấu hình local tối thiểu đúng môi trường; không copy cả secrets production để “cho chạy”. Không commit env bí mật.
7. Cập nhật WORKSPACES với đường dẫn/branch/ref/port thực, lệnh start thực và nguồn cấu hình. Nếu cập nhật metadata sau khi tạo, commit trên integration và đồng bộ các nhánh trước khi bật agent.
8. Kiểm cả bốn đang đúng base/contract version, mỗi lane đọc được nguồn và file prompt của mình. Tạo hướng dẫn mở đúng thư mục trong coding agent; mở nhiều chat cùng một thư mục không thay cho worktree.

### A6. Khi đang dùng hệ loops cũ

Nếu repo có coordinator/worker theo `Ventlore_Loops_v3_Agent_Tu_dong.md`, kiểm nó có đang ghi code không. Không mặc định policy `active_batches=1` tự hỗ trợ ba nhánh.

- Với đợt này, chọn chạy ba phiên/worktree có giới hạn như trên. Cho scheduler cũ tạm ngừng nhận task ghi code mới qua cơ chế pause sẵn có, sau khi công việc hiện tại checkpoint; không kill mù hoặc xóa trạng thái.
- Không chỉ sửa `active_batches` lên 3 rồi nhận là đã có multi-worktree orchestration. Nếu muốn coordinator tự quản ba lane, đó là thay đổi phần mềm riêng cần ownership/locking/budget/isolation và kiểm thử.
- Giới hạn đề xuất đợt này: tối đa ba phiên triển khai đồng thời; không tự spawn agent phụ; một mục tiêu hữu hạn mỗi lane; dừng/ghi blocker nếu hai vòng sửa cùng lỗi không tiến triển. Không reset ngân sách cũ hoặc bật paid overage.
- Đo usage theo nhà cung cấp nếu có dữ liệu; không hứa song song tiết kiệm token hoặc nhanh gấp ba.

**Bàn giao A:** trạng thái nền thực tế, base ref/SHA, worktree/branch/port, gate từng lane, việc còn thiếu và chỉ dẫn mở file 01/02/03. Không kết luận đã tạo worktrees nếu chỉ viết lệnh mà chưa thực thi. Nếu thiếu quyền/tool chỉ chặn tạo worktree, vẫn bàn giao hợp đồng/kiểm kê và nêu bước cụ thể còn lại.

## Các bất biến chung phải giữ khi chuẩn bị hoặc merge

1. Một userId xuyên vai trò; wallet/VIP/SBT/role độc lập. Guest đọc public không cần login/ví. Biết ID không đồng nghĩa được đọc dữ liệu.
2. ID mới do API cấp UUIDv7; giữ nguyên ID hiện hữu. DisplayCode/handle là tra cứu; PK/FK dùng UUID. Không tạo contributionId thay post/revision.
3. `APP_NAMESPACE=keccak256(UTF8("VENTLORE_V1"))`; entityKey dùng `abi.encode(bytes32,string,bytes16)` và UUID 16 byte thực. Kind chính xác CSV, kể cả `donation-request`.
4. `RECEIPT_DOMAIN=keccak256(UTF8("VENTLORE_RECEIPT_V1"))`; receiptKey hash `abi.encode(domain,chainId,splitterAddress,donorAddress,requestKey)` với types bytes32,uint256,address,address,bytes32. Không encodePacked/SHA3-256 hoặc hash UUID text.
5. Snapshot revision/decision/submission đã nộp bất biến; revision mới không nhận nhãn/tip của revision cũ. Dịch không sửa bytes/hash nguồn hoặc tạo business ID mới.
6. Review đúng revision/scope, không self-review; thiếu người độc lập giữ WAITING_CAPACITY. Hai account/GPS không tự chứng minh sự thật hay độc lập.
7. Quyết định nội dung, nghiệm thu công và thanh toán tách riêng. Công đạt+bài REJECTED vẫn có payable. Bốn quyền lợi nhãn/SBT/NFT/tip xét độc lập.
8. PROJECT 100% quỹ; POST_TIP projectAmount=floor(amount/5), authorAmount=amount-projectAmount; gas riêng; amount atomic bigint/string, không float. Tài sản và deployment có scope rõ.
9. Donation không cấp VIP. VIP baseline 1500 USD cents/12 tháng lịch UTC, gia hạn chủ động; một payment confirmed cấp đúng một term. Pending không cấp quyền, hết hạn kiểm bằng server clock.
10. Intent/action/attempt/receipt khác nhau; approve không hoàn tất donate/payTask; unknown/retry giữ business key và đối soát trước gửi lại. Server/worker không giữ private key ký chain.
11. ONCHAIN observed khác finalized; ledger/grant/paid dựa bằng chứng đúng payload và chính sách finality. Late event không gỡ app hold mới; app hold không tự chặn contract trực tiếp.
12. SBT uniqueness theo user do BE cưỡng chế, chain không chứng minh một con người. NFT lifetime một AUTHOR_CONTRIBUTION/post kể cả burn; ownerOf không đổi tác giả hoặc beneficiary tip.
13. Ràng buộc quyền ở nguồn có thẩm quyền, không chỉ ẩn UI. Mock/demo/auth/persona switch không cấp quyền production hoặc rò private payload. Cảnh báo cần thiết public, tọa độ/evidence hạn chế vẫn kiểm quyền.
14. Không tự chốt token tiền thật, ví quỹ/admin, provider VIP, mức công, hạn kiểm tra, refund policy hoặc quyền kinh tế NFT đang mở. Có config/test adapters và trạng thái chờ, không giả là dịch vụ đã hoạt động.

## Giai đoạn B — Tích hợp từng mốc

### B1. Chọn mốc đủ phụ thuộc

| Mốc | Đầu vào cần có | Kết quả phải chứng minh |
|---|---|---|
| **I1 — Đọc và ngôn ngữ** | FE-A và BE-A đủ module đọc | Home → Explore → place → revision → profile dùng API/DB local; locale, canonical, quyền và cache nhất quán |
| **I2 — Đóng góp và công việc** | FE-B + BE-B; auth/session có thể kiểm local | Đề xuất/bài → task độc lập → submission → nghiệm thu/decision; privacy và nghĩa vụ đúng, chưa cần chi chain |
| **I3 — Ví, tiền và quyền lợi** | FE-C + BE-C + CHAIN-B/C và ABI/version tương thích | Ví → local contracts → event/indexer → trạng thái UI/sổ quỹ; grants/tip/VIP adapter đúng, không fake-success |

CHAIN-A là checkpoint interface sớm; không cần chờ I2 mới compile/test contract. Lane có thể làm tiếp module độc lập, nhưng chỉ gọi một mốc đạt khi đủ bằng chứng. Không chờ toàn dự án xong mới kiểm I1.

### B2. Nhận checkpoint và ghép

1. Mỗi lane liên quan checkpoint commit, báo SHA cụ thể, contract version, changed files, tests, remaining issues; worktree sạch và tạm dừng ghi trong cửa sổ đồng bộ. Không tự stash hoặc commit thay công việc đang viết dở mà chưa xác định.
2. Pin từng SHA và base ref. Đọc diff theo ownership và phát hiện schema/ABI/config/migration thay đổi ngoài kế hoạch. Không ghép từ tên branch đang chuyển động mà không ghi SHA.
3. Trong worktree MERGE, tạo checkpoint trước ghép. Ghép hợp đồng chung/API/ABI trước consumer có phụ thuộc; ghép các commit của lane theo thứ tự thực tế. Không áp một thứ tự FE→BE→CHAIN cứng nếu schema/ABI cần đi trước.
4. Conflict phải giải bằng ý nghĩa nghiệp vụ và nguồn. Không chọn toàn bộ ours/theirs hoặc giữ nguyên file chỉ để hết conflict. Được sửa glue/integration thuộc scope; khi cần chủ lane sửa, trả lỗi tái hiện và tiếp tục việc không bị chặn.
5. Dependency mới phải tương thích toolchain; Merge cập nhật package files và tái sinh lockfile bằng package manager thật. Không ghép lockfile bằng cách xóa ngẫu nhiên đoạn conflict hoặc bỏ frozen install để che lỗi.
6. Migration hai nhánh nếu có phải xét thứ tự, dữ liệu và migration đã áp dụng; không sửa migration live. ABI lấy từ compile source đã ghép; HTTP clients/types/mock validate lại với contract thống nhất.
7. Sau khi kết quả phù hợp, commit integration local và ghi SYNC.md với SHA đầu vào, nội dung thay đổi, tests và integration commit đã kiểm. Tài liệu không tự ghi hash của chính commit đang tạo; ghi checkpoint được kiểm hoặc báo SHA cuối ở bàn giao.
8. Đưa integration commit đã chốt về các lane sạch trước vòng tiếp theo. Có thể fast-forward khi lane HEAD là tổ tiên; nếu không, merge giữ lịch sử có kiểm tra. Không hard reset/rebase/force-push để loại commit mới của lane. Agent chưa dừng hoặc worktree dirty thì chưa đồng bộ lane đó.
9. Sau đồng bộ, lane đọc hợp đồng/SYNC mới và chạy kiểm tra phần bị ảnh hưởng; không tiếp tục từ ABI/schema cũ. Chỉ bật lại các phiên đã đồng bộ xong.

### B3. Local thật và kiểm thử mỗi mốc

- Dùng môi trường MERGE riêng cho web/DB/worker/Anvil, env và manifest đã ghi. Kiểm health/port/chainId/DB target trước migrate/seed/deploy local; không reset dữ liệu chưa được nhận diện là fixture thử nghiệm.
- I1/I2 dùng API+PostgreSQL thật local. OAuth không đủ credentials thì ghi login live NOT_CONFIGURED; harness auth chỉ cho test không phải cửa hậu production và không được gọi là OAuth đã kiểm.
- Chain local dùng ABI sinh từ compile source hợp nhất, MockERC20 và manifest local có deploymentId/chainId/addresses/token/decimals/deploymentBlock/ABI hash/source commit/roles/finality policy đúng thực tế.
- FE gọi API chuẩn bị, ví đúng actor simulate/ký; BE/indexer đọc event. Kiểm chain/account/to/value/token/spender/amount và gates ngay trước ký; đổi account/chain vô hiệu confirm cũ.
- Author consent → OPS register route; OPS authorize → subject claim; donor approve rồi donate; treasury approve rồi payTask. Mỗi action/attempt riêng, không dùng một tx success chung làm mọi trạng thái.
- Local finality driver ghi rõ mô phỏng; không suy độ trễ/finality mạng thật từ Anvil. Thiếu config trả lỗi rõ, không fallback mock trong integration mode.

### B4. Các ca tích hợp bắt buộc theo phạm vi

1. Guest đọc public, sáu locale; URL bài/profile vào thẳng; filter `cat ba` + Kayak giữ khi đổi Pháp/back/reload; revision giữ nguyên; merged resolve, Tây Côn Lĩnh không redirect sai locale.
2. Mọi profile demo có bio/label theo locale, đồng nhất AuthorCard/thẻ bài; bản dịch đúng revision; private/VIP/evidence không rò qua HTML/JSON/cache/catalog hoặc locale khác. Bài UNVERIFIED không có câu khẳng định đã kiểm.
3. Login/session → gửi điểm REVIEW_ONLY → operator giao người độc lập → nộp/bổ sung → nghiệm thu công và decision. Không đủ người giữ WAITING_CAPACITY; chưa có ví vẫn có nhãn nếu đủ điều kiện.
4. Bài REJECTED+công đạt → payable → treasury payTask → PAID sau đối soát; hai request reserve/acceptance đồng thời không vượt quỹ hoặc tạo nghĩa vụ trùng.
5. PROJECT và POST_TIP: balances/receipt/ledger đúng phần, gas riêng; approve thành công nhưng donate revert không tạo doanh thu; retry/double click/unknown không chi trùng; địa chỉ trùng không tạo thu nhập giả.
6. SBT/NFT đúng source và recipient; bản sửa không mint thêm NFT hoặc nhận nhãn/route cũ; transfer/burn không mở mint lại, ownerOf không đổi tip.
7. App hold khi register pending; event ACTIVE cũ không gỡ hold. Route cũ/hết hạn/bị block bị contract từ chối khi gọi trực tiếp.
8. Missing callback, duplicate/out-of-order logs, restart/reorg/indexer lag, replacement và Safe inner failure: phục hồi đúng business IDs, giữ pending khi chưa đủ bằng chứng.
9. VIP test adapter: pending không cấp quyền, confirmed cấp đúng một term, duplicate/concurrent callback không cấp lặp; hết hạn đúng server clock, ngày 29/2; donation không cấp VIP. Provider test không chứng minh checkout thật.

Chạy test thực ở commit hợp nhất. Tests trước merge chỉ là đầu vào, không thay smoke/contract checks sau merge. Đừng chạy mọi test nặng ở mọi vòng; chọn rủi ro thay đổi và các gate bắt buộc, rồi dừng khi đã đủ bằng chứng.

### B5. Trở ngại và testnet

- Khi có regression: giữ checkpoint trước merge, tạo fix/revert commit có scope; không xóa branch nguồn hoặc reset dữ liệu. Báo lỗi, lớp chịu trách nhiệm và ca tái hiện. Hai vòng không tiến triển thì để blocker cụ thể, tiếp tục phần độc lập.
- Testnet package có dry-run, assertions chainId/roles/token/constructor, manifest export/verify instructions. Baseline Arbitrum Sepolia 421614 cần xác minh lại từ tài liệu chính thức lúc dùng.
- Broadcast testnet chỉ khi đã có chỉ dẫn triển khai testnet và signer cấu hình đúng. Nếu chưa có, hoàn thành local và package; ghi NOT_DEPLOYED/NOT_CONFIGURED. Không yêu cầu seed phrase/private key trong chat hoặc bịa tx/address.
- Chỉ ghi testnet smoke đạt khi đã quan sát execution/receipt/projection thật. Không tự mainnet, merge production hoặc publish site trong prompt này.

## Giai đoạn C — Nghiệm thu và bàn giao

1. Tổng hợp FE/BE/CHAIN coverage theo S01–S35 cộng Home đã đăng ký, C01–C50, 72 event steps, Logic C01–C22 và UI QA01–QA25. Dùng namespace `UI.Cxx` và `Logic.Cxx` khi cần để không lẫn component với test scenario.
2. Coverage có file/code/API/contract/test/bằng chứng hoặc gap cụ thể. Panel/drawer không bắt buộc URL riêng; Home mới không đánh số lại màn cũ.
3. Chạy gate thực tế: lint/typecheck/build cần thiết, PostgreSQL integration, contract schema/ABI drift, browser journeys và Foundry unit/fuzz/invariant. UI responsive/i18n phải mở và xem screenshot; build không đủ.
4. Phân loại riêng `PASS`, `FAIL`, `NOT_RUN`, `NOT_CONFIGURED` và lớp thực thi `MOCK`, `LOCAL_REAL`, `TESTNET_REAL`. Không gom thành một tỷ lệ phần trăm gây hiểu nhầm.
5. Cập nhật PROJECT_STATE/HANDOFF/coverage tổng cùng `INTEGRATION_HANDOFF.md`, README setup/env/dev/test/migrate/seed/local deploy/worker, và RELEASE_STATUS.
6. Bàn giao OPS_RUNBOOK: quyền ký, pause/block/unblock, RPC/indexer lag/reorg, unknown payment, migrations/manifest, refund đúng signer, backup/restore DB+mapping. Kiểm một bài phục hồi local thích hợp; blockchain hash không tự khôi phục UUID/nội dung.
7. Tách trạng thái UI, API/DB, local chain, testnet, OAuth thật, VIP provider thật và production. Liệt kê chính sách còn mở/token/ví/role/provider cần cấu hình, ảnh hưởng cụ thể và người quyết định.
8. Nhận định của AI và static checks không phải audit độc lập. Nếu chưa đủ điều kiện phát hành, ghi rõ phần còn thiếu; không dùng nhãn production-ready chỉ từ build/local demo.
9. Bàn giao URL local/preview thật đã mở kiểm, commit/source SHA và cách Bin thử 3–5 thao tác. Khi chưa có preview, đưa lệnh/local URL thật; không tạo link giả.

Mẫu báo cáo cuối:

```text
VENTLORE — BẢN TÍCH HỢP CHỜ NGHIỆM THU
Base ref/SHA:
FE checkpoint / BE checkpoint / CHAIN checkpoint:
Integration SHA đã kiểm:
Phiên bản API / ABI / manifest:
Mốc: I1 ... | I2 ... | I3 ...
Đã giữ từ 00/01:
Đã bổ sung:
Cách mở bản chạy:
3–5 thao tác Bin kiểm tra:
Kết quả kiểm thử và bằng chứng:
Phần MOCK / LOCAL_REAL / TESTNET_REAL:
FAIL / NOT_RUN / NOT_CONFIGURED còn lại:
Quyết định hoặc cấu hình còn thiếu:
Trạng thái Git: local commit / đã push theo chỉ dẫn riêng nếu có
Trạng thái phát hành: chưa publish hoặc trạng thái thực có bằng chứng
```

## Khi mở lại phiên agent

Chỉ tiếp tục lane/giai đoạn đang được giao. Đọc BASELINE, OWNERSHIP, CONTRACTS, SYNC và handoff của lane; kiểm Git/head/worktree trước. Hoàn thành việc còn thiếu theo bằng chứng, không scaffold lại, không coi tài liệu bàn giao cũ là bằng chứng trạng thái hiện tại khi code đã đổi.

## Tham chiếu kỹ thuật

Các liên kết phục vụ kiểm tra khi triển khai; dùng đúng phiên bản tương thích repo, không tự nâng lên bản mới nhất.

- [Git worktree](https://git-scm.com/docs/git-worktree): worktree/branch riêng trong một repository.
- [OpenAPI](https://www.openapis.org/what-is-openapi): hợp đồng HTTP API.
- [Solidity ABI](https://docs.soliditylang.org/en/latest/abi-spec.html): interface contract, events và encoding.
- [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers): backend có thể cùng ứng dụng với frontend.
- [Arbitrum chain information](https://docs.arbitrum.io/for-devs/dev-tools-and-resources/chain-info): xác minh mạng trước cấu hình/testnet.
- [Arbitrum finality và reorg](https://docs.arbitrum.io/how-arbitrum-works/reference/finality-and-reorgs): kiểm chính sách đối soát theo deployment.

Kết thúc ở bản có thể review và trạng thái trung thực. Việc đưa lên GitHub/Netlify hoặc deploy ngoài local theo chỉ dẫn triển khai riêng còn hiệu lực của Bin, không suy từ việc đã merge local.
