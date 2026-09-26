'use client';

import React, { useState } from 'react';
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
    targetPath: '/',
    description: 'Trải nghiệm đọc công khai từ Home → Khám phá Explore → Địa điểm → Đọc bài viết → Lịch sử revision → Hồ sơ người dùng. Không yêu cầu đăng nhập hay kết nối ví.',
  },
  {
    id: 's02',
    number: 2,
    title: 'Không có dữ liệu / Lỗi (Empty & Error)',
    persona: 'guest',
    targetPath: '/explore?q=khong_tim_thay_dia_diem_xyz',
    description: 'Trạng thái tìm kiếm không có kết quả, gợi ý hành động tiếp theo rõ ràng thay vì trang trắng.',
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
    targetPath: '/contribute?tab=candidate',
    description: 'Nhập thử "Cát Cò" trong Đề xuất điểm mới để thấy cảnh báo trùng lặp thông minh và nút chuyển sang viết bài cho điểm đã có.',
  },
  {
    id: 's05',
    number: 5,
    title: 'Ủng hộ Quỹ Ventlore (Project donate)',
    persona: 'guest',
    targetPath: '/',
    description: 'Mở PaymentModal chế độ PROJECT từ nút Donate trên thanh điều hướng hoặc Home. 100% tiền chuyển vào Quỹ dự án.',
    actionHint: 'open_project_payment',
  },
  {
    id: 's06',
    number: 6,
    title: 'Ủng hộ tác giả bài viết (80/20 Post tip)',
    persona: 'vip',
    targetPath: '/posts/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10',
    description: 'Bấm "Tip tác giả" trong bài viết để mở PaymentModal chế độ POST_TIP với phân bổ 80% tác giả / 20% Quỹ tính bằng số nguyên atomic.',
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
    description: 'PaymentModal mô phỏng đầy đủ: chuyển mạng Arbitrum One / Sepolia, cảnh báo sai mạng, giao dịch pending và hoàn tất.',
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
    targetPath: '/admin',
    description: 'Bấm nút "Chạy thử: Công Đạt & Bài Bác" trong khu Admin để thấy rõ 2 quyết định độc lập: Chuyên gia vẫn nhận thù lao dù bài bị REJECTED!',
  },
  {
    id: 's12',
    number: 12,
    title: 'Khiếu nại & App Hold khẩn cấp',
    persona: 'admin',
    targetPath: '/admin',
    description: 'Xem khiếu nại trong Tiếp nhận và cơ chế bật/tắt App Hold tức thời trên ứng dụng mà không phụ thuộc vào trạng thái mạng onchain.',
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
  const [selectedScenario, setSelectedScenario] = useState<ScenarioItem | null>(null);

  const handleSelectScenario = (sc: ScenarioItem) => {
    setSelectedScenario(sc);
    if (persona !== sc.persona) {
      setPersona(sc.persona);
    }
    const fullPath = getLocalizedPath(sc.targetPath);
    router.push(fullPath);

    if (sc.actionHint === 'open_project_payment') {
      setTimeout(() => {
        openPayment('PROJECT', {
          targetTitle: 'Quỹ phát triển cộng đồng dã ngoại Ventlore',
        });
      }, 300);
    }
  };

  return (
    <aside aria-label="Review Toolbar" className="fixed bottom-4 right-4 z-scenario-picker font-sans">
      {/* Collapsed Pill Button */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-forest text-white shadow-xl hover:bg-forest-hover border border-white/20 transition-transform hover:scale-105"
        >
          <SparklesIcon className="w-4 h-4 text-status-vip" />
          <span className="text-xs font-bold tracking-tight">Review Toolbar (14 Scenarios)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono uppercase">
            {persona}
          </span>
        </button>
      ) : (
        /* Expanded Panel */
        <div className="bg-surface-card border-2 border-forest rounded-card shadow-2xl w-[92vw] sm:w-[420px] max-h-[85vh] flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-3.5 bg-forest text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-status-vip" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Bộ Nghiệm Thu Ventlore (Bin Review)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-white/80 hover:text-white rounded"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
            {/* Persona Switcher Quick Row */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                1. Chọn Persona thử nghiệm:
              </div>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                {(['guest', 'author', 'vip', 'expert', 'admin'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPersona(p)}
                    className={`py-1 px-2 rounded-control font-bold uppercase text-center transition-colors ${
                      persona === p
                        ? 'bg-forest text-white shadow-xs'
                        : 'bg-surface-canvas border border-sage text-ink hover:bg-sage/40'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Scenario Picker List */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                2. Chọn 1 trong 14 Kịch bản kiểm thử:
              </div>
              <div className="space-y-1 max-h-[220px] overflow-y-auto border border-sage rounded-control p-1.5 bg-surface-canvas">
                {SCENARIOS.map(sc => {
                  const isCurrent = selectedScenario?.id === sc.id;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => handleSelectScenario(sc)}
                      className={`w-full text-left p-2 rounded-control transition-colors flex items-center justify-between gap-2 ${
                        isCurrent
                          ? 'bg-forest text-white'
                          : 'hover:bg-white text-ink'
                      }`}
                    >
                      <div className="truncate">
                        <strong className="font-mono mr-1.5">#{sc.number}</strong>
                        <span>{sc.title}</span>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-mono shrink-0 ${
                          isCurrent ? 'bg-white/20 text-white' : 'bg-sage text-forest'
                        }`}
                      >
                        {sc.persona}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scenario Active Guide */}
            {selectedScenario && (
              <div className="p-3 rounded-control bg-status-vip-bg/50 border border-status-vip/40 space-y-1.5 text-ink">
                <div className="flex items-center gap-1.5 font-bold text-xs text-status-vip">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Kịch bản đang chọn: #{selectedScenario.number} - {selectedScenario.title}</span>
                </div>
                <p className="text-[11px] text-ink-secondary leading-relaxed">
                  {selectedScenario.description}
                </p>
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
                    openPayment('PROJECT', {
                      targetTitle: 'Quỹ phát triển cộng đồng Ventlore',
                    });
                  }}
                  className="py-1.5 px-2 rounded-control bg-forest/10 text-forest hover:bg-forest/20"
                >
                  Mở PaymentModal
                </button>
                <Link
                  href={getLocalizedPath('/account')}
                  className="py-1.5 px-2 rounded-control bg-surface-canvas border border-sage text-ink hover:bg-sage/30"
                >
                  Vào Dashboard Cá nhân
                </Link>
                <Link
                  href={getLocalizedPath('/data-map')}
                  className="py-1.5 px-2 rounded-control bg-amber/20 text-ink hover:bg-amber/30 border border-amber/30 flex items-center justify-center gap-1"
                >
                  <TableIcon className="w-3.5 h-3.5 text-forest" />
                  <span>Xem Data Map (16 cột)</span>
                </Link>
                <a
                  href="/docs/FE_DATA_MAP.md"
                  download="FE_DATA_MAP.md"
                  className="py-1.5 px-2 rounded-control bg-forest text-white hover:bg-forest-hover flex items-center justify-center gap-1"
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
