# Ventlore — Prompt 01, vòng 4
## HomePage: thiên tai, cộng đồng giúp nhau và “Explore your destination”

Bản triển khai hợp nhất sau review ngày 24/09/2026, đã bổ sung hai yêu cầu mới của Bin:
- Hình ảnh mở đầu là một cảnh thiên tai với con người đang hỗ trợ nhau.
- Chữ “Explore your destination” nằm ở chính giữa ảnh trong bản tiếng Anh. Thông điệp đóng góp cộng đồng nằm ngay bên dưới.

**Cách dùng:** mở đúng project Ventlore trong coding agent; copy toàn bộ phần giữa “Bắt đầu prompt” và “Kết thúc prompt”. Chạy như một nhiệm vụ liên tục: khảo sát code → sửa lỗi → triển khai HomePage → kiểm thử → bàn giao. Prompt tự chứa các yêu cầu chính, không bắt buộc agent có cuộc trò chuyện trước.

Đây là prompt triển khai tiếp trên code hiện tại. Tài liệu review trước vẫn là bản ghi bằng chứng; prompt này chuyển các đề xuất thành đầu việc và cập nhật hướng thiết kế HomePage mới nhất.

---

## Bắt đầu prompt

Bạn đang làm việc trong repository Ventlore hiện tại. Hãy trực tiếp triển khai các thay đổi dưới đây, kiểm tra kết quả và bàn giao bản có thể review. Không dừng ở việc phân tích hoặc đưa ra kế hoạch.

### 0. Mục tiêu và cách bắt đầu

Hoàn thành cả ba nhóm:
1. Thêm HomePage có hình ảnh thiên tai và sự giúp đỡ nhau, tiêu đề nằm chính giữa ảnh.
2. Sửa triệt để chuyển ngữ hồ sơ cùng các lỗi UI/điều hướng/kiểm định liên quan còn tồn tại.
3. Giữ các chức năng đang hoạt động, kiểm thử desktop/mobile và sáu ngôn ngữ.

Ngôn ngữ bắt buộc: Việt (vi), Anh (en), Nhật (ja), Trung giản thể (zh-Hans), Hàn (ko), Pháp (fr).

Trước khi sửa:
- Đọc hướng dẫn repository, package/config, router, i18n, dữ liệu demo, session/entitlement và test hiện có.
- Xác định branch, commit và bản build đang làm. Không mặc định preview và production là cùng một bản.
- Đọc các tài liệu có trong project: ID Registry 0.3, Logic-ID-DB 0.3, Event/UI Spec 0.3, Wireframes 0.3 và Brand Guide 0.1. Giữ các quy tắc nghiệp vụ và ID đã chốt.
- Tái hiện lỗi còn tồn tại trên bản đang sửa; lỗi đã được sửa thì giữ kết quả và thêm kiểm tra hồi quy phù hợp.
- Giữ thay đổi chưa commit của người dùng. Chọn cách chỉnh sửa gọn theo kiến trúc đang có.

Bối cảnh review:
- Ảnh bản mới của An ở /en/people/an_vip_explorer cho thấy nhãn UI đã là Anh, nhưng bio vẫn Việt kèm “Original bio in vi”.
- Bản https://venlore.netlify.app đã được kiểm tra và có nhiều lỗi hơn ảnh mới. Tên miền https://ventlore.com chặn trình duyệt của người review; chưa xác minh hai nơi dùng cùng deploy.
- Do đó, xem các lỗi liệt kê dưới đây là đầu vào để tái hiện trên code hiện tại, không sửa mù theo một bản cũ.

### 1. HomePage — quyết định thiết kế mới nhất

#### 1.1. Cảnh mở đầu

Tạo một hero có ảnh phủ toàn khối, thể hiện **thiên tai và sự giúp đỡ nhau** trong bối cảnh hoạt động ngoài trời.

Cảnh đề xuất thống nhất:
- Một vùng núi hoặc đường mòn sau mưa bão lớn.
- Dấu vết thiên tai nhìn rõ: đoạn đường bị sạt lở, cây đổ, bùn đất, mây mưa; dòng nước dâng có thể ở hậu cảnh.
- Ở khu vực ổn định trong tiền cảnh, người địa phương và người đi đường đang hỗ trợ nhau: đưa nước/áo ấm, đỡ một người mệt, cùng xem bản đồ để tìm lối đi phù hợp.
- Hành động hỗ trợ và sự gắn kết giữa con người là điểm nhìn chính. Ánh sáng gợi hy vọng sau mưa; cảnh có chiều sâu và cảm giác thực tế.
- Thể hiện con người có phẩm giá, không dùng cảnh thương tích gây sốc. Không dàn dựng thao tác vượt lũ hoặc cứu hộ nguy hiểm để làm hình quảng cáo.

Ảnh cần thể hiện được cả bối cảnh thiên tai lẫn hành động giúp đỡ nhau. Dùng một cảnh có câu chuyện nhất quán, không ghép nhiều loại thảm họa thành một bức ảnh hỗn loạn.

Ảnh có thể là:
- Ảnh thật có quyền sử dụng và nguồn rõ ràng; hoặc
- Ảnh minh họa mô phỏng được tạo riêng, có chú thích theo ngôn ngữ đang chọn.

Đối với ảnh mô phỏng, chú thích phù hợp là “Hình minh họa về sự hỗ trợ cộng đồng sau thiên tai”. Không ghi đây là hoạt động cứu hộ thật của Ventlore, một sự kiện thật hoặc một địa điểm cụ thể nếu chưa có bằng chứng.

Hình ảnh thể hiện tinh thần tương trợ và động lực phòng ngừa rủi ro. Nội dung sản phẩm phải giải thích đúng vai trò hiện có của Ventlore: kết nối, chia sẻ, kiểm tra và cập nhật tri thức địa phương. Chỉ giới thiệu năng lực cứu hộ/ứng cứu trực tiếp nếu hệ thống thực sự có chức năng và tổ chức vận hành tương ứng.

#### 1.2. Bố cục chữ chính giữa ảnh — bắt buộc

Trong bản tiếng Anh, đặt chính xác dòng sau ở vị trí trung tâm:

**Explore your destination**

Đây là H1 của trang:
- Căn giữa theo chiều ngang.
- Cụm nội dung H1 + thông điệp phụ + CTA được cân đối quanh trung tâm khối hero.
- H1 là yếu tố chữ nổi bật nhất, không đẩy về cột trái.
- Chữ là HTML thật, không đóng sẵn vào ảnh.
- Mỗi trang chỉ có một H1.
- Người trong ảnh nằm lệch khỏi vùng chữ trung tâm; giữ nhìn rõ khuôn mặt và hành động giúp đỡ nhau.
- Dùng lớp phủ xanh rừng/gradient tối có kiểm soát để chữ rõ trên ảnh ở mọi kích thước.

Thứ tự nội dung trong cụm trung tâm:
1. H1 “Explore your destination” ở bản Anh, bản dịch tương ứng ở các locale khác.
2. Thông điệp đóng góp cộng đồng.
3. Một câu ngắn giải thích cách đóng góp có ích.
4. Hai CTA.
5. Chú thích ảnh ở vị trí nhỏ, rõ, không cạnh tranh với H1.

Thông điệp đóng góp là nội dung hỗ trợ cho H1. Không thay dòng H1 trung tâm bằng câu kêu gọi đóng góp hoặc bằng tagline cũ.

#### 1.3. Nội dung hero chốt để triển khai

**Tiếng Việt**

- H1: **Khám phá điểm đến của bạn**
- Thông điệp: **Đóng góp của bạn có thể giúp giảm những tai nạn ngoài trời.**
- Giải thích: “Chia sẻ hiểu biết địa phương, cập nhật điều kiện thực tế và cùng kiểm tra thông tin để người đi sau chuẩn bị tốt hơn cho hành trình.”
- CTA chính: **Bắt đầu khám phá**
- CTA phụ: **Tôi muốn đóng góp**

**English**

- H1: **Explore your destination**
- Supporting message: **Your contribution can help prevent outdoor accidents.**
- Description: “Share local knowledge, report changing conditions, and help verify information so others can better prepare for their journeys.”
- Primary CTA: **Start exploring**
- Secondary CTA: **I want to contribute**

Dùng cách diễn đạt có điều kiện “có thể / can help”. Không tự thêm tỷ lệ tai nạn giảm, số người được cứu hoặc lời hứa an toàn tuyệt đối.

Bản dịch H1 cho sáu locale:

| Locale | H1 |
|---|---|
| vi | Khám phá điểm đến của bạn |
| en | Explore your destination |
| ja | あなたの旅先を探そう |
| zh-Hans | 探索你的目的地 |
| ko | 나만의 여행지를 찾아보세요 |
| fr | Explorez votre destination |

Dịch tự nhiên thông điệp, mô tả, nút, chú thích ảnh và toàn bộ các phần bên dưới sang cả sáu ngôn ngữ. Không giữ tiêu đề tiếng Anh trên mọi locale chỉ vì nó là mẫu bố cục.

#### 1.4. Hành vi của CTA

- “Bắt đầu khám phá” → /{locale}/explore/.
- “Tôi muốn đóng góp” → phần #contribute trên cùng HomePage.
- Phần #contribute giải thích rõ ba hình thức: chia sẻ quan sát; tham gia kiểm tra theo điều kiện phù hợp; ủng hộ quỹ cộng đồng qua luồng đã có.
- Từ phần đóng góp, dẫn tới đúng chức năng hiện có; nếu cần đăng nhập thì giữ locale và ý định cần tiếp tục.
- Nếu một loại đóng góp chưa được triển khai, mô tả rõ trạng thái và chỉ cung cấp hành động có thật. Không dựng nút gửi tiền, SOS hoặc đăng ký giả để lấp chỗ.

Cách làm này giúp người mới hiểu “đóng góp” bao gồm tri thức, thời gian và hỗ trợ tài chính theo chức năng thực tế, không chỉ là một nút donate.

#### 1.5. Responsive và hiệu năng hero

- Desktop: ảnh rộng theo trang; khối hero đủ lớn để thể hiện câu chuyện nhưng CTA vẫn nằm trong màn hình đầu ở kích thước desktop thông dụng.
- Mobile: giữ tiêu đề và CTA ở trung tâm; dùng crop hoặc ảnh dọc riêng để vẫn thấy hành động hỗ trợ. Không chỉ thu hẹp ảnh ngang khiến con người bị cắt khỏi khung.
- H1 gợi ý khoảng 56–72 px desktop và 32–40 px mobile, điều chỉnh theo font và độ dài từng ngôn ngữ.
- Cho phép nội dung tăng chiều cao; tránh chiều cao cố định làm cắt dòng chữ Pháp hoặc CTA ở điện thoại.
- Dùng ảnh đáp ứng kích thước màn hình, có width/height hoặc aspect-ratio để hạn chế nhảy bố cục; ưu tiên tải ảnh hero, lazy-load ảnh bên dưới.
- Bản đầu dùng ảnh tĩnh chất lượng tốt. Nếu thêm chuyển động, tôn trọng prefers-reduced-motion và giữ ảnh tĩnh dự phòng.
- Kiểm tra tương phản chữ trực tiếp trên ảnh; body tối thiểu 16 px, vùng bấm ít nhất 44 px.
- Ảnh có ý nghĩa cần alt theo ngôn ngữ mô tả cảnh đúng thực tế; ảnh trang trí không tạo nội dung lặp cho trình đọc màn hình.

### 2. Nội dung bên dưới hero

Bố cục cần dẫn từ cảm xúc về sự tương trợ sang cách Ventlore giúp mọi người chuẩn bị và chia sẻ thông tin.

#### 2.1. Vì sao Ventlore tồn tại?

Tiêu đề: **Một thông tin được chia sẻ có thể tạo nên khác biệt.**

Nội dung tiếng Việt:
“Một lối đi bị sạt lở, một con nước thay đổi hay một điều kiện thời tiết tại chỗ có thể quen thuộc với người địa phương nhưng xa lạ với người lần đầu đến. Ventlore ra đời để những hiểu biết ấy được chia sẻ, đối chiếu và cập nhật, giúp giảm những rủi ro có thể tránh từ việc thiếu thông tin.”

Làm rõ mối liên hệ giữa hình ảnh thiên tai ở hero và việc chia sẻ tri thức trước hành trình. Không biến thiên tai thành lời thúc ép người xem quyên góp.

#### 2.2. Tầm nhìn và sứ mệnh

**Tầm nhìn**

“Một cộng đồng khám phá toàn cầu, nơi tri thức địa phương giúp con người hiểu nơi mình đến, tôn trọng thiên nhiên và gắn kết với những người đang sống ở đó.”

**Sứ mệnh**

“Kết nối người khám phá với cộng đồng địa phương; biến những quan sát thực tế thành thông tin có nguồn, có thời điểm và có phạm vi kiểm tra rõ ràng; ghi nhận người đóng góp và minh bạch cách nguồn lực cộng đồng được sử dụng.”

Trình bày thành hai khối gọn, dễ đọc. Hình ảnh bổ trợ có thể cho thấy người địa phương trao đổi thông tin với người đi đường.

#### 2.3. Cách Ventlore hoạt động

Ba bước:
1. **Chia sẻ:** người từng đến ghi lại quan sát, thời điểm và nguồn thông tin.
2. **Kiểm tra:** người kiểm tra độc lập đối chiếu những nội dung trong phạm vi được giao.
3. **Cập nhật và ghi nhận:** người đọc xem trạng thái, ngày và nguồn; cộng đồng cập nhật thay đổi và đóng góp được ghi nhận theo điều kiện của hệ thống.

Gần phần này, giải thích ngắn:
“Thông tin được kiểm tra theo phạm vi và thời điểm cụ thể. Điều kiện thực tế có thể thay đổi; việc kiểm tra không bảo đảm an toàn tuyệt đối.”

Không ngầm khẳng định mọi bài đều được duyệt, mọi địa điểm đều an toàn hoặc mỗi bài đăng tự động tạo phần thưởng/token.

#### 2.4. Bắt đầu khám phá

Hiển thị một số địa điểm thật từ cùng nguồn dữ liệu Explore:
- Ảnh đúng địa điểm, tên đã dịch, mô tả ngắn, liên kết theo locale.
- Mỗi card mở đúng canonicalPlaceId.
- Nút “Xem tất cả địa điểm” dẫn sang Explore.
- Dữ liệu demo được nhận diện phù hợp; không tạo số liệu thành tích mới.

#### 2.5. Phần đóng góp — #contribute

Ba khối:
- **Chia sẻ điều bạn biết:** quan sát thực địa, thay đổi trên đường đi, nguồn tham khảo.
- **Góp thời gian kiểm tra:** giới thiệu vai trò và điều kiện tham gia kiểm tra độc lập, liên kết luồng có thật.
- **Ủng hộ cộng đồng:** giải thích quỹ hỗ trợ việc đóng góp/kiểm tra theo chính sách hiện có, dẫn tới minh bạch và luồng hỗ trợ đã triển khai.

Không mô tả tiền đóng góp được dùng cho cứu trợ khẩn cấp nếu chính sách quỹ và luồng vận hành đó chưa được chốt.

#### 2.6. Minh bạch và CTA cuối

Đoạn ngắn về cách ghi nhận đóng góp và công khai sử dụng nguồn lực; liên kết trang minh bạch.
CTA cuối: “Bắt đầu khám phá” và “Tìm hiểu cách đóng góp”.

Giữ câu thương hiệu “Hiểu nơi đến. Vững bước đi.” ở vị trí phù hợp như footer. Hero dùng H1 đã chốt ở mục 1.

### 3. Routing và điều hướng Home → Explore

- Tạo HomePage tại /vi/, /en/, /ja/, /zh-Hans/, /ko/, /fr/.
- Logo dẫn về HomePage của locale hiện tại.
- Giữ nguyên /{locale}/explore/ và các deep link địa điểm, bài, hồ sơ.
- Navbar đề xuất: Trang chủ, Khám phá, Sứ mệnh, Minh bạch, VIP; bộ chọn ngôn ngữ và tài khoản.
- “Sứ mệnh” dẫn tới anchor trên HomePage cùng locale.
- Khách mở URL bài hoặc hồ sơ vào thẳng nội dung; không bắt qua HomePage.
- Khi URL đã có locale, locale trên URL có ưu tiên. Chỉ ở URL gốc mới xét ngôn ngữ đã chọn/trình duyệt được hỗ trợ; dự phòng en.
- Giữ S01 là Explore, S04 là hồ sơ theo tài liệu; đăng ký mã Home mới phù hợp registry mà không đổi các ID cũ.
- Cập nhật title, description, canonical, hreflang, sitemap và HTML lang theo hệ thống đang dùng.
- Trang Home phải được render đủ sáu locale ngay trong lần bàn giao này.

### 4. P1 — Sửa đa ngôn ngữ hồ sơ và dữ liệu dùng chung

Phạm vi tối thiểu: an_vip_explorer, bin_traveler, minh_trailguide, hoang_ranger; đồng thời kiểm tra mọi hồ sơ demo khác đang có trong repository.

#### 4.1. Yêu cầu chức năng

- Bio demo có bản dịch đầy đủ ở sáu locale.
- Nhãn trường, vai trò, danh sách đóng góp, nút đọc bài, chứng nhận, ngày cấp, loading/empty/error đều theo locale.
- Cùng một hồ sơ dùng chung nguồn bio ở trang cá nhân, AuthorCard trong bài và các thẻ người dùng.
- Cùng bài/phiên bản dùng cùng bản dịch tiêu đề ở hồ sơ, trang địa điểm, nội dung bài và lịch sử phiên bản.
- Giữ tên riêng, handle, UUID, mã tra cứu, wallet và token ID. Dịch nhãn vai trò và nội dung mô tả riêng.
- Phân biệt bài do người đó viết với bài người đó tham gia kiểm tra; nhãn “Thẩm định viên” là một trường vai trò đã dịch.
- Khi profile rỗng, hiển thị thông báo phù hợp và CTA có thật.

Không coi việc chỉ thêm “Original bio in vi” là hoàn thành chuyển ngữ hồ sơ demo.

#### 4.2. Nội dung demo và nội dung người dùng thật

- Nội dung demo do dự án kiểm soát: bổ sung bản dịch, không dừng ở fallback Việt.
- Nội dung người dùng thật: bảo toàn bản gốc; ưu tiên bản dịch có sẵn; nếu thiếu thì thông báo ngôn ngữ nguồn bằng tên dễ hiểu.
- Ví dụ tiếng Anh: “Original bio in Vietnamese”, không phơi mã vi như một nhãn sản phẩm.
- Nếu triển khai dịch máy, ghi rõ là bản dịch tự động, cho xem bản gốc và xử lý trạng thái thất bại. Không tự gắn kiểm định nội dung cho bản dịch.
- Không bắt buộc tích hợp dịch vụ AI trả phí chỉ để dịch fixture demo.

#### 4.3. Kiểm tra trong code

- Tìm chuỗi viết trực tiếp trong component và chuỗi trong fixture/database không đi qua bộ chọn bản dịch.
- Tìm trường hợp locale đổi nhưng memo/cache không cập nhật.
- Nếu lưu nội dung đã dịch trong cache, đưa locale vào key cùng các chiều user/quyền/revision cần thiết.
- Chuẩn hóa zh-Hans xuyên suốt router, dictionary và dữ liệu; không để sai tên locale dẫn đến fallback âm thầm.
- Dùng userId cho định danh, handle là alias; không dùng tên đã dịch làm khóa liên kết.
- Dữ liệu dịch bài gắn đúng postId/revisionId và tách khỏi snapshot nguồn bất biến. Không sửa source đã freeze hoặc thay contentHash chỉ để hiển thị ngôn ngữ khác.
- Nếu dữ liệu đang được lưu trong DB, có phương án bổ sung bản dịch vào bản ghi hiện có; sửa seed đơn thuần không đủ cho DB đã tồn tại. Không xóa dữ liệu người dùng để nạp lại demo.
- Không báo hoàn thành chỉ vì dictionary có đủ key; phải đọc nội dung thực tế trên trang.

### 5. P0 — Trạng thái kiểm định nhất quán

Tái hiện tại bài PST-000002, route:
https://venlore.netlify.app/en/posts/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e20/

Review cũ thấy đồng thời:
- “Unverified Community Submission”
- “pending independent on-site verification”
- “Independently audited…”
- “Audited Claims”

Sửa nguồn sinh badge, mô tả, claim, ngày và quyền tip theo trạng thái hiệu lực của đúng revision đang xem.

| Trạng thái | Cách diễn đạt |
|---|---|
| UNVERIFIED | Thông tin cộng đồng, chưa được kiểm tra độc lập |
| IN_REVIEW | Đang được kiểm tra trong phạm vi nêu rõ |
| VERIFIED | Đã kiểm tra trong phạm vi, có ngày và hiệu lực |
| NEEDS_CHANGES / quyết định CHANGES_REQUESTED theo schema thực | Cần bổ sung/chỉnh sửa; không mô tả như đã được phê duyệt |
| INCONCLUSIVE | Chưa đủ căn cứ kết luận |
| REJECTED | Kết quả không được chấp nhận theo quyết định tương ứng |
| EXPIRED | Việc kiểm tra trước đây đã hết hiệu lực, cần cập nhật |
| SUSPENDED | Hiệu lực hiện bị tạm dừng theo trạng thái nguồn |

Không đổi enum/schema tùy tiện; map đúng giữa quyết định và trạng thái hiệu lực hiện có.

- Nhận định chưa được kiểm tra không có heading “Audited Claims”.
- Chỉ nhận định nằm trong phạm vi đã kiểm tra được gắn nhãn tương ứng.
- Giữ quan hệ revisionId, claimId, decisionId, checkedAt, validUntil và scope.
- Bản mới không kế thừa badge hoặc tip route của bản cũ.
- Thông tin lịch sử đã kiểm tra có thể được giữ, nhưng phải phân biệt với hiệu lực hiện tại.
- Không dùng màu hoặc badge cho toàn địa điểm để hàm ý an toàn tuyệt đối.

### 6. P1 — Giữ ngữ cảnh và sửa đường dẫn

#### 6.1. Chuyển ngôn ngữ

Giữ các trạng thái liên quan:
- Từ khóa tìm kiếm.
- Region/activity ID, sort, view danh sách/bản đồ.
- Phân trang/cursor hợp lệ.
- postId, revisionId, user/handle đang xem.
- Query, hash và returnTo nội bộ hợp lệ.
- Phiên đăng nhập/quyền không thay đổi chỉ vì đổi locale.

Không dịch ID filter. Nội dung label được dịch; giá trị liên kết giữ nguyên.

Ca tái hiện:
Explore Anh → tìm “cat ba” → chọn Kayak → có một kết quả → đổi Pháp. Kết quả mong đợi vẫn giữ từ khóa và Kayak, không trở về ba địa điểm mặc định.

Đưa trạng thái có thể chia sẻ vào URL theo kiến trúc hiện có. Back/Forward và reload khôi phục đúng.

#### 6.2. Tây Côn Lĩnh

Route cần kiểm tra:
 /en/places/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e09/

Review thấy mở route này và bấm thẻ tương ứng từ Explore Việt đều quay về /vi/explore/.

- Kiểm tra dữ liệu canonical, route generation, fallback và cấu hình deploy/redirect.
- Mở được từ card, bản đồ, bài liên quan và deep link ở tất cả locale.
- Không chuyển trang lỗi về Explore Việt âm thầm.
- Route không hợp lệ hiển thị trang không tìm thấy cùng ngôn ngữ và đường quay lại phù hợp.

#### 6.3. Persona và VIP demo

Review quan sát nút “Switch to VIP Persona” đổi header sang An nhưng paywall vẫn hiển thị; trang gói lại ghi membership ACTIVE. Cần tái hiện độc lập trong một tab, sau đó kiểm tra nhiều tab nếu session được đồng bộ.

Kiểm tra session persistence, entitlement, thời hạn, refetch và cache. Membership quyết định quyền đọc, không chỉ tên role. UI cần phản ánh cùng trạng thái khi chuyển trang/tải lại. Không kết luận đây là lỗi server chỉ dựa trên fixture.

### 7. Explore, bài viết và hồ sơ sau khi có HomePage

**Explore**
- Thu gọn hero giới thiệu hiện tại thành H1 “Khám phá điểm đến” và một câu mô tả.
- Đưa tìm kiếm, filter, chuyển bản đồ/danh sách và kết quả lên cao.
- Desktop khoảng 1366 × 900 nhìn thấy tên và thông tin hữu ích của hàng kết quả đầu.
- Mobile có bộ lọc dễ mở/đóng, số filter đang áp dụng và hành động xóa rõ.
- Giữ bản đồ và liên kết đang hoạt động; marker có nhãn tên địa điểm dễ đọc bằng công nghệ hỗ trợ.

**Ảnh địa điểm**
- Dùng ảnh thật đúng địa điểm, có nguồn/quyền sử dụng.
- Hình hero thiên tai mô phỏng không được tái sử dụng như bằng chứng về tình trạng hiện tại của một địa điểm.
- Không gắn ảnh nơi khác vào tên địa điểm cụ thể.

**Bài viết**
- Mặc định thu gọn lịch sử; nút “Xem lịch sử phiên bản”.
- Trạng thái hiện tại, ngày, phạm vi và cảnh báo vẫn dễ thấy.
- Mã kỹ thuật ở phần chi tiết; không xóa khả năng tra cứu.
- Thẻ dẫn đến bài dùng “Đọc bài viết”/“Read field report”, không ghi “View Destination”.

**Hồ sơ**
- Ưu tiên avatar, tên, bio, vai trò có ý nghĩa và đóng góp.
- Avatar riêng/ảnh có quyền dùng hoặc chữ cái đại diện cho demo.
- User ID và token ID vào phần chi tiết có sao chép nếu phù hợp.
- VIP, chứng nhận và quyền chuyên gia trình bày riêng.

### 8. Đơn giản hóa câu chữ, VIP và minh bạch

- Sửa dấu hai chấm lặp: Role::, Author::, Verification Scope::.
- Plural đúng ở 0/1/n; sửa “1 field posts”, “1 articles de terrain”.
- Giờ dùng “16:00” hoặc “4:00 PM” tùy locale, không “16:00 PM”.
- Dịch cả loading, empty, lỗi, option, chip, alt, aria-label, tooltip, mô tả chứng nhận, phần bản đồ “ghim”, nguồn thu và mục đích chi.
- Rà soát metadata và tiêu đề trình duyệt theo trang/ngôn ngữ.

**VIP**
- Thống nhất lợi ích thực tế của nội dung tuyển chọn/hướng dẫn chuyên sâu.
- Xử lý thông điệp cũ về “tọa độ khẩn cấp”/“hốc trú bão” ở trang gói, Login, bài mẫu, profile và lịch sử tương ứng.
- Cảnh báo thiết yếu được công khai. VIP không là uy tín hoặc quyền chuyên gia.
- Giữ giá/chính sách hiện hành đã chốt trong cấu hình; baseline tài liệu là 15 USD cho 12 tháng lịch, gia hạn chủ động.

**Minh bạch**
- Mã OWNER_FUNDING, VIP_REVENUE, PROJECT_DONATION, POST_TIP_SHARE có nhãn dễ hiểu đã dịch.
- Dữ liệu demo có nhãn ngay tại khu vực số liệu.
- Dữ liệu thật có kỳ báo cáo, thời điểm cập nhật, nguồn và liên kết giao dịch/receipt đầy đủ khi có.
- Chỉ dùng mô tả “thời gian thực”, “đã đối soát”, “bảo vệ danh tính” khi có triển khai và bằng chứng tương ứng.
- Không đưa các số liệu minh họa lên Home như thành tích đã đạt.

### 9. Design system và các quy tắc phải giữ

Màu theo Brand Guide:
- Forest #173F35
- Jade #2C7563
- Sage #DCE8DA
- Ivory #F5F1E8
- Waypoint #F0A44B
- Ink #182522

Giữ logo đúng tỷ lệ và khoảng thoáng. Dùng nền/overlay để logo và chữ rõ trên ảnh. Font Việt/Anh theo brand; bổ sung font phù hợp Nhật/Trung/Hàn.

Quy tắc nghiệp vụ:
- Đọc public không buộc đăng nhập hoặc kết nối ví.
- userId, canonicalPlaceId, postId/revisionId và các ID nghiệp vụ được giữ nhất quán.
- Snapshot đã freeze không sửa đè.
- PROJECT chuyển 100% vào quỹ; POST_TIP chia 80% tác giả/20% quỹ theo logic hiện hành; không thay công thức trong lần sửa UI.
- Donation không tự cấp VIP. Payment pending không được diễn giải thành quyền đã cấp.
- Quyền đọc và thao tác kiểm ở nguồn có thẩm quyền; ẩn nút không thay thế kiểm quyền.
- Không nới quyền, lộ dữ liệu hạn chế, thay hợp đồng onchain hoặc tạo cơ chế thanh toán mới để hoàn thành giao diện.
- Không tự thay cách vận hành dự án thành dịch vụ cứu hộ chỉ vì HomePage có cảnh hỗ trợ sau thiên tai.

### 10. Prompt hình ảnh hỗ trợ triển khai hero

Dùng phần này khi công cụ tạo ảnh có sẵn. Nếu dùng ảnh thật, áp dụng các tiêu chí bố cục tương đương và ghi nguồn.

“Create a cinematic, photorealistic editorial illustration for Ventlore, showing a fictional scene of community solidarity after a severe mountain storm. A visibly damaged hiking trail, fallen branches, wet earth and a distant swollen stream establish the natural-disaster context. On stable ground in the foreground, local residents and hikers help one another: sharing drinking water, offering a warm jacket and studying a map together. The emotional focus is mutual care, practical cooperation and hope. Show credible outdoor clothing and natural human gestures. Arrange the people and their helping gestures mainly in the lower side thirds, keeping a quiet central area suitable for a centered website headline and two buttons. Deep forest greens, muted earth tones, soft rain haze and a restrained warm amber break in the clouds. Wide landscape composition for desktop, with a companion portrait composition preserving the same story for mobile. No typography, logos or watermarks inside the image. Respectful, non-graphic imagery. This is an illustrative fictional scene, not documentation of an actual event or a Ventlore rescue operation.”

Tạo hoặc chọn asset thực tế và tích hợp vào code. CSS render chữ “Explore your destination” và các bản dịch lên ảnh. Không yêu cầu công cụ ảnh vẽ chữ.

Ghi rõ nguồn/quyền dùng hoặc trạng thái ảnh mô phỏng. Nếu công cụ/asset chưa sẵn có, hoàn thành bố cục và chức năng có thể kiểm tra, đồng thời ghi phần ảnh còn thiếu một cách rõ ràng; không tuyên bố hero hoàn thiện khi vẫn dùng placeholder.

### 11. Kiểm thử và điều kiện nghiệm thu

Đây là yêu cầu bắt buộc kiểm tra trên bản đang sửa.

| Nhóm | Điều kiện đạt |
|---|---|
| Hero | Ảnh thể hiện cả thiên tai và giúp đỡ nhau; H1 Anh đúng “Explore your destination”, nằm giữa ảnh |
| Thông điệp | Câu đóng góp nằm dưới H1; giải thích rõ đóng góp tri thức/kiểm tra/hỗ trợ; không tạo lời hứa về năng lực chưa có |
| Home | Tầm nhìn, sứ mệnh, cách hoạt động, địa điểm, đóng góp, minh bạch và CTA hoạt động |
| Đa ngôn ngữ Home | Tất cả chữ HTML, nút, chú thích ảnh, alt và metadata đủ sáu locale |
| Profile | Mọi hồ sơ demo × sáu locale; bio, nhãn, chứng nhận, thẻ bài và trạng thái trống/lỗi đúng |
| Dùng chung dữ liệu | Cùng user/post/revision nhất quán giữa profile, bài, địa điểm, lịch sử |
| Navigation | Đổi locale, reload, Back/Forward, URL trực tiếp giữ đối tượng và trạng thái liên quan |
| Filter | “cat ba” + Kayak vẫn giữ sau đổi sang Pháp và tải lại |
| Tây Côn Lĩnh | Liên kết và deep link mở đúng chi tiết; không rơi về Explore Việt |
| Revision | Chọn REV-000003 → đổi ngôn ngữ → reload vẫn giữ revisionId và nội dung/trạng thái của bản đó |
| Verification | UNVERIFIED không có câu khẳng định đã kiểm tra; claim/badge/expiry/tip cùng một revision |
| VIP | Guest/Active/Expired nhất quán; đổi persona demo phản ánh đúng entitlement |
| Responsive | Kiểm tra 1440, 1024, 390, 360 px; ảnh crop đúng, chữ/CTA không bị cắt, không tràn ngang |
| Accessibility | Focus, bàn phím, nhãn nút và tương phản; không chỉ dùng màu để diễn đạt trạng thái |
| Media | Ảnh tối ưu, nguồn rõ, tải lỗi có fallback phù hợp, không ảnh gãy hoặc sai địa điểm |
| Metadata | Title, lang, canonical/hreflang đúng trang và ngôn ngữ |
| Nội dung | Không key dịch thô, dấu ::, plural sai hoặc chữ Việt ngoài ngoại lệ hợp lệ |
| Triển khai | Ghi rõ commit/deploy ID; xác nhận preview được kiểm thử là bản chứa các thay đổi |

Test tự động nên tập trung vào rủi ro cụ thể:
- Bộ chọn bản dịch và việc giữ bản gốc.
- Hiển thị trường dữ liệu demo đúng locale.
- Bảo toàn route/query/filter/revision.
- Map trạng thái kiểm định.
- Entitlement và cache khi đổi tài khoản demo.
- Smoke test các luồng Home → Explore → địa điểm → bài → hồ sơ.

Kiểm tra văn bản dựa trên dữ liệu mong đợi; không chỉ tìm chữ có dấu vì tên riêng hợp lệ vẫn có thể là tiếng Việt.

Chạy build/lint/typecheck/test theo công cụ thực tế của repository. Kết quả build thành công không thay thế việc mở giao diện để xem bio, chữ trên ảnh và các trạng thái lỗi.

### 12. Cách thực hiện và bàn giao

Thực hiện theo thứ tự:
1. Xác định code/deploy, kiểm tra lỗi đang còn.
2. Sửa lớp dữ liệu dịch, router/state và thông tin kiểm định.
3. Tạo HomePage và asset theo bố cục trung tâm đã chốt.
4. Tinh gọn Explore; đồng bộ profile, bài, VIP, Login và minh bạch.
5. Kiểm thử luồng liên quan, sửa lỗi phát hiện được.
6. Bàn giao bản review cùng bằng chứng.

Bàn giao ngắn gọn:
- Tóm tắt những gì đã thay đổi.
- Danh sách file chính và nguyên nhân lỗi tìm được trong code.
- Ảnh Home desktop/mobile, gồm bản Anh có tiêu đề ở giữa ảnh.
- Ảnh hồ sơ chuyển sang các ngôn ngữ và bảng kiểm thử tất cả hồ sơ demo.
- Kết quả build/test; các mục chưa kiểm tra và lý do cụ thể.
- Nguồn ảnh hoặc ghi rõ ảnh mô phỏng.
- URL preview cùng commit/deploy ID, nếu môi trường có khả năng tạo preview.
- Mục lỗi cũ nào không còn tái hiện trên bản hiện tại thì ghi rõ, không thực hiện thay đổi thừa.

Tiếp tục tự xử lý các lựa chọn kỹ thuật thông thường. Chỉ hỏi khi thực sự thiếu quyền truy cập, dữ liệu hoặc quyết định kinh doanh không thể suy ra. Không tự merge hoặc xuất bản production nếu chưa có chỉ dẫn triển khai tương ứng; hoàn thành bản có thể review trước.

## Kết thúc prompt

