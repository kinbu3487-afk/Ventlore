# Ventlore — Điều chỉnh Explore: điểm đến, bản đồ và Gần tôi

Ngày: 26/09/2026. Phạm vi: FE trang Explore hiện hữu.

## Căn cứ và mục tiêu

Ảnh giao diện Bin gửi lúc 21:05 cho thấy khối giới thiệu, bộ lọc và trạng thái định vị chiếm gần toàn bộ màn hình đầu. Bản đồ và điểm đến bị đẩy xuống dưới. Đánh giá này dựa trên ảnh, chưa xác nhận trạng thái code hoặc bản triển khai trực tiếp.

Yêu cầu mới của Bin ưu tiên nhu cầu tìm điểm đẹp để đi phượt: người dùng phải thấy nơi có thể đi, vị trí của chúng và nút Gần tôi ngay khi mở Explore. Thông tin kiểm tra giúp họ đánh giá một điểm đến; phần giới thiệu quy trình không cần đứng trước kết quả khám phá.

Nguồn đối chiếu: Event UI Spec v0.3, luồng U01-E01/E02/E03; Journeys FE-BE-Chain Masterboard v1.1, luồng G; Brand Guide v0.1. Yêu cầu mới thay đề xuất ưu tiên danh sách của bản UI Spec cũ ở trang Explore. Luồng đọc public vẫn dùng ID hiện hữu và không yêu cầu đăng nhập/ví.

---

## Prompt để chạy trong workspace Ventlore

Bạn là kỹ sư FE kiêm người thiết kế trải nghiệm. Hãy chỉnh trực tiếp trang Explore của Ventlore trong repo đang mở theo đặc tả dưới đây. Đọc hướng dẫn repo, tìm route/component hiện có, kiểm tra thư viện bản đồ và dữ liệu đang dùng rồi thực hiện thay đổi. Dùng cấu trúc hiện có; không giả định tên file, endpoint hoặc component đã tồn tại.

### 1. Kết quả cần đạt

Khi mở Explore, người dùng lập tức thấy:

1. Ô tìm địa điểm và nút Gần tôi.
2. Bản đồ là vùng nội dung chính, có ghim/cụm điểm.
3. Thẻ điểm đến có ảnh để chọn nơi muốn đi.

Không dùng một hero lớn hoặc form nhiều tầng đứng trước bản đồ. Đưa giới thiệu về kiểm tra độc lập xuống khu vực giới thiệu ở cuối nội dung hoặc trang giải thích hiện có. Đưa cảnh báo thực tế vào đúng điểm đến và bài viết liên quan.

### 2. Bố cục desktop

- Giữ thanh điều hướng và đổi ngôn ngữ hiện có.
- Dùng tiêu đề nhỏ “Bạn muốn đi đâu?”; không đặt trong một card trắng cao riêng biệt. Có thể dùng tiêu đề này làm nhãn của vùng tìm kiếm.
- Hàng tìm kiếm: ô “Tìm điểm đến hoặc khu vực…” chiếm phần lớn chiều ngang; cạnh đó là nút nổi bật “Gần tôi” và nút “Bộ lọc”.
- Hàng thứ hai gọn: các chip hoạt động từ taxonomy hiện có, số kết quả và điều khiển Bản đồ/Danh sách. Không thêm phân loại giả chỉ để lấp đầy.
- Ngay dưới là vùng kết quả: thẻ điểm đến bên trái khoảng 30–35%, bản đồ bên phải khoảng 65–70%. Bản đồ là chế độ mặc định; tránh một tiêu đề hoặc khoảng trắng lớn chen giữa thanh tìm và bản đồ.
- Panel thẻ có chiều rộng thực dụng khoảng 320–400 px, bản đồ dùng phần còn lại. Chuyển sang bố cục mobile khi hai vùng không còn đủ chỗ.
- Mỗi thẻ có ảnh đủ lớn để nhận ra cảnh quan, tên, khu vực, loại hoạt động và khoảng cách khi đã có vị trí. Không hiển thị ID kỹ thuật trên thẻ.
- Ở màn hình 1440 × 900, kiểm tra mục tiêu: mép trên bản đồ nằm trong khoảng 180 px đầu trang, ít nhất một thẻ với ảnh và một phần đáng kể của bản đồ hiện trước khi cuộn. Đây là mục tiêu nghiệm thu bố cục, không phải kích thước đo từ ảnh nguồn.
- Có thể dùng vùng Explore cao bằng phần màn hình còn lại dưới thanh công cụ; panel thẻ cuộn độc lập trên desktop nếu cần. Footer/quy trình giới thiệu phải có đường truy cập rõ, không bị khóa ngoài vùng cuộn.

### 3. Bố cục mobile

- Header gọn; ô tìm kiếm cùng nút Gần tôi luôn dễ chạm. Bộ lọc chi tiết mở thành bottom sheet hoặc drawer.
- Bản đồ xuất hiện ngay dưới thanh tìm và chip hoạt động, chiếm phần lớn vùng nhìn ban đầu.
- Dùng bottom sheet điểm đến ở trạng thái thu gọn, hiện một thẻ có ảnh hoặc phần đầu danh sách. Có nút mở rộng rõ ràng, không phụ thuộc riêng thao tác kéo.
- Có thể dùng thẻ ngang trên mép dưới bản đồ nếu repo đã có component tương ứng; chọn một kiểu, tránh chồng nhiều lớp điều khiển.
- Nút Bản đồ/Danh sách vẫn dễ tìm. Chế độ Danh sách phục vụ người muốn đọc nhiều điểm liên tiếp.
- Chừa không gian cho thao tác bản đồ, attribution, nút định vị và safe area. Không để thẻ che hết ghim đang chọn.

### 4. Thu gọn những phần đang chiếm chỗ

| Hiện tại trong ảnh | Điều chỉnh |
| --- | --- |
| Badge “Khám phá thực địa”, “Kiểm tra độc lập theo phạm vi” ở đầu | Bỏ khỏi vùng đầu Explore; giải thích tại trang giới thiệu/phạm vi kiểm tra |
| Card lớn “Khám phá điểm đến” và đoạn “Nền tảng kiểm định…” | Thay bằng một tiêu đề ngắn gắn với vùng tìm kiếm |
| Tỉnh/thành, hoạt động, Gần tôi nằm trong form lớn | Gần tôi cạnh ô tìm; hoạt động thành chip; tỉnh/thành và tùy chọn sâu trong Bộ lọc |
| Card trạng thái vị trí, độ chính xác, cập nhật/xóa và nhiều nút bán kính | Một chip “Gần tôi · 50 km”; bấm để sửa bán kính, cập nhật hoặc tắt |
| Thanh đếm kết quả và đổi chế độ chiếm riêng khoảng lớn | Gộp vào hàng công cụ phụ |
| Badge lớn tên công nghệ bản đồ | Thu gọn chrome không phục vụ tác vụ; giữ attribution/logo bắt buộc của nhà cung cấp và nguồn dữ liệu |

### 5. Hành vi Gần tôi

- Chưa có vị trí: vẫn hiển thị các điểm public đang có trên bản đồ và thẻ. Không chặn trang bằng yêu cầu định vị; không mặc định thiết bị ở Đà Nẵng hoặc một tỉnh bất kỳ.
- Chỉ bắt đầu lấy vị trí khi người dùng bấm Gần tôi. Dùng Geolocation API của trình duyệt qua HTTPS, có xin quyền theo cơ chế trình duyệt. Không yêu cầu tài khoản hay ví.
- Trong lúc lấy vị trí, nút hiện “Đang xác định…”; giữ kết quả cũ có thể dùng. Thành công mới kích hoạt trạng thái Gần tôi.
- Lần đầu đề xuất bán kính 50 km. Khi đã chọn bán kính khác trong phiên thì dùng lựa chọn đó. Popover có các mức hiện hữu phù hợp và lựa chọn toàn bộ; không trải tất cả thành một khối thường trực.
- Sau thành công: hiển thị vị trí người dùng khác với ghim điểm đến, vùng sai số khi cần, các điểm trong bán kính và sắp xếp gần nhất trước. Khoảng cách là đường thẳng nếu chưa có dịch vụ chỉ đường; không đổi thành thời gian di chuyển giả.
- Độ chính xác, cập nhật và tắt Gần tôi nằm trong popover. Khi độ chính xác quá thấp để bộ lọc có ý nghĩa, hiện thông báo ngắn cho phép chọn khu vực thủ công, tránh tạo cảm giác kết quả chính xác tuyệt đối.
- Bị từ chối, timeout, thiết bị không hỗ trợ: hiện thông báo ngắn và “Chọn khu vực”; bản đồ vẫn dùng được. Không tự gọi lại để hỏi quyền liên tục.
- Không có kết quả: “Chưa có điểm đến trong dữ liệu Ventlore ở phạm vi này.” Kèm hành động tăng bán kính hoặc chọn khu vực khác. Không suy diễn rằng khu vực thực tế không có chỗ đẹp.
- Nếu mở rộng phạm vi, chỉ thực hiện sau khi người dùng chọn và cập nhật nhãn bán kính tương ứng.
- Vị trí thiết bị ở state trong phiên; không đưa tọa độ chính xác vào URL chia sẻ, analytics hoặc localStorage lâu dài. Luồng tìm bằng vị trí không tạo ID nghiệp vụ mới.

### 6. Đồng bộ bản đồ và thẻ

- Ghim và thẻ tham chiếu cùng placeId hiện hữu. Chọn thẻ làm nổi ghim; chọn ghim mở đúng thẻ/preview. Mở chi tiết đi tới route canonical hiện có.
- Map/list dùng cùng bộ lọc và tập kết quả logic. Phân trang/virtualization có thể giới hạn số thẻ đang render nhưng tổng đếm và phạm vi ghim phải nhất quán.
- Gom cụm khi zoom xa; mở cụm hoặc zoom gần để chọn điểm. Không render hàng trăm popup thường trực.
- Khi người dùng kéo bản đồ, hiện “Tìm trong vùng này”. Bấm nút mới áp dụng vùng nhìn làm phạm vi tìm. Hành động này chuyển rõ sang chế độ vùng bản đồ, tắt giới hạn bán kính Gần tôi; giữ vị trí thiết bị để tham khảo nếu đã có quyền.
- Không tự lọc lại hoặc kéo tâm bản đồ về thiết bị sau mỗi thao tác. Tránh vòng lặp chọn thẻ → pan → fetch → đổi selection.
- Dùng chung search/filter state. Bộ lọc hoạt động áp dụng cho cả chế độ khu vực và Gần tôi. Nếu có bộ lọc tỉnh cũ, khi chuyển Gần tôi phải xử lý rõ: bỏ ràng buộc tỉnh và phản ánh trên chip, tránh giao cắt ngầm gây kết quả trống.
- Back từ chi tiết giữ vị trí cuộn, lựa chọn và phạm vi khám phá trong phiên. Đổi ngôn ngữ giữ nơi đang xem nếu route tương ứng tồn tại.

### 7. Cảnh quan và thông tin đáng tin cậy

- Dùng ảnh thực của điểm đến khi có. Không lấy ảnh đẹp nơi khác gán cho một điểm. Thiếu ảnh dùng placeholder trung tính.
- Không tự tạo điểm đánh giá, số lượt đi, thời tiết, xác nhận đã kiểm tra hoặc thời gian di chuyển.
- Có thể dùng nhãn hoạt động như “Trekking”, “Cắm trại”, “Biển” theo dữ liệu hiện hữu; không tự suy ra “phù hợp người mới” hoặc “an toàn” từ ảnh.
- Cảnh báo quan trọng và đóng cửa đang có hiệu lực vẫn nổi bật trên thẻ/preview liên quan. Không giấu chúng để ưu tiên ảnh đẹp.
- Thông tin đã kiểm tra phải giữ đúng nguồn, revision, phạm vi và thời điểm theo dữ liệu. Không biến huy hiệu của một bài thành bảo chứng cho toàn điểm đến.
- Phần diễn giải đầy đủ về phương pháp kiểm tra đặt sau vùng khám phá hoặc ở trang giới thiệu, với liên kết ngắn từ nhãn liên quan.
- Nếu repo có dữ liệu giả lập để kiểm thử mật độ điểm, tiếp tục phân biệt bằng cơ chế dữ liệu/môi trường. Không gán verified cho fixture và không đưa fixture lên production như thông tin thực địa đã xác nhận.

### 8. Nhận diện, đa ngôn ngữ và phạm vi kỹ thuật

- Dùng token thương hiệu hiện có. Brand Guide v0.1: Forest #173F35, Jade #2C7563, Sage #DCE8DA, Ivory #F5F1E8, Waypoint #F0A44B, Ink #182522; font Be Vietnam Pro. Màu trạng thái phải có chữ đi kèm.
- Giảm padding và các lớp card bao quanh công cụ; giữ khoảng thở cho ảnh và bản đồ. Không làm chữ hoặc vùng chạm nhỏ để ép bố cục.
- Tất cả chuỗi mới qua hệ i18n hiện hữu cho VI, EN, JP, CN, KR, FR theo locale code thực tế trong repo. Dịch cả loading, lỗi vị trí, empty state, bộ lọc và khoảng cách; kiểm tra chuỗi dài trên mobile.
- Đọc public không cần login/ví. Giữ regionId, placeId, postId, revisionId và quyền đọc hiện có; không đổi registry cho một thay đổi bố cục.
- Tái sử dụng thư viện bản đồ, nguồn dữ liệu và adapter hiện có. Chưa có BE thì giữ adapter/fixture theo cơ chế repo; không tự thêm BE hay contract trong nhiệm vụ này.
- Giữ responsive, keyboard navigation, focus, nhãn input, nút đóng drawer và trả focus. Có đường thao tác bằng danh sách cho người không dùng được bản đồ.
- Phạm vi chỉnh là Explore và component liên quan. Home giữ luồng dẫn vào khám phá hiện hữu; không tự thay toàn homepage hoặc các luồng Donate/VIP/Operators.

### 9. Nghiệm thu và bàn giao

Kiểm tra ở desktop 1440 × 900, laptop 1366 × 768 và mobile khoảng 390 × 844, thêm chiều rộng 320 px cho tràn ngang:

1. Không cuộn vẫn thấy ô tìm, Gần tôi, bản đồ và ít nhất một thẻ có ảnh.
2. Chưa xin vị trí vẫn khám phá được; không tự bật popup xin quyền khi tải trang.
3. Cho phép/từ chối/timeout vị trí đều có hành vi hữu ích; không kẹt loading.
4. Bán kính và bộ lọc đổi cùng tập kết quả ở map/list; empty state không đưa nhận định sai về thực địa.
5. Ghim/thẻ/route đúng cùng placeId; trở lại từ chi tiết giữ ngữ cảnh.
6. Kéo bản đồ không bị tự kéo về; Tìm trong vùng này chuyển phạm vi rõ ràng.
7. Cảnh báo quan trọng vẫn hiện; badge kiểm tra không bị nâng thành bảo chứng toàn địa điểm.
8. Kiểm tra mật độ với toàn bộ fixture hiện có, bao gồm tập 100 điểm nếu repo có; clustering hoạt động và đếm kết quả đúng.
9. Chuyển mọi ngôn ngữ đã hỗ trợ không sót chuỗi mới hoặc mất điểm đang chọn.
10. Không lỗi console nghiêm trọng, không tràn ngang; attribution bản đồ còn đọc được.

Chạy build/lint hoặc gate hiện có phù hợp với thay đổi. Dùng kiểm tra tương tác cho map/list và geolocation; không viết test chỉ kiểm tra các giá trị padding.

Bàn giao danh sách file thay đổi, mô tả hành vi, ảnh trước/sau desktop/mobile và kết quả kiểm tra thực tế. Ghi rõ điều gì chưa chạy được. Không tuyên bố bản production đã đổi khi mới hoàn thành code hoặc preview.

## Tham khảo kỹ thuật

- MDN, Geolocation API: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
- MDN, getCurrentPosition: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

Geolocation của trình duyệt yêu cầu secure context và quyền người dùng. Việc chỉ gọi sau khi bấm Gần tôi là lựa chọn UX của đặc tả này.
