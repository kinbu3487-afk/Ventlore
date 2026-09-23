# Ventlore · Bộ prompt triển khai bằng Antigravity

Phiên bản 1.0 · 23/09/2026 · Theo Logic / ID / Event UI 0.3 và Brand Guide 0.1.

**Thứ tự:** 00 Nền tảng → 01–03 Front-end → 04–06 Back-end → 07–08 Smart contract → 09 Tích hợp → 10 Kiểm thử và bàn giao.

Bộ này dành cho Bin phát triển một mình. Đây là chỉ dẫn để Antigravity viết và kiểm thử phần mềm trong repository của Bin; chưa phải mã đã chạy, kết quả kiểm thử hay contract đã triển khai. Những quyết định kỹ thuật được đề xuất bên dưới không biến các chính sách kinh doanh còn mở trong tài liệu nguồn thành quyết định đã chốt.

## Cách dùng

1. Mở **một repository Ventlore** trong Antigravity. Nếu đã có mã, tiếp tục repository đó; không tạo lại dự án khi sang chặng mới.
2. Lưu tài liệu này tại `docs/Ventlore_Antigravity_Prompt_Pack_v1_0.md`. Đưa sáu tài liệu nguồn vào `docs/source/`, giữ nguyên tên hoặc lập mapping nếu tên tệp khác.
3. Dán **Prompt 00**. Sau đó chạy từng prompt đúng thứ tự. Mỗi prompt là một nhiệm vụ; chặng sau đọc kết quả đã lưu của chặng trước.
4. Dùng chế độ lập kế hoạch của phiên bản Antigravity đang cài cho các chặng lớn. Agent cần đưa kế hoạch ngắn rồi triển khai trong phạm vi prompt, tôn trọng cài đặt review hiện có. Không thay chính sách phê duyệt của công cụ bằng prompt.
5. Chỉ chuyển bước khi tiêu chí hoàn thành của bước trước đạt, hoặc dependency chưa có đã được ghi rõ và cô lập. Không coi “đã tạo giao diện” là “đã nối API/thanh toán”.
6. Khi mở cuộc hội thoại mới, dùng Prompt tiếp tục ở cuối tài liệu. Không cần dán lại toàn bộ 6 PDF mỗi lượt nếu agent đọc được chúng từ workspace.

Antigravity hiện hỗ trợ `AGENTS.md` làm quy tắc theo thư mục. Prompt 00 tạo tệp này và các tài liệu bàn giao để giữ ngữ cảnh qua nhiều lượt. Tài liệu chính thức: [Rules](https://antigravity.google/docs/rules), [Artifact Review](https://antigravity.google/docs/artifact-review). Giao diện/menu có thể khác theo phiên bản; không phụ thuộc một tên nút cố định.

### Sáu tài liệu nguồn

| Tệp | Vai trò |
|---|---|
| `Ventlore_Logic_ID_DB_v0_3.pdf` | Nghiệp vụ, trạng thái, ràng buộc, công thức ID và đối soát |
| `Ventlore_ID_Registry_v0_3.csv` | Tên trường, prefix, bảng, khóa chính và kind của chain key |
| `Ventlore_So_do_Khoi_v0_3.pdf` | D01–D11: quan hệ và luồng tổng thể |
| `Ventlore_Event_UI_Spec_v0_3(1).pdf` | U01–U12, 72 bước sự kiện, S01–S35, C01–C50 và QA01–QA25 |
| `Ventlore_Event_UI_Wireframes_v0_3(1).pdf` | Cấu trúc màn hình và hành vi |
| `Ventlore_Brand_Guide_v0_1.pdf` | Logo, màu, chữ, bố cục, giọng điệu |

Trong các PDF có nhắc `example-records.json`, `source/build_ids.py`, schema SQL và assets thương hiệu riêng. **Các tệp này không nằm trong sáu nguồn ở trên.** Agent phải kiểm tra chúng có thực sự tồn tại trước khi dùng; thiếu thì ghi rõ và tạo implementation/fixture mới từ đặc tả, không nhận là đã đọc hay khôi phục bản gốc.

### Cấu hình kỹ thuật đề xuất

| Phần | Lựa chọn để khởi đầu |
|---|---|
| Repository | pnpm workspace, TypeScript strict, một lockfile |
| Front-end | Next.js App Router, Tailwind CSS, shadcn/ui, TanStack Query; tiếng Việt trước, chuẩn bị chuỗi dịch |
| Back-end HTTP | Next.js Route Handlers tại `/api/v1`; business services tách khỏi handlers |
| Dữ liệu | Supabase PostgreSQL, Auth với Google trước, Storage private; Drizzle và SQL migrations cho ràng buộc |
| Công việc nền | Một Node.js worker riêng xử lý outbox, hạn dùng và đọc chain; chạy độc lập web server |
| Web3 | viem + wagmi; Solidity + Foundry + OpenZeppelin |
| Kiểm thử | Vitest, Playwright, integration trên PostgreSQL, Foundry unit/fuzz/invariant |
| Mạng | Local Anvil → Arbitrum Sepolia `421614` → Arbitrum One `42161` sau khi đủ điều kiện |
| Tiền thử nghiệm | Một ERC-20 thử nghiệm cho mỗi deployment; MockERC20 không có giá trị tiền thật |

Back-end là lớp nghiệp vụ riêng trong cùng repository và ứng dụng Next.js; chưa cần một HTTP service thứ hai. Worker cần tiến trình riêng vì việc quét chain không nên phụ thuộc thời gian sống của request web. Nếu repository đã có stack phù hợp, agent giữ lại và giải thích mapping thay vì đổi framework.

Arbitrum Sepolia dùng ETH testnet để trả gas. RPC công khai trong tài liệu hiện hành là `https://sepolia-rollup.arbitrum.io/rpc`; explorer `https://sepolia.arbiscan.io`. Mainnet Arbitrum One dùng `https://arb1.arbitrum.io/rpc`, explorer `https://arbiscan.io`. Xác minh lại trước deploy; không nhầm Arbitrum Sepolia `421614` với Ethereum Sepolia `11155111`. Các tham số lấy từ [Arbitrum chain information](https://docs.arbitrum.io/for-devs/dev-tools-and-resources/chain-info).

### Chính sách còn mở

| Nội dung | Cách xử lý trong bộ prompt |
|---|---|
| P01–P08, UI-P01–UI-P06 | Dùng làm baseline phát triển có nhãn “đề xuất”; giữ mã nguồn tham chiếu |
| Token nhận tiền thật, ví quỹ, người giữ quyền | Chưa chốt; manifest testnet dùng ví được người vận hành cung cấp, không tự bịa |
| VIP thanh toán fiat hay crypto | Xây interface và test adapter; checkout thật tắt đến khi có kênh được chọn |
| Mức công, hủy việc, hạn kiểm tra | Cấu hình có version; fixture thử nghiệm ghi rõ, không mặc định là chính sách công bố |
| Hoàn tiền, điều chỉnh nghĩa vụ | Hồ sơ và interface riêng; không tự nhận có thể thu hồi tiền đã vào ví tác giả |
| NFT chuyển nhượng | Có thể triển khai ERC-721 chuẩn làm baseline kỹ thuật; không gán doanh thu, tác quyền hoặc quản trị |
| Bản đồ | Danh sách/tìm kiếm dùng được trước; map adapter có cấu hình, không bịa dữ liệu địa hình/rủi ro |

## Prompt 00 — Đọc nguồn, khóa quy tắc và dựng nền tảng

Sao chép toàn bộ khối dưới đây:

```text
Bạn là kỹ sư phụ trách triển khai Ventlore trong repository đang mở. Tôi phát triển dự án một mình. Hãy thực hiện chặng 00: đọc nguồn, xác lập hợp đồng dữ liệu và tạo nền tảng repo. Trả lời bằng tiếng Việt; code và identifier bằng tiếng Anh.

Đầu vào:
- docs/Ventlore_Antigravity_Prompt_Pack_v1_0.md.
- Sáu tài liệu trong docs/source/ được liệt kê trong prompt pack.
- Mọi hướng dẫn repository đang có; kiểm tra git status trước khi sửa.

Đọc nguồn theo thứ tự: Logic-ID-DB + CSV → sơ đồ khối → Event UI Spec → Wireframes → Brand Guide. Lập source-index có tên tệp, version, số trang/section dùng. Không suy luận từ tên tệp khi chưa đọc. Các nguồn SQL/JSON/assets được PDF nhắc nhưng không có phải ghi MISSING_REFERENCE; chưa có database thật thì không tự gọi đây là migration của production.

Phạm vi chặng này:
1. Kiểm kê mã, dependencies, cấu hình và các nguồn sẵn có. Giữ công việc chưa commit của người dùng. Không tạo lại repo hay đổi stack đang phù hợp.
2. Nếu repo mới, dùng stack đề xuất trong prompt pack. Xác minh phiên bản ổn định tương thích từ tài liệu chính thức rồi pin lockfile/toolchain. Không tự chọn canary. Tạo pnpm workspace:
   - apps/web: giao diện + /api/v1 Route Handlers.
   - apps/worker: outbox/indexer/expiry.
   - packages/domain: schema, ID, enum, quy tắc thuần.
   - packages/api-client: client có kiểu và mock adapter.
   - packages/db: schema/migrations/server-only repositories.
   - packages/chain: key derivation, interface/ABI được sinh, manifest.
   - contracts: Foundry, triển khai ở chặng 07–08.
   - docs: nguồn, quyết định kỹ thuật, coverage và bàn giao.
   Có thể điều chỉnh cấu trúc theo repo hiện có nhưng giữ ranh giới dependency.
3. Tạo AGENTS.md ngắn ở gốc, chỉ chứa quy tắc xuyên suốt; tham chiếu tài liệu chi tiết. Không ghi đè hướng dẫn đã có. Tạo docs/PROJECT_STATE.md, docs/DECISIONS.md, docs/OPEN_QUESTIONS.md và docs/HANDOFF.md.
4. Chuyển đặc tả thành docs/DOMAIN_RULES.md, docs/ID_CONTRACT.md, docs/STATE_MACHINES.md, docs/PERMISSIONS.md. Mỗi quy tắc gắn nguồn hoặc nhãn đề xuất mới. Không gộp trạng thái visibility, accessTier, verification, task, payable, grant và route.
5. Tạo docs/SCREEN_COVERAGE.md cho S01–S35, docs/COMPONENT_COVERAGE.md cho C01–C50, docs/EVENT_COVERAGE.md cho đủ 72 Uxx-Eyy. Cột: actor, input, IDs, endpoint, component, implementation, test, status. S-code có thể là panel/tab/dialog; không dựng 35 page độc lập một cách máy móc.
6. Lập OpenAPI tại docs/api/openapi.yaml và schema Zod dùng chung cho phạm vi 0.3, chia module để tiếp tục hoàn thiện theo chặng. Ghi rõ endpoint là proposed/implemented; thêm error contract, capability, pagination, idempotency và expectedVersion. Mock và API thật phải tuân cùng schema. Chưa viết business backend ở chặng này.
7. Lập docs/CHAIN_INTERFACE.md: danh sách thao tác, dữ liệu, event, role, ai ký, nguồn sự thật, mapping ID. Đây là thiết kế giao diện dự kiến; chưa tuyên bố có ABI contract đã compile. Ghi các chi tiết phải khóa ở chặng 07.

Quy tắc không được làm lệch:
- Một userId cho mọi vai trò. Ví, VIP, SBT và role riêng. Guest đọc public không cần tài khoản/ví.
- Đề xuất điểm mới dùng placeId + postId + revisionId, REVIEW_ONLY trước duyệt. Bài ở điểm đã biết có thể PUBLISHED + UNVERIFIED sau sàng lọc. Không thêm contributionId.
- Post/author cố định; snapshot revision, decision và submission đã nộp bất biến. Bản sửa không thừa hưởng kiểm chứng hoặc route của bản cũ.
- Review theo revision + scope. Không tự review; thiếu người độc lập giữ WAITING_CAPACITY. Không coi hai account là bằng chứng có hai người.
- Nghiệm thu công tách kết luận nội dung; bài REJECTED vẫn có thể tạo payable cho công việc đạt yêu cầu.
- Bốn nhánh sau duyệt tách nhau: nhãn, Contributor SBT, Author NFT, tip route.
- PROJECT vào quỹ 100%; POST_TIP: projectAmount=floor(amount/5), authorAmount=amount-projectAmount. Amount nguyên theo atomic units; gas riêng.
- Donation không cấp VIP. VIP 1500 USD cents, 12 tháng lịch UTC, gia hạn chủ động; payment confirmed một lần cấp một term.
- Backend và indexer không giữ private key ký chain. Actor có quyền ký bằng ví của họ.
- P01–P08 và UI-P01–UI-P06 là baseline đề xuất. Các điểm chưa chốt dùng config/test adapter, không giả làm dịch vụ thật.

Hợp đồng ID bắt buộc:
- API cấp UUIDv7 canonical, DB kiểu uuid, API camelCase/SQL snake_case nhưng giá trị ID giữ nguyên. Client chỉ có temp key cho nháp chưa đồng bộ; không biến temp key thành canonical ID.
- displayCode PREFIX-000001 do server cấp an toàn đồng thời; chỉ dùng tra cứu về UUID rồi JOIN PK/FK.
- APP_NAMESPACE = keccak256(UTF8("VENTLORE_V1")).
- entityKey(kind, uuid) = keccak256(abi.encode(APP_NAMESPACE, kind, bytes16(uuid))). ABI types bytes32,string,bytes16; dùng 16 byte UUID thực, không hash text UUID, không SHA3-256, không encodePacked.
- Kind chính xác theo CSV: post, revision, claim, route, donation-request, payable, credential, collectible, region, reason.
- RECEIPT_DOMAIN = keccak256(UTF8("VENTLORE_RECEIPT_V1")).
- receiptKey = keccak256(abi.encode(RECEIPT_DOMAIN, chainId, splitterAddress, donorAddress, requestKey)); types bytes32,uint256,address,address,bytes32.
- NFT tokenId=uint256(collectibleKey); SBT tokenId=uint256(credentialKey). Token identity gồm chainId+contractAddress+tokenId.
- Không tạo public userKey từ social userId. Không suy ngược UUID từ hash; giữ mapping được backup.
- Viết implementation TypeScript và fixture kiểm ID. Nếu test vector gốc không có, ghi đây là vector mới tạo từ đặc tả; chặng contract sẽ kiểm độc lập bằng Solidity.

Chuẩn làm việc cho mọi chặng sau, ghi vào AGENTS.md:
- Đọc PROJECT_STATE + HANDOFF trước; cập nhật chúng sau chặng.
- Lập kế hoạch ngắn, thực hiện, chạy kiểm tra phù hợp, sửa lỗi do mình tạo; không chỉ trả pseudocode hoặc TODO cho phần thuộc scope.
- Dùng docs chính thức khi API thư viện chưa chắc; không bịa endpoint, ABI, token address, txHash hay kết quả test.
- Mỗi mutation có idempotency đúng actor/operation/payload; conflict không ghi đè ngầm. Không dùng requestTraceId để thay ý định tiền.
- Secret chỉ ở env/server và secret store; .env.example chỉ placeholder. Không in secret, không đưa service key/private key vào bundle, không yêu cầu seed phrase trong chat.
- Fixture và role-switcher chỉ ở mock/test; production fail closed nếu cấu hình thiếu. Không fallback sang mock khi API thật lỗi.
- Không mainnet, không chuyển tài sản thật, không mua dịch vụ, không publish/force-push hoặc chạy migration phá dữ liệu trong phạm vi bộ prompt này. Có thể tạo code, migration, local/test fixture và các bước chuẩn bị review được.
- Không sửa test để che lỗi, không ghi PASS cho lệnh chưa chạy. Trở ngại credentials chỉ chặn phần cần credentials; tiếp tục hoàn thành phần cục bộ làm được.

Hoàn thành khi: repo scaffold chạy kiểm tra nền tảng; registry được validate; hợp đồng chung và coverage tồn tại; các nguồn thiếu/giả định được ghi rõ. Báo ngắn tệp đã đổi, lệnh đã chạy và kết quả, phần còn thiếu, cách chạy Prompt 01. Dừng tại ranh giới chặng 00.
```

## Prompt 01 — Front-end nền tảng và trải nghiệm người đọc

```text
Thực hiện chặng 01 của Ventlore Prompt Pack. Đọc AGENTS.md, PROJECT_STATE, ID_CONTRACT, OpenAPI, Brand Guide, Event UI Spec và các wireframe tương ứng. Giữ stack và quy tắc đã khóa. Chặng này xây front-end bằng mock adapter đúng schema; chưa nối database/thanh toán thật.

1. Tạo design tokens từ Brand Guide:
   Forest #173F35; Jade #2C7563; Sage #DCE8DA; Ivory #F5F1E8; Waypoint #F0A44B; Ink #182522.
   Be Vietnam Pro; body 16/26 px; khoảng cách 4/8/12/16/24/32/48/64; card radius 16; button radius 12; control cao 48; touch target >=44.
   Forest làm CTA, Ivory nền đọc, cam điểm nhấn dùng chữ Ink. Màu trạng thái luôn có chữ/icon. Không biến màu nhận diện thành điểm rủi ro giả.
   Dùng asset logo thật nếu có; nếu chỉ có PDF, kiểm tra khả năng trích xuất đúng. Khi thiếu asset dùng wordmark chữ tạm có ghi rõ trong handoff, không tự nhận một logo vẽ lại là bản chuẩn.
2. Dựng AppShell/RoleNav, layout mobile trước, desktop mở rộng; accessibility keyboard/focus/label/error. C01–C10 và component cần thiết trong C46/C49/C50.
3. Hoàn thiện S01 khám phá, S02 địa điểm, S03 bài và phiên bản, S04 hồ sơ public, S05 đăng nhập, S21 giới thiệu VIP, S34 minh bạch quỹ. Root có thể dẫn /explore; ưu tiên sản phẩm đọc/đóng góp, không chỉ làm landing page.
4. Explore có tìm vùng/hoạt động/độ mới, phân trang, empty/error. Map là adapter tùy chọn; thiếu provider vẫn tìm bằng danh sách. GPS bị từ chối không chặn sử dụng. Không gọi dịch vụ bản đồ trả phí khi chưa cấu hình.
5. PostReader hiển thị ngày trải nghiệm, tác giả, revision đang xem, nguồn, scope/ngày/hạn kiểm tra. Đổi revision tải đúng nhãn và route. Không có nhãn “địa điểm an toàn tuyệt đối”.
6. Mock AccessGate chỉ nhận payload đã lọc theo quyền từ mock adapter. Không gửi nội dung VIP/private vào HTML/JSON rồi giấu bằng CSS. Guest đọc public không cần ví; returnTo khi login chỉ cùng origin/allowlist.
7. Fixture có một post nhiều revisions, một địa điểm merged, một bản chưa kiểm tra, một bản hết hạn, một nội dung VIP và một candidate private. Ghi rõ DEMO, không trình bày như thông tin an toàn thực địa đã xác minh.
8. Fixture dùng UUID canonical hợp lệ và quan hệ thực, không dùng PST-000001 làm postId. Các component chỉ lấy dữ liệu từ api-client, không import mock JSON rải rác. Mock thực thi qua adapter/request contract để thay bằng API thật sau này.
9. State chung: loading/empty/401/403/404/409/422/429/offline/timeout. Hiển thị số tiền chưa tải là chưa tải, không thay bằng 0.

Nghiệm thu: browser chạy được các màn trên ở 390px và 1440px, không tràn ngang; đổi revision không kéo nhãn bản cũ; deep link reload đúng dữ liệu; login không chặn public; private content vắng trong payload guest. Chụp màn hình các trang chính, chạy typecheck/build và smoke UI phù hợp. Cập nhật coverage/handoff, nêu rõ phần MOCK và các màn chưa triển khai. Không đánh dấu UI gate mock là bảo mật backend đã xong.
```

## Prompt 02 — Front-end đóng góp, chuyên gia và vận hành

```text
Thực hiện chặng 02. Đọc AGENTS.md và handoff chặng 01. Dựa U02–U06, U11; Screen/Component Registry và wireframes. Tiếp tục mock adapter cùng schema, không đổi canonical ID/API để thuận tiện cho UI.

A. Tác giả:
- S06/S07 soạn, xem trước, gửi bài ở place có sẵn; S08 danh sách của tôi; S17 wizard điểm mới; S18 so sánh trùng; S19 tiến trình/phản hồi; S30 báo sai.
- Điểm mới chưa gửi chỉ có nháp tạm; API mock trả placeId/postId/revisionId khi gửi thành công. Điểm đã có dùng postId từ thao tác tạo nháp.
- Nhập ngày trải nghiệm, tiếp cận, hoạt động, rủi ro quan sát, claims, evidence và quyền sử dụng nội dung. Upload có uploading/processing/ready/failed.
- Giữ draft khi lỗi, không mất dữ liệu khi đổi tab; bản lưu chưa đồng bộ có cảnh báo. 409 expectedVersion mở so sánh, không ghi đè.
- Bài gửi rồi sửa tạo revision mới và parentRevisionId; timeline chỉ đúng revision/case.

B. Chuyên gia:
- S24 lời mời vai trò; S25 danh sách việc; S10 chi tiết/nhận/từ chối/bắt đầu; S11 nháp và nộp evidence.
- Có taskType NEW_PLACE_REVIEW và EXISTING_PLACE_POST_REVIEW. Scope, phí, asset, deadline, tiêu chí nghiệm thu, điều khoản hủy đều rõ.
- Work status và payment status hai trường khác nhau. NEEDS_MORE giữ taskId và lần nộp tiếp tạo submissionId mới. Đổi assignee phải task mới.
- Blind review dùng dữ liệu đã lọc từ adapter/API; không tải kết luận người khác rồi giấu. Không coi GPS là bằng chứng tự động xác nhận sự thật.

C. Operator:
- S09 sàng lọc/KPI; S12 case; S26 drawer giao việc; S27 tab nghiệm thu; S31 báo sai/hold; S35 chọn nội dung VIP.
- KPI có thành phần, nguồn và lý do ưu tiên; không bịa trọng số chính thức.
- Không self-review. Mô phỏng WAITING_CAPACITY, thiếu ngân sách, role hết hạn và conflict.
- Tách hành động nghiệm thu công với lưu decision. Decision có 4 kết quả: APPROVED/CHANGES_REQUESTED/INCONCLUSIVE/REJECTED, scope và validUntil.
- Công đạt + bài REJECTED vẫn có payable, không có quyền lợi từ APPROVED.
- Merge giữ lịch sử; không tự gộp vì hai tọa độ gần nhau.
- VIP curation cần approved scope + consent; cảnh báo cần thiết public, không khóa ngược bài đã public.

D. Thành phần chung:
- Ghép C11–C27, C39–C41, C47–C49 theo registry; dùng lại design system.
- Route guard UI dựa capabilities, ghi rõ backend sẽ thực thi quyền thật. Test persona switch chỉ trong mock/dev và loại khỏi production.
- Notification dẫn về business ID, tải state mới khi mở, không lấy thứ tự toast làm workflow.

Nghiệm thu bằng browser: đề xuất mới; viết bài ở điểm có sẵn; sửa lúc đang review; giao/nhận/nộp/bổ sung task; nghiệm thu công với bài bị bác; report/hold. Kiểm cả lỗi và double click/timeout với cùng idempotency key. Hoàn thiện component thực có tương tác, không nút giả không phản hồi. Cập nhật coverage/handoff, screenshot các workspace, liệt kê các endpoint cần chặng backend. Dừng trước tích hợp chain thật.
```

## Prompt 03 — Front-end tiền, quyền lợi và bàn giao API

```text
Thực hiện chặng 03. Đọc handoff và U07–U10/U12. Hoàn thiện front-end 0.3, dùng mock transport cho chain/provider. Chưa ký/gửi giao dịch thật, chưa dùng ABI tưởng tượng.

1. S20 WalletBinding: connected khác verified; trạng thái challenge, ký message, hết hạn, từ chối, wrong account, địa chỉ đã thuộc tài khoản khác. Thay ví không thay userId.
2. S16/S32: bốn thẻ riêng nhãn kiểm tra/SBT/NFT tác giả/tip. C28–C31. Thiếu ví chỉ chặn quyền lợi cần ví. Consent nhận tip là ký message; đăng ký route, authorize grant, claim là các action khác nhau.
3. S13/S14/S15 Donation: PROJECT hoặc POST_TIP; kind/asset/amount/recipient/route/deployment cố định trong một donationId. Preview floor(amount/5) bằng bigint, số tiền API là chuỗi atomic units. Gas riêng. Đổi ý định/số tiền cần intention mới; retry không đổi DON.
4. C34 WalletTxStepper dùng chung nhưng mỗi approve/approve(0)/donate/payTask/authorize/claim có actionId riêng. Một action có nhiều attemptId. Có submitted, observed, finalized, rejected, reverted, unknown, replaced và reorged. Không toast thành công từ approve để hoàn tất donate.
5. S28/S29: quỹ theo asset; available/reserved/payable/spent; nguồn OWNER_FUNDING, PROJECT_DONATION, POST_TIP_SHARE, VIP_REVENUE, TASK_PAYOUT, REFUND. Chỉ đọc payee/amount đã chốt. UNKNOWN mở đối soát, không sinh khoản công mới.
6. S21–S23: 15 USD/12 tháng lịch; checkout chỉ có kênh đã cấu hình. Chưa có kênh hiện chưa khả dụng, không dựng cổng thanh toán giả. Pending không mở VIP; gia hạn đang pending không làm mất kỳ còn hiệu lực.
7. S31/S32: app hold, ONCHAIN_BLOCK_PENDING, BLOCKED, RESTORE_PENDING khác nhau. Event ACTIVE cũ không gỡ hold hiện tại.
8. S33 tra cứu ID có quyền; deep link bằng business UUID, displayCode lookup một lần. TxHash chỉ là attempt và explorer link. S34 chỉ dữ liệu quỹ đã redacted.
9. Hoàn thành C32–C38, C42–C45 và cập nhật registry đủ S01–S35/C01–C50. Nếu màn là panel/dialog thì ghi vị trí host, không đánh dấu thiếu vì không có URL riêng.
10. Tạo FE_HANDOFF.md: endpoint/schema cần dùng, auth/capability, states, query cache, chain calls dự kiến, các quyết định mở. OpenAPI/api-client/mock phải đồng bộ. Không import DB/server secret vào client.

Kiểm thử: approve xong donate revert; timeout giữ ID; wallet đổi chain/account giữa confirm; bản mới không có route cũ; thiếu ví vẫn thấy công nhận; NFT transfer không đổi beneficiary; VIP pending; event đăng ký đến sau hold. Mock UI có nhãn demo và bị tắt trong production. Chạy typecheck/build, browser smoke và kiểm accessibility thực tế. Báo front-end đã hoàn thành phần nào bằng mock, chưa tuyên bố tiền được chuyển. Sau chặng này mới sang backend.
```

## Prompt 04 — Back-end dữ liệu, đăng nhập và phân quyền

```text
Thực hiện chặng 04. Đọc AGENTS.md, toàn bộ handoff, CSV registry, Logic-ID-DB mục 13–15/21 và UI Spec mục 4–7. Triển khai database, auth và nền API thật, giữ nguyên front-end/API contract; chưa viết toàn bộ workflow.

1. Schema PostgreSQL:
- Tạo đầy đủ các bảng đối tượng trong CSV với đúng tên PK; UUIDv7 do API cấp. Auth provider ID là external identity, không thay users.user_id. Giữ (provider, providerSubject) unique.
- Bổ sung bảng quan hệ/identity, post_drafts, task_submission_drafts, membership_terms, idempotency, raw_chain_logs, donation_receipts, token_records, ledger/projection và worker cursors theo nhu cầu có tài liệu. Các bảng kỹ thuật hoặc khóa ghép không tự thêm hệ business ID song song.
- SQL migrations bảo đảm FK, composite FK/check, partial unique index, append-only/immutability phù hợp. Không chỉ kiểm mọi thứ bằng TypeScript.
- Quyết định phải đúng revision/case; claim đúng revision; parentRevision cùng post; acceptance đúng task/submission; payee đúng assignee; route/NFT đúng post/revision/decision. Author, place gốc của post, assignee task và nghĩa vụ tiền không sửa tại chỗ.
- Unique một decision/case; acceptance/task; payable/acceptance; membership/user+plan; term/payment; AUTHOR_CONTRIBUTION/post cả sau burn; tối đa một CONTRIBUTOR active/user. Tối đa một payout pending/unknown cho payable, và chỉ một kết quả paid.
- Snapshot revision/decision/submission đã nộp không UPDATE/DELETE bytes; draft khác snapshot. FK không cascade xóa lịch sử tiền/quyết định khi ẩn bài/tài khoản.
- Các khóa chain có reverse index với deployment scope đúng. Global entity lookup chỉ internal có quyền.
- Không hardcode rằng “mọi UUID object đều phải có chain key”; keyKind trống trong CSV phải được tôn trọng. Thêm kiểu key mới cần ADR, không tự thay công thức đã có.

2. Auth/session:
- Nếu dùng Supabase, bắt đầu Google provider. Backend xác thực session/JWT thực bằng cơ chế chính thức, không tin userId/role client gửi. Mapping tới canonical Ventlore userId được transaction hóa.
- Không tự merge tài khoản dựa email/tên; kiểm cả hành vi account linking của nhà cung cấp trước khi mở thêm provider. Link thêm identity cần proof và luồng explicit.
- Cookie/session, CSRF/origin cho mutation, OAuth state/redirect allowlist, session expiry; không cất credential tùy tiện trong localStorage.
- RBAC + scope/ownership/validUntil + conflict. User có nhiều role nhưng treasury permission tách operator; SBT/NFT/VIP không tự cấp quyền thao tác.
- /me trả capabilities do server tính; route guards không phải nguồn quyền cuối.

3. Wallet binding:
- Challenge chứa nonce dùng một lần, domain/origin, chain context, address, purpose, issuedAt và expiry; verify signature bằng thư viện đã kiểm tra tài liệu, hỗ trợ contract wallet theo chuẩn phù hợp nếu được bật.
- Chỉ tạo binding sau chứng minh quyền kiểm soát; unique active address/namespace. Challenge chống replay và kiểm đúng session user.
- Đổi ví tạo binding mới, không sửa lịch sử; ngắt kết nối UI không đồng nghĩa thu hồi quyền/route onchain.

4. Bảo vệ dữ liệu:
- Core tables truy cập qua server. Với Supabase, schema/grants/RLS phải ngăn anon/authenticated client đọc trực tiếp bảng private hoặc ghi role/payable/decision; không dựa vào việc UI không gọi endpoint.
- Service role key/DB credentials server-only. Worker có credential dữ liệu tối thiểu cần thiết, không có private key blockchain.
- Storage private, authorization theo media/evidence trước signed URL. Kiểm MIME thực, dung lượng, owner, trạng thái xử lý và EXIF; public ảnh cần loại metadata riêng tư theo policy.
- Không lộ private source qua preview, download URL, search, SSR, cache hoặc log. Public profile/ledger có DTO redacted riêng.

5. Nền API:
- /api/v1, schema validation, error codes thống nhất, cursor pagination, requestTraceId; mutation idempotency actor+operation+key+payload hash.
- Cùng key/cùng payload trả cùng result; khác payload 409; xử lý đồng thời bằng DB constraint/transaction. expectedVersion cho nháp.
- DB commit nghiệp vụ, audit và outbox cùng transaction. Outbox dùng outboxId, không thêm eventId thay thế.
- SQL parameterized. JSON bigints/atomic units là string; timestamp UTC. Không serialize Decimal/BigInt thành float.

Kiểm thử trên PostgreSQL: migration database sạch; FK/unique/immutability từ chối sai; hai request idempotent đồng thời; giả role/userId; IDOR đọc evidence/payable/VIP; replay wallet nonce. Test accounts chỉ môi trường local/test, không cửa hậu production. Seed fixture riêng có nhãn DEMO; chạy seed không reset database không được xác nhận là test.

Chuyển các màn auth/profile/binding thích hợp sang API thật trong integration mode. Nếu chưa có OAuth credentials, hoàn thành adapter và local tests, ghi rõ live login chưa test; không giả đăng nhập thật. Cập nhật schema/API/coverage/handoff và hướng dẫn env không chứa secret.
```

## Prompt 05 — Back-end nội dung, review và nghĩa vụ trả công

```text
Thực hiện chặng 05. Đọc handoff, Logic F02–F06/F09 và UI U02–U06/U11. Viết business services và API thực theo OpenAPI; nối các workflow front-end tương ứng. Không thay các invariant ID.

1. Nội dung:
- POST /place-proposals tạo candidate+DISCOVERY post+revision+claims cùng transaction sau validation/sàng lọc đúng mức; REVIEW_ONLY trước duyệt. Không tự tạo case chỉ vì nhận đề xuất.
- Duplicate-check chỉ gợi ý, không trả candidate private của người khác. Race phát hiện trùng rõ ràng trả conflict và giữ nháp; trường hợp chưa chắc chuyển operator. Không unique địa điểm bằng tên/tọa độ gần để chứng minh trùng ngoài đời.
- Bài ở place hiện hữu có server draft; freeze revision khi gửi, rồi lọc trước PUBLISHED+UNVERIFIED. Không dùng bảng revision như draft mutable.
- Định nghĩa canonical serialization + hash có version cho snapshot/decision, lưu bytes hoặc representation kiểm lại được. Hash không chứng minh sự thật; không publish PII/low-entropy secret dưới dạng hash thô. Nếu nguồn không chốt chi tiết serialization thì ghi ADR đề xuất, không sửa hash đã dùng.
- Merge canonical có lock/check chống chu trình; giữ placeId gốc của bài và resolve canonical lúc đọc. Không rewrite contentHash vì merge.

2. Review và nhân sự:
- Queue KPI theo dữ liệu quan sát và policyVersion; ưu tiên thủ công có lý do/audit, không dùng số donate làm bằng chứng đúng.
- Case khóa revision và scopeClaimIds, level kiểm tra, policy. Task assignment kiểm role/region/skill/deadline/conflict. Không self-review; high-risk/tranh chấp có chuyên gia độc lập bổ sung theo P04.
- Bin có thể vận hành nhiều vai trò nhưng không tự tạo sự độc lập bằng đổi role. Không có người phù hợp thì WAITING_CAPACITY.
- Task offer + reservation + outbox cùng transaction sau lock ngân sách theo asset. Hai request không reserve vượt nguồn đã đối soát. Phí/asset/payee/terms chốt theo task; không lấy giá từ client.
- Xử lý nhận/từ chối/offer expiry/start/submit/needs more/accept work/reject work/cancel theo state machine. Đổi assignee tạo task mới; NEEDS_MORE giữ task và append submission.
- Blind review lọc dữ liệu tại server theo mốc được phép, không chỉ hide component. Không hứa hệ thống tự biết hai tài khoản là cùng một người; lưu khai báo/xung đột và giới hạn xác minh.

3. Nghiệm thu và quyết định:
- ACCEPTED_WORK tạo acceptance+payable một lần trong transaction, đúng task/submission/payee/asset/amount.
- Decision nội dung độc lập, một terminal decision/case. APPROVED cần scope và validUntil; các kết quả khác giữ lý do. Case mới nối previousCaseId thay sửa decision cũ.
- Công đạt + nội dung REJECTED vẫn có payable. Không dùng APPROVED làm điều kiện trả tiền công.
- Bốn nhánh quyền lợi đánh giá idempotent: nhãn, SBT, NFT, route. Chưa có ví không mất nhãn; không tự mint hoặc đổi sang ISSUED.
- Một NFT AUTHOR_CONTRIBUTION/post; một CONTRIBUTOR active/user ở backend; role độc lập. Không tạo donor NFT.

4. Ngân sách:
- Nguồn tiền đã đối soát, reserve, nghĩa vụ chưa trả và số đã trả tách rõ. Chuyển reservation thành nghĩa vụ không trừ hai lần; đã PAID không còn chiếm available lần nữa.
- Task từ chối/hủy chưa làm giải phóng đúng reserve; đã có công phải xét điều khoản, không âm thầm xóa nghĩa vụ.
- Ghi rõ reserve hiện là cam kết được cưỡng chế ở backend; ví quỹ vẫn có thể chi ngoài ứng dụng. Reconcile balance/external transfers và ngừng offer khi không chứng minh đủ tiền, không mô tả đây là escrow onchain đã khóa vốn.

5. Report/hold/VIP content:
- Report gắn revision/claim, riêng từng người báo. Nhận report không tự chuyển REJECTED.
- Hold app có hiệu lực ngay ở read/mutation gates, tạo desired block để chuẩn bị ký chain sau; không tự ghi BLOCKED.
- Restore cần decision hợp lệ, hết các hold liên quan, chain gates sẵn sàng. Event ACTIVE tới muộn không thắng hold mới.
- VIP curation cần consent+approval; public warnings giữ được đọc. Không khóa lại content đã public.
- Read DTO/caching phân quyền ở server cho revision chính xác; sửa query revisionId của post khác bị từ chối.

Kiểm thử integration những transition tài chính/quyền: race reserve, race acceptance, wrong-revision decision, đổi assignee, self-review, blind leakage, sửa bài lúc có task, merge cycle, approved chưa ví, rejected nhưng công đạt, hold trong lúc register pending. Chạy các luồng người dùng bằng UI thật → API → PostgreSQL; chain vẫn adapter chưa triển khai. Cập nhật OPEN_QUESTIONS với các mức công/hạn chưa chốt, coverage và BE_HANDOFF.md.
```

## Prompt 06 — Back-end thanh toán, VIP, outbox và indexer

```text
Thực hiện chặng 06. Đọc Logic F07–F10/mục 11/21, UI U07–U12 và CHAIN_INTERFACE. Viết nền tích hợp tiền và worker. Chưa có contract thật thì giữ ChainAdapter typed/not-configured và test fixture; không bịa deployed address, ABI hoặc receipt live. Hoàn thiện adapter thật sau chặng 07–08.

A. Intent/action/attempt:
- Donation lưu immutable kind, donor binding/address, amountAtomic, asset, route nếu POST_TIP, deployment, requestKey. Amount không dùng JS float. Retry giữ donationId/requestKey; đổi ý định tạo ID mới sau xử lý trạng thái cũ rõ ràng.
- Approval, approve(0), donate, payTask, authorize và claim có actionId riêng. Action gắn đúng một purpose/payload/deployment/expectedCaller và các FK nghiệp vụ có kiểu; một action nhiều attempts.
- Payout nối payable, không sửa nghĩa vụ. Tối đa một pending/unknown execution cho cùng payable. Khi unknown phải đọc business key và đối soát trước đề xuất gửi lại.
- API preparation kiểm session/capability/chain manifest/current gates; trả dữ liệu ví cần ký và preview có kiểu, không ký thay người dùng. Claim/authorization/consent là các bước riêng.
- Funding/refund action nếu bật cần FK riêng đến fundingId/refundId + CHECK chọn đúng nguồn như UI Spec yêu cầu; không nhét ID vào JSON hay gán DEPLOYMENT_ADMIN để lách schema.

B. Worker và đối soát:
- Tiến trình apps/worker độc lập, outbox consumer có lock/lease/retry/backoff/dead-letter và dedupe outboxId+handler. Worker crash/restart không nhân đôi tác dụng.
- Quét logs theo manifest từ deploymentBlock, checkpoint, scan window có giới hạn, phục hồi khi mất browser callback. Public RPC không mặc định có WebSocket; HTTP polling hoạt động được.
- Lưu raw event key chainId+blockHash+txHash+logIndex; receipt identity chainId+contract+receiptKey. So khớp contract, chain, ABI version, caller, token, amount, beneficiary, request/payable key và canonical block.
- OBSERVED tách FINALIZED. Đối với deployment Arbitrum, kiểm RPC finalized head và canonical block/hash theo chính sách đã xác minh, không lấy “N block bất kỳ” làm finality. Không chứng minh finality được thì giữ pending, retry/alert.
- Block continuity/parentHash và checkpoint giúp tìm common ancestor; reorg gỡ projection provisional, rescan rồi áp dụng idempotently. Không xóa raw history; ledger chính thức chỉ từ finality đủ điều kiện.
- DonationRecorded là nguồn ghi sổ donate, ERC20 Transfer chỉ đối chiếu. Không cộng hai lần cùng dòng tiền. Gọi contract trực tiếp vẫn ghi DIRECT_CHAIN và donorAddress, có thể donationId/userId null; chỉ liên kết ý định khi đúng payload, không bịa UUID/userId từ hash.
- Với Safe, outer receipt success chưa đủ: cần event/thực thi bên trong đúng nghiệp vụ, msg.sender contract là Safe. Không có event đúng thì không PAID.
- Late route event không xóa desired hold. Grant issued/route active/payable paid dựa projection hợp lệ của từng loại, không từ một enum “tx success” chung.

C. Sổ quỹ và tiền ngoài app:
- Phân loại OWNER_FUNDING, PROJECT_DONATION, POST_TIP_SHARE, VIP_REVENUE, TASK_PAYOUT, REFUND theo asset/deployment.
- Raw transfer chưa rõ nguồn chờ phân loại/đối soát, không mặc định donate/available. Bắt được chi ra ngoài app và không dùng balance stale để cam kết task.
- Refund là nghĩa vụ/bản ghi riêng gắn nguồn và phần hoàn; tổng hoàn không vượt phần được phép. Giữ receipt gốc. Quỹ không thể kéo lại 80% đã gửi tác giả; cần người thực sự hoàn tiền ký riêng.
- Chính sách duyệt refund chưa chốt thì tắt execution; vẫn implement model, validation, read states và tests. Không báo refund thành công chỉ vì đã tạo hồ sơ.

D. VIP:
- Provider-neutral PaymentAdapter: quote/createCheckout/verifyNotification/reconcile; test adapter chỉ test. Kênh thật chưa cấu hình trả NOT_CONFIGURED; không dùng redirect URL hay client “success” làm bằng chứng trả tiền.
- Giá gói 1500 USD cents, 12 tháng lịch. Nếu sau này dùng crypto cần quote immutable asset/rate/amount/expiry; không mặc định stablecoin luôn đúng 1 USD.
- CONFIRMED đúng provider event/receipt → transaction lock membership → term unique(paymentId). startAt=max(confirmedAt,currentEndsAt); endsAt cộng 12 tháng lịch UTC, clamp cuối tháng nếu cần; [startAt,endsAt).
- Retry callback/concurrent renewal không thêm năm lặp. Donation không cấp VIP. Hết hạn kiểm bằng server clock mỗi request, không chờ cron mới mất quyền.
- Refund/chargeback điều chỉnh đúng term theo policy có lịch sử; không xóa payment cũ. Khi policy chưa chốt, flag cần xử lý, không tự sáng tác cách cắt kỳ.

E. Secrets/ops:
- Worker chỉ đọc chain và ghi DB, không lưu private key. Log structured có requestTraceId/business IDs, redaction secrets/PII. Health của web/DB/worker/indexer có tách trạng thái.
- Cache user+rights+deployment+entity+revision, invalidate khi logout/mất quyền; private response không lọt shared cache. Media URL có hạn và quyền.
- Expiry worker phục vụ projection/notification; API vẫn kiểm hạn trực tiếp và contract sau này kiểm block.timestamp.

Nghiệm thu: test lặp/out-of-order logs, missing callback, worker restart, reorg, RPC không trả finality, Safe inner failure, unknown payout, direct-chain donation, funding không bị ghi hai lần, VIP duplicate/concurrent callback và ngày 29/2. Ghi rõ tests dùng fixture/local, chưa phải Arbitrum live. BE_HANDOFF chứa migration, API và manifest/ABI cần từ contract. Không để nút live payment hoạt động khi adapter chưa được cấu hình.
```

## Prompt 07 — Smart contract Arbitrum: route, donate và trả công

```text
Thực hiện chặng 07. Đọc AGENTS.md, ID_CONTRACT, CHAIN_INTERFACE, BE_HANDOFF, Logic 0.3 đặc biệt mục 7/10/11/15/21. Đây là viết và kiểm thử Solidity trên local Anvil; chưa broadcast lên mainnet hoặc testnet.

Trước khi code:
- Kiểm tra Foundry, Solidity và OpenZeppelin tương thích từ tài liệu chính thức; pin compiler/dependencies và ghi EVM target tương thích Arbitrum. Không tự dùng opcode mới chưa được xác minh.
- Kiểm tra nếu có contract cũ: không tự giả định đã deploy, không sửa key namespace để “nâng version”. Lập migration impact nếu thấy deployment thật.
- Khóa ABI/interface trong ADR: function, struct, event, error, caller, replay scope, source key, trạng thái. Đồng bộ với packages/chain và schema/API theo cùng thay đổi, không để FE/backend dùng ABI giả.

Kiến trúc đề xuất, được điều chỉnh nếu có lý do cụ thể:
1. VentloreRegistry: route bất biến, revision block và role điều khiển.
2. VentlorePayments: PROJECT/POST_TIP và payTask, dedupe/receipts; tên splitterAddress trong công thức receipt chính là địa chỉ contract này.
3. ContributorSBT và AuthorContributionNFT triển khai ở chặng 08.
Không tạo token Ventlore giao dịch, marketplace, DAO, staking, cross-chain bridge, gas sponsorship hoặc upgradeable proxy trong baseline này.

A. Tiền và authority:
- Một ERC20 tiêu chuẩn được cấu hình cố định cho mỗi payments deployment để giảm scope; asset mainnet chưa chốt. Local dùng MockERC20 tên rõ là thử nghiệm; ETH là gas, không trộn với token donate.
- Treasury recipient và contract dependencies cố định cho deployment. Khi muốn thay config bất biến cần kế hoạch deployment/migration riêng, không đổi ngầm route/receipt quá khứ.
- PROJECT chuyển 100% amount từ donor vào treasury.
- POST_TIP chuyển authorAmount=amount-amount/5 tới beneficiary trong route và projectAmount=amount/5 vào treasury. Hai chuyển tiền atomic: một lỗi thì toàn bộ revert. Contract không giữ quỹ donate để chờ tác giả claim.
- Minimum amount cấu hình minh bạch, positive amount, allowance đúng spender; không phí ẩn/gas bị trừ trong split. Fee-on-transfer/rebasing token ngoài scope; từ chối hoặc kiểm soát để không phát receipt ghi nhận số tiền sai. Test các địa chỉ trùng nhau/self-transfer để ledger không xem đó là tiền mới từ bên ngoài.
- payTask dùng payableKey, recipient, asset/amount đã chốt; chỉ ví TREASURY có quyền thực thi và chuyển từ ví quỹ qua allowance. Backend không gửi tx thay. Bản thân contract không đọc được DB nghiệm thu: xác nhận nghĩa vụ vẫn tin vào treasury signer và kiểm soát backend, ghi rõ giới hạn này.
- Không dùng quyền operator nội dung để chi quỹ. ADMIN quản trị role/unpause; OPS chỉ các thao tác nội dung được cấp. Permission matrix phải rõ ai có thể pause/block và ai có thể mở lại.

B. Registry và consent:
- Route lưu routeKey, revisionKey, postKey, decision/content commitment phù hợp, beneficiary, validUntil và previousRouteKey khi thay route; các trường đã đăng ký không chỉnh sửa.
- Tối đa một route current cho một revision trong deployment; đổi ví/gia hạn tạo routeKey mới, thay route cũ atomically. Receipt cũ giữ beneficiary cũ.
- Register chỉ đúng role và có consent của beneficiary. Dùng EIP-712 typed data, domain chainId+verifyingContract+version và payload ràng buộc toàn bộ điều khoản thực thi: route/revision, beneficiary, expiry, split/treasury/token/payment-contract context khi liên quan, previous route và nonce/deadline.
- Signature đúng nhưng đã dùng/hết hạn/sai chain/contract/payload phải bị từ chối. EIP-712 tự nó không thay replay protection: consume nonce/authorization rõ ràng. SignatureChecker/ERC-1271 nếu hỗ trợ contract wallet; không tự dùng ecrecover cho mọi loại ví.
- Block revision và trạng thái route là state riêng; đăng ký route không tự xóa block. Tại tip execution kiểm current route, block/pause/revoke và block.timestamp < validUntil; expiry không cần cron.
- validUntil của route không vượt approval/consent có hiệu lực đã được authorize. Registry không thể tự kiểm sự thật ngoài đời; OPS chịu trách nhiệm đưa quyết định hợp lệ lên chain.
- OPS có thể chặn theo role; chỉ ADMIN mở lại theo policy. Không cho một boolean setter vô tình cho OPS vừa block vừa unblock. Event quá khứ không được dùng làm current gate.

C. Chống trả trùng và nguồn event:
- Dùng đúng entityKey/receiptKey theo ID_CONTRACT, không đổi string donation-request. Viết thư viện Solidity và test đối chiếu TypeScript cho cùng UUID → bytes16 → bytes32; có cả ví dụ tokenId.
- Donation dedupe theo donor+requestKey trong cùng payments contract, dùng chung cho PROJECT và POST_TIP. Retry cùng key không chuyển tiền lần hai; đổi kind/route/amount với key đã dùng không vượt dedupe. Receipt ghi payload gốc.
- payTask dedupe theo payableKey; trạng thái processed còn sau pause/role change. Mark trước external call và revert toàn bộ khi transfer fail.
- DonationRecorded/TaskPaid (tên cuối chốt trong ABI) chứa đủ business keys, payer/payee, token, split amounts để indexer xác minh. Event chỉ phát sau chuyển tiền thành công. DonationRecorded không chứa userId social hay private evidence.
- Dedupe hiện có phạm vi contract/deployment. Không hứa key chống trả trùng xuyên contract mới; tài liệu migration phải giữ consumed keys/obligations hoặc đóng luồng cũ có đối soát trước khi mở luồng mới.
- Không tự thêm keyKind cho paymentId/fundingId/refundId khi nguồn chưa định nghĩa. VIP checkout ở adapter riêng, không tận dụng donation receipt để cấp VIP.

D. Kiểm thử và đầu ra:
- OpenZeppelin SafeERC20, access control, pausable/reentrancy guard đúng phiên bản; checks-effects-interactions. Không chỉ thêm tên guard rồi bỏ test hành vi.
- Unit/fuzz/invariant: split bảo toàn tổng cho amount biên; project 100%; transfer thứ hai fail rollback transfer đầu; duplicate donate/payTask; sai caller; invalid/expired/replayed consent; wrong chain/domain; route cũ/hết hạn/bị block; malicious token/receiver, reentrancy; privilege escalation; pause/unpause.
- Foundry test không có RPC live phải chạy được local; fork test có provider thì ghi riêng, không giả PASS.
- Xuất ABI từ build artifact, không copy tay. Packages/chain có generated types, events và custom errors; deployment script có chainId assertion và dry-run mặc định. Chưa ghi deployment address giả.
- Tạo CONTRACTS_HANDOFF.md, THREAT_MODEL.md và coverage truy về C01–C22/QA01–QA25 liên quan. Nêu trust assumptions: content review, key custody, backend budget reserve, signer authorizations, token restrictions, finality/indexer.

Hoàn thành khi local build/unit/fuzz/invariant phù hợp qua, ID vector TS/Solidity khớp và ABI/code/backend adapter contract đồng bộ. Không tuyên bố audit độc lập hay production-ready. Tiếp chặng 08, chưa deploy.
```

## Prompt 08 — Smart contract SBT và NFT tác giả

```text
Thực hiện chặng 08. Đọc ID_CONTRACT, CONTRACTS_HANDOFF, Logic F06 và UI U08. Viết hai contract riêng, dùng cùng manifest/role conventions; local Anvil trước.

1. ContributorSBT:
- ERC-721 khóa chuyển phù hợp ERC-5192; không cho transfer/approval mở lối chuyển trái quy tắc. Mint/burn/revoke semantics phải được ghi rõ, không nhầm token còn tồn tại với credential còn hiệu lực.
- tokenId=uint256(credentialKey), business key giữ nguyên khi retry. Authorization bởi OPS đúng role; claim do đúng recipient ví đã authorize gọi, không cho caller thay to address để chiếm grant.
- Có trạng thái authorize/claim/revoke/expiry phù hợp, nonce/key chống claim lặp và event đủ để worker đối soát. Chứng nhận lịch sử không tự mất chỉ vì một bài hết hạn theo thời gian.
- Không công khai userId hoặc userKey suy từ social ID. Ràng buộc một active CONTRIBUTOR/user nằm ở backend; contract cưỡng chế theo credential/authorization mà nó biết, không thể chứng minh “một con người” chỉ từ ví.
- Thay ví/chứng nhận có supersedes reference và quy trình revoke credential cũ trước khi kích hoạt mới; không coi hai ví là hai người để cấp lặp. Nếu chưa xác nhận revoke, giữ replacement pending. Không chuyển SBT như NFT thông thường.

2. AuthorContributionNFT:
- ERC-721, tokenId=uint256(collectibleKey). Authorization liên kết postKey, sourceRevisionKey, decision commitment và original-author recipient.
- Ràng buộc lifetime một AUTHOR_CONTRIBUTION/postKey, và một mint/collectibleKey. Tombstone mintedPostKey không reset khi transfer, burn hay revoke; revision mới không mở mint mới.
- Claim đúng subject và authorization, không dùng receiptKey của donor. Chưa có ví giữ eligibility ở backend, không mint vào ví tự đoán.
- Nếu dùng khả năng transfer chuẩn ERC-721, ownerOf chỉ chủ token hiện tại. Original-author metadata không bị sửa thành owner mới, và registry beneficiary không tham chiếu ownerOf.
- Không gán quyền doanh thu, tác quyền, quyền địa điểm, VIP hoặc governance. Không tự thêm royalty, marketplace hay donor NFT.

3. Metadata, privacy, safety:
- Metadata public chỉ trường được cho phép; không email, UUID social/private evidence/GPS riêng. Public metadata/content commitment có version và chính sách cập nhật rõ; content hash không chứng minh thông tin đúng.
- Quyết định revoke có reasonKey/public commitment phù hợp, không hash thô PII. Preserve lịch sử và token identity gồm chain+contract+tokenId.
- Safe mint callbacks là external calls; đánh dấu claimed/minted trước callback và bảo vệ reentrancy. Approve/pause/role không cho cấp lại post đã mint.
- Cùng source decision có thể tạo hai authorization/action khác nhau cho SBT và NFT; lỗi nhánh này không rollback công nhận offchain hay nhánh khác.

4. Kiểm thử:
- Unauthorized authorize/claim/revoke; wrong recipient; replay; expired authorization; callback reentrancy; SBT transfer/approval; replace khi revoke cũ chưa xong.
- NFT mint lại sau transfer/burn/new revision/đổi collectibleKey cho cùng postKey đều bị chặn; tip vẫn gửi tác giả theo route khi NFT đổi chủ.
- TS/Solidity tokenId và keys khớp, generated ABI cập nhật. Không chỉ test happy path.

Hoàn thành local Foundry tests, cập nhật manifest schema, generated types, wallet action prepare và indexer decoders. Grant UI chỉ ISSUED sau projection hợp lệ. Viết rõ giới hạn uniqueness offchain/onchain và cross-deployment vào handoff. Chưa broadcast.
```

## Prompt 09 — Nối ba lớp và chuẩn bị Arbitrum Sepolia

```text
Thực hiện chặng 09. Đọc mọi handoff, ABI compile thực, OpenAPI và coverage. Nối front-end → API → database → wallet → contracts → indexer → UI. Không thay source of truth bằng state trình duyệt.

A. Local end-to-end trước:
- Cung cấp lệnh khởi động có tài liệu cho web, PostgreSQL/Supabase local, worker và Anvil. Mỗi dependency có health check; port/env rõ. Không tự xóa/reset database có dữ liệu chưa rõ nguồn.
- Deploy contracts + MockERC20 bằng fixture local; ghi manifest deploymentId, chainId, contract addresses, ABI hash/version, token/decimals, deploymentBlock, role addresses, finality policy, source commit và compiler info. Local manifest tách hẳn testnet.
- Viem/wagmi dùng ABI sinh từ compile. Front-end không tự ghép calldata khác dữ liệu server đã chốt. Check/simulate đúng chain/account/to/value/token/spender/amount và reread gates trước ký; thay account/chain vô hiệu bước confirm cũ.
- Author ký consent → OPS register route; OPS authorize → author claim; donor approve rồi donate; treasury approve rồi payTask. Từng action/attempt đúng định danh.
- Giữ provider mock chỉ test; integration mode dùng API thật, chain thật local. Thiếu cấu hình trả not-configured, không fallback fake-success.

B. Các hành trình phải chạy cục bộ:
1. Guest đọc public → login → gửi điểm mới REVIEW_ONLY → operator giao chuyên gia độc lập → nộp → nghiệm thu → quyết định APPROVED → public/VIP curation đúng consent.
2. Được duyệt nhưng chưa ví: nhãn có, SBT/NFT/tip chờ; có ví rồi consent/authorize/claim/register lần lượt.
3. Donate PROJECT và POST_TIP: kiểm token balances, receipt, source keys, finality projection, quỹ chỉ tăng phần đúng. Account trùng với bên nhận/self-transfer không tạo thu nhập quỹ giả.
4. Bài REJECTED nhưng công đạt → payTask → payable PAID sau đối soát; không thưởng quyền lợi APPROVED.
5. Sửa bài tạo revision mới → không kế thừa nhãn/tip; NFT không mint thêm; NFT chuyển chủ không đổi beneficiary.
6. App hold trong lúc register pending → late event không gỡ hold; block chain thực thi rồi UI phản ánh đúng. Route hết hạn bị chặn khi gọi contract trực tiếp.
7. Mất callback, unknown/replacement, duplicate log, worker restart và reorg → phục hồi cùng business IDs, không trả trùng.
8. VIP bằng test adapter: duplicate callback, concurrent renewal, expiry, privacy. Ghi rõ đây chưa là checkout provider thật.
- Local finality driver/test clock ghi rõ chỉ mô phỏng. Không suy ra độ trễ finality Arbitrum từ Anvil.

C. Chuẩn bị testnet:
- Mặc định mạng thử nghiệm Arbitrum Sepolia chainId 421614; ETH testnet trả gas. Xác minh tài liệu Arbitrum hiện hành về RPC/explorer/token trước khi cấu hình.
- Chỉ dùng MockERC20 hoặc token testnet có nguồn được xác minh; không ghi nhãn “USDC chính thức” cho mock. Không copy token mainnet sang testnet.
- .env.example liệt kê RPC, DB/Auth/Storage, địa chỉ role cần cung cấp; không chứa secret. Deployer dùng wallet/keystore/secret manager được người vận hành thiết lập; không yêu cầu seed phrase/private key dán vào chat.
- Script deploy có dry-run, chainId assertion, role/constructor checks, code-existence check và manifest export. Chuẩn bị verify source trên explorer bằng cấu hình thật; khi thiếu API key thì ghi rõ chưa verified.
- Chưa broadcast chỉ vì đã hoàn thành code. Trước broadcast trình bày dry-run, cấu hình, địa chỉ quyền/quỹ/token, gas estimate và lệnh cụ thể cho người vận hành kiểm tra. Chỉ thực hiện khi họ đã cho phép triển khai testnet và có signer được cấu hình.
- Nếu signer/RPC/token chưa sẵn: hoàn thành package testnet, hướng dẫn chạy lệnh và nêu đúng phần còn chặn. Không bịa deployment address/txHash.

D. Nếu deployment testnet được thực hiện sau khi đủ điều kiện:
- Ghi địa chỉ/transaction/deploymentBlock thực, quyền thực và ABI hash; kiểm lại chainId/bytecode/role sau deploy.
- Nối worker với manifest đó và chạy smoke bằng token testnet: route+consent, PROJECT, POST_TIP, payTask, author NFT/SBT. Theo dõi observed tới finalized, đo độ trễ thực, không ghi tiền đã đối soát từ toast.
- Không deploy mainnet, không tự publish website hoặc chuyển tài sản thật. Chuẩn bị code/runbook cho các bước đó là đủ ở đây.

Cập nhật INTEGRATION_HANDOFF.md với bảng mỗi hành trình: mock/local/testnet, bằng chứng, kết quả, chưa chạy và lý do. Mọi số txHash/address trong báo cáo phải đến từ execution thực hoặc được ghi rõ placeholder. Cập nhật toàn bộ coverage.
```

## Prompt 10 — Rà soát, sửa lỗi và bàn giao bản chạy được

```text
Thực hiện chặng 10. Đọc source-index, coverage, PROJECT_STATE, các handoff và mã hiện tại. Đóng các khoảng trống trong phạm vi Ventlore 0.3 đã triển khai; không mở thêm feature mới.

1. Traceability:
- Rà đủ S01–S35, C01–C50, U01–U12/72 event steps, Logic C01–C22 và UI QA01–QA25. Gắn từng item với file/code, API, test hoặc trạng thái chưa triển khai có lý do.
- Sửa mapping sai nguồn, ID, quyền, state. Không gọi toàn bộ 0.3 hoàn thành nếu vẫn có màn chỉ mock hoặc checkout chưa cấu hình.

2. Kiểm tra các ranh giới quan trọng:
- User/role/wallet/VIP/SBT tách đúng; authorization mọi endpoint, object/parent/scope checks; không mass assignment hay IDOR.
- Review-only/VIP/evidence/identities không rò qua HTML, network payload, SSR/cache, signed URL, metadata token hoặc log.
- Single canonical ID xuyên DB/API/UI; UUID/key vectors nhất quán; displayCode không dùng FK. Không đổi namespace/keyKind.
- Snapshot/decision/payable bất biến; reserve/acceptance/VIP renewal có concurrency control; amount atomic string/bigint, không float; term 12 tháng lịch đúng UTC.
- approve khác donate/payTask; action khác attempt; unknown giữ key; ledger và money status chỉ sau bằng chứng đúng/finality.
- Route validity/block/current pointer cưỡng chế trong contract; UI hold không hứa đã chặn chain. Consent replay/domain/caller và role escalation bị chặn.
- SBT uniqueness theo user ở backend có giới hạn được nói rõ; NFT lifetime per post cả sau burn; ownerOf không đổi tip; mainnet switch không chỉ là đổi chainId.
- Không private key trong server/worker/browser/repo. Không dev role-switcher, mock auth/payment hoặc test mint faucet bị mở trong production.

3. Chạy những kiểm tra có ý nghĩa:
- Lint/typecheck/build của packages/app, PostgreSQL integration, browser journey và Foundry unit/fuzz/invariant. Các gate cụ thể đã nêu ở từng chặng phải có kết quả thật.
- Chạy CI workflow GitHub Actions cho lint/typecheck/build/tests và ABI/schema drift bằng cấu hình tối thiểu; CI thường không có signer hoặc tự deploy khi push.
- Phân loại FAIL, NOT_RUN, NOT_CONFIGURED, PASS; sửa lỗi trong phạm vi rồi chạy lại phần bị ảnh hưởng. Không đổi assertion để che lỗi, không mở rộng test vô hạn khi rủi ro đã được giải quyết.
- Chỉ chạy audit/static analyzer khi công cụ thật có sẵn, ghi tên/version/kết quả; kết quả agent tự rà không phải audit độc lập.

4. Bàn giao:
- README có cài đặt, env, migrate, seed test, dev, worker, tests, local deploy, testnet dry-run/verify và khôi phục trạng thái pending.
- OPS_RUNBOOK.md: quyền ví, role changes, pause/block/unblock, RPC lỗi, indexer lag/reorg, backup/restore DB+key mapping, cập nhật ABI/manifest, thay deployment, refund cần signer đúng bên.
- BACKUP_RESTORE.md và bài diễn tập local phục hồi DB mapping: blockchain hash không tự khôi phục UUID/nội dung. Không restore đè live.
- RELEASE_STATUS.md tách rõ: UI mock, full-stack local, Sepolia thực nếu có, VIP provider thật, mainnet. Liệt kê điểm còn mở cùng tác động và bước cần người vận hành làm.
- MAINNET_READINESS.md chỉ là điều kiện phát hành: asset/ví/admin được chốt, business policies được xác nhận, auth/storage/backup/monitoring chạy thật, signer custody, review/audit contract phù hợp và migration plan. Chưa đủ thì ghi chưa đủ; không deploy.
- Kịch bản demo 5–7 phút với fixture minh họa và danh sách hành trình hoạt động được. Không dùng dữ liệu địa điểm giả như hướng dẫn an toàn ngoài đời.

Kết thúc bằng báo cáo ngắn: đã chạy được gì, kiểm thử nào đã chạy/kết quả, điểm nào còn cấu hình hoặc quyết định, cách tôi mở ứng dụng và thử ba hành trình chính. Không kết luận “production-ready” từ việc build thành công.
```

## Prompt tiếp tục khi đổi cuộc hội thoại

Thay `[NN]` bằng số chặng cần chạy.

```text
Tiếp tục repository Ventlore đang mở, thực hiện Prompt [NN] trong docs/Ventlore_Antigravity_Prompt_Pack_v1_0.md.
Trước khi code, đọc AGENTS.md, docs/PROJECT_STATE.md, docs/HANDOFF.md, các quyết định và handoff liên quan; kiểm git status và mã đang có.
Xác nhận ngắn trạng thái thực tế rồi thực hiện đúng chặng, không dựng lại repo, không đổi hợp đồng ID/API/ABI hoặc business rules để tiện code. Nếu báo cáo cũ lệch mã hiện tại, kiểm chứng và cập nhật có lý do.
Hoàn thành phần có thể làm, chạy kiểm tra phù hợp, sửa lỗi do thay đổi, lưu bàn giao để phiên sau tiếp tục. Không báo PASS cho việc chưa chạy.
```

## Prompt sửa lỗi trong một chặng

```text
Sửa lỗi của chặng đang làm trong repository Ventlore. Đọc AGENTS.md, PROJECT_STATE và kết quả lệnh/test thực tế bên dưới.
Tái hiện lỗi ở phạm vi nhỏ nhất, tìm nguyên nhân rồi sửa trong đúng lớp chịu trách nhiệm. Giữ nguyên ID, tỷ lệ tiền, ràng buộc quyền, finality, immutability và các test bảo vệ nghiệp vụ.
Không sửa bằng cách tắt authorization, bỏ unique/FK, giả thành công thanh toán, đổi ý định tiền hoặc chuyển sang mock. Không viết lại cả dự án.
Chạy lại kiểm tra liên quan, bổ sung regression test chỉ khi bảo vệ được lỗi cụ thể, rồi cập nhật handoff. Nêu rõ kết quả đã chạy và phần chưa kiểm được.

Log hoặc mô tả lỗi:
[Dán log đã loại secret, cùng lệnh vừa chạy và bước tái hiện.]
```

## Khi nào chuyển sang prompt tiếp theo?

| Chặng | Bằng chứng cần có |
|---|---|
| 00 | Nguồn đã đọc, ID/schema/coverage và nền repo có thể kiểm tra |
| 01–03 | UI tương tác đủ phạm vi, screenshot thực, typecheck/build; mock được ghi rõ |
| 04 | Schema/auth/phân quyền có kiểm thử thật trên DB; không dùng UI gate thay server |
| 05 | Nội dung → task → nghiệm thu/decision qua API/DB; race/permission tests đạt |
| 06 | Worker/VIP/accounting chạy test được; live chain/payment chưa có thì tắt rõ ràng |
| 07–08 | Contract local tests đạt, keys TS/Solidity khớp, ABI sinh từ compile |
| 09 | Luồng ba lớp chạy local; testnet package sẵn; chỉ ghi Sepolia chạy thật khi có bằng chứng |
| 10 | Coverage đúng thực tế, lỗi trọng yếu đã xử lý, README/runbook/handoff đầy đủ |

## Tài liệu kỹ thuật chính thức để agent kiểm tra khi triển khai

Các liên kết được kiểm tra khi soạn bộ prompt ngày 23/09/2026. Phiên bản package và chi tiết API cần được kiểm lại tại thời điểm code.

- [Antigravity Rules](https://antigravity.google/docs/rules): lưu quy tắc `AGENTS.md` theo workspace/thư mục.
- [Antigravity Artifact Review](https://antigravity.google/docs/artifact-review): cài đặt review trong quy trình lập kế hoạch.
- [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers): lớp HTTP backend trong ứng dụng App Router.
- [Supabase Google sign-in](https://supabase.com/docs/guides/auth/social-login/auth-google): cấu hình social login.
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security): quyền truy cập dữ liệu; service credentials phải được bảo vệ.
- [Arbitrum chain information](https://docs.arbitrum.io/for-devs/dev-tools-and-resources/chain-info): chain ID, RPC và explorer.
- [Arbitrum finality and reorgs](https://docs.arbitrum.io/how-arbitrum-works/reference/finality-and-reorgs): phân biệt soft confirmation với finality từ parent chain; không tự chọn số block để thay thế.
- [Arbitrum Foundry quickstart](https://docs.arbitrum.io/build-decentralized-apps/quickstart-create-a-token): quy trình công cụ/deployment tham khảo, không phải yêu cầu phát hành token Ventlore.
- [OpenZeppelin Cryptography](https://docs.openzeppelin.com/contracts/5.x/api/utils/cryptography): EIP712, SignatureChecker và các primitive liên quan; chọn API theo phiên bản đã pin.
- [EIP-712](https://eips.ethereum.org/EIPS/eip-712): typed structured data, cần replay protection ở ứng dụng/contract.
- [ERC-5192](https://eips.ethereum.org/EIPS/eip-5192): minimal soulbound NFT interface; hiệu lực chứng nhận và quyền Ventlore vẫn là logic riêng.

Nghiệp vụ, các mã ID, tỷ lệ chia tiền và tiêu chí sản phẩm trong bộ prompt được lấy từ sáu tài liệu Ventlore ở đầu tệp. Cấu trúc repo, stack, chia chặng và bốn module contract là đề xuất triển khai để Bin bắt đầu; chúng không chứng minh mô hình đã phi tập trung hoàn toàn. Contract cưỡng chế các quy tắc có thể kiểm trên chain; chất lượng thông tin địa phương, quyền cấp và quản trị vẫn có các bên chịu trách nhiệm.
