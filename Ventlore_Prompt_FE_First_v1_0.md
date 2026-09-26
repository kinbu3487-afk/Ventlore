# Ventlore — Hoàn thiện FE trước v1.0

Ngày: 26/09/2026. Phạm vi: Front-end hiện có của Ventlore.

## Mục tiêu của bản này

Hoàn thiện giao diện và trải nghiệm để Bin trực tiếp đi qua các hành trình của Users và Operators; dùng dữ liệu mẫu có liên kết nhất quán để thấy đủ thao tác, kết quả và ngoại lệ. Sau khi review FE, chốt dữ liệu nào nằm trong FE, dữ liệu nào cần BE, dữ liệu nào là kết quả từ Chain.

**Trình tự hiện tại:** hoàn thiện FE → trải nghiệm và chỉnh luồng → chốt bảng dữ liệu theo từng component → triển khai BE → tích hợp với phần Chain riêng.

Giữ trước các quy tắc nghiệp vụ và ID đã thống nhất. Việc chốt schema DB, endpoint production, cache/render strategy và hạ tầng BE thực hiện sau. Một trang có thể có cả phần tĩnh, phần lấy dữ liệu động và trạng thái tạm; không cần gán cả trang là “tĩnh” hoặc “động”.

Bản này thay đổi thứ tự công việc so với prompt BE vừa soạn. **Chưa chạy `Ventlore_Prompt_BE_Rebuild_v1_0.md` trong lượt FE này.**

## Cách dùng

Đưa file này vào cửa sổ/worktree FE cùng Sources của Ventlore, rồi gửi:

```text
Thực hiện phần PROMPT TRIỂN KHAI trong Ventlore_Prompt_FE_First_v1_0.md.
Tiếp tục từ code FE hiện có, hoàn thiện các hành trình bằng adapter và dữ liệu demo nhất quán.
Mục tiêu là một bản FE có thể trực tiếp trải nghiệm và nghiệm thu, kèm bảng dữ liệu theo từng component để chốt BE sau.
Không triển khai BE, database, listener hoặc smart contract trong nhiệm vụ này.
Bắt đầu từ FE-00, làm lần lượt các chặng, kiểm tra và cập nhật checkpoint; không dừng ở kế hoạch.
```

---

# PROMPT TRIỂN KHAI

Bạn phụ trách Front-end Ventlore. Hãy sửa trực tiếp FE trong repository hiện tại và hoàn thiện bản có thể review độc lập. Tận dụng những gì đã làm từ Prompt 00–01 và các lần chỉnh tiếp theo. Không dựng lại website từ starter.

## 1. Đích nghiệm thu

Khi hoàn tất, chủ dự án có thể:

1. Từ Home đi qua luồng đọc, đóng góp nội dung, donate, mua/gia hạn VIP, quyền lợi SBT/NFT, Experts và Admin.
2. Bấm các hành động chính và nhìn thấy thay đổi trạng thái demo hợp lý, gồm cả lỗi, chưa đủ điều kiện và đang chờ; không chỉ xem màn hình tĩnh.
3. Dùng cùng trải nghiệm trên desktop/mobile và sáu ngôn ngữ.
4. Nhìn vào bảng dữ liệu theo component để quyết định phần nào giữ tĩnh trong FE, phần nào cần BE và phần nào liên quan Chain.
5. Bàn giao cho BE/CHAIN bằng danh sách dữ liệu, ID và trạng thái rõ ràng; không cần viết lại UI khi đổi từ demo sang dữ liệu thật.

Đây là đợt hoàn thiện toàn bộ FE theo Journeys hiện hành, rộng hơn prompt trước chỉ bổ sung PaymentModal. Khu đóng góp, Experts và Admin được hoàn thiện ở lớp UI/demo. Những giới hạn cũ chỉ áp dụng cho đợt PaymentModal không được dùng để bỏ qua các bề mặt FE cần có trong đợt này.

## 2. Phạm vi công việc và nguồn ưu tiên

Đọc AGENTS.md, README, package/lockfile, router, design system, i18n và adapter hiện có. Nếu có `docs/parallel/WORKSPACES.md`/OWNERSHIP, đối chiếu branch và thư mục FE. Tên thư mục trong tài liệu cũ là gợi ý, phải xác minh repo thật.

- Chỉ sửa component/page/layout, CSS/tokens, i18n, FE types/view models, data adapter, fixture/demo store, client wallet integration, FE tests và tài liệu bàn giao.
- Không viết API server, DB/migration, auth server, worker/listener, signer service, Solidity hoặc ABI. Không đổi shared contract do nhánh khác sở hữu; ghi delta đề xuất trong handoff.
- Không yêu cầu BE/CHAIN hoàn thành trước khi review FE. Thiếu dịch vụ bên ngoài thì dùng demo adapter có nhãn và tiếp tục.
- Không phá phần tích hợp thật đã có. Giữ đường real/demo tách rõ; demo không được gọi mutation thật.
- Kiểm git status trước sửa; giữ thay đổi của người khác. Commit/checkpoint trong phạm vi quy trình FE hiện có; không tự merge/push/deploy production.
- Không thêm ví riêng, embedded wallet, marketplace, staking, token Ventlore, swap/bridge/on-ramp hoặc gas sponsorship trong đợt này.

Nguồn nghiệp vụ ưu tiên:

1. Yêu cầu hiện tại: FE trước, BE sau, Chain làm riêng.
2. Wallet Architecture v1.1 và Masterboard FE–BE–Chain v1.1, đặc biệt đính chính VIP theo tài khoản.
3. ID Registry v0.3, Logic–ID–DB v0.3, Event UI Spec/Wireframes v0.3 cho các luồng và ID không mâu thuẫn.
4. Brand Guide v0.1; prompt Wallet/Donate/Tip cho PaymentModal và ví.
5. Code/UI hiện có để giữ giao diện, route và thành quả đã làm.

Không sao chép quy tắc “VIP thuộc ví” còn trong Journey v0.4/mô tả FE–BE–Chain v0.1. Chuẩn hiện hành: **payment gắn userId; dùng tài khoản để đăng nhập VIP; ví chỉ tham gia thanh toán.** Các đề xuất policy chưa chốt phải ghi là đề xuất, không tự biến thành quyết định kinh doanh.

## 3. Điểm xuất phát từ website đã kiểm tra

Quan sát công khai ngày 26/09/2026, không phải kiểm toán repository:

| Đã thấy trên website | Công việc FE cần nối tiếp |
| --- | --- |
| Home một hero, hai CTA, chuyển ngữ | Giữ bố cục này, hoàn thiện các nhánh đi tiếp |
| Menu đóng góp còn gộp quỹ/VIP, CTA chủ yếu tới gói VIP và sổ quỹ | Tách hành động ủng hộ quỹ và mua VIP rõ ràng |
| Explore có tìm kiếm, vùng/hoạt động, danh sách/bản đồ | Hoàn thiện filter, empty/error/loading, giữ trạng thái khi quay lại |
| Place có cảnh báo, tọa độ, danh sách bài | Chuẩn hóa card, public/VIP và nguồn dữ liệu theo từng khối |
| Post có revision, phạm vi/hạn kiểm định, route 80/20 | Thêm nút tip và form; revision nào hiển thị trạng thái của revision đó |
| People mẫu đã đổi bio/nhãn khi chuyển VI→EN | Giữ kết quả đã sửa; kiểm thêm mọi profile và locale |
| VIP 15 USD/12 tháng có đường đăng nhập | Hoàn thiện mua/gia hạn trong modal, entitlement theo tài khoản |
| Có banner DEMO, persona mẫu và số quỹ minh họa | Dùng demo có kiểm soát để review, không trình bày như dữ liệu vận hành thật |
| Chưa kiểm tra khu riêng Experts/Admin và OAuth/thanh toán thật | Audit repo rồi hoàn thiện UI các khu này, không mặc định đã có hoặc chưa có BE |

Ở FE-00, đối chiếu code hiện tại vì bản deploy có thể chậm hơn branch. Chỉ bổ sung phần thiếu, sửa phần sai và thống nhất component trùng.

## 4. Actors và điều hướng

Chỉ có hai nhóm:

- **Users:** Guest, Member, VIP_member.
- **Operators:** Experts, Admin.

Tác giả là Member/VIP_member sở hữu bài; người ủng hộ là người thực hiện donate; hướng dẫn viên/kiểm lâm là bio. Không thêm role AUTHOR, DONOR, GUIDE. Persona demo có thể ghi “Minh — Member, tác giả bài mẫu” mà không tạo role mới. Experts/Admin vẫn dùng cùng tài khoản và có thể thực hiện tác vụ người dùng thông thường.

Home là điểm bắt đầu để giới thiệu mọi hành trình. Sau đó thao tác mở ngay tại trang liên quan; không ép quay về Home để donate, sửa bài hoặc xử lý task. Deep link và Back của trình duyệt vẫn hoạt động.

| Khu vực FE | Dùng page/tab/dialog thế nào | Người sử dụng |
| --- | --- | --- |
| Home | Hero và hộp chọn đóng góp | Mọi người |
| Explore | Trang có tìm/lọc/list/map | Mọi người |
| Place | Trang chi tiết và các bài | Mọi người theo quyền dữ liệu |
| Post/revision | Trang đọc, history panel, report dialog, tip modal | Mọi người theo quyền |
| People/profile | Hồ sơ public; sửa hồ sơ ở khu tài khoản | Mọi người / chủ tài khoản |
| Login | Giữ trang/gate hiện có, quay lại đúng ý định | Guest khi cần tài khoản |
| My account | Tab hồ sơ, đóng góp, VIP, quyền lợi, lời mời/nhật ký cá nhân phù hợp | Member/VIP_member |
| Contribute | Soạn bài/điểm mới, preview, báo trùng | Người đăng nhập |
| PaymentModal | PROJECT / POST_TIP / MEMBERSHIP | Guest donate; tài khoản mua VIP |
| Expert workspace | Danh sách task, task detail, form nộp và công phải nhận | Experts |
| Admin workspace | Intake/review, giao task, nghiệm thu, decision, reports, tài chính, quyền | Admin theo capability |
| Transparency | Sổ quỹ public có nhãn demo | Mọi người |

Giữ `/[locale]/places/{placeId}`, `/posts/{postId}?revisionId=...`, `/people/{handle}` và route đang đúng. Screen S01–S35 trong nguồn là bề mặt chức năng; nhiều bề mặt nằm trong tab/drawer/modal, không cần xây 35 trang độc lập. S13–S15/S22 có thể gom vào PaymentModal; S20 vào panel ví trong tài khoản/quyền lợi. Không tạo trang ví hoặc lịch sử thanh toán riêng chỉ để phục vụ checkout.

## 5. Home và các trang đọc

### Home

- Giữ một hero, logo, chuyển ngữ, thông điệp và đúng hai CTA “Bắt đầu khám phá” / “Tôi muốn đóng góp”. Không thêm section sứ mệnh, thống kê, địa điểm nổi bật dưới hero hoặc CTA thứ ba.
- Hộp đóng góp có đường tới: viết bài/đề xuất điểm mới; tham gia kiểm định; ủng hộ quỹ. VIP và sổ minh bạch là lựa chọn riêng rõ nhãn, không thay donate.
- “Tham gia kiểm định” dẫn tới thông tin tham gia/lời mời/khu Experts theo trạng thái; không chỉ dẫn tới hồ sơ người mẫu rồi kết thúc luồng.
- Với tài khoản Experts/Admin, menu phù hợp cho vào khu làm việc; không đưa đầy đủ menu vận hành lên hero của khách.

### Explore và place

- Card có hero image, tên, vùng, mô tả, hoạt động, cảnh báo, số bài được phép hiển thị. Không gắn một huy hiệu “an toàn” cho toàn điểm đến.
- Tìm/lọc/list/map hoạt động trên cùng data adapter. Tìm không có kết quả có nút xóa bộ lọc; loading/error khác với số điểm bằng 0.
- Giữ query/filter/view mode khi mở chi tiết rồi Back và khi đổi locale.
- “Gần tôi” chỉ xin vị trí khi bấm; từ chối/quá hạn vẫn dùng chọn vùng thủ công. Không tải trang là xin GPS.
- Map và danh sách chỉ dùng projection điểm được phép; tile/map lỗi có fallback danh sách và lời giải thích, không spinner vô hạn.
- Place có cảnh báo/tóm tắt public, phần chi tiết theo quyền, ảnh/ghi chú khách từ fixture phù hợp luồng đóng góp hiện có. Không tự xây hệ bình luận/rating mới nếu chưa có nguồn nghiệp vụ.

### Post và revision

- Tác giả, ngày quan sát, nguồn, nội dung, claims, trạng thái kiểm tra/phạm vi/hạn, ảnh/tài liệu, lịch sử revision, tip và report đều có vị trí rõ.
- Chọn revision đổi đúng content, verification, claims và tip-context. Bản mới chưa duyệt không dùng nhãn/route cũ. Deep link và reload giữ đúng bản.
- Bài VIP có preview được phép, quyền lợi và CTA mua/đăng nhập lại. Người đã có VIP theo tài khoản không bị yêu cầu kết nối ví để đọc.
- Báo sai mở dialog gắn đúng revision/claim, giữ thông tin đã nhập khi cần login; sau gửi demo có trạng thái theo dõi, không tự kết luận bài sai.
- Không nhồi UUID/hash/API/ABI trong nội dung dành cho độc giả. Mã tra cứu/hồ sơ kỹ thuật nằm trong phần chi tiết khi hữu ích.

### People

- Profile public gồm avatar, tên, handle, bio, đóng góp và ghi nhận được phép công khai.
- Phân biệt bài đã viết và bài đã tham gia kiểm tra; không đổi tác giả của post để ghi nhận reviewer.
- Sửa tên/bio ở hồ sơ cá nhân không đổi role/VIP.
- Hiển thị chứng nhận, NFT và vai trò bằng các khối khác nhau. Không suy ra “Expert” từ một thẻ SBT mẫu.

## 6. Login, tài khoản và đóng góp nội dung

### Login và session ở FE

- Tận dụng auth adapter hiện có. Nếu OAuth đã tích hợp thì giữ; nếu thiếu BE/provider, nút Google báo đúng tình trạng, và demo login có nhãn rõ.
- Không giả rằng click Google đã xác thực. Không triển khai auth server trong nhiệm vụ này.
- Persona demo cho đủ năm trạng thái Guest/Member/VIP_member/Experts/Admin; nhiều user mẫu để thử ownership và kiểm định độc lập. Guest không có userId lâu dài.
- Demo switcher chỉ dùng môi trường review/dev theo cơ chế đang có; không được cấp role/quyền thật hoặc gọi API riêng bằng quyền giả.
- Login quay lại đúng trang, locale, form và ý định. Return URL không dẫn ra ngoài origin không được phép.
- Logout/đổi user xóa cache riêng của user trước, giữ sự phân biệt giữa quyền đọc, role và ví đang kết nối.

### Viết bài, điểm mới và phản hồi

- Form bài ở place có sẵn: chọn place, tiêu đề, loại đóng góp, ngày trải nghiệm, nội dung, nhận định/rủi ro, nguồn và media. Có lưu nháp, preview và gửi demo.
- Form điểm mới: vị trí, tên, vùng/hoạt động, quan sát, rủi ro và bằng chứng; gợi ý điểm trùng trước khi gửi. Người dùng có thể chuyển sang viết bài cho điểm có sẵn. Không auto-merge chỉ vì gần tọa độ.
- Tệp trong demo chỉ preview/lưu cục bộ theo adapter; ghi rõ chưa tải lên dịch vụ thật. Không upload tệp cá nhân sang bên thứ ba để làm bản demo.
- Validation tại trường, giữ dữ liệu khi lỗi. Có cảnh báo nháp chưa lưu; lỗi giả lập 409 giữ hai phiên bản để người dùng hiểu cách xử lý, không ghi đè im lặng.
- Sau gửi: xuất hiện trong “Đóng góp của tôi”, mở đúng trạng thái/feedback. Bài thông thường theo policy có thể công bố UNVERIFIED; đề xuất điểm mới ở REVIEW_ONLY trước duyệt.
- Sửa giữ postId, mock adapter trả revisionId mới và parentRevisionId đúng. Không sửa snapshot đã nộp tại component.
- Tabs trong khu cá nhân: bài/điểm đã góp, tiến trình phản hồi, quyền lợi, VIP, lời mời Experts và hồ sơ cần thiết. Không tạo các dashboard trùng chức năng.

## 7. PaymentModal và ví — hoàn thiện UI, thanh toán demo

### Bốn điểm mở, một component

| Điểm vào | Mode | Thông tin mở sẵn |
| --- | --- | --- |
| Home → Tôi muốn đóng góp → Ủng hộ Ventlore | PROJECT | Quỹ, nhập tiền |
| Donate/Ủng hộ trên navigation hiện có ngoài Home | PROJECT | Cùng form/quỹ |
| Ủng hộ tác giả trên bài | POST_TIP | Tác giả, postId, revisionId, route và eligibility |
| Mua/Gia hạn tại trang VIP/khu tài khoản | MEMBERSHIP | Tài khoản hưởng quyền, plan, giá, kỳ hạn |

Không thêm navigation mới vào Home để chứa Donate. Không thêm nút Connect Wallet trên header chỉ để phục vụ checkout. Trên mobile, đóng menu trước khi mở modal; hộp đóng góp và wallet picker không cùng nhận focus.

Modal có: mục đích; đích/người hưởng; số tiền hoặc giá gói; tài sản/mạng; trạng thái ví; phân bổ/kỳ quyền lợi; phí mạng nếu có dữ liệu; CTA; tiến trình/kết quả. Đích nhận chỉ đọc từ config/adapter, người donate không nhập địa chỉ tùy ý.

PROJECT ghi 100% vào quỹ, gas riêng. POST_TIP ghi 80% tác giả/20% quỹ, tính bằng atomic units: `treasury = floor(amount/5)`, `author = amount - treasury`. MEMBERSHIP dùng paymentId, không donationId và không chia 80/20.

Chưa eligible thì hiện lý do: chưa duyệt, hết hạn, hold, thiếu ví/consent, chờ kích hoạt… Không tự đổi tip sang donate quỹ. Cho người dùng chủ động chọn “Ủng hộ Ventlore” nếu muốn.

### Ví thật có giới hạn, demo độc lập

- Tái sử dụng wallet kit đang có. Với React/Next.js chưa có tích hợp, ưu tiên bộ RainbowKit/wagmi/viem tương thích lockfile; đọc tài liệu chính thức đúng phiên bản trước cài, không nâng toàn bộ stack.
- Có config hợp lệ thì làm thật connect/disconnect, đọc account/chain/balance/allowance và đổi mạng khi người dùng chủ động. Hỗ trợ mobile app linking khi provider có cấu hình.
- Không yêu cầu ký để đọc số dư. Lỗi RPC là “chưa đọc được”, không phải số 0. Thiếu gas và thiếu token là hai thông tin riêng.
- Thiếu WalletConnect/project/RPC config thì không bịa credential; injected wallet nếu hỗ trợ và chế độ mô phỏng vẫn có thể review. Ghi phần chưa kiểm được.
- Trong đợt này **không gọi signMessage/signTypedData, approve/permit, sendTransaction/writeContract hoặc yêu cầu ký thật**, gồm cả proof, consent, donate, VIP, claim, route, payout và quản trị.
- Các bước ký/proof/consent/thanh toán dùng mô phỏng có nhãn. Kết nối ví thật không tự biến mode demo thành mode chuyển tiền thật; adapter mutation demo không có đường gọi provider ghi chain.
- Không tự phát triển ví, hỏi seed phrase/private key hoặc yêu cầu cài extension riêng của Ventlore.

### Trạng thái và giữ ngữ cảnh

- Demo thể hiện: chưa kết nối, sai mạng, thiếu token/gas, quote hết hạn, xem lại, approve nếu cần, chờ ký, submitted, observed, finalized, rejected, reverted, unknown và replaced khi cần.
- CTA cuối ghi “Thử thanh toán (demo)” và kết quả ghi “Mô phỏng hoàn tất — chưa chuyển tiền thật”. Không tạo txHash/explorer link giả.
- Chế độ thường chưa tích hợp thanh toán phải nói “Chưa khả dụng” với lý do. Demo là lựa chọn rõ ràng, không tự fallback từ lỗi thật sang thành công giả.
- Đổi locale, hủy picker, đi sang app ví rồi quay lại giữ draft và ngữ cảnh. Đổi account/chain/asset làm mới balance/preview, không tái dùng xác nhận không còn khớp.
- Đóng modal không tự hủy giao dịch mô phỏng đã submitted; mở lại xem cùng intent đang chờ. Unknown có hành động kiểm tra lại trạng thái, không mặc định trả lần nữa.
- Đổi PROJECT↔POST_TIP↔MEMBERSHIP xóa dữ liệu đích/ID không phù hợp, không giữ nhầm tác giả hoặc tỷ lệ. Chặn double click ở FE, ghi BE sẽ bảo đảm idempotency thật.
- Số tiền dùng chuỗi/atomic bigint, parse locale nhất quán; không dùng float cho chia tiền. Đổi ngôn ngữ không đổi giá trị thực đã nhập.

## 8. VIP và các quyền lợi của người đóng góp

### VIP

- Giá baseline 15 USD/12 tháng lịch, gia hạn chủ động; plan/giá để trong adapter config demo, không rải số 15 trong component.
- Cho xem giá trước; yêu cầu tài khoản khi gắn đơn. Mua/gia hạn mở MEMBERSHIP, hiển thị rõ tài khoản nhận VIP.
- Nếu minh họa thanh toán token, quote có tài sản, atomic amount, giá USD và hạn, ghi rõ minh họa. Không giả định 15 USD luôn bằng 15 token.
- Pending chưa hiện đã có VIP. Demo finalized có thể chuyển **entitlement demo** để Bin trải nghiệm đọc bài; phải ghi rõ đây là quyền mô phỏng, không payment/quyền thật.
- Login lại cùng persona VIP không cần ví. Đổi ví không đổi quyền của user; đổi tài khoản phải lấy quyền demo của tài khoản mới.
- Gia hạn giữ membershipId, paymentId mới cho ý định mới; preview cộng 12 tháng lịch từ mốc muộn hơn giữa xác nhận và hạn hiện có. Giữ kỳ còn lại khi gia hạn đang pending.
- Không quảng bá VIP bằng việc khóa cảnh báo thiết yếu/tọa độ cứu trợ chỉ để thu phí. Phân biệt nội dung chuyên sâu có quyền khai thác với thông tin an toàn công khai.

### Nhãn kiểm định, SBT, NFT và nhận tip

Trong “Quyền lợi đóng góp”, có bốn khối riêng:

| Khối | Trạng thái cần review |
| --- | --- |
| Nội dung đã kiểm tra | Phạm vi, ngày, hạn; unverified/approved/expired/hold theo revision |
| SBT Contributor | Chưa đủ điều kiện / có offer / thiếu ví / chờ authorize / claim demo / issued demo / revoked |
| NFT tác giả | Offer theo post, ảnh/metadata preview, claim demo, token identity mẫu có nhãn; không mint thêm vì sửa bài |
| Nhận tip | Chưa có binding / thiếu consent / chờ route / active / paused / expired; đổi ví có preview ảnh hưởng |

Thiếu ví không làm mất bài hoặc công nhận; lỗi claim không xóa nhãn đã kiểm tra. Gộp panel ví nhận tiền vào đây/tài khoản nếu phù hợp, không bắt đi qua trang ví riêng.

Giải thích ngắn cho người dùng: token gắn với địa chỉ ví trên blockchain; ứng dụng ví giúp xem/quản lý. Ảnh/metadata được lưu riêng; hồ sơ Ventlore hiển thị từ dữ liệu được đối soát. Không yêu cầu người dùng tải file NFT về máy để “nhận”.

SBT không có nút bán/chuyển. Với NFT, chỉ thể hiện ownership theo policy đã có; chưa xây chợ/luồng bán. Nếu demo trạng thái đã chuyển NFT, tác giả gốc và ví nhận tip của bài không đổi. Chứng nhận không tự cấp VIP/Experts.

## 9. Experts và Admin — UI thao tác được bằng demo

### Experts

- Có lời mời tham gia theo region/scope/hạn, nhận hoặc từ chối; nhận role khác với nhận task.
- Task board/list phân biệt offered, accepted, doing, submitted, needs-more, accepted-work và trạng thái tiền công riêng.
- Task detail có revision, scope claims, deadline, công/tài sản, yêu cầu bằng chứng và tiêu chí nghiệm thu. Chưa có ví vẫn nhận/làm/nộp công.
- Nộp/bổ sung tạo submission demo mới; xem lịch sử bản nộp. Reviewer không thấy kết quả/danh tính reviewer khác trước mốc policy cho phép trong projection demo.
- “Công phải nhận” phân biệt được nghiệm thu, chờ ví, đang chi, chưa rõ kết quả, đã chi demo. Không có nút ký “nhận token” mỗi lần.

### Admin

Thiết kế thành vài trang lớn với tabs/drawers tái sử dụng, không một page mới cho từng trạng thái:

| Khu Admin | Thao tác demo cần làm được |
| --- | --- |
| Tiếp nhận | Lọc hồ sơ/điểm mới/report, xem dữ liệu, ưu tiên và lý do, so sánh điểm trùng |
| Review case | Đúng revision/scope; mở vòng, xem tiến trình, chuyển giữa các task |
| Giao việc | Chọn Experts phù hợp, hạn/công/asset, xem reserve; thiếu ngân sách/năng lực thì chờ |
| Nghiệm thu công | Xem submission, yêu cầu bổ sung, ACCEPTED_WORK/REJECTED_WORK; tạo nghĩa vụ demo |
| Quyết định nội dung | APPROVED/CHANGES_REQUESTED/INCONCLUSIVE/REJECTED, scope, hạn và căn cứ; tách nút nghiệm thu công |
| Quyền lợi/VIP content | Xem bốn nhánh sau duyệt, consent và trạng thái chờ; chọn nội dung VIP theo policy |
| Reports/hold | Tạm hạn chế ở app, yêu cầu chặn chain và kết quả chain là hai trạng thái riêng |
| Tài chính | Per-asset budget/reserved/payable/payout, funding/refund; preview và tiến trình chi demo |
| Quyền/cấu hình | Expert invitations/roles theo scope/hạn; quyền ứng dụng khác quyền ký contract |
| Tra cứu | Drawer ID/hồ sơ có liên kết nguồn, lịch sử sự kiện và dữ liệu cho phép |

Không tự chốt số reviewer/mức công/thời hạn nếu source còn là đề xuất. Fixture có policyVersion và scenario kiểm tra độc lập/thiếu người; ghi chỗ cần Bin chốt vào danh sách quyết định. Không cho demo “tự duyệt bài mình” trở thành happy path mặc định.

Luồng minh họa bắt buộc: **Experts làm công đạt yêu cầu → Admin bác nội dung bài → công vẫn được ghi nhận phải trả.** Điều này giúp người review thấy rõ hai quyết định khác nhau.

Hold app không đồng nghĩa chain đã block. Pending/unknown không hiện đã chi. Receipt và số dư quỹ demo không được dùng như bằng chứng giao dịch thật.

## 10. Kiến trúc FE để thay dữ liệu mẫu bằng BE sau

Không hardcode data/role/permission trong từng page. Tái sử dụng data access layer hiện có; nếu thiếu, thêm một lớp adapter nhỏ và typed view models trong phạm vi FE.

Phân tách bốn loại:

| Loại | Ví dụ | Cách làm trong đợt FE |
| --- | --- | --- |
| Nội dung tĩnh | Hero, label, giải thích, brand tokens | Tệp FE và i18n, tái sử dụng component |
| Dữ liệu nghiệp vụ | Place, post/revision, profile, task, entitlement, ledger | Demo adapter/fixtures nhất quán; sau này thay bằng BE adapter |
| Trạng thái tạm | Tab, bộ lọc, modal, nháp chưa gửi, draft tiền | URL/client state theo UX; không gọi đó là hồ sơ DB thật |
| Trạng thái ví công khai | Account, chain, balance, allowance | Provider thật khi có config, hoặc mock provider có nhãn |

Các interface FE có thể theo nhóm `explore`, `content`, `profiles`, `session`, `contributions`, `payments`, `benefits`, `expertWork`, `adminOps`, `transparency`. Tên cụ thể theo repo. Đây là interface FE cần dữ liệu, chưa phải quyết định URL/schema server.

- Component nhận view model và gọi adapter; không fetch vào URL BE tưởng tượng hoặc tự thêm server route.
- Adapter trả cả data, capability/eligibility, reasonCodes, version/asOf khi có ý nghĩa. FE dịch reasonCode thành lời giải thích.
- Demo mutations cập nhật một store dùng chung giữa các màn hình. Gửi bài xong phải thấy trong My Contributions; Admin xử lý xong tác giả thấy feedback; không mỗi trang có một mảng mock không liên quan.
- Chỉ mô phỏng các chuyển trạng thái cần để review UX; không xây lại engine kiểm định, sổ kế toán, auth hoặc đối soát chain trong trình duyệt. Validation ở FE giúp nhập đúng; quy tắc có thẩm quyền sau này thuộc BE/contract và được ghi vào handoff.
- Dùng fixture cố định có ngày tham chiếu/demo clock để trạng thái không tự hỏng khi thời gian thực trôi qua. Chỉ advance theo scenario có kiểm soát.
- Đổi account xóa cache dữ liệu cá nhân, key cache theo user/locale/entity/revision phù hợp; public data có thể tái sử dụng.
- Nháp/local demo có version; persist chỉ dữ liệu giả cần thiết trong namespace demo. Không lưu secret/token auth hoặc coi localStorage là cơ chế bảo mật.
- Mọi data giả gắn nhãn môi trường DEMO; không cần lặp “mock/API/BE” khắp sản phẩm. Thông tin kỹ thuật dành cho review panel và handoff, không đưa vào copy bình thường.
- Có chuyển đổi sang chế độ không có dịch vụ: hiển thị “chưa khả dụng/chưa tải được”, không âm thầm đổi lỗi thành demo thành công.

FE mock có thể chứa dữ liệu VIP giả để review, vì thế **không tuyên bố đã bảo vệ nội dung thật phía server**. Tất cả dữ liệu demo phải là dữ liệu được phép công khai. Sau tích hợp, BE chỉ trả projection đúng quyền; FE phải hỗ trợ cấu trúc đó ngay từ bây giờ.

## 11. Giữ ID đúng ý nghĩa trong FE demo

Giữ hệ ID Registry và Masterboard, không cần triển khai database hay công thức key on-chain ở đây.

| Hành trình | ID dùng làm cơ sở | ID mới khi demo adapter chấp nhận thao tác |
| --- | --- | --- |
| Đọc/tìm/lọc/đổi locale | placeId, postId, revisionId, userId theo ngữ cảnh | Không tạo business ID |
| Login lại | Identity/persona đã có | Dùng lại userId; Guest không có ID giả |
| Nháp bài đầu ở điểm có sẵn | userId, placeId | postId; lưu tiếp dùng lại |
| Gửi/sửa snapshot | postId, parentRevisionId nếu có | revisionId và claims; giữ postId |
| Gửi điểm mới | userId, dữ liệu đề xuất | placeId + postId + revisionId khi gửi hợp lệ |
| Mở review/giao việc | revisionId, claims, user/role/scope | reviewCaseId, taskId/reservationId theo từng bước |
| Nhận task/nộp lại | taskId | Nhận không tạo task mới; mỗi nộp tạo submissionId |
| Nghiệm thu/decision | task/submission hoặc reviewCase | acceptanceId/payableId; decisionId riêng |
| Donate/tip | deployment; post/revision/route nếu tip | donationId khi chốt ý định; retry giữ ID |
| Mua/gia hạn VIP | userId, plan; membership hiện có nếu có | membershipId nếu thiếu, paymentId cho đơn mới |
| Xem/claim quyền lợi | user/post/revision/decision; offer hiện có | Dùng lại credentialId/collectibleId của offer; action/attempt chỉ mô phỏng khi cần |
| Báo sai | revisionId/claimId | reportId khi gửi |

Demo adapter trả fixture IDs dạng UUID hợp lệ, ổn định và khớp FK; nếu sinh bản ghi demo mới, chỉ adapter demo tạo ID và gắn môi trường demo. FE thật sau này nhận ID từ BE. Không cấp lại ID trong render/useEffect, khi đổi locale hoặc rerender.

Slug/handle/displayCode là alias/nhãn, không thay ID. Các trường authorUserId, assigneeUserId, payeeUserId cùng tham chiếu userId. TxHash không thay donationId/paymentId; tokenId phải đi với chainId+contract và có thể lớn hơn JS Number an toàn.

Không bịa txHash/địa chỉ triển khai để hiện như thật. Token/route demo có thể ghi “chưa có dữ liệu chain thật”; mọi giá trị mẫu nếu dùng phải không được đưa vào lời gọi ký/chuyển tiền.

## 12. Bảng quyết định tĩnh/động — đầu ra quan trọng của FE

Tạo `FE_DATA_MAP.md` và bản CSV nếu hữu ích cho review. Dùng **một hàng cho một component hoặc một nhóm field cùng nguồn**, không chỉ một hàng cho cả page.

Các cột bắt buộc:

```text
Page/route | Actor | Component | Field/data group | Giá trị demo
Nguồn đang dùng | Nguồn đích đề xuất | ID đầu vào | ID tạo/sử dụng lại
Ai xem | Ai sửa | Khi nào tải/làm mới | Trạng thái lỗi/rỗng/chờ
Client state/persist | Gợi ý cache/render | Quyết định cần Bin chốt
```

Nguồn đích phân biệt: `FE_STATIC`, `FE_LOCAL_STATE`, `BE_DYNAMIC`, `WALLET_PUBLIC_READ`, `CHAIN_VIA_BE`. Đây là nhãn trong tài liệu, không hiển thị lên UI sản phẩm. Dữ liệu từ chain có thể được BE/indexer phục vụ lại; wallet kit không thay việc đối soát nghiệp vụ.

Bảng khởi điểm phải được cụ thể hóa theo code đã làm:

| Component/nhóm field | Phân loại đề xuất | ID/nguồn | Điểm cần quyết định sau review |
| --- | --- | --- | --- |
| Home hero, hai CTA, chữ trong hộp đóng góp | FE_STATIC | i18n/assets/routes | Copy/ảnh đã ổn chưa; có cần CMS sau này không |
| Nav theo phiên và capability | UI tĩnh + BE_DYNAMIC | Session/userId/roles | Quyền/menu phù hợp từng actor |
| Explore filters đang chọn, list/map | FE_LOCAL_STATE | URL/query | Phần nào giữ qua Back/reload |
| Danh mục vùng/hoạt động | FE_STATIC hoặc BE_DYNAMIC, còn mở | regionId/activity code | Có cần Admin tự sửa thường xuyên không |
| Danh sách place, counts, cảnh báo | BE_DYNAMIC | placeId/regionId | Filter/sort/field public cần thiết |
| Khung post, nhãn, help text | FE_STATIC | Component/i18n | Bố cục và lời giải thích |
| Nội dung/claims/nguồn/ảnh theo revision | BE_DYNAMIC | postId/revisionId/mediaId | Field bắt buộc, quyền xem, bản dịch |
| Verification/scope/hạn/hold | BE_DYNAMIC | revisionId/decisionId | Trình bày trạng thái và khi làm mới |
| Post tip eligibility và trạng thái route | BE_DYNAMIC + CHAIN_VIA_BE | revisionId/routeId/deploymentId | Lý do chặn, điểm mở form |
| Modal/tab/draft tiền | FE_LOCAL_STATE | Context hiện tại | Giữ/hủy draft khi nào |
| Địa chỉ ví đang kết nối/số dư | WALLET_PUBLIC_READ | Address+chain+token | Provider/mobile config và thông tin cần hiện |
| Giá VIP, policy giá/quote | BE_DYNAMIC | plan/version/payment khi có | Giá/kỳ/chính sách quote; không hardcode tiền production |
| Quyền VIP hiện hành | BE_DYNAMIC | userId/membershipId | Nội dung được mở, hết hạn/khôi phục |
| Profile/bio/đóng góp | BE_DYNAMIC | userId/handle→userId | Public fields và quyền sửa |
| SBT/NFT status/ownership | CHAIN_VIA_BE + BE_DYNAMIC | credentialId/collectibleId/token identity | Metadata public, các trạng thái người dùng cần hiểu |
| Nháp bài chưa gửi | FE_LOCAL_STATE; BE draft là đề xuất sau | Local draft/postId khi đã có | Có cần đồng bộ nhiều thiết bị không |
| Review/task/submission/decision | BE_DYNAMIC | case/task/submission/decision | Scope, blind review và form có đủ dùng không |
| Sổ quỹ/payout/receipt | CHAIN_VIA_BE + BE_DYNAMIC | Các ID tài chính/asset | Public fields, chi tiết riêng và cách xem pending |
| Ngôn ngữ UI | FE_STATIC | Locale dictionary | Dịch đủ nhãn và khả năng đọc |
| Bản dịch nội dung do người dùng viết | BE_DYNAMIC | revisionId+locale | Dịch thủ công/máy, fallback và dấu nguồn |

Tách **nguồn dữ liệu** khỏi **cách render**: một bài lấy từ BE vẫn có thể prerender/cache bản public sau này; một trang có khung tĩnh vẫn có phần động. Trong đợt FE chỉ ghi gợi ý cache/render, chưa phải lệnh triển khai SSR/ISR/migration.

Sau cùng tạo một danh sách quyết định ngắn dựa trên UI thật đã hoàn thiện: field nào cần/bỏ, dữ liệu nào Bin muốn tự cập nhật, field public/VIP/private, lưu nháp ở đâu, trạng thái nào khó hiểu. Không dùng danh sách này làm cớ dừng trước khi có bản FE review được.

## 13. Design system, mobile và sáu ngôn ngữ

Giữ bộ nhận diện hiện có. Tham chiếu Brand Guide khi thiếu token:

| Token | HEX | Mục đích |
| --- | --- | --- |
| Forest | #173F35 | Chủ đạo/CTA |
| Jade | #2C7563 | Mảng phụ |
| Sage | #DCE8DA | Nền phụ |
| Ivory | #F5F1E8 | Nền đọc |
| Waypoint | #F0A44B | Điểm nhấn |
| Ink | #182522 | Chữ |

- Be Vietnam Pro cho Việt/Anh theo assets hiện có; fallback CJK phù hợp Nhật/Trung/Hàn. Không đổi logo hoặc tạo nhận diện mới.
- Body đọc chính từ 16px; spacing theo hệ thống 4/8/12/16/24/32/48/64; card/button/input dùng tokens thống nhất.
- Màu trạng thái đi với chữ/icon; không chỉ màu. Cam dùng chữ tối phù hợp, không chữ trắng nhỏ thiếu tương phản.
- Mobile ưu tiên một cột, bảng vận hành thành card/scroll có chủ đích; modal cuộn được, input/nút không bị bàn phím che; vùng chạm đủ rộng.
- Focus rõ, label/error liên kết input, keyboard navigation, focus trap đúng modal active, trả focus khi đóng. Loading/async result có thông báo truy cập được.
- Sáu ngôn ngữ: VI, EN, JP, CN giản thể, KR, FR; dùng locale codes thực của repo (`ja`, `ko`, `zh-Hans`… nếu đang dùng), không tạo mã mới chỉ từ tên ngôn ngữ.
- Dịch menu, forms, validation, empty/error, trạng thái công việc/tiền, help, aria-label và metadata. Profile/bài mẫu có nội dung dịch đủ để review; thiếu bản dịch phải đánh dấu fallback.
- Đổi locale giữ entity ID, revision, filter, return context và payment draft. Không reset về Home hoặc tự mở ví/ký lại.
- Không để thông báo “FE-03”, “API chưa nối”, enum kỹ thuật hoặc note developer thành copy sản phẩm. Diễn đạt điều người dùng có thể làm và giới hạn hiện tại bằng lời đơn giản.

## 14. Demo scenarios và kiểm tra có ý nghĩa

Tạo bộ scenario chọn được trong môi trường review/dev; tái sử dụng preview/story tooling hiện có nếu có. Không bắt Bin sửa JSON hoặc mở console để xem trạng thái lỗi. Controls review gọn, tách khỏi trải nghiệm public; không thêm phần dưới Home.

| Scenario | Trải nghiệm cần thấy |
| --- | --- |
| Người đọc mới | Home → Explore → Place → Post → History → People, Back/filter/locale giữ đúng |
| Không có dữ liệu/lỗi | Explore rỗng, API demo lỗi/offline, profile không tồn tại, permission denied; có bước tiếp |
| Đóng góp bài | Login demo → soạn → lưu → preview → gửi → My Contributions → feedback → revision mới |
| Điểm trùng | Đề xuất điểm → thấy ứng viên trùng → chọn viết ở điểm đã có hoặc tiếp tục hồ sơ mới |
| Donate quỹ | Mở từ Home/nav, nhập tiền, connect/mock, preview 100%, pending rồi hoàn tất demo |
| Tip bài | Eligible chia 80/20; revision khác/hold/hết hạn chặn đúng lý do; không tự đổi đích |
| VIP mua/gia hạn | Login, hiển thị tài khoản, payment pending, entitlement demo đúng user; gia hạn giữ kỳ cũ |
| Ví và gián đoạn | Cancel picker, sai mạng, lỗi balance, thiếu gas, timeout/unknown, mở lại cùng intent |
| Quyền lợi | Bài được công nhận chưa có ví; thiết lập nhận tip demo; SBT/NFT claim demo/lỗi riêng |
| Experts/Admin | Offer → nhận → nộp → needs-more → nộp lại → nghiệm thu → quyết định nội dung → payable |
| Công đạt, bài không đạt | Thấy rõ REJECTED nội dung nhưng công vẫn phải trả |
| Báo sai/hold | Report → Admin hold → tip chặn → chain block pending khác blocked demo |
| Hết hạn/quyền | VIP/role/verification hết hạn riêng; không xóa bài/công nợ hoặc tự thu hồi token |
| Sổ quỹ | Funding/donate/tip share/VIP/payout/refund tách loại, USDC/ETH tách số; toàn bộ ghi DEMO |

Kiểm tra trong hệ thống test hiện có: navigation/ID, đổi revision, ownership projection demo, giữ form qua login/locale, mode switching, tiền atomic, pending VIP, double click, cached user data, và bảo đảm demo mutations **không gọi phương thức ký/gửi thật của provider**.

Không dùng FE test để tuyên bố auth/DB/contract đã an toàn. Không viết hàng loạt test chỉ kiểm màu/class CSS. Chạy build/typecheck/lint và test liên quan theo repo, chỉ mở rộng khi còn rủi ro cụ thể.

Kiểm trình duyệt ít nhất desktop 1440px và mobile 390px, thêm 430px/1366px nếu gặp vấn đề bố cục; VI/EN cho hành trình chính và rà các locale còn lại để bắt key thiếu, text overflow, font/glyph. Wallet deep-link thật chưa có điều kiện kiểm phải ghi rõ, không gắn PASS nhờ mock provider.

Lưu ảnh chụp các bề mặt chính và trạng thái quan trọng trong tài liệu QA. Tự xem ảnh để sửa chữ tràn, modal bị che, focus/dialog chồng và khoảng cách thiếu nhất quán; không chỉ dựa vào build thành công.

## 15. Chặng thực hiện và bàn giao

| Chặng | Công việc | Đầu ra review được |
| --- | --- | --- |
| FE-00 | Audit repo/route/component/data source, nguồn xung đột, worktree | Bảng có/thiếu, kế hoạch tái sử dụng, baseline screenshot |
| FE-01 | App shell, tokens, locale, adapter/fixtures, core read pages | Home → Explore → Place → Post → People hoàn chỉnh |
| FE-02 | Login demo, account, editor/new place, preview/history/feedback | Luồng đóng góp đầy đủ và liên kết data demo |
| FE-03 | PaymentModal, wallet read integration, VIP, benefits | Ba mode checkout và bốn nhánh quyền lợi review được |
| FE-04 | Expert/Admin workspace, review/payables/reports/transparency | Luồng vận hành xuyên vai trò demo nhất quán |
| FE-05 | Responsive/i18n/exception scenarios, smoke/behaviour tests, sửa lỗi | FE hoàn chỉnh với cách mở từng scenario |
| FE-06 | Data map, quyết định tĩnh/động theo component, handoff BE/CHAIN | Bản bàn giao để Bin review rồi mới triển khai BE |

Sau mỗi chặng ghi checkpoint: file/route đã làm, test đã chạy, phần còn thiếu và bước kế tiếp. Tiếp tục những phần độc lập, không chờ xác nhận từng thay đổi UI nhỏ. Nếu lỗi lặp qua hai cách thử mà chưa rõ nguyên nhân, ghi chẩn đoán và xử lý dependency thay vì loop vô hạn/tiêu token không kiểm soát.

Cuối cùng cập nhật hoặc tạo trong thư mục tài liệu FE hiện có:

1. **FE_COVERAGE.md:** từng luồng/nhánh Masterboard → actor → điểm vào từ Home → page/component → scenario → ID vào/ra → trạng thái hoàn thành. Đánh dấu nhánh ngoài core như swap/bridge là deferred; không bỏ sót âm thầm.
2. **FE_DATA_MAP.md:** bản đồ field/component theo mục 12; giữ cùng nội dung nếu xuất thêm CSV. Không biến bảng này thành migration/schema BE.
3. **FE_REVIEW.md:** cách chạy/open preview, chọn persona, đi qua scenario và danh sách quyết định cần Bin chốt sau khi trải nghiệm. Có đường vào tất cả khu chính, không link chết.
4. **FE_HANDOFF.md:** interface/data shape FE đang dùng, ID, capability/reasonCodes, ranh giới static/local/BE/Chain; danh sách tích hợp còn thiếu và ghi rõ API/ABI chưa được chốt.
5. **FE_QA.md:** lệnh và kết quả thật, ảnh desktop/mobile, locale đã kiểm, các lỗi đã sửa và phần SKIPPED/BLOCKED.

Tóm tắt kết quả cuối theo ba nhóm: **đã hoàn thiện FE**, **đang chạy demo**, **chờ tích hợp dịch vụ**. Cung cấp lệnh khởi động thực tế và địa chỉ preview thực sự chạy, không bịa link. Nếu không chạy được trình duyệt/preview, nêu đúng giới hạn và bàn giao cách chạy local, không tuyên bố đã kiểm hình ảnh.

Chỉ coi đợt FE hoàn tất khi luồng chính đi được từ đầu đến cuối bằng demo, trạng thái lỗi có thể xem, data liên trang nhất quán, giữ đúng thương hiệu/ngôn ngữ và đã có bảng để quyết định tĩnh/động. Không cần BE/CHAIN chạy thật để nghiệm thu đợt này.

**Bắt đầu kiểm tra repository và thực hiện FE-00 ngay.**

---

## Nguồn đối chiếu của bản prompt

- Giao diện công khai `https://ventlore.com/vi/` đã kiểm tra trong lượt trước ngày 26/09/2026: Home, Explore, Place, Post/revision, People VI→EN, Login, VIP, Transparency.
- `Ventlore_Journeys_FE_BE_Chain_Masterboard_v1_1.pdf`.
- `Ventlore_Wallet_Architecture_v1_1.md`: ví ngoài và VIP theo tài khoản.
- `Ventlore_ID_Registry_v0_3.csv`, `Ventlore_Logic_ID_DB_v0_3.pdf`.
- `Ventlore_Event_UI_Spec_v0_3(1).pdf`, các wireframe v0.3 liên quan.
- `Ventlore_Brand_Guide_v0_1.pdf`.
- `Ventlore_Prompt_Wallet_Donate_Tip.md` và `Ventlore_Lenh_Khoi_dong_FE_BE_Chain.md` để kế thừa component/payment và ranh giới worktree.

Các nguồn cũ về số trang, role AUTHOR hoặc VIP theo ví chỉ giữ phần không mâu thuẫn với yêu cầu mới. Prompt này giao làm FE; không xác nhận BE/contract/production hiện tại đã hoạt động.
