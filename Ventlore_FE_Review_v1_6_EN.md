# Ventlore FE — Đánh giá bản tiếng Anh v1.6

Ngày đánh giá: 26/09/2026, lượt kiểm tra từ URL https://ventlore.com/en/ do Bin gửi lúc 19:16, giờ Việt Nam.

**Kết luận:** bản mới đã giải quyết được vấn đề thiếu số lượng điểm đến và có nền tảng khám phá đủ để đánh giá tiếp. Đã xác nhận 100 điểm khác nhau, lọc được toàn bộ 34 tỉnh/thành, mỗi nơi 2–3 điểm. Phần cần ưu tiên tiếp theo là tính nhất quán ngôn ngữ, giữ ngữ cảnh khi chuyển sang viết bài, khả năng đọc bản đồ nhiều ghim và cách trình bày dữ liệu có thể kiểm chứng.

Đây là báo cáo quan sát UI và hành vi trình duyệt, chưa phải kết luận từ việc đọc repository. Không có thay đổi code hoặc deploy được thực hiện trong lượt đánh giá này.

## 1. Phạm vi và cách kiểm tra

Đã xem 12 URL khác nhau:

- Home: https://ventlore.com/en/
- Explore: https://ventlore.com/en/explore/
- VIP: https://ventlore.com/en/vip/
- Login: https://ventlore.com/en/login/
- Transparency: https://ventlore.com/en/transparency/
- Contribute: https://ventlore.com/en/contribute/
- Lung Ngọc Hoàng: https://ventlore.com/en/places/01a0db02-f85f-7268-8891-5659b9c250fa/
- Tràng An: https://ventlore.com/en/places/01a0db02-f828-7dd1-835f-c3e2cc61a8c6/
- Cát Cò 3: https://ventlore.com/en/places/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e02/
- Bài hướng dẫn Cát Cò 3: https://ventlore.com/en/posts/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10/
- Hồ sơ tác giả tiếng Anh: https://ventlore.com/en/people/minh_trailguide/
- Cùng hồ sơ sau khi đổi tiếng Nhật: https://ventlore.com/ja/people/minh_trailguide/

Đã thao tác phân trang, lọc đủ 34 tỉnh/thành, tìm kiếm không dấu, tìm tên tỉnh cũ, lọc kết hợp, trạng thái không kết quả, chuyển List/Map, mở hộp Gần tôi, yêu cầu định vị, mở modal đóng góp/mua VIP/ủng hộ quỹ, chuyển ngôn ngữ hồ sơ và đi từ chi tiết điểm đến sang form đóng góp.

Không gửi bài, không đăng nhập OAuth mới, không thanh toán hoặc ký giao dịch. Phiên trình duyệt có trạng thái tài khoản/draft từ các vòng trước; không coi dữ liệu draft đó là nội dung được phát hành mặc định của bản mới.

Thiết bị kiểm tra: trình duyệt desktop, viewport quan sát 1363×936. Chưa kiểm trên iPad thật, chưa kiểm thành công vị trí thiết bị của Bin, chưa đo Core Web Vitals, chưa rà hết sáu ngôn ngữ hoặc mở đủ 100 trang chi tiết.

Đối chiếu thêm Brand Guide v0.1 và Journeys FE–BE–Chain Masterboard v1.1 trong Sources. Những nhận xét về bản đang chạy dựa trên trang quan sát trực tiếp, không suy từ tài liệu thiết kế.

## 2. Những phần đã tiến bộ và cần giữ

| Hạng mục | Kết quả xác nhận |
| --- | --- |
| Trang chủ | Hero, chọn ngôn ngữ và hai CTA rõ; không thấy banner DEMO hoặc toolbar nghiệm thu trên các màn đã xem |
| Tổng điểm | Đi qua đủ 9 trang: 8 trang × 12 điểm + trang cuối 4 điểm; thu được 100 placeId khác nhau |
| Phân bố tỉnh/thành | Chọn lần lượt cả 34 bộ lọc; Điện Biên/Lai Châu mỗi nơi 2, 32 tỉnh/thành còn lại mỗi nơi 3; tổng 100 |
| Tìm kiếm không dấu | `My Khe` trả đúng hai mục Mỹ Khê ở Đà Nẵng và Quảng Ngãi |
| Alias địa phương | `Quang Nam` trả ba điểm thuộc danh mục Đà Nẵng hiện hành |
| Lọc kết hợp | Đà Nẵng + Coasts & Islands trả Mỹ Khê và Sơn Trà; Map có cùng hai ghim |
| Phân trang | Có Previous/Next; thay điều kiện tìm kiếm quay về kết quả phù hợp; trang cuối chỉ còn bốn mục |
| Không kết quả | Có thông báo và lựa chọn Reset filters |
| Map | 100 ghim khi xem toàn bộ; không giới hạn ghim ở 12 card của trang đầu |
| Gần tôi | Có lời giải thích, Use my location và Select a region trước khi yêu cầu vị trí; nhánh bị từ chối quyền hiển thị rõ |
| Điểm mới | Mở được các trang seed đã chọn; có Approximate area và trạng thái đang bổ sung thông tin thực địa |
| Điểm và bài cũ | Cát Cò 3 vẫn giữ bài viết và route cũ; bài hiển thị phạm vi kiểm tra, ngày và thời hạn |
| Hồ sơ đa ngôn ngữ | Hồ sơ Minh có bio/nội dung tiếng Anh; chuyển sang tiếng Nhật giữ đúng người và đổi nội dung quan sát được |
| Thanh toán chưa khả dụng | Modal VIP và quỹ có nút khóa; không báo thành công khi dịch vụ chưa sẵn sàng |

Các kết quả trên xác nhận quy mô và hành vi UI, không xác nhận tọa độ ngoài thực địa, tính xác thực của chứng nhận hoặc số liệu tài chính.

## 3. Danh sách sửa ưu tiên

P1: ảnh hưởng trực tiếp đến việc hiểu, thực hiện đúng tác vụ hoặc độ tin cậy của sản phẩm. P2: ảnh hưởng chất lượng sử dụng và mức hoàn thiện. Đây là thứ tự sửa đề xuất, không phải quy trình duyệt từng bước.

### FE-16-01 — P1: Tiếng Anh còn trộn tiếng Việt trên nhiều luồng

**Bằng chứng quan sát:**

- Explore `/en/`: mô tả 97 điểm mới vẫn theo mẫu tiếng Việt; chip “Khám phá rừng”, “Ngắm cảnh”; bộ lọc còn `(3 điểm)` và footer phân trang `(100 điểm)`.
- Map: `(100 ghim)`, `Xem toàn bộ`, tên truy cập marker bắt đầu bằng `Xem`.
- Near me: lời giải thích tiếng Anh nhưng nút `Đóng`, `Thử lại` bằng tiếng Việt.
- Home → I want to contribute: tiêu đề modal tiếng Anh, bốn nhánh nội dung/CTA phần lớn tiếng Việt.
- Login: Google tiếng Anh, `Tiếp tục với Apple`, `Xem nội dung công khai`, `Tiếp tục khám phá` và đoạn riêng tư tiếng Việt.
- Contribute: H1, placeholder, loại đóng góp, nguồn tham khảo và nhiều nhãn tiếng Việt.
- Chi tiết seed: phần giới thiệu và giải thích tọa độ chưa được dịch.
- Bài viết: nội dung chính tiếng Anh nhưng nút báo sai, tip và một số thông tin cuối bài còn tiếng Việt.
- Modal VIP/Donate: nhiều nội dung tài khoản, giá, phương thức, trạng thái cổng và nút đóng chưa dịch.
- Trên Explore, thuộc tính `lang` là `en` nhưng tiêu đề tab vẫn là `Ventlore - Hiểu nơi đến. Vững bước đi.`

**Cách sửa:** tách bản dịch UI khỏi bản dịch nội dung dữ liệu. UI dùng khóa dịch thống nhất; nhóm hoạt động hiển thị theo `activityId`. Seed cần trường nội dung theo locale hoặc fallback được thiết kế rõ. Tên riêng địa danh có thể giữ tiếng Việt; câu mô tả, đơn vị, động từ, trạng thái và accessible label phải theo locale.

**Điều kiện hoàn thành:** đi trọn Home → Explore → chi tiết → bài → đóng góp → login/VIP bằng tiếng Anh; không còn câu tiếng Việt ngoài tên riêng/nội dung người dùng chưa có bản dịch được ghi rõ. Kiểm cả modal, thông báo lỗi, tiêu đề tab và accessible label. Kiểm mẫu tương tự với bốn ngôn ngữ còn lại, không suy rằng hồ sơ Nhật đã đúng thì toàn site đã đúng.

### FE-16-02 — P1: CTA tại điểm đã có làm mất điểm đang xem

**Tái hiện đã thực hiện:**

1. Mở Tràng An: `/en/places/01a0db02-f828-7dd1-835f-c3e2cc61a8c6/`.
2. Ở phần chưa có bài, bấm `Propose New Place`.
3. Điều hướng tới `/en/contribute/` không có placeId trong URL.
4. Form hiển thị nhánh viết bài cho điểm đã có nhưng chọn sẵn **Lung Ngọc Hoàng**, không phải Tràng An.

Người dùng có thể viết bài đúng nội dung nhưng gắn nhầm điểm đến. Đây là lỗi tác vụ cần sửa trước các chỉnh sửa trang trí.

**Cách sửa:**

- CTA tại điểm đã có: `Share your experience` / `Chia sẻ trải nghiệm`.
- Truyền đúng canonical `placeId`; ví dụ `/en/contribute/?tab=existing&placeId=01a0db02-f828-7dd1-835f-c3e2cc61a8c6`. Adapter thực tế phải kiểm và áp dụng tham số này; chỉ đổi URL mà không khởi tạo đúng form là chưa đủ.
- Khởi tạo selector từ placeId hợp lệ. Nếu tài khoản cần đăng nhập, returnTo phải giữ nguyên locale, tab và placeId.
- Khi không có placeId, yêu cầu chọn điểm rõ ràng; tránh mặc định im lặng vào mục đầu danh sách.
- Nháp có placeId khác phải được xử lý rõ, không đổi nhầm địa điểm của nháp chỉ vì mở từ CTA.
- CTA đề xuất địa điểm mới phải mở đúng tab `candidate` hoặc tên tab thực tế tương ứng trong repo.

**Điều kiện hoàn thành:** mở CTA từ Tràng An, Sơn Trà và Cát Cò 3 đều vào đúng điểm; chuyển qua login và quay lại vẫn đúng; không tạo placeId mới cho một điểm đã có.

### FE-16-03 — P1: Số liệu quỹ và chứng nhận chưa có đường kiểm chứng rõ

**Bằng chứng:**

- Transparency hiển thị Available `2,450.00 USDC`, `1.25 ETH`, khoản `1,200 USDC` gắn với mô tả 80 gói VIP, và hai khoản chi.
- Cột `View Receipt` hiện mã rút gọn như `0x3a4b...89fc` dưới dạng chữ; không thấy link chứng từ/giao dịch có thể mở từ bảng.
- Hồ sơ Minh hiển thị một Contributor SBT với token ID và ngày cấp, nhưng phần đó không có link kiểm tra contract/token/giao dịch trong UI đã đọc.
- Cùng lúc, modal VIP/Donate thông báo cổng thanh toán đang tích hợp.

Chưa có đủ bằng chứng để xác nhận các số liệu/chứng nhận trên là thật hay là fixture còn lại. Việc chưa mở thanh toán tự nó không chứng minh số dư không có thật; quỹ có thể có nguồn khác. Tuy nhiên người xem hiện chưa có đường đối chiếu.

**Cách sửa:**

- Chỉ công bố số liệu đã có căn cứ. Kèm nguồn, thời điểm cập nhật và đơn vị tài sản.
- Chứng từ onchain có link đúng explorer/network/hash đầy đủ; chứng từ kế toán ngoài chain có nguồn tài liệu tương ứng.
- Nếu chưa có dữ liệu xác thực, dùng trạng thái `No published records yet` hoặc `Data is being updated`; không tự điền số dư 0 nếu thực tế chưa biết.
- SBT thật cần thông tin contract/network/token hoặc link kiểm chứng. Nếu chưa có dữ liệu thật, hiển thị trạng thái chưa có chứng nhận.
- Giữ 100 điểm seed để đánh giá khám phá theo yêu cầu Bin; không dùng quyền giả lập điểm đến làm căn cứ tự công bố giao dịch/chứng nhận thực.

**Điều kiện hoàn thành:** mọi số dư, khoản chi và chứng nhận công bố có nguồn theo dõi được hoặc trạng thái chưa có dữ liệu rõ ràng. Không cần triển khai Chain mới chỉ để sửa cách trình bày FE.

### FE-16-04 — P2: 100 ghim chồng nhau ở chế độ nhìn toàn quốc

Map đã lấy đủ dữ liệu. Ở mức zoom toàn quốc, các ghim kích thước lớn chồng dày trên dải Việt Nam, khó chọn đúng điểm hoặc hiểu mật độ. Ảnh quan sát cho thấy chưa có cụm ghim mang số lượng tại mức zoom này.

**Cách sửa:** nhóm ghim theo mức zoom; cụm hiển thị số điểm; phóng to thì tách dần. Marker được chọn có trạng thái nổi bật; popup và danh sách bên cạnh cùng một placeId. Nhóm theo góc nhìn bản đồ, không coi ranh giới tỉnh là điều kiện “gần nhau”.

Ở trạng thái Map toàn quốc, cột bên cạnh chứa 12 điểm và không thấy nút chuyển trang như chế độ List. Làm rõ đó là danh sách phân trang hoặc cho cuộn/tải tiếp đủ kết quả; chọn một ghim ngoài 12 mục đầu phải hiện đúng điểm trong panel. Giữ Map dùng toàn bộ kết quả đã lọc.

**Điều kiện hoàn thành:** nhìn toàn quốc đọc được mật độ; xem riêng Đà Nẵng chọn được từng điểm; bộ đếm/list/map không mâu thuẫn; kiểm chạm và xoay iPad sau tích hợp.

### FE-16-05 — P2: Ảnh minh họa bị mô tả như ảnh địa phương có giấy phép

Nhiều card mới dùng cùng hình núi đồ họa, nhưng badge ghi `Area photo • Open license`. Hình này là placeholder minh họa; nhãn “photo” khiến người xem hiểu sai bản chất ảnh. Trong lượt này chưa có nguồn để xác nhận giấy phép của từng asset.

**Cách sửa:** với placeholder, dùng `Destination illustration` hoặc bỏ badge ảnh. Chỉ hiển thị “photo”, tên tác giả và giấy phép khi có metadata nguồn tương ứng. Có thể dùng một số biến thể placeholder theo nhóm biển/rừng/hồ/văn hóa để 100 card dễ phân biệt hơn; không cần sưu tầm đủ 100 ảnh mới hoàn thiện FE.

**Điều kiện hoàn thành:** placeholder và ảnh thực có nhãn đúng; không tự gán open license cho ảnh chưa rõ quyền sử dụng.

### FE-16-06 — P2: Guest / Member / VIP vẫn chưa dễ so sánh

VIP hiện nêu giá 15 USD/12 tháng, gia hạn chủ động, không tự trừ tiền và donate không tự cấp VIP — các điểm này rõ hơn trước. Tuy nhiên chưa có bảng ngắn cho người dùng hiểu tài khoản miễn phí khác VIP ở đâu.

Phần mô tả như `advanced geodetic surveys`, `geological formations`, `accredited guides` mang tính chuyên ngành và hàm ý một bộ dịch vụ/dữ liệu mạnh hơn thứ đang nhìn thấy trong danh mục nhiều điểm chưa có bài.

**Cách sửa:** diễn đạt quyền lợi theo tính năng thực sự được cung cấp; thêm so sánh Guest / Member / VIP Member, nêu rõ đọc công khai, dùng Gần tôi, viết bài và quyền truy cập nội dung dành riêng cho VIP. Quyền VIP gắn tài khoản; không thay thành uy tín hoặc quyền kiểm định. Nên có đường xem ví dụ nội dung VIP với phần giới thiệu công khai nếu đã có.

### FE-16-07 — P2: Facebook login chưa xuất hiện

Trang `/en/login/` hiện có Google và Apple; chưa thấy Facebook như yêu cầu trước đó. Chưa thử OAuth hoặc xác nhận hai provider hiện có hoạt động thật.

**Cách sửa:** triển khai Facebook nếu đã có cấu hình provider, redirect và domain hợp lệ; chỉ công bố nút hoạt động thật. Tất cả provider dùng cùng quy tắc nhận diện userId đã chốt. Tách hạng mục provider khỏi việc dịch nhãn Apple đang còn tiếng Việt.

### FE-16-08 — P2: Cần xác nhận nốt Gần tôi và iPad trên thiết bị thật

Trong môi trường duyệt kiểm tra, nhánh định vị trả `Location access was denied`. UI có Try again/Select a region tương ứng nhưng nhãn Try again vẫn là tiếng Việt. Đây là xác nhận nhánh lỗi, không phải bằng chứng rằng định vị trên máy của Bin bị lỗi.

Chưa xác nhận trên bản deploy: origin thành công, độ chính xác thiết bị, bán kính, sort gần nhất, cập nhật/xóa vị trí và hồi đáp muộn. Chưa có bằng chứng iPad đã hết lỗi bố cục.

**Bài kiểm ngắn tiếp theo:** trên iPad Safari, mở Explore, dùng vị trí và cho phép; kiểm điểm quanh vị trí thật, đổi bán kính, xem Map/List, xoay ngang/dọc, xóa vị trí. Lặp một lần với quyền bị từ chối. Không ghi tọa độ cá nhân vào báo cáo chia sẻ.

### FE-16-09 — P2: Seed đủ quy mô nhưng chưa đủ chiều sâu nội dung

97 điểm mới phần lớn dùng cùng cấu trúc mô tả và chưa có bài. Điều này đáp ứng nhu cầu đánh giá phân trang/bộ lọc/mật độ bản đồ, nhưng chưa đủ để đánh giá toàn bộ trải nghiệm đọc và đóng góp.

**Đề xuất:** ở vòng nội dung tiếp theo, chọn một nhóm nhỏ điểm ưu tiên để bổ sung thông tin có nguồn: mô tả khác nhau, ảnh đúng khu vực, bài public, bài dành riêng cho VIP nếu có, thông tin cập nhật và trạng thái chưa kiểm tra/đã kiểm tra/hết hạn đúng dữ liệu thực. Giữ các kịch bản kỹ thuật tổng hợp trong kiểm tra nội bộ; không tạo chứng nhận giả trên trang công khai.

### FE-16-10 — P2: Chỉnh ngôn ngữ sản phẩm và tính nhất quán nhận diện

- Home đang dùng biểu tượng nhỏ kèm chữ Ventlore, trong khi trang trong dùng ảnh wordmark trên nền ngà. Nên đồng bộ logo theo Brand Guide; vẫn giữ hero và hai CTA gọn như hiện tại.
- `Contribute` và `Donate to Fund` đã phân biệt hơn. Có thể rõ hơn nữa bằng `Share local knowledge` cho chia sẻ thông tin và `Support the fund` cho tài chính.
- Những từ `route`, mã `OWNER_FUNDING`, `VIP_REVENUE`, “1.500 USD cents” là cách diễn đạt nội bộ. Dùng nhãn sản phẩm như `Founder funding`, `VIP membership revenue`, `$15 / year`; ID cần tra cứu có thể để phần chi tiết.
- Copy nguồn thông tin/kiểm định nên đúng mức bằng chứng hiện có, tránh khiến người mới nghĩ toàn bộ 100 địa điểm đã được kiểm định độc lập.
- Tiêu đề tab tiếng Anh cần bản dịch và phân biệt trang, ví dụ `Explore destinations | Ventlore`.

## 4. Thứ tự thực hiện đề xuất cho vòng tiếp theo

1. Sửa FE-16-02 để đóng góp luôn gắn đúng điểm; xử lý returnTo và nháp khác ngữ cảnh.
2. Sửa FE-16-01 xuyên suốt toàn bộ luồng tiếng Anh, đồng thời sửa nhãn ảnh FE-16-05.
3. Rà nguồn và trạng thái công bố của quỹ/chứng nhận theo FE-16-03.
4. Hoàn thiện mật độ ghim và danh sách bên cạnh bản đồ theo FE-16-04.
5. Làm rõ Guest/Member/VIP, đối chiếu Facebook login, sau đó kiểm định vị và iPad thật.

Giữ nguyên những phần đã đạt: 100 canonical placeId, quota tỉnh/thành, tìm kiếm alias, phân trang, bài/quan hệ cũ, bố cục Home và quyền người dùng đã chốt. Bin tiếp tục đánh giá sản phẩm theo từng vòng. Báo cáo này không thêm yêu cầu xin duyệt từng thay đổi nhỏ.

## 5. Lệnh ngắn giao Antigravity

```text
Đọc Ventlore_FE_Review_v1_6_EN.md và đối chiếu bản FE hiện tại.
Ưu tiên sửa luồng CTA chi tiết điểm đến → viết bài, giữ đúng placeId
qua login/returnTo và không gắn nhầm bài với điểm đầu danh sách.

Hoàn thiện i18n trên các trang/modal/lỗi/dữ liệu seed/accessible label;
xử lý nhãn placeholder, cụm ghim Map và khả năng xem các kết quả bên cạnh.
Rà nguồn dữ liệu quỹ/SBT; chưa có nguồn thì dùng trạng thái sản phẩm rõ,
không tự công bố giao dịch/chứng nhận thành công từ fixture.

Giữ đủ 100 điểm, tối thiểu 2 mỗi tỉnh/thành, các canonical ID và quan hệ cũ.
Giữ giao diện sản phẩm chính thức, không dựng toolbar nghiệm thu công khai.
Chạy kiểm các luồng bị tác động và ghi rõ điều gì chưa kiểm trên thiết bị thật.
Không tự mở rộng sang BE/Chain hoặc thay toàn bộ kiến trúc FE để sửa lượt này.
Bin sẽ kiểm bản chạy và đánh giá vòng tiếp theo.
```

## 6. Giới hạn của kết luận

Không gọi toàn site đã hoàn thiện vì đã có 100 điểm. Không suy rằng định vị thành công từ việc nhánh từ chối hoạt động. Không kết luận nguồn tiền/chứng nhận là giả khi chưa xem nguồn; yêu cầu chứng cứ công bố rõ. Không kết luận OAuth/iPad/hiệu năng đạt vì desktop hiển thị được.

Các đường dẫn và bước tái hiện ở trên là bằng chứng UI tại thời điểm quan sát. Agent triển khai cần đọc component và adapter thật trước khi xác định nguyên nhân code.
