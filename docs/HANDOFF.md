# Tài Liệu Bàn Giao (HANDOFF)

**Chặng hoàn thành gần nhất:** FE-Nearby v1.5 — Tích Hợp 100 Điểm Đến Nền & Định Vị "Gần Tôi" Thuần FE theo `docs/Ventlore_Nearby_v1_5/Ventlore_FE_100_Destinations_Location_v1_5.md`  
**Nhiệm vụ tiếp theo:** Bin trực tiếp trải nghiệm và nghiệm thu cục bộ tính năng khám phá theo vị trí trên `http://localhost:3000/explore`; Chuẩn bị cho chặng kết nối Back-end  
**Thời điểm bàn giao:** 26/09/2026 18:15 UTC+7  
**Tài liệu kèm theo:** `docs/PROJECT_STATE.md`, `docs/Ventlore_Nearby_v1_5/Ventlore_FE_100_Destinations_Location_v1_5.md`  

---

## 1. Kết quả đạt được tại Chặng FE-Nearby v1.5

1. **Bộ Dữ Liệu 100 Điểm Đến Nền Chuẩn Hóa:**
   - Đặt tại `packages/api-client/src/data/destinations-100.json`, chứa đúng 100 điểm đến phân bổ khắp 34 tỉnh/thành hiện hữu của Việt Nam (mỗi tỉnh/thành $\ge 2$ điểm; $32 \times 3 + 2 \times 2 = 100$).
   - Kết hợp hoàn hảo giữa 3 điểm thực địa gốc (`018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e02` Đảo Cát Bà, `...e08` Vườn quốc gia Cát Tiên, `...e09` Bán đảo Sơn Trà) và 97 điểm đến nền mới.
   - Giữ nguyên vẹn 1 điểm Candidate (`...e03` Cát Cò 3) và 1 điểm Merged (`...e04` Cát Cò 4 trỏ về Cát Bà) cùng tất cả bài viết, revisions và claims liên kết.
   - 97 điểm nền có tọa độ ước lượng mang cờ `approximate_area`, trạng thái `UNVERIFIED`, `postsCount: 0`, `independentlyVerified: false`, hiển thị thông điệp trung thực *"Thông tin thực địa đang được bổ sung"*.

2. **Cơ Chế Khám Phá Định Vị "Gần Tôi" (Nearby Engine):**
   - Đóng gói tại `packages/api-client/src/nearby.ts` và re-export tại `apps/web/src/lib/nearby.ts`.
   - Sử dụng One-shot Device Geolocation API chuẩn (`navigator.geolocation.getCurrentPosition`), không phụ thuộc RPC, backend hay dịch vụ bên thứ ba.
   - Xử lý đủ 7 trạng thái định vị: `ready`, `denied`, `unavailable`, `timeout`, `unsupported`, `insecure_context`, `cancelled`.
   - Pipeline truy vấn chặt chẽ: Danh mục 100 điểm $\to$ Lọc từ khóa/bí danh + tỉnh thành + hoạt động $\to$ Tính khoảng cách theo công thức Haversine bán kính Trái Đất $R = 6371\text{ km}$ $\to$ Lọc bán kính (5, 25, 50, 100, 200 km, Không giới hạn) $\to$ Sắp xếp theo khoảng cách $\to$ Phân trang chuẩn 12 điểm/trang (9 trang).
   - Bảo mật riêng tư tuyệt đối: Tọa độ thiết bị chỉ lưu trong bộ nhớ React state (`in-memory`), không bao giờ ghi vào URL search params, localStorage hay analytics.

3. **Giao Diện Bản Đồ & Thẻ Điểm Đồng Bộ:**
   - **Thẻ điểm:** Hiển thị huy hiệu khoảng cách `≈ X km`, nhãn `Vị trí ước lượng`, ảnh nền 16:9 với fallback SVG, nhãn cảnh báo an toàn thu gọn/mở rộng.
   - **Trạng thái rỗng bán kính:** Khi không có điểm trong bán kính đã chọn, giao diện hiển thị thông báo thân thiện, các nút mở rộng bán kính (100 km, Không giới hạn) hoặc chọn khu vực, kèm danh sách tối đa 3 điểm gần nhất ngoài bán kính (`nearestOutsideRadius`).
   - **Bản đồ OpenStreetMap (Leaflet):** Hiển thị toàn bộ các điểm thỏa mãn bộ lọc (`mappableMatches`), ghim vị trí người dùng kèm vòng tròn độ chính xác, nút "Xem toàn bộ" fit bounds, đồng bộ thẻ điểm khi click marker.
   - **Đóng góp (`/contribute`):** Cung cấp ô tìm kiếm tức thời tên điểm/tỉnh thành để chọn điểm sẵn có từ 100 điểm mà không cần cuộn danh sách dài; bộ phát hiện điểm trùng lặp hoạt động tự động.

4. **Đa Ngôn Ngữ & Build Tĩnh Toàn Diện:**
   - Bổ sung hơn 35 khóa ngôn ngữ mới vào cả 6 locales (`vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`) cho các trạng thái geolocation, bán kính, thông báo vị trí ước lượng, phân trang và 7 nhóm hoạt động trải nghiệm.
   - `generateStaticParams()` được cập nhật đầy đủ cho cả 2 route `/places/[placeId]` và `/[locale]/places/[placeId]`.
   - Sinh thành công **906 trang SSG tĩnh** (6 locales $\times$ 100 điểm đến + các trang tài khoản, đóng góp, quản trị, bài viết).

---

## 2. Kết Quả Kiểm Tra Kỹ Thuật

- **Tự động kiểm định Nearby (`node docs/Ventlore_Nearby_v1_5/validate-nearby.mjs`):** PASS 100% (100 điểm, 34 tỉnh, đầy đủ các ca kiểm tra biên bán kính, tìm kiếm, phân trang, lỗi tọa độ và giả lập geolocation).
- **Foundation Validator (`python3 scripts/validate_foundation.py`):** Đạt 34/34 thực thể, 10/10 vectors (PASS 100%).
- **TypeScript Typecheck (`pnpm -r run typecheck`):** 0 lỗi trên toàn bộ 6 workspace monorepo (PASS).
- **ESLint (`pnpm --filter @ventlore/web lint`):** 0 lỗi (PASS).
- **Production Build (`pnpm --filter @ventlore/web build`):** Biên dịch thành công **906/906 trang SSG**.
- **Static Export (`pnpm run build:export`):** Xuất tĩnh thành công 906 trang vào thư mục `out/`.
- **Tổng kiểm tra toàn dự án (`pnpm run verify`):** PASS 100%.

---

## 3. Hướng Dẫn Trải Nghiệm & Nghiệm Thu Cho Bin

1. **Khởi động server dev (nếu chưa chạy):**
   ```bash
   pnpm --filter @ventlore/web dev
   ```
2. **Mở trình duyệt tại:** `http://localhost:3000/explore`
3. **Các ca kiểm tra trọng yếu:**
   - **Danh mục 100 điểm:** Khi chưa lọc gì, hiển thị "1–12 trong 100 điểm đến", tổng cộng 9 trang (trang cuối có 4 điểm).
   - **Tìm kiếm đa dạng:**
     - Gõ `"da nang"` hoặc `"Đà Nẵng"`: ra đúng 3 điểm của Đà Nẵng.
     - Gõ `"Quảng Nam"` hoặc chọn tỉnh Quảng Nam: ra đúng 3 điểm.
     - Gõ `"kon tum"`: ra đúng 3 điểm.
     - Gõ `"Mỹ Khê"`: ra đúng 2 bãi biển Mỹ Khê riêng biệt (Quảng Ngãi và Đà Nẵng).
     - Chọn Hoạt động `"Đi bộ đường dài"` hoặc `"Vùng núi"`: danh sách lọc chuẩn xác.
   - **Thử nghiệm "Gần tôi":**
     - Nhấn nút **"Gần tôi"** trên thanh tìm kiếm $\to$ Chọn **"Dùng vị trí của tôi"**.
     - Nếu trình duyệt hỏi quyền vị trí:
       - **Đồng ý:** Thanh điều khiển vị trí hiện ra với bán kính mặc định 50 km, các thẻ điểm hiển thị huy hiệu `≈ X km`, sắp xếp từ gần đến xa. Thử chuyển đổi các mốc bán kính (5, 25, 50, 100, 200 km, Tất cả). Thử bấm "Cập nhật vị trí" hoặc "Tắt vị trí".
       - **Từ chối / Chặn:** Hiển thị thông báo nhẹ nhàng giải thích quyền đã bị chặn kèm nút "Chọn khu vực khác" (không bị crash hay chặn trang).
     - **Kiểm tra URL:** Tọa độ GPS không bao giờ xuất hiện trên URL `?q=...&province=...`.
   - **Chuyển đổi Bản đồ / Danh sách:** Bấm nút chuyển sang chế độ "Bản đồ", OpenStreetMap tải các điểm đã lọc, bấm marker để xem thông tin điểm đến.
   - **Trang chi tiết điểm đến:** Bấm vào bất kỳ điểm nào trong 97 điểm nền mới (ví dụ `http://localhost:3000/places/PLC-000006`), trang hiển thị ảnh bìa 16:9, tọa độ ước lượng, nhãn "Thông tin thực địa đang được bổ sung", và mục "Chưa có bài viết thực địa nào" với nút CTA đóng góp.
   - **Đóng góp bài viết (`/contribute`):** Tại tab "Điểm đến đã có", gõ thử tìm kiếm trong ô chọn điểm đến để thấy autocomplete mượt mà từ 100 điểm.
   - **Đa ngôn ngữ:** Thử chuyển qua lại 6 ngôn ngữ (`vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`) trên trang `/explore` để kiểm tra các nhãn bán kính, khoảng cách và nút bấm đều hiển thị ngôn ngữ tương ứng.

1. **Gỡ bỏ hoàn toàn Banner DEMO, ReviewToolbar & Persona Selectors:**
   - Đã gỡ bỏ thẻ `<aside>` chứa banner thông báo demo trên Header của `AppShell.tsx`, khôi phục layout padding và sticky header đúng chuẩn thiết kế.
   - Gỡ bỏ hoàn toàn component `<ReviewToolbar />` khỏi root layout (`apps/web/src/app/layout.tsx`) và xóa file implementation.
   - Gỡ bỏ khối chọn persona mẫu cho Guest trên trang `/account`, thay bằng màn hình hướng dẫn đăng nhập trang nhã.
   - Gỡ bỏ các nút tự đổi vai trò mẫu ("Trải nghiệm vai trò Chuyên gia", "Trải nghiệm vai trò Quản trị viên") tại `/expert` và `/admin`, thay bằng màn hình giới hạn quyền truy cập chuẩn mực với CTA đăng nhập hoặc quay về Khám phá / Trang chủ.
   - Gỡ bỏ hoàn toàn khối danh sách tài khoản mẫu trong trang `/login` (`SocialLogin.tsx`), chỉ giữ các nút đăng nhập thực tế (Google, Apple) kèm trạng thái thông báo và link "Tiếp tục khám phá".

2. **Dọn dẹp Data Map và Tài liệu Nội bộ khỏi Bản Công khai:**
   - Xóa bỏ route `/data-map` (`apps/web/src/app/data-map` và `apps/web/src/app/[locale]/data-map`) cùng component `DataMapView.tsx` và `data-map-data.ts`.
   - Gỡ bỏ link `/data-map` và "Tải .md" khỏi thanh Header, Footer và User Dropdown.
   - Xóa bỏ toàn bộ các file markdown nội bộ trong thư mục `apps/web/public/docs/` (`FE_COVERAGE.md`, `FE_DATA_MAP.md`, `FE_HANDOFF.md`, `FE_QA.md`, `FE_REVIEW.md`) để bảo đảm bản build công khai không phát hành tài liệu kỹ thuật ngoài ý muốn.

3. **Chuyển ngữ & Chuẩn hóa Copy Sản phẩm Chính thức trên cả 6 Locales:**
   - Rà soát toàn bộ từ điển và layout trên 6 ngôn ngữ (`vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`).
   - Bổ sung đầy đủ bản dịch cho các key còn thiếu (như `missionClose`, `missionExploreCta` trong hộp thoại Sứ mệnh để không bao giờ bị lộ raw string).
   - Viết lại toàn bộ nhãn kỹ thuật / mô phỏng sang ngôn ngữ sản phẩm:
     - "Tệp hình ảnh đối chứng (Demo Upload)" $\to$ "Ảnh và tài liệu"
     - "Xác nhận nộp bản mới (Demo)" $\to$ "Nộp bản sửa đổi"
     - "Bất biến kiến trúc / UUIDv7" $\to$ Gỡ khỏi UI hướng dẫn
     - "Quy tắc kiến trúc VIP không làm lệch" $\to$ "Thông tin gói VIP" (nêu rõ quyền lợi, phí $15/năm, kỳ hạn 12 tháng, gia hạn chủ động)
     - "Xác nhận giao nhiệm vụ (Demo)" $\to$ "Xác nhận giao nhiệm vụ"
     - "Ban hành quyết định (Demo Decision)" $\to$ "Ban hành quyết định"

4. **Trạng thái Khả dụng Trung thực cho Nút và Tính năng Chưa kết nối:**
   - **Thanh toán trực tuyến (`PaymentModal.tsx`):**
     - Gỡ bỏ hoàn toàn số dư giả 250 USDC, địa chỉ ví mẫu và dropdown mạng thử nghiệm sai.
     - Gỡ bỏ hoàn toàn luồng mô phỏng tạo mã biên nhận giả `0xmock...demo`.
     - Chuyển sang trạng thái khả dụng trung thực: Nút thanh toán hiển thị *"Cổng thanh toán trực tuyến đang kết nối"* (disabled) kèm ghi chú rõ ràng về việc hạ tầng thanh toán qua Arbitrum đang được tích hợp đối soát an toàn. Vẫn giữ nguyên phân bổ tài chính chuẩn mực (80/20 tip, 100% quỹ, 15 USD VIP).
   - **Trang Minh bạch (`PublicLedger.tsx`):**
     - Gỡ bỏ hoàn toàn component `DemoPaymentsStream` (xóa nhãn "DEMO STREAM" và bảng biên nhận giao dịch mô phỏng giả lập).
     - Cập nhật nhãn huy hiệu từ "Đối soát thời gian thực" sang *"Sổ quỹ công bố định kỳ"*.
   - **Chứng nhận Contributor SBT & Author NFT (`AccountView.tsx`):**
     - Không tự động dán nhãn `ISSUED_DEMO` thành "Đã nhận".
     - Khi bài viết đã được thẩm định: Hiển thị trạng thái "Đủ điều kiện nhận" / "Đủ điều kiện đúc" với nút disabled thông tin *"Nhận Contributor SBT (Đang kết nối onchain)"* / *"Đúc Author NFT (Đang kết nối onchain)"* kèm ghi chú hạ tầng.
   - **Gần tôi (`SearchFilters.tsx`):**
     - Thay thế hàm mô phỏng GPS bằng hàm gọi trực tiếp `navigator.geolocation.getCurrentPosition` của trình duyệt. Nếu người dùng từ chối cấp quyền hoặc trình duyệt không hỗ trợ, hiển thị thông báo nhẹ nhàng hướng dẫn chọn vùng miền mà không chặn trải nghiệm.
   - **Soạn thảo (`ContributeView.tsx`):**
     - Gỡ bỏ nút và hộp thoại "Thử mô phỏng xung đột 409 (Concurrent Edit)".

---

## 2. Kết Quả Kiểm Tra Kỹ Thuật

- **TypeScript Typecheck (`pnpm --filter @ventlore/web typecheck`):** 0 lỗi (PASS).
- **ESLint (`pnpm --filter @ventlore/web lint`):** 0 lỗi (PASS).
- **Production Build (`pnpm --filter @ventlore/web build`):** Biên dịch thành công **227/227 trang SSG** (First load JS: 103 kB, sạch hoàn toàn các route và file tài liệu nội bộ).
- **Foundation Validator (`python3 scripts/validate_foundation.py`):** Đạt 34/34 thực thể, 10/10 vectors (PASS 100%).

---

## 3. Hướng Dẫn Trải Nghiệm & Nghiệm Thu Cho Bin

1. **Khởi động server dev (nếu chưa chạy):**
   ```bash
   pnpm --filter @ventlore/web dev
   ```
2. **Mở trình duyệt tại:** `http://localhost:3000`
3. **Các điểm kiểm tra trọng yếu:**
   - **Giao diện công khai:** Không còn banner thông báo DEMO màu vàng/cam; không còn nút nổi ReviewToolbar hay scenario controls; header và footer sạch sẽ, đúng tỷ lệ thương hiệu.
   - **Điều hướng & Trang:** Không còn link `/data-map` hay "Tải .md". Thử truy cập trực tiếp `http://localhost:3000/data-map` sẽ trả về trang 404 chuẩn.
   - **Đăng nhập (`/login`):** Giao diện sạch sẽ, chỉ có Google, Apple, ghi chú trạng thái và liên kết "Tiếp tục khám phá".
   - **Đóng góp (`/contribute`):** Không còn nút mô phỏng xung đột 409; mục đính kèm tệp hiển thị "Ảnh và tài liệu"; thông báo Guest rõ ràng, lịch sự.
   - **Thanh toán (`PaymentModal`):** Mở thử nút "Ủng hộ" trên Header hoặc "Ủng hộ tác giả" trong bài viết; giao diện hiển thị rõ ràng đích đến, phân bổ 80/20 hoặc 100% quỹ; nút hiển thị trung thực *"Cổng thanh toán trực tuyến đang kết nối"*; không sinh ra biên nhận giả `0xmock`.
   - **Minh bạch (`/transparency`):** Bảng số dư và các khoản chi thể hiện nguồn "Arbitrum One" và "Nội bộ"; không còn stream giao dịch giả lập.
   - **Đa ngôn ngữ:** Lần lượt chọn 6 ngôn ngữ trên Header (`vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`), tất cả tiêu đề, mô tả và nút bấm đều được bản địa hóa trọn vẹn, không còn từ "Demo" hay chuỗi raw chưa dịch.
