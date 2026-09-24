# Ventlore — Prompt sửa bản hiện tại sau review UI

Ngày soạn: 24/09/2026. Dùng trong Antigravity tại repository Ventlore đang phát triển.

Copy toàn bộ phần từ “Bắt đầu prompt” đến “Kết thúc prompt”. Đây là yêu cầu sửa tiếp code hiện có, không phải chạy lại từ đầu Prompt 01.

---

## Bắt đầu prompt

Bạn phụ trách sửa giao diện và đa ngôn ngữ của Ventlore trên repository hiện tại. Hãy đọc code, triển khai thay đổi, chạy kiểm tra và bàn giao kết quả có thể nghiệm thu. Không chỉ trả lại kế hoạch hoặc ví dụ code.

### 1. Mục tiêu và phạm vi

Bản đã được review: https://deploy-preview-3--ventlore.netlify.app/explore

Mục tiêu: làm giao diện hấp dẫn hơn theo bộ nhận diện Ventlore; sửa triệt để lỗi bản dịch; hoàn thiện các tương tác đang dang dở. Giữ những chức năng đã chạy đúng và hệ ID xuyên suốt front-end, back-end, onchain.

Các màn hình trọng tâm:

| Mã | Màn hình | Route gốc, có thể có tiền tố locale |
|---|---|---|
| S01 | Khám phá | `/explore` |
| S02 | Chi tiết địa điểm | `/places/{placeId}` |
| S03 | Bài viết và phiên bản | `/posts/{postId}?revisionId={revisionId}` |
| S21 | Gói VIP | `/vip` |

Rà soát thêm các component dùng chung và những màn hình đã có được liên kết từ đây: S04 hồ sơ, S05 đăng nhập, S34 minh bạch. Không mở rộng sang xây mới toàn bộ màn hình vận hành.

Trước khi sửa:

- Đọc `AGENTS.md` hoặc hướng dẫn tương đương, cấu trúc repository, package scripts, thư viện UI/i18n/map và cấu hình deploy đang dùng.
- Xem trạng thái Git; bảo toàn thay đổi đang có. Không reset, xóa code hoặc scaffold lại dự án.
- Tìm và đọc các tài liệu có trong workspace: `Ventlore_ID_Registry_v0_3.csv`, `Ventlore_Logic_ID_DB_v0_3.pdf`, `Ventlore_Event_UI_Spec_v0_3(1).pdf`, `Ventlore_Event_UI_Wireframes_v0_3(1).pdf`, `Ventlore_Brand_Guide_v0_1.pdf`; tên file có thể được chuẩn hóa khác đôi chút.
- Nếu có ảnh mẫu `Ventlore Explore: Local Trails and Coast.png`, `Ventlore article and support screens.png`, `Ventlore two-screen mobile UI board.png`, dùng làm tham chiếu thị giác. Không cần đợi ảnh nếu workspace chưa có; các yêu cầu dưới đây đủ để bắt đầu.
- Những lỗi bên dưới là quan sát ở thời điểm review, không phải kết luận về nguyên nhân trong code. Đối chiếu bản hiện tại; bỏ qua việc sửa lại những lỗi đã hết. Nếu không truy cập được preview, tiếp tục kiểm tra bản local.

### 2. Những vấn đề đã quan sát

1. UI lộ mã dịch như `common.demoNotice`, `common.role`, `explore.searchPlaceholder`, `explore.allRegions`, `explore.viewPlace`, `post.verifiedTitle`, `vip.mainTitle`. Lỗi có cả trong tiếng Việt.
2. Menu đủ sáu ngôn ngữ nhưng dịch chưa đầy đủ. Chuyển sang English vẫn còn cảnh báo địa điểm, nhãn hoạt động, ghi chú kiểm định và quyền lợi VIP bằng tiếng Việt.
3. Hero và cả ba thẻ địa điểm dùng cùng một hình minh họa núi–mặt trời. Các địa điểm thiếu đặc trưng riêng.
4. Hero, bộ lọc và ảnh thẻ chiếm quá nhiều chiều cao; ở màn hình desktop ban đầu chưa nhìn thấy tên các địa điểm đầu tiên.
5. Chế độ bản đồ hiển thị hình trang trí cùng tọa độ chữ, chưa có bản đồ địa lý tương tác.
6. Cảnh báo trên thẻ bị cắt bằng dấu ba chấm. Tìm `cat ba` còn trả hồ sơ đã gộp như một địa điểm riêng.
7. Trang đọc bài còn nặng về metadata; nhãn lịch sử phiên bản có chỗ tràn khung. Trang VIP trộn ngôn ngữ, lộ đơn vị dữ liệu `1500 USD cents` và quảng bá “tọa độ khẩn cấp”.

Các điểm cần giữ: tìm kiếm không dấu đã hoạt động; Markdown của bài đã được render; bộ chọn locale và route theo locale đã có; palette xanh rừng–nền kem đã được áp dụng. Thanh cộng tác nổi của Netlify là công cụ preview, không phải component Ventlore cần sửa.

### 3. P0 — Sửa đa ngôn ngữ tận gốc

Hỗ trợ đầy đủ:

| Locale hiện tại | Tên trong bộ chọn |
|---|---|
| `vi` | Tiếng Việt |
| `en` | English |
| `ja` | 日本語 |
| `zh-Hans` | 中文（简体） |
| `ko` | 한국어 |
| `fr` | Français |

Giữ mã locale và đường dẫn tương thích với repository. Không tự đổi `zh-Hans` sang mã khác làm hỏng link đang có.

**Tìm đúng nguyên nhân:** kiểm tra namespace, cấu trúc message catalog, cách gọi hàm dịch, provider/layout, nạp message phía server/client và fallback. Không sửa bằng cách hardcode nhãn Việt vào component, ẩn đoạn lỗi bằng CSS hoặc chỉ dịch menu.

Yêu cầu triển khai:

- Toàn bộ nhãn, placeholder, nút, tooltip, accessible name, validation, loading, empty state, lỗi, trạng thái kiểm định, thông báo demo, đơn vị đếm và footer phải dùng cơ chế dịch chung.
- Kiểm tra đủ key và kiểu dữ liệu hợp lệ trên sáu catalog. Giữ biến nội suy tương thích; dùng quy tắc số nhiều theo từng ngôn ngữ, không ép mọi locale có cùng plural category.
- Trong development/test: báo rõ key thiếu và để kiểm tra phát hiện lỗi. Ở giao diện người dùng: fallback thành câu dễ hiểu, không trả nguyên key. Fallback chỉ là cơ chế dự phòng, không dùng để coi bản dịch thiếu là đã hoàn thành.
- Không dùng tên khu vực/hoạt động đã dịch làm khóa lọc. Lọc bằng ID/code ổn định, dịch phần label. Tên riêng có thể giữ nguyên khi phù hợp; câu mô tả và cảnh báo không được âm thầm giữ tiếng Việt trong các locale khác.
- Format ngày, số và giá theo locale. Giữ đúng giá trị, múi giờ và thời điểm hết hạn của nghiệp vụ; không đổi kỳ quyền truy cập khi đổi ngôn ngữ.
- Chuyển ngôn ngữ phải giữ đúng địa điểm/bài, `revisionId`, bộ lọc và ý định điều hướng có liên quan. Reload và back/forward hoạt động nhất quán. Locale trên URL là nguồn rõ ràng cho một deep link được chia sẻ.
- Cập nhật thuộc tính `lang`; dùng font hỗ trợ tiếng Việt, Nhật, Trung, Hàn và Pháp, không bị ô vuông hoặc mất dấu. Tận dụng cơ chế tải font hiện có, tránh tải toàn bộ các bộ CJK cho mọi lượt truy cập.
- Không dùng cờ quốc gia để đại diện duy nhất cho ngôn ngữ.

**Tách bản dịch UI khỏi bản dịch nội dung:**

- Với dữ liệu demo/seed: bổ sung đủ sáu bản dịch cho mô tả địa điểm, cảnh báo, nội dung bài, phạm vi/ghi chú kiểm định, quyền lợi VIP và các đoạn giải thích đang được hiển thị. Không chỉ dịch tiêu đề.
- Với nội dung cộng đồng chưa có bản dịch: hiển thị thông báo đã dịch sang locale đang chọn, ví dụ “Nội dung này hiện có bằng tiếng Việt”, và cho đọc bản gốc. Không bỏ cảnh báo khi thiếu bản dịch.
- Nếu dùng bản dịch máy, ghi rõ trạng thái; không diễn đạt rằng bản dịch đã được chuyên gia xác minh khi chưa có quy trình đó.
- Không sửa bytes, `contentHash`, claims hoặc snapshot revision đã đóng băng chỉ để phục vụ locale. Bản dịch là dữ liệu trình bày tham chiếu nguồn phù hợp, hoặc dùng cơ chế dịch đã có trong repo. Sửa nội dung nguồn đã công bố phải theo luồng revision hiện hành.
- Trạng thái kiểm định, phạm vi, ngày kiểm tra và hạn hiệu lực vẫn thuộc đúng nguồn/revision; dịch chữ không tạo quyết định kiểm định mới và không kế thừa nhãn sang revision khác.

### 4. P1 — Chỉnh hình ảnh và bố cục Explore

Áp dụng thống nhất token nhận diện:

| Vai trò | Màu |
|---|---|
| Forest — chủ đạo, CTA | `#173F35` |
| Jade — xanh phụ | `#2C7563` |
| Sage — nền phụ | `#DCE8DA` |
| Ivory — nền đọc | `#F5F1E8` |
| Waypoint — điểm nhấn | `#F0A44B` |
| Ink — chữ chính | `#182522` |

Ưu tiên khoảng 70% nền sáng, 25% xanh và 5% điểm nhấn, có màu tự nhiên từ ảnh địa phương. Be Vietnam Pro cho Việt/Anh/Pháp và font phù hợp cho CJK. Body chính 16px, line-height khoảng 26px; card bo 16px; nút/input cao khoảng 48px, vùng chạm tối thiểu 44px. Chữ nhỏ không dùng trắng trên nền cam.

**Header:** giữ gọn và rõ. Logo ngang có phần hình/chữ đủ lớn, mục tiêu tối thiểu 160px trên desktop theo brand guide; chọn đúng biến thể sáng trên nền xanh hoặc nền logo hòa với header. Không bóp méo logo, đổi font logo hoặc dùng ảnh có nhiều khoảng nền thừa. Mobile thu gọn navigation hợp lý, không ép logo, menu và chọn ngôn ngữ chen nhau.

**Hero:** desktop dùng hai cột: nội dung trên nền kem bên trái, ảnh phong cảnh bên phải. Heading lớn, ngắn, mô tả tối đa vài dòng. Mobile xếp dọc và thu gọn. Tránh phủ toàn bộ hero bằng một mảng xanh tối khiến chữ và cảnh quan đều nặng.

Gợi ý nội dung tiếng Việt:

- Heading: “Hiểu nơi đến. Vững bước đi.”
- Mô tả: “Khám phá điểm đến qua chia sẻ của cộng đồng và hiểu biết địa phương. Xem nguồn, thời điểm cập nhật và phạm vi kiểm tra trước mỗi hành trình.”
- CTA: “Khám phá điểm đến”; CTA phụ: “Chia sẻ hiểu biết địa phương”.

Dịch tự nhiên sang các locale. Loại bỏ lời khẳng định bao quát như “Every report is independently verified by accredited local guides” khi hệ thống vẫn có bài chưa kiểm tra. Không tự thêm cam kết về chứng chỉ chuyên gia hoặc độ an toàn.

**Ảnh:** thay hình lặp lại bằng ảnh riêng phù hợp cho biển Cát Bà, ghềnh Cô Tô, núi/rừng Tây Côn Lĩnh trong dữ liệu demo. Ưu tiên ảnh thật đúng địa điểm có quyền sử dụng và ghi nhận nguồn theo yêu cầu. Nếu chưa tìm được ảnh đúng địa điểm, dùng ảnh minh họa có nhãn rõ, đa dạng theo loại cảnh quan; không giả là bằng chứng thực địa. SVG trang trí hiện tại chỉ làm nền phụ hoặc fallback, không dùng làm ảnh chính cho mọi thẻ.

Lưu metadata/attribution phù hợp với cấu trúc media hiện có; không phát sinh business ID giả. Tối ưu kích thước ảnh, aspect ratio, alt text theo locale, tránh layout shift; lazy-load ảnh dưới màn hình đầu. Nếu thiếu asset được phép dùng, bàn giao rõ phần còn thiếu thay vì tuyên bố đã có ảnh địa điểm thật.

**Tìm kiếm và thẻ:**

- Đưa ô tìm kiếm thành trọng tâm; bộ lọc gọn, có nhãn dễ hiểu, trạng thái đang áp dụng và xóa bộ lọc. Số kết quả phải là số thật của truy vấn.
- Chế độ danh sách: tham chiếu 3 cột ở desktop rộng, 2 cột ở tablet, 1 cột ở mobile. Điều chỉnh breakpoint theo khoảng trống thực tế, không cứng nhắc khiến thẻ quá hẹp.
- Ảnh thẻ khoảng 16:9, không cao vượt nhu cầu; ưu tiên tên địa điểm, khu vực, mô tả ngắn, hoạt động, cảnh báo và “Xem địa điểm”.
- Ở viewport khoảng 1440×900, mục tiêu thấy tên hàng địa điểm đầu ngay trong màn hình ban đầu. Không đạt bằng cách giảm chữ chính xuống quá nhỏ.
- Cảnh báo có thể hiển thị phần tóm tắt từ nguồn và nút “Đọc đầy đủ”, nhưng không cắt mất ý quan trọng. Bàn phím và mobile đều mở được toàn bộ cảnh báo.
- Không gắn nhãn “An toàn” cho địa điểm chỉ vì có một bài hoặc một revision được kiểm tra. Nếu hiển thị dữ liệu kiểm định ở thẻ, phải nói rõ nó thuộc thông tin nào.
- Khối cộng đồng dùng lời dễ hiểu: “Bạn hiểu nơi này? Chia sẻ điều cần biết.” Đưa thuật ngữ SBT, route và ví sang phần giải thích hoặc tác vụ cần đến chúng.
- Có trạng thái không có kết quả, đang tải và tải lỗi hữu ích; giữ bộ lọc khi thử lại.

### 5. P1 — Hoàn thiện tìm kiếm, hồ sơ gộp và bản đồ

**Tìm kiếm:** giữ khả năng tìm không dấu, không phân biệt hoa thường, chuẩn hóa khoảng trắng. Kiểm tra `cat ba` và `Cát Bà` đều tìm đúng hồ sơ chính. Không giới hạn tìm kiếm vào chuỗi label của locale đang chọn nếu tên gốc/alias vẫn là cách người dùng thường tìm.

**Hồ sơ đã gộp:** dùng `canonicalPlaceId` hiện có để xử lý. Không hiển thị hồ sơ cũ thành một điểm đến độc lập trong kết quả chính. Có thể hiện thông báo “Tên cũ đã được gộp vào …” và dẫn tới canonical. Link cũ vẫn phải mở được theo cơ chế resolve của hệ thống; không xóa ID hay lịch sử.

**Bản đồ:**

- Tận dụng thư viện/provider đã có. Nếu chưa có, chọn giải pháp phù hợp với stack, kiểm tra tài liệu chính thức và điều kiện sử dụng hiện hành trước khi thêm dependency; giải thích ngắn lựa chọn trong bàn giao.
- Hiển thị nền bản đồ địa lý, zoom/pan, marker theo tọa độ hợp lệ, popup tên địa điểm và link chi tiết. Marker và danh sách dùng cùng bộ kết quả đã lọc.
- Desktop: chế độ bản đồ có danh sách và bản đồ cạnh nhau. Mobile: chuyển qua lại danh sách/bản đồ; không ép hai cột hẹp.
- Có attribution theo provider. Nếu thiếu cấu hình/key hoặc tải bản đồ thất bại, thông báo rõ và giữ danh sách dùng được; không lấy SVG trang trí giả làm bản đồ đang hoạt động.
- “Gần tôi” chỉ xin vị trí sau khi người dùng bấm. Xử lý được từ chối, không hỗ trợ và timeout; không xin vị trí khi vừa vào trang, không tự bịa vị trí hoặc khoảng cách.
- Chỉ đưa tọa độ được phép công khai lên bản đồ. Không dùng việc làm map để bỏ qua quyền truy cập của địa điểm/nội dung hạn chế.

### 6. P1 — Hoàn thiện trang địa điểm và đọc bài

**S02:** ảnh và thông tin khớp địa điểm; breadcrumb rõ; cảnh báo dễ đọc; danh sách bài phân biệt trạng thái truy cập với trạng thái kiểm định. Mọi tiêu đề, ngày, bộ đếm và CTA đều dịch được.

**S03:**

- Giữ Markdown đã render đúng; giữ cơ chế xử lý nội dung an toàn hiện có. Tối ưu cột đọc khoảng 65–75 ký tự một dòng và nhịp đoạn dễ đọc.
- Trình bày tiêu đề, tác giả, ngày quan sát/cập nhật rồi đến tóm tắt kiểm định và nội dung. Ảnh bài có ngữ cảnh, không lặp lại hình trang trí vô nghĩa.
- VerificationPanel hiển thị bằng ngôn ngữ dễ hiểu: trạng thái, phạm vi, ngày kiểm tra, hạn hiệu lực và nguồn liên quan. Làm rõ việc kiểm tra thông tin không bảo đảm an toàn tuyệt đối cho chuyến đi.
- Thu gọn lịch sử phiên bản thành accordion/drawer/sidebar vừa chiều rộng. Cho phép xuống dòng hợp lý; không để badge hoặc mã dài tràn khung. Giữ deep link tới revision và lựa chọn revision đang xem.
- Các mã PST/REV và chi tiết kỹ thuật vẫn truy xuất được trong “Thông tin phiên bản”; không cần chiếm ưu thế hơn nội dung.
- CTA “Báo thông tin cần cập nhật” và “Ủng hộ” phải dùng luồng/component có sẵn và đúng quyền, đúng revision/tip route. Nếu backend tương ứng chưa có, ghi rõ trạng thái; không tạo thông báo gửi thành công giả.
- Đổi locale khi đang xem một revision cụ thể phải giữ revision đó. Không chuyển ngầm sang bản mới nhất hoặc kế thừa nhãn/tip của phiên bản khác.

### 7. P1 — Sửa trang VIP và ngôn ngữ sản phẩm

- Hiển thị tên gói, giá và kỳ hạn bằng locale đang chọn. Theo baseline hiện tại: 15 USD / 12 tháng; giá lấy từ cấu hình, không hardcode thêm nguồn giá mới.
- Giữ `priceUsdCents=1500` ở tầng dữ liệu nhưng không hiển thị “1500 USD cents” cho người mua.
- Quyền lợi tập trung vào nội dung khám phá mới được tuyển chọn và hướng dẫn chuyên sâu đã có/quy hoạch được xác nhận. Chỉ quảng bá offline GPX, bản đồ 3D hoặc tính năng khác nếu bản đang bàn giao thực sự hỗ trợ; không hứa tính năng chưa có.
- Bỏ cách chào bán “tọa độ khẩn cấp” hoặc “hốc trú bão bí mật” làm giá trị cốt lõi của VIP. Cảnh báo cần thiết vẫn public theo đặc tả; không tự công khai tọa độ riêng hay bỏ entitlement server.
- Sửa marketing copy và fixture phù hợp; nếu nội dung nguồn đã đóng băng, dùng luồng revision mới thay vì ghi đè snapshot.
- Giải thích ngắn: VIP là quyền đọc có thời hạn, không phải chứng nhận chuyên gia; donate và membership là hai việc khác nhau.
- Giữ gia hạn chủ động, không tự bật thanh toán định kỳ. Chỉ hiển thị kênh thanh toán đã cấu hình. Không cấp quyền từ trạng thái pending hoặc toast thành công phía client.
- Giữ locale và `returnTo` hợp lệ qua đăng nhập; không đổi cấu hình production chỉ để làm demo chạy được.

### 8. Các nguyên tắc phải giữ nguyên

- Giữ UUID/business ID, quan hệ PK/FK, display code, API contract và liên kết sâu hiện có. Locale và nhãn dịch không trở thành định danh địa điểm, bài hoặc region.
- Không thay đổi semantics của verification, quyền tác giả, donate, tip split, VIP, role, SBT/NFT hoặc onchain để thuận tiện làm UI.
- Không làm lộ nội dung VIP/private trong DOM hoặc dữ liệu public rồi chỉ che bằng CSS. Không gỡ kiểm quyền server.
- Demo banner dùng câu dễ hiểu đã dịch; bộ đổi vai trò demo chỉ hoạt động trong môi trường demo theo cơ chế hiện có. Không biến nó thành cách tự cấp quyền thật.
- Không ghi đè công việc của người dùng; không đổi hạ tầng deploy hoặc nhận tiền thật trong nhiệm vụ này. Bàn giao thay đổi để review và các bước đưa lên deploy preview.

### 9. Kiểm tra có mục tiêu trước khi bàn giao

Chạy lint/typecheck/build và những test phù hợp đang có trong repository. Thêm kiểm tra cần thiết cho lỗi vừa sửa; không tạo test chỉ phản chiếu code hoặc mở rộng sang nghiệp vụ ngoài phạm vi.

**Tự động, nếu hạ tầng hỗ trợ:**

1. Kiểm tra catalog của sáu locale: đủ key, message hợp lệ, biến nội suy đúng. Kiểm tra DOM của các màn hình trọng tâm không lộ key dịch. Phân biệt key lỗi với URL/mã hợp lệ để tránh báo nhầm.
2. Smoke test Explore → địa điểm → bài viết → đổi locale; giữ ID và `revisionId`. Kiểm tra reload, back/forward và đường dẫn VIP/login.
3. Kiểm tra tìm kiếm có/không dấu, reset filter, zero result và resolve địa điểm đã gộp không sinh kết quả chính trùng lặp.
4. Kiểm tra marker theo kết quả lọc, mở chi tiết, map failure và geolocation denied bằng dữ liệu/môi trường kiểm thử phù hợp.

**Kiểm tra trực quan:**

- Mở Explore, địa điểm, bài và VIP ở đủ sáu ngôn ngữ. Xem cả cảnh báo, scope kiểm định, nội dung fixture và trạng thái rỗng/lỗi, không chỉ nhìn header.
- Kiểm tra responsive tại 390px, 768px và 1440px; kiểm tra thêm 360px cho header, bộ chọn ngôn ngữ và nút dài. Đặc biệt xem tiếng Pháp và các locale CJK.
- Không có cuộn ngang ngoài ý muốn, chồng chữ, cắt CTA hoặc badge tràn khung. Bàn phím dùng được menu locale, filter, accordion và modal; focus rõ, label đầy đủ.
- Chụp ảnh sau sửa cho Explore desktop/mobile, bài viết desktop/mobile và VIP; thêm ảnh French hoặc CJK thể hiện nhãn dài/font hoạt động. Dùng dữ liệu demo rõ ràng, tránh thông tin tài khoản thật.

Không gọi kết quả PASS nếu chưa chạy. Nếu môi trường thiếu browser, khóa map, ảnh đúng địa điểm hoặc backend, ghi chính xác phần đã kiểm chứng và phần còn bị chặn. Không thay tương tác thật bằng ảnh screenshot hoặc state thành công giả.

### 10. Cách làm và kết quả bàn giao

Thực hiện tuần tự: sửa i18n và dữ liệu hiển thị → chỉnh shared UI và Explore → hoàn thiện map, địa điểm, bài, VIP → kiểm tra và sửa lỗi còn lại. Tự quyết các chi tiết triển khai thông thường; không dừng để xin xác nhận từng component. Không dùng vòng lặp tự chạy vô hạn hoặc làm lại cả dự án khi một lỗi nhỏ chưa đạt.

Khi xong, báo cáo ngắn bằng tiếng Việt:

1. Những gì đã sửa, theo nhóm lỗi; nguyên nhân chính của lỗi i18n tìm thấy trong code.
2. Các file/component chính thay đổi và dependency mới nếu có.
3. Lệnh kiểm tra đã chạy, kết quả thực tế và lỗi còn tồn tại.
4. Ảnh desktop/mobile sau sửa và route local để nghiệm thu.
5. Tình trạng ảnh, nguồn ảnh, cấu hình bản đồ và những phần còn thiếu thật sự.
6. Các bước push nhánh hiện tại và mở deploy preview theo cấu hình repo; chưa tự merge hoặc publish production.

Tiêu chí hoàn tất: UI không lộ mã dịch; sáu ngôn ngữ đầy đủ trong phạm vi demo và nhãn giao diện; fallback nội dung cộng đồng minh bạch; hình ảnh đa dạng có ngữ cảnh; bố cục desktop/mobile dễ đọc; bản đồ dùng được hoặc báo rõ phần bị chặn; tìm kiếm/canonical/revision không bị hồi quy; hệ ID và logic nghiệp vụ được bảo toàn.

Hãy bắt đầu đọc repository và triển khai ngay.

## Kết thúc prompt
