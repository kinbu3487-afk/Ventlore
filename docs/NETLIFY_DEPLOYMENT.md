# Hướng Dẫn Đóng Gói và Triển Khai Ventlore Trên Netlify

Tài liệu này hướng dẫn chi tiết các phương án đóng gói và đưa ứng dụng Web Ventlore (`apps/web` - Next.js 15) lên nền tảng **Netlify**.

---

## 1. Phương án 1: Kéo thả thủ công qua Netlify Drop (Nhanh nhất & Trực tiếp)

Phương án này phù hợp nhất để xem demo, đánh giá UI ngay lập tức mà không cần kết nối tài khoản GitHub hoặc cấu hình server:

### Bước 1: Tạo gói đóng gói tĩnh
Chạy lệnh sau tại thư mục gốc của repository:

```bash
pnpm run package:netlify
```

Lệnh này sẽ tự động:
- Biên dịch ứng dụng Next.js sang chế độ static export (`STATIC_EXPORT=true`).
- Xuất toàn bộ 30 trang HTML, CSS, JS, phông chữ `Be Vietnam Pro` và tài sản thương hiệu vào thư mục `apps/web/out/`.
- Tự động bổ sung tệp cấu hình điều hướng `_redirects` cho Netlify.
- Nén toàn bộ thành tệp lưu trữ:  
  **`dist/ventlore-netlify-drop.zip`** (Dung lượng xấp xỉ ~3.3 MB).

### Bước 2: Tải lên Netlify
1. Mở trình duyệt và truy cập: **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
2. Kéo và thả tệp **`dist/ventlore-netlify-drop.zip`** (hoặc kéo cả thư mục `apps/web/out/`) vào khung nét đứt "Drag and drop your site output folder here".
3. Netlify sẽ tải lên trong vài giây và cấp ngay một đường link công khai (ví dụ: `https://ventlore-demo-xxxxxx.netlify.app`).
4. Bạn có thể mở link này trên điện thoại hoặc máy tính để đánh giá UI.

---

## 2. Phương án 2: Triển khai qua Netlify CLI

Nếu bạn đã cài đặt Netlify CLI trên máy:

```bash
# 1. Đóng gói static export
pnpm run package:netlify

# 2. Deploy preview lên Netlify
npx netlify deploy --dir=apps/web/out

# 3. Hoặc deploy trực tiếp lên Production
npx netlify deploy --dir=apps/web/out --prod
```

---

## 3. Phương án 3: Kết nối Git Repository (CI/CD Tự Động)

Repository đã được trang bị sẵn tệp **`netlify.toml`** ở thư mục gốc để tương thích hoàn toàn với kiến trúc monorepo của pnpm:

```toml
[build]
  base = ""
  publish = "apps/web/.next"
  command = "pnpm --filter @ventlore/web build"

[build.environment]
  NODE_VERSION = "20.18.0"
  PNPM_VERSION = "9.15.4"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Các bước thiết lập trên Netlify Dashboard:
1. Đăng nhập vào [Netlify](https://app.netlify.com/), chọn **Add new site** > **Import an existing project**.
2. Chọn nhà cung cấp Git (GitHub) và chọn repository `Ventlore`.
3. Netlify sẽ tự động nhận diện tệp `netlify.toml` ở root:
   - **Base directory:** để trống hoặc `.` (thư mục gốc).
   - **Build command:** `pnpm --filter @ventlore/web build`
   - **Publish directory:** `apps/web/.next`
4. Bấm **Deploy Ventlore**. Netlify sẽ tự động kích hoạt plugin `@netlify/plugin-nextjs` v5 để chạy Next.js 15 trên Netlify Edge & Serverless functions.

---

## 4. Các điểm lưu ý kỹ thuật khi chạy trên Netlify
- **SPA Routing & Direct Links:** Tệp `apps/web/public/_redirects` đã cấu hình luật `/* /index.html 200` để đảm bảo khi người dùng tải lại trang (F5) hoặc truy cập trực tiếp các đường link con (`/explore`, `/vip`, `/transparency`, `/posts/...`) thì Netlify không báo lỗi 404.
- **Tài sản tĩnh & Font chữ:** Đã cấu hình header `Cache-Control: public, max-age=31536000, immutable` cho `/fonts/*` và `/brand/*` giúp tải trang tức thì và mượt mà.
