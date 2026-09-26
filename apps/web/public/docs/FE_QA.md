# Ventlore · Báo Cáo Đảm Bảo Chất Lượng & Kiểm Thử Front-End (FE QA Report)

Tài liệu này ghi nhận kết quả chạy kiểm thử thực tế, kiểm tra giao diện phản hồi (Responsive), kiểm tra đa ngôn ngữ (6 Locales) và các lỗi đã được sửa chữa trong toàn bộ quá trình phát triển Front-End.

---

## 1. Lệnh Kiểm Tra Thực Tế & Kết Quả

Tất cả các lệnh dưới đây được chạy trực tiếp trong môi trường dự án:

```bash
# 1. Toàn bộ chu trình kiểm tra chất lượng (Verification Pipeline)
pnpm run verify
```

**Kết quả thực tế ghi nhận:**
- **Validator Script (`validate_foundation.py`):**
  - Đạt 34/34 thực thể nghiệp vụ chuẩn hóa.
  - Đạt 10/10 vector băm blockchain `entityKey` khớp tuyệt đối với đặc tả Solidity và TypeScript.
  - Đạt 35/35 màn hình, 50/50 components, 72/72 sự kiện Masterboard.
  - Đạt 14/14 tài sản Brand Kit (Logo, Colors, Tokens, Fonts).
- **TypeScript Typecheck (`pnpm -r run typecheck`):**
  - `packages/domain`: PASS (0 errors)
  - `packages/api-client`: PASS (0 errors)
  - `packages/chain`: PASS (0 errors)
  - `packages/db`: PASS (0 errors)
  - `apps/web`: PASS (0 errors)
  - `apps/worker`: PASS (0 errors)
- **ESLint Linting (`pnpm -r run lint`):**
  - PASS (0 errors). Đã chuẩn hóa toàn bộ dấu ngoặc kép JSX và dependencies của React Hook.
- **Next.js Static Site Generation Build (`pnpm -r run build`):**
  - Tạo thành công **227 trang tĩnh (SSG)** bao phủ toàn bộ các màn hình chính trên 6 ngôn ngữ (`vi`, `en`, `ja`, `zh-Hans`, `ko`, `fr`).

---

## 2. Kiểm Tra Giao Diện Phản Hồi (Responsive Matrix)

Đã kiểm tra bố cục và trải nghiệm tương tác trên các kích thước màn hình tiêu chuẩn:

| Thiết bị / Kích thước | Chiều rộng | Kết quả kiểm tra giao diện |
| :--- | :--- | :--- |
| **Mobile Standard** | 390px (iPhone 12/13/14) | - Menu điều hướng chuyển thành thanh điều hướng dưới đáy (Bottom bar) và drawer trượt.<br>- Bảng bảng việc chuyên gia và công nợ cuộn ngang mượt mà, không tràn khung hình.<br>- `PaymentModal` hiển thị dạng Bottom Sheet trượt lên thuận tiện thao tác một tay.<br>- `ReviewToolbar` thu gọn thành pill nhỏ không che nội dung đọc. |
| **Mobile Large** | 430px (iPhone Pro Max) | - Thẻ điểm đến và nút CTA căn chỉnh cân đối, padding 16px hợp lý.<br>- Form viết bài cuộn mượt mà khi bật bàn phím ảo. |
| **Tablet** | 768px - 1024px (iPad) | - Lưới 2 cột cho các thẻ địa điểm và 4 khối quyền lợi.<br>- Hộp cảnh báo điểm trùng hiển thị đầy đủ nút bấm so sánh. |
| **Desktop Standard** | 1440px (MacBook / PC) | - Bố cục tối đa `max-w-5xl` và `max-w-6xl` căn giữa hoàn hảo.<br>- Bảng điều khiển Admin và Không gian Chuyên gia hiển thị đầy đủ các cột dữ liệu không bị cắt ngắn. |

---

## 3. Kiểm Tra Đa Ngôn Ngữ (6 Locales Verification)

Hệ thống hỗ trợ 6 ngôn ngữ với mã chuẩn repository:
1. **Tiếng Việt (`vi`):** Ngôn ngữ bản địa mặc định, 100% các nhãn, form, thông báo và tài liệu.
2. **Tiếng Anh (`en`):** Bản dịch chuẩn quốc tế cho toàn bộ menu, bộ lọc, thẻ điểm, mô tả và modal thanh toán.
3. **Tiếng Nhật (`ja`):** Đã kiểm tra font chữ Kanji/Kana hiển thị rõ ràng trên các bài khảo sát Cô Tô và Tây Côn Lĩnh.
4. **Tiếng Trung Giản Thể (`zh-Hans`):** Đã kiểm tra định dạng chữ Hán chuẩn mực.
5. **Tiếng Hàn (`ko`):** Đã kiểm tra Hangul cho các bài viết khám phá.
6. **Tiếng Pháp (`fr`):** Đã kiểm tra đầy đủ các ký tự dấu thanh tiếng Pháp.

---

## 4. Nhật Ký Các Lỗi Đã Được Tự Động Sửa Chữa (Bug Fixes)

1. **Lỗi `RevisionItemSummaryDTO` thiếu `title` và `accessTier`:** Đã cập nhật phương thức `submitRevision` trong `mock-adapter.ts` bổ sung đầy đủ trường dữ liệu.
2. **Lỗi unescaped quotes trong `PublicLedger.tsx`:** Thay thế các dấu ngoặc kép trích dẫn trong văn bản JSX thành mã thực thể `&ldquo;` và `&rdquo;` để tuân thủ quy tắc `react/no-unescaped-entities`.
3. **Lỗi guard session null trong `AccountView.tsx` và `ContributeView.tsx`:** Bổ sung điều kiện kiểm tra an toàn `if (persona === 'guest' || !session)` để TypeScript thu hẹp kiểu chính xác và loại bỏ toàn bộ lỗi `TS18047`.
4. **Đồng bộ hóa Enum `ContributionType` và `PayableStatus`:** Sửa các giá trị không khớp trong dropdown form sang đúng bộ enum chuẩn của `@ventlore/domain` (`DISCOVERY`, `GUIDE`, `EXPERIENCE` và `OPEN`, `PAID`).

---

## 5. Các Hạng Mục Tạm Dừng (SKIPPED / BLOCKED)

- **Ký chữ ký Web3 thực (Personal Sign / EIP-712):** Theo chỉ dẫn bất biến kiến trúc, giai đoạn FE-First **tuyệt đối không yêu cầu người dùng ký thật** hoặc gửi giao dịch chuyển tiền thật lên mạng blockchain. Mọi luồng ký consent, claim SBT/NFT và thanh toán đều chạy qua bộ mô phỏng có nhãn DEMO minh bạch.
- **Kết nối cơ sở dữ liệu thật (PostgreSQL RPC):** Không triển khai database trong giai đoạn này; toàn bộ dữ liệu mẫu nhất quán được duy trì trong bộ nhớ client adapter.
