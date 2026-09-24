# Ventlore — Review deploy-preview-8
Ngày kiểm tra: 24/09/2026  
Bản được kiểm tra: https://deploy-preview-8--ventlore.netlify.app/vi/

## Kết luận
Home đã có hình ảnh và tiêu đề theo hướng được yêu cầu, nhưng trải nghiệm vào trang chưa hoàn chỉnh: thiếu nhận diện/logo, thiếu bộ chọn ngôn ngữ, còn nhiều nội dung bên dưới và có tràn ngang. Bản dịch Home thực tế đã tồn tại ở đủ sáu ngôn ngữ. Vì vậy cần sửa khả năng chuyển ngữ và bố cục, không kết luận toàn bộ Home chỉ có dữ liệu tiếng Việt.

Các mục dài bên dưới Home từng nằm trong prompt trước. Yêu cầu mới của Bin thay đổi cấu trúc này: chỉ giữ ảnh mở đầu, chữ và thao tác cần thiết trên ảnh; chuyển nội dung giải thích ra khỏi Home.

## Phạm vi đã kiểm tra
- Home: Việt, Anh, Nhật, Trung giản thể, Hàn, Pháp; kiểm tra nội dung hiển thị và đường dẫn CTA.
- Hồ sơ An: chuyển qua đủ sáu ngôn ngữ; tải lại bản Việt.
- Hồ sơ Bin và Minh: bản Anh, gồm bio, nhãn giao diện và thẻ bài viết; hồ sơ Hoàng: bản Pháp, gồm chứng nhận và thẻ bài viết.
- Explore: Việt/Anh/Pháp, tìm kiếm + bộ lọc qua chuyển ngữ và tải lại; điều hướng Home; các đường dẫn CTA hiển thị.
- Điểm đến Tây Côn Lĩnh: mở từ thẻ trên Explore tiếng Anh.
- Bài PST-000002 chưa kiểm định và PST-000003 hết hạn kiểm định: nội dung, nhãn và thông điệp trạng thái.
- Xem trực tiếp giao diện desktop ở viewport 1363 × 936. Chưa kiểm thử viewport điện thoại, backend, thanh toán, nội dung VIP sau mở khóa hoặc mọi tổ hợp trang × ngôn ngữ.

Đây là quan sát trên preview 8, không suy diễn rằng mọi lỗi ở các bản trước vẫn còn.

## 1. Các vấn đề cần sửa trước

| Ưu tiên | Phát hiện | Bằng chứng và ảnh hưởng | Hướng sửa |
|---|---|---|---|
| P1 | Home còn quá nhiều phần dưới ảnh | Trang Việt cao khoảng 3743px ở viewport cao 936px. Có Vì sao tồn tại, Tầm nhìn & Sứ mệnh, Cách hoạt động, Điểm đến, Đóng góp, Minh bạch và CTA cuối. | Xóa các section này khỏi Home theo yêu cầu mới. Giữ thông điệp sứ mệnh ngắn ngay trên ảnh. |
| P1 | Home thiếu bộ chuyển ngữ và logo | Không có header/logo hoặc nút chọn ngôn ngữ trên các bản Home đã mở. Người vào /vi/ không có thao tác đổi ngôn ngữ ngay tại đây. | Đặt logo góc trên trái và bộ chọn sáu ngôn ngữ góc trên phải, trên ảnh. Dùng chung cơ chế locale với các trang trong. |
| P1 | Home và logo dẫn sai trang | Trong Explore, logo Ventlore và Home/Trang chủ đều trỏ /[locale]/explore/. Bấm Home thực tế vẫn ở Explore. Footer lặp lại đường dẫn này. | Logo và Home về /[locale]/; Explore về /[locale]/explore/. Trạng thái menu đang chọn phải phân biệt hai trang. |
| P1 | Home bị tràn ngang | Hero rộng khoảng 1412px, bắt đầu ở x=-32 và kết thúc ở x=1380, vượt khung nội dung. Ảnh chụp có thanh cuộn ngang. | Sửa container/negative margin của hero. Không che lỗi bằng cách cắt toàn bộ nội dung bằng overflow hidden. |
| P1 | Thông điệp kiểm định hết hạn mâu thuẫn | PST-000003 hiển thị Expired Verification nhưng cũng hiển thị “This revision has not been independently verified.” | EXPIRED phải nói đã từng kiểm định nhưng hiệu lực đã hết; UNVERIFIED mới nói chưa được kiểm định. Dùng thông điệp nhất quán ở badge, banner và danh sách claims. |
| P1 | Một số nút không khớp mục đích | Latest Field Posts trỏ /en/login/. Thẻ bài ở trang Tây Côn Lĩnh dùng nhãn View Destination Details nhưng dẫn /posts/…. | Nút xem bài mới phải tới danh sách bài công khai. Thẻ bài dùng Read article hoặc View field report. |
| P1 | Nội dung dịch chưa thống nhất giữa các trang | Hồ sơ Bin tiếng Anh có tiêu đề bài đã dịch; mở PST-000002 lại thấy tiêu đề và nội dung tiếng Việt. About the Author cũng tiếng Việt dù bio trên hồ sơ đã có bản Anh. | Dùng cùng nguồn bản dịch cho bio và tiêu đề ở hồ sơ/thẻ bài/trang chi tiết. Hoàn thiện bản dịch nội dung demo theo từng revision; không sửa nội dung gốc bất biến. |

P1 ở đây là nhóm ưu tiên sửa trong lượt chỉnh tiếp theo, không phải kết luận về sự cố hệ thống sản xuất.

### Home có bản dịch nhưng thiếu cách truy cập
Các H1 đã quan sát:

| Ngôn ngữ | H1 trên Home |
|---|---|
| Việt | Khám phá điểm đến của bạn |
| Anh | Explore your destination |
| Nhật | あなたの旅先を探そう |
| Trung giản thể | 探索你的目的地 |
| Hàn | 나만의 여행지를 찾아보세요 |
| Pháp | Explorez votre destination |

Thông điệp và hai CTA của hero cũng được dịch. Tuy nhiên, ở Home tiếng Anh, các thẻ điểm đến phía dưới vẫn dùng tiêu đề, mô tả và cảnh báo tiếng Việt. Do Bin muốn bỏ phần này khỏi Home, không cần tiếp tục đầu tư bố cục ở đây; cần bảo đảm component dùng ở những trang còn lại lấy đúng nội dung theo locale.

Không tự coi mọi tên riêng còn tiếng Việt là lỗi. Tên người, handle và định danh cần được giữ nguyên.

### Chi tiết mâu thuẫn trạng thái kiểm định
Trang đã kiểm tra:
https://deploy-preview-8--ventlore.netlify.app/en/posts/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30/

Cùng một bài có:
- “Expired Verification: Verification expired on Jan 1, 2026.”
- “Community-contributed content. This revision has not been independently verified.”
- Nội dung gốc ghi hết hạn ngày 31/12/2025.

Hai thông điệp đầu mâu thuẫn về lịch sử kiểm định. Chênh lệch ngày cần đối chiếu timestamp, múi giờ và quy ước thời điểm kết thúc hiệu lực; chưa có mã nguồn nên không kết luận nguyên nhân.

Đề nghị diễn đạt cho EXPIRED: “Phiên bản này đã được kiểm định trong phạm vi được công bố, nhưng hiệu lực kiểm định đã hết. Cần kiểm tra lại trước khi dựa vào thông tin này.”

## 2. Các điểm cần hoàn thiện tiếp
1. **Số ít/số nhiều:** Explore tiếng Anh còn “1 field posts”; bản Pháp khi lọc một kết quả có “1 destinations”. Dùng plural rules theo locale.
2. **Tiêu đề tab:** các trang Anh, Pháp, Nhật đã kiểm tra vẫn dùng “Ventlore - Hiểu nơi đến. Vững bước đi.”. Cần title theo trang và ngôn ngữ.
3. **Explore còn một hero lớn:** sau khi đã có Home mở đầu, Explore nên đưa tìm kiếm và kết quả lên sớm hơn. Có thể rút phần giới thiệu về một hàng tiêu đề/mô tả ngắn. Đây là đề xuất thiết kế, không phải lỗi chức năng.
4. **Header desktop đông:** ở khung kiểm tra, VIP Plan và tên người dùng xuống dòng; Home và Explore đồng thời có nền trạng thái chọn. Sửa routing trước, rồi giảm bớt chi tiết persona/demo trong điều hướng chính nếu cần.
5. **Tiêu đề Home tiếng Việt xuống dòng chưa đẹp:** chữ “bạn” đứng riêng ở dòng thứ hai trong ảnh kiểm tra. Điều chỉnh chiều rộng khối chữ và cỡ chữ linh hoạt để chia thành hai dòng cân đối.
6. **Hero có nhiều lớp chữ:** badge Khám phá thực địa, H1, thông điệp vàng, đoạn mô tả trắng, hai CTA và chú thích hình. Với hướng Home một ảnh, nên bỏ badge và rút còn một câu phụ.
7. **Ngôn ngữ hỗ trợ tiếp cận:** accessible name của bộ chọn ngôn ngữ ở các trang trong vẫn cố định Việt/Anh. Cần bản dịch theo locale cho nhãn điều khiển.
8. **Tính rõ ràng của dữ liệu demo:** nếu giữ các nội dung giải thích ở trang riêng, phân biệt rõ chức năng được mô phỏng với chức năng thực tế. Chưa xác minh tính pháp lý của tên Foundation hoặc hoạt động đối soát thời gian thực từ giao diện.
9. **Ảnh địa điểm:** Explore đã dùng ảnh thay cho hình minh họa cũ. Cần quản lý nguồn và chú thích phù hợp; việc hiển thị “Area photo / Open license” tự nó chưa chứng minh đó là ảnh đúng địa điểm cụ thể.

### Phân biệt lỗi preview với lỗi sản phẩm
Trong lúc đầu mở trang, iframe “Netlify Drawer” từng hiển thị 502 Bad Gateway. Những lần sau iframe đã tải được. Nguồn iframe là app.netlify.com/cdp/, không phải nội dung trang Ventlore. Không dùng quan sát này để kết luận Ventlore bị lỗi máy chủ. Khi chụp ảnh nghiệm thu nên thu gọn thanh công cụ preview.

## 3. Những phần đã cải thiện, cần giữ lại

| Hạng mục | Kết quả kiểm tra |
|---|---|
| Bio An qua sáu ngôn ngữ | Đã đổi đúng ngôn ngữ; không còn chỉ hiện bio tiếng Việt với nhãn bản gốc. |
| Bin và Minh tiếng Anh | Bio, nhãn hồ sơ và tiêu đề thẻ bài đã dịch; chứng nhận của Minh cũng đã dịch. |
| Hoàng tiếng Pháp | Bio, chứng nhận và thẻ bài đã dịch. |
| Tìm kiếm + bộ lọc | “cat ba” + Kayaking giữ nguyên khi EN → FR và sau tải lại. URL vẫn chứa q và activity, kết quả vẫn là một điểm đến. |
| Điểm đến Tây Côn Lĩnh | Mở được trang chi tiết từ thẻ Explore tiếng Anh; không bị đẩy về Explore trong lần kiểm tra này. |
| Bài chưa kiểm định PST-000002 | Hiển thị đúng “This revision has not been independently verified”; không còn tuyên bố đã được kiểm định như bản cũ. |
| Bản dịch hero Home | Có đủ sáu ngôn ngữ, gồm thông điệp và CTA. |

Việc bài viết thật của người dùng chưa có bản dịch có thể được xử lý bằng nhãn ngôn ngữ gốc rõ ràng. Hiện trang bài đã có nhãn “Original content in Vietnamese”, là hành vi minh bạch. Tuy nhiên, bộ dữ liệu demo và nội dung hệ thống vẫn nên được dịch hoàn chỉnh để nghiệm thu sản phẩm đa ngôn ngữ.

## 4. Bố cục Home đề nghị chốt
Chỉ một vùng ảnh phủ màn hình, với các thành phần sau:

- Góc trên trái: logo Ventlore.
- Góc trên phải: bộ chọn ngôn ngữ hiện tại, mở được sáu lựa chọn.
- Trung tâm: H1 đã bản địa hóa. Bản Anh dùng đúng “Explore your destination”; bản Việt “Khám phá điểm đến của bạn”.
- Ngay dưới: một câu sứ mệnh ngắn, ví dụ “Đóng góp của bạn có thể giúp giảm rủi ro trong những chuyến khám phá ngoài trời.”
- CTA chính: “Bắt đầu khám phá”, dẫn đến Explore đúng locale.
- CTA phụ: “Tôi muốn đóng góp”, mở lựa chọn đóng góp hoặc một luồng có thật, đúng locale.
- Chú thích ảnh minh họa nhỏ, không cạnh tranh với tiêu đề; giữ khả năng phân biệt hình minh họa với ảnh tư liệu.

Bỏ toàn bộ section và footer lớn dưới hero. Nếu cần thông tin sứ mệnh chi tiết, đặt ở trang riêng hoặc hộp thông tin được mở có chủ đích.

Ảnh hiện tại đã truyền tải được người hỗ trợ nhau trong thiên nhiên. Có thể giữ ảnh, tinh chỉnh lớp phủ tối và cách crop; ưu tiên để hành động tương trợ vẫn nhìn rõ và chữ dễ đọc.

Trên desktop hướng tới một màn hình trọn vẹn. Trên điện thoại dùng chiều cao theo viewport khả dụng, cho phép cuộn khi chữ hoặc CTA không đủ chỗ; không cố khóa chiều cao rồi cắt mất nội dung.

### Không để lại anchor chết sau khi bỏ section
Hiện CTA phụ trỏ #contribute và menu Mission trỏ /[locale]/#mission. Các đích này chỉ còn hợp lệ khi section còn tồn tại.

Khi triển khai Home một ảnh:
- Thay #contribute bằng hộp chọn/luồng đóng góp thực tế.
- Bỏ hoặc chuyển Mission sang trang/hộp thông tin sứ mệnh phù hợp.
- Không giữ liên kết xuống một phần đã xóa.
- Không dùng /explore/ thay cho đích viết bài nếu nút mang nhãn gửi/viết báo cáo.

## 5. Tiêu chí nghiệm thu cho lượt sửa kế tiếp
1. Mở trực tiếp từng Home theo locale; thấy logo, ngôn ngữ hiện tại, H1, thông điệp và CTA đúng.
2. Đổi ngôn ngữ ngay tại Home; URL, nội dung và html lang cùng thay đổi.
3. Logo/Home ở Explore, hồ sơ, bài viết và footer đều về Home đúng locale.
4. Không còn section dài dưới hero, không có thanh cuộn ngang; không cắt CTA khi tăng cỡ chữ.
5. Kiểm tra desktop 1366/1440 và điện thoại 390/430; các kích thước điện thoại này là tiêu chí đề nghị, chưa được kiểm thử trong review hiện tại.
6. Kiểm tra hồ sơ An/Bin/Minh/Hoàng ở sáu ngôn ngữ; giữ nguyên tên người, handle và ID.
7. So khớp tiêu đề/bio giữa danh sách, hồ sơ và trang bài; không lấy bản dịch không đúng revision.
8. Giữ tìm kiếm/bộ lọc/chế độ xem và query đang có khi đổi locale.
9. Kiểm tra riêng UNVERIFIED, VERIFIED, EXPIRED và các trạng thái cần chỉnh sửa; mỗi trạng thái có thông điệp đúng bản chất.
10. Tất cả CTA mở đúng chức năng được ghi trên nút; không còn anchor tới section đã bỏ.
11. Chụp kết quả desktop/mobile, ghi rõ những luồng đã kiểm tra và phần chưa kiểm tra.

## Các đường dẫn dùng trong review
- Home Việt: https://deploy-preview-8--ventlore.netlify.app/vi/
- Home Anh: https://deploy-preview-8--ventlore.netlify.app/en/#mission
- Explore Anh: https://deploy-preview-8--ventlore.netlify.app/en/explore/
- An: https://deploy-preview-8--ventlore.netlify.app/en/people/an_vip_explorer/
- Bin: https://deploy-preview-8--ventlore.netlify.app/en/people/bin_traveler/
- Minh: https://deploy-preview-8--ventlore.netlify.app/en/people/minh_trailguide/
- Hoàng: https://deploy-preview-8--ventlore.netlify.app/fr/people/hoang_ranger/
- Tây Côn Lĩnh: https://deploy-preview-8--ventlore.netlify.app/en/places/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e09/
- Bài chưa kiểm định: https://deploy-preview-8--ventlore.netlify.app/en/posts/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e20/
- Bài hết hạn kiểm định: https://deploy-preview-8--ventlore.netlify.app/en/posts/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30/

