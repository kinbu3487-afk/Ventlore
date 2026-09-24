# Ventlore — Prompt vòng 3 hợp nhất: hoàn thiện UI, đa ngôn ngữ và thông tin kiểm định

Bản này gộp đủ sáu nhóm sửa UI của vòng 2 và hai nhóm sửa hồ sơ/kiểm định của vòng 3. Dùng bản hợp nhất này thay cho hai prompt riêng; không cần chạy lại Prompt 01 từ đầu.

Copy toàn bộ phần giữa “Bắt đầu prompt” và “Kết thúc prompt” vào coding agent trong repository Ventlore hiện tại.

---

## Bắt đầu prompt

Hãy sửa tiếp Ventlore trên code hiện tại theo toàn bộ phạm vi dưới đây. Đọc code, triển khai, kiểm tra và bàn giao thay đổi có thể nghiệm thu. Không chỉ trả lại kế hoạch hoặc ví dụ code.

### 0. Phạm vi, thứ tự ưu tiên và cách bắt đầu

Bản đã được review: https://venlore.netlify.app/vi/explore/

Tất cả tám nhóm sau đều nằm trong nhiệm vụ. Mức ưu tiên chỉ xác định thứ tự làm, không có nghĩa các nhóm phía sau là tùy chọn:

| Thứ tự | Nhóm việc | Kết quả chính |
|---|---|---|
| 1 — P0 | Thông tin kiểm định | Bài chưa kiểm định không còn câu khẳng định đã kiểm tra; badge, mô tả và claims cùng phản ánh đúng revision |
| 2 — P1 | Tìm kiếm và bộ lọc | Giữ trạng thái khi đổi ngôn ngữ, reload và back/forward |
| 3 — P1 | Đa ngôn ngữ dùng chung | Hoàn thiện bản dịch, dấu câu, số nhiều, ngày giờ và fallback |
| 4 — P1 | Trang cá nhân | Hoàn thiện S04, thẻ bài và tiểu sử ở sáu locale; giữ nguyên tên/handle/ID |
| 5 — P2 | Ảnh và logo | Dùng ảnh thật có ngữ cảnh cho hero/card, logo phù hợp header |
| 6 — P2 | Phần đầu trang | Đưa thông tin địa điểm lên sớm, giữ bố cục desktop/mobile dễ đọc |
| 7 — P2 | Câu chữ và VIP | Dùng ngôn ngữ gần gũi, quyền lợi đúng sản phẩm |
| 8 — P2 | Lịch sử phiên bản | Thu gọn mặc định, ưu tiên việc đọc nhưng giữ thông tin kiểm định và deep link |

Phạm vi màn hình: S01 Explore, S02 địa điểm, S03 bài viết, S04 hồ sơ, S21 VIP và các component dùng chung. Kiểm tra S05 đăng nhập/returnTo và các nơi tái sử dụng component khi có ảnh hưởng, không mở rộng sang xây mới toàn bộ màn hình vận hành.

Giữ hướng thiết kế xanh rừng–nền kem, hero hai phần, danh sách/bản đồ và cấu trúc dữ liệu hiện tại. Trước khi sửa:
- Đọc hướng dẫn repository, kiểm tra Git và bảo toàn thay đổi của người dùng; xác định router, i18n, media, dữ liệu trạng thái và test hiện có.
- Đối chiếu ID Registry 0.3, Logic-ID-DB 0.3, Event-UI-Spec 0.3, Wireframes và Brand Guide nếu có trong workspace; đặc biệt S04, C06 và quan hệ revision/decision/claim.
- Những lỗi được nêu là quan sát tại thời điểm review. Kiểm tra code/local trước khi kết luận nguyên nhân; giữ kết quả của những lỗi đã được sửa.
- Giữ các chức năng đang chạy đúng: tìm kiếm không dấu, resolve địa điểm đã gộp, cảnh báo mở rộng, map Leaflet/OpenStreetMap có ghim/popup, Markdown và giá VIP rõ ràng. Không xây lại map hay scaffold ứng dụng.
- Không sửa riêng một handle hoặc một bài bằng điều kiện hardcode. Không đổi DNS/domain trong nhiệm vụ này.
- Bản hợp nhất này là phạm vi đầy đủ của vòng hiện tại; không cần đọc lại prompt vòng 2 để biết sáu yêu cầu UI.

**Bằng chứng bổ sung từ hồ sơ và bài viết:**

**Lỗi A — Hồ sơ chưa được bản địa hóa đầy đủ:**

- Mở `/en/people/bin_traveler/`, rồi đổi sang tiếng Nhật tại `/ja/people/bin_traveler/`.
- Header, nút quay lại, ngày tháng và badge kiểm định đổi ngôn ngữ; nhiều phần trong hồ sơ vẫn là tiếng Việt.
- Các nhãn còn sót: “Tham gia”, “Mã định danh”, “Các bài viết & Đóng góp thực địa”, “Đọc bài viết”. Trạng thái tải từng hiện “Đang tải dữ liệu...” dù đang chọn English.
- Tiểu sử, tên địa điểm và tiêu đề bài trên card vẫn dùng nội dung tiếng Việt mà không giải thích tình trạng bản dịch.

**Lỗi B — Mô tả kiểm định mâu thuẫn với trạng thái:**

- Từ hồ sơ trên, mở bài tại `/en/posts/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e20/`.
- Bài `PST-000002`, phiên bản hiển thị `REV-000004`, có badge “Unverified Community Submission” và câu nói đang chờ kiểm tra độc lập.
- Ngay trong panel đó lại có câu “Independently audited by an accredited local guide within the specified scope.” Phần claims mang tiêu đề “Audited Claims (1)”. Đây là sự mâu thuẫn cần sửa theo dữ liệu trạng thái, không chỉ thay một bản dịch.
- Trang bài đã có thông báo “This content is currently available in Vietnamese”. Cách giữ bản gốc có thông báo này cần được áp dụng nhất quán cho hồ sơ và card; việc một bài chưa có bản dịch không đồng nghĩa mọi chữ trên trang phải tự động được dịch.

### 1. P0 — Thông tin kiểm định đúng trạng thái và phiên bản

Tìm nơi đang render câu mô tả kiểm định và tiêu đề claims. Xác định badge, mô tả, ngày, phạm vi và claims có đang lấy từ các nguồn trạng thái khác nhau hay có đoạn chữ luôn hiển thị hay không. Đây là giả thuyết cần kiểm chứng bằng code.

Cho các phần này sử dụng cùng trạng thái hiệu lực của revision đang xem theo logic hiện có. Phân biệt kết quả decision như `APPROVED` với trạng thái hiển thị hiện tại sau khi xét phạm vi, hạn, hold và các điều kiện của hệ thống. Không thêm enum backend hoặc thay state machine chỉ để đổi nhãn.

Các trạng thái dưới đây lấy theo đặc tả UI; ánh xạ với tên thực tế trong repository:

| Trạng thái hiển thị | Nội dung cần truyền đạt |
|---|---|
| UNVERIFIED | Đóng góp cộng đồng, chưa được kiểm tra độc lập; không có câu khẳng định đã kiểm định |
| IN_REVIEW | Đang được kiểm tra; chưa có kết luận hoàn tất |
| VERIFIED | Đã kiểm tra đúng revision và phạm vi được ghi nhận; hiển thị ngày/hạn khi có dữ liệu hợp lệ |
| NEEDS_CHANGES | Cần chỉnh sửa theo kết quả kiểm tra; không trình bày như đang được xác nhận đầy đủ |
| INCONCLUSIVE | Chưa đủ cơ sở kết luận |
| REJECTED | Không được chấp thuận theo quyết định; không dùng lời xác nhận tích cực |
| EXPIRED | Thông tin kiểm tra đã hết hiệu lực; có thể xem lịch sử nhưng không hiện như đang còn hiệu lực |
| SUSPENDED | Thông tin kiểm định đang bị tạm ngưng theo trạng thái hệ thống |

Yêu cầu cụ thể:

- Với UNVERIFIED, bỏ câu khẳng định đã được kiểm tra khỏi phần giải thích của revision đó. Ví dụ tiếng Việt: “Nội dung do cộng đồng đóng góp, chưa được kiểm tra độc lập.” Tiếng Anh: “Community-contributed content. This revision has not been independently verified.”
- Không suy ra đã kiểm định từ việc có claims, tác giả là chuyên gia, tác giả có SBT, bài được xuất bản hoặc người đọc là VIP.
- Chỉ mô tả “đã kiểm tra” đối với revision/phạm vi thực sự có căn cứ. Không suy ra chứng chỉ hành nghề hoặc tư cách “accredited/certified guide” nếu dữ liệu không xác nhận điều đó.
- Không hiển thị ngày, phạm vi hoặc ghi chú kiểm định của revision khác. Bản mới chưa kiểm tra không kế thừa badge hay mô tả của bản cũ đã kiểm tra.
- Nếu trạng thái chưa tải xong/thiếu/không nhận diện được, không mặc định VERIFIED. Dùng loading hoặc câu trung tính phù hợp và ghi lỗi chẩn đoán trong môi trường phát triển.
- Thông báo chung như “Ventlore không bảo đảm an toàn tuyệt đối cho hành trình” có thể dùng ở mọi trạng thái; câu này phải tách khỏi khẳng định rằng revision đã qua kiểm tra.
- Nội dung bản dịch phải giữ cùng mức độ khẳng định ở cả sáu ngôn ngữ; không dịch “chưa kiểm tra” thành “đã xác minh”.

**Đối với claims:** dùng tiêu đề trung tính như “Các thông tin trong bài” / “Statements in this post” nếu liệt kê toàn bộ nhận định của người đóng góp. Chỉ dùng tiêu đề mang nghĩa “đã kiểm tra” cho tập claim thuộc phạm vi và kết quả thực sự tương ứng. Nếu chỉ một phần được kiểm tra, phân biệt phần đó với phần còn lại; không lấy một decision cho cả revision để khẳng định tất cả claims đã được xác nhận.

Sửa cách trình bày và lựa chọn dữ liệu; không đổi trạng thái gốc thành VERIFIED, không tạo decision giả và không sửa lịch sử chỉ để làm giao diện nhất quán.

### 2. P1 — Giữ tìm kiếm và bộ lọc khi đổi ngôn ngữ

**Lỗi đã tái hiện:** vào `/vi/explore/`, nhập `cat ba` → một kết quả Cát Bà; đổi sang English → từ khóa biến mất, danh sách trở lại ba kết quả.

Yêu cầu:

- Tìm nguyên nhân state bị mất khi điều hướng locale. Sửa theo router và cơ chế state hiện có, tránh thêm một hệ điều hướng/i18n song song.
- Giữ từ khóa, khu vực, loại hoạt động, chế độ danh sách/bản đồ và các lựa chọn đang áp dụng khi đổi locale.
- Ưu tiên biểu diễn các trạng thái tìm kiếm có thể chia sẻ bằng URL query phù hợp. Nếu repo đã có tên/thứ tự xử lý query, giữ tương thích; nếu bổ sung, ghi lại quy ước và xử lý giá trị không hợp lệ.
- Bộ lọc dùng ID/code ổn định; chỉ label thay đổi theo ngôn ngữ. Không biến tên vùng hoặc hoạt động đã dịch thành định danh.
- Đồng bộ URL và UI có một nguồn trạng thái rõ ràng; không để debounce cũ ghi đè truy vấn sau khi đổi locale hoặc back/forward. Tránh tạo một history entry cho từng ký tự gõ.
- Reload và mở một link tìm kiếm trực tiếp phải khôi phục đúng các bộ lọc trên link. “Xóa bộ lọc” xóa đồng bộ UI và query của bộ lọc, không xóa các tham số không thuộc tác vụ đó.
- Giữ `placeId`, `postId`, `revisionId` khi đổi locale ở trang chi tiết; giữ `returnTo` hợp lệ trong luồng đăng nhập hiện có. Không đưa vị trí chính xác của người dùng vào URL để lưu trạng thái “Gần tôi”.

**Nghiệm thu:** tìm `cat ba` ở Việt → đổi Anh → đổi Nhật vẫn giữ từ khóa và hồ sơ Cát Bà; số kết quả chỉ thay đổi nếu dữ liệu lọc thay đổi. Thử thêm bộ lọc vùng + hoạt động + chế độ bản đồ; reload, back/forward và reset đều nhất quán.

### 3. P1 — Hoàn thiện đa ngôn ngữ dùng chung

Giữ sáu locale hiện có: `vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`. Menu hiển thị tên bản ngữ tương ứng. Không đổi mã locale làm hỏng đường dẫn cũ.

Các điểm cần xử lý đã quan sát:

- Tiêu đề các bài trong trang địa điểm vẫn là tiếng Việt dù trang đang ở tiếng Anh.
- Tiêu đề trong lịch sử phiên bản, mô tả nguồn và tiểu sử tác giả vẫn là tiếng Việt trên bản Anh/Pháp/Nhật.
- Breadcrumb của bài không dùng bản địa hóa nhất quán với tiêu đề địa điểm đã dịch.
- Bộ lọc hoạt động tiếng Việt vẫn hiện “Mountaineering”, “Forest Exploration”.
- Giá trị vai trò demo “Khách (Guest)” chưa đổi theo locale; tên truy cập của bộ chọn ngôn ngữ và một số nút phụ còn hardcode.
- Dấu hai chấm bị lặp: `Vai trò::`, `Verification Scope::`, `Auditor Notes::`, `Author::`.
- Số ít tiếng Anh sai: “1 field posts”. Trong bài còn cách viết giờ “16:00 PM”.

Sửa bằng cơ chế dịch dùng chung và dữ liệu nội dung phù hợp, không thay chuỗi bằng DOM/CSS, không hardcode riêng từng trang.

Yêu cầu chi tiết:

- Cùng một nội dung/revision phải dùng cùng cách lấy bản dịch ở card, danh sách bài, breadcrumb, trang đọc và lịch sử. Không lấy bản dịch của revision mới nhất để gắn vào một revision cũ khác nội dung.
- Hoàn thiện bản dịch dữ liệu demo đang hiển thị ở các màn hình trọng tâm, gồm mô tả tác giả và các tiêu đề phiên bản. Tên người, handle, ID và tên nguồn chính thức không cần bị dịch máy chỉ để loại mọi chữ Việt; có thể giữ tên gốc kèm mô tả đã dịch.
- Với nội dung cộng đồng chưa có bản dịch: giữ bản gốc và hiển thị thông báo rõ bằng ngôn ngữ đang chọn. Không để fallback ngầm khiến người dùng nghĩ ứng dụng bị lỗi; không bỏ cảnh báo vì chưa dịch.
- Mọi label, tooltip, accessible name, trạng thái rỗng/lỗi và nút nhỏ phải theo locale. Không tự dịch tên người dùng do họ đặt.
- Chọn một nơi chịu trách nhiệm dấu câu: message hoặc component. Sửa lỗi dấu `::` tại nguồn; không dùng thao tác xóa dấu hai chấm toàn cục gây hỏng URL/nội dung hợp lệ.
- Dùng quy tắc số nhiều của thư viện i18n cho 0/1/nhiều kết quả và bài viết. Viết giờ theo một hệ nhất quán: ví dụ `16:00` hoặc `4:00 PM`, không kết hợp hai hệ.
- Format ngày và số đúng locale nhưng giữ nguyên ý nghĩa thời gian, kỳ hạn và trạng thái nghiệp vụ.
- Giữ bản dịch tách khỏi snapshot nguồn đã đóng băng: không ghi đè `contentHash`, claims hoặc bytes của revision đã công bố chỉ để dịch. Không tự tạo nhãn “đã kiểm định bản dịch”.

**Nghiệm thu:** không còn các lỗi cụ thể trên trong màn hình đã kiểm tra; không lộ translation key; không có đoạn nội dung dài sai ngôn ngữ mà thiếu thông báo bản gốc. Tiếng Pháp xuống dòng tốt; Nhật/Trung/Hàn hiển thị đúng glyph.

### 4. P1 — Hoàn thiện trang cá nhân và bản dịch nội dung liên quan

Giữ đủ sáu locale hiện có: `vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`. Kiểm tra namespace, message loading và cách lấy locale trong trang hồ sơ/shared components. Dùng cơ chế hiện có, không dùng CSS/DOM replacement để thay chữ.

Phân biệt ba nhóm:

| Nhóm | Cách xử lý |
|---|---|
| Nhãn hệ thống | Luôn lấy từ catalog của locale đang chọn |
| Nội dung người dùng: tiểu sử, tiêu đề, mô tả | Dùng bản dịch đúng nguồn nếu có; nếu chưa có, giữ bản gốc kèm thông báo rõ |
| Tên hiển thị, handle, UUID, display code | Giữ nguyên định danh; không tự dịch hoặc đổi dữ liệu gốc |

Ví dụ `Bin Khám Phá`, `@bin_traveler`, `PST-000002`, `REV-000004` được giữ nguyên. Tuy nhiên, loại vai trò “Khách”, “Chuyên gia”, nhãn tên trường và tên nút phải được dịch. Trong bộ chọn persona, tên tài khoản và loại vai trò là hai khái niệm khác nhau.

Hoàn thiện các nhãn sau trong cả sáu catalog, cùng các nhãn liên quan tìm thấy trong code:

| Tiếng Việt | Tiếng Anh tham chiếu |
|---|---|
| Tham gia | Joined |
| Mã định danh | User ID |
| Bài viết và đóng góp ({count}) | Posts and contributions ({count}) |
| Đọc bài viết | Read article |
| Chưa có bài viết | No posts yet |
| Người dùng này chưa có đóng góp công khai. | This user has no public contributions yet. |
| Đang tải hồ sơ… | Loading profile… |
| Không tìm thấy hồ sơ | Profile not found |
| Không thể tải hồ sơ | Unable to load profile |
| Thử lại | Try again |
| Nội dung gốc bằng {language} | Original content in {language} |
| Chưa có bản dịch {language} | Translation into {language} is not available yet |

Các tên key do agent chọn theo cấu trúc repo. Gộp hoặc điều chỉnh câu cho phù hợp giao diện, tránh tạo key trùng chức năng. Dùng biến nội suy và pluralization đúng từng locale; xử lý dấu câu tại một nơi để không sinh `Role::` hoặc “Tham gia::”.

Rà soát header/profile card, danh sách bài, breadcrumb, tác giả trong trang bài, loading, empty state, error/not-found, tooltip và accessible name. Không chỉ sửa các chữ xuất hiện trong ảnh chụp.

**Cơ chế lấy bản dịch và fallback dùng chung:**

- Tận dụng resolver/helper hiện có; nếu đang lặp logic ở nhiều component thì tập trung lại ở mức cần thiết. Thẻ bài trên hồ sơ và trang đọc cùng nguồn/revision phải thống nhất tiêu đề và trạng thái bản dịch.
- Nếu tên địa điểm đã có bản dịch ở Explore, dùng đúng bản dịch đó trong hồ sơ/breadcrumb, thay vì luôn lấy trường tiếng Việt. Tên riêng có thể giữ cách viết địa phương khi phù hợp; không bắt buộc xóa mọi dấu tiếng Việt.
- Nếu tiểu sử chưa có bản dịch, hiển thị bản gốc và nhãn ngắn bằng locale người đọc, chẳng hạn “Original bio in Vietnamese”. Thẻ bài chưa có bản dịch có nhãn tương tự để người dùng biết trước khi mở.
- Giữ thông báo bản gốc đang hoạt động trên trang bài. Với dữ liệu demo đã có bản dịch, dùng bản dịch đúng. Có thể bổ sung bản dịch cho fixture tiểu sử demo, nhưng vẫn phải kiểm tra ít nhất một tình huống thiếu bản dịch.
- Tách trạng thái “bản dịch máy”, “bản dịch đã duyệt” và “bản gốc” nếu hệ thống đã hỗ trợ; không gọi bản dịch là “official/verified” khi chưa có căn cứ. Không hứa có đội ngũ đang dịch nếu đó chỉ là câu mẫu.
- Không tự bổ sung dịch vụ dịch máy trả phí hoặc gửi tiểu sử/nội dung người dùng sang API bên ngoài trong nhiệm vụ này. Việc đổi ngôn ngữ UI không có nghĩa dữ liệu nguồn bị viết lại.
- Bản dịch phải tham chiếu đúng nguồn/phiên bản; không dùng bản dịch của revision khác chỉ vì cùng postId. Không sửa bytes, `contentHash`, claim, ID hoặc snapshot bất biến để thêm locale.
- Giữ quan hệ locale–route–cache nhất quán để không hiển thị dữ liệu cũ khi chuyển ngôn ngữ nhanh. Nếu dữ liệu bản địa hóa được cache, khóa cache phải phân biệt locale và phiên bản/quyền có liên quan theo kiến trúc hiện tại.

**Điều hướng và quyền truy cập của hồ sơ/bài:**

- Đổi locale ngay tại hồ sơ phải giữ `handle`, user tương ứng và vị trí điều hướng có liên quan. Link bài, địa điểm và tác giả phải giữ locale đang chọn.
- Đổi locale ở trang bài đang chọn `revisionId` phải giữ nguyên revision đó; reload, back/forward và deep link trực tiếp đều đúng.
- Giữ `returnTo` hợp lệ qua đăng nhập và bộ lọc Explore được xử lý tại mục 2. Không trộn logic locale với logic đăng nhập hay role.
- Hồ sơ công khai vẫn chỉ chứa dữ liệu/bài được phép công khai. Không mở quyền, lộ bài private/VIP hoặc gọi API quản trị để có thêm nội dung đem dịch.
- Không đổi giá VIP, split tip/donate, entitlement, vai trò hoặc onchain trong bản sửa này. Không thay danh tính hay quan hệ các ID.

### 5. P2 — Ảnh thật có ngữ cảnh và logo phù hợp

Hiện hero và ba card đã có minh họa khác nhau, nhưng vẫn đều là tranh xanh rừng. Mục tiêu vòng này là người xem nhận ra đặc trưng cảnh quan, có cảm giác muốn khám phá địa điểm.

- Ưu tiên ảnh thật cho hero và ba địa điểm demo: khu vực Cát Bà/Lan Hạ, ghềnh đá Cô Tô và núi/rừng Tây Côn Lĩnh. Ảnh dùng trên card và trang chi tiết phải thống nhất địa điểm.
- Kiểm tra asset đã có trước. Nếu phải tìm ảnh, chọn nguồn có quyền sử dụng phù hợp và ghi tác giả, nguồn, giấy phép/điều kiện ghi công. Không chọn ảnh ngẫu nhiên từ kết quả tìm kiếm rồi gắn tên địa điểm thật.
- Ảnh minh họa khu vực phải ghi rõ phạm vi minh họa, không diễn đạt rằng ảnh chụp đúng tuyến đường hay là bằng chứng kiểm định. Không dùng ảnh AI như ảnh thực địa thật.
- Giữ các SVG hiện có làm fallback hoặc trang trí phụ. Fallback phải hoạt động khi ảnh tải lỗi, có alt text hợp lý và không làm thay đổi kích thước khung.
- Dùng asset/media pipeline hiện có, tránh phụ thuộc URL ảnh ngẫu nhiên hoặc hotlink thiếu ổn định. Khai báo kích thước/aspect ratio, ảnh responsive và lazy-load ảnh dưới màn hình đầu; không lazy-load ảnh hero nếu làm chậm nội dung chính.
- Đặt tiêu đề và CTA trên vùng đủ tương phản, không ép chữ nhỏ đè vào ảnh nhiều chi tiết.
- Chọn biến thể logo phù hợp header xanh: nền trong suốt hoặc nền đồng màu; giữ nguyên hình, tỷ lệ và font logo. Không thay toàn bộ bộ nhận diện.

**Nghiệm thu:** hero và các card có ảnh riêng phù hợp; kiểm tra ảnh ở desktop/mobile và attribution. Nếu chưa có ảnh đúng địa điểm được phép dùng, ghi rõ asset còn thiếu; không đánh dấu phần ảnh hoàn tất chỉ vì đã đổi sang SVG khác.

### 6. P2 — Thu gọn phần đầu trang và hoàn thiện responsive

Ở bản review, viewport 1363×936 chưa thấy tên hàng địa điểm đầu; trong bản tiếng Anh, tên thẻ bắt đầu khoảng y=1034px. Cần đưa thông tin địa điểm lên sớm hơn.

- Giữ hero hai phần trên desktop nhưng giảm padding, khoảng trống và chiều cao không cần thiết. Không giảm cỡ chữ chính để đạt mục tiêu.
- Giữ search nổi bật. Gom vùng lọc gọn hơn; mobile có thể dùng nút “Bộ lọc” mở panel và hiển thị số bộ lọc đang áp dụng. Luôn thấy bộ lọc nào đang có hiệu lực và cách xóa.
- Rút ngắn khoảng cách từ hero → search/filter → số kết quả → cards. Ảnh card tỷ lệ khoảng 16:9, tránh chiều cao lớn trên card hẹp.
- Căn phần cuối card nhất quán: hoạt động, số bài và CTA không chen nhau hoặc xuống dòng ngẫu nhiên. Mô tả có thể rút gọn; cảnh báo vẫn phải mở đọc đầy đủ được.
- Giữ chuyển đổi danh sách/bản đồ, ghim và popup đang hoạt động. Không thay provider hoặc xây lại map trong vòng này.
- Header không chồng nội dung khi cuộn hoặc khi mở menu; nút chọn locale và navigation không bị ép ở màn hình nhỏ.

Tiếp tục dùng palette Forest `#173F35`, Jade `#2C7563`, Sage `#DCE8DA`, Ivory `#F5F1E8`, Waypoint `#F0A44B`, Ink `#182522`. Body chính khoảng 16px/26px, card bo 16px, vùng chạm tối thiểu 44px. Ưu tiên nền sáng và màu tự nhiên từ ảnh; không thêm nhiều hiệu ứng trang trí.

**Nghiệm thu:** ở 1366×900, người dùng thấy tên và phần đầu thông tin của hàng card đầu mà chưa phải cuộn; kiểm tra lại 1440×900. Ở 360/390px không có cuộn ngang, mất nút hoặc chữ bị cắt. Không ép mobile phải hiển thị toàn bộ hero, bộ lọc và card trong một màn hình bằng cách thu nhỏ mọi thứ.

### 7. P2 — Đơn giản hóa câu chữ và điều chỉnh thông điệp VIP

Giọng điệu gần gũi, cụ thể, như người địa phương chia sẻ điều cần biết. Giữ “Hiểu nơi đến. Vững bước đi.”; không dùng thuật ngữ vận hành làm thông điệp chính.

| Chỗ hiện tại | Hướng thay thế |
|---|---|
| Chỉ mục Thực địa | Khám phá điểm đến |
| 3 địa điểm mạo hiểm được lập chỉ mục | 3 địa điểm |
| Bất biến vận hành gói Hội viên | Thông tin hội viên |
| Contributor SBT và route nhận tip minh bạch | Ghi nhận đóng góp và nhận ủng hộ từ cộng đồng |
| Author/role hoặc nhãn khác có dấu `::` | Nhãn ngắn và một dấu phân cách hợp lệ |

Không thay mọi chuỗi một cách máy móc: chọn câu theo ngữ cảnh và dịch tự nhiên sang cả sáu ngôn ngữ. Các thuật ngữ kỹ thuật vẫn có thể nằm trong phần giải thích chi tiết hoặc tác vụ thực sự cần đến chúng.

**Điều chỉnh trang VIP:**

- Trọng tâm là khám phá điểm đến mới được tuyển chọn và tiếp cận hướng dẫn địa phương chuyên sâu. Tránh biến mô tả chính thành sản phẩm khảo sát trắc địa/phân tích trầm tích nếu đó không phải quyền lợi cốt lõi đang cung cấp.
- Gợi ý heading: “Khám phá sâu hơn cùng Ventlore”. Mô tả: “Tiếp cận những điểm đến mới được tuyển chọn và hướng dẫn chuyên sâu từ tri thức địa phương.” Chỉ dùng quyền lợi tương ứng khi dữ liệu/tính năng thực sự hỗ trợ; nếu chưa có, ghi rõ tình trạng demo hoặc chưa sẵn sàng.
- Giữ giá theo cấu hình baseline 15 USD/12 tháng, gia hạn chủ động, không tự động trừ tiền. Không đổi giá, thanh toán hoặc entitlement trong nhiệm vụ UI này.
- Giải thích ngắn VIP là quyền đọc nội dung mở rộng; không tự có quyền chuyên gia hay được cấp từ donate. Không hứa toàn bộ phí hội viên đi vào một mục đích nếu chưa có căn cứ từ chính sách tài chính.
- Đồng bộ trang VIP với card/danh sách/nội dung demo: hiện vẫn có bài “Tọa độ hốc trú bão tự nhiên phía sau Vịnh Cát Cò (VIP)”. Không chỉ đổi tiêu đề quảng cáo để che việc nội dung vẫn đặt thông tin khẩn cấp sau paywall.
- Với fixture demo chưa đóng băng, sửa chủ đề và nội dung VIP thành hướng dẫn khám phá chuyên sâu thực sự tương ứng. Với dữ liệu đã công bố, giữ lịch sử và dùng luồng sửa/revision hiện có; ghi rõ nếu cần quyết định nội dung ngoài phạm vi.
- Giữ cảnh báo cần thiết public theo đặc tả. Không tự công khai tọa độ riêng, không tự khóa lại nội dung đã public và không bỏ kiểm quyền server để sửa câu chữ.

### 8. P2 — Thu gọn lịch sử phiên bản để ưu tiên nội dung bài

- Mặc định thu gọn lịch sử phiên bản, dùng nút rõ nghĩa “Xem lịch sử phiên bản (3)” thay cho nút chỉ ghi “Immutable”. Số lượng lấy từ dữ liệu, không hardcode.
- Vẫn hiển thị rõ phiên bản đang xem và tóm tắt kiểm định cần thiết: trạng thái, phạm vi, ngày kiểm tra, hạn hiệu lực. Không giấu cảnh báo quan trọng trong phần thu gọn.
- Khi mở lịch sử, người đọc vẫn chọn được từng revision và chia sẻ deep link đúng. Link trỏ revision cũ phải mở đúng nội dung, không tự chuyển sang bản mới nhất.
- Đưa mã ID đầy đủ, giải thích snapshot và thông tin onchain dài vào phần chi tiết phù hợp; giữ nút/tác vụ có ích dễ tìm.
- Bản dịch tiêu đề trong lịch sử phải khớp đúng revision. Việc thu gọn hoặc đổi ngôn ngữ không làm thay đổi nhãn kiểm định hay tip route.
- Desktop giữ cột đọc thoáng; mobile xếp theo thứ tự nội dung hợp lý, không đặt toàn bộ lịch sử trước bài. Font và khoảng cách đoạn dễ đọc, badge không tràn khung.

### 9. Các nguyên tắc phải giữ

- Bảo toàn các ID hiện có, quan hệ dữ liệu, API contract và đường dẫn. Không dùng chuỗi đã dịch làm ID.
- Không đổi logic xác minh, quyền truy cập, tỷ lệ donate/tip, vai trò, SBT/NFT hoặc onchain. Không sửa snapshot bất biến tại chỗ.
- Không tạo UI thành công giả cho tác vụ chưa có backend; không lộ nội dung private/VIP rồi chỉ che bằng CSS.
- Không thay thế source bằng ảnh screenshot. Không mở rộng thành một cuộc viết lại ứng dụng hoặc backend.
- Giữ thay đổi trên nhánh làm việc phù hợp để review. Chưa tự merge hoặc publish production.

### 10. Kiểm thử và nghiệm thu toàn bộ phạm vi

Chạy lint/typecheck/build theo scripts thực tế của repository. Thêm/cập nhật kiểm thử hồi quy có mục tiêu cho lỗi state khi đổi locale, hồ sơ, fallback và cách hiển thị kiểm định. Không chỉ kiểm tra catalog rồi kết luận UI đúng, không tạo bộ test lớn ngoài phạm vi.

| Nhóm | Tình huống và kết quả phải đạt |
|---|---|
| Tìm kiếm | `cat ba` và `Cát Bà` tìm đúng canonical, không trùng hồ sơ đã gộp |
| Bộ lọc và locale | Việt → Anh → Nhật giữ từ khóa, vùng, hoạt động, map/list; reload, back/forward và reset nhất quán |
| Bản dịch toàn trang | Kiểm tra sáu locale ở Explore, địa điểm, bài, hồ sơ và VIP; nhãn hệ thống đúng ngôn ngữ; bản gốc có thông báo khi thiếu bản dịch |
| Dấu câu/số nhiều/thời gian | Không còn dấu `::` lỗi, “1 field posts”, “16:00 PM”; không làm hỏng URL hoặc nội dung hợp lệ khi sửa |
| Hồ sơ Bin và hồ sơ khác | Giữ tên/handle/ID; thẻ bài, tiểu sử và liên kết dùng locale/fallback nhất quán, không có ngoại lệ hardcode cho Bin |
| Hồ sơ rỗng/not-found/error | Thông báo đúng locale; retry phù hợp; không hiện dữ liệu của hồ sơ trước |
| Nội dung có/không có bản dịch | Card, hồ sơ và trang đọc thống nhất theo đúng nguồn/revision; có fixture riêng kiểm tra thiếu bản dịch |
| `PST-000002` / `REV-000004` | Khi dữ liệu nguồn là UNVERIFIED, không có câu khẳng định đã kiểm tra hoặc tiêu đề gọi toàn bộ claims là đã kiểm định ở bất kỳ locale nào |
| Revision VERIFIED | Có căn cứ đúng revision, scope/ngày/hạn đúng; không bị mất thông tin kiểm định sau sửa |
| Các trạng thái C06 khác | IN_REVIEW, NEEDS_CHANGES, INCONCLUSIVE, REJECTED, EXPIRED, SUSPENDED có mô tả đúng, không rơi vào lời khẳng định VERIFIED mặc định |
| Đổi phiên bản | Bản cũ VERIFIED và bản mới UNVERIFIED giữ đúng trạng thái, nội dung và scope sau khi chọn revision/đổi locale; deep link mở đúng phiên bản |
| Phạm vi claims | Chỉ một phần được kiểm tra thì không khẳng định các claim ngoài phạm vi đã được xác nhận |
| Loading và đổi locale liên tiếp | Không chớp trạng thái VERIFIED mặc định; lựa chọn cuối cùng được phản ánh đúng, không bị dữ liệu cũ ghi đè |
| Bản đồ và cảnh báo | Ghim, popup, link chi tiết và nút đọc đầy đủ vẫn hoạt động |
| Ảnh và logo | Hero/cards có ảnh riêng phù hợp, nguồn/quyền sử dụng rõ; fallback không vỡ; logo không biến dạng |
| Màn hình đầu | 1366×900 và 1440×900 thấy tên và phần đầu thông tin hàng card đầu, không phải thu nhỏ chữ chính |
| Responsive/accessibility | 360/390/768/1440px không cuộn ngang/chồng chữ/mất nút; keyboard, focus và accessible names đúng; chữ dài Pháp và CJK hiển thị tốt |
| VIP và câu chữ | Giá/kỳ hạn theo cấu hình, quyền lợi đúng chức năng; bỏ ngôn ngữ kỹ thuật khỏi phần chính; cảnh báo cần thiết vẫn public |
| Lịch sử phiên bản | Mặc định thu gọn, mở được bằng chuột/bàn phím; số phiên bản theo dữ liệu; không giấu trạng thái hoặc cảnh báo quan trọng |

Dùng fixture/mock/test clock cho trạng thái hết hạn, tạm ngưng, hồ sơ rỗng, lỗi và thiếu bản dịch. Không tạo quyết định kiểm định thật hoặc sửa production data để chạy test. Ánh xạ trạng thái UI với enum hiện có, không tự thêm enum backend.

Các review trước mới xác nhận desktop. Lần này phải kiểm tra mobile bằng trình duyệt responsive; không tự coi mobile đã đạt.

Chụp ảnh sau sửa cho:
- Explore desktop/mobile, thể hiện ảnh thật và phần đầu trang đã thu gọn.
- Hồ sơ ở English và Japanese, gồm cách xử lý bản gốc.
- Bài chưa kiểm định, và lịch sử phiên bản ở trạng thái thu gọn/mở.
- VIP sau chỉnh câu chữ.
- Ít nhất một bố cục có chữ dài tiếng Pháp hoặc CJK.

Không báo PASS cho kiểm tra chưa chạy. Nếu thiếu quyền truy cập browser, ảnh đúng địa điểm được phép dùng hoặc dữ liệu cần thiết, nêu chính xác phần bị chặn và tiếp tục các phần độc lập. Ảnh còn thiếu là việc chưa hoàn tất, không đánh dấu đạt chỉ vì đã thay SVG.

### 11. Cách thực hiện và bàn giao

Thực hiện theo thứ tự: tái hiện và đọc code → sửa thông tin kiểm định → sửa state/locale và hồ sơ → ảnh/layout/câu chữ/VIP/lịch sử → kiểm tra toàn bộ các phần bị ảnh hưởng. Tự quyết chi tiết triển khai thông thường; không dừng để hỏi từng component. Không chạy vòng lặp vô hạn.

Bàn giao ngắn bằng tiếng Việt:
1. Bảng tám nhóm việc ở mục 0: đã sửa / đã đúng từ trước / còn bị chặn, kèm bằng chứng tương ứng. Không đóng nhiệm vụ chỉ sau khi xong hai lỗi mới.
2. Nguyên nhân thực tế của lỗi mất state, nhãn hồ sơ chưa dịch và mô tả kiểm định mâu thuẫn.
3. Component/helper/catalog chính thay đổi, dependency mới nếu có.
4. Lệnh kiểm tra đã chạy và kết quả; ma trận locale/trạng thái/viewport thực sự đã kiểm chứng.
5. Ảnh trước/sau nếu có, ảnh sau sửa và route local để nghiệm thu.
6. Nguồn/điều kiện sử dụng ảnh; nội dung còn thiếu bản dịch và cách fallback; các giới hạn còn lại.
7. Các bước push nhánh và mở deploy preview theo cấu hình repo; chưa tự merge hoặc publish production.

Hãy bắt đầu triển khai ngay trên code hiện tại và hoàn thành toàn bộ phạm vi đã nêu.

## Kết thúc prompt

