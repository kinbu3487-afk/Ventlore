import React from 'react';
import { TransparencySummaryDTO } from '@ventlore/api-client';
import { ShieldCheckIcon, ClockIcon, ExternalLink, ArrowRightIcon } from './Icons';

interface PublicLedgerProps {
  data: TransparencySummaryDTO;
}

export function PublicLedger({ data }: PublicLedgerProps) {
  return (
    <div className="space-y-8">
      {/* 1. Header & Overview */}
      <div className="rounded-card border border-sage bg-surface-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sage/60 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-forest bg-sage/60 px-2.5 py-1 rounded-full">
                <ShieldCheckIcon className="w-3.5 h-3.5" />
                Minh Bạch Quỹ Công Khai
              </span>
              <span className="text-xs text-ink-muted">Năm tài khóa {data.year}</span>
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-ink">
              Sổ quỹ đối soát và phân bổ nguồn lực thẩm định
            </h2>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center text-xs font-mono text-status-success bg-status-success-bg px-2.5 py-1 rounded-control border border-status-success/30">
              ● Chu kỳ đối soát: Real-time (Onchain + Outbox)
            </span>
          </div>
        </div>

        <p className="text-sm text-ink-secondary mb-6 leading-relaxed">
          Ventlore cam kết công khai 100% dòng tiền quyên góp, doanh thu hội viên VIP và phân bổ thù lao chi trả cho các chuyên gia thẩm định thực địa. Mọi giao dịch được ghi sổ bất biến sau khi hoàn tất đối soát (Finalized).
        </p>

        {/* Balance cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.balances.map((b) => (
            <div key={b.asset} className="rounded-control border border-sage bg-surface-canvas p-4 sm:p-5">
              <div className="flex items-center justify-between font-bold text-ink text-base mb-3 border-b border-sage/60 pb-2">
                <span>Tài sản: {b.asset}</span>
                <span className="text-xs font-mono font-normal text-ink-muted">Mạng Arbitrum</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-control border border-sage/40">
                  <div className="text-[11px] text-ink-secondary font-medium">Khả dụng (Available)</div>
                  <div className="text-sm sm:text-base font-bold text-forest mt-1">
                    {b.availableFormatted}
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-control border border-sage/40">
                  <div className="text-[11px] text-ink-secondary font-medium">Đã cam kết (Reserved)</div>
                  <div className="text-sm sm:text-base font-bold text-status-pending mt-1">
                    {b.reservedFormatted}
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-control border border-sage/40">
                  <div className="text-[11px] text-ink-secondary font-medium">Đã chi trả (Spent)</div>
                  <div className="text-sm sm:text-base font-bold text-ink-muted mt-1">
                    {b.spentFormatted}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Funding Sources */}
      <div className="rounded-card border border-sage bg-surface-card p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-ink mb-4">Cơ cấu nguồn thu vào quỹ dự án</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.sources.map((src, idx) => (
            <div key={idx} className="p-4 rounded-control border border-sage/70 bg-surface-canvas">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-sage text-forest">
                  {src.sourceType}
                </span>
                <span className="font-bold text-sm text-ink">{src.amountFormatted}</span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">{src.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Disbursements */}
      <div className="rounded-card border border-sage bg-surface-card p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-ink">Các khoản thù lao thẩm định đã giải ngân</h3>
          <span className="text-xs text-ink-muted">Thông tin cá nhân đã được ẩn danh (Redacted)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-sage text-ink-secondary font-semibold text-xs">
                <th className="py-3 px-3">Mã phiếu</th>
                <th className="py-3 px-3">Mục đích chi trả</th>
                <th className="py-3 px-3 text-right">Số tiền</th>
                <th className="py-3 px-3">Ngày giải ngân</th>
                <th className="py-3 px-3 text-right">Biên nhận Onchain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/40">
              {data.recentDisbursements.map((d) => (
                <tr key={d.payoutId} className="hover:bg-surface-canvas/60">
                  <td className="py-3 px-3 font-mono font-medium text-forest">{d.displayCode}</td>
                  <td className="py-3 px-3 text-ink">{d.purpose}</td>
                  <td className="py-3 px-3 text-right font-bold text-ink">{d.amountFormatted}</td>
                  <td className="py-3 px-3 text-ink-secondary">
                    {new Date(d.date).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-xs text-ink-secondary">
                    {d.txHash ? (
                      <span className="inline-flex items-center gap-1 text-forest underline cursor-pointer">
                        {d.txHash}
                      </span>
                    ) : (
                      'Nội bộ'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-sage/60 text-xs text-ink-muted flex flex-wrap items-center justify-between gap-2">
          <span>Quy tắc: 100% quyên góp dự án vào quỹ; tip bài viết 80% tác giả / 20% quỹ.</span>
          <span>Bảo mật: Không công khai thông tin ví riêng tư ngoài cam kết.</span>
        </div>
      </div>
    </div>
  );
}
