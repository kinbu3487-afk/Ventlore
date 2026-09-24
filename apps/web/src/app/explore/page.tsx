'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { SearchFilters } from '@/components/SearchFilters';
import { PlaceResults } from '@/components/PlaceResults';
import { AsyncState } from '@/components/AsyncState';
import { mockApiClient, PlaceSummaryDTO } from '@ventlore/api-client';
import { useSession } from '@/components/SessionContext';
import { useI18n } from '@/lib/i18n';
import { CompassIcon, ShieldCheckIcon, SparklesIcon, ArrowRightIcon } from '@/components/Icons';

export default function ExplorePage() {
  const { persona } = useSession();
  const { t, locale, getLocalizedPath } = useI18n();
  const [query, setQuery] = useState('');
  const [regionId, setRegionId] = useState('all');
  const [activity, setActivity] = useState('all');
  const [places, setPlaces] = useState<PlaceSummaryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchPlaces() {
      setIsLoading(true);
      try {
        const res = await mockApiClient.listPlaces({
          query,
          regionId,
          activity,
          locale,
        });
        if (active) {
          setPlaces(res.items);
          setIsLoading(false);
        }
      } catch {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    fetchPlaces();
    return () => {
      active = false;
    };
  }, [query, regionId, activity, persona, locale]);

  const handleClearFilters = () => {
    setQuery('');
    setRegionId('all');
    setActivity('all');
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* 1. Visual Hero Section: 2 Columns (Left: Ivory Background, Right: Landscape) */}
        <section
          aria-label="Hero overview"
          className="rounded-card border border-sage/80 bg-surface-card overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-center"
        >
          {/* Left Column: Ivory Background with Ink typography */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-4 bg-surface-card">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest text-ivory text-xs font-bold shadow-xs">
                <CompassIcon className="w-3.5 h-3.5 text-amber" />
                {t('explore.badge')}
              </span>
              <span className="text-xs text-ink-secondary flex items-center gap-1 font-medium">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-forest" />
                {t('explore.independentAudit')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink leading-tight">
              {t('explore.heroTitle')}
            </h1>

            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-xl">
              {t('explore.heroSubtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#search-bar"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-control font-bold text-xs sm:text-sm text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs"
              >
                <span>{t('explore.heroCta')}</span>
                <ArrowRightIcon className="w-4 h-4" />
              </a>
              <Link
                href={getLocalizedPath('/login')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-control font-semibold text-xs sm:text-sm text-forest bg-sage/50 hover:bg-sage transition-colors border border-sage"
              >
                <span>{t('explore.heroCtaSecondary')}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Landscape Visual Framing */}
          <div className="lg:col-span-5 relative h-48 sm:h-64 lg:h-full min-h-[220px] bg-forest overflow-hidden">
            <img
              src="/destinations/hero-coastal.svg"
              alt="Hải trình ven biển và vách đá đảo Cát Bà"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-surface-card lg:via-transparent lg:to-transparent opacity-80" />
            <div className="absolute bottom-3 right-3 bg-forest/80 backdrop-blur-xs text-ivory text-[10px] px-2 py-0.5 rounded font-mono">
              Vịnh Lan Hạ • Cát Bà
            </div>
          </div>
        </section>

        {/* 2. 56px Search & Filter Bar (C02) */}
        <SearchFilters
          query={query}
          regionId={regionId}
          activity={activity}
          onQueryChange={setQuery}
          onRegionChange={setRegionId}
          onActivityChange={setActivity}
          onClearFilters={handleClearFilters}
        />

        {/* 3. Results (C03) & Async State (C46) */}
        <AsyncState
          isLoading={isLoading}
          isEmpty={places.length === 0}
          emptyMessage={t('explore.noPlacesFound')}
          onRetry={handleClearFilters}
        >
          <PlaceResults places={places} />
        </AsyncState>

        {/* 4. Community Discovery Banner ("Bạn hiểu nơi này?") */}
        <div className="rounded-card border border-sage bg-surface-card p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-forest bg-sage/60 px-3 py-1 rounded-full">
              <SparklesIcon className="w-3.5 h-3.5" />
              {t('explore.communityBannerTag')}
            </div>
            <h3 className="text-xl font-bold text-ink">
              {t('explore.communityBannerTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              {t('explore.communityBannerDesc')}
            </p>
          </div>

          <Link
            href={getLocalizedPath('/login')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-control font-bold text-xs sm:text-sm text-white bg-forest hover:bg-forest-hover transition-colors shadow-sm shrink-0"
          >
            <span>{t('explore.proposePlaceButton')}</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
