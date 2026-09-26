'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { AsyncState } from '@/components/AsyncState';
import { mockApiClient, VipPlanDTO } from '@ventlore/api-client';
import { useSession } from '@/components/SessionContext';
import { usePayment } from '@/components/PaymentContext';
import { useI18n } from '@/lib/i18n';
import {
  SparklesIcon,
  CheckIcon,
  ShieldCheckIcon,
} from '@/components/Icons';

export default function VipPage() {
  const { session, persona, setPersona } = useSession();
  const { openPayment } = usePayment();
  const { t, formatDate, getLocalizedPath, locale } = useI18n();
  const [plans, setPlans] = useState<VipPlanDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadPlans() {
      setIsLoading(true);
      try {
        const data = await mockApiClient.getVipPlans(locale);
        if (mounted) {
          setPlans(data);
          setIsLoading(false);
        }
      } catch {
        if (mounted) setIsLoading(false);
      }
    }
    loadPlans();
    return () => {
      mounted = false;
    };
  }, [locale]);

  const isVipActive = session?.membership?.isActive === true;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-vip-bg border border-status-vip/30 text-status-vip text-xs font-bold uppercase tracking-wider">
            <SparklesIcon className="w-4 h-4" />
            <span>{t('vip.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
            {t('vip.mainTitle')}
          </h1>

          <p className="text-sm sm:text-base text-ink-secondary max-w-xl mx-auto leading-relaxed">
            {t('vip.subtitle')}
          </p>
        </div>

        {/* Current VIP Status Card (if user is already VIP) */}
        {isVipActive && session?.membership && (
          <div className="rounded-card border-2 border-status-vip bg-status-vip-bg/60 p-6 sm:p-7 shadow-sm text-ink">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-status-vip text-white flex items-center justify-center shrink-0">
                  <SparklesIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-ink">{t('vip.activeStatusTitle')}</h3>
                  <p className="text-xs text-ink-secondary">
                    {t('vip.validUntilDate', {
                      start: formatDate(session.membership.startsAt),
                      end: formatDate(session.membership.endsAt),
                    })}
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-white text-status-vip border border-status-vip/40 font-bold text-xs shadow-xs">
                ACTIVE
              </span>
            </div>
          </div>
        )}

        {/* Plans List */}
        <AsyncState isLoading={isLoading}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-2xl mx-auto">
            {plans.map((plan) => {
              const priceUsd = (plan.priceUsdCents / 100).toFixed(0);

              return (
                <div
                  key={plan.planCode}
                  className="rounded-card border-2 border-forest bg-surface-card p-6 sm:p-8 shadow-md relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-forest text-white text-[11px] font-bold px-4 py-1 rounded-bl-control">
                    {t('vip.recommended')}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-ink">{plan.name}</h3>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-forest">${priceUsd}</span>
                      <span className="text-sm text-ink-secondary font-medium">{t('vip.term12Months')}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 my-6 text-sm text-ink border-t border-b border-sage/60 py-5">
                    {plan.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckIcon className="w-5 h-5 text-forest shrink-0 mt-0.5" />
                        <span className="leading-snug">{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Actions */}
                  <div className="space-y-3">
                    {persona === 'guest' ? (
                      <Link
                        href={getLocalizedPath(`/login?returnTo=${encodeURIComponent('/vip')}`)}
                        className="w-full min-h-control inline-flex items-center justify-center px-6 py-3 rounded-control font-bold text-white bg-forest hover:bg-forest-hover transition-colors shadow-sm text-sm"
                      >
                        {t('vip.signInToSubscribe')}
                      </Link>
                    ) : (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() =>
                            openPayment('MEMBERSHIP', {
                              targetId: plan.planCode,
                              planPriceUsdCents: plan.priceUsdCents,
                              termMonths: plan.termMonths,
                              targetTitle: plan.name,
                            })
                          }
                          className="w-full min-h-control inline-flex items-center justify-center px-6 py-3 rounded-control font-bold text-white bg-forest hover:bg-forest-hover transition-colors shadow-sm text-sm"
                        >
                          {isVipActive ? t('vip.renewButton') : t('vip.subscribeButton')}
                        </button>
                        {isVipActive && (
                          <div className="text-center p-2 rounded-control bg-status-success-bg text-status-success text-xs font-semibold">
                            {t('vip.alreadyActiveNotice')} &bull; {t('vip.renewalBonusNotice')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </AsyncState>

        {/* Architectural Invariants Callout */}
        <div className="rounded-card border border-sage bg-surface-card p-6 shadow-sm text-xs text-ink-secondary space-y-2">
          <div className="flex items-center gap-2 font-bold text-ink text-sm">
            <ShieldCheckIcon className="w-4 h-4 text-forest" />
            <span>{t('vip.rulesTitle')}</span>
          </div>
          <ul className="space-y-1.5 list-disc list-inside">
            <li>
              <strong>{t('vip.roleIndependence')}:</strong> {t('vip.roleIndependenceDesc')}
            </li>
            <li>
              <strong>{t('vip.activeRenewal')}:</strong> {t('vip.activeRenewalDesc')}
            </li>
            <li>
              <strong>{t('vip.donationSeparation')}:</strong> {t('vip.donationSeparationDesc')}
            </li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
