'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlaceSummaryDTO, mockApiClient } from '@ventlore/api-client';
import { PlaceStatus } from '@ventlore/domain';
import { useI18n } from '../lib/i18n';
import {
  CompassIcon,
  MapPinIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  SparklesIcon,
  TargetIcon,
} from './Icons';

export function HomePageView() {
  const { t, getLocalizedPath } = useI18n();
  const [featuredPlaces, setFeaturedPlaces] = useState<PlaceSummaryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    mockApiClient
      .listPlaces()
      .then((res) => {
        if (isMounted) {
          // Lấy tối đa 3 địa điểm ACTIVE
          const activePlaces = res.items.filter((p) => p.status === PlaceStatus.ACTIVE).slice(0, 3);
          setFeaturedPlaces(activePlaces.length > 0 ? activePlaces : res.items.slice(0, 3));
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: THIÊN TAI VÀ SỰ GIÚP ĐỠ NHAU (CHỮ CHÍNH GIỮA ẢNH) */}
      {/* ========================================================================= */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 sm:-mt-10 overflow-hidden rounded-b-2xl shadow-xl">
        {/* Background Image Container */}
        <div className="relative min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] w-full flex items-center justify-center bg-slate-900">
          <picture className="absolute inset-0 w-full h-full">
            <source srcSet="/destinations/hero-storm-solidarity.jpg" type="image/jpeg" />
            <img
              src="/destinations/hero-storm-solidarity.svg"
              alt={t('home.imageAttribution')}
              className="w-full h-full object-cover object-center filter brightness-[0.88]"
            />
          </picture>

          {/* Contrast Protection Overlay (Gradient for WCAG AAA compliance) */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75 pointer-events-none"
            aria-hidden="true"
          />

          {/* Centered Hero Content Block (Bắt buộc H1 và toàn bộ cụm nằm chính giữa) */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center flex flex-col items-center justify-center">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/80 backdrop-blur-md text-ivory text-xs font-semibold uppercase tracking-wider border border-white/20 shadow-md mb-6">
              <CompassIcon className="w-3.5 h-3.5 text-amber" />
              <span>{t('explore.badge')}</span>
            </div>

            {/* H1 - Centered Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-md max-w-3xl leading-[1.15]">
              {t('home.heroTitle')}
            </h1>

            {/* Subtitle - Outdoor Accidents Prevention Notice */}
            <p className="mt-4 sm:mt-5 text-base sm:text-xl font-medium text-amber-200 drop-shadow max-w-2xl leading-snug">
              {t('home.heroSubtitle')}
            </p>

            {/* Description */}
            <p className="mt-3 text-sm sm:text-base text-white/90 drop-shadow max-w-2xl leading-relaxed">
              {t('home.heroDesc')}
            </p>

            {/* 2 Centered CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href={getLocalizedPath('/explore')}
                className="min-h-control w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-control font-bold text-sm sm:text-base text-ink bg-amber hover:bg-amber-light active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
              >
                <span>{t('home.ctaExplore')}</span>
                <ArrowRightIcon className="w-4 h-4 text-ink" />
              </Link>

              <a
                href="#contribute"
                className="min-h-control w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-control font-semibold text-sm sm:text-base text-white bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md transition-all shadow-md"
              >
                <span>{t('home.ctaContribute')}</span>
              </a>
            </div>

            {/* Image Attribution Caption */}
            <div className="mt-8 text-xs text-white/70 italic text-center max-w-xl">
              {t('home.imageAttribution')}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. VÌ SAO VENTLORE TỒN TẠI? (WHY VENTLORE EXISTS) */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/40 text-forest text-xs font-semibold uppercase tracking-wider">
            <AlertTriangleIcon className="w-3.5 h-3.5 text-amber" />
            <span>Ventlore Foundation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            {t('home.whyTitle')}
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
            {t('home.whyDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Unverified info */}
          <div className="rounded-card border border-sage bg-surface-card p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 flex items-center justify-center font-bold">
                <AlertTriangleIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-ink">{t('home.whyCard1Title')}</h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {t('home.whyCard1Desc')}
              </p>
            </div>
          </div>

          {/* Card 2: Terrain shift */}
          <div className="rounded-card border border-sage bg-surface-card p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 flex items-center justify-center font-bold">
                <CompassIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-ink">{t('home.whyCard2Title')}</h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {t('home.whyCard2Desc')}
              </p>
            </div>
          </div>

          {/* Card 3: Community solidarity */}
          <div className="rounded-card border border-sage bg-surface-card p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest/10 text-forest flex items-center justify-center font-bold">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-ink">{t('home.whyCard3Title')}</h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {t('home.whyCard3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TẦM NHÌN & SỨ MỆNH (#mission) */}
      {/* ========================================================================= */}
      <section id="mission" className="scroll-mt-24 rounded-2xl bg-forest text-ivory p-8 sm:p-12 shadow-lg">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber text-xs font-semibold tracking-wider uppercase">
              <TargetIcon className="w-3.5 h-3.5" />
              <span>{t('home.missionSectionTitle')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {t('home.missionSectionTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="bg-white/10 rounded-xl p-6 border border-white/10 space-y-3">
              <div className="text-amber font-bold text-lg flex items-center gap-2">
                <SparklesIcon className="w-5 h-5" />
                <span>{t('home.visionTitle')}</span>
              </div>
              <p className="text-sm text-ivory/90 leading-relaxed">
                {t('home.visionDesc')}
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-6 border border-white/10 space-y-3">
              <div className="text-amber font-bold text-lg flex items-center gap-2">
                <TargetIcon className="w-5 h-5" />
                <span>{t('home.missionTitle')}</span>
              </div>
              <p className="text-sm text-ivory/90 leading-relaxed">
                {t('home.missionDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CÁCH VENTLORE HOẠT ĐỘNG (HOW VENTLORE WORKS) */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            {t('home.howTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-card border border-sage bg-surface-card p-6 shadow-xs space-y-3">
            <div className="text-xs font-mono font-bold text-forest uppercase tracking-wider">
              {t('home.howStep1Title')}
            </div>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              {t('home.howStep1Desc')}
            </p>
          </div>

          <div className="rounded-card border border-sage bg-surface-card p-6 shadow-xs space-y-3">
            <div className="text-xs font-mono font-bold text-forest uppercase tracking-wider">
              {t('home.howStep2Title')}
            </div>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              {t('home.howStep2Desc')}
            </p>
          </div>

          <div className="rounded-card border border-sage bg-surface-card p-6 shadow-xs space-y-3">
            <div className="text-xs font-mono font-bold text-forest uppercase tracking-wider">
              {t('home.howStep3Title')}
            </div>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              {t('home.howStep3Desc')}
            </p>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="rounded-card border border-amber/30 bg-amber/10 p-4 sm:p-5 flex items-start gap-3.5">
          <AlertTriangleIcon className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-ink leading-relaxed font-medium">
            {t('home.howSafetyNotice')}
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BẮT ĐẦU KHÁM PHÁ (FEATURED DESTINATIONS) */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              {t('home.featuredPlacesTitle')}
            </h2>
            <p className="text-sm text-ink-secondary">
              {t('home.featuredPlacesSubtitle')}
            </p>
          </div>
          <Link
            href={getLocalizedPath('/explore')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-hover transition-colors shrink-0"
          >
            <span>{t('home.viewAllPlaces')}</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-card border border-sage bg-surface-card overflow-hidden animate-pulse">
                <div className="aspect-[16/9] bg-sage/30 w-full" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-sage/40 rounded" />
                  <div className="h-4 w-1/2 bg-sage/30 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPlaces.map((place) => {
              const coverImage = place.coverImageUrl || place.imageUrl || '/destinations/hero-coastal.svg';
              return (
                <div
                  key={place.placeId}
                  className="rounded-card border border-sage bg-surface-card overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                      <img
                        src={coverImage}
                        alt={place.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 px-2 py-1 rounded bg-forest/80 backdrop-blur-sm text-ivory text-[11px] font-semibold">
                        {place.displayCode}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
                        <MapPinIcon className="w-4 h-4 text-forest shrink-0" />
                        <span className="truncate">{place.regionName}</span>
                      </div>

                      <h3 className="font-bold text-lg text-ink line-clamp-1">{place.name}</h3>

                      <p className="text-xs sm:text-sm text-ink-secondary line-clamp-2 leading-relaxed">
                        {place.summary}
                      </p>

                      {place.warnings && place.warnings.length > 0 && (
                        <div className="flex items-start gap-1.5 p-2 rounded bg-amber/10 border border-amber/20 text-xs text-ink">
                          <AlertTriangleIcon className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{place.warnings[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      href={getLocalizedPath(`/places/${place.placeId}`)}
                      className="min-h-control w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-control text-xs font-semibold text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs"
                    >
                      <span>{t('explore.viewPlace')}</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 6. PHẦN ĐÓNG GÓP (#contribute) */}
      {/* ========================================================================= */}
      <section id="contribute" className="scroll-mt-24 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            {t('home.contributeSectionTitle')}
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
            {t('home.contributeSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Way 1: Submit post */}
          <div className="rounded-card border border-sage bg-surface-card p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest/10 text-forest flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-base sm:text-lg text-ink">
                {t('home.contribWay1Title')}
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {t('home.contribWay1Desc')}
              </p>
            </div>
            <Link
              href={getLocalizedPath('/explore')}
              className="min-h-control inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-control text-xs font-semibold text-forest bg-sage/30 hover:bg-sage/50 transition-colors"
            >
              <span>{t('home.contribWay1Action')}</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Way 2: Auditor */}
          <div className="rounded-card border border-sage bg-surface-card p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest/10 text-forest flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-base sm:text-lg text-ink">
                {t('home.contribWay2Title')}
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {t('home.contribWay2Desc')}
              </p>
            </div>
            <Link
              href={getLocalizedPath('/people/hoang_ranger')}
              className="min-h-control inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-control text-xs font-semibold text-forest bg-sage/30 hover:bg-sage/50 transition-colors"
            >
              <span>{t('home.contribWay2Action')}</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Way 3: Fund & VIP */}
          <div className="rounded-card border border-sage bg-surface-card p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest/10 text-forest flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-base sm:text-lg text-ink">
                {t('home.contribWay3Title')}
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {t('home.contribWay3Desc')}
              </p>
            </div>
            <Link
              href={getLocalizedPath('/vip')}
              className="min-h-control inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-control text-xs font-semibold text-forest bg-sage/30 hover:bg-sage/50 transition-colors"
            >
              <span>{t('home.contribWay3Action')}</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. MINH BẠCH TÀI CHÍNH & FINAL CTA */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        {/* Transparency Banner */}
        <div className="rounded-2xl border border-sage bg-surface-card p-8 sm:p-10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest uppercase tracking-wider">
              <ShieldCheckIcon className="w-4 h-4 text-forest" />
              <span>{t('home.transparencyTitle')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-ink">
              {t('home.transparencyTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              {t('home.transparencyDesc')}
            </p>
          </div>
          <Link
            href={getLocalizedPath('/transparency')}
            className="min-h-control inline-flex items-center justify-center gap-2 px-6 py-3 rounded-control text-xs sm:text-sm font-semibold text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs shrink-0"
          >
            <span>{t('home.transparencyAction')}</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Final CTA Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#173F35] to-[#122e27] text-ivory p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {t('home.finalCtaTitle')}
            </h3>
            <p className="text-sm sm:text-base text-ivory/80 leading-relaxed">
              {t('home.finalCtaDesc')}
            </p>
          </div>
          <div>
            <Link
              href={getLocalizedPath('/explore')}
              className="min-h-control inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-control font-bold text-sm sm:text-base text-ink bg-amber hover:bg-amber-light active:scale-[0.98] transition-all shadow-lg"
            >
              <span>{t('home.finalCtaAction')}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
