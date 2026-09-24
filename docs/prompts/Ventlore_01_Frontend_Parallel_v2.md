# Ventlore — 01 · Front-end song song

Phiên bản 2.0 · 24/09/2026 · Tiếp tục repository hiện có.

## Cách dùng

Lưu cả bốn file của bộ v2 vào `docs/prompts/` trong repository. Chạy **file 04 — Merge, giai đoạn A** trước để kiểm tra nền chung và tạo ba worktree. Sau đó mở worktree FE và giao toàn bộ file này cho coding agent. FE có thể chạy đồng thời với BE và CHAIN.

Đây là nhánh front-end bao gồm phần còn thiếu của Prompt 01 và phạm vi Prompt 02–03 cũ. **Không chạy lại Prompt 00/01 từ đầu.** Tuyên bố “gần xong” là đầu vào để khảo sát, không phải bằng chứng mọi tiêu chí đã đạt.

## Vai trò và điểm bắt đầu

Bạn phụ trách front-end Ventlore. Hãy đọc code hiện tại, thực hiện phần còn thiếu, kiểm thử và bàn giao; không dừng ở kế hoạch. Trả lời bằng tiếng Việt, dùng tiếng Anh cho identifier/code.

1. Đọc `AGENTS.md`, tài liệu trạng thái/handoff hiện có và `docs/parallel/BASELINE.md`, `CONTRACTS.md`, `OWNERSHIP.md`, `WORKSPACES.md`. Các file này do Merge-A tạo từ repository thật.
2. Kiểm tra worktree, branch, HEAD và `git status`. Phải đúng workspace FE đã ghi; không chuyển branch trong thư mục agent khác đang dùng. Bảo toàn thay đổi chưa commit.
3. Đọc ID Registry 0.3, Event/UI Spec 0.3, Wireframes 0.3, Brand Guide 0.1 và các phần Logic liên quan. Tìm theo filename/mapping nguồn, không giả định tên thư mục.
4. Đọc quyết định UI mới nhất đã có, đặc biệt `Ventlore_Prompt_01_Round_4_HomePage_i18n.md`; tài liệu cũ là lịch sử. Các yêu cầu chính của vòng 4 được giữ ở phần dưới để không phụ thuộc cuộc trò chuyện trước.
5. Kiểm kê từng phần thành `KEEP`, `FIX`, `BUILD`, `BLOCKED`, kèm đường dẫn code/bằng chứng. Giữ các phần đã chạy đúng, assets, layout, routing, i18n và dữ liệu hợp lệ hiện có.

Nếu chưa có nền chung hoặc quyền sở hữu file chưa rõ, kiểm tra và lập đề xuất trong phạm vi FE; không tự tái dựng nền hoặc thay hợp đồng để chạy được. Báo đúng phụ thuộc và tiếp tục các việc độc lập.

## Ranh giới công việc

- Bạn sửa pages/layout/components/styles/assets/catalog dịch, mock transport và tests FE theo OWNERSHIP thực tế. Trong Next.js, `apps/web` có thể chứa cả FE lẫn API: quyền FE không bao gồm toàn bộ thư mục này.
- Không sửa database/migrations, Route Handlers nghiệp vụ, worker, Solidity hay ABI sinh tự động. Không import DB hoặc server secret vào client.
- Dùng schema, API client và interface chain đã thống nhất. Mock trả đúng request/response contract, quyền và lỗi; không import fixture rải rác vào component.
- Thiếu field/endpoint/event: ghi một yêu cầu cụ thể vào `docs/parallel/requests/FE-<slug>.md` gồm nhu cầu, ví dụ payload, compatibility và người cần xử lý. Không tự tạo API/ABI mới rồi tuyên bố đã đồng bộ.
- Thay đổi schema/API dùng chung, dependency/lockfile, cấu hình gốc và CI đi qua Merge. Không tự nâng framework hoặc thêm một hệ i18n thứ hai.
- Bạn được commit thay đổi thuộc mình trên branch FE. Không tự push, ghép sang nhánh khác, publish website hoặc gửi giao dịch thật. Việc ghép local thuộc Merge.

## FE-A — Hoàn thiện phần còn thiếu của Prompt 01

Chỉ sửa các mục chưa đạt trên code hiện tại. Lỗi quan sát từ deploy cũ cần tái hiện; không mặc định deploy cũ là HEAD hiện tại.

### HomePage và nhận diện

- Giữ HomePage mới tại root của từng locale; S01 vẫn là Explore, không đổi mã màn hình cũ. Dùng mã Home đã đăng ký trong baseline.
- Hero thể hiện một cảnh thiên tai và con người giúp nhau: đường mòn/vùng núi sau mưa bão, người địa phương và người đi đường hỗ trợ trên vùng đất ổn định. Có bối cảnh thiên tai rõ và tinh thần tương trợ, không dùng ảnh thương tích gây sốc hoặc thao tác cứu hộ nguy hiểm.
- Ảnh thật cần quyền sử dụng/nguồn. Ảnh mô phỏng có chú thích đã dịch, không nhận là sự kiện hay hoạt động cứu hộ thực tế của Ventlore. Không dùng ảnh hero như bằng chứng tình trạng hiện tại của một địa điểm.
- H1 là chữ HTML, nằm chính giữa ảnh; cụm H1, thông điệp và CTA cân đối quanh trung tâm. Bản Anh đúng **“Explore your destination”**; bản Việt **“Khám phá điểm đến của bạn”**. Giữ khoảng trống ảnh để chữ không che hành động hỗ trợ.
- Các H1 khác: ja `あなたの旅先を探そう`; zh-Hans `探索你的目的地`; ko `나만의 여행지를 찾아보세요`; fr `Explorez votre destination`.
- Thông điệp Việt: **“Đóng góp của bạn có thể giúp giảm những tai nạn ngoài trời.”** Anh: **“Your contribution can help prevent outdoor accidents.”** Không bịa số người được cứu, tỷ lệ giảm tai nạn hoặc năng lực cứu hộ.
- Mô tả Việt: “Chia sẻ hiểu biết địa phương, cập nhật điều kiện thực tế và cùng kiểm tra thông tin để người đi sau chuẩn bị tốt hơn cho hành trình.” Dịch tự nhiên đủ sáu locale.
- CTA chính đến Explore cùng locale; CTA phụ đến `#contribute`. Phần đóng góp giải thích tri thức, thời gian kiểm tra và hỗ trợ tài chính qua luồng thực sự có.
- Bên dưới có: lý do tồn tại, tầm nhìn, sứ mệnh, ba bước chia sẻ–kiểm tra–cập nhật/ghi nhận, điểm đến từ cùng nguồn Explore, đóng góp và minh bạch. Không biến Ventlore thành dịch vụ ứng cứu khẩn cấp hoặc hứa quỹ cứu trợ chưa được chốt.
- Tầm nhìn: cộng đồng khám phá toàn cầu, dùng tri thức địa phương để hiểu điểm đến, tôn trọng thiên nhiên và kết nối cộng đồng. Sứ mệnh: kết nối người khám phá/người địa phương, thông tin có nguồn/thời điểm/phạm vi, ghi nhận đóng góp và minh bạch nguồn lực.
- Logo về Home theo locale; URL bài/hồ sơ vẫn vào trực tiếp. Explore có phần giới thiệu gọn, ưu tiên tìm kiếm và kết quả, không lặp hero Home.
- Dùng token hiện có theo brand: Forest `#173F35`, Jade `#2C7563`, Sage `#DCE8DA`, Ivory `#F5F1E8`, Waypoint `#F0A44B`, Ink `#182522`; Be Vietnam Pro và font CJK phù hợp. Giữ logo đúng tỷ lệ; body khoảng 16/26 px, vùng chạm tối thiểu 44 px.

### Đa ngôn ngữ, hồ sơ và điều hướng

- Duy trì `vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr` trong mọi màn cũ và mới. Không sao chép nguyên một ngôn ngữ để lấp key.
- Yêu cầu mới nhất vòng 4: locale trên URL thắng; URL gốc xét lựa chọn đã lưu/ngôn ngữ trình duyệt được hỗ trợ, dự phòng `en`. Nếu có quyết định mới hơn được ghi nhận, giữ quyết định đó và ghi rõ; không quay về mặc định cũ chỉ vì đọc prompt cũ.
- Giữ entity, revision, từ khóa, region/activity ID, bộ lọc, sort, view, query/hash và returnTo nội bộ hợp lệ khi đổi locale. Không prefix locale cho API/webhook/auth callback; không đổi session hay phát lại mutation.
- UI, validation, loading/empty/error, tooltip, alt, aria-label, metadata và label trạng thái phải dịch. Format số/ngày/tiền theo locale nhưng không thay giá trị, thời hạn hoặc đơn vị tài sản.
- Bio và dữ liệu demo do dự án kiểm soát phải có đủ sáu bản dịch, gồm các profile `an_vip_explorer`, `bin_traveler`, `minh_trailguide`, `hoang_ranger` nếu có, và các profile demo khác thực tế tồn tại. Dùng cùng nguồn giữa profile, AuthorCard và thẻ bài.
- Nội dung người dùng thật giữ nguyên bản gốc; thiếu bản dịch phải có thông báo dễ hiểu và cho đọc nguồn theo quyền. Dịch bài gắn đúng sourceRevisionId; không sửa snapshot/contentHash, không tạo postId theo ngôn ngữ.
- Bản dịch VIP/private không được đóng gói trong catalog công khai, HTML, SSR payload hoặc bundle guest. Cache phải tách theo locale, entity/revision và quyền phù hợp.
- Profile ưu tiên con người và đóng góp; UUID/token ID ở phần chi tiết. VIP, chứng nhận và quyền chuyên gia là ba thông tin khác nhau.
- Kiểm thống nhất trạng thái xác minh trên badge, claim, lời giới thiệu, ngày/hạn và tip. Bài UNVERIFIED không mang câu “Independently audited” hoặc heading “Audited Claims”. Chỉ map label sang enum đã có; không tự thêm enum backend.
- Giữ tìm không dấu `cat ba`, alias và canonical merge. Hồ sơ merged không đếm thành điểm riêng. Kiểm deep link Tây Côn Lĩnh thực tế, không âm thầm đẩy lỗi về Explore tiếng Việt.
- Map có provider thì dùng bản đồ địa lý thật, filter/marker đồng bộ và attribution. Thiếu provider báo chưa khả dụng, giữ danh sách dùng được. Chỉ xin GPS khi bấm; xử lý từ chối/timeout.
- VIP giữ giá baseline 15 USD/12 tháng lịch từ config; bỏ lời chào bán “tọa độ khẩn cấp/hốc trú bão”. Minh bạch có nhãn demo hoặc nguồn/kỳ cập nhật thật, không số thành tích tự tạo.

## FE-B — Đóng góp, chuyên gia và vận hành

Triển khai phần còn thiếu của Prompt 02 cũ, dùng mock đúng schema khi API chưa sẵn.

- **Tác giả:** S06/S07 soạn–xem trước–gửi, S08 đóng góp của tôi, S17 điểm mới, S18 so trùng, S19 tiến trình/phản hồi, S30 báo sai. Giữ nháp khi lỗi/đổi tab; upload có các trạng thái thật; conflict 409 mở so sánh, không ghi đè. Bài sửa tạo revision mới, không đổi postId.
- **Chuyên gia:** S24 nhận vai trò, S25 danh sách việc, S10 chi tiết/nhận/từ chối/bắt đầu, S11 nộp/bổ sung bằng chứng. Hiện scope, phí, asset, deadline, điều kiện nghiệm thu/hủy. NEEDS_MORE giữ taskId, lần nộp mới có submissionId; đổi người là task mới.
- **Operator:** S09 sàng lọc, S12 case, S26 giao việc, S27 nghiệm thu, S31 báo sai/hold, S35 tuyển nội dung VIP. Phân biệt quyết định nội dung và nghiệm thu công; có WAITING_CAPACITY, thiếu ngân sách, conflict và role hết hạn.
- Blind review chỉ nhận payload được lọc; không tải kết luận riêng rồi ẩn. Không self-review; không xem hai account hoặc GPS là chứng minh có hai người độc lập.
- Bài REJECTED nhưng công đạt vẫn hiện payable. Tác giả sửa lúc review không tráo revision trong task cũ. Notification mở đúng business ID rồi tải state hiện tại.
- Dùng C11–C27, C39–C41, C47–C49 và thành phần liên quan theo registry; không tạo page riêng cho mọi drawer/panel.

## FE-C — Tiền, ví và quyền lợi

Triển khai phần còn thiếu của Prompt 03 cũ bằng typed transport; chưa có chain thật thì chỉ mô phỏng trong môi trường test/demo được cấu hình rõ.

- S20 liên kết ví: connected khác verified; challenge, nonce hết hạn, từ chối ký, wrong account, địa chỉ đã thuộc tài khoản khác. Đổi ví không đổi userId.
- S16/S32 có bốn trạng thái độc lập: nhãn thông tin, SBT, NFT tác giả, nhận tip. Thiếu ví chỉ chặn phần cần ví. Consent, register route, authorize grant và claim là thao tác khác nhau.
- S13–S15 donate: PROJECT hoặc POST_TIP; preview đúng asset/amount/recipient/deployment/revision/route. PROJECT 100% quỹ; POST_TIP có projectAmount=floor(amount/5), authorAmount=amount-projectAmount; gas riêng. Dùng bigint/atomic string, không float.
- Ý định retry giữ donationId/requestKey; đổi số tiền/ý định cần quy trình tạo ý định mới. Approve và donate/payTask có actionId khác nhau; các replacement giữ actionId, có attemptId riêng.
- C34 phản ánh submitted/observed/finalized/rejected/reverted/unknown/replaced/reorged theo contract; toast approve không đồng nghĩa donate thành công. Đổi chain/account làm vô hiệu bước xác nhận cũ.
- S28/S29 quỹ tách available/reserved/payable/spent theo asset. Khoản công/địa chỉ nhận lấy từ nghĩa vụ đã chốt, không cho UI sửa tùy ý. UNKNOWN dẫn đối soát, không tạo nghĩa vụ mới.
- S21–S23 VIP giữ kênh đã cấu hình; pending không cấp quyền và không xóa kỳ hiện có. Donation không cấp VIP.
- S31/S32 phân biệt app hold, chain block pending, blocked và restore pending; event cũ không gỡ hold mới.
- S33 lookup UUID/displayCode có quyền; S34 chỉ dữ liệu công khai đã lọc. Hoàn thiện C28–C38/C42–C45 và các thành phần còn thiếu theo registry.

## Kiểm tra, đồng bộ và điểm dừng

1. Ở mốc FE-A, FE-B, FE-C: chạy typecheck/build và tests phù hợp thực tế; không bắt build qua bằng cách tắt rule/bỏ test. Không cần đợi cả FE xong mới bàn giao một mốc.
2. Browser: 1440/1024/390/360 px, Home–Explore–place–post–profile; sáu locale, mọi profile demo; không tràn ngang/cắt CTA, CJK đủ glyph. Chụp các trạng thái đã tải xong, kiểm trực tiếp ảnh/biography/label.
3. Test hành vi: `cat ba` + Kayak rồi đổi Pháp; revision cụ thể → locale → reload; canonical merge; VIP active/expired; không rò dữ liệu qua locale/cache; draft/409; approve thành công nhưng donate fail; unknown giữ ID.
4. Mock đúng schema không chứng minh API hoặc bảo mật server đã hoàn thành. Ghi rõ `MOCK`, `LOCAL_REAL`, `NOT_CONFIGURED`, `NOT_RUN` theo từng tính năng.
5. Cập nhật `docs/parallel/FE_HANDOFF.md`, `FE_COVERAGE.md`, `FE_QA.md`. Không cùng sửa các handoff/coverage tổng; Merge tổng hợp chúng.
6. Bàn giao base SHA, head SHA, phiên bản hợp đồng chung, file thay đổi, mốc hoàn thành, lệnh/kết quả, screenshot, dependencies và yêu cầu gửi BE/CHAIN. Chỉ công bố đường dẫn preview đã kiểm chứng.
7. Khi Merge yêu cầu checkpoint: hoàn thành thao tác ghi hiện tại, commit phần thuộc mình, để worktree sạch và tạm ngừng sửa trong cửa sổ đồng bộ. Sau đồng bộ, đọc SYNC.md và tiếp tục từ trạng thái mới.
8. Nếu hai vòng sửa cùng một lỗi không tạo tiến triển, ghi tái hiện/nguyên nhân nghi ngờ và tiếp tục phần độc lập; không chạy vòng lặp vô hạn, tự mở agent hoặc nâng model để vượt giới hạn.

Hoàn thành khi phạm vi FE đã có tương tác, sáu locale và bằng chứng kiểm tra phù hợp; phần phụ thuộc chưa thật được ghi rõ. Không tự gọi toàn bộ Ventlore hoặc giao dịch tiền đã hoàn tất chỉ vì front-end build được.
