# Ventlore — vận hành 5 loop trên repository hiện có

Hướng dẫn thực hành cho Bin · 24/09/2026 · Phiên bản 2

Repository: https://github.com/kinbu3487-afk/Ventlore

## 1. Điểm xuất phát và kết quả cần đạt

Ảnh mới nhất cho thấy dự án có `AGENTS.md`, `apps/`, `contracts/`, `packages/`, `scripts/`, `package.json`, `pnpm-workspace.yaml` và bộ tài liệu trong `docs/`. Ảnh trước xác nhận đã push nhánh `main` thành công. Ảnh thư mục chưa chứng minh ứng dụng chạy được, kiểm thử đã đạt hay GitHub Actions đã được cấu hình.

Hướng dẫn này nối quy trình làm việc vào cấu trúc hiện có. Antigravity cần kiểm tra nội dung repo trên máy Bin trước khi thay đổi. Không có bước cài đặt nào trong repo của Bin đã được thực hiện chỉ bằng việc soạn hướng dẫn này.

Mục tiêu đầu tiên: một nhiệm vụ có tiêu chí rõ ràng đi qua đủ các bước **giao việc → code → kiểm thử → sửa lỗi → review → Bin nghiệm thu → hợp nhất**; tiến độ và bằng chứng vẫn còn sau khi đóng phiên chat.

| Loop | Cách triển khai ban đầu | Điều kiện kết thúc |
| --- | --- | --- |
| Execution | Antigravity đọc yêu cầu, sửa code và chạy công cụ trong một nhiệm vụ. | Có thay đổi và kết quả công cụ, hoặc có điểm bị chặn. |
| Task | Antigravity đối chiếu tiêu chí, đọc lỗi local/CI/review rồi sửa. | Đạt tiêu chí với bằng chứng; hoặc dừng ở `blocked` khi hết giới hạn. |
| Product | GitHub Issues giữ hàng đợi; mỗi lượt chỉ lấy một Issue `ready`; PR bàn giao thay đổi. | Bin nghiệm thu và merge; phản hồi mới trở thành Issue mới. |
| System | Đọc lịch sử các lần chạy, thử một thay đổi về prompt/quy tắc/công cụ và so sánh. | Có quyết định áp dụng hoặc giữ cấu hình cũ dựa trên kết quả. |
| Oversight | Bin chốt mục tiêu, phạm vi, quyền của agent và tiêu chí nghiệm thu. | Quyết định được ghi lại; thay đổi được chấp nhận hoặc gửi lại để sửa. |

Trong cấu hình này, Bin kích hoạt từng lượt công việc. Agent có thể tự code, kiểm tra và sửa trong lượt được giao. Việc tạo các file Markdown chưa tạo ra một dịch vụ tự chạy liên tục. ChatGPT, Gemini và Antigravity chưa tự chuyển tài liệu cho nhau.

## 2. Phân vai và nguồn thông tin chung

| Thành phần | Việc chính |
| --- | --- |
| Bin | Chọn việc, chốt spec, kiểm tra bản chạy thử, quyết định merge/phát hành. |
| ChatGPT | Giúp viết spec, chia việc, tổng hợp các vấn đề và kết quả sản phẩm. |
| Antigravity | Làm việc trực tiếp trên repo, chạy kiểm tra, đọc CI, sửa lỗi và tạo PR. |
| GitHub Issues | Giữ yêu cầu, ưu tiên và trạng thái của từng nhiệm vụ. |
| GitHub Actions | Chạy bộ kiểm tra đã cấu hình trên thay đổi được gửi lên. |
| Gemini | Phản biện spec hoặc review gói thay đổi khi cần. |
| Claude Code, nếu đã có | Reviewer riêng đọc spec, diff và kết quả test của một commit cụ thể. |

Một **Issue** là một bản giao việc. Một **PR — Pull Request** là gói thay đổi đề nghị hợp nhất vào `main`. **CI** là kiểm tra tự động trên GitHub. **Merge** là đưa thay đổi đã nghiệm thu vào nhánh chung.

Tận dụng tài liệu đang có:

| File | Vai trò trong quy trình |
| --- | --- |
| `AGENTS.md` | Quy tắc chung và chỉ dẫn đọc đúng tài liệu trước khi làm. |
| `docs/DOMAIN_RULES.md`, `ID_CONTRACT.md`, `PERMISSIONS.md`, `STATE_MACHINES.md` | Ràng buộc nghiệp vụ, ID, quyền và trạng thái. |
| `docs/PROJECT_STATE.md` | Trạng thái triển khai thật: đã có, đã kiểm chứng, còn thiếu. |
| `docs/HANDOFF.md` | Bàn giao hiện tại, nhánh/commit/PR, lệnh chạy và việc tiếp theo. |
| `docs/DECISIONS.md` | Quyết định đã chốt, lý do và phạm vi áp dụng. |
| `docs/OPEN_QUESTIONS.md` | Câu hỏi chưa được chốt; không tự biến thành giả định sản phẩm. |
| `docs/source/` | Tài liệu nguồn hiện hành. |

Các tên trên được nhìn thấy trong ảnh; nội dung phải được Agent đọc tại máy Bin. Các bảng coverage và `validation-report.json` chỉ có ý nghĩa theo phép kiểm tra thực sự tạo ra chúng; không mặc định đó là kết quả kiểm thử ứng dụng.

## 3. Bước 1 — kết nối GitHub CLI

Trong terminal tại dự án, kiểm tra:

```bash
gh --version
gh auth status
```

Nếu chưa có `gh`, nhờ Antigravity kiểm tra macOS và cách cài phù hợp theo https://cli.github.com/. Nếu máy đã có Homebrew hoạt động, có thể dùng `brew install gh`. Việc `git push` thành công chưa tự xác nhận GitHub CLI đã đăng nhập.

Nếu CLI chưa đăng nhập đúng tài khoản, thực hiện:

```bash
gh auth login --web --git-protocol https
gh auth setup-git
gh auth status
```

Hoàn thành đăng nhập trong trình duyệt. Sau đó xác nhận quyền truy cập đúng repo:

```bash
gh repo view kinbu3487-afk/Ventlore
```

**Xong bước này khi:** Antigravity có thể đọc Issue/PR và kết quả CI của đúng repository qua CLI. Không gửi token đăng nhập vào chat hoặc commit.

## 4. Bước 2 — chạy một lần nhiệm vụ LOOP-00

Mở thư mục Ventlore trong Antigravity và dán nguyên prompt sau. Đây là nhiệm vụ thiết lập quy trình, không phải lệnh viết lại ứng dụng.

```text
Thực hiện LOOP-00: thiết lập quy trình 5 loop cho repository Ventlore đang mở.
GitHub: https://github.com/kinbu3487-afk/Ventlore

1. Đọc AGENTS.md, README, package.json, pnpm-workspace.yaml, cấu hình package manager/lockfile và các tài liệu trong docs, đặc biệt PROJECT_STATE, HANDOFF, DECISIONS, OPEN_QUESTIONS, DOMAIN_RULES, ID_CONTRACT, PERMISSIONS và STATE_MACHINES.
   Kiểm tra Git, nhánh, thay đổi chưa commit, Node.js, pnpm, gh và đăng nhập GitHub.
   Xác định phần ứng dụng nào đã chạy thật, phần nào mới là scaffold/tài liệu và những kiểm thử hiện có.
   Bảo toàn file, lịch sử và thay đổi hiện có; phân biệt thay đổi có sẵn với thay đổi của nhiệm vụ này trong báo cáo.

2. Làm trên nhánh chore/loop-setup hoặc tiếp tục đúng nhánh setup đã có. Kiểm tra nhánh nền và các PR đang mở để không tạo việc trùng. Giữ stack và pnpm workspace hiện có nếu cấu hình xác nhận điều đó.

3. Bổ sung một mục ngắn trong AGENTS.md dẫn đến quy trình chung. Hợp nhất, không ghi đè hướng dẫn hiện có. Tạo hoặc cập nhật:
   - docs/loops/POLICY.md
   - docs/loops/RUN_TASK.md
   - docs/loops/SYSTEM_REVIEW.md
   - docs/loops/REPORT_TEMPLATE.md
   - thư mục docs/loops/reports để lưu báo cáo từng lần chạy
   - mẫu GitHub Issue và mẫu PR trong .github
   Giữ PROJECT_STATE, HANDOFF và DECISIONS hiện có làm nguồn trạng thái/quyết định; tránh tạo nguồn song song mâu thuẫn.

4. Policy cho giai đoạn đầu:
   - Mỗi lượt chỉ xử lý một Issue đã được Bin chốt và gắn ready.
   - Một Issue có một nhánh/PR đang xử lý; tiếp tục lượt cũ nếu có.
   - Tiêu chí nghiệm thu phải kiểm chứng được và giữ ổn định trong lượt chạy.
   - Được đọc/sửa file dự án, cài dependency trong repo, chạy kiểm tra, commit, push nhánh, tạo/cập nhật Issue và PR trong phạm vi nhiệm vụ.
   - Dừng ở review để Bin nghiệm thu; merge, phát hành và giao dịch tiền thật thuộc quyết định riêng của Bin.
   - Tối đa ba vòng sửa sau lần triển khai đầu, tính cả phản hồi local, CI và reviewer. Nếu không tiến triển hoặc thiếu quyền/đầu vào, ghi blocked và lưu tiến độ.
   - Không gỡ kiểm tra, thêm skip hoặc hạ tiêu chí chỉ để có kết quả xanh. Test sai cần có lý do và bằng chứng sửa; thay tiêu chí cần Bin chốt.
   - Dùng UUID nghiệp vụ theo ID_CONTRACT; ID quản lý Issue không thay taskId của sản phẩm Ventlore.

5. Thiết lập lệnh kiểm tra gốc pnpm run verify phù hợp với code thực có: lint, typecheck, các test cần thiết và build.
   Giữ và gọi đúng lệnh hiện có; bổ sung phần còn thiếu có ý nghĩa. Liệt kê rõ phạm vi kiểm tra và phần chưa được triển khai.
   Không tạo script/test rỗng để báo đạt. Không coi kiểm tra tài liệu/coverage là kiểm thử backend hay contract.
   Với luồng web đã chạy, giữ công cụ E2E hiện có hoặc bổ sung kiểm tra trình duyệt cho luồng đọc chính nếu còn thiếu.

6. Tạo/hợp nhất .github/workflows/quality.yml:
   - Chạy khi PR vào main và khi main có thay đổi.
   - Dùng Node và pnpm tương thích với repo; cài theo lockfile đã commit.
   - Chạy cùng lệnh verify, cấu hình browser/test services nếu thực sự cần.
   - Có timeout cho job, hủy lượt CI cũ của cùng PR và lưu log/báo cáo cần thiết.
   - Kiểm tra thất bại phải làm CI thất bại.
   - Chỉ kiểm tra; không tự triển khai hay gọi model để sửa code.
   Nếu thiếu ứng dụng, test, dịch vụ hoặc cấu hình thì báo rõ; không tuyên bố toàn hệ thống đã được kiểm thử.

7. Tạo hoặc dùng các nhãn Issue: backlog, ready, in-progress, review, blocked.
   Issue được đóng sau khi Bin nghiệm thu và thay đổi được merge. Mỗi Issue chỉ có một nhãn trạng thái đang hoạt động.
   Dùng mẫu Issue gồm mục tiêu, trong/ngoài phạm vi, tài liệu nguồn, phụ thuộc, tiêu chí nghiệm thu và cách kiểm tra.
   Mẫu PR phải dẫn đến Issue và ghi kết quả thực tế, phần chưa kiểm tra, commit/CI run liên quan và cách mở bản thử.

8. Chạy kiểm tra local, push nhánh và tạo PR thiết lập. Theo dõi CI và sửa trong giới hạn nêu trên.
   Cập nhật PROJECT_STATE và HANDOFF theo bằng chứng. Báo đúng lệnh đã chạy, kết quả, URL PR, link CI, tên check cần bảo vệ và điểm bị chặn.
   Chuẩn bị hướng dẫn bảo vệ main bằng PR + required checks phù hợp với repo, để tôi xem và thiết lập sau khi check đã chạy.
   Bàn giao và dừng ở review; chưa tự lấy nhiệm vụ sản phẩm tiếp theo.
```

**Xong LOOP-00 khi:** có PR thiết lập, lệnh kiểm tra local chạy thật, GitHub có lần chạy CI với phạm vi được nêu rõ, và báo cáo chỉ ra phần còn thiếu. Bin đọc PR và merge khi đồng ý. Nếu CI đỏ hoặc setup bị chặn, giữ nhiệm vụ đó để sửa trước.

Antigravity hiện hỗ trợ `AGENTS.md` làm quy tắc theo thư mục, nên có thể tận dụng file đang có. Nếu dùng thêm `.agents/rules/*.md`, mỗi file cần frontmatter đúng, ví dụ `trigger: always_on`; đừng chỉ chép file vào rồi mặc định agent đã nạp. Với phiên bản IDE khác, kiểm tra Rules trong Customizations.

## 5. Bước 3 — bảo vệ main và chọn nhiệm vụ thử

Sau khi PR setup đã được merge, thiết lập bảo vệ `main` trong phần Settings của repo, qua Rules/Rulesets hoặc Branch protection tùy giao diện:

1. Áp dụng quy tắc cho `main`.
2. Yêu cầu thay đổi đi qua PR.
3. Yêu cầu những status check thực tế vừa chạy phải đạt; chọn đúng tên Agent đã báo.
4. Với mô hình một người, không bắt buộc một lượt approve từ tài khoản khác nếu chưa có người đó. Bin vẫn đọc PR, kiểm tra bản thử và chủ động merge khi đạt. Đánh giá của một chatbot không tự tạo thành GitHub approval hợp lệ.

Đây là bước cấu hình sau khi đã biết check nào chạy thật. Không tự đổi ruleset để vượt kiểm tra đang thất bại.

Nhiệm vụ thử phù hợp với tiến độ hiện tại là **“Nghiệm thu FE-01: Khám phá → Địa điểm → Bài viết”**. Đây là kiểm tra bản Antigravity vừa làm và sửa lỗi tìm thấy trong phạm vi đó.

Tạo Issue bằng mẫu mới, hoặc dán prompt:

```text
Tạo hoặc cập nhật đúng một GitHub Issue “Nghiệm thu FE-01: Khám phá → Địa điểm → Bài viết”; nếu đã có Issue tương đương thì dùng lại.

Mục tiêu: kiểm chứng luồng frontend hiện có với dữ liệu mẫu và sửa các sai lệch trong phạm vi FE-01 đã giao.

Tiêu chí nghiệm thu:
1. Guest đọc được nội dung public mà không cần đăng nhập/kết nối ví.
2. Tìm kiếm và bộ lọc hoạt động cho kết quả đúng theo fixture; không có kết quả thì hiển thị trạng thái rõ ràng.
3. Mở địa điểm rồi mở bài giữ đúng quan hệ placeId/postId/revisionId; ID nhất quán với fixture.
4. Tải lại URL bài khôi phục đúng bài và phiên bản. ID không tồn tại hoặc revision không thuộc bài không hiển thị nhầm nội dung.
5. Nhãn kiểm tra thể hiện đúng phiên bản/phạm vi; dữ liệu mẫu được ghi rõ là minh họa.
6. Luồng chính dùng được ở desktop và mobile theo Brand Guide.
7. Các kiểm tra bắt buộc trong verify đạt; những tiêu chí chưa tự động hóa có bằng chứng kiểm tra trình duyệt.

Phạm vi: frontend với dữ liệu mẫu; giữ nghiệp vụ, stack và cấu trúc đang có. Backend, OAuth thật, thanh toán và onchain thuộc các nhiệm vụ riêng.
Đọc PROJECT_STATE và HANDOFF để xác định phụ thuộc. Nếu đủ đầu vào thì gắn ready; nếu phần frontend chưa có thì gắn blocked, ghi phụ thuộc cụ thể. Chưa thực hiện code trong lượt tạo Issue này.
```

Mã FE-01 là mã nhiệm vụ phát triển đang trao đổi; không tạo thêm một hệ ID nghiệp vụ trong ứng dụng.

## 6. Bước 4 — chạy Execution + Task + Product loop

Khi có Issue `ready`, dán prompt sau. Sau mỗi nhiệm vụ đã nghiệm thu, dùng lại prompt này để lấy việc tiếp theo.

```text
Đọc AGENTS.md, docs/loops/POLICY.md, RUN_TASK.md, PROJECT_STATE và HANDOFF.

Thực hiện một chu kỳ Product loop trên kinbu3487-afk/Ventlore:
- Ưu tiên tiếp tục Issue/PR đang làm dở nếu đúng nhiệm vụ và chưa có agent khác xử lý.
- Nếu không có việc đang làm, chọn đúng một Issue ready theo ưu tiên Bin đã chốt và đã đủ phụ thuộc. Không có việc phù hợp thì dừng.
- Xác nhận Issue, tiêu chí nghiệm thu và nhánh sẽ dùng; cập nhật in-progress.
- Đọc các tài liệu nghiệp vụ liên quan; thực hiện phần code cần thiết.
- Chạy kiểm tra local và đối chiếu từng tiêu chí.
- Push nhánh, tạo/cập nhật PR liên kết Issue và đọc kết quả GitHub Actions.
- Nếu lỗi, đọc log, sửa nguyên nhân và kiểm tra lại. Tổng tối đa ba vòng sửa sau lần triển khai đầu.
- Nếu hết giới hạn, thiếu đầu vào hoặc không tiến triển, cập nhật blocked, lưu tiến độ và nêu điều cần quyết định.
- Nếu đạt, cập nhật review; ghi báo cáo, PROJECT_STATE và HANDOFF; đưa link PR, CI và cách mở bản thử.

Tôi cho phép sửa code trong phạm vi Issue, chạy kiểm tra, commit/push nhánh, tạo/cập nhật Issue và PR. Dừng để tôi nghiệm thu trước merge và trước khi lấy Issue tiếp theo.
```

Việc xử lý phản hồi local và CI trong cùng lượt là Task loop. Không bắt đầu một task mới để che lỗi của task hiện tại. Nếu agent đã dừng phiên trong lúc đợi CI, Bin có thể tiếp tục bằng:

```text
Tiếp tục đúng Issue/PR đang ghi trong HANDOFF. Đọc CI của commit mới nhất, sửa các lỗi trong phạm vi đã chốt, kiểm tra lại và cập nhật báo cáo. Giữ bộ đếm các vòng sửa đã dùng; không tạo nhánh hoặc Issue trùng.
```

GitHub Actions chạy các bước đã viết trong workflow. Trong cấu hình này, workflow không tự gọi Antigravity; việc đọc CI/sửa do phiên agent đang được giao nhiệm vụ thực hiện.

## 7. Bước 5 — review và nghiệm thu

Chuẩn bị gói review gồm: Issue/spec đã chốt, diff của PR, tài liệu nghiệp vụ liên quan, mã commit, log CI và kết quả kiểm tra trình duyệt. Nếu reviewer không có quyền đọc repo, gửi chính các file/diff/log cần thiết; một đường link hoặc ảnh thư mục không đủ để review code.

Dùng Claude Code nếu đã có, hoặc phiên review riêng trong công cụ đang dùng. Gemini có thể đọc gói tài liệu được cung cấp. Khi review, giữ bản code cố định và không để reviewer đồng thời sửa thư mục mà Antigravity đang làm.

Prompt cho reviewer:

```text
Review thay đổi này theo spec và commit được cung cấp. Chỉ đọc và báo cáo, chưa sửa code.

Ưu tiên: lỗi chức năng, quan hệ ID, phân quyền nếu có, trạng thái và các trường hợp biên.
Mỗi phát hiện gồm: file/vị trí, điều kiện xảy ra, hành vi mong đợi/thực tế, ảnh hưởng, bằng chứng và cách tái hiện hoặc test phân biệt.
Tách lỗi có bằng chứng khỏi nghi vấn cần xác minh. Nếu không có lỗi rõ ràng, nêu phạm vi đã review và phần chưa thể kiểm tra.
Không suy ra backend hay smart contract đã đúng từ frontend fixture hoặc kết quả kiểm tra tài liệu.
```

Nếu có lỗi, giao Antigravity xác minh bằng tình huống tái hiện, sửa phần có căn cứ rồi chạy lại kiểm tra. Nếu nhận định khác nhau, dùng test hoặc bằng chứng thực tế để phân xử. Các vấn đề vượt phạm vi trở thành Issue riêng, không tự mở rộng task.

**Bin nghiệm thu bằng ba nhóm bằng chứng:**

- Tiêu chí của Issue được đối chiếu đầy đủ; mọi phần thiếu được nêu rõ.
- CI của phiên bản mới nhất đạt, các phát hiện quan trọng đã được xử lý/giải quyết, không có thay đổi code chưa được kiểm tra sau review.
- Bản chạy thử thực hiện được luồng Bin mong muốn. `localhost` chỉ là bản chạy trên máy đang phục vụ ứng dụng; muốn người khác xem cần một bản preview riêng.

Khi đồng ý, Bin merge PR vào `main`. Nếu PR có từ khóa đóng Issue đúng và được merge vào nhánh mặc định, GitHub có thể đóng Issue liên kết; kiểm tra trạng thái và đóng thủ công nếu cần. Gỡ nhãn trạng thái đang làm và lưu kết quả nghiệm thu. Phản hồi sử dụng tiếp theo được ghi thành Issue mới rồi Bin quyết định khi nào chuyển `ready`.

## 8. Báo cáo cần lưu sau mỗi nhiệm vụ

`docs/loops/reports/` giữ các báo cáo riêng theo Issue và lần chạy; `HANDOFF.md` trỏ đến báo cáo mới nhất. Không dùng một file luôn ghi đè để thay toàn bộ lịch sử.

| Trường | Nội dung |
| --- | --- |
| Nhiệm vụ | Issue URL, tiêu chí và tài liệu nguồn đã dùng. |
| Phiên bản | Nhánh, commit code được kiểm tra, PR URL, CI run liên quan. |
| Kết quả | Những gì đã làm và kết quả từng tiêu chí: đạt/chưa đạt/chưa kiểm tra. |
| Kiểm tra | Lệnh thật, kết quả thật, bằng chứng trình duyệt khi cần. |
| Số vòng sửa | Tổng lượt sửa và nguyên nhân từng lượt. |
| Review | Phát hiện, xử lý và phần còn nghi vấn. |
| Tiến độ | in-progress/review/blocked; bước tiếp theo và dữ liệu để tiếp tục. |
| Nguồn lực | Thời gian; chi phí/tokens chỉ ghi khi có số đo, nếu không ghi “không đo được”. |

Giữ bí mật đăng nhập ngoài báo cáo. Thay đổi code hoặc cấu hình sau review phải được kiểm tra lại; không dùng kết quả của commit cũ cho phần code mới.

## 9. Bước 6 — đóng System loop sau một nhóm nhiệm vụ

Bắt đầu thực hành sau khoảng 5 nhiệm vụ có báo cáo. Đây là mốc thu thập kinh nghiệm, không phải bằng chứng thống kê đủ mạnh về chất lượng hệ thống.

Đưa các báo cáo, Issue/spec và kết quả review cho ChatGPT hoặc reviewer khác. Prompt:

```text
Đọc các báo cáo nhiệm vụ và thực hiện System review.
1. Tổng hợp lỗi lặp lại, số vòng sửa, tiêu chí thường bị bỏ sót và điểm phải hỏi lại Bin.
2. Đề xuất đúng một thay đổi nhỏ đối với prompt, quy tắc, tài liệu hoặc công cụ; nêu giả thuyết tác dụng.
3. Thiết kế phép so sánh cấu hình cũ/mới trên các nhiệm vụ thử tương đương, cùng snapshot ban đầu, điều kiện và tiêu chí kiểm tra. Tách môi trường để không dùng kết quả code của lượt trước.
4. Giữ một số nhiệm vụ chưa dùng để chỉnh prompt nhằm kiểm tra ngoài ví dụ đã biết. Ghi hạn chế do số mẫu nhỏ và tính ngẫu nhiên của model.
5. Đo độ đúng trước, rồi số vòng sửa/thời gian/chi phí nếu có số liệu. Không đánh đổi tiêu chí nghiệm thu để đạt tốc độ.
6. Tạo đề xuất thay đổi riêng, kèm kết quả, cách quay lại và khuyến nghị. Bin chốt trước khi thay policy chung.
```

Ví dụ phù hợp Ventlore: nhiều task dùng nhầm displayCode thay UUID. Thử yêu cầu đọc một trang tóm tắt ID_CONTRACT và kiểm tra quan hệ fixture trước khi code, rồi so sánh lỗi ID/vòng sửa. Nếu hiệu quả, ghi quyết định vào `DECISIONS.md` và đưa thay đổi vào PR quy trình. Nếu chỉ có nhận xét “prompt mới hay hơn” mà không đo, vòng System mới dừng ở đề xuất.

## 10. Khi nào bật chạy theo lịch hoặc tự động hoàn toàn?

| Mức | Cách kích hoạt | Phần tự động | Điều kiện nên đạt trước |
| --- | --- | --- | --- |
| A — bắt đầu ngay | Bin gửi prompt RUN_TASK. | Code → kiểm thử → sửa → PR trong một task; CI tự chạy theo sự kiện. | LOOP-00 hoạt động và có Issue rõ ràng. |
| B — lịch có giám sát | Scheduler kích hoạt một lần đọc backlog, sau đó mới cân nhắc làm một task. | Chọn việc theo lịch; giữ điểm dừng review. | Vài nhiệm vụ đã đi trọn vòng, kiểm tra lịch/múi giờ/môi trường chạy. |
| C — worker liên tục | Một bộ điều phối ngoài agent nhận sự kiện hoặc đọc hàng đợi. | Nhận task, gọi agent, chạy/retry, lưu trạng thái và giới hạn bằng code. | Có cơ chế khóa task, ngân sách, timeout, khôi phục và kiểm soát quyền. |

Tài liệu Antigravity hiện có `/schedule` trên các giao diện được hỗ trợ. Kiểm tra phiên bản đang dùng bằng menu `/`; không mặc định mọi bản IDE có cùng chức năng. Trước hết tạo một lịch thử chỉ đọc backlog và báo một Issue nên làm, kiểm tra múi giờ Việt Nam, nơi nhận kết quả và cách dừng lịch. Nếu chạy trên máy Mac, cần xác minh tác vụ có thực thi khi đóng ứng dụng hoặc máy ngủ hay không; không mặc định lịch được lưu là đã có worker cloud.

Khi muốn vận hành không giám sát, giới hạn “ba vòng” trong prompt chưa đủ. Bộ điều phối cần cưỡng chế số lượt, thời gian, chi phí khi có số đo, quyền thao tác và khóa chống hai worker nhận cùng Issue. Nó phải lưu task/run đang xử lý, đọc lại PR/CI sau khởi động lại, dừng khi hết việc hoặc hết quota. Job timeout trong Actions chỉ giới hạn job CI, không giới hạn toàn bộ phiên Antigravity.

Có thể dùng CLI/headless được sản phẩm hỗ trợ để xây worker khi cần. Nếu gọi model qua API, xác thực và tính phí phải được kiểm tra theo hình thức đó; tài khoản chat không tự tạo quyền API cho mọi script. Ở giai đoạn A, chưa cần viết bộ điều phối riêng chỉ để hoàn thành nhiệm vụ đầu tiên.

## 11. Nếu bị kẹt

| Hiện tượng | Hành động |
| --- | --- |
| `gh` không tồn tại hoặc chưa đăng nhập | Hoàn thành bước 1 rồi tiếp tục đúng task. |
| PR không có check | Kiểm tra workflow trong đúng nhánh, YAML, trigger và quyền Actions; xem thông báo thực tế. |
| Chỉ có báo cáo tài liệu đạt | Đọc lệnh đã chạy; bổ sung kiểm tra ứng dụng theo phạm vi, không coi toàn sản phẩm đã đạt. |
| CI đỏ | Agent đọc log, sửa nguyên nhân, chạy lại trong giới hạn; không bỏ gate. |
| Không có Issue `ready` | Dừng; Bin chốt yêu cầu/phụ thuộc rồi chọn task. |
| PR/nhánh của task đã có | Tiếp tục đúng lần chạy sau khi kiểm tra trạng thái và người đang xử lý. |
| Agent báo xong nhưng chưa có bằng chứng | Yêu cầu đối chiếu từng tiêu chí, link CI và cách chạy thử. |
| Review làm phát sinh ý tưởng tính năng mới | Tạo Issue khác; giữ phạm vi task hiện tại. |
| Có dấu xanh nhưng còn lỗi Bin tái hiện được | Lưu cách tái hiện, sửa code và bổ sung kiểm tra phù hợp cho lỗi đó. |

## 12. Nguồn kỹ thuật đã đối chiếu

Các cấu hình và chính sách trong hướng dẫn là đề xuất dành cho Ventlore; các khả năng công cụ được đối chiếu với tài liệu chính thức dưới đây. Tên check, lệnh test, cấu trúc app và phiên bản runtime cuối cùng phải lấy từ repo thực tế.

- Antigravity Rules và AGENTS.md: https://antigravity.google/docs/rules
- Antigravity slash commands: https://antigravity.google/docs/slash-commands/
- Antigravity sidecars/scheduler: https://antigravity.google/docs/sidecars
- GitHub CLI đăng nhập: https://cli.github.com/manual/gh_auth_login
- GitHub Actions: https://docs.github.com/en/actions/get-started/understand-github-actions
- Bảo vệ nhánh: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches

Tài liệu nghiệp vụ đã đối chiếu trong cuộc trao đổi: Logic-ID-DB 0.3, ID Registry 0.3, Event/UI Spec 0.3 và Brand Guide 0.1. Các đề xuất P/UI-P trong tài liệu vẫn cần giữ đúng trạng thái đề xuất; việc đưa chúng vào demo chưa tự chốt toàn bộ chính sách kinh doanh hoặc thanh toán thật.
