# Ventlore — Hướng dẫn Antigravity sửa và nghiệm thu FE v1.1

Ngày: 26/09/2026, giờ Việt Nam.

Mục tiêu: sửa các lỗi quan sát trên bản deploy Ventlore, hoàn thiện trải nghiệm demo để Bin nghiệm thu FE trước khi triển khai BE. Đây là bản bổ sung sau kiểm tra web cho `Ventlore_Prompt_FE_First_v1_0.md`; giữ những yêu cầu trong v1.0 không mâu thuẫn với bản này.

## A. Bin thao tác như sau

1. Mở trong Antigravity đúng workspace/worktree FE đã dùng để làm Ventlore. Nếu đang chia FE, BE và Chain thành các cửa sổ riêng, dùng cửa sổ FE.
2. Đưa file này vào repository, tại thư mục tài liệu prompt đang dùng. Nếu chưa có quy ước, có thể đặt tại `docs/prompts/Ventlore_Antigravity_FE_Fix_v1_1.md`. Đây là đường dẫn đề xuất, không phải khẳng định repo hiện có thư mục đó.
3. Giữ bản `Ventlore_Prompt_FE_First_v1_0.md` và các Sources hiện có để agent tham chiếu. Bản này đã ghi đủ các lỗi và yêu cầu sửa chính.
4. Mở một cuộc trao đổi trong cửa sổ FE, đính kèm hoặc nhắc đúng file vừa thêm, rồi dán lệnh khởi động dưới đây.
5. Khi agent báo xong, mở địa chỉ local/preview mà agent thực sự khởi động và làm checklist ở phần C. Bản local chưa tự cập nhật lên `ventlore.com`; đưa thay đổi lên Git/Netlify theo quy trình phát hành hiện có sau khi nghiệm thu.

### Lệnh khởi động — dán nguyên đoạn này

```text
Đọc và thực hiện toàn bộ phần B — PROMPT TRIỂN KHAI trong file
Ventlore_Antigravity_FE_Fix_v1_1.md tôi vừa cung cấp.

Tiếp tục sửa trực tiếp Front-end Ventlore hiện có, kế thừa
Ventlore_Prompt_FE_First_v1_0.md; không dựng lại website từ đầu.

Tái hiện và sửa P0 trước: đổi revision không đổi nội dung và Guest
hoàn tất mua VIP demo. Sau đó sửa header, i18n, tab/return context,
payment context, quyền demo và các trạng thái quyền lợi.

Chỉ làm FE và demo adapter/store. Giữ BE và Chain ngoài phạm vi.
Làm lần lượt đến khi có bản local/preview review được, kiểm tra trình duyệt,
cập nhật QA và FE_DATA_MAP. Tiếp tục các bước độc lập, không dừng ở kế hoạch
hoặc hỏi lại cho từng chỉnh sửa FE thông thường.

Bắt đầu bằng kiểm tra repository, branch, thay đổi đang có và baseline.
Không tự merge, push hoặc deploy production trong lượt này.
```

---

## B. PROMPT TRIỂN KHAI — giao cho Antigravity

Bạn phụ trách sửa Front-end Ventlore trong repository đang mở. Hoàn thành công việc trực tiếp trên code, chạy ứng dụng, kiểm tra những hành trình liên quan và bàn giao kết quả để chủ dự án nghiệm thu.

### 1. Phạm vi và nguồn chuẩn

Trình tự dự án: **hoàn thiện FE → review hành trình → chốt dữ liệu theo component → triển khai BE → tích hợp Chain**. Demo chưa kết nối dịch vụ thật là trạng thái hợp lệ của đợt này; demo vẫn phải phản ánh đúng quy tắc nghiệp vụ.

Nguồn đối chiếu:

1. Bản hướng dẫn sửa v1.1 này và yêu cầu hiện tại của chủ dự án.
2. `Ventlore_Prompt_FE_First_v1_0.md`.
3. `Ventlore_Journeys_FE_BE_Chain_Masterboard_v1_1.pdf`, Wallet Architecture v1.1 nếu có.
4. ID Registry v0.3, Logic ID DB v0.3, Event UI Spec và Wireframes v0.3.
5. Brand Guide v0.1, component và design tokens đang có.

Quy tắc đã chốt:

- Users: Guest, Member, VIP_member. Operators: Experts, Admin. Tác giả là người sở hữu bài; không tạo role AUTHOR. Hướng dẫn viên/kiểm lâm có thể là bio.
- Một tài khoản dùng cùng `userId`. VIP thuộc tài khoản; ví tham gia thanh toán, không thay tài khoản đăng nhập VIP.
- Donate quỹ: 100% vào quỹ. Tip bài: 80% tác giả, 20% quỹ. Mua VIP là nghiệp vụ riêng, không cấp VIP từ donate.
- Nhãn kiểm định và điều kiện tip gắn đúng phiên bản nội dung; không lấy trạng thái của bản cũ cho bản mới.
- Nhãn, SBT, NFT và nhận tip có điều kiện/trạng thái riêng. Thiếu ví không làm mất công nhận nội dung.
- Nghiệm thu công chuyên gia tách biệt quyết định nội dung; công đạt vẫn được ghi nhận phải trả dù bài bị bác.
- Các policy chưa chốt trong nguồn phải ghi là đề xuất; không tự thêm quyết định kinh doanh.

Được sửa: page/layout/component, CSS, i18n, FE types/view models, adapters, fixtures, demo store, kiểm thử FE và tài liệu FE.

Giữ ngoài phạm vi: API server, database/migration, auth server, listener/indexer, smart contract, ABI, signer service, ví riêng, embedded wallet, swap/bridge/on-ramp. Không nâng toàn bộ framework hoặc đổi wallet kit chỉ để sửa giao diện.

Không yêu cầu ký thật, approve/permit, gửi giao dịch hoặc chuyển tiền để kiểm tra. Demo mutation không được gọi phương thức ký/gửi của provider thật. Không bịa credentials hoặc địa chỉ triển khai.

### 2. Kiểm tra trước khi sửa

- Đọc `AGENTS.md`, README, package/lockfile, scripts, router, cấu trúc i18n, adapter và store. Nếu có `docs/parallel/WORKSPACES.md`/OWNERSHIP, đối chiếu phạm vi FE.
- Kiểm tra thư mục gốc, branch, `git status` và các thay đổi chưa commit. Không reset, checkout đè hoặc gom thay đổi của người khác vào commit.
- Dùng branch/worktree FE hiện tại nếu đúng. Nếu đang ở branch dùng chung, chuẩn bị branch sửa riêng theo quy trình repo; không tự chuyển workspace BE/CHAIN thành FE.
- Chạy ứng dụng bằng lệnh có trong repo. Ghi lệnh và địa chỉ thực tế; không mặc định port 3000 hoặc tên package manager.
- Chụp baseline và tái hiện từng finding. Bản deploy có thể khác code hiện tại: phân loại CONFIRMED / ALREADY_FIXED / NOT_REPRODUCED / BLOCKED, kèm bằng chứng ngắn. Finding đã sửa thì xác nhận hồi quy, không sửa lại vô ích.

Các quan sát dưới đây có được từ trình duyệt ngày 26/09/2026; chưa phải kết luận về implementation hoặc bảo mật server. Kiểm tra trạng thái sau khi UI tải ổn định để tránh ghi nhận nhầm trạng thái trung gian.

### 3. P0-01 — Đổi revision phải đổi toàn bộ nội dung liên quan

**Đã quan sát:** mở bài Cát Cò 3, mở lịch sử, chọn REV-000003. Query `revisionId` đổi nhưng nội dung/nhãn vẫn là REV-000002. Reload mới hiện đúng. Chiều ngược lại cũng tái hiện.

Mẫu dữ liệu đã kiểm tra:

```text
postId:       018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10
REV-000002:   018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e12
REV-000003:   018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e13
```

Link tham chiếu: `https://ventlore.com/vi/posts/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10/`.

**Cách sửa:**

- Xác định nguồn sự thật của revision đang xem theo router/query và adapter hiện có. Rà việc chỉ đọc query một lần, cache thiếu revision, props/state không cập nhật hoặc bất đồng bộ trả dữ liệu cũ. Đây là các điểm cần kiểm tra, chưa phải nguyên nhân đã được xác nhận.
- Khi chọn bản khác, cập nhật đồng bộ tiêu đề, nội dung, ngày quan sát, claims, media/nguồn, trạng thái/phạm vi/hạn kiểm định, mục “Đang xem”, report context và tip context.
- Khi bản mới chưa tải xong, hiển thị trạng thái chờ rõ và chặn thao tác phụ thuộc; không ghép nội dung cũ với ID mới. Bỏ qua phản hồi cũ đến muộn.
- Back/Forward, deep link, reload và đổi ngôn ngữ giữ đúng revision. ID không tồn tại hoặc không thuộc bài phải có trạng thái rõ, không im lặng dùng nhãn của bản mặc định.
- Nếu modal tip/report đang mở khi ngữ cảnh bài đổi, đóng hoặc yêu cầu xem lại ngữ cảnh theo thiết kế nhất quán; không tiếp tục bằng ID cũ.

**Nghiệm thu:** chuyển REV-000002 ↔ REV-000003 không cần reload; bản “Cần chỉnh sửa” không dùng nhãn/route đã duyệt của bản trước. Có kiểm thử hành vi cho query navigation và một trường hợp đổi bản nhanh khi tải chậm.

### 4. P0-02 — Guest không được tạo đơn hoặc hoàn tất mua VIP

**Đã quan sát:** giữ persona Guest → mở “Ủng hộ quỹ” → chọn tab “Gói VIP” trong modal → người hưởng là `guest_reader` → bấm “Thử thanh toán (demo)” → màn hình báo mở khóa VIP 12 tháng. Sau đóng modal header vẫn là Guest. Đây là thông báo thành công sai trong demo; chưa xác nhận có quyền VIP thực được cấp.

**Cách sửa:**

- Cho Guest xem giá; khi muốn mua, CTA chuyển thành đăng nhập. Giữ locale, plan, trang và ý định đang thực hiện để tiếp tục sau đăng nhập.
- Chỉ lập đơn khi có tài khoản hợp lệ. Không dùng `guest_reader`, một UUID Guest mẫu hoặc địa chỉ ví thay `userId`.
- Kiểm điều kiện ở cả UI và demo adapter/store, gồm bước bắt đầu và bước hoàn tất. Không chỉ ẩn một nút ở trang VIP vì modal có nhiều điểm mở.
- Guest bị chặn thì không tạo membership/payment hoặc ghi doanh thu VIP trong demo ledger, không báo thành công.
- Với Member, đơn gắn cố định tài khoản nhận quyền. Pending chưa cấp VIP. Finalized demo chỉ cấp entitlement demo cho tài khoản của đơn, không lấy tài khoản vừa chuyển sang để cấp nhầm.
- Khi đổi user trong lúc thanh toán demo đang chờ, giữ chủ đơn cũ, làm mới dữ liệu riêng của user hiện tại và trình bày kết quả phù hợp; không chuyển đơn/quyền giữa tài khoản.
- Đổi ví không đổi người hưởng VIP. Đăng nhập lại cùng tài khoản VIP không cần kết nối ví để đọc.
- Gia hạn dùng cùng `membershipId`, đơn mới có `paymentId` mới; không mất thời gian còn lại. Quy tắc kỳ 12 tháng theo nguồn chuẩn.

**Nghiệm thu:** mọi điểm vào MEMBERSHIP chặn Guest nhất quán; Member đi được từ pending đến finalized demo; Guest và tài khoản khác không nhận quyền; PROJECT/POST_TIP không cấp VIP.

### 5. P1-01 — Header không chồng lấn ở mọi persona

**Đã quan sát:** menu, chuyển ngôn ngữ, persona và tài khoản chồng chữ trên desktop; nặng hơn khi có menu Admin/Experts. Ảnh do Bin gửi cũng có lỗi này.

- Giữ logo, chuyển ngữ và các hành động chính dễ thấy. Gom mục ít dùng và khu vận hành vào menu phù hợp.
- Chuyển chọn persona và controls thử nghiệm sang review panel riêng; tránh đồng thời duy trì hai bộ chọn persona trên header và toolbar.
- Chọn breakpoint theo không gian thực; header thiếu chỗ phải chuyển sang menu gọn. Tên dài được rút gọn hợp lý nhưng vẫn truy cập được tên đầy đủ.
- Không giải quyết bằng cách giảm toàn bộ chữ xuống quá nhỏ, che menu hoặc để các lớp nút đè nhau.
- Home vẫn một hero và đúng hai CTA. Không thêm thanh điều hướng đầy đủ hoặc các section dưới hero.
- Modal/drawer không nằm sau header, không bị toolbar/badge nổi che CTA. Đóng menu trước khi mở modal; kiểm focus và phím Escape.

**Nghiệm thu:** kiểm 1440px, 1366px, 390px, 430px; Guest, Member, VIP, Experts, Admin; tên dài và nhãn tiếng Pháp/CJK. Không chồng chữ, không cuộn ngang toàn trang.

### 6. P1-02 — Dịch đủ màn hình mới và giữ ngữ cảnh

**Đã quan sát:** `/en/contribute/` vẫn hiện form tiếng Việt; `/en/account/` còn tab, nội dung và hướng dẫn tiếng Việt; menu mới như Đóng góp/Tài khoản/Ủng hộ quỹ cũng chưa dịch. Hồ sơ mẫu `minh_trailguide` đã dịch bio và bài VI→EN đúng, cần giữ kết quả này.

- Đưa copy mới vào hệ i18n hiện có: menu, editor, validation, empty/error, payment, account/benefits, Experts/Admin, trạng thái và aria-label.
- Kiểm sáu locale theo mã đang dùng trong repo. Không tự tạo mã JP/CN/KR mới nếu repo dùng ja/zh/ko hoặc quy ước khác.
- Tên riêng/handle không cần dịch máy; bio và nội dung fixture dùng bản dịch hoặc fallback có nhãn theo v1.0.
- Đổi locale giữ entity ID, revision, bộ lọc, tab, return context, nháp và giá trị tiền. Không reset về Home hoặc tự mở lại ví.

**Nghiệm thu:** VI/EN cho luồng chính; rà cả bốn locale còn lại để bắt text chưa dịch, key thô, glyph và tràn chữ. Chỉ ghi PASS cho phạm vi đã thực sự kiểm.

### 7. P1-03 — Đồng bộ tab đóng góp, nháp và return context

**Đã quan sát:** tại `/vi/contribute/?tab=existing`, bấm “Đề xuất điểm mới” đổi form nhưng URL vẫn `tab=existing`; đổi ngôn ngữ lại về tab cũ. Một số link đăng nhập chưa giữ query đầy đủ. Nháp tiêu đề đã khôi phục được sau reload trong bước thử, không được làm mất tính năng này.

- Xác định tên query cho hai tab theo repo và đồng bộ hai chiều UI ↔ URL. Giá trị không hợp lệ có fallback rõ.
- Duy trì các query có liên quan khi đổi tab/locale; Back/Forward phải khớp form đang xem.
- Return URL giữ locale, tab, bài/điểm/revision và ý định cần tiếp tục; kiểm URL nội bộ an toàn.
- Nháp của hai loại form không ghi đè nhau. Namespace theo người dùng/ngữ cảnh và môi trường demo; đổi tài khoản không lộ nháp riêng của người trước.
- Guest có thể soạn nháp cục bộ nếu đang hỗ trợ. Đăng nhập tiếp tục đúng nháp; chỉ chuyển nháp Guest sang tài khoản theo quy tắc rõ, không nhập nhầm nháp user khác.
- Giữ nội dung khi validation lỗi, khi mô phỏng xung đột và khi quay lại từ đăng nhập. Media demo dùng đúng cơ chế hiện có; ghi rõ giới hạn lưu cục bộ.
- Rà form điểm mới theo v1.0: vị trí, vùng/hoạt động, quan sát/rủi ro, bằng chứng và gợi ý điểm trùng. Chỉ đánh dấu thiếu sau khi kiểm code và hành vi. Không auto-merge vì gần tọa độ.

**Nghiệm thu:** đi qua hai tab → nhập nháp khác nhau → đổi locale → reload → Back/Forward → đăng nhập demo; đúng tab và đúng nháp, không lẫn tài khoản.

### 8. P1-04 — PaymentModal có ngữ cảnh chính xác

**Đã quan sát:** mở donate quỹ rồi đổi tab tip có thể tự hiện tác giả Minh và bài mẫu không do người dùng chọn. Wallet demo hiển thị sẵn kết nối/số dư. Khi mở tip từ bài, modal có lúc hiện tên quỹ ở trạng thái đầu rồi mới cập nhật đúng tác giả; không được kết luận đây là giao dịch đã chuyển nhầm tiền.

- Mỗi điểm vào mở đúng mode: Home/nav → PROJECT; bài → POST_TIP; mua/gia hạn VIP → MEMBERSHIP.
- Không dùng các tab chuyển mode thử nghiệm làm điều hướng thanh toán mặc định cho người dùng. Đưa controls thử mode vào review panel. Nếu giữ lựa chọn đổi mục đích, phải yêu cầu ngữ cảnh hợp lệ mới và xóa đích/ID không phù hợp.
- POST_TIP cần post/revision/author/route/gate đúng. Không có bài thì hướng dẫn chọn bài; không lấy mặc định tác giả đầu danh sách.
- Khởi tạo mode và context cùng lúc hoặc hiển thị skeleton trung tính; tránh nháy sang người hưởng khác.
- Tip chưa eligible phải giải thích và chặn CTA ngay. Giữ kiểm tra ở adapter khi submit để xử lý tình huống gate thay đổi.
- Giữ hành vi đã đúng: bản “Cần chỉnh sửa” hiện bị adapter chặn khi submit. Cải thiện cách biểu thị trước khi bấm; không mô tả đây là lỗi đã nhận tiền trái điều kiện.
- Không tự chuyển tip không hợp lệ thành donate quỹ. Người dùng phải chủ động chọn mục đích mới.
- Ví/số dư mẫu phải rõ là mô phỏng. Có scenario chưa kết nối, sai mạng, chưa đọc được số dư, thiếu token/gas, hủy và unknown. Lỗi đọc số dư không hiện thành 0.
- Mở lại intent đang chờ phải theo dõi cùng ý định; không tạo khoản mới chỉ vì đóng modal/timeout. Double click không tạo hai thanh toán demo.
- Tiền dùng chuỗi/atomic units; POST_TIP: quỹ = floor(amount/5), tác giả = phần còn lại. MEMBERSHIP có giá USD, quote token có nhãn demo; không mặc định mọi asset luôn ngang USD.
- Bỏ txHash giả và explorer link giả khỏi kết quả. Dùng “Mã giao dịch mô phỏng” cho ID demo, “Chưa có giao dịch blockchain thật”. Không thêm `receiptId` toàn cục vào Registry chỉ vì cần một dòng UI.

**Nghiệm thu:** ba mode không lẫn đích/ID/tỷ lệ; kết quả ghi rõ mô phỏng; mode không hợp lệ không tạo dòng ledger hoặc cấp quyền.

### 9. P1-05 — Khu Experts/Admin phản ánh đúng quyền demo

**Đã quan sát:** Guest đi từ Home tới `/vi/expert/` thấy bốn task, tiền công và nút nhận/nộp đang bật. Chưa thử chứng minh mutation Guest thành công; không gọi đây là lỗi bảo mật BE đã xác nhận.

- Guest thấy giới thiệu kiểm định, cách đăng nhập/đăng ký quan tâm hoặc lời mời phù hợp. Member chưa có role không tự thành Expert từ bio/VIP/SBT.
- Expert thấy task được phép theo assignee, scope và hạn; giữ blind-review projection. Lời mời role khác lời mời nhận task.
- Admin workspace áp dụng capability theo nhiệm vụ. Không mặc định mọi Admin có mọi quyền Expert hoặc mọi quyền ký chain.
- Chặn quyền ở route/component và demo adapter/mutation. Nhập URL trực tiếp cũng phải có màn hình phù hợp; ID tự nó không cấp quyền.
- Đổi persona làm mới cache dữ liệu riêng; controls review không cấp quyền thật hoặc gọi API riêng bằng role giả.
- Không yêu cầu ví để Expert nhận/làm/nộp công. Nghiệm thu công vẫn tách quyết định nội dung và trạng thái thanh toán.

**Nghiệm thu:** Guest/Member không thấy task riêng hay thao tác vận hành; Experts/Admin dùng được phần đúng quyền; hành trình “công đạt, bài bị bác” vẫn tạo nghĩa vụ công demo đúng một lần.

### 10. P2 — Copy, quyền lợi và tính nhất quán dữ liệu

#### 10.1. Copy dành cho người sử dụng

Các chuỗi kỹ thuật đang xuất hiện trực tiếp: `placeId`, `payableId`, `REVIEW_ONLY`, “Canonical User”, “UUIDv7”, công thức chia token, “Bất biến kiến trúc”, nút thử lỗi 409. Chuyển vào review/debug panel hoặc chi tiết kỹ thuật khi thật sự hữu ích.

Gợi ý copy để áp dụng nhất quán và dịch sang các locale:

| Đang thể hiện | Copy gợi ý |
| --- | --- |
| Soạn thảo và Gửi Đóng Góp | Chia sẻ trải nghiệm của bạn |
| Nhận định kiểm chứng (Verifiable Claims) | Những điều bạn trực tiếp quan sát |
| Candidate Place / REVIEW_ONLY | Địa điểm mới đang chờ xem xét |
| Route nhận tip | Thiết lập nhận ủng hộ |
| Công Phải Nhận / payables | Tiền công của tôi |
| Canonical User | Thông tin tài khoản |
| Chưa đủ điều kiện tip | Chưa thể nhận ủng hộ — kèm lý do cụ thể |

Không bỏ các dữ liệu nghiệp vụ cần thiết khi làm đơn giản ngôn ngữ. Form ưu tiên bước người dùng hiểu: chọn điểm → chia sẻ trải nghiệm → thêm quan sát/bằng chứng → xem trước → gửi. Giữ trạng thái đã lưu nháp rõ.

Giảm việc dùng “trắc địa”, “địa chất”, “bảo tồn” như mô tả mặc định toàn Ventlore. Nội dung cần bao quát khám phá ngoài trời, tri thức địa phương và giảm rủi ro. Không tự đổi tên/pháp nhân/chính sách quỹ; phần cần chủ dự án chốt ghi riêng.

#### 10.2. Bốn nhánh quyền lợi phải cùng dựa vào dữ liệu hợp lệ

Đã quan sát ở tài khoản Admin: 0 bài đủ điều kiện nhưng thẻ NFT vẫn hiện `OFFERED`; thẻ tip hiện chờ consent. Cần kiểm tra nguồn data và điều kiện, không dùng trạng thái mặc định chung cho mọi persona.

- Khi không có bài đủ điều kiện, hiển thị empty/ineligible đúng lý do; không hứa offer hoặc mở claim cho tài nguyên không có.
- SBT theo credential; NFT theo post; tip theo revision/decision/route. Không tự cấp cả ba chỉ vì một bài được duyệt.
- Chọn bài/quyền lợi cụ thể trước khi thực hiện thao tác cần ngữ cảnh. Lỗi claim không xóa nhãn kiểm định.
- SBT không có bán/chuyển. NFT không đổi tác giả hoặc ví nhận tip khi đổi owner. Sửa bài không tạo NFT tác giả thứ hai.
- Giữ bốn khối dễ đọc; enum/ID kỹ thuật đưa vào chi tiết review.

#### 10.3. Store và dữ liệu xuyên màn hình

- Gửi bài demo → thấy ở Đóng góp của tôi → xuất hiện ở phần vận hành phù hợp → phản hồi quay về đúng bài/phiên bản.
- Sửa giữ `postId`, tạo revision mới qua demo adapter; không sửa snapshot cũ tại component.
- VIP, donation, tip và tiền công có ID/trạng thái riêng. Demo ledger không báo doanh thu từ intent bị chặn/thất bại.
- Giữ USDC/ETH tách biệt, không cộng thành một số không có đơn vị. Số liệu demo phải nhận biết được và không có biên nhận chain giả như bằng chứng thật.
- Rà khả năng sửa tên/bio trong khu tài khoản theo v1.0; nếu đang chỉ đọc thì hoàn thiện demo cập nhật đúng user, không đổi role/VIP.

### 11. Những phần cần giữ

- Home tối giản, hai CTA; hộp lựa chọn đóng góp.
- Brand hiện có: Forest #173F35, Jade #2C7563, Sage #DCE8DA, Ivory #F5F1E8, Waypoint #F0A44B, Ink #182522.
- Tìm kiếm/bộ lọc URL, empty state và map đã hoạt động trong các bước thử.
- Khôi phục nháp sau reload; profile mẫu VI→EN đã hoạt động.
- Phạm vi/hạn kiểm định và nguồn trên bài; logic chặn tip bản chưa đủ điều kiện.
- Phân biệt nghiệm thu công và quyết định nội dung.

Không dựng lại từ starter hoặc xóa module đang đúng để giảm phạm vi test.

### 12. Thứ tự triển khai và kiểm thử

| Chặng | Công việc | Đầu ra |
| --- | --- | --- |
| FIX-00 | Baseline, repo/worktree, tái hiện finding | Bảng finding có trạng thái và ảnh baseline |
| FIX-01 | Hai lỗi P0 và kiểm thử liên quan | Revision nhất quán; Guest không mua VIP |
| FIX-02 | Header, locale, tab/return context | Điều hướng và bố cục review được |
| FIX-03 | Payment context, quyền demo, quyền lợi/store | Luồng và dữ liệu liên trang đúng |
| FIX-04 | Copy, responsive, hồi quy các luồng | Ảnh và bảng QA có kết quả thật |
| FIX-05 | Data map, coverage, hướng dẫn và handoff | Hồ sơ để Bin nghiệm thu rồi quyết định BE |

Sau mỗi chặng ghi checkpoint ngắn: đã sửa, đã kiểm, còn gì. Tiếp tục phần độc lập; không hỏi xác nhận từng thay đổi thường lệ. Không mở nhiều vòng agent tự đánh giá lẫn nhau hoặc cài mới hệ orchestration cho đợt sửa này.

Kiểm thử tập trung vào rủi ro thật:

1. Query revision thay đổi, Back/Forward, reload, locale và dữ liệu trả chậm.
2. Guest mua VIP qua mọi điểm vào bị chặn; Member pending/finalized; đổi user khi pending; donate không cấp VIP.
3. Context PROJECT/POST_TIP/MEMBERSHIP đúng; tip không đủ điều kiện bị chặn; không tạo hash/explorer giả.
4. Hai tab đóng góp và nháp qua navigation/locale/login; cache riêng không lẫn user.
5. Guest/Member/Expert/Admin truy cập đúng projection và thao tác demo; nhập URL trực tiếp cũng áp dụng.
6. Account không đủ điều kiện không có offer NFT/claim giả. Công đạt và bài bác vẫn có payable.
7. Hành trình đọc Home → Explore → Place → Post → History → People và trở lại.
8. Hành trình đóng góp → gửi demo → My Contributions → review/feedback → sửa revision.
9. Build/typecheck/lint và test liên quan bằng scripts thực của repo; dùng test framework có sẵn.
10. Kiểm trực tiếp desktop/mobile, sáu ngôn ngữ theo phạm vi nêu trên; chụp và tự xem ảnh.

Không viết hàng loạt test chỉ kiểm class/màu. Khi cùng lỗi vẫn không rõ nguyên nhân sau hai hướng xử lý, ghi chẩn đoán, khoanh vùng phụ thuộc và tiếp tục phần khác; tránh loop chạy lại toàn bộ không có thông tin mới. Không đánh dấu PASS khi chỉ nhìn build thành công.

### 13. Bàn giao bắt buộc

Tái sử dụng thư mục tài liệu FE hiện có; nếu chưa có thì chọn một vị trí nhất quán và báo đường dẫn thực tế. Cập nhật thay vì tạo nhiều bản trùng:

- **FE_QA.md:** finding P0/P1/P2, bước tái hiện, nguyên nhân sau khi kiểm code, file sửa, bằng chứng trước/sau, test thực chạy, ảnh 1440/1366/390/430 và locale đã kiểm. Có PASS/FAIL/SKIPPED/BLOCKED cùng lý do.
- **FE_COVERAGE.md:** đối chiếu luồng Masterboard, điểm vào, actor, màn hình và trạng thái demo. Không gắn hoàn thành toàn bộ 33 luồng chỉ vì đã sửa các finding trong bản này.
- **FE_REVIEW.md:** lệnh mở ứng dụng, URL thật, cách chọn persona/scenario, hành trình Bin thử và quyết định còn cần chốt.
- **FE_DATA_MAP.md:** theo component/nhóm field, gồm nguồn hiện tại, nguồn đích đề xuất, ID vào/ra, người xem/sửa, lúc tải lại, trạng thái lỗi và cách giữ client state. Phân biệt FE_STATIC, FE_LOCAL_STATE, BE_DYNAMIC, WALLET_PUBLIC_READ, CHAIN_VIA_BE; không phân loại nguyên trang một cách cứng nhắc.
- **FE_HANDOFF.md:** data shapes/interfaces, capability/reasonCodes, delta đề xuất cho BE/CHAIN và phần tích hợp còn thiếu. Không triển khai schema/API/ABI production để hoàn thành tài liệu.

Commit checkpoint phần mình nếu quy trình repo cho phép, tránh đưa thay đổi của người khác vào commit. Không tự merge, push hoặc deploy production. Chuẩn bị kết quả local/preview để Bin review; nếu có hạn chế công cụ, ghi rõ và cung cấp cách chạy thực tế.

Mẫu báo cáo cuối:

```text
1. Đã sửa: finding nào, file/component nào, thay đổi hành vi gì.
2. Đang chạy demo: luồng nào, điều kiện và kết quả mô phỏng.
3. Chờ tích hợp: BE, OAuth, wallet config hoặc Chain nào còn thiếu.
4. Kiểm tra: lệnh thật và kết quả; viewport/locale đã xem; ảnh và lỗi còn lại.
5. Cách Bin xem: địa chỉ local/preview thực tế và các bước thử ngắn.
6. Bàn giao: đường dẫn FE_QA, FE_COVERAGE, FE_REVIEW, FE_DATA_MAP, FE_HANDOFF.
7. Git: branch/checkpoint; trạng thái chưa push/deploy.
```

**Bắt đầu FIX-00 ngay, sau đó tiếp tục các chặng đến bản FE review được.**

---

## C. Bin nghiệm thu sau khi Antigravity hoàn thành

| Việc thử | Kết quả cần thấy |
| --- | --- |
| Mở Home | Chỉ hero và hai CTA chính; các nhánh đi tiếp hoạt động |
| Chọn persona có tên dài/Admin | Menu không chồng chữ; khu vận hành nằm ở vị trí dễ hiểu |
| Đổi bản bài REV-000002 ↔ REV-000003 | Nội dung, nhãn và điều kiện tip đổi ngay, không phải reload |
| Guest muốn mua VIP | Được yêu cầu đăng nhập; không có thông báo đã mở VIP |
| Member mua VIP demo | Thấy đúng tên tài khoản; pending chưa mở quyền; hoàn tất mới mở quyền demo |
| Mở ủng hộ từ bài và từ nav | Đúng tác giả/bài hoặc đúng quỹ; không tự chọn người nhận khác |
| Tip bản cần chỉnh sửa | Nêu lý do chưa thể ủng hộ; không tạo giao dịch demo thành công |
| Chuyển tab điểm mới, đổi tiếng Anh, tải lại | Vẫn đúng tab, chữ đã dịch và nháp còn nguyên |
| Guest vào khu Experts | Thấy thông tin tham gia/đăng nhập; không thấy task riêng và nút nhận việc |
| Tài khoản không có bài đủ điều kiện | Không hiện NFT offer hoặc quyền claim sẵn |
| Gửi bài demo | Thấy đúng bài trong Đóng góp của tôi và tiến trình phản hồi liên quan |
| Xem mobile | Đọc/bấm được, không chồng chữ; modal không che nút chính |
| Mở FE_DATA_MAP | Biết từng nhóm dữ liệu sẽ ở FE, BE hay Chain qua BE |

Nếu còn lỗi, dùng lệnh tiếp tục, không giao agent dựng lại toàn bộ:

```text
Tiếp tục từ checkpoint hiện tại của đợt FE Fix v1.1.
Các mục chưa đạt tôi vừa ghi ở trên là đầu vào cho lượt sửa tiếp.
Tái hiện, sửa đúng phạm vi, kiểm thử hồi quy liên quan và cập nhật FE_QA.
Giữ nguyên các phần đã đạt; chưa triển khai BE/Chain hoặc deploy production.
```

Tiêu chí hoàn tất: hết lỗi P0 đã xác nhận; các hành trình chính review được với dữ liệu demo nhất quán; phần chưa kiểm hoặc chờ tích hợp được ghi đúng; có data map để quyết định bước BE tiếp theo.
