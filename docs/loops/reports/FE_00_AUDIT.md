# Báo Cáo Kiểm Tra Nền Tảng & Rà Soát FE (FE-00)

**Thời điểm thực hiện:** 26/09/2026  
**Phạm vi:** Repository Ventlore Front-End (`apps/web`, `packages/api-client`, `packages/domain`)  
**Người thực hiện:** AI Assistant (Antigravity) theo chỉ dẫn `Ventlore_Prompt_FE_First_v1_0.md`  

---

## 1. Kết Quả Kiểm Tra Nền Tảng (Baseline Verification)
- **Kiểm tra Foundation ID Contract:** `python3 scripts/validate_foundation.py` -> **PASS 100%** (34/34 thực thể, 10/10 blockchain keyKind, namespace/receiptKey chính xác, 35 màn hình S01-S35, 50 components C01-C50, 72 sự kiện U01-U12).
- **TypeScript Typecheck:** `pnpm -r run typecheck` trên toàn bộ 6 workspace projects -> **PASS**.
- **Lint:** `pnpm -r run lint` -> **PASS**.
- **Next.js Production Build:** `pnpm -r run build` -> **PASS** (199 static/SSG pages xuất bản thành công).

---

## 2. Bảng Rà Soát Bề Mặt (Có Sẵn vs Cần Bổ Sung)

| Bề mặt / Trang | Route hiện tại | Tình trạng | Kế hoạch hoàn thiện đợt FE First |
|---|---|---|---|
| **Home** | `/[locale]` | Đã có single-hero, 2 CTA | Cập nhật `ContributeDialog`: tách rõ Đóng góp bài, Đề xuất điểm mới, Tham gia kiểm định, và nút "Ủng hộ Ventlore" mở `PaymentModal` mode PROJECT. |
| **Explore** | `/[locale]/explore` | Đã có tìm kiếm, bộ lọc vùng/hoạt động, map/list | Hoàn thiện trạng thái rỗng/lỗi, giữ query params qua Back/reload và đổi ngôn ngữ. |
| **Place Detail** | `/[locale]/places/[placeId]` | Đã có chi tiết, cảnh báo an toàn, banner sáp nhập, danh sách bài | Chuẩn hóa card bài viết, phân định rõ bài public vs VIP, nút dẫn sang đóng góp bài mới tại điểm. |
| **Post / Revision** | `/[locale]/posts/[postId]` | Đã có xem bài, đổi revision, claims, inspector notes, AccessGate VIP | Bổ sung nút **Ủng hộ tác giả** (mở `PaymentModal` mode POST_TIP kèm tỷ lệ 80/20) và nút **Báo sai / Khiếu nại** (mở `ReportDialog` gắn đúng revisionId/claimId). |
| **People / Profile** | `/[locale]/people/[handle]` | Đã có hồ sơ công khai, danh sách bài viết, chứng nhận SBT | Tách bạch rõ bài đã viết vs bài tham gia kiểm định; bổ sung khối hiển thị Author NFT. |
| **Đăng nhập (Login)** | `/[locale]/login` | Đã có SocialLogin và persona switcher | Giữ nguyên returnUrl nội bộ; bổ sung thông báo rõ ràng về trạng thái Google OAuth (chưa cấu hình BE) và demo login 5 personas. |
| **Tài khoản cá nhân (Account)** | *Chưa có route riêng* | **CẦN TẠO MỚI** `/[locale]/account` | Tạo trang My Account gồm 5 tabs: Hồ sơ cá nhân, Đóng góp của tôi (My Contributions), Gói VIP, Quyền lợi đóng góp (SBT, NFT, Tip Route), Lời mời & Nhiệm vụ cá nhân. |
| **Khu đóng góp (Contribute)** | *Chưa có route riêng* | **CẦN TẠO MỚI** `/[locale]/contribute` | Tạo trình soạn thảo đóng góp: Tab 1 Viết bài ở điểm có sẵn, Tab 2 Đề xuất điểm mới (kèm cảnh báo phát hiện điểm trùng, preview, lưu nháp, gửi demo). |
| **Khu kiểm định (Expert)** | *Chưa có route riêng* | **CẦN TẠO MỚI** `/[locale]/expert` | Tạo không gian làm việc chuyên gia: Bảng nhiệm vụ (Offered, Accepted, Doing, Submitted, Needs-more), Drawer chi tiết nhiệm vụ, Form nộp bằng chứng kiểm định, Bảng công phải nhận (Payables). |
| **Khu quản trị (Admin)** | *Chưa có route riêng* | **CẦN TẠO MỚI** `/[locale]/admin` | Tạo bảng điều hành Admin: Tiếp nhận đề xuất & báo sai, Quản lý ca kiểm định, Giao việc, Nghiệm thu công việc (ACCEPTED_WORK), Ra quyết định nội dung (APPROVED/REJECTED), Phân bổ ngân sách & chi trả công việc demo. |
| **Thanh toán (PaymentModal)** | *Chưa có* | **CẦN TẠO MỚI** | Modal thanh toán dùng chung cho 4 điểm vào với 3 chế độ (`PROJECT`, `POST_TIP`, `MEMBERSHIP`). Tích hợp đọc ví, mô phỏng thanh toán có nhãn rõ ràng, tính toán đơn vị nguyên tử (atomic units). |
| **Báo sai (ReportDialog)** | *Chưa có* | **CẦN TẠO MỚI** | Modal khiếu nại/báo sai gắn liền với cặp `(revisionId, claimId)` cụ thể, lưu trữ demo và hiển thị bên Admin. |
| **Review Toolbar / Scenario Picker** | *Chưa có* | **CẦN TẠO MỚI** | Thanh công cụ review tiện dụng ở góc màn hình (dễ ẩn/hiện) cho phép chọn nhanh 14 kịch bản nghiệm thu của Bin. |

---

## 3. Rà Soát Lớp Dữ Liệu & Adapter (`packages/api-client`)

Hiện tại `VentloreMockAdapter` có dữ liệu tĩnh phong phú cho places, posts, revisions, users, vip plans, ledger.
Tuy nhiên, để các hành trình có tính liên kết thực sự qua lại giữa các vai trò (ví dụ: Tác giả nộp bài -> Admin nhìn thấy trong Tiếp nhận -> Admin giao việc cho Expert -> Expert nộp bằng chứng -> Admin nghiệm thu công và duyệt/bác bài -> Tác giả thấy trạng thái cập nhật), adapter cần bổ sung:

1. **Reactive in-memory store:** Lưu trữ các mutation demo trong bộ nhớ (hỗ trợ lưu nháp vào `localStorage` cho draft).
2. **Các phương thức mutation demo chuẩn hóa:**
   - `submitContributionPost(data)`: Tạo bài mới hoặc revision mới với UUIDv7 canonical.
   - `proposeCandidatePlace(data)`: Tạo đồng thời `placeId` (CANDIDATE) + `postId` (DISCOVERY) + `revisionId` (REVIEW_ONLY).
   - `submitReport(data)`: Tạo bản ghi `reportId` đính kèm revision.
   - `acceptExpertTask(taskId)` / `declineExpertTask(taskId)`
   - `submitExpertEvidence(taskId, evidence)`: Tạo `submissionId`.
   - `adminAcceptWork(taskId, outcome, reason)`: Tạo `acceptanceId` và `payableId`.
   - `adminDecideContent(caseId, outcome, notes, scope)`: Tạo `decisionId`.
   - `recordPayment(kind, payload)`: Tạo `donationId` hoặc `paymentId`, cập nhật trạng thái VIP nếu là MEMBERSHIP.
   - `claimCredential(credentialId)` / `claimCollectible(collectibleId)`: Cập nhật sang trạng thái ISSUED demo.
   - `toggleAppHold(revisionId, isHold)`: Đặt cờ tạm dừng hiển thị bài và tip.
3. **Mở rộng Persona:** Bổ sung persona `admin` (Linh Quản Trị Viên) bên cạnh `guest`, `member`, `author`, `vip`, `expert`.

---

## 4. Kế Hoạch Triển Khai Tiếp Theo
- **FE-01:** Hoàn thiện AppShell, tokens, locale 6 thứ tiếng, các trang đọc cốt lõi (Home, Explore, Place, Post, People) với đầy đủ CTA mở PaymentModal, ReportDialog.
- **FE-02:** Xây dựng trang `/login`, `/account` (đủ 5 tabs), và `/contribute` (soạn bài & điểm mới).
- **FE-03:** Hoàn thiện `PaymentModal` (3 chế độ), tích hợp mô phỏng ví và 4 khối quyền lợi.
- **FE-04:** Xây dựng không gian làm việc `/expert` và `/admin` với luồng nghiệm thu độc lập hai quyết định.
- **FE-05:** Scenario Switcher (14 kịch bản), kiểm thử responsive/i18n, chạy verify.
- **FE-06:** Hoàn thiện bộ tài liệu bàn giao `FE_DATA_MAP.md`, `FE_COVERAGE.md`, `FE_REVIEW.md`, `FE_HANDOFF.md`, `FE_QA.md`.
