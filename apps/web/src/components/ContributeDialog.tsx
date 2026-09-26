'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useI18n } from '../lib/i18n';
import { useSession } from './SessionContext';
import {
  CloseIcon,
  CompassIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  UserIcon,
} from './Icons';

import { usePayment } from './PaymentContext';

interface ContributeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContributeDialog({ isOpen, onClose }: ContributeDialogProps) {
  const { t, getLocalizedPath } = useI18n();
  const { persona } = useSession();
  const { openPayment } = usePayment();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Focus trap / prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contribute-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-sage/80 bg-surface-card p-5 sm:p-7 shadow-2xl space-y-5 text-ink animate-in zoom-in-95 duration-200"
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-start justify-between gap-4 border-b border-sage/60 pb-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest/10 text-forest text-xs font-bold uppercase tracking-wider">
              <CompassIcon className="w-3.5 h-3.5" />
              <span>Ventlore Community</span>
            </div>
            <h2 id="contribute-dialog-title" className="text-xl sm:text-2xl font-bold text-ink">
              {t('home.contributeDialogTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              {t('home.contributeDialogSubtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-control text-ink-muted hover:text-ink hover:bg-surface-canvas transition-colors"
            aria-label={t('common.close')}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Distinct Contribution Options */}
        <div className="space-y-3.5">
          {/* Option 1: Write Field Report / Propose Place */}
          <div className="rounded-xl border border-sage/80 bg-surface-canvas p-4 space-y-2.5 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-forest/10 text-forest flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-0.5 flex-1">
                <h3 className="font-bold text-sm sm:text-base text-ink">
                  {t('home.contributeOpt1Title')}
                </h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {t('home.contributeOpt1Desc')}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-sage/40">
              {persona === 'guest' ? (
                <Link
                  href={getLocalizedPath('/login?returnTo=/contribute')}
                  onClick={onClose}
                  className="min-h-control inline-flex items-center gap-1.5 px-3.5 py-2 rounded-control font-semibold text-xs text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{t('home.contributeOpt1Login')}</span>
                </Link>
              ) : (
                <Link
                  href={getLocalizedPath('/contribute')}
                  onClick={onClose}
                  className="min-h-control inline-flex items-center gap-1.5 px-3.5 py-2 rounded-control font-semibold text-xs text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs"
                >
                  <span>{t('home.contributeOpt1Open')}</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Option 2: Independent Field Auditor */}
          <div className="rounded-xl border border-sage/80 bg-surface-canvas p-4 space-y-2.5 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-forest/10 text-forest flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-0.5 flex-1">
                <h3 className="font-bold text-sm sm:text-base text-ink">
                  {t('home.contributeOpt2Title')}
                </h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {t('home.contributeOpt2Desc')}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-sage/40 flex flex-wrap gap-2">
              <Link
                href={getLocalizedPath('/expert')}
                onClick={onClose}
                className="min-h-control inline-flex items-center gap-1.5 px-3.5 py-2 rounded-control font-semibold text-xs text-forest bg-sage/40 hover:bg-sage/60 transition-colors"
              >
                <ShieldCheckIcon className="w-3.5 h-3.5" />
                <span>{t('home.contributeOpt2Open')}</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Option 3: Support Fund (PaymentModal PROJECT mode) */}
          <div className="rounded-xl border border-forest/30 bg-forest/5 p-4 space-y-2.5 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-0.5 flex-1">
                <h3 className="font-bold text-sm sm:text-base text-forest">
                  {t('payment.projectTitle')}
                </h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {t('home.contributeOption3Desc')}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-forest/20">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openPayment('PROJECT');
                }}
                className="min-h-control inline-flex items-center gap-1.5 px-4 py-2 rounded-control font-bold text-xs text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs"
              >
                <SparklesIcon className="w-3.5 h-3.5 text-amber" />
                <span>{t('payment.projectTitle')}</span>
              </button>
            </div>
          </div>

          {/* Option 4: VIP & Public Transparency Ledger */}
          <div className="rounded-xl border border-sage/80 bg-surface-canvas p-4 space-y-2.5 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-forest/10 text-forest flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                4
              </div>
              <div className="space-y-0.5 flex-1">
                <h3 className="font-bold text-sm sm:text-base text-ink">
                  {t('home.contributeOpt4Title')}
                </h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {t('home.contributeOpt4Desc')}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-sage/40">
              <Link
                href={getLocalizedPath('/vip')}
                onClick={onClose}
                className="min-h-control inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control font-semibold text-xs text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs"
              >
                <SparklesIcon className="w-3.5 h-3.5 text-amber" />
                <span>{t('home.contributeOpt4Vip')}</span>
              </Link>
              <Link
                href={getLocalizedPath('/transparency')}
                onClick={onClose}
                className="min-h-control inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control font-semibold text-xs text-forest bg-sage/40 hover:bg-sage/60 transition-colors"
              >
                <span>{t('home.contributeOpt4Ledger')}</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="text-center pt-2 border-t border-sage/60 text-xs text-ink-muted">
          <span>Ventlore Foundation • </span>
          <span className="text-forest font-semibold">{t('place.noAbsoluteSafety')}</span>
        </div>
      </div>
    </div>
  );
}
