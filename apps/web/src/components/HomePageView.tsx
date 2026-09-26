'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '../lib/i18n';
import { CompassIcon, ArrowRightIcon, TableIcon, DownloadIcon } from './Icons';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ContributeDialog } from './ContributeDialog';

export function HomePageView() {
  const { t, getLocalizedPath } = useI18n();
  const [isContributeOpen, setIsContributeOpen] = useState(false);

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-x-hidden bg-slate-950 text-white">
      {/* Background Image Container with Gradients */}
      <div className="absolute inset-0 w-full h-full overflow-hidden" aria-hidden="true">
        <picture className="w-full h-full">
          <source srcSet="/destinations/hero-storm-solidarity.jpg" type="image/jpeg" />
          <img
            src="/destinations/hero-storm-solidarity.svg"
            alt={t('home.imageAttribution')}
            className="w-full h-full object-cover object-center filter brightness-[0.82]"
          />
        </picture>
        {/* Contrast Protection Gradients (WCAG AAA contrast against text) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/85 pointer-events-none" />
      </div>

      {/* Top Header Bar: Logo (left), Data Map link and 6-Language Switcher (right) */}
      <header className="relative z-10 w-full flex items-center justify-between px-4 sm:px-8 py-5">
        <Link
          href={getLocalizedPath('/')}
          className="inline-flex items-center gap-2.5 text-ivory hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-waypoint rounded-control p-1"
          aria-label="Ventlore Home"
        >
          <div className="w-9 h-9 rounded-lg bg-forest border border-sage/40 flex items-center justify-center text-ivory font-bold shadow-md">
            <CompassIcon className="w-5 h-5 text-amber" />
          </div>
          <span className="font-heading font-bold text-xl sm:text-2xl tracking-tight text-white drop-shadow">
            Ventlore
          </span>
        </Link>

        {/* Right side: 6-Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher variant="dark" />
        </div>
      </header>

      {/* Centered Hero Content Block: H1 and Actions directly centered */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center flex flex-col items-center justify-center flex-1 my-auto">
        {/* H1 Title: Centered, balanced, no orphan words */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg max-w-3xl text-balance leading-[1.18]">
          {t('home.heroTitle')}
        </h1>

        {/* Subtitle: Short mission notice on outdoor risk reduction */}
        <p className="mt-4 sm:mt-6 text-base sm:text-xl font-medium text-amber-200 drop-shadow max-w-2xl text-balance leading-snug">
          {t('home.heroSubtitle')}
        </p>

        {/* Exactly 2 Centered CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href={getLocalizedPath('/explore')}
            className="min-h-control w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-control font-bold text-sm sm:text-base text-ink bg-amber hover:bg-amber-light active:scale-[0.98] transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-waypoint"
          >
            <span>{t('home.ctaExplore')}</span>
            <ArrowRightIcon className="w-4 h-4 text-ink" />
          </Link>

          <button
            type="button"
            onClick={() => setIsContributeOpen(true)}
            className="min-h-control w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-control font-semibold text-sm sm:text-base text-white bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md transition-all shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <span>{t('home.ctaContribute')}</span>
          </button>
        </div>
      </main>

      {/* Bottom Image Attribution Caption */}
      <footer className="relative z-10 w-full px-4 sm:px-8 py-4 text-center text-xs text-white/70 italic drop-shadow">
        {t('home.imageAttribution')}
      </footer>

      {/* Contribute Options Modal */}
      <ContributeDialog
        isOpen={isContributeOpen}
        onClose={() => setIsContributeOpen(false)}
      />
    </div>
  );
}
