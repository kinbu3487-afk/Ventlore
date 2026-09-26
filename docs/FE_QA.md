# Ventlore · Báo Cáo Đảm Bảo Chất Lượng & Kiểm Thử Front-End (FE QA Report v1.1)

Tài liệu này ghi nhận kết quả chạy kiểm thử thực tế, kiểm tra giao diện phản hồi (Responsive), kiểm tra đa ngôn ngữ (6 Locales) và các lỗi P0/P1/P2 đã được sửa chữa trong phiên bản Front-End v1.1.

---

## 1. Lệnh Kiểm Tra Thực Tế & Kết Quả (Verification Pipeline)

Toàn bộ quy trình kiểm định chất lượng được thực thi bằng lệnh:

```bash
pnpm run verify
```

**Kết quả ghi nhận thực tế (100% PASS):**
- **Validator Script (`validate_foundation.py`):**
  - Đạt 34/34 thực thể nghiệp vụ chuẩn hóa theo ID Registry.
  - Đạt 10/10 vector băm blockchain `entityKey` khớp tuyệt đối giữa TypeScript và Solidity contract.
  - Đạt 35/35 màn hình, 50/50 components, 72/72 sự kiện Masterboard.
  - Đạt 14/14 tài sản Brand Kit (Logos, Color Palette, Tokens, Typography).
- **TypeScript Typecheck (`pnpm -r run typecheck`):**
  - `packages/domain`: PASS (0 errors)
  - `packages/chain`: PASS (0 errors)
  - `packages/api-client`: PASS (0 errors)
  - `packages/db`: PASS (0 errors)
  - `apps/web`: PASS (0 errors)
  - `apps/worker`: PASS (0 errors)
- **ESLint Linting (`pnpm -r run lint`):**
  - PASS (0 errors) trên toàn bộ repository.
- **Next.js Static Site Generation Build (`pnpm -r run build`):**
  - Biên dịch và prerender thành công **234 trang tĩnh (SSG)** bao phủ toàn bộ 6 ngôn ngữ (`vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`) mà không có bất kỳ lỗi SSG hay Suspense nào.

---

## 2. Báo Cáo Nghiệm Thu Các Lỗi Ưu Tiên (P0, P1, P2)

### 2.1. Lỗi P0-01 · Chuyển đổi Revision không cập nhật nội dung mà không tải lại trang
- **Hiện tượng cũ:** Khi người dùng click chọn phiên bản khác (`/posts/[postId]?revisionId=...`), URL đổi nhưng nội dung bài đọc, trạng thái kiểm định và nhãn giữ nguyên nội dung cũ nếu không bấm F5.
- **Giải pháp kỹ thuật:**
  - Bọc phần đọc `useSearchParams()` trong `<Suspense fallback={...}>` theo đúng khuyến nghị của Next.js 15 App Router.
  - Cập nhật `PostDetailView.tsx` lắng nghe sự thay đổi của query param `revisionId` một cách phản ứng (reactive).
  - Cập nhật `mock-adapter.ts` hàm `getPost()`: kiểm tra tính hợp lệ của `revisionId` đối với bài viết đó. Trả về đúng dữ liệu snapshot của phiên bản tương ứng và gán `currentRevisionId` đồng bộ. Bổ sung đủ dữ liệu mẫu cho 3 phiên bản: REV-000001 (UNVERIFIED), REV-000002 (VERIFIED), REV-000003 (NEEDS_CHANGES).
  - Nếu URL yêu cầu một `revisionId` không tồn tại, hiển thị thẻ cảnh báo "Phiên bản không tồn tại" kèm nút quay về phiên bản mới nhất.
  - Khi xem phiên bản chưa được duyệt (như REV-000003 hoặc REV-000001), nút Tip ở cuối bài tự động chuyển sang trạng thái disabled với giải thích rõ: "Phiên bản này đang ở trạng thái Cần chỉnh sửa / Chưa kiểm định, chưa thể nhận tip."
- **Kết quả:** Đạt (PASS). Chuyển revision mượt mà, tức thời, không giật màn hình và không cần tải lại trang.

---

### 2.2. Lỗi P0-02 · Guest có thể tạo đơn và hoàn tất mua VIP demo
- **Hiện tượng cũ:** Ở phiên Guest, người dùng vẫn có thể bấm nút mua gói VIP và hoàn tất quy trình mô phỏng thanh toán, trái với bất biến kiến trúc (VIP phải gắn vào `userId` con người duy nhất).
- **Giải pháp kỹ thuật:**
  - Cập nhật `mock-adapter.ts` phương thức `recordPayment()`: bổ sung kiểm tra cứng `if (intent.mode === 'MEMBERSHIP' && this.currentPersona === 'guest') throw new Error('GUEST_CANNOT_PURCHASE_VIP')`.
  - Trong `PaymentModal.tsx`: Khi `activeMode === 'MEMBERSHIP'` và người dùng đang là Guest, màn hình hiển thị Gate yêu cầu đăng nhập: "Bạn cần đăng nhập tài khoản để đăng ký gói Hội viên VIP ($15/năm)". Nút thanh toán bị ẩn hoàn toàn, thay thế bằng CTA "Đăng nhập ngay" (mang theo context quay lại).
  - Với tài khoản Member: Khi gia hạn gói VIP, giữ nguyên mã `membershipId` hiện có và kéo dài thêm 365 ngày UTC tính từ thời điểm hết hạn hiện tại.
  - Loại bỏ chuỗi giả lập mã giao dịch `txHashDemo: '0xmock...'` để tránh nhầm lẫn với blockchain thực.
- **Kết quả:** Đạt (PASS). Khách không thể mua VIP; Member gia hạn cộng dồn thời hạn chuẩn xác.

---

### 2.3. Lỗi P1-01 · Bố cục Header vỡ dòng, đè chữ trên nhiều kích thước màn hình
- **Hiện tượng cũ:** Thanh Header desktop chứa quá nhiều nút và dropdown persona trùng lặp, gây tràn dòng và đè chữ ở độ phân giải 1366px và 1440px (đặc biệt khi dùng tiếng Pháp hoặc chữ Hán/Nhật).
- **Giải pháp kỹ thuật:**
  - Bỏ dropdown Persona Switcher khỏi thanh Header vì thanh công cụ kiểm thử `ReviewToolbar` ở góc phải dưới đã cung cấp đầy đủ chức năng chuyển vai trò 1-click có badge trực quan.
  - Tinh gọn Navigation chính trên desktop: chỉ hiển thị các liên kết khám phá cốt lõi (Khám phá, Sứ mệnh, Minh bạch, VIP). Nút "Đóng góp" hiển thị dạng CTA rõ ràng.
  - Gom các liên kết nội bộ (Khu kiểm định, Quản trị, Data Map) vào menu dropdown người dùng (User Profile Menu) khi đã đăng nhập.
  - Áp dụng rút gọn tên hiển thị `max-w-[130px] truncate` trên thanh điều hướng để đảm bảo không bao giờ bị tràn.
  - Đảm bảo touch target mobile >= 44px trên cả Drawer và Bottom Navigation Bar.
- **Kết quả:** Đạt (PASS). Header hiển thị cân đối, không đè chữ trên 1440px, 1366px, 430px và 390px.

---

### 2.4. Lỗi P1-02 · Đa ngôn ngữ và lưu giữ trạng thái chuyển vùng
- **Hiện tượng cũ:** Chuyển đổi ngôn ngữ ở một số trang nội bộ bị thiếu nhãn dịch hoặc mất query param.
- **Giải pháp kỹ thuật:**
  - Cập nhật `LanguageSwitcher.tsx` bảo toàn nguyên vẹn URL search parameters khi chuyển đổi giữa 6 locales (`vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`).
  - Hoàn thiện catalog bản dịch đa ngôn ngữ cho toàn bộ các thành phần mới và trạng thái kiểm định.
- **Kết quả:** Đạt (PASS). Chuyển đổi locale tức thì, bảo toàn ngữ cảnh trang hiện tại.

---

### 2.5. Lỗi P1-03 · Đồng bộ Tab Đóng góp và phân lập Bản nháp (Drafts)
- **Hiện tượng cũ:** Chuyển tab đóng góp không đồng bộ vào URL; bản nháp của hai tab và giữa các tài khoản ghi đè lên nhau.
- **Giải pháp kỹ thuật:**
  - Đồng bộ hai chiều giữa URL query (`?tab=existing` và `?tab=candidate`) và giao diện tab qua `handleSwitchTab()` sử dụng `router.replace(..., { scroll: false })`.
  - Phân lập khóa lưu bản nháp theo người dùng và theo tab trong `localStorage`:
    - Tab 1: `ventlore_draft_${userId || 'guest'}_existing`
    - Tab 2: `ventlore_draft_${userId || 'guest'}_candidate`
  - Cả hai tab tự động lưu (auto-save debounce 1000ms) và tự động khôi phục khi mở lại tab hoặc đổi người dùng.
  - Khi nộp thành công ở tab nào, chỉ xóa đúng bản nháp của tab đó.
  - Nút đăng nhập trong banner Guest giữ nguyên ngữ cảnh: `/login?returnTo=/contribute?tab=${activeTab}`.
- **Kết quả:** Đạt (PASS). Hai tab độc lập hoàn toàn, không mất dữ liệu soạn thảo.

---

### 2.6. Lỗi P1-04 & P2 · Ngữ cảnh thanh toán chính xác & Không hiển thị quyền lợi giả lập
- **Hiện tượng cũ:** `PaymentModal` cho phép người dùng tự bấm chuyển tab giữa tip và quyên góp; Tab Quyền lợi đóng góp của tài khoản Member chưa có bài duyệt vẫn hiển thị `OFFERED` cho NFT và mở nút Claim.
- **Giải pháp kỹ thuật:**
  - `PaymentModal.tsx` loại bỏ tab chuyển đổi tự do, thực hiện đúng ngữ cảnh của điểm gọi (Entry Point):
    - Bấm ủng hộ ở Trang chủ / Footer: cố định chế độ `PROJECT` (100% vào quỹ).
    - Bấm Tip ở bài viết: cố định chế độ `POST_TIP` (80% tác giả, 20% quỹ).
    - Bấm mua VIP: cố định chế độ `MEMBERSHIP` ($15/năm).
  - Cập nhật `mock-adapter.ts` và `AccountView.tsx` (Tab 4 Benefits):
    - Khi người dùng có 0 bài viết được phê duyệt (`verifiedContentCount: 0`), hiển thị banner thông báo rõ ràng "Chưa có bài viết nào hoàn tất kiểm định thực địa (0 bài VERIFIED)".
    - Trạng thái SBT, NFT, Tip Route chuyển sang "CHƯA ĐỦ ĐIỀU KIỆN" với nút Claim bị vô hiệu hóa kèm giải thích vì sao chưa nhận được.
    - Chỉ tài khoản tác giả có bài viết đã duyệt (như Minh Hướng Dẫn Viên với PST-000001) mới hiển thị các nút nhận quyền lợi.
  - Bổ sung chức năng Chỉnh sửa Hồ sơ mẫu (Tên hiển thị, Bio) trong Tab 1 của `AccountView.tsx`.
  - Chuyển ngữ toàn bộ thuật ngữ kỹ thuật sang ngôn ngữ người dùng thân thiện:
    - Bỏ các mã `placeId`, `CANDIDATE`, `REVIEW_ONLY`, `UUIDv7`, `409 Conflict`.
    - Thay thế bằng "Địa điểm bạn đã đến", "Đề xuất điểm mới", "Chờ kiểm định thực địa", "Mã định danh", "Nội dung đã được cập nhật phiên bản mới".
- **Kết quả:** Đạt (PASS). Quyền lợi hiển thị trung thực, ngôn ngữ thân thiện.

---

### 2.7. Lỗi P1-05 · Phân quyền Demo cho Không gian Chuyên gia & Quản trị
- **Hiện tượng cũ:** Khách và Thành viên thông thường truy cập `/expert` hoặc `/admin` vẫn nhìn thấy bảng phân công nhiệm vụ và dữ liệu nhạy cảm.
- **Giải pháp kỹ thuật:**
  - `ExpertWorkspaceView.tsx`: Nếu `persona !== 'expert' && persona !== 'admin'`, hiển thị Gate giới thiệu vai trò Thẩm định viên thực địa độc lập, các tiêu chuẩn đạo đức và nút "Trải nghiệm vai trò Chuyên gia Hoàng Kiểm Lâm" hoặc "Đăng nhập".
  - `AdminWorkspaceView.tsx`: Nếu `persona !== 'admin'`, hiển thị Gate giới thiệu thẩm quyền của Ban Quản trị hệ thống và nút "Trải nghiệm vai trò Quản trị viên Linh Admin" hoặc "Quay về Trang chủ".
- **Kết quả:** Đạt (PASS). Bảo vệ quyền hạn nhất quán, người dùng dễ dàng chuyển đổi vai trò để thử nghiệm.

---

## 3. Bảng Kiểm Tra Giao Diện Phản Hồi (Responsive Matrix v1.1)

| Kích thước | Thiết bị mẫu | Trạng thái Header | Trạng thái Tab & Form | Trạng thái Modal |
| :--- | :--- | :--- | :--- | :--- |
| **390px** | iPhone 13/14 | Gọn gàng, logo ivory, menu hamburger mượt mà | Tab co giãn 100%, form cuộn thoải mái không che phím | Bottom Sheet trượt từ đáy màn hình |
| **430px** | iPhone Pro Max | Căn chỉnh lề 16px cân đối, không đè chữ | Nhãn form rõ ràng, ảnh demo preview co giãn | Bottom Sheet cân đối, touch target >= 44px |
| **1366px** | Laptop Standard | Không vỡ hàng, các link căn giữa, user menu gọn | Grid 2 cột cho các khối quyền lợi | Dialog pop-up căn giữa màn hình |
| **1440px** | Desktop Retina | Khoảng cách thoáng đạt, hiển thị tối ưu `max-w-7xl` | Bảng điều khiển Chuyên gia/Admin đầy đủ cột | Dialog pop-up căn giữa màn hình |

---

## 4. Hướng Dẫn Khởi Động & Nghiệm Thu Cục Bộ

Để nghiệm thu trực tiếp toàn bộ các tính năng đã sửa chữa trên trình duyệt:

```bash
# 1. Chạy server phát triển cục bộ
pnpm --filter @ventlore/web dev
```

Mở trình duyệt tại địa chỉ: `http://localhost:3000`

### Các kịch bản kiểm tra khuyến nghị:
1. **Kiểm tra Revision Switching (P0-01):**
   - Truy cập: `/posts/PST-000001`
   - Bấm chuyển đổi giữa "Bản gốc (UNVERIFIED)", "Bản thẩm định (VERIFIED)" và "Bản bổ sung (NEEDS_CHANGES)".
   - Quan sát: Nội dung và trạng thái cập nhật tức thời; nút Tip tự động disable khi chọn bản chưa hoàn tất kiểm định.
2. **Kiểm tra Chặn Guest mua VIP (P0-02):**
   - Đảm bảo đang ở Persona Guest.
   - Bấm vào link VIP (`/vip`) hoặc nút Đăng ký VIP.
   - Quan sát: Modal hiển thị Gate yêu cầu đăng nhập, không có nút thanh toán giả lập cho Guest.
3. **Kiểm tra Tab Đóng góp & Bản nháp (P1-03):**
   - Vào `/contribute`. Bấm chuyển qua lại giữa Tab 1 và Tab 2.
   - Quan sát URL tự động chuyển `?tab=existing` và `?tab=candidate`.
   - Nhập nội dung vào cả hai tab rồi F5; nội dung hai tab được khôi phục riêng biệt.
4. **Kiểm tra Phân quyền Chuyên gia & Quản trị (P1-05):**
   - Khi ở Persona Guest hoặc Member, vào `/expert` và `/admin`.
   - Quan sát màn hình Gate giới thiệu vai trò chuyên gia/admin. Bấm nút trải nghiệm để chuyển nhanh vai trò.
5. **Kiểm tra Quyền lợi Đóng góp (P1-04):**
   - Ở vai trò Member (chưa có bài duyệt): vào `/account?tab=benefits`, quan sát banner thông báo 0 bài duyệt và các nút claim bị vô hiệu hóa.
   - Chuyển sang Persona Tác giả (Minh): vào `/account?tab=benefits`, quan sát 4 khối quyền lợi mở khóa và cho phép claim SBT/NFT.
