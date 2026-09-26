'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from '@/components/SessionContext';
import { usePayment } from '@/components/PaymentContext';
import { useI18n } from '@/lib/i18n';
import {
  SparklesIcon,
  CloseIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  UserIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  TableIcon,
  DownloadIcon,
  RefreshCwIcon,
} from '@/components/Icons';

interface ScenarioItem {
  id: string;
  number: number;
  title: string;
  persona: 'guest' | 'author' | 'vip' | 'expert' | 'admin';
  targetPath: string;
  description: string;
  actionHint?: string;
}

const SCENARIOS: ScenarioItem[] = [
  {
    id: 's01',
    number: 1,
    title: 'Người đọc mới (Read journeys)',
    persona: 'guest',
    targetPath: '/explore',
    description: 'Trải nghiệm đọc công khai từ Home → Khám phá Explore → Địa điểm → Đọc bài viết → Lịch sử revision → Hồ sơ người dùng. Không yêu cầu đăng nhập hay kết nối ví.',
  },
  {
    id: 's02',
    number: 2,
    title: 'Không có dữ liệu / Lỗi (Empty & Error)',
    persona: 'guest',
    targetPath: '/explore?q=khong_tim_thay_dia_diem_xyz',
    description: 'Trạng thái tìm kiếm không có kết quả, tự động cập nhật ô tìm kiếm và hiển thị gợi ý hành động thay vì trang trắng.',
  },
  {
    id: 's03',
    number: 3,
    title: 'Đóng góp bài viết (Contribute post)',
    persona: 'author',
    targetPath: '/contribute?tab=existing',
    description: 'Viết bài khảo sát cho điểm có sẵn, thêm nhận định kiểm chứng, xem trước live markdown, lưu nháp cục bộ và gửi demo.',
  },
  {
    id: 's04',
    number: 4,
    title: 'Phát hiện điểm trùng (Duplicate place)',
    persona: 'author',
    targetPath: '/contribute?tab=candidate&preset=catco',
    description: 'Tự động điền "Cát Cò" trong Đề xuất điểm mới để kích hoạt cảnh báo trùng lặp thông minh và nút chuyển sang viết bài cho điểm đã có.',
  },
  {
    id: 's05',
    number: 5,
    title: 'Ủng hộ Quỹ Ventlore (Project donate)',
    persona: 'guest',
    targetPath: '/',
    description: 'Mở PaymentModal chế độ PROJECT với phân bổ 100% tiền chuyển vào Quỹ bảo tồn & thẩm định dự án.',
    actionHint: 'open_project_payment',
  },
  {
    id: 's06',
    number: 6,
    title: 'Ủng hộ tác giả bài viết (80/20 Post tip)',
    persona: 'vip',
    targetPath: '/posts/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10',
    description: 'Xem bài viết Cát Cò 3 đã duyệt, bấm "Tip tác giả" để mở PaymentModal chế độ POST_TIP phân bổ 80% tác giả / 20% Quỹ (số nguyên atomic).',
  },
  {
    id: 's07',
    number: 7,
    title: 'Mua / Gia hạn gói VIP (15 USD/năm)',
    persona: 'author',
    targetPath: '/vip',
    description: 'Trang VIP niêm yết 15 USD/12 tháng. Mở PaymentModal chế độ MEMBERSHIP, quyền VIP gắn với tài khoản người dùng (userId).',
  },
  {
    id: 's08',
    number: 8,
    title: 'Ví Web3 & Ngoại lệ (Wallet exceptions)',
    persona: 'guest',
    targetPath: '/transparency',
    description: 'PaymentModal mô phỏng chuyển mạng Arbitrum One / Sepolia, cảnh báo sai mạng, giao dịch pending và hoàn tất.',
    actionHint: 'open_project_payment',
  },
  {
    id: 's09',
    number: 9,
    title: 'Bốn nhánh quyền lợi đóng góp (Benefits)',
    persona: 'author',
    targetPath: '/account?tab=benefits',
    description: 'Bốn khối riêng biệt: Nhãn kiểm tra, Huy hiệu Contributor SBT, Author NFT, và Tuyến nhận tip onchain có chữ ký đồng ý.',
  },
  {
    id: 's10',
    number: 10,
    title: 'Không gian Chuyên gia (Expert workspace)',
    persona: 'expert',
    targetPath: '/expert',
    description: 'Bảng nhiệm vụ thực địa (Offered, Doing, Submitted, Accepted), form nộp bằng chứng theo từng claim, bảng công nợ phải nhận.',
  },
  {
    id: 's11',
    number: 11,
    title: 'Công đạt, bài không đạt (Mandatory test)',
    persona: 'admin',
    targetPath: '/admin?tab=review_cases',
    description: 'Mở tab Hồ sơ Thẩm định. Bấm "Chạy thử: Công Đạt & Bài Bác" để thấy rõ 2 quyết định độc lập: Chuyên gia vẫn nhận thù lao dù bài bị REJECTED!',
  },
  {
    id: 's12',
    number: 12,
    title: 'Khiếu nại & App Hold khẩn cấp',
    persona: 'admin',
    targetPath: '/admin?tab=app_hold',
    description: 'Xem tab App Hold khẩn cấp trên ứng dụng và thao tác bật/tắt tức thời mà không phụ thuộc vào trạng thái mạng onchain.',
  },
  {
    id: 's13',
    number: 13,
    title: 'Thời hạn & Tính độc lập quyền (Expirations)',
    persona: 'guest',
    targetPath: '/places/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e09',
    description: 'Xem bài viết Tây Côn Lĩnh có chứng nhận kiểm định hết hạn (EXPIRED). Dữ liệu vẫn được giữ nguyên vẹn để đối soát.',
  },
  {
    id: 's14',
    number: 14,
    title: 'Sổ quỹ & Minh bạch trực tiếp (Ledger)',
    persona: 'guest',
    targetPath: '/transparency',
    description: 'Số dư Quỹ theo từng loại tài sản (USDC, ETH), đối soát nguồn thu, lịch sử chi trả thù lao và dòng thanh toán mô phỏng live.',
  },
];

export function ReviewToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { session, persona, setPersona } = useSession();
  const { openPayment } = usePayment();
  const { getLocalizedPath } = useI18n();

  const [isOpen, setIsOpen] = useState(false);
  const [navigatingId, setNavigatingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Restore active scenario from sessionStorage
  const [selectedScenario, setSelectedScenario] = useState<ScenarioItem | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedId = sessionStorage.getItem('ventlore_active_scenario');
        if (savedId) {
          return SCENARIOS.find((s) => s.id === savedId) || null;
        }
      } catch {}
    }
    return null;
  });

  const handleSelectScenario = (sc: ScenarioItem, autoMinimize = false) => {
    setNavigatingId(sc.id);
    setSelectedScenario(sc);
    try {
      sessionStorage.setItem('ventlore_active_scenario', sc.id);
    } catch {}

    // 1. Sync persona synchronously
    if (persona !== sc.persona) {
      setPersona(sc.persona);
    }

    // 2. Action hint handler (PaymentModal)
    if (sc.actionHint === 'open_project_payment') {
      setIsOpen(false);
      setToastMessage(`Đã kích hoạt Kịch bản #${sc.number}: Mở PaymentModal`);
      setTimeout(() => {
        openPayment('PROJECT', {
          targetTitle: 'Quỹ phát triển cộng đồng dã ngoại Ventlore',
        });
        setNavigatingId(null);
        setTimeout(() => setToastMessage(null), 3000);
      }, 150);
      return;
    }

    // 3. Navigation handler
    const fullPath = getLocalizedPath(sc.targetPath);
    const currentFull = typeof window !== 'undefined'
      ? window.location.pathname + window.location.search
      : '';

    setToastMessage(`Đang chuyển sang Kịch bản #${sc.number}: ${sc.title}`);
    setTimeout(() => setToastMessage(null), 3500);

    if (currentFull === fullPath) {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setTimeout(() => {
        setNavigatingId(null);
      }, 200);
    } else {
      router.push(fullPath);
      setTimeout(() => {
        setNavigatingId(null);
      }, 500);
    }

    if (autoMinimize) {
      setIsOpen(false);
    }
  };

  return (
    <aside
      aria-label="Review Toolbar"
      className="fixed bottom-16 sm:bottom-4 right-3 sm:right-4 z-[9999] font-sans pointer-events-auto"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 rounded-control bg-forest text-white text-xs font-semibold shadow-xl border border-white/20 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2">
          <CheckCircleIcon className="w-4 h-4 text-status-vip" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Collapsed Pill Button */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-forest text-white shadow-2xl hover:bg-forest-hover border border-white/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <SparklesIcon className="w-4 h-4 text-status-vip animate-pulse" />
          <span className="text-xs font-bold tracking-tight">
            {selectedScenario
              ? `#${selectedScenario.number}: ${selectedScenario.title.slice(0, 24)}...`
              : 'Review Toolbar (14 Scenarios)'}
          </span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono uppercase font-bold">
            {persona}
          </span>
          <ChevronDownIcon className="w-3.5 h-3.5 text-white/80" />
        </button>
      ) : (
        /* Expanded Panel */
        <div className="bg-surface-card border-2 border-forest rounded-card shadow-2xl w-[94vw] sm:w-[440px] max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-forest text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-status-vip" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Bộ Nghiệm Thu (Bin Review 14 Scenarios)
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2 py-0.5 text-[11px] font-medium text-white/80 hover:text-white rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                title="Thu nhỏ để xem màn hình"
              >
                Thu nhỏ ⤓
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-white/80 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
            {/* Persona Switcher Quick Row */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                1. Chọn Persona thử nghiệm:
              </div>
              <div className="grid grid-cols-5 gap-1 font-mono text-[11px]">
                {(['guest', 'author', 'vip', 'expert', 'admin'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPersona(p)}
                    className={`py-1.5 px-1 rounded-control font-bold uppercase text-center transition-all cursor-pointer active:scale-95 ${
                      persona === p
                        ? 'bg-forest text-white shadow-xs ring-1 ring-forest-light'
                        : 'bg-surface-canvas border border-sage text-ink hover:bg-sage/50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Scenario Picker List */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  2. Chọn 1 trong 14 Kịch bản kiểm thử:
                </span>
                <span className="text-[10px] text-ink-muted italic">Click để chuyển ngay</span>
              </div>
              <div className="space-y-1.5 max-h-[240px] overflow-y-auto border border-sage rounded-control p-1.5 bg-surface-canvas">
                {SCENARIOS.map((sc) => {
                  const isCurrent = selectedScenario?.id === sc.id;
                  const isBusy = navigatingId === sc.id;

                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => handleSelectScenario(sc, false)}
                      className={`w-full text-left p-2.5 rounded-control transition-all flex items-center justify-between gap-2 cursor-pointer touch-manipulation active:scale-[0.99] select-none ${
                        isCurrent
                          ? 'bg-forest text-white shadow-sm ring-1 ring-forest-light font-semibold'
                          : 'hover:bg-white text-ink bg-surface-card/70 border border-transparent hover:border-sage'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`font-mono text-xs px-1.5 py-0.5 rounded font-bold shrink-0 ${
                            isCurrent ? 'bg-white/20 text-white' : 'bg-sage text-forest'
                          }`}
                        >
                          #{sc.number}
                        </span>
                        <span className="text-xs truncate">{sc.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-mono font-bold ${
                            isCurrent
                              ? 'bg-white/20 text-white'
                              : 'bg-surface-canvas text-ink-secondary border border-sage'
                          }`}
                        >
                          {sc.persona}
                        </span>
                        {isBusy ? (
                          <RefreshCwIcon className="w-3.5 h-3.5 animate-spin text-amber" />
                        ) : (
                          <ArrowRightIcon
                            className={`w-3.5 h-3.5 transition-transform ${
                              isCurrent ? 'text-amber translate-x-0.5' : 'text-ink-muted'
                            }`}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scenario Active Guide Box */}
            {selectedScenario && (
              <div className="p-3 rounded-control bg-status-vip-bg/50 border border-status-vip/40 space-y-2 text-ink animate-in fade-in duration-150">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-status-vip">
                    <CheckCircleIcon className="w-4 h-4 shrink-0" />
                    <span>
                      Kịch bản #{selectedScenario.number}: {selectedScenario.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-forest text-white shrink-0">
                    {selectedScenario.persona}
                  </span>
                </div>

                <p className="text-[11px] text-ink-secondary leading-relaxed">
                  {selectedScenario.description}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectScenario(selectedScenario, true)}
                    className="flex-1 py-1.5 px-3 rounded-control bg-forest text-white font-bold text-xs hover:bg-forest-hover transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>👉 Đi tới màn hình & Thu nhỏ</span>
                    <ArrowRightIcon className="w-3.5 h-3.5 text-amber" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="py-1.5 px-2.5 rounded-control bg-surface-card border border-sage text-ink text-xs font-semibold hover:bg-sage/40 transition-colors cursor-pointer"
                  >
                    Thu nhỏ
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions Shortcuts */}
            <div className="space-y-1.5 pt-2 border-t border-sage/60">
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                3. Lối tắt nhanh:
              </div>
              <div className="grid grid-cols-2 gap-2 text-center font-bold text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    openPayment('PROJECT', {
                      targetTitle: 'Quỹ phát triển cộng đồng Ventlore',
                    });
                  }}
                  className="py-1.5 px-2 rounded-control bg-forest/10 text-forest hover:bg-forest/20 transition-colors cursor-pointer"
                >
                  Mở PaymentModal
                </button>
                <Link
                  href={getLocalizedPath('/account')}
                  onClick={() => setIsOpen(false)}
                  className="py-1.5 px-2 rounded-control bg-surface-canvas border border-sage text-ink hover:bg-sage/40 transition-colors cursor-pointer"
                >
                  Dashboard Cá nhân
                </Link>
                <Link
                  href={getLocalizedPath('/data-map')}
                  onClick={() => setIsOpen(false)}
                  className="py-1.5 px-2 rounded-control bg-amber/20 text-ink hover:bg-amber/30 border border-amber/30 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <TableIcon className="w-3.5 h-3.5 text-forest" />
                  <span>Data Map (16 cột)</span>
                </Link>
                <a
                  href="/docs/FE_DATA_MAP.md"
                  download="FE_DATA_MAP.md"
                  className="py-1.5 px-2 rounded-control bg-forest text-white hover:bg-forest-hover flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Tải trực tiếp file docs/FE_DATA_MAP.md"
                >
                  <DownloadIcon className="w-3.5 h-3.5 text-amber" />
                  <span>Tải FE_DATA_MAP.md</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
