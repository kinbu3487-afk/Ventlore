# Ventlore — Prompt 01 v2: UI khám phá và đa ngôn ngữ

Ngày: 24/09/2026. Thay thế toàn bộ Prompt 01 trong `Ventlore_Antigravity_Prompt_Pack_v1_0.md` khi chạy lại chặng front-end. Các chặng khác giữ phạm vi hiện có.

## Cách dùng

Mở đúng repository Ventlore đang làm trong Antigravity. Sao chép toàn bộ khối `text` bên dưới và chạy. Có thể lưu tệp này vào `docs/` để agent đọc trực tiếp. Không cần chạy lại Prompt 00.

Nếu có, đặt ba ảnh tham chiếu sau trong `docs/design/reference/` hoặc đính kèm cùng prompt:

- `Ventlore Explore: Local Trails and Coast.png`
- `Ventlore article and support screens.png`
- `Ventlore two-screen mobile UI board.png`

Prompt đã mô tả bố cục cụ thể để vẫn triển khai được nếu ảnh chưa nằm trong repository. Tiếng Trung đợt đầu dùng giản thể; tổng cộng sáu ngôn ngữ gồm tiếng Việt.

## Prompt thực thi

```text
Bạn phụ trách thiết kế và triển khai front-end Ventlore trong repository đang mở. Thực hiện lại CHẶNG 01 theo bản v2 này: nâng cấp mạnh chất lượng thị giác và hoàn thiện đa ngôn ngữ. Trả lời và bàn giao bằng tiếng Việt; code/identifier dùng tiếng Anh.

MỤC TIÊU
Ventlore phải tạo cảm giác muốn khám phá và muốn chia sẻ hiểu biết địa phương. Bản hiện tại khá giống danh mục hồ sơ, nhiều chữ và thiếu hình ảnh. Hãy đưa ứng dụng về tinh thần các concept UI ban đầu: thanh điều hướng xanh rừng, nền ngà, ảnh cảnh quan nổi bật, thẻ điểm đến có ảnh, bản đồ cạnh danh sách, thông tin kiểm tra rõ nhưng gọn, lời mời cộng đồng dễ thấy.

Đây là nhiệm vụ sửa sản phẩm đang có, không chỉ đề xuất phương án. Hãy kiểm tra repo, lập kế hoạch ngắn rồi thực hiện đến khi có bản chạy được, kiểm tra và bàn giao. Không dừng sau plan, scaffolding hay một trang mẫu. Tự quyết các chi tiết UI phù hợp brief; chỉ nêu phần thật sự bị chặn bởi tài nguyên/quyền truy cập còn thiếu.

1. ĐỌC NGUỒN VÀ GIỮ THÀNH QUẢ ĐANG CÓ

- Đọc AGENTS.md áp dụng, git status, README, package.json/lockfile, PROJECT_STATE, HANDOFF, FE_HANDOFF nếu có, ID_CONTRACT, DOMAIN_RULES, PERMISSIONS, OpenAPI và cấu hình deploy hiện tại.
- Đọc sáu nguồn: Logic-ID-DB 0.3, ID Registry 0.3, Sơ đồ khối 0.3, Event UI Spec 0.3, Event UI Wireframes 0.3, Brand Guide 0.1. Tìm theo tên thực tế nếu hậu tố tệp khác.
- Xem các ảnh UI tham chiếu được cung cấp, không chỉ đọc tên. Nếu thiếu, ghi rõ và dùng brief thị giác ở mục 3; không tuyên bố đã xem ảnh chưa đọc được.
- Thứ tự áp dụng: yêu cầu UI/đa ngôn ngữ mới trong prompt này; nghiệp vụ và ID theo nguồn 0.3; nhận diện theo Brand Guide; ảnh concept hướng dẫn thị giác. Không sao chép chữ lỗi hoặc dữ liệu minh họa trong ảnh thành nội dung thật.
- Giữ framework, package manager, hợp đồng dữ liệu, code đã hoạt động và thay đổi chưa commit của người dùng. Không dựng lại repo, reset dữ liệu, thay UUID, đổi business enum hoặc đổi API/ABI để thuận tiện cho UI.
- Prompt gốc ưu tiên tiếng Việt và chỉ chuẩn bị chuỗi dịch; yêu cầu này được thay bằng sáu ngôn ngữ hoạt động đầy đủ ngay trong chặng 01 v2.
- Nếu đã có API thật, giữ nguyên tích hợp. Phần chưa có tiếp tục mock adapter đúng schema, được bật rõ theo môi trường. Không hạ API thật về mock và không tự fallback sang mock khi API lỗi.
- Phạm vi chức năng chính vẫn là S01, S02, S03, S04, S05, S21, S34; AppShell/RoleNav, C01–C10 và phần cần thiết của C46/C49/C50. Các màn chặng sau đã có được kế thừa design system và đa ngôn ngữ; không xây thêm nghiệp vụ chặng sau chưa tồn tại.

2. DESIGN SYSTEM VÀ CHẤT LƯỢNG THỊ GIÁC

Giữ tokens:
Forest #173F35; Jade #2C7563; Sage #DCE8DA;
Ivory #F5F1E8; Waypoint #F0A44B; Ink #182522.

- Nền ngà và trắng chiếm phần lớn diện tích; xanh rừng tạo khung thương hiệu/CTA; cam vàng là điểm nhấn chọn lọc. Không phủ mọi khối bằng nền xanh nhạt hoặc viền giống nhau.
- Logo thật, đúng tỷ lệ. Desktop ưu tiên wordmark rộng 160–190px, mobile có bản gọn phù hợp. Dùng logo sáng trên header xanh rừng; tránh ảnh logo chữ nhật nền xanh đặt lạc trên thanh trắng. Không vẽ lại logo và gọi đó là asset chuẩn.
- Be Vietnam Pro cho Việt/Anh/Pháp. Bổ sung font hỗ trợ Nhật/Trung/Hàn ở mục 6. Body chính tối thiểu 16px, line-height khoảng 1.6. Metadata 12–14px nhưng vẫn rõ và đủ tương phản.
- Hero desktop khoảng 48–60px, mobile 32–36px; tiêu đề trang 32–40px desktop; phân cấp linh hoạt theo ngôn ngữ. Không dùng cùng một cỡ chữ cho mọi cấp.
- Khoảng cách theo 4/8/12/16/24/32/48/64; card bo 16px; nút bo 12px; control tối thiểu 48px, vùng chạm tối thiểu 44px. Search chính có thể cao 56px.
- Container desktop khoảng 1280–1440px, lề thích ứng. Ảnh có tỷ lệ nhất quán, crop chủ thể hợp lý. Shadow nhẹ, border tiết chế, tránh bọc mọi đoạn trong một card riêng.
- Icon đồng nhất. Hover/focus/selected rõ; chuyển động ngắn và hỗ trợ reduced-motion. Không dùng video nền, parallax hoặc hiệu ứng nặng để bù cho bố cục yếu.
- Dùng ảnh thật từ asset được phép dùng hoặc nguồn có quyền sử dụng rõ. Ghi nguồn/giấy phép trong asset manifest. Không hotlink ngẫu nhiên, không dùng ảnh sai địa điểm như ảnh xác thực. Ảnh minh họa phải được ghi đúng là minh họa.
- Hero và các thẻ địa điểm mẫu phải có ảnh chạy được. Nếu thiếu ảnh đúng địa điểm, dùng ảnh minh họa được phép với nhãn phù hợp; fallback khi lỗi ảnh phải đẹp và không nhảy layout. Không để cả trang chỉ gồm chữ và placeholder xám.
- Họa tiết đường đồng mức chỉ là trang trí nhẹ, không phải bản đồ dẫn đường. Không chèn nguyên ảnh mockup làm giao diện; mọi chữ, card, nút và bộ lọc phải là component thật.

3. BỐ CỤC THAM CHIẾU CẦN TRIỂN KHAI

S01 — Explore:
- Header xanh rừng, logo sáng bên trái; Khám phá và Đóng góp dễ thấy; VIP và Minh bạch quỹ ở vị trí phụ phù hợp; chọn ngôn ngữ và tài khoản bên phải. Mobile có menu gọn và chọn ngôn ngữ dễ tìm.
- Hero ngắn, bên trái là “Hiểu nơi đến. Vững bước đi.” cùng câu giới thiệu thân thiện về tri thức địa phương; bên phải là ảnh cảnh quan có chiều sâu. Có thể hòa ảnh vào nền ngà nhẹ như concept. Không để hero chiếm hết màn hình đầu.
- Thanh search nổi bật ngay dưới hero: từ khóa + khu vực + nút tìm kiếm. Có submit bằng Enter, nút xóa và phản hồi đang tải rõ.
- Hàng chip hoạt động phía dưới, có icon và trạng thái chọn; bộ lọc cập nhật gần đây/sắp xếp gọn. Chỉ hiện tiêu chí mà dữ liệu thực sự hỗ trợ, không dựng filter trang trí.
- Desktop rộng: danh sách bên trái khoảng 55%, bản đồ bên phải khoảng 45% khi bản đồ khả dụng; danh sách dùng hai cột card nếu đủ chỗ. Bản đồ có thể sticky trong vùng nội dung, không che header/footer.
- Card: ảnh 16:10; tên điểm; khu vực; hoạt động; một câu mô tả; lưu ý cần thiết; số bài và ngày cập nhật nếu có; CTA xem địa điểm. Mã PLC không đứng đầu card.
- Card không gán huy hiệu “địa điểm an toàn”. Nhãn kiểm tra thuộc từng bài/phiên bản, không suy thành chứng nhận cả nơi đến.
- Có banner xanh rừng “Bạn hiểu nơi này?” và CTA chia sẻ trải nghiệm. Nếu luồng đóng góp đã có, nối đúng route/quyền/returnTo; nếu chưa có, dẫn tới bước giới thiệu/đăng nhập với trạng thái rõ, không để nút bấm vô tác dụng hay giả gửi thành công.
- Chưa được cấp vị trí thì dùng “Điểm đến nổi bật” hoặc khu vực người dùng chọn; chỉ gọi “Gần bạn” khi thật sự có cơ sở khoảng cách. Không tự xin GPS lúc vừa mở trang.
- Mobile: một cột, ảnh dễ nhìn, filter mở trong sheet khi cần; nút chuyển danh sách/bản đồ rõ. Tránh nhồi desktop thu nhỏ vào màn hình điện thoại.

S02 — Chi tiết địa điểm:
- Ảnh bìa hoặc gallery gọn; tên điểm, khu vực, hoạt động và thông tin tiếp cận dễ quét.
- Lưu ý quan trọng được tìm thấy sớm, phân biệt với mô tả trải nghiệm. Nêu nguồn/ngày quan sát nếu có; thiếu thì ghi chưa có dữ liệu, không tự bịa.
- Danh sách bài có tác giả, ảnh đại diện phù hợp, ngày trải nghiệm và nhãn đúng phiên bản.
- Có CTA “Bạn đã đến đây? Chia sẻ trải nghiệm”. Metadata kỹ thuật đặt trong chi tiết mở rộng.

S03 — Đọc bài:
- Ảnh bìa, tên bài rõ, tác giả và ngày trải nghiệm ngay đầu. Nội dung chính có bề rộng dễ đọc khoảng 65–75 ký tự Latin mỗi dòng.
- Thẻ “Đã kiểm tra trong phạm vi” gọn: phạm vi, thời điểm, thời hạn và đường dẫn nguồn; bản chưa kiểm tra/hết hạn có nhãn chính xác. Không biến thẻ kiểm tra thành nửa màn hình đầy mã.
- Render Markdown/rich text thành heading, danh sách, link và chữ đậm đúng; xử lý nội dung an toàn, không chèn HTML tùy ý. Không để lộ ### hoặc ** trong bài như bản hiện tại.
- Lịch sử phiên bản thu gọn mặc định, vẫn mở và deep-link được. Đổi phiên bản tải đúng nội dung, nhãn, nguồn và quyền nhận tip của bản đó.
- Báo thông tin cần sửa và Ủng hộ tác giả có vị trí rõ, tùy capability. Nếu chức năng thuộc chặng sau chưa có, giải thích chưa khả dụng; không thêm giao dịch giả.
- Mobile có thể dùng thanh hành động cuối màn hình như concept, chừa safe-area/padding để không che nội dung; desktop dùng CTA cạnh/cuối bài.

S04/S05/S21/S34:
- Hồ sơ public nhấn người đóng góp, chuyên môn có căn cứ, bài chia sẻ và ghi nhận; không dùng VIP/SBT làm bằng chứng tự động có quyền chuyên gia.
- Đăng nhập tối giản, cùng ngôn ngữ và nhận diện, giải thích lợi ích và quay lại đúng ý định. Giữ provider/auth hiện có; không giả đăng nhập thật.
- VIP: 15 USD/năm, quyền lợi về khám phá điểm mới và hướng dẫn chuyên sâu đúng đặc tả. Cảnh báo cần thiết vẫn public. Bỏ “tọa độ khẩn cấp/cứu hộ” làm lời chào bán; chỉ hứa bản đồ 3D/GPX nếu đã có chức năng và được xác nhận trong scope.
- Minh bạch quỹ: tiêu đề thân thiện, số liệu phân cấp rõ, tên nguồn thu có bản dịch. Không hiện OWNER_FUNDING, VIP_REVENUE hay Outbox làm nhãn chính. Không biến dữ liệu mẫu thành lời hứa realtime thật.

4. SỬA CÁC VẤN ĐỀ ĐÃ QUAN SÁT TRÊN BẢN DEPLOY

- Kiểm tra lại trên mã hiện tại, sửa lỗi còn tồn tại: tìm “cat ba” phải khớp “Cát Bà”; xử lý hoa/thường, Unicode, dấu tiếng Việt và đ/d. Giữ tên gốc khi hiển thị. Tìm theo tên, khu vực và alias có trong dữ liệu; không sửa canonical ID.
- Hỗ trợ alias đã biên tập cho tên địa điểm ở các ngôn ngữ khác. Không tuyên bố tìm kiếm ngữ nghĩa hoặc chuyển tự tự động nếu chưa triển khai.
- Hồ sơ merged không thành một điểm đến riêng trong danh sách mặc định/tổng đếm. Tìm tên cũ và link cũ vẫn về canonical place, có thông báo phù hợp; không xóa lịch sử hoặc đổi placeId gốc của bài.
- Map adapter: có provider được cấu hình thì hiện bản đồ tương tác thật, marker/popup nối card và filter. Giữ attribution theo nguồn; không tự mua dịch vụ hay bịa API key.
- Nếu chưa có provider, mặc định hiển thị danh sách có ảnh hoàn chỉnh; tùy chọn bản đồ ghi rõ chưa khả dụng và không giả là map đang chạy. Không để một khung thông báo trống khổng lồ chiếm nửa trang. Có thể giữ bố cục map bằng fixture riêng có nhãn DEMO nếu đã có adapter mô phỏng tương tác, nhưng không gọi đó là bản đồ thực địa.
- Không hiển thị tọa độ rỗng `(, )`. Chỉ đọc location khi người dùng chủ động bấm; bị từ chối/timeout vẫn tiếp tục tìm bằng khu vực.
- Bỏ S01/S21, ACTIVE, REV-..., “1500 USD cents”, “Mock Adapter”, “Immutable”, “Onchain Tip Route” khỏi nội dung tiếp thị/nhãn chính. Mã và trạng thái gốc vẫn giữ trong data, tra cứu hoặc chi tiết cần thiết.
- Giữ nhãn demo ngắn, dễ hiểu và có bản dịch. Role-switcher dành cho thử nghiệm được tách gọn; tuyệt đối không trở thành cơ chế cấp quyền production.
- Thông báo “hồ sơ đã gộp” dùng trạng thái trung tính, không dùng khung đỏ “rủi ro thực địa”. Màu cảnh báo phải có chữ/icon và ý nghĩa nghiệp vụ rõ.

5. ĐA NGÔN NGỮ HOẠT ĐỘNG ĐẦY ĐỦ

Triển khai sáu locale:
vi      — Tiếng Việt
en      — English
ja      — 日本語
zh-Hans — 中文（简体）
ko      — 한국어
fr      — Français

- Tiếng Việt là mặc định. Tiếng Trung dùng giản thể; cấu trúc dễ thêm phồn thể về sau nhưng không cần triển khai thêm ở chặng này.
- Bộ chọn ngôn ngữ dùng tên bản ngữ và biểu tượng ngôn ngữ, không dùng quốc kỳ thay ngôn ngữ. Có trạng thái đang chọn, keyboard, focus và nhãn truy cập được.
- Dùng thư viện i18n đang có nếu phù hợp. Nếu chưa có, chọn một giải pháp tương thích framework/SSR hiện tại, kiểm tài liệu chính thức và phiên bản thực tế trước tích hợp. Không cài nhiều hệ thống dịch chồng nhau hoặc dùng widget dịch toàn trang.
- Catalog/message keys ổn định, chia namespace theo common/nav/explore/place/post/profile/auth/vip/transparency/errors/accessibility. Không hardcode chuỗi người dùng trong component; không ghép những mảnh câu khiến ngữ pháp sai. Hỗ trợ interpolation và số ít/số nhiều.
- Dịch toàn bộ UI đã tồn tại trong scope: menu, search/filter, button, empty/loading/error, validation, toast, dialog, trạng thái kiểm tra, trạng thái tiền, demo banner, alt text, aria-label, title/description và footer. Các màn đã làm của chặng sau cũng dùng chung catalog cho chuỗi đang có; không dựng nghiệp vụ mới chỉ để dịch.
- Sáu catalog phải có bản dịch thật, không sao chép nguyên tiếng Anh/Việt sang các locale khác để đủ key. Giọng văn tự nhiên, ngắn, gần gũi. Danh từ thương hiệu, ticker tài sản, ID và tên riêng được giữ khi phù hợp.
- Lập glossary thống nhất: “Đã kiểm tra trong phạm vi”, “Chưa kiểm tra”, “Hết hạn”, “Đang đối soát”, “Ủng hộ tác giả”, “Gia hạn”. Bản dịch không biến “đã kiểm tra thông tin” thành “địa điểm được chứng nhận an toàn”.
- Thiếu key UI: fallback English cuối cùng để tránh trang vỡ, đồng thời ghi lỗi kiểm tra; fallback không được tính là hoàn thành bản dịch. Không hiện raw key cho người dùng.

Routing và ghi nhớ:
- Giữ cơ chế locale của repo nếu đã có. Nếu chưa có, ưu tiên URL locale prefix cho page routes, ví dụ /vi/explore, /en/explore, /ja/explore; lập mapping route tập trung, không nối chuỗi URL rải rác.
- URL locale có ưu tiên cao nhất; URL cũ không có locale dùng lựa chọn đã lưu hợp lệ, nếu chưa có thì vi. Giữ link cũ /explore, /places/{id}, /posts/{id} hoạt động qua resolve/redirect phù hợp.
- Không áp locale prefix vào /api, asset, webhook hoặc callback xác thực. Cập nhật allowlist/returnTo nếu cần mà không mở redirect ngoài origin.
- Đổi ngôn ngữ phải ở lại cùng trang, placeId/postId/revisionId, bộ lọc, query và anchor hợp lệ; giữ nháp chưa gửi nếu có. Không tự nhảy về homepage, logout hoặc tạo lại mutation.
- Lưu lựa chọn qua cookie/preference phù hợp để SSR và client đồng nhất; không phụ thuộc riêng localStorage gây nháy ngôn ngữ/hydration mismatch. Chuẩn hóa locale không hỗ trợ về fallback có quy tắc.
- Đặt html lang, metadata và đường dẫn ngôn ngữ đúng. Canonical/hreflang nếu áp dụng phải dùng URL/domain cấu hình thật, không bịa domain. Giữ noindex cho demo/deploy-preview nếu đã cấu hình.
- Cache dữ liệu trình bày bao gồm locale, entity/revision và ngữ cảnh quyền; chuyển locale không dùng nhầm payload riêng tư của người khác.

6. CHỮ, NGÀY VÀ TIỀN THEO NGÔN NGỮ

- Giữ Be Vietnam Pro cho vi/en/fr; dùng font có glyph đầy đủ cho ja, zh-Hans, ko, ví dụ các họ Noto Sans phù hợp hoặc font tương đương đã có giấy phép. Tải có chọn lọc theo locale/subset; không bắt người dùng tải toàn bộ bộ chữ CJK ngay lần đầu.
- Kiểm tiếng Nhật/Trung/Hàn không mất glyph, không giãn ký tự khó đọc; chữ Pháp dài vẫn xuống dòng hợp lý. Không ép chiều cao card/CTA cố định làm mất chữ, không truncate thông tin an toàn hoặc nút quan trọng.
- Dùng định dạng theo locale cho ngày, số và tiền. Timestamp nghiệp vụ vẫn UTC; không đổi ngày trải nghiệm dạng date-only khi đổi múi giờ. Thời hạn quan trọng cần timezone rõ khi hiển thị giờ.
- 15 USD vẫn là 15 USD ở mọi locale; chỉ đổi cách trình bày, không tự quy đổi sang JPY/CNY/KRW/EUR/VND. Token vẫn giữ ticker, atomic units và độ chính xác; không đổi bigint thành float để format tiền.

7. TÁCH NGÔN NGỮ GIAO DIỆN VỚI NGÔN NGỮ BÀI VIẾT

- Dịch giao diện không có nghĩa mọi nội dung cộng đồng tự có sáu bản dịch. Thiết kế lớp nội dung bản địa hóa riêng: tên hiển thị/alias, tóm tắt, nội dung, lưu ý, chú thích và alt text theo nguồn hiện có.
- Mỗi bản dịch bài phải tham chiếu đúng sourceRevisionId, locale, nguồn/bản gốc và trạng thái bản dịch; bổ sung sourceContentHash nếu schema có. Có thể dùng khóa ghép revisionId + locale, không tạo hệ postId/placeId mới theo ngôn ngữ.
- Bản dịch không sửa snapshot gốc, hash, decision hoặc lịch sử kiểm tra. Không tự kế thừa bản dịch/nhãn từ revision trước. Trạng thái kiểm tra nội dung gốc và trạng thái duyệt bản dịch là hai việc khác nhau.
- Khi chưa có bản dịch, hiện nguyên văn kèm nhãn bằng ngôn ngữ giao diện, ví dụ “Nội dung hiện có bằng tiếng Việt”; có lựa chọn xem bản gốc. Không để bài trống hoặc âm thầm giả nội dung đã dịch.
- Nếu có bản dịch máy chưa được kiểm tra, ghi rõ cạnh nội dung; không trình bày như bản dịch đã được chuyên gia xác nhận. Không gọi API dịch trả phí hay tự dịch động mỗi lượt xem trong chặng này.
- Nội dung cần thiết về cảnh báo không bị che chỉ vì thiếu bản dịch; vẫn cho xem bản gốc và nguồn. Nội dung VIP/private cùng các bản dịch phải qua đúng permission trước khi trả payload.
- Hoàn thiện fixture đa ngôn ngữ đủ để nghiệm thu: ít nhất ba thẻ địa điểm, một bài public có nội dung/cảnh báo và một teaser VIP có bản dịch biên tập mẫu ở cả sáu ngôn ngữ. Thêm một bài thiếu bản dịch để kiểm fallback.
- Dùng lại nội dung fixture hợp lệ; mọi bản dịch mẫu đều mang nhãn DEMO, không được mô tả như xác minh thực địa thật. Không bịa thêm thông tin cứu hộ, thời tiết, người xác nhận hoặc mức độ an toàn.
- Triển khai lớp adapter/view model cho dữ liệu bản địa hóa trong scope front-end; ghi hợp đồng đề xuất cho backend sau. Nếu cần thay API/schema đã khóa, dùng thay đổi bổ sung tương thích và ADR rõ, không tự migration production.

8. GIỮ NGUYÊN CÁC QUY TẮC NGHIỆP VỤ

- Một userId xuyên vai trò; locale không tạo tài khoản, quyền VIP hay ví mới. Guest đọc public không cần login/wallet.
- UI/locale không thay authorization server. Không trả VIP/private/candidate REVIEW_ONLY trong HTML/JSON rồi giấu bằng CSS, cũng không đóng gói chúng vào catalog dịch hoặc client bundle guest.
- Fixture server/mock adapter giữ đúng UUID canonical và FK; displayCode chỉ để tra cứu. Component dùng api-client, không import mock JSON rải rác.
- Verification gắn revision và scope; đổi revision hoặc locale không chuyển nhãn/route của bản khác sang. “Chưa kiểm tra” không đồng nghĩa rủi ro thấp.
- Bốn nhánh nhãn kiểm tra, SBT, NFT tác giả và nhận tip độc lập. VIP không phải điểm tín nhiệm, vai trò chuyên gia hoặc quyền duyệt.
- Donate dự án 100% vào quỹ; tip bài 80% tác giả/20% quỹ theo công thức atomic units đã khóa; gas riêng. Donation không cấp VIP.
- Giữ các fixture bắt buộc từ Prompt 01 gốc: post nhiều revisions, place merged, bản chưa kiểm tra, bản hết hạn, nội dung VIP, candidate private. Đổi ngôn ngữ không làm mất các trạng thái này.
- State loading/empty/401/403/404/409/422/429/offline/timeout có phản hồi được dịch và hành động phục hồi phù hợp. Dữ liệu tiền chưa tải không hiện thành 0.
- Chặng này không mở thanh toán thật, mainnet hay thay contract. Không làm lại các chặng đã xong; không tự push/publish production hoặc thay cấu hình quyền để vượt trở ngại.

9. CÁCH TRIỂN KHAI VÀ KIỂM TRA

- Ghi một kế hoạch ngắn: hiện trạng → thay đổi design system/layout → i18n/content adapter → kiểm tra. Sau đó thực hiện liên tục trong scope, không yêu cầu người dùng duyệt từng component.
- Xây thành component dùng lại được: LanguageSwitcher, ExploreHero, SearchBar, ActivityFilters, PlaceCard, MapPanel, CommunityCTA, VerificationSummary, RevisionSelector và các component hiện có tương ứng. Không nhân sáu bản JSX cho sáu ngôn ngữ.
- Mọi CTA nhìn như bấm được phải có hành vi thật hoặc trạng thái chưa khả dụng rõ ràng. Không giả thành công để hoàn thành demo.
- Dùng lệnh typecheck/lint/test/build thực của repo; sửa lỗi do thay đổi. Không tự nhận PASS cho lệnh chưa chạy.
- Kiểm tra browser ở 390px và 1440px; kiểm bổ sung bố cục ở 768px và 1024px. Không cuộn ngang toàn trang, chữ bị cắt, header chồng nhau hoặc thanh sticky che thao tác.
- Tự xem screenshot đối chiếu concept sau khi render. Nếu vẫn là danh sách chữ với vài thay đổi màu, nhiệm vụ chưa đạt. Cần thấy rõ ảnh, phân cấp, bố cục và điểm nhấn cộng đồng đã thay đổi.
- Chụp Explore và bài viết ở desktop/mobile tiếng Việt; Explore mobile ở năm ngôn ngữ còn lại; ít nhất một bài tiếng Nhật/Hàn/Trung và một trang VIP tiếng Pháp để kiểm font/chữ dài. Không chỉ chụp trang loading.
- Kiểm catalog key/interpolation parity cho sáu locale; smoke đổi ngôn ngữ trên cả bảy màn chính. Lỗi key/fallback ngoài chủ đích phải được xử lý.
- Kiểm hành vi có ý nghĩa: tìm không dấu; filter và empty/reset; merged resolve; đổi locale giữ revision/filter; reload/deep link/link cũ; cookie/SSR locale; thiếu bản dịch; bản dịch sai revision không được dùng; guest không nhận nội dung private kể cả qua locale khác.
- Kiểm map success nếu có provider và trạng thái không cấu hình; GPS bị từ chối; ảnh lỗi; kiểm bàn phím/focus/label và reduced-motion. Không phát sinh vị trí thật, thanh toán hoặc dữ liệu cá nhân chỉ để test.
- Không coi UI mock gate là backend security đã hoàn thành. Ghi rõ kiểm tra nào dùng mock, kiểm tra nào chạy thật và phần chưa có điều kiện xác minh.

10. TIÊU CHÍ HOÀN THÀNH

A1. Bảy màn S01/S02/S03/S04/S05/S21/S34 chạy được với nhận diện nhất quán; giữ chức năng hiện có.
A2. Explore có header xanh rừng, hero có ảnh, search nổi bật, thẻ điểm đến có ảnh và CTA cộng đồng; bố cục responsive đạt brief.
A3. Sáu locale có bản dịch UI đầy đủ, chọn và ghi nhớ được; ngôn ngữ không chỉ thay vài nhãn menu.
A4. Đổi locale giữ entity/revision/query/filter/quyền và các deep link cũ hoạt động.
A5. Font CJK hiển thị đúng, tiếng Pháp không vỡ layout, định dạng ngày/tiền đúng locale mà không đổi giá trị nghiệp vụ.
A6. Nội dung mẫu đa ngôn ngữ và trường hợp thiếu bản dịch hoạt động; không sửa snapshot hoặc làm sai phạm vi xác minh.
A7. Markdown render đúng; tìm cat ba khớp Cát Bà; merged không đếm trùng; không còn tọa độ rỗng hoặc map giả hoạt động.
A8. Không lộ dữ liệu VIP/private trong payload/catalog/bundle guest; demo switch không cấp quyền production.
A9. Tiêu chí browser, catalog, build/typecheck và smoke đã có kết quả thực; mọi phần chưa xác minh được ghi rõ.
A10. Có screenshot sau sửa và handoff để Bin nghiệm thu; không dừng ở đề xuất.

11. BÀN GIAO

- Cập nhật PROJECT_STATE, HANDOFF, SCREEN_COVERAGE, COMPONENT_COVERAGE và EVENT_COVERAGE ở những hàng bị ảnh hưởng; không đánh dấu các chặng backend/onchain hoàn tất vì UI đã đẹp.
- Tạo docs/UI_REDESIGN_V2.md: hướng thị giác, mapping concept → component, nguồn ảnh/font, screenshot và quyết định map/fallback.
- Tạo docs/I18N.md: locale, catalog, routing/redirect, persistence, font, formatting, content translation/fallback, quy tắc cache/quyền và cách thêm ngôn ngữ sau.
- Tạo docs/QA_PROMPT_01_V2.md: A1–A10 đạt/chưa đạt/chưa kiểm, lệnh/kết quả, bằng chứng, giới hạn và dependency còn thiếu.
- Ghi rõ bản này thay Prompt 01 cũ; nhắc chặng 02/03 tiếp tục dùng design system và i18n hiện tại, không tạo lại chuỗi tiếng Việt hardcode.
- Trả bản tóm tắt ngắn: đã thay gì; đường dẫn chạy/xem; các tệp chính; kiểm tra đã chạy; phần MOCK hoặc chưa xác minh; 5 thao tác Bin nên thử. Nếu preview đã có trong workflow, cung cấp URL thực đã kiểm; không bịa link.

Bắt đầu bằng đọc repository và nguồn, rồi triển khai đúng toàn bộ scope trên.
```
