# Ventlore FE v1.4 — Giao diện chính thức, đánh giá theo từng vòng của Bin

Ngày: 26/09/2026, giờ Việt Nam.  
Website đã rà trực tiếp: https://ventlore.com/vi/  
Yêu cầu mới: toàn bộ giao diện hướng tới người dùng phải được trình bày như sản phẩm chính thức. Bỏ các nhãn thử nghiệm, lời nhắc triển khai, bộ chọn persona và công cụ nghiệm thu khỏi website. Bin trực tiếp đánh giá sản phẩm qua từng vòng.

Đây là hướng dẫn tiếp nối cho Antigravity sửa repository FE. Việc tạo tài liệu này chưa thay đổi code hoặc bản deploy.

## A. Quyết định mới của chủ dự án

Yêu cầu này được ưu tiên hơn những đoạn trong v1.1–v1.3 từng yêu cầu giữ banner DEMO, hiển thị nhãn demo trên sản phẩm, cung cấp persona mẫu hoặc để Review Toolbar cho Bin bấm nghiệm thu.

Áp dụng ngay:

1. Ventlore có một giao diện sản phẩm chính thức, dùng ngôn ngữ tự nhiên theo tác vụ.
2. Không hiển thị “DEMO”, “thử nghiệm”, “mô phỏng”, “bản thử”, “review scenarios”, “Bin Review”, lời nhắc nối BE/Chain hoặc giải thích implementation trong luồng người dùng.
3. Không thêm một badge “bản chính thức” thay cho badge DEMO; bỏ hẳn dải thông báo môi trường nếu không có nội dung cần thiết cho người dùng.
4. Bin đánh giá qua từng vòng sử dụng thực tế. Báo cáo thay đổi gửi riêng trong chat/tài liệu, không gắn bộ nghiệm thu lên website.
5. Các yêu cầu của v1.3 vẫn giữ: rõ Guest/Member/VIP, khoảng 100 địa điểm, Gần tôi dùng vị trí thiết bị, nhãn điều hướng rõ, Facebook và bố cục iPad.
6. Dữ liệu thật có thể lưu tĩnh tại FE. Lưu tĩnh không có nghĩa là thử nghiệm và không cần gắn nhãn demo.
7. Dữ liệu/hiệu ứng giả lập không được trở thành giao dịch, chứng nhận hoặc tài khoản thật bằng cách bỏ chữ “demo”. Đưa chúng về môi trường phát triển; bản công khai dùng nguồn thật hoặc trạng thái sản phẩm phù hợp.

Không thêm quy trình xin duyệt từng chỉnh sửa nhỏ. Agent thực hiện thay đổi, tự kiểm kỹ thuật tối thiểu rồi bàn giao để Bin dùng và phản hồi. Không tự kết luận thay Bin rằng sản phẩm đã được nghiệm thu toàn bộ.

## B. Lệnh khởi động — dán vào Antigravity

```text
Đọc và thực hiện Ventlore_FE_Official_Interface_v1_4.md.
Đây là đính chính mới nhất về cách trình bày sản phẩm, ưu tiên hơn các
yêu cầu giữ nhãn demo hoặc Review Toolbar công khai trong v1.1–v1.3.

Rà toàn bộ route/page/layout/modal/form/toast và sáu locale của Ventlore.
Gỡ banner DEMO, Review Toolbar, persona selector, scenario controls,
copy mô phỏng/thử nghiệm và lời nhắc dành cho lập trình viên khỏi bản công khai.
Viết lại các nhãn theo ngôn ngữ sản phẩm chính thức.

Giữ đủ 6 yêu cầu v1.3 và các phần v1.2 đã đạt. Dữ liệu địa điểm thật
có thể ở FE tĩnh; fixtures giả chỉ phục vụ phát triển nội bộ.
Không đổi dữ liệu tài chính/chứng nhận giả thành thật chỉ bằng đổi chữ.
Nút chưa có dịch vụ thật phải có trạng thái khả dụng trung thực và gọn,
không làm người dùng đi hết luồng rồi nhận kết quả thành công giả.

Sửa trực tiếp trong repo hiện tại, chạy ứng dụng và kiểm các màn hình
bị tác động. Không dừng ở kế hoạch hoặc xin tôi xác nhận từng bước.
Không tự làm thêm BE/Chain mới để hoàn thành phần copy/giao diện.

Tôi sẽ đánh giá sản phẩm qua từng vòng. Bàn giao URL bản đã chạy,
danh sách thay đổi ngắn và những tính năng còn chưa khả dụng.
Không đưa checklist hay bộ công cụ nghiệm thu lên website.
Không tự push/merge/deploy production nếu chưa có chỉ dẫn phát hành riêng.
```

## C. Phạm vi đã rà trực tiếp trên website

Đã mở 19 URL tiếng Việt dưới đây, hai tab Contribute, các tab Account và các hộp tương tác liên quan. Nội dung quan sát thuộc bản đang phục vụ tại thời điểm kiểm tra, không phải kết luận từ source code.

| Nhóm | URL/phạm vi đã xem | Nội dung cần xử lý |
| --- | --- | --- |
| Home | `/vi/`; hộp “Tôi muốn đóng góp” | Review Toolbar; nút “Ủng Hộ Quỹ Ngay (Demo)” |
| Explore | `/vi/explore/` | Banner DEMO, toolbar, link Data Map/Tải .md; copy “route nhận tip” |
| VIP | `/vi/vip/`; hộp đăng ký | Banner/toolbar chung; hộp thanh toán mô phỏng |
| Minh bạch | `/vi/transparency/` | “DEMO STREAM”, “Nhật ký Giao dịch Thanh toán Mô phỏng”, mô tả PaymentModal, receipt `0xmock...` |
| Đăng nhập | `/vi/login/` | Chọn vai trò thử nghiệm; tài khoản mẫu; “Chưa kết nối Auth Server BE”; Return URL và giải thích chống redirect |
| Chia sẻ | `/vi/contribute/`; hai tab | “DEMO UPLOAD”, mô tả adapter, nút mô phỏng lỗi 409, nút gửi có “(Demo)” |
| Tài khoản | `/vi/account/`; hồ sơ, sửa hồ sơ, đóng góp, VIP, quyền lợi | “Lưu thay đổi (Demo)”, “Canonical User”, UUIDv7, “Bất biến kiến trúc”, `ISSUED_DEMO`, thông báo nhận SBT/NFT mẫu |
| Chuyên gia | `/vi/expert/`; màn hạn chế quyền hiện có | Nút “Trải nghiệm vai trò Chuyên gia (Hoàng Kiểm Lâm)” |
| Quản trị | `/vi/admin/`; màn hạn chế quyền hiện có | Nút “Trải nghiệm vai trò Quản trị viên (Linh Admin)” |
| Data Map | `/vi/data-map/` | Tài liệu triển khai/đánh giá đang nằm trong điều hướng công khai |
| Ba địa điểm | Ba route `/vi/places/…/` ở danh sách dưới | Banner/toolbar/footer chung; giữ cảnh báo, nguồn và trạng thái kiểm định có ý nghĩa |
| Bốn bài viết | Bốn route `/vi/posts/…/` ở danh sách dưới | Banner/toolbar; “Route ủng hộ”; khối thông tin kỹ thuật; bài VIP có nút chuyển vai trò |
| Hai hồ sơ công khai | `/vi/people/minh_trailguide/`, `/vi/people/bin_traveler/` | Banner/toolbar; mã nội bộ; chứng nhận mẫu cần đối chiếu nguồn trước khi xuất bản chính thức |

Các route địa điểm đã xem:

```text
/vi/places/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e02/
/vi/places/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e08/
/vi/places/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e09/
```

Các route bài viết đã xem:

```text
/vi/posts/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10/
/vi/posts/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e40/
/vi/posts/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e20/
/vi/posts/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30/
```

Các hộp đã xem: chọn hình thức đóng góp, Sứ mệnh, ủng hộ quỹ, tip tác giả, mua VIP, báo sai và sửa hồ sơ. Modal Sứ mệnh còn hiện chữ “Mission Close”, “Mission Explore Cta”; sửa thành nhãn đã dịch như “Đóng”, “Khám phá điểm đến”.

Giới hạn: chưa rà từng route của cả sáu locale, chưa kiểm mọi trạng thái sau submit, không gửi bài/thanh toán trong lượt này, không kiểm toàn bộ workspace có quyền Experts/Admin và không chạy trên iPad thật. Agent cần lấy route inventory từ repo để bao phủ cả những trang không có link trên giao diện. Không coi danh sách URL trên là toàn bộ route của repository.

## D. Gỡ những thành phần dành cho phát triển khỏi bản công khai

### 1. Thành phần dùng chung

- Gỡ banner môi trường trên AppShell và khoảng trống/padding/sticky offset tương ứng; kiểm header sau khi chiều cao thay đổi.
- Gỡ Review Toolbar, “14 Scenarios”, bộ chọn Guest/author/VIP/Expert/Admin và các shortcut nghiệm thu ở tất cả route, kể cả Home, error page và modal.
- Gỡ các nút tạo tình huống giả: mô phỏng lỗi, reset dữ liệu, tự đổi role, tự cấp VIP, thử giao dịch, thử nhận chứng nhận.
- Gỡ Data Map, “Tải .md”, đường dẫn tài liệu implementation khỏi header/footer/user menu của sản phẩm. Giữ tài liệu trong repo; không cần dựng thêm một trang review riêng trên domain công khai.
- Nếu các file nội bộ đang được copy vào `public/` hoặc route xuất tĩnh, bỏ chúng khỏi bản build công khai. Ẩn link đơn thuần không giải quyết việc file vẫn được phát hành ngoài ý muốn.
- Công cụ phát triển nếu còn cần chỉ dùng local/build nội bộ; bản công khai không bật lại được bằng query, localStorage hoặc một lựa chọn persona.
- Không dùng CSS `display:none` như biện pháp duy nhất để giữ các thao tác đổi quyền trong public UI. Tách khỏi entry point/build công khai và adapter thực thi tương ứng.

### 2. Đăng nhập và quyền

- Trang login chỉ còn các phương thức thực sự khả dụng, lời giải thích ngắn và “Tiếp tục khám phá”.
- Bỏ danh sách tài khoản mẫu và nút “Đăng nhập với vai trò đã chọn”; bỏ câu “Hoặc trải nghiệm vai trò thử nghiệm”.
- Bỏ nút “Chuyển sang vai trò VIP để trải nghiệm” trong bài VIP; giữ CTA đăng ký/đăng nhập hợp lệ.
- Bỏ nút tự chuyển thành Chuyên gia/Admin trên trang hạn chế quyền. Giữ màn phù hợp: đăng nhập hoặc thông báo tài khoản chưa có quyền; không cần nhắc demo.
- Public auth adapter không được tự đăng nhập Minh/Bin/Linh từ fixture khi thiếu dịch vụ, khi OAuth lỗi hoặc khi khôi phục persona cũ.
- Không tin role/VIP từ demo storage. Xử lý riêng key/cơ chế cũ nếu cần; không xóa hàng loạt localStorage hoặc làm mất nháp người dùng để “dọn demo”.
- Tên nghề nghiệp là bio; giữ mô hình Guest/Member/VIP_member và Experts/Admin đã chốt. Không để nhãn AUTHOR trong login trở thành quyền hệ thống.

### 3. Copy ở form, hồ sơ và bài viết

| Đang hiển thị | Bản sản phẩm cần dùng | Điều kiện hành vi |
| --- | --- | --- |
| Gửi bài viết (Demo) | Gửi bài viết | Chỉ báo đã gửi khi có nơi tiếp nhận/lưu phù hợp; nếu chỉ giữ cục bộ, gọi đúng là “Lưu nháp trên thiết bị” |
| Gửi đề xuất điểm mới (Demo) | Gửi đề xuất | Có kết quả nhận hồ sơ thật hoặc thông báo chưa thể gửi |
| Tệp hình ảnh đối chứng (DEMO UPLOAD) | Ảnh và tài liệu | Hiển thị rõ tệp đã được chọn, đang tải, tải xong hoặc lỗi theo chức năng thực tế |
| Tệp demo chỉ preview theo adapter… | Bỏ giải thích implementation | Nếu tệp chưa gửi đi, dùng trạng thái “Ảnh đã chọn” hoặc thông tin ngắn về nháp trên thiết bị |
| Thử mô phỏng xung đột 409 | Bỏ control | Giữ xử lý xung đột thật với lời nhắc dễ hiểu khi nó xảy ra |
| Lưu thay đổi (Demo) | Lưu thay đổi | Phản hồi đúng khả năng lưu hồ sơ của dịch vụ đang dùng |
| Thông tin Tài khoản (Canonical User) | Hồ sơ cá nhân | Mã hỗ trợ nếu cần đặt ở vị trí phụ, không giải thích schema |
| Bất biến kiến trúc / userId / UUIDv7 | Bỏ khỏi copy hướng dẫn | Giữ quan hệ ID trong code và tài liệu |
| Quy tắc kiến trúc VIP không làm lệch | Thông tin gói VIP | Chỉ nói quyền lợi, giá, hạn và cách gia hạn |
| Bốn Nhánh Quyền Lợi… / (4 Khối) | Quyền lợi đóng góp | Giữ các trạng thái điều kiện riêng của nhãn, SBT, NFT và nhận tip |
| Ghi nhận đóng góp & Route ủng hộ | Ủng hộ tác giả | Giữ tỷ lệ 80/20 và lý do khi chưa thể nhận |
| Return URL / Chống Open Redirect | Bỏ khỏi UI | Giữ validation và điều hướng an toàn trong code |

Không đổi nhãn rồi giữ nguyên một callback giả báo thành công. Khi tính năng chưa thể hoàn thành, dùng copy sản phẩm ngắn tại đúng chỗ, ví dụ “Hiện chưa thể gửi bài. Nháp của bạn vẫn được giữ trên thiết bị.” Không thêm banner “đang phát triển” cho toàn trang.

## E. Xử lý dữ liệu và chức năng khi bỏ nhãn thử nghiệm

### 1. Nguyên tắc hiển thị

| Tình trạng thực tế | Cách hiển thị chính thức |
| --- | --- |
| Nội dung địa điểm thật, có nguồn, đang lưu tĩnh trong FE | Hiển thị bình thường; bổ sung nguồn/thời điểm khi cần |
| Chưa có bài/giao dịch/chứng nhận | Empty state đúng ngữ cảnh |
| Chưa tải được dữ liệu | “Chưa tải được dữ liệu”, nút thử lại nếu phù hợp; không thay bằng số 0 giả |
| Dịch vụ tác vụ chưa cấu hình | Ẩn tác vụ không khả dụng hoặc vô hiệu hóa có giải thích tại chỗ; giữ nội dung giới thiệu hữu ích |
| Kết quả/số liệu/persona giả lập | Loại khỏi tập dữ liệu công khai, giữ ở fixture phát triển nếu còn cần |
| Trạng thái thật đang xử lý/thất bại/hết hạn | Giữ trạng thái và bước tiếp theo; không xóa vì muốn giao diện “chính thức” |

Sửa việc chọn nguồn dữ liệu theo từng capability; không thêm API server/database/chain mới trong lượt FE này. Nếu đã có dịch vụ thật thì dùng adapter cấu hình sẵn. Liệt kê phần chưa cấu hình trong báo cáo riêng cho Bin, không treo thông tin BE/Chain trên website.

### 2. Thanh toán và minh bạch

Quan sát hiện tại: các hộp thanh toán hiển thị sẵn ví/số dư 250 USDC, mạng sai để thử, nút “Thử thanh toán (demo)”; trang minh bạch có receipt `0xmock...` và mục “DEMO STREAM”. Những nội dung này không thể trở thành giao dịch thật chỉ bằng đổi nhãn.

Yêu cầu:

- Bỏ footer “Ventlore FE Demo…” và lựa chọn mạng/tình huống chỉ phục vụ thử lỗi khỏi UI chính thức.
- Ví chưa kết nối phải là “Chưa kết nối”; không khôi phục số dư giả. Giá trị không đọc được phải là chưa có dữ liệu, không giả thành 0 hoặc 250 USDC.
- Nếu wallet/payment integration đã thật sự sẵn sàng, CTA theo bước: “Kết nối ví”, “Tiếp tục thanh toán”, “Xác nhận trong ví”, “Đang xác nhận”. Chỉ kết quả được nguồn có thẩm quyền xác nhận mới là hoàn tất.
- Nếu chưa sẵn sàng, không để một nút mang tên “Thanh toán” chạy hàm mô phỏng. Dùng trạng thái gọn như “Thanh toán hiện chưa khả dụng”; giữ giá gói, mục đích và phân bổ tiền để người dùng hiểu sản phẩm.
- Bỏ stream giả khỏi trang minh bạch. Các số dư, khoản chi, “80 gói VIP đã kích hoạt”, receipt và số liệu đang có phải đối chiếu nguồn trong repo; dữ liệu fixture không được công bố như chứng từ thật.
- Có dữ liệu thật thì hiện sổ giao dịch với nguồn và thời điểm cập nhật. Chưa có nguồn thì ghi “Chưa có dữ liệu công bố”; nếu đã kết nối và xác nhận chưa có giao dịch thì ghi “Chưa có giao dịch”. Hai trạng thái này không đồng nghĩa.
- Không gọi “đối soát thời gian thực” nếu chỉ đang đọc fixture hoặc dữ liệu không có cơ chế cập nhật tương ứng. Viết theo khả năng thực tế, ví dụ “Các khoản thu và chi được công bố tại đây”.

Giữ ba nghiệp vụ: PROJECT 100% quỹ, POST_TIP 80/20, MEMBERSHIP quyền VIP của tài khoản. Không thay đổi IDs, số tiền hoặc tự gửi giao dịch thật trong quá trình rà copy.

### 3. SBT/NFT, kiểm định và hồ sơ công khai

- `ISSUED_DEMO` không được dịch thành “Đã nhận” trong bản chính thức. Chỉ nguồn chứng nhận hợp lệ mới cho phép hiển thị đã phát hành/đã nhận.
- Token ID/địa chỉ/chứng nhận mẫu phải tách khỏi public projection. Khi chưa có, dùng empty state hoặc trạng thái đủ/chưa đủ điều kiện đúng với dữ liệu thật.
- Giữ nhãn “Chưa kiểm định”, “Hết hạn kiểm định”, phạm vi/thời điểm và cảnh báo liên quan. Đây là thông tin sản phẩm, không phải nhãn thử nghiệm.
- Đối chiếu các bài/biên bản/nhận định giả lập đang được fixture gắn VERIFIED; không giữ chúng như kết quả kiểm định thực địa chính thức nếu không có hồ sơ nguồn.
- “Ảnh minh họa” và attribution bản quyền không phải lời nhắc thử nghiệm. Giữ nếu ảnh thực sự chỉ minh họa hoặc giấy phép yêu cầu; chỉ thay khi có ảnh thật của địa điểm và nguồn phù hợp.

### 4. Bộ 100 điểm và Gần tôi — đính chính v1.3

- Vẫn triển khai khoảng 100 địa danh thật, tọa độ có nguồn, mỗi địa phương một điểm đại diện theo quy ước v1.3. Có thể lưu JSON tĩnh, không cần BE để công khai nội dung này.
- Bỏ yêu cầu của v1.3 về việc gắn “Dữ liệu thử nghiệm” lên các địa điểm thật đã được đối chiếu. Đặt metadata nguồn/đối chiếu trong dữ liệu và hiển thị phần hữu ích cho người đọc.
- Tọa độ tổng hợp, origin giả và kịch bản lỗi chỉ ở test/local; bỏ các nút chọn origin mock khỏi sản phẩm.
- Gần tôi trên bản chính thức dùng vị trí thiết bị được cho phép hoặc vị trí người dùng chọn; hai nguồn phải được diễn đạt đúng. Không dùng location mẫu rồi đổi nhãn thành vị trí thật.

## F. Bao phủ mọi landing page, sáu ngôn ngữ và các trạng thái phụ

Agent phải đọc router/page inventory trong repo. Rà cả các trang có link và route không xuất hiện trong navigation: landing page, entity detail, hồ sơ, màn thiếu quyền, không tìm thấy, lỗi, callback, form và toàn bộ modal/toast liên quan.

Tìm chữ bằng `rg` trong source/i18n/public theo các nhóm sau rồi xem ngữ cảnh từng kết quả:

```text
DEMO | demo | thử nghiệm | bản thử | mô phỏng | dữ liệu mẫu
Review Toolbar | Bin Review | Scenarios | persona | mock | simulated
Auth Server | BE chưa | chưa kết nối BE | adapter | fixture
Canonical User | Bất biến kiến trúc | Return URL | Concurrent Edit
ISSUED_DEMO | DEMO STREAM | Thử thanh toán | New Revision
```

Không replace toàn repo một cách máy móc: từ trong test, comment, business enum hoặc bài viết thật không nhất thiết là copy UI. Bỏ thuật ngữ phát triển khỏi public rendering nhưng giữ mã nghiệp vụ, các lỗi cần xử lý và tài liệu nguồn.

Áp dụng cho VI/EN/JA/ZH/KO/FR theo mã locale thực tế trong repo. Rà cả dictionary fallback, aria-label, tooltip, title/description metadata, toast và trang lỗi. “Đã bỏ tiếng Việt demo” nhưng bản EN vẫn “Demo environment” là chưa hoàn thành.

Giữ các nhãn sản phẩm có ý nghĩa: nháp, đang gửi, đang xác nhận, chưa kiểm định, hết hạn, vị trí gần đúng, ảnh minh họa, cảnh báo rủi ro. Không xóa các nhãn đó bằng quy tắc cấm từ quá rộng.

## G. Bố cục và quy trình đánh giá

- Gỡ banner/toolbar xong phải sửa lại khoảng cách và vùng sticky/fixed; không để dải trống hoặc padding thừa.
- Kiểm header iPad dọc/ngang, menu, modal và bàn phím theo v1.3. Việc bỏ toolbar cũng phải giải quyết vùng form đang bị che trong ảnh của Bin.
- Home giữ hero và hai CTA theo thiết kế đã chốt; không thêm banner “đã chính thức ra mắt” hoặc một khu tài liệu kỹ thuật mới.
- Giữ các sửa đã đạt: query/tab Account và Contribute, revision đúng nội dung, gate tip, quyền lợi theo tài khoản và trạng thái VIP.
- Agent tự chạy build/typecheck/lint theo repo, xem các màn hình bị sửa và kiểm các luồng có rủi ro cụ thể. Không tạo một hệ thống nghiệm thu mới, không dựng lại 14 scenario thành tính năng công khai khác.
- Kết quả kiểm kỹ thuật ghi trong tài liệu nội bộ. Bin sẽ dùng bản sản phẩm rồi phản hồi từng vòng; không yêu cầu Bin đi hết một checklist mới trước mỗi vòng tiếp theo.

## H. Bàn giao

Hoàn thành sửa FE, chạy bản có thể xem và bàn giao ngắn:

1. URL local/preview thật đang chạy và branch/checkpoint tương ứng.
2. Danh sách page/component đã dọn cùng các nhãn thay đổi chính.
3. Bảng nội bộ về capability: hoạt động thật, đang dùng nội dung tĩnh có nguồn, hoặc chưa khả dụng. Không đưa bảng này lên giao diện người dùng.
4. Những nội dung/số liệu giả lập đã tách khỏi public build và các phần còn cần nguồn thật.
5. Kết quả kiểm kỹ thuật, phạm vi locale/thiết bị đã xem; không gắn PASS cho thiết bị chưa thử.

Cập nhật `FE_DATA_MAP.md`, `FE_HANDOFF.md` và ghi chú thay đổi hiện có trong repo; bỏ bản copy công khai của tài liệu nội bộ nếu đang được phát hành cùng website. Không làm mất nguồn tài liệu gốc.

Không reset thay đổi của người khác hoặc xóa nháp/tài khoản thật để đổi chế độ. Không tự push/merge/deploy production khi chưa có chỉ dẫn phát hành riêng. Bàn giao một bản giao diện chính thức để Bin trực tiếp đánh giá vòng tiếp theo, không bàn giao lại một website có nhãn thử nghiệm.

**Bắt đầu từ AppShell, login/persona, Review Toolbar và PaymentModal; sau đó rà toàn bộ route và locale, hoàn thiện từng trang đến khi có bản chạy để Bin xem.**
