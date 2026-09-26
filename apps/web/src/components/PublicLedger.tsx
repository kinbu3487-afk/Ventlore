'use client';

import React from 'react';
import { TransparencySummaryDTO } from '@ventlore/api-client';
import { useI18n } from '../lib/i18n';
import { ShieldCheckIcon, ExternalLink } from './Icons';

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
            <span className="inline-flex items-center text-xs font-semibold text-forest bg-sage/60 px-3 py-1 rounded-control border border-sage">
              {t('transparency.periodicReport')}
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
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-sage text-forest">
                  {src.sourceType === 'OWNER_FUNDING' && t('transparency.sourceFounderEndowment')}
                  {src.sourceType === 'VIP_REVENUE' && t('transparency.sourceVipRevenue')}
                  {src.sourceType === 'PROJECT_DONATION' && t('transparency.sourceCommunityDonation')}
                  {src.sourceType === 'POST_TIP_SHARE' && t('transparency.sourceTipShare')}
                  {!['OWNER_FUNDING', 'VIP_REVENUE', 'PROJECT_DONATION', 'POST_TIP_SHARE'].includes(src.sourceType) && src.sourceType}
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
                  <td className="py-3 px-3 text-right text-xs">
                    {d.txHash && d.txHash.length > 20 && !d.txHash.includes('...') ? (
                      <a
                        href={`https://arbiscan.io/tx/${d.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-forest underline hover:text-forest-hover"
                      >
                        <span>{d.txHash.slice(0, 6)}...{d.txHash.slice(-4)}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-sage/60 text-ink-muted text-[11px] font-sans">
                        {t('transparency.internalVoucher')}
                      </span>
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
    </div>
  );
}
