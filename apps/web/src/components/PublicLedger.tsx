'use client';

import React from 'react';
import { TransparencySummaryDTO } from '@ventlore/api-client';
import { useI18n } from '../lib/i18n';
import { ShieldCheckIcon } from './Icons';

interface PublicLedgerProps {
  data: TransparencySummaryDTO;
}

export function PublicLedger({ data }: PublicLedgerProps) {
  const { t, formatDate } = useI18n();

  return (
    <div className="space-y-8">
      {/* 1. Header & Overview */}
      <div className="rounded-card border border-sage bg-surface-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sage/60 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-forest bg-sage/60 px-3 py-1 rounded-full">
                <ShieldCheckIcon className="w-3.5 h-3.5" />
                {t('transparency.badge')}
              </span>
              <span className="text-xs text-ink-muted">{t('transparency.fiscalYear', { year: data.year })}</span>
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-ink">
              {t('transparency.mainTitle')}
            </h2>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center text-xs font-mono text-status-success bg-status-success-bg px-2.5 py-1 rounded-control border border-status-success/30">
              ● {t('transparency.realTimeReconciliation')}
            </span>
          </div>
        </div>

        <p className="text-sm text-ink-secondary mb-6 leading-relaxed">
          {t('transparency.introDescription')}
        </p>

        {/* Balance cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.balances.map((b) => (
            <div key={b.asset} className="rounded-control border border-sage bg-surface-canvas p-4 sm:p-5">
              <div className="flex items-center justify-between font-bold text-ink text-base mb-3 border-b border-sage/60 pb-2">
                <span>{t('transparency.asset')}: {b.asset}</span>
                <span className="text-xs font-mono font-normal text-ink-muted">Arbitrum One</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-control border border-sage/40">
                  <div className="text-[11px] text-ink-secondary font-medium">{t('transparency.available')}</div>
                  <div className="text-sm sm:text-base font-bold text-forest mt-1">
                    {b.availableFormatted}
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-control border border-sage/40">
                  <div className="text-[11px] text-ink-secondary font-medium">{t('transparency.reserved')}</div>
                  <div className="text-sm sm:text-base font-bold text-status-pending mt-1">
                    {b.reservedFormatted}
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-control border border-sage/40">
                  <div className="text-[11px] text-ink-secondary font-medium">{t('transparency.spent')}</div>
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
        <h3 className="text-lg font-bold text-ink mb-4">{t('transparency.sourcesTitle')}</h3>
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
          <h3 className="text-lg font-bold text-ink">{t('transparency.disbursementsTitle')}</h3>
          <span className="text-xs text-ink-muted">{t('transparency.anonymizedNotice')}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-sage text-ink-secondary font-semibold text-xs">
                <th className="py-3 px-3">{t('transparency.voucherCode')}</th>
                <th className="py-3 px-3">{t('transparency.purpose')}</th>
                <th className="py-3 px-3 text-right">{t('transparency.amount')}</th>
                <th className="py-3 px-3">{t('transparency.date')}</th>
                <th className="py-3 px-3 text-right">{t('transparency.receipt')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/40">
              {data.recentDisbursements.map((d) => (
                <tr key={d.payoutId} className="hover:bg-surface-canvas/60">
                  <td className="py-3 px-3 font-mono font-medium text-forest">{d.displayCode}</td>
                  <td className="py-3 px-3 text-ink">{d.purpose}</td>
                  <td className="py-3 px-3 text-right font-bold text-ink">{d.amountFormatted}</td>
                  <td className="py-3 px-3 text-ink-secondary">
                    {formatDate(d.date)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-xs text-ink-secondary">
                    {d.txHash ? (
                      <span className="inline-flex items-center gap-1 text-forest underline cursor-pointer">
                        {d.txHash}
                      </span>
                    ) : (
                      'Internal'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-sage/60 text-xs text-ink-muted flex flex-wrap items-center justify-between gap-2">
          <span>{t('transparency.splitRuleNotice')}</span>
          <span>{t('transparency.privacyNotice')}</span>
        </div>
      </div>

      {/* 4. Live Demo Payments Stream */}
      <DemoPaymentsStream />
    </div>
  );
}

function DemoPaymentsStream() {
  const [payments, setPayments] = React.useState<any[]>([]);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const { mockApiClient } = await import('@ventlore/api-client');
        const list = await mockApiClient.getPaymentIntents();
        if (mounted) setPayments(list);
      } catch {
        // ignore
      }
    }
    load();
    const interval = setInterval(load, 3000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="rounded-card border-2 border-forest/30 bg-surface-card p-6 sm:p-8 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sage/60 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest/10 text-forest text-[11px] font-bold uppercase tracking-wider">
            <span>DEMO STREAM</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-ink mt-1">
            Nhật ký Giao dịch Thanh toán Mô phỏng (Simulated Payment Ledger)
          </h3>
        </div>
        <span className="text-xs font-mono text-ink-muted">
          Tự động cập nhật mỗi 3s
        </span>
      </div>

      <p className="text-xs text-ink-secondary leading-relaxed">
        Bảng đối soát phản ánh các lượt đóng góp Quỹ dự án (100%), Ủng hộ tác giả (80/20) và Gói Hội viên VIP vừa được thực hiện qua <strong className="text-ink">PaymentModal</strong> trong phiên trải nghiệm.
      </p>

      {payments.length === 0 ? (
        <div className="p-6 rounded-control bg-surface-canvas border border-dashed border-sage text-center text-xs text-ink-muted">
          Chưa có giao dịch mô phỏng nào trong phiên này. Hãy thử bấm &ldquo;Ủng hộ&rdquo; trên thanh điều hướng hoặc &ldquo;Tip tác giả&rdquo; trong bài viết để xem đối soát tức thì!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sage text-ink-secondary font-semibold">
                <th className="py-2.5 px-3">Mã đơn (UUIDv7)</th>
                <th className="py-2.5 px-3">Loại nghiệp vụ</th>
                <th className="py-2.5 px-3">Mục tiêu / Đối tượng</th>
                <th className="py-2.5 px-3 text-right">Số tiền</th>
                <th className="py-2.5 px-3">Phân bổ Split</th>
                <th className="py-2.5 px-3 text-right">Biên nhận Onchain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/40">
              {payments.map((p) => {
                const isTip = p.mode === 'POST_TIP';
                const isProject = p.mode === 'PROJECT';

                return (
                  <tr key={p.id} className="hover:bg-surface-canvas/60">
                    <td className="py-2.5 px-3 font-mono text-ink font-semibold">
                      {p.id.slice(0, 13)}...
                    </td>
                    <td className="py-2.5 px-3">
                      {isTip && (
                        <span className="px-2 py-0.5 rounded-full bg-waypoint/20 text-waypoint font-bold text-[10px]">
                          POST_TIP
                        </span>
                      )}
                      {isProject && (
                        <span className="px-2 py-0.5 rounded-full bg-forest/15 text-forest font-bold text-[10px]">
                          PROJECT_DONATION
                        </span>
                      )}
                      {p.mode === 'MEMBERSHIP' && (
                        <span className="px-2 py-0.5 rounded-full bg-status-vip-bg text-status-vip font-bold text-[10px]">
                          VIP_MEMBERSHIP
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-ink max-w-[200px] truncate">
                      {p.targetTitle || 'Ventlore Community Fund'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-ink">
                      {p.amountFormatted || '$5.00'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-ink-secondary">
                      {isTip ? (
                        <span className="text-forest font-semibold">
                          80% Tác giả / 20% Quỹ
                        </span>
                      ) : isProject ? (
                        <span className="text-forest">
                          100% Quỹ Ventlore
                        </span>
                      ) : (
                        <span>
                          100% Tài khoản VIP
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[11px] text-forest">
                      {p.txHashDemo || '0xmock...demo'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
