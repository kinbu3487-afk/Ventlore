# Tài Liệu Bàn Giao (HANDOFF)

**Chặng hoàn thành gần nhất:** FE-Official v1.4 — Triển khai Giao diện Sản phẩm Chính thức (Clean Production Interface) theo `Ventlore_FE_Official_Interface_v1_4.md`  
**Nhiệm vụ tiếp theo:** Bin trực tiếp trải nghiệm và nghiệm thu cục bộ trên `http://localhost:3000`; Chuẩn bị cho chặng kết nối Back-end  
**Thời điểm bàn giao:** 26/09/2026 17:15 UTC+7  
**Tài liệu kèm theo:** `docs/PROJECT_STATE.md`, `Ventlore_FE_Official_Interface_v1_4.md`  

---

## 1. Kết quả đạt được tại Chặng FE-Official v1.4

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
