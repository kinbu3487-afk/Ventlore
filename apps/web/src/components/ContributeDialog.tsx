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

interface ContributeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContributeDialog({ isOpen, onClose }: ContributeDialogProps) {
  const { t, getLocalizedPath } = useI18n();
  const { persona } = useSession();
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
        className="relative w-full max-w-xl rounded-2xl border border-sage/80 bg-surface-card p-6 sm:p-8 shadow-2xl space-y-6 text-ink animate-in zoom-in-95 duration-200"
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-start justify-between gap-4 border-b border-sage/60 pb-4">
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
            className="p-2 rounded-control text-ink-muted hover:text-ink hover:bg-surface-canvas transition-colors"
            aria-label={t('common.close')}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Real Options */}
        <div className="space-y-4">
          {/* Option 1: Submit Field Report */}
          <div className="rounded-xl border border-sage/80 bg-surface-canvas p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-forest/10 text-forest flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-sm sm:text-base text-ink">
                  {t('home.contributeOption1Title')}
                </h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {t('home.contributeOption1Desc')}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2.5 border-t border-sage/40">
              {persona === 'guest' ? (
                <Link
                  href={getLocalizedPath('/login?returnTo=/explore')}
                  onClick={onClose}
                  className="min-h-control inline-flex items-center gap-1.5 px-4 py-2 rounded-control font-semibold text-xs text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{t('home.contributeOption1ActionGuest')}</span>
                </Link>
              ) : (
                <div className="w-full space-y-2">
                  <div className="p-2 rounded bg-amber/10 border border-amber/20 text-[11px] font-medium text-amber-900 dark:text-amber-300">
                    ℹ️ {t('home.contributeOption1StatusFe02')}
                  </div>
                  <Link
                    href={getLocalizedPath('/posts/018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e20')}
                    onClick={onClose}
                    className="min-h-control inline-flex items-center gap-1.5 px-4 py-2 rounded-control font-semibold text-xs text-forest bg-sage/40 hover:bg-sage/60 transition-colors"
                  >
                    <span>{t('home.contributeOption1ActionMember')}</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Option 2: Independent Field Auditor */}
          <div className="rounded-xl border border-sage/80 bg-surface-canvas p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-forest/10 text-forest flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-sm sm:text-base text-ink">
                  {t('home.contributeOption2Title')}
                </h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {t('home.contributeOption2Desc')}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-sage/40">
              <Link
                href={getLocalizedPath('/people/hoang_ranger')}
                onClick={onClose}
                className="min-h-control inline-flex items-center gap-1.5 px-4 py-2 rounded-control font-semibold text-xs text-forest bg-sage/40 hover:bg-sage/60 transition-colors"
              >
                <ShieldCheckIcon className="w-3.5 h-3.5" />
                <span>{t('home.contributeOption2Action')}</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Option 3: Support Fund & VIP Plan */}
          <div className="rounded-xl border border-sage/80 bg-surface-canvas p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-forest/10 text-forest flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-sm sm:text-base text-ink">
                  {t('home.contributeOption3Title')}
                </h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {t('home.contributeOption3Desc')}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2.5 border-t border-sage/40">
              <Link
                href={getLocalizedPath('/vip')}
                onClick={onClose}
                className="min-h-control inline-flex items-center gap-1.5 px-4 py-2 rounded-control font-semibold text-xs text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs"
              >
                <SparklesIcon className="w-3.5 h-3.5 text-amber" />
                <span>{t('home.contributeOption3ActionVip')}</span>
              </Link>
              <Link
                href={getLocalizedPath('/transparency')}
                onClick={onClose}
                className="min-h-control inline-flex items-center gap-1.5 px-4 py-2 rounded-control font-semibold text-xs text-forest bg-sage/40 hover:bg-sage/60 transition-colors"
              >
                <span>{t('home.contributeOption3ActionLedger')}</span>
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
