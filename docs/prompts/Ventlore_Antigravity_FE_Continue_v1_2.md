# Ventlore — Tiếp tục hoàn thiện Front-end v1.2

Ngày: 26/09/2026, giờ Việt Nam.  
Bản tham chiếu: https://ventlore.com/vi/  
Mục tiêu: hoàn thiện FE hiện có, nghiệm thu hành trình bằng demo nhất quán và sửa Data Map để Bin quyết định triển khai BE.

Đây là hướng dẫn tiếp nối `Ventlore_Antigravity_FE_Fix_v1_1.md` và `Ventlore_Prompt_FE_First_v1_0.md`. Các quan sát bên dưới đến từ lần review desktop gần nhất ngày 26/09/2026, chủ yếu VI/EN. Chưa nghiệm thu mobile, toàn bộ sáu ngôn ngữ, bảo mật backend hoặc giao dịch blockchain thật. Agent phải đối chiếu lại với code đang mở; không coi finding đã hết trên branch hiện tại là việc cần sửa lại.

## A. Bin sử dụng file này

1. Mở đúng cửa sổ/workspace **FE Ventlore** trong Antigravity.
2. Thêm file này vào thư mục prompt của repo. Nếu chưa có quy ước, dùng `docs/prompts/Ventlore_Antigravity_FE_Continue_v1_2.md`.
3. Giữ các Sources, prompt FE v1.0 và hướng dẫn v1.1 trong workspace để agent tham chiếu.
4. Dán lệnh dưới đây. Agent cần thực hiện sửa code, chạy thử và bàn giao bản có thể xem được.
5. Nghiệm thu theo phần D. Việc sửa local không tự cập nhật `ventlore.com`; phát hành theo quy trình Git/Netlify hiện có sau khi review.

### Lệnh khởi động — dán vào Antigravity

```text
Đọc và thực hiện toàn bộ phần B và C trong file
Ventlore_Antigravity_FE_Continue_v1_2.md tôi vừa cung cấp.

Tiếp tục trên Front-end Ventlore hiện tại. Hoàn thành code và kiểm tra
trình duyệt, không dừng ở đề xuất hoặc kế hoạch.

Ưu tiên: đồng bộ tab Account với URL; hoàn thiện i18n; sửa FE_DATA_MAP
theo ID Registry và Masterboard; chỉnh copy kiểm định; sửa Review Toolbar.
Sau đó kiểm mobile và hồi quy các lỗi đã sửa ở vòng v1.1.

Chỉ làm FE, demo adapter/store và tài liệu bàn giao FE.
Giữ nguyên các quy tắc nghiệp vụ đã chốt. Không triển khai BE/Chain,
không dựng lại website, không ký/gửi giao dịch thật trong đợt này.

Bắt đầu bằng kiểm tra repo, branch, thay đổi hiện có và tái hiện finding.
Tự xử lý các lựa chọn triển khai FE thông thường, tiếp tục từng hạng mục
độc lập đến khi có bản local/preview review được. Ghi rõ phần bị chặn.
Không tự push, merge hoặc deploy production trong lượt này.
```

## B. Prompt triển khai cho Antigravity

Bạn phụ trách Front-end Ventlore trong repository đang mở. Sản phẩm cần bàn giao là một bản FE chạy được, có dữ liệu demo đúng quy tắc, cùng tài liệu dữ liệu phản ánh implementation thực tế.

### 1. Phạm vi, nguồn chuẩn và nguyên tắc làm việc

Trình tự dự án: **FE → nghiệm thu hành trình → chốt dữ liệu theo component → BE → tích hợp Chain**.

Đọc theo phạm vi liên quan:

- Yêu cầu hiện tại của Bin và bản v1.2 này.
- Prompt FE v1.0 và hướng dẫn sửa v1.1; bản v1.2 cập nhật trạng thái finding, không hủy các yêu cầu nghiệp vụ còn hiệu lực.
- `Ventlore_Journeys_FE_BE_Chain_Masterboard_v1_1.pdf`.
- `Ventlore_ID_Registry_v0_3.csv`, `Ventlore_Logic_ID_DB_v0_3.pdf`, `Ventlore_So_do_Khoi_v0_3.pdf`.
- `Ventlore_Event_UI_Spec_v0_3(1).pdf`, `Ventlore_Event_UI_Wireframes_v0_3(1).pdf`.
- `Ventlore_Brand_Guide_v0_1.pdf`, design tokens và component đang có.

Registry là nguồn chuẩn về tên/quan hệ ID; Masterboard bổ sung luồng và các đính chính VIP. Không dùng Data Map hiện tại để ghi đè các nguồn này. Nếu nguồn thiếu, tiếp tục phần không phụ thuộc và ghi chính xác phần chưa đối chiếu; không tự chứng nhận đã khớp tài liệu chưa đọc.

Các quy tắc phải giữ:

- Users: Guest, Member, VIP_member. Operators: Experts, Admin. Tác giả là quan hệ sở hữu bài, không thêm role `AUTHOR`. Persona demo tên `author` chỉ là shortcut chọn tài khoản Member có bài.
- Một tài khoản dùng một `userId`. Bio như hướng dẫn viên/kiểm lâm không cấp quyền vận hành.
- VIP thuộc tài khoản đăng nhập, không thuộc ví thanh toán. Đọc VIP không bắt buộc kết nối/ký ví.
- Donate quỹ: 100% quỹ. Tip bài: 80% tác giả, 20% quỹ. Mua VIP là nghiệp vụ riêng.
- Kiểm định theo revision/claim, phạm vi và thời hạn. Không biến huy hiệu thành cam kết an toàn toàn địa điểm.
- Nhãn web, SBT, NFT và route nhận tip có trạng thái riêng. Thiếu ví không làm mất công nhận nội dung; NFT đổi chủ không đổi tác giả hoặc người nhận tip.
- Một Author NFT cho mỗi bài theo điều kiện đã chốt; sửa revision không tạo thêm NFT của cùng bài. Không diễn đạt thành chỉ bài đầu tiên của mỗi người mới có NFT.
- Nghiệm thu công chuyên gia độc lập với quyết định nội dung: công đạt vẫn có nghĩa vụ trả dù bài bị bác.
- Gia hạn VIP giữ `membershipId`; đơn mới có `paymentId` mới. Kỳ mới bắt đầu tại `max(confirmedAt, hạn hiện tại)` và thêm 12 tháng lịch UTC. Retry cùng đơn không tạo kỳ mới; pending không xóa quyền còn hạn.

Được sửa: FE routes/layout/components, CSS, i18n, view models/types, demo fixtures/adapters/store, kiểm thử hành vi liên quan và tài liệu FE. Không thêm API server, database/migration, OAuth server, listener/indexer, smart contract/ABI, signer, embedded wallet hoặc swap/bridge trong đợt này.

Đọc `AGENTS.md`, README, package scripts, lockfile và quy ước ownership/worktree nếu có. Kiểm tra `git status`; giữ nguyên thay đổi không thuộc mình. Dùng package manager và router thực tế của repo, không đổi framework để sửa các finding này.

Làm theo các chặng bên dưới. Mỗi chặng cập nhật kết quả ngắn; không hỏi lại Bin về sửa FE thông thường hoặc dừng chỉ để xin duyệt kế hoạch. Nếu gặp xung đột sản phẩm chưa có quyết định, ghi đề xuất và tiếp tục việc độc lập. Không chạy vòng lặp tự động vô hạn: test thất bại phải được phân tích trước khi chạy lại.

### 2. Baseline — giữ các phần đã đạt

Trước khi sửa, ghi branch/commit nếu có, lệnh chạy và URL local thực tế. Đối chiếu các finding với code hiện tại, phân loại `CONFIRMED`, `ALREADY_FIXED`, `NOT_REPRODUCED`, `BLOCKED`. Đọc trạng thái UI sau khi tải ổn định để tránh kết luận từ một frame chuyển tiếp.

Những kết quả đã quan sát tốt trên bản deploy:

| Hạng mục | Kết quả vòng review gần nhất | Việc vòng này |
| --- | --- | --- |
| Revision bài | Đổi hai chiều cập nhật nội dung/trạng thái ngay | Kiểm hồi quy khi sửa router; không viết lại nếu đã đúng |
| Tip bản cần sửa | Bị chặn, có lý do | Giữ gate và ngữ cảnh revision |
| Guest → Expert/Admin | Có màn giới thiệu/đăng nhập thay vì bảng nghiệp vụ | Kiểm route và demo adapter; UI đúng chưa chứng minh bảo mật server |
| PaymentModal | Đã bỏ tab chuyển mode công khai; VIP có người thụ hưởng | Giữ ba điểm vào đúng mục đích |
| Tab Contribute | `tab=candidate` cập nhật URL và giữ khi đổi locale | Dùng làm tham chiếu, không làm hỏng khi sửa Account |
| Quyền lợi 0 bài | Admin không đủ điều kiện thấy SBT/NFT/tip bị khóa | Giữ cách suy ra quyền từ dữ liệu người dùng |
| Header desktop | Gọn hơn, không chồng lấn ở viewport đã xem | Kiểm thêm mobile và tên/nhãn dài |
| Hồ sơ cá nhân | Đã mở được form sửa tên/bio | Kiểm lưu demo; chưa coi persistence là đã nghiệm thu |

### 3. FE-12-01 — Đồng bộ tab Account với URL và locale

**Ưu tiên P1. Finding đã xác nhận:** tại `/en/account/?tab=benefits`, bấm “Hồ sơ cá nhân” thì nội dung đổi nhưng URL vẫn `tab=benefits`. Reload hoặc đổi locale lại về quyền lợi. Tái hiện tương tự từ `/vi/account/?tab=benefits`.

Yêu cầu:

- Dùng router/query làm nguồn thống nhất cho tab chia sẻ được qua URL. Tab UI và query phải cập nhật hai chiều; tránh chỉ khởi tạo state từ query một lần.
- Giữ tên tab đang dùng trong repo. Liệt kê các giá trị hợp lệ; không tự tạo thêm tab do suy đoán.
- Dùng navigation phía client theo router hiện tại. Đổi tab thông thường tạo history để Back/Forward hoạt động; chuẩn hóa giá trị sai bằng replace để không tạo history rác.
- Query rỗng dùng tab mặc định đã chọn trong sản phẩm; query sai hiển thị/fallback có chủ đích và chuẩn hóa URL. Chỉ cho xem tab theo capability; query không cấp quyền.
- Đổi ngôn ngữ giữ tab hiện tại, query liên quan và dữ liệu nháp đang được phép giữ. Deep link, reload và Back/Forward phải trả cùng nội dung với URL.
- Dùng helper chung nếu phù hợp với cấu trúc repo, nhưng không refactor toàn bộ routing. Giữ các query quan trọng như revision/filter; chỉ bảo toàn `returnTo` nội bộ hợp lệ.
- Kiểm `returnTo` từ header và từ form: đăng nhập demo xong phải trở lại đúng tab/ngữ cảnh, không mất `?tab=candidate`.

Nghiệm thu: mở trực tiếp benefits → profile → contributions → Back → Forward → reload → đổi VI/EN. Mỗi bước URL, tab active và nội dung khớp nhau. Thử thiếu/sai query và persona không có quyền. Có kiểm thử hành vi cho navigation và giữ context qua locale; không chỉ test tên helper hoặc snapshot implementation.

### 4. FE-12-02 — Hoàn thiện i18n theo hành trình

**Ưu tiên P1. Finding đã xác nhận:** `/en/contribute/?tab=candidate` và `/en/account/` còn phần lớn form/tab tiếng Việt. `/en/vip/` đã dịch nội dung giới thiệu nhưng CTA và PaymentModal vẫn tiếng Việt. Header còn “Đóng góp”, “Ủng hộ quỹ”; footer có “Tải .md”.

Yêu cầu:

- Dùng cơ chế i18n hiện tại. Rà VI, EN, JA, ZH, KO, FR theo đúng mã locale đang có; không tạo mã ngôn ngữ song song.
- Dịch trọn luồng: navigation/user menu → trang → form → validation → modal → loading/error/empty/success → nút quay lại. Bao gồm Account, Benefits, Contribute, VIP, PROJECT, POST_TIP, MEMBERSHIP, Expert/Admin và aria-label.
- Không dùng bản dịch tiếng Việt làm fallback im lặng cho mọi UI ở EN/JA/ZH/KO/FR. Bổ sung key thiếu, phát hiện key thô và placeholder/interpolation thiếu đối số.
- Tên riêng, handle và mã ID không cần dịch. Phân biệt UI với nội dung do người dùng viết: bài chưa có bản dịch cần nhãn ngôn ngữ/fallback rõ, không giả vờ đã dịch. Fixture đa ngôn ngữ dùng đúng bản được cung cấp.
- Dùng định dạng số, tiền, ngày theo locale hiện tại; giữ cùng giá trị nghiệp vụ và cùng mốc thời gian. Không suy ra giá/token mới khi đổi ngôn ngữ.
- Đổi locale không mất tab, revision, filter, nháp hoặc người thụ hưởng thanh toán. Không tự mở ví hoặc tạo payment mới.
- Nhãn form phải gắn được với input bằng `label`/`id` hoặc accessible name phù hợp. Kiểm tên nút icon, focus và thông báo lỗi, không chỉ dịch chữ nhìn thấy.

Nghiệm thu: VI/EN cho các hành trình tương tác chính; kiểm đủ sáu locale ở các màn hình bị sửa, bao gồm modal/error và khả năng hiển thị CJK/nhãn dài tiếng Pháp. Key parity chỉ là kiểm tra bổ trợ, không thay việc xem UI. Báo cáo chính xác màn hình/locale đã thử và phần chưa kiểm.

### 5. FE-12-03 — Sửa Data Map theo code và nguồn chuẩn

**Ưu tiên P1 trước bàn giao BE.** Trang `/vi/data-map/` hiện có 39 dòng/16 cột nhưng một số mô tả lệch nguồn và UI. Các tên component trong bản hiện tại là đầu mối tìm kiếm, chưa được xác minh từ repository. Không giữ số “39 nhóm/23 components/5 quyết định” nếu inventory thật thay đổi.

#### 5.1. Đối soát từng component thực tế

Tìm component/page/adapter và field đang dùng trong code. Lập map theo nhóm dữ liệu, không gắn nhãn cứng nguyên trang là tĩnh hoặc động. Mỗi dòng có thể đối chiếu được với component và đường dẫn repo thật; không bịa API/schema chưa triển khai.

Giữ 16 cột hiện có, ghi thêm lifecycle/quyền/ghi chú trong ô hoặc phần chú thích tương ứng:

| Cột | Nội dung cần thể hiện |
| --- | --- |
| 1. Page / Route | Route thật, quy ước locale/query |
| 2. Actor | Actor/capability chuẩn, tác giả là quan hệ sở hữu |
| 3. Component | Tên và đường dẫn component thật trong repo |
| 4. Field / Data group | Nhóm field thực tế đang hiển thị hoặc thao tác |
| 5. Giá trị demo | Ví dụ từ fixture hiện có; ghi rõ demo |
| 6. Nguồn đang dùng | Nguồn mà code thực sự đọc hiện nay |
| 7. Nguồn đích đề xuất | Đề xuất tích hợp giai đoạn sau, phân biệt với hiện trạng |
| 8. ID đầu vào | ID cần có, quan hệ FK, ngữ cảnh phiên/capability |
| 9. ID tạo / dùng lại | Tạo lúc nào, chỉ đọc dùng lại gì, retry giữ gì |
| 10. Ai xem | Projection công khai/cá nhân/vận hành và phạm vi |
| 11. Ai sửa | Capability/ownership; không coi ID là quyền |
| 12. Khi tải / làm mới | Vào trang, đổi query/locale/session, mutation hoặc event |
| 13. Lỗi / rỗng | Các trạng thái UI và CTA tiếp theo |
| 14. Client state / persist | URL, state, draft/storage; phạm vi theo user nếu riêng tư |
| 15. Cache / render | Đề xuất và điều kiện invalidation; tránh lẫn dữ liệu người dùng |
| 16. Quyết định | Đã chốt + nguồn, hoặc đề xuất/chưa chốt + tác động |

Định nghĩa nguồn phải nhất quán:

- `FE_STATIC`: copy/i18n/config hoặc fixture chỉ đọc đang bundle trong FE. Ghi rõ nếu giá trị chỉ là mẫu và đích sau này là BE.
- `FE_LOCAL_STATE`: state/draft/demo store cục bộ; lưu trình duyệt không biến thành dữ liệu BE.
- `BE_DYNAMIC`: dữ liệu trả từ BE. Nếu chưa có API thì chỉ ghi ở nguồn đích, không nhận là hiện trạng.
- `WALLET_PUBLIC_READ`: dữ liệu thực đọc từ provider/RPC. Ví/số dư giả của demo phải ghi nguồn hiện tại là fixture/local state tương ứng, không gắn nhãn đọc ví thật.
- `CHAIN_VIA_BE`: dữ liệu chain đã qua đối soát/indexer/BE. Kết quả giả lập chưa phải nguồn này.

#### 5.2. Các sai lệch phải xử lý

Số dòng dưới đây theo bản được review; nhận diện theo component khi thứ tự thay đổi.

| Vị trí hiện tại | Yêu cầu sửa |
| --- | --- |
| Dòng 3 — Home Highlights | Đang mô tả khối không có trên Home đã chốt. Bỏ khỏi inventory triển khai; không xây thêm khối để làm tài liệu “đúng”. Home giữ hero và hai CTA theo FE v1.0. |
| Dòng 4–5 — Nav / PersonaSwitcher | Đối chiếu menu và Review Toolbar thật. Phân biệt persona demo với role hệ thống; không gán vai trò AUTHOR. |
| Dòng 8/12 — Nhãn an toàn / Verification | Đổi thành kết quả kiểm định theo revision/claim, scope và thời hạn; không bảo đảm an toàn toàn địa điểm. |
| Dòng 11 — PostReader/VIP | Phân biệt public excerpt với phần nội dung theo entitlement. Ghi đề xuất projection/cache riêng cho BE; không đề xuất gửi toàn bộ nội dung hạn chế cho Guest rồi chỉ làm mờ bằng CSS. Đây là yêu cầu bàn giao, chưa phải phát hiện rò rỉ BE thật. |
| Dòng 14 — Report | Bổ sung `userId` từ phiên và `revisionId`; `claimId` tùy chọn phải thuộc revision. Tạo `reportId` khi gửi hợp lệ; evidence/media theo nguồn. Không tạo case chỉ vì mở/gửi report. |
| Dòng 15/18 — Payment/VIP | Tách điều kiện tạo intent khỏi mở modal. PROJECT/POST_TIP chốt ý định mới dùng `donationId`; đơn VIP mới dùng `paymentId`, tạo/lấy `membershipId` đúng user/plan. Mở/đóng modal hoặc retry không mặc định tạo khoản mới. |
| Dòng 16/23 — Wallet/Binding | Ghi đúng nguồn demo đang dùng. Connect/read balance không tạo `walletBindingId`; chỉ proof hợp lệ và liên kết mới mới tạo binding. Tải Account chỉ đọc lại. |
| Dòng 18 — Gia hạn VIP | Đánh dấu quy tắc đã chốt: cùng membership, payment mới, cộng 12 tháng lịch từ `max(confirmedAt, hạn cũ)`. Bỏ câu hỏi xin chốt lại việc cộng thời gian. |
| Dòng 19–20 — Contribute | Tách tải danh sách places/nháp cục bộ khỏi tạo hồ sơ. Theo Registry, `postId` khi lưu nháp nghiệp vụ đầu tiên; snapshot được gửi/freeze có `revisionId` và claims tương ứng. Demo phải ghi rõ event mô phỏng. Không cấp ID chuẩn chỉ vì tải trang hoặc gõ một ký tự. |
| Dòng 28–30 — Experts | Dùng `userId`/`assigneeUserId`/`payeeUserId` theo quan hệ. Nếu code đang dùng `expertUserId`, ghi đây là FK alias của `userId`, không tự thêm một hệ định danh chuyên gia. |
| Dòng 30 — Payables | Xem danh sách dùng lại `payableId`, không sinh công nợ mới. Truy ngược `payableId → acceptanceId → taskId`. |
| Dòng 31–32 — Intake/Compare | `intakeId` không có trong Registry. Hàng đợi dùng reference có kiểu tới hồ sơ nguồn (place/post/revision/report). UI row key không trở thành ID nghiệp vụ. Không ép mọi hồ sơ chưa review phải có `reviewCaseId`. |
| Dòng 33 — Assign | Chuẩn hóa `caseId` thành `reviewCaseId` trong hợp đồng bàn giao; case khóa đúng revision/scope. Vòng mới tạo case; reserve đủ rồi tạo `taskId` + `reservationId` cùng nghiệp vụ offer. Retry cùng offer giữ ID. |
| Dòng 34 — WorkAccept | Input gồm `taskId`, `submissionId`, người nghiệm thu có quyền. `ACCEPTED_WORK` tạo `acceptanceId` + `payableId` nguyên tử, đúng một lần. `NEEDS_MORE`/`REJECTED_WORK` không tạo payable mới. |
| Dòng 35 — ContentDecide | Dùng `reviewCaseId`, revision/scope và người quyết định. Tạo `decisionId` khi kết thúc case; không dùng trạng thái quyết định bài để xóa nghĩa vụ trả công đã ghi. |
| Dòng 38 — Ledger | Reference theo loại nghiệp vụ: donate/tip dùng `donationId` khi có intent; VIP dùng `paymentId`; chi dùng `payoutId`, nguồn khác dùng ID tương ứng. Receipt identity là khóa ghép theo chain/contract/receipt, không tạo `receiptId` toàn cục hoặc bịa intent cho direct-chain. |

Không tìm/thay tên ID mù quáng trong dữ liệu đang lưu. Nếu demo fixture/view model cần sửa, giữ references nhất quán và xử lý phiên bản demo storage theo quy ước repo; không xóa mọi dữ liệu trình duyệt để né lỗi. Những thay đổi production schema/API để trong handoff, không triển khai BE ở đây.

#### 5.3. Đồng bộ trang tài liệu và file tải về

- `/[locale]/data-map/` và `/docs/FE_DATA_MAP.md` phải sinh từ cùng nguồn hoặc có cách kiểm tra nhất quán. Không để trang sửa rồi file tải về vẫn cũ.
- Version, ngày, số nhóm/component/quyết định phải phản ánh dữ liệu thật; không hard-code con số cũ.
- Tách rõ “đã chốt” với “cần Bin quyết định”. Không mở lại lựa chọn đã có trong nguồn, không khẳng định toàn bộ tài liệu tuân thủ Registry trước khi đối soát.
- Những policy thật sự còn thiếu chỉ ghi đề xuất và tác động. Không triển khai giảm giá, token thanh toán mới, quyền mới hoặc thay mô hình nội dung để lấp chỗ trống.

Nghiệm thu: kiểm từng dòng map với component/adapter, đặc biệt lifecycle ID; tải file `.md` và đối chiếu với trang. Bảng đọc được trên mobile trong vùng cuộn riêng, không kéo ngang toàn trang.

### 6. FE-12-04 — Làm rõ thông điệp và trạng thái demo

**Ưu tiên P1 cho câu chữ “xác nhận an toàn”; P2 cho nội dung kỹ thuật dư thừa.**

Form điểm mới đang diễn đạt chỉ công khai sau khi chuyên gia “xác nhận an toàn”. Thay bằng nội dung tương đương:

> Hồ sơ được công khai sau khi xét duyệt. Kết quả kiểm định, nếu có, thể hiện rõ phạm vi, thời điểm và các cảnh báo liên quan.

Việc công khai theo gate đã chốt trong nguồn; câu chữ không tự ép mọi nội dung công khai phải VERIFIED. Luôn phân biệt xét duyệt/công khai với kết quả kiểm định.

Rà các thay đổi sau trong cả sáu locale:

| Cách diễn đạt đang gặp | Hướng sửa |
| --- | --- |
| “Nhãn an toàn” hoặc bảo đảm an toàn chung | “Kết quả kiểm định”, kèm phạm vi/thời điểm/hạn và cảnh báo |
| `postId DISCOVERY`, UUIDv7, “Canonical User”, “Bất biến kiến trúc” trong hướng dẫn người dùng | Copy theo tác vụ; chuyển giải thích implementation vào Data Map/tài liệu reviewer |
| Công thức chia tiền nguyên tử trong modal | Giao diện chính hiển thị số tiền và tỷ lệ 80/20 rõ; chi tiết kỹ thuật đặt ở tài liệu phù hợp |
| NFT “đại diện cho bài viết đầu tiên” | Diễn đạt đúng: NFT ghi nhận bài đủ điều kiện, tối đa một NFT cho mỗi bài theo nguồn |
| Ví/số dư mẫu, “Đã xác minh chữ ký” trong demo | Gắn nhãn mô phỏng ngay tại khối; không làm người dùng tưởng ví thật đã ký |

Giữ thông tin giúp người dùng ra quyết định: đang ủng hộ ai, bài/phiên bản nào, số tiền/phân bổ, quyền lợi đang thiếu điều kiện gì. Không giấu lý do chặn hoặc xóa dữ liệu kiểm định để giao diện trông đơn giản hơn.

### 7. FE-12-05 — Review Toolbar, lớp nổi và responsive

**Ưu tiên P2, nâng lên P1 nếu che hành động chính. Finding đã xác nhận:** huy hiệu Netlify đè vùng phải Review Toolbar; bấm vị trí này đã mở popup Netlify thay vì thanh review.

Yêu cầu:

- Dời Review Toolbar sang vùng không xung đột hoặc dùng panel/drawer gọn. Kiểm cả vị trí thu gọn và mở rộng; không sửa bằng z-index cực lớn che modal/nút khác.
- Cấu hình review mode rõ ràng: môi trường demo phục vụ Bin vẫn bật được; bản public production tương lai tắt theo cấu hình repo. Không vô hiệu hóa bộ scenario mà Bin đang cần nghiệm thu.
- Data Map và shortcut kỹ thuật nằm trong khu dành cho reviewer hoặc vị trí được thiết kế cho tài liệu; người dùng công khai không cần đọc implementation để hoàn thành tác vụ.
- Không tự sửa tài khoản hosting hoặc gỡ huy hiệu bằng thao tác ngoài FE; xử lý bố cục trong phạm vi repo.
- Kiểm 1440px, 1366px, 390px và 430px; thêm 320px smoke test nếu layout hiện tại hỗ trợ. Kiểm Guest, tên dài/Admin và nhãn dài.
- Header không chồng chữ; menu/drawer vẫn truy cập được. Modal có vùng nội dung cuộn và CTA nhìn thấy, dùng được khi bàn phím mở; xét safe-area nếu có nút cố định.
- Form có label và lỗi gắn trường; thao tác bàn phím có focus nhìn thấy. Modal đóng bằng Escape, giữ focus trong modal và trả focus về nút mở theo component hiện có.
- Giữ palette, typography, logo và hero đã chốt. Không thêm section Home hoặc trang trí lớn ngoài mục tiêu sửa lỗi.

Nghiệm thu: bấm toàn vùng nút review không mở nhầm Netlify; modal và CTA không bị lớp nổi che; không có cuộn ngang ngoài vùng bảng/map được thiết kế riêng.

## C. Kiểm tra, ghi nhận và bàn giao

### 1. Thứ tự thực hiện

1. Kiểm repo và baseline; phân loại finding.
2. Sửa Account/query/return context, kiểm hồi quy Contribute và revision.
3. Hoàn thiện i18n và chỉnh copy liên quan.
4. Đối soát Data Map, sửa view models/demo lifecycle nếu thực sự sai, cập nhật handoff.
5. Sửa toolbar/responsive/accessibility ở vùng bị tác động.
6. Chạy kiểm tra liên quan, cập nhật tài liệu và bàn giao URL local/preview thực tế.

Không làm lại phần `ALREADY_FIXED`. Nếu lỗi mới cùng phạm vi xuất hiện, ghi cách tái hiện và sửa nguyên nhân; không mở rộng sang BE/Chain.

### 2. Ma trận nghiệm thu

| Mã | Hành trình | Kết quả cần đạt |
| --- | --- | --- |
| QA-01 | Account benefits → profile → contributions → Back/Forward/reload/locale | URL, tab active và nội dung luôn khớp; query sai có fallback |
| QA-02 | Guest soạn điểm mới → đăng nhập demo → trở lại | Giữ locale, candidate tab và nháp phù hợp; không lấy nháp user khác |
| QA-03 | Contribute existing/candidate → đổi locale → reload | Đúng form, query, nháp và bản dịch |
| QA-04 | Bài Cát Cò 3 đổi REV-000002 ↔ REV-000003 | Nội dung/claims/nhãn/report/tip đúng revision không cần reload |
| QA-05 | Tip revision cần chỉnh sửa | Lý do rõ; không tạo khoản tip demo thành công |
| QA-06 | PROJECT, POST_TIP, MEMBERSHIP từ ba điểm vào | Đúng mode/người nhận; Guest không tạo/hoàn tất đơn VIP; không tự chọn bài mẫu |
| QA-07 | Member mua/gia hạn VIP demo, mở lại pending, retry | Quyền đúng user; pending chưa cấp kỳ; retry không nhân đơn/kỳ; gia hạn giữ thời gian còn lại |
| QA-08 | Tài khoản 0 bài đủ điều kiện / tài khoản có bài | Gate riêng cho nhãn/SBT/NFT/tip; không có quyền claim mặc định sai |
| QA-09 | Guest vào trực tiếp Expert/Admin | Không thấy dữ liệu/thao tác riêng; demo adapter từ chối mutation trái quyền |
| QA-10 | Sửa tên/bio demo → lưu → reload → đổi tài khoản | Lưu đúng tài khoản, hiển thị nhất quán; không sửa `userId` hoặc role |
| QA-11 | Expert nộp → Admin công đạt nhưng bài bị bác → xem Payables | Tách hai quyết định; payable giữ nguyên khi đọc lại/retry, không nhân khoản phải trả |
| QA-12 | Đổi sáu locale tại các màn hình sửa | Không còn UI rơi về tiếng Việt/key thô; nhãn không tràn; context giữ nguyên |
| QA-13 | Data Map trang và file tải | Cùng nội dung/version; đúng component, nguồn, ID và event tạo/dùng lại |
| QA-14 | Desktop/mobile, menu/modal/toolbar, bàn phím | Không chồng lấn/che CTA/mở nhầm; focus và form labels hoạt động |
| QA-15 | Gửi bài demo → Đóng góp của tôi → xem phản hồi | Dữ liệu liên kết theo đúng user/post/revision; không chỉ báo thành công cục bộ ở form |

Bài tham chiếu vòng review:

```text
postId:       018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10
REV-000002:   018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e12
REV-000003:   018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e13
```

Nếu fixture hiện tại đổi ID, dùng bản tương đương và ghi rõ mapping; không ép ID của screenshot vào dữ liệu thật.

Chạy lint/typecheck/build và các test liên quan theo scripts repo. Tập trung test tự động vào hành vi có nguy cơ hồi quy: navigation/query, context locale, gate/mutation, ID không bị tạo trùng. Copy/CSS đơn giản có thể nghiệm thu trực tiếp bằng trình duyệt; không viết hàng loạt test chỉ lặp lại implementation. Khi đủ bằng chứng, dừng kiểm tra lặp không cần thiết.

QA dùng `PASS`, `FAIL`, `BLOCKED`, `NOT_TESTED` kèm môi trường, persona/locale, các bước và kết quả. Không chuyển `NOT_TESTED` thành `PASS` vì build thành công hoặc có nút scenario. Demo không được báo là đã tích hợp OAuth/BE/Chain.

### 3. Tài liệu và kết quả phải giao

Cập nhật file hiện có thay vì tạo các bản báo cáo trùng nhau. Nếu chưa có quy ước, dùng thư mục `docs/`:

- `FE_QA.md`: finding v1.2, các mục hồi quy, kết quả và bằng chứng ngắn. Screenshot cần thể hiện đúng trạng thái đã kiểm.
- `FE_DATA_MAP.md`: map đã đối soát, cùng nguồn với trang xem/tải; rõ dữ liệu tĩnh, demo, nguồn tương lai, IDs và lifecycle.
- `FE_HANDOFF.md`: interface/view model thực tế, delta đề xuất cho BE/Chain, capability/reasonCodes và phần chưa tích hợp. Không bịa endpoint/ABI đã tồn tại.
- `FE_REVIEW.md`: lệnh chạy, URL thật, cách mở review mode/persona và các bước Bin nghiệm thu.
- `FE_COVERAGE.md` nếu đã có: cập nhật phần đã kiểm; không ghi hoàn thành toàn bộ Masterboard chỉ từ 15 QA trên.

Báo cáo cuối bằng tiếng Việt, ngắn và cụ thể:

```text
1. Đã sửa: finding → component/file → hành vi mới.
2. Đã giữ đúng: kết quả hồi quy quan trọng từ v1.1.
3. Kiểm tra: lệnh và kết quả; locale/viewport/persona thực sự đã xem.
4. Data Map: những dòng/lifecycle đã sửa; quyết định thật sự còn thiếu.
5. Cách Bin xem: URL local/preview có thật và bước thử ngắn.
6. Giới hạn: demo nào đang mô phỏng, test nào chưa chạy, phần chờ tích hợp.
7. Git: branch/checkpoint và thay đổi do lượt này thực hiện.
```

Nếu quy trình repo cho phép, tạo commit checkpoint chỉ cho thay đổi thuộc lượt này. Không reset code có sẵn, không commit credentials, không tự push/merge/deploy production. Chuẩn bị diff và bản chạy để Bin review là kết quả cuối của đợt FE.

**Bắt đầu kiểm repo/baseline, rồi thực hiện tuần tự đến bản FE có thể nghiệm thu.**

## D. Checklist ngắn để Bin xem kết quả

- [ ] Đổi tab Tài khoản làm URL đổi đúng; tải lại/đổi tiếng Anh vẫn đúng tab.
- [ ] Form đóng góp, tài khoản và hộp VIP ở EN đã dịch đủ.
- [ ] Bốn ngôn ngữ còn lại không có key thô, chữ tràn hoặc UI tiếng Việt sót.
- [ ] Revision bài vẫn đổi ngay; bản cần sửa vẫn bị chặn tip có lý do.
- [ ] Guest không mua VIP demo thành công; người hưởng VIP là đúng tài khoản.
- [ ] SBT/NFT/tip vẫn khóa đúng khi chưa đủ điều kiện.
- [ ] Không còn câu “xác nhận an toàn” mang nghĩa bảo đảm chung cả địa điểm.
- [ ] Review Toolbar không bị Netlify che; điện thoại đọc và thao tác được.
- [ ] Data Map và file `.md` tải xuống khớp nhau, không sinh ID khi chỉ xem dữ liệu.
- [ ] Agent cung cấp URL bản đã chạy, kết quả kiểm tra và phần chưa hoàn tất rõ ràng.

Nếu cần sửa tiếp, gửi finding cụ thể và dùng lệnh:

```text
Tiếp tục từ checkpoint FE v1.2 hiện tại.
Tái hiện các mục chưa đạt tôi vừa ghi, sửa đúng phạm vi FE,
kiểm hồi quy phần liên quan và cập nhật FE_QA/FE_DATA_MAP nếu bị tác động.
Giữ các phần đã đạt; bàn giao bản local/preview thực tế để tôi nghiệm thu.
```
