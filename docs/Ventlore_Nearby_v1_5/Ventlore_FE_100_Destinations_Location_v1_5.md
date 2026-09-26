# Ventlore FE v1.5 — 100 điểm đến và tìm kiếm theo vị trí

Ngày chuẩn bị: 26/09/2026. Trang được kiểm tra: https://ventlore.com/vi/explore/

**Đầu ra cần triển khai:** Explore có danh mục nền 100 điểm đến, đủ 34 tỉnh/thành hiện hành, mỗi tỉnh/thành ít nhất 2 điểm; người dùng chủ động cho phép vị trí thiết bị để tìm, lọc và sắp xếp điểm gần mình. Danh sách, bản đồ, chi tiết và bộ chọn điểm cùng dùng một nguồn dữ liệu.

Đây là gói dữ liệu, module tham khảo và hướng dẫn giao Antigravity sửa repository FE. Gói này chưa thay đổi website đang chạy, chưa lấy vị trí thiết bị của Bin và chưa xác nhận hoạt động trên iPad thật.

## 1. Yêu cầu mới được ưu tiên

- Bin yêu cầu giả lập đủ 100 điểm, **mỗi tỉnh/thành ít nhất 2 điểm**, thay yêu cầu cũ một điểm mỗi địa phương.
- Dùng danh mục **34 tỉnh/thành hiện hành**, không dùng 63 tỉnh/thành cũ làm bộ lọc chính. 32 tỉnh/thành có 3 điểm; Điện Biên và Lai Châu có 2 điểm: `32 × 3 + 2 × 2 = 100`.
- Yêu cầu mới cho phép bộ dữ liệu giả lập phục vụ các vòng đánh giá. Phần đòi đủ 100 tọa độ đã kiểm chứng trong v1.3 được thay bằng bộ seed có nguồn gốc minh bạch ở đây. Không gọi bộ seed này là dữ liệu thực địa đã kiểm định.
- Giữ cách trình bày sản phẩm chính thức của v1.4: không đưa banner “demo/thử nghiệm”, persona selector, dữ liệu kỹ thuật hoặc công cụ nghiệm thu lên giao diện công khai.
- Seed chỉ cung cấp điểm tham khảo để khám phá. Không tự tạo bài thực địa, đánh giá sao, số lượt ghé, chứng nhận, cảnh báo thời tiết, claim an toàn hay trạng thái VERIFIED.
- “Gần tôi” dùng được cho khách chưa đăng nhập, không yêu cầu VIP hoặc ví. Người dùng quyết định cấp quyền trong trình duyệt.
- 100 điểm giúp đánh giá quy mô hiển thị, **không bảo đảm luôn có điểm trong bán kính 5–50 km ở mọi vị trí**. Phải làm cả trạng thái ít kết quả và không có kết quả.

## 2. Các file kèm theo — dùng trực tiếp

| File | Nội dung |
| --- | --- |
| `ventlore-destinations-100.json` | Đúng 100 bản ghi; 34 tỉnh/thành, tọa độ, từ khóa địa phương, nhóm khám phá, ID ổn định và provenance |
| `nearby.mjs` | Hàm khoảng cách Haversine; tìm kiếm không phân biệt dấu; lọc, sắp xếp, phân trang; lấy vị trí thiết bị một lần |
| `validate-nearby.mjs` | Kiểm tính toàn vẹn dữ liệu và các nhánh logic quan trọng; chạy bằng Node, không cần package ngoài |
| File Markdown này | Quyết định sản phẩm, yêu cầu tích hợp, copy và điều kiện bàn giao |

Chạy kiểm tra tại thư mục đã giải nén:

```bash
node validate-nearby.mjs
```

Module `.mjs` không phụ thuộc framework. Có thể chuyển sang TypeScript theo quy ước repo, nhưng giữ nguyên hành vi và điều kiện kiểm tra. Không cần dựng backend mới chỉ để tìm gần trong 100 bản ghi.

### Chất lượng và phạm vi dữ liệu

- 97 bản ghi bổ sung dùng tên địa danh làm điểm tham khảo; tọa độ khu vực do người soạn ước lượng cho bộ giả lập. Chưa kiểm chứng độc lập tọa độ, lối vào hoặc polygon tỉnh/thành. Không dùng những tọa độ này làm hướng dẫn điều hướng chính xác.
- 3 bản ghi lấy lại tên, ID và tọa độ đang hiển thị trong chế độ Bản đồ của Ventlore. Nguồn quan sát website không đồng nghĩa với kiểm định độc lập.
- Mọi bản ghi có `coordinateKind: approximate_area`, `verificationStatus: UNVERIFIED`, `independentlyVerified: false`. Không bịa độ chính xác GPS: `accuracyMeters` của điểm đến để `null`.
- Danh mục/mã tỉnh và alias sau sắp xếp được đối chiếu nguồn Chính phủ. Các nguồn đó **không phải nguồn tọa độ của 100 điểm**.
- `areaLabel` là nhãn địa lý phổ biến, không khẳng định đó là xã/huyện theo hệ thống hành chính hiện hành.
- `activityIds` là nhóm khám phá để lọc giao diện, không phải xác nhận hoạt động đó được phép thực hiện tại điểm đến. Không suy diễn từ nhãn “Núi” ra cung trekking đã kiểm tra.
- `coverImage: null`: dùng placeholder sẵn có theo nhóm khám phá. Chưa có ảnh/giấy phép thì không tự gắn “Ảnh thực địa” hoặc “Giấy phép mở”. Không cần 100 ảnh để bật tính năng.

Copy phù hợp cho dữ liệu chưa hoàn thiện: **“Vị trí gần đúng”**, **“Thông tin thực địa đang được bổ sung”**, **“Chưa có bài viết thực địa”**. Đây là trạng thái nội dung của điểm đến, không phải thông báo môi trường sản phẩm. Chưa nối chỉ đường cho tọa độ seed chưa kiểm chứng.

## 3. Quan sát trên bản hiện tại

| Nội dung | Kết quả quan sát | Hướng xử lý |
| --- | --- | --- |
| Số điểm | Ảnh Bin gửi có 4; phiên duyệt trực tiếp có 3 | Kiểm nguồn dữ liệu và điều kiện hiển thị trong repo; chưa kết luận nguyên nhân chênh lệch |
| Bộ lọc địa phương | Chỉ có Hải Phòng/Cát Bà, Quảng Ninh/Cô Tô, Hà Giang/Hoàng Su Phì, Tây Nguyên/Kon Tum | Tách bộ lọc “Tỉnh/thành” đủ 34 mục khỏi nhãn khu vực con |
| Nút “Điểm gần tôi” | Sau khi bấm, hiện “Không thể lấy vị trí thiết bị. Bạn có thể chọn vùng miền trong danh sách bộ lọc.” | Bổ sung trạng thái quyền/lỗi riêng và lựa chọn dùng vị trí hoặc chọn khu vực |
| Bản đồ | Sau khi tải có bản đồ Leaflet/OpenStreetMap và 3 ghim | Nối toàn bộ kết quả đã lọc, kiểm nhóm ghim và tương tác với danh sách |

Không suy luận lỗi API từ một lần không định vị được trong môi trường kiểm tra. Chưa kiểm quyền vị trí trên máy của Bin. Không đọc source code Ventlore trong lượt chuẩn bị này; tên file/component thực tế phải lấy từ repo.

## 4. Nối dữ liệu vào repo và giữ các liên kết đang có

1. Tìm nguồn Explore, map, route chi tiết, bộ chọn điểm trong form đóng góp và các adapter hiện có. Dùng `rg` tìm `Điểm gần tôi`, `getCurrentPosition`, `placeId`, `latitude`, `longitude`, `places` và các ID bên dưới. Không tạo một danh mục riêng chỉ để làm số đếm.
2. Import JSON qua một adapter chung. Phân biệt dữ liệu được phép hiển thị và kiểm định nội dung: điểm seed có thể xuất hiện trong danh mục khám phá theo yêu cầu này nhưng không được tự gắn kiểm định. Không làm lộ bản ghi riêng tư hoặc bỏ qua quyền hiện có.
3. Dùng `placeId` UUIDv7 ổn định. `provinceCode` là mã tra cứu địa phương, không thay cho `placeId` hoặc `regionId`. Nếu model hiện có dùng `regionId`, thêm mapping phù hợp; không đổi PK của region để khớp mã tỉnh.
4. Ba ID có sẵn dưới đây phải nối vào cùng thực thể đang dùng. Không ghi đè bài viết, chủ sở hữu, revision, nguồn, số bài thật, cảnh báo có nguồn hoặc chứng nhận hiện có bằng các giá trị trống trong seed. `null` của seed nghĩa là chưa cung cấp, không phải lệnh xóa.
5. Với điểm mới, chỉ thêm dữ liệu khám phá; số bài bằng 0. Trang chi tiết phải mở được, có tên/khu vực/vị trí gần đúng/trạng thái thông tin và CTA chia sẻ phù hợp. Không cho card dẫn đến 404.
6. Form chọn điểm tìm kiếm được theo tên, tỉnh/thành và alias; không buộc cuộn qua 100 lựa chọn. Bộ lọc hoạt động phải bao phủ dữ liệu hiện có và bộ seed; không ép mọi điểm vào 4 hoạt động cũ.
7. Không sinh lại UUID, dùng `Math.random()` hoặc thay tọa độ mỗi lần tải trang. Import lặp phải idempotent theo ID/seedKey; xử lý canonical mapping trước khi nối các quan hệ.

| Điểm có sẵn | ID cần giữ |
| --- | --- |
| Vịnh Cát Cò 3 - Hải Trình Ven Đảo | `018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e02` |
| Vách Đá Móng Rồng Đảo Cô Tô | `018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e08` |
| Đỉnh Tây Côn Lĩnh Hoàng Su Phì | `018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e09` |

### Giữ đúng danh mục nền 100 khi repo có thêm điểm

JSON có đúng 100, đã bao gồm ba điểm trên. Không cộng nguyên 100 vào danh sách cũ thành các bản sao. Nếu repo có điểm thứ tư như ảnh Bin gửi hoặc điểm khác:

- Giữ mọi điểm công khai hợp lệ đang có cùng các quan hệ. Map các điểm trùng sang canonical ID thật; không dedup chỉ bằng khoảng cách vì hai điểm có thể nằm gần nhau.
- Bổ sung seed để mỗi tỉnh/thành đạt ít nhất 2, rồi thêm seed còn lại theo `catalogOrder` đến đủ 100.
- Nếu sau khi giữ điểm cũ và bảo đảm quota, tổng vượt 100, chỉ bỏ những seed vừa thêm mà tỉnh vẫn còn ít nhất 2. Không xóa điểm/bài cũ để ép số 100.
- Nếu dữ liệu thực đã vượt 100 hoặc có ràng buộc khiến không thể giữ đúng 100, giữ dữ liệu thực và báo rõ tổng. Không chặn người dùng tạo điểm thứ 101. “100” là mốc khởi tạo, không phải hạn mức sản phẩm.
- Chạy lại kiểm đếm trên **danh mục thực sự render** sau adapter/merge, không chỉ chạy trên file JSON chưa tích hợp.

## 5. Thiết kế tương tác vị trí

Nút hiện có đổi nhãn ngắn thành **“Gần tôi”**. Khi bấm lần đầu, mở vùng tùy chọn gọn:

> Tìm điểm đến gần bạn. Cho phép vị trí để xem khoảng cách, hoặc chọn khu vực bạn muốn khám phá.

Hai hành động: **“Dùng vị trí của tôi”**, **“Chọn khu vực”**. Gọi `readDevicePosition()` ngay từ thao tác chủ động dùng vị trí; không gọi khi tải trang, scroll, render lại hoặc đổi bộ lọc.

Thiết lập của module: `enableHighAccuracy: false`, `timeout: 10000`, `maximumAge: 60000`. Đây là giá trị khởi đầu có thể điều chỉnh, không phải yêu cầu của chuẩn. Có watchdog UI để không chờ vô hạn, kể cả khi hộp quyền chưa được trả lời. API không cho ứng dụng tự đóng hộp quyền trình duyệt; callback muộn phải bị bỏ qua khi yêu cầu đã kết thúc/hủy.

| Trạng thái | Copy và hành vi |
| --- | --- |
| Chưa lấy vị trí | Cho phép chọn dùng vị trí hoặc chọn khu vực |
| Đang lấy | “Đang xác định vị trí…”; không cho bấm tạo nhiều request; có thể hủy |
| Thành công | “Đang tìm quanh vị trí của bạn”; hiện bán kính, khoảng cách, “Cập nhật vị trí”, “Xóa vị trí đang dùng” |
| `denied` | “Bạn chưa cho phép truy cập vị trí. Hãy bật quyền vị trí trong cài đặt trình duyệt hoặc chọn khu vực.” |
| `unavailable` | “Chưa xác định được vị trí thiết bị. Bạn có thể thử lại hoặc chọn khu vực.” |
| `timeout` | “Việc xác định vị trí mất nhiều thời gian. Thử lại hoặc chọn khu vực.” |
| `unsupported` | “Trình duyệt này chưa hỗ trợ lấy vị trí. Hãy chọn khu vực bạn muốn khám phá.” |
| `insecure_context` | Hiển thị fallback chọn khu vực; kiểm deployment HTTPS, không hướng dẫn người dùng tắt bảo vệ trình duyệt |
| `cancelled` | Trở về trạng thái phù hợp, không hiện toast lỗi |

Mọi nhánh lỗi kết thúc loading. Không biến lỗi thành thành công ở một vị trí mặc định; không gán Hà Nội/Đà Nẵng/TP.HCM làm GPS của người dùng. `Permissions API` nếu dùng chỉ để cải thiện UX; không làm điều kiện bắt buộc trước Geolocation vì cần hỗ trợ Safari.

Nếu cập nhật vị trí thất bại, ghi rõ vẫn đang dùng vị trí lần trước hoặc tắt tìm quanh vị trí; không âm thầm ghi đè origin. Dùng `AbortController` và request token trong component để callback cũ không thắng request mới, hoặc khôi phục vị trí sau khi người dùng đã xóa.

### Quyền, phạm vi dữ liệu và fallback

- Geolocation cần HTTPS, chính sách trình duyệt cho phép và sự đồng ý của người dùng. Không thể cấp quyền thay người dùng bằng một flag FE.
- Nếu app mở trong iframe/preview, kiểm `Permissions-Policy` và thuộc tính `allow` ở đúng nơi nhúng. Không mặc định mở quyền cho mọi origin. Kiểm trên URL top-level thực tế trước khi kết luận lỗi iframe là lỗi sản phẩm.
- Tọa độ thiết bị và độ chính xác giữ trong memory của phiên khám phá. Không đưa vào URL, analytics, log, localStorage, hồ sơ hoặc request backend chỉ để tính gần nhất.
- Xóa vị trí cũng phải xóa marker người dùng, origin, khoảng cách, bán kính đang áp dụng và hủy request đang chờ. Đây không phải thao tác thu hồi quyền trong cài đặt trình duyệt.
- Chọn tỉnh/thành thủ công chỉ là lọc địa phương, không có nghĩa là biết vị trí người dùng. Nếu cho chọn một điểm trên bản đồ làm tâm, gắn `source: manual` và nhãn “Quanh vị trí đã chọn”.
- Nếu bản đồ sử dụng dịch vụ ngoài, giữ attribution và mô tả riêng tư đúng với request thực tế; không cam kết “không truyền dữ liệu nào ra ngoài” khi tiles/phạm vi bản đồ vẫn được tải từ bên thứ ba.
- Không yêu cầu Bin gửi tọa độ cá nhân qua chat. Bin cấp quyền trực tiếp trên thiết bị sau khi FE đã được nối.

## 6. Search, khoảng cách và bán kính

Pipeline bắt buộc:

```text
Danh mục được phép hiển thị
→ tìm từ khóa + tỉnh/thành + nhóm khám phá
→ tính khoảng cách từ origin cho toàn bộ tập phù hợp
→ lọc bán kính
→ sắp xếp
→ lấy tổng kết quả và tập ghim bản đồ
→ phân trang danh sách
```

Không lấy 12 card đầu rồi mới tính “Gần tôi”. Không dùng tọa độ lỗi/null làm `(0,0)` hoặc khoảng cách 0. Khoảng cách của module là đường thẳng trên bề mặt Trái Đất, không phải đường bộ hoặc thời gian di chuyển.

- Sau khi có origin: mặc định sắp **“Gần nhất”**, bán kính **50 km**. Các lựa chọn: **5 / 25 / 50 / 100 / 200 km / Không giới hạn**.
- Đổi bán kính/bộ lọc/từ khóa đưa trang về 1. Chuyển Danh sách ↔ Bản đồ giữ bộ lọc và origin.
- Giữ nguyên bộ lọc tỉnh đang chọn, nhưng thể hiện nó bằng chip dễ xóa; cung cấp “Tìm trên toàn quốc” để người dùng chủ động bỏ lọc tỉnh. Không âm thầm bỏ điều kiện tìm kiếm.
- Search xử lý chữ có dấu/không dấu, `đ/d`, chữ hoa/thường; tìm cả tên và alias tỉnh cũ. Alias cấp tỉnh trong JSON tìm ra cả tỉnh mới; không khẳng định mọi kết quả nằm trong phạm vi tỉnh cũ. Địa danh cụ thể như “Hội An”, “Măng Đen” vẫn tìm theo tên/khu vực.
- Hiển thị `≈ 3 km`, `< 1 km` hoặc khoảng cách làm tròn phù hợp với dữ liệu gần đúng. Giữ giá trị số chưa làm tròn để sort và lọc. Có chú thích ngắn “Khoảng cách đường thẳng”.
- `accuracyMeters` của **thiết bị** khác chất lượng tọa độ của **điểm đến**. Nếu độ chính xác thiết bị thấp, hiển thị “Vị trí thiết bị gần đúng” và cho cập nhật; không giả vờ biết nhà/địa chỉ của người dùng.

Khi không có điểm trong 50 km:

> Chưa có điểm đến phù hợp trong bán kính 50 km. Hãy mở rộng bán kính hoặc thay đổi bộ lọc.

Nút **“Mở rộng lên 100 km”**, **“Xem gần nhất không giới hạn”**, **“Chọn khu vực khác”**. Không âm thầm tăng bán kính. Nếu hiện `nearestOutsideRadius`, đặt riêng dưới tiêu đề **“Điểm gần nhất ngoài bán kính đã chọn”**, ghi khoảng cách thật và không cộng chúng vào số kết quả trong bán kính.

Ví dụ nối utility sau khi đã có vị trí:

```js
import { queryPlaces, readDevicePosition } from './nearby.mjs';

// Chỉ chạy trong handler “Dùng vị trí của tôi”.
const result = await readDevicePosition({ signal: requestController.signal });
if (result.status === 'ready') {
  // Lưu result.origin vào state của trang, không lưu bền vững.
  const discovery = queryPlaces(catalog, {
    origin: result.origin,
    radiusKm: 50,
    sort: 'distance',
    q: searchText,
    provinceCode: selectedProvinceCode || null,
    activityId: selectedActivityId || null,
    page: 1,
    pageSize: 12
  });
  // discovery.items: card của trang hiện tại.
  // discovery.allMatches / total: tập kết quả chung.
  // discovery.mappableMatches: ghim map, không chỉ 12 card đầu.
} else {
  // Chuyển result.status thành trạng thái/copy trong bảng mục 5.
}
```

Đoạn này minh họa điểm nối; các biến state/controller phải lấy từ component thật. Không copy thành handler độc lập rồi bỏ qua render/loading/cancel. Nếu bộ tìm kiếm hiện có hỗ trợ nội dung cảnh báo/cung đường, giữ tính năng đó trên dữ liệu có nguồn; seed không bịa nội dung để đáp ứng placeholder cũ.

## 7. Hiển thị 100 điểm: danh sách, bản đồ và iPad

### Danh sách

- Mặc định 12 card/trang, 100 điểm tương ứng 9 trang; trang cuối 4 card khi chưa lọc.
- Hiện “1–12 trong 100 điểm đến”; có trang trước/sau và trạng thái nút rõ. Không chỉ cắt `.slice(0, 12)` mà không có cách xem phần còn lại.
- Dùng khoảng trắng/tên dài/số bài bằng 0 để kiểm card. Tên có thể 2–3 dòng; các card không đè CTA hoặc làm lệch vùng bấm.
- Desktop dự kiến 3 cột; iPad 2 cột; điện thoại 1 cột. Chốt breakpoint theo chiều rộng thực tế của content, không theo nhãn thiết bị hoặc user-agent.
- Nếu không có ảnh dùng cùng một quy tắc placeholder theo nhóm. Không lặp một ảnh địa danh khác và mô tả là ảnh thật của mọi điểm.

### Bản đồ

- Vẽ toàn bộ `mappableMatches` của tập kết quả, không dùng `items` đã phân trang. Số điểm trong cụm phải tính bằng số địa điểm, không phải số cluster.
- Dùng khả năng clustering của stack map hiện có nếu đã có; nếu thêm thư viện thì kiểm phiên bản/cách tích hợp trong repo. Không thay toàn bộ thư viện map chỉ để có 100 ghim.
- Ghim dùng `placeId` ổn định, có tên truy cập được như “Xem Biển Mỹ Khê — Đà Nẵng”; không chỉ là nút “📍”. Bấm mở popup có tên/khu vực/khoảng cách/chi tiết; dùng được bằng bàn phím.
- Có marker origin và vòng độ chính xác khi origin đến từ thiết bị. Chọn card/ghim đồng bộ cùng `selectedPlaceId`.
- Fit bounds lần đầu hoặc khi người dùng bấm “Xem toàn bộ”; không tự giật lại viewport sau mỗi render hay khi người dùng đang kéo map.
- Giữ attribution nguồn bản đồ. Nếu tiles lỗi, danh sách vẫn hoạt động và có trạng thái map rõ.
- Nếu thêm “Tìm trong vùng bản đồ”, chỉ áp dụng khi người dùng bấm; bộ đếm và danh sách phải phản ánh cùng điều kiện vùng đó.

### iPad và màn hình hẹp

- Kiểm 768×1024, 820×1180, 1024×768, 1180×820; thêm 390px và desktop 1440px. Đây là kích thước kiểm layout, không thay cho iPad Safari thật.
- Bộ lọc wrap hoặc mở drawer; không tràn ngang. Bán kính/bộ lọc tỉnh đủ dễ chạm, vùng bấm khoảng 44px.
- Modal/drawer cuộn được khi bàn phím xuất hiện; nút đóng nhìn thấy, tính safe-area và chiều cao viewport động.
- Map có chiều cao/container rõ. Khi chuyển tab hoặc đổi hướng màn hình, dùng API resize/invalidate size đúng thư viện, không để vùng xám hoặc ghim lệch.
- Không có chức năng chỉ xuất hiện khi hover. Safari iPad phải chạy cả ba nhánh cấp quyền/từ chối/hủy hoặc lỗi vị trí.
- Sáu locale dùng cùng dataset và state; dịch nhãn/copy, không tạo 6 bộ ID khác nhau. Tên riêng địa danh có thể giữ tiếng Việt nếu chưa có tên bản địa hóa đã xác nhận.

## 8. Điều kiện bàn giao

Phần đã được kiểm trong gói này: 100 ID hợp lệ và duy nhất; đủ 34 mã tỉnh; 2–3 điểm mỗi tỉnh; tọa độ hợp lệ về kiểu/phạm vi số; alias; sort toàn bộ trước phân trang; biên bán kính; không kết quả; loại tọa độ lỗi; hàm định vị thành công/lỗi/hủy bằng dependency được tiêm riêng cho kiểm tra.

Kiểm tra đó không chứng minh tọa độ đúng ngoài thực địa, ranh giới tỉnh đúng theo polygon, hộp quyền hoạt động trên iPad, trang chi tiết render được hoặc bản deploy đã thay đổi.

Antigravity cần hoàn tất các điều kiện sau trên repo:

1. Danh mục render đủ 100 sau merge, mọi tỉnh/thành ít nhất 2; báo rõ nếu dữ liệu thực khiến tổng lớn hơn. Import lặp không nhân bản.
2. Mở được mọi route chi tiết, không làm mất bài/quan hệ cũ; chưa kiểm định thì không xuất hiện badge kiểm định.
3. Tìm “da nang”, “Hội An”, “Kon Tum”, “My Khe”; trường hợp hai Mỹ Khê phân biệt bằng tỉnh/thành. Dùng cùng kết quả cho bộ đếm/list/map.
4. Với origin nằm ở một điểm cuối input, điểm đó vẫn đứng đầu khi sort gần nhất. Không giới hạn tính khoảng cách ở trang đang xem.
5. Cấp quyền thật trên thiết bị làm origin thay đổi đúng dữ liệu API; từ chối/timeout/không hỗ trợ đều có fallback, không yêu cầu đăng nhập và không giả thành công.
6. Không có kết quả trong 5 km vẫn có hướng mở rộng; không âm thầm tăng bán kính hoặc trả điểm xa dưới nhãn “trong 5 km”.
7. Xóa vị trí/hủy yêu cầu không bị callback muộn khôi phục. Không ghi tọa độ vào URL/log/storage.
8. Danh sách 9 trang và map 100 điểm hoạt động; xoay iPad không tràn layout hay hỏng kích thước map. Ghi rõ thiết bị nào đã kiểm thật.

Chỉ tự kiểm kỹ thuật cần thiết để bàn giao một bản dùng được. Bin tiếp tục đánh giá qua từng vòng; không dựng bảng nghiệm thu hoặc nút giả lập công khai và không tuyên bố nghiệm thu thay Bin.

## 9. Lệnh giao Antigravity

```text
Đọc Ventlore_FE_100_Destinations_Location_v1_5.md và ba file kèm theo.
Thực hiện trên repository Ventlore FE hiện tại; đây là yêu cầu tiếp nối v1.4.

Nối bộ ventlore-destinations-100.json vào nguồn dùng chung cho Explore,
map, trang chi tiết và form chọn điểm. Dùng danh mục 34 tỉnh/thành hiện hành,
mỗi nơi ít nhất 2 điểm. Giữ canonical ID và quan hệ của điểm đã có;
dedup/merge đúng để danh mục nền đạt 100 theo hướng dẫn.

Triển khai Gần tôi cho cả khách chưa đăng nhập: người dùng chủ động cấp
quyền vị trí, tính khoảng cách toàn bộ dữ liệu, lọc bán kính, sắp gần nhất,
phân trang sau cùng. Nối tất cả trạng thái quyền/lỗi/fallback, không giả GPS.
Dùng nearby.mjs hoặc chuyển tương đương sang TypeScript theo repo.

Làm danh sách và bản đồ nhất quán khi có 100 điểm; kiểm nhóm ghim,
card, 12 mục/trang, bộ lọc, màn hình iPad và tương tác chạm.
Giao diện giữ ngôn ngữ sản phẩm chính thức, không thêm banner thử nghiệm.
Nguồn seed và tọa độ gần đúng không tự trở thành dữ liệu đã kiểm định.

Sửa code, chạy ứng dụng và kiểm các luồng bị tác động; không dừng ở kế hoạch.
Không yêu cầu tôi tự nhập 100 bản ghi hoặc xác nhận từng chỉnh sửa thông thường.
Không tạo backend/chain mới cho chức năng tính gần trong 100 điểm.
Không tự push/merge/deploy production khi chưa có chỉ dẫn phát hành riêng.

Bàn giao bản chạy được theo môi trường hiện có, tổng điểm thực tế,
phân bố theo tỉnh/thành, các file đổi, kết quả kiểm ngắn và phần chưa kiểm.
Bin sẽ trực tiếp dùng và đánh giá vòng tiếp theo.
```

## 10. Nguồn và giới hạn

- [Danh mục và mã số 34 tỉnh/thành — Chính phủ](https://xaydungchinhsach.chinhphu.vn/bang-danh-muc-va-ma-so-cua-34-tinh-thanh-moi-cac-don-vi-hanh-chinh-cap-xa-moi-11925070418263625.htm): nguồn danh mục hành chính, không phải tọa độ địa danh. URL đúng cũng có trong `administrativeSources` của JSON.
- [Chi tiết đơn vị cấp tỉnh sau sắp xếp — Chính phủ](https://xaydungchinhsach.chinhphu.vn/chi-tiet-34-don-vi-hanh-chinh-cap-tinh-tu-12-6-2025-119250612141845533.htm): nguồn mapping tên địa phương cũ/mới.
- [Geolocation — W3C](https://www.w3.org/TR/geolocation/): truy cập vị trí thiết bị theo quyền người dùng; thiết kế API và bối cảnh an toàn.
- [getCurrentPosition — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition): tham số và điều kiện API trình duyệt.
- [Ventlore Explore](https://ventlore.com/vi/explore/): quan sát UI và ba tọa độ hiện có ngày 26/09/2026. Trạng thái có thể khác theo phiên/bản triển khai.

Các con số page size/bán kính, copy, pipeline, module và 97 tọa độ ước lượng là lựa chọn triển khai của gói này. Không gán chúng cho các nguồn dẫn trên.

## Phụ lục — Phân bố đầy đủ 100 điểm

Tên trong bảng là danh mục seed, không phải danh sách đã kiểm định thực địa. Mỗi tọa độ có provenance riêng trong JSON.

| Mã | Tỉnh/thành hiện hành | Số điểm | Điểm trong JSON |
| --- | --- | ---: | --- |
| 01 | Hà Nội | 3 | Hồ Tây; Vườn quốc gia Ba Vì; Hồ Hoàn Kiếm |
| 04 | Cao Bằng | 3 | Núi Mắt Thần; Thác Bản Giốc; Pác Bó |
| 08 | Tuyên Quang | 3 | Hồ Na Hang; Lũng Cú; Đỉnh Tây Côn Lĩnh Hoàng Su Phì |
| 11 | Điện Biên | 2 | Đồi A1; Hồ Pá Khoang |
| 12 | Lai Châu | 2 | Cao nguyên Sìn Hồ; Đồi chè Tân Uyên |
| 14 | Sơn La | 3 | Cao nguyên Mộc Châu; Tà Xùa; Thác Dải Yếm |
| 15 | Lào Cai | 3 | Fansipan; Hồ Thác Bà; Ruộng bậc thang Mù Cang Chải |
| 19 | Thái Nguyên | 3 | Hồ Ba Bể; ATK Định Hóa; Hồ Núi Cốc |
| 20 | Lạng Sơn | 3 | Mẫu Sơn; Ải Chi Lăng; Động Tam Thanh |
| 22 | Quảng Ninh | 3 | Vách Đá Móng Rồng Đảo Cô Tô; Bãi Cháy; Yên Tử |
| 24 | Bắc Ninh | 3 | Hồ Cấm Sơn; Chùa Bút Tháp; Tây Yên Tử |
| 25 | Phú Thọ | 3 | Vườn quốc gia Xuân Sơn; Mai Châu; Tam Đảo |
| 31 | Hải Phòng | 3 | Côn Sơn; Vịnh Cát Cò 3 - Hải Trình Ven Đảo; Đồ Sơn |
| 33 | Hưng Yên | 3 | Cồn Vành; Phố Hiến; Đền Trần — khu vực Thái Bình |
| 37 | Ninh Bình | 3 | Tràng An; Bái Đính; Vườn quốc gia Xuân Thủy |
| 38 | Thanh Hóa | 3 | Sầm Sơn; Bến En; Pù Luông |
| 40 | Nghệ An | 3 | Đồi chè Thanh Chương; Cửa Lò; Vườn quốc gia Pù Mát |
| 42 | Hà Tĩnh | 3 | Chùa Hương Tích; Biển Thiên Cầm; Hồ Kẻ Gỗ |
| 44 | Quảng Trị | 3 | Phong Nha; Cửa Việt; Biển Nhật Lệ |
| 46 | Huế | 3 | Lăng Cô; Vườn quốc gia Bạch Mã; Đại Nội Huế |
| 48 | Đà Nẵng | 3 | Biển Mỹ Khê — Đà Nẵng; Phố cổ Hội An; Bán đảo Sơn Trà |
| 51 | Quảng Ngãi | 3 | Biển Mỹ Khê — Quảng Ngãi; Măng Đen; Đảo Lý Sơn |
| 52 | Gia Lai | 3 | Biển Hồ Pleiku; Eo Gió; Kỳ Co |
| 56 | Khánh Hòa | 3 | Hòn Chồng; Vườn quốc gia Núi Chúa; Vịnh Vĩnh Hy |
| 66 | Đắk Lắk | 3 | Thác Dray Nur; Gành Đá Đĩa; Hồ Lắk |
| 68 | Lâm Đồng | 3 | Hồ Tà Đùng; Hồ Tuyền Lâm; Mũi Né |
| 75 | Đồng Nai | 3 | Bửu Long; Vườn quốc gia Bù Gia Mập; Vườn quốc gia Cát Tiên |
| 79 | Thành phố Hồ Chí Minh | 3 | Cần Giờ; Núi Nhỏ — Vũng Tàu; Thảo Cầm Viên Sài Gòn |
| 80 | Tây Ninh | 3 | Làng nổi Tân Lập; Núi Bà Đen; Vườn quốc gia Lò Gò - Xa Mát |
| 82 | Đồng Tháp | 3 | Xẻo Quýt; Tràm Chim; Cù lao Thới Sơn |
| 86 | Vĩnh Long | 3 | Cồn Phụng; Cù lao An Bình; Ao Bà Om |
| 91 | An Giang | 3 | Rừng tràm Trà Sư; Núi Cấm; Bãi Sao — Phú Quốc |
| 92 | Cần Thơ | 3 | Lung Ngọc Hoàng; Bến Ninh Kiều; Cù lao Dung |
| 96 | Cà Mau | 3 | Mũi Cà Mau; Vườn chim Bạc Liêu; Vườn quốc gia U Minh Hạ |
