'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useI18n } from '../lib/i18n';
import {
  CloseIcon,
  CompassIcon,
  ShieldCheckIcon,
  TargetIcon,
  ArrowRightIcon,
  SparklesIcon,
} from './Icons';

interface MissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MissionDialog({ isOpen, onClose }: MissionDialogProps) {
  const { t, getLocalizedPath } = useI18n();
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

  // Body scroll lock
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
      aria-labelledby="mission-dialog-title"
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
              <TargetIcon className="w-3.5 h-3.5 text-amber" />
              <span>Ventlore Manifesto</span>
            </div>
            <h2 id="mission-dialog-title" className="text-xl sm:text-2xl font-bold text-ink">
              {t('home.missionDialogTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              {t('home.missionDialogSubtitle')}
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

        {/* 3 Core Principles */}
        <div className="space-y-3.5">
          {/* Principle 1: Objectivity & Independence */}
          <div className="rounded-xl border border-sage/80 bg-surface-canvas p-4 space-y-2 shadow-xs">
            <div className="flex items-center gap-2.5 text-forest font-bold text-sm sm:text-base">
              <ShieldCheckIcon className="w-5 h-5 text-forest shrink-0" />
              <h3>{t('home.missionPrinciple1Title')}</h3>
            </div>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed pl-7">
              {t('home.missionPrinciple1Desc')}
            </p>
          </div>

          {/* Principle 2: Immutable Transparency */}
          <div className="rounded-xl border border-sage/80 bg-surface-canvas p-4 space-y-2 shadow-xs">
            <div className="flex items-center gap-2.5 text-amber font-bold text-sm sm:text-base">
              <CompassIcon className="w-5 h-5 text-amber shrink-0" />
              <h3>{t('home.missionPrinciple2Title')}</h3>
            </div>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed pl-7">
              {t('home.missionPrinciple2Desc')}
            </p>
          </div>

          {/* Principle 3: Community Owned */}
          <div className="rounded-xl border border-sage/80 bg-surface-canvas p-4 space-y-2 shadow-xs">
            <div className="flex items-center gap-2.5 text-sage font-bold text-sm sm:text-base">
              <SparklesIcon className="w-5 h-5 text-sage shrink-0" />
              <h3>{t('home.missionPrinciple3Title')}</h3>
            </div>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed pl-7">
              {t('home.missionPrinciple3Desc')}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-sage/60">
          <button
            type="button"
            onClick={onClose}
            className="min-h-control px-4 py-2 rounded-control font-semibold text-xs sm:text-sm text-ink hover:bg-surface-canvas transition-colors"
          >
            {t('home.missionClose')}
          </button>
          <Link
            href={getLocalizedPath('/explore')}
            onClick={onClose}
            className="min-h-control inline-flex items-center gap-2 px-5 py-2 rounded-control font-bold text-xs sm:text-sm text-ink bg-amber hover:bg-amber-light active:scale-[0.98] transition-all shadow-sm"
          >
            <span>{t('home.missionExploreCta')}</span>
            <ArrowRightIcon className="w-4 h-4 text-ink" />
          </Link>
        </div>
      </div>
    </div>
  );
}
