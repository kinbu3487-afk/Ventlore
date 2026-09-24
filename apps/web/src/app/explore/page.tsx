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
        {/* 1. Visual Hero Section with Landscape Backdrop */}
        <div className="relative rounded-card overflow-hidden bg-forest text-ivory shadow-md border border-[#1f4e42]">
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              src="/destinations/hero-coastal.svg"
              alt="Coastal Landscape"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#173F35] via-[#173F35]/90 to-transparent z-0" />

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber text-ink text-xs font-bold shadow-xs">
                <CompassIcon className="w-3.5 h-3.5" />
                {t('explore.badge')}
              </span>
              <span className="text-xs text-ivory/80 flex items-center gap-1">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-amber" />
                {t('explore.independentAudit')}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {t('explore.heroTitle')}
            </h1>

            <p className="text-sm sm:text-base text-ivory/90 leading-relaxed max-w-2xl">
              {t('explore.heroSubtitle')}
            </p>
          </div>
        </div>

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
