'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePayment } from './PaymentContext';
import { useSession } from './SessionContext';
import { useI18n } from '../lib/i18n';
import { PaymentMode } from '@ventlore/api-client';
import {
  CloseIcon,
  SparklesIcon,
  UserIcon,
  AlertTriangleIcon,
} from './Icons';

export function PaymentModal() {
  const { isOpen, mode, initialData, closePayment } = usePayment();
  const { persona, session } = useSession();
  const { t, getLocalizedPath } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);

  // Form State
  const [activeMode, setActiveMode] = useState<PaymentMode>(mode);
  const [amount, setAmount] = useState<string>('20');
  const selectedAsset = 'USDC';

  // Synchronize mode and context data strictly from the opener (P1-04)
  useEffect(() => {
    if (isOpen) {
      setActiveMode(mode);
      if (mode === 'MEMBERSHIP') {
        setAmount('15');
      } else if (initialData?.defaultAmount) {
        setAmount(initialData.defaultAmount);
      } else {
        setAmount('20');
      }
    }
  }, [isOpen, mode, initialData]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        closePayment();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closePayment]);

  if (!isOpen) return null;

  // Atomic Units Calculation (USDC 6 decimals)
  const parsedAmount = parseFloat(amount) || 0;
  const amountAtomicUnits = BigInt(Math.floor(parsedAmount * 1_000_000));

  let authorShareAtomic = 0n;
  let treasuryShareAtomic = 0n;
  let authorShareFormatted = '0';
  let treasuryShareFormatted = '0';

  if (activeMode === 'POST_TIP') {
    treasuryShareAtomic = amountAtomicUnits / 5n; // floor(amount / 5) = 20%
    authorShareAtomic = amountAtomicUnits - treasuryShareAtomic; // 80%
    authorShareFormatted = (Number(authorShareAtomic) / 1_000_000).toFixed(2);
    treasuryShareFormatted = (Number(treasuryShareAtomic) / 1_000_000).toFixed(2);
  } else if (activeMode === 'PROJECT') {
    treasuryShareAtomic = amountAtomicUnits;
    treasuryShareFormatted = parsedAmount.toFixed(2);
  } else if (activeMode === 'MEMBERSHIP') {
    treasuryShareAtomic = 15_000_000n; // 15 USDC
    treasuryShareFormatted = '15.00';
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          closePayment();
        }
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-sage/80 bg-surface-card p-5 sm:p-7 shadow-2xl text-ink space-y-5 animate-in zoom-in-95 duration-200"
      >
        {/* Header with Title */}
        <div className="flex items-start justify-between gap-3 border-b border-sage/60 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-forest/10 text-forest text-[11px] font-bold uppercase tracking-wider">
              <SparklesIcon className="w-3.5 h-3.5 text-amber" />
              <span>
                {activeMode === 'PROJECT' && t('payment.projectTag')}
                {activeMode === 'POST_TIP' && t('payment.postTipTag')}
                {activeMode === 'MEMBERSHIP' && t('payment.membershipTag')}
              </span>
            </div>
            <h2 id="payment-modal-title" className="text-xl sm:text-2xl font-bold text-ink mt-1">
              {activeMode === 'PROJECT' && t('payment.projectTitle')}
              {activeMode === 'POST_TIP' && t('payment.postTipTitle')}
              {activeMode === 'MEMBERSHIP' && t('payment.membershipTitle')}
            </h2>
          </div>

          <button
            type="button"
            onClick={closePayment}
            className="p-1.5 rounded-control text-ink-muted hover:text-ink hover:bg-surface-canvas transition-colors"
            aria-label={t('payment.closeModal')}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Form View */}
        <div className="space-y-4">
          {/* Target Information Card */}
          <div className="rounded-xl border border-sage/70 bg-surface-canvas p-3.5 text-xs space-y-1.5">
            <div className="text-ink-muted font-medium uppercase tracking-wider text-[10px]">
              {activeMode === 'PROJECT' && t('payment.targetDestination')}
              {activeMode === 'POST_TIP' && t('payment.authorPostTarget')}
              {activeMode === 'MEMBERSHIP' && t('payment.beneficiaryAccount')}
            </div>

            {activeMode === 'PROJECT' && (
              <div>
                <div className="font-bold text-sm text-ink">{t('payment.projectFundName')}</div>
                <div className="text-ink-secondary text-[11px]">
                  {t('payment.projectFundDesc')}
                </div>
              </div>
            )}

            {activeMode === 'POST_TIP' && (
              <div>
                <div className="font-bold text-sm text-ink">
                  {initialData?.targetTitle || 'Ventlore Field Post'}
                </div>
                <div className="text-ink-secondary text-[11px] flex flex-wrap gap-2 mt-0.5">
                  <span>{t('payment.authorLabel')}: <strong>{initialData?.authorDisplayName || 'Ventlore Contributor'}</strong></span>
                  <span>{t('payment.receivingWallet')}: <code className="text-forest">{initialData?.authorWalletAddress || '0x88F...42C1'}</code></span>
                </div>

                {initialData?.isEligibleForTip === false && (
                  <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-[11px]">
                    ⚠️ {initialData.ineligibleReason || t('post.tipNotEligible')}
                  </div>
                )}
              </div>
            )}

            {activeMode === 'MEMBERSHIP' && (
              <div>
                {persona === 'guest' ? (
                  <div className="text-ink-secondary text-xs">
                    {t('payment.guestAccountNotice')}
                  </div>
                ) : (
                  <div>
                    <div className="font-bold text-sm text-ink flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-forest" />
                      <span>{session?.displayName} (@{session?.handle})</span>
                    </div>
                    <div className="text-ink-secondary text-[11px] mt-0.5">
                      {t('payment.vipTermDesc')}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* If Guest in MEMBERSHIP Mode: Show Login Gate (P0-02) */}
          {activeMode === 'MEMBERSHIP' && persona === 'guest' ? (
            <div className="p-4 sm:p-5 rounded-xl bg-amber-50 border border-amber-200 text-ink space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                <AlertTriangleIcon className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{t('payment.vipLoginRequiredTitle')}</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                {t('payment.vipLoginRequiredDesc')}
              </p>
              <div className="pt-1">
                <Link
                  href={getLocalizedPath('/login?returnTo=/vip')}
                  onClick={closePayment}
                  className="w-full min-h-control inline-flex items-center justify-center gap-2 py-3 rounded-control font-bold text-sm text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs"
                >
                  <span>{t('payment.vipLoginRequiredCta')}</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Amount Selection */}
              {activeMode !== 'MEMBERSHIP' ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-ink">
                    {t('payment.amountLabel')} ({selectedAsset}):
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['5', '10', '20', '50'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(preset)}
                        className={`min-h-[38px] py-1.5 rounded-lg border text-xs font-bold transition-all ${
                          amount === preset
                            ? 'border-forest bg-forest text-white'
                            : 'border-sage/80 bg-surface-canvas text-ink hover:border-forest'
                        }`}
                      >
                        {preset} {selectedAsset}
                      </button>
                    ))}
                  </div>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full min-h-control px-3 py-2 rounded-xl border border-sage text-sm font-bold bg-surface-canvas text-ink focus:outline-none focus:ring-2 focus:ring-forest"
                      placeholder={t('payment.customAmountPlaceholder')}
                    />
                    <div className="absolute right-3 top-2.5 text-xs font-bold text-ink-muted">
                      {selectedAsset}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-sage/80 bg-surface-canvas flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-sm text-ink">{t('payment.pegRate')}</div>
                    <div className="text-ink-muted text-[11px]">{t('payment.pegUsdc')}</div>
                  </div>
                  <span className="px-2 py-1 rounded bg-forest/10 text-forest font-bold text-xs">
                    {t('payment.standardPackage')}
                  </span>
                </div>
              )}

              {/* Split Breakdown for Tip */}
              {activeMode === 'POST_TIP' && (
                <div className="p-3 rounded-xl border border-forest/20 bg-forest/5 text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-ink">{t('payment.authorShare')}:</span>
                    <span className="font-bold text-forest">{authorShareFormatted} {selectedAsset}</span>
                  </div>
                  <div className="flex justify-between text-ink-muted">
                    <span>{t('payment.treasuryShare')}:</span>
                    <span>{treasuryShareFormatted} {selectedAsset}</span>
                  </div>
                  <div className="text-[10px] text-ink-muted pt-1 border-t border-forest/10">
                    {t('payment.tipSplitNotice')}
                  </div>
                </div>
              )}

              {/* Payment Gateway Information */}
              <div className="rounded-xl border border-sage/70 bg-surface-canvas p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink">{t('payment.method')}:</span>
                  <span className="font-mono text-ink">{t('payment.web3Wallet')}</span>
                </div>
                <div className="flex items-center justify-between border-t border-sage/40 pt-2">
                  <span className="text-ink-muted">{t('payment.gatewayStatus')}:</span>
                  <span className="font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                    {t('payment.gatewayConnecting')}
                  </span>
                </div>
              </div>

              {/* Action Button: Honest Availability State */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  disabled
                  className="w-full min-h-control py-3 rounded-control font-bold text-sm text-ink-muted bg-sage/40 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {t('payment.gatewayConnectingBtn')}
                </button>

                <p className="text-[11px] text-ink-muted text-center leading-relaxed">
                  {t('payment.gatewaySecurityNotice')}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
