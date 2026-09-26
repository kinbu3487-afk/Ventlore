'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { SearchFilters } from '@/components/SearchFilters';
import { PlaceResults } from '@/components/PlaceResults';
import { AsyncState } from '@/components/AsyncState';
import { mockApiClient, PlaceSummaryDTO } from '@ventlore/api-client';
import { useSession } from '@/components/SessionContext';
import { useI18n } from '@/lib/i18n';
import { CompassIcon, ShieldCheckIcon, SparklesIcon, ArrowRightIcon } from '@/components/Icons';
import { Origin } from '@/lib/nearby';

function ExploreViewInner() {
  const { persona } = useSession();
  const { t, locale, getLocalizedPath } = useI18n();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState('');
  const [provinceCode, setProvinceCode] = useState('all');
  const [activityId, setActivityId] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [page, setPage] = useState(1);
  const [isUrlInitialized, setIsUrlInitialized] = useState(false);

  // In-memory geolocation state (never persisted to URL or storage per Section 5)
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [radiusKm, setRadiusKm] = useState<number | null>(null);

  // Discovery results state
  const [queryData, setQueryData] = useState<{
    items: PlaceSummaryDTO[];
    allMatches: PlaceSummaryDTO[];
    mappableMatches: PlaceSummaryDTO[];
    nearestOutsideRadius: PlaceSummaryDTO[];
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  }>({
    items: [],
    allMatches: [],
    mappableMatches: [],
    nearestOutsideRadius: [],
    total: 0,
    totalPages: 1,
    page: 1,
    pageSize: 12,
  });
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initialize state from URL search params
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const prov = searchParams.get('province') || searchParams.get('region') || 'all';
    // Convert legacy region if needed
    const normalizedProv = prov.startsWith('reg-prov-') ? prov.replace('reg-prov-', '') : prov;
    const a = searchParams.get('activity') || 'all';
    const v = searchParams.get('view') === 'map' ? 'map' : 'list';
    const p = parseInt(searchParams.get('page') || '1', 10);

    setQuery(q);
    setProvinceCode(normalizedProv);
    setActivityId(a);
    setViewMode(v);
    setPage(Number.isInteger(p) && p > 0 ? p : 1);
    setIsUrlInitialized(true);
  }, [searchParams]);

  // 2. Handle browser Back/Forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      setQuery(p.get('q') || '');
      const prov = p.get('province') || p.get('region') || 'all';
      setProvinceCode(prov.startsWith('reg-prov-') ? prov.replace('reg-prov-', '') : prov);
      setActivityId(p.get('activity') || 'all');
      setViewMode(p.get('view') === 'map' ? 'map' : 'list');
      const pageNum = parseInt(p.get('page') || '1', 10);
      setPage(Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 3. Keep URL in sync with state changes (EXCLUDING memory origin/coordinates)
  useEffect(() => {
    if (!isUrlInitialized || typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    if (query) p.set('q', query); else p.delete('q');
    if (provinceCode && provinceCode !== 'all') p.set('province', provinceCode); else p.delete('province');
    if (activityId && activityId !== 'all') p.set('activity', activityId); else p.delete('activity');
    if (viewMode === 'map') p.set('view', 'map'); else p.delete('view');
    if (page > 1) p.set('page', String(page)); else p.delete('page');

    const searchStr = p.toString();
    const targetUrl = searchStr ? `${window.location.pathname}?${searchStr}` : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (targetUrl !== currentUrl) {
      window.history.replaceState(null, '', targetUrl);
    }
  }, [query, provinceCode, activityId, viewMode, page, isUrlInitialized]);

  // 4. Fetch / Query places using unified pipeline (Catalog -> filter -> distance -> radius -> sort -> paginate)
  useEffect(() => {
    let active = true;
    async function fetchPlaces() {
      setIsLoading(true);
      try {
        const res = await mockApiClient.listPlaces({
          query,
          provinceCode: provinceCode !== 'all' ? provinceCode : null,
          activityId: activityId !== 'all' ? activityId : null,
          origin,
          radiusKm,
          sort: origin ? 'distance' : 'catalog',
          page,
          pageSize: 12,
          locale,
        });

        if (active) {
          setQueryData({
            items: res.items,
            allMatches: res.allMatches || res.items,
            mappableMatches: res.mappableMatches || res.items,
            nearestOutsideRadius: res.nearestOutsideRadius || [],
            total: res.total,
            totalPages: res.totalPages || Math.ceil(res.total / 12) || 1,
            page: res.page || page,
            pageSize: res.pageSize || 12,
          });
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
  }, [query, provinceCode, activityId, origin, radiusKm, page, persona, locale]);

  // Handlers that reset page to 1 on filter/search change
  const handleQueryChange = (q: string) => {
    setQuery(q);
    setPage(1);
  };

  const handleProvinceChange = (p: string) => {
    setProvinceCode(p);
    setPage(1);
  };

  const handleActivityChange = (a: string) => {
    setActivityId(a);
    setPage(1);
  };

  const handleOriginChange = (newOrigin: Origin | null) => {
    setOrigin(newOrigin);
    setPage(1);
    if (newOrigin && (radiusKm === null || radiusKm === undefined)) {
      setRadiusKm(50); // Default to 50 km per Section 6
    } else if (!newOrigin) {
      setRadiusKm(null);
    }
  };

  const handleRadiusChange = (newRadius: number | null) => {
    setRadiusKm(newRadius);
    setPage(1);
  };

  const handleClearFilters = () => {
    setQuery('');
    setProvinceCode('all');
    setActivityId('all');
    setOrigin(null);
    setRadiusKm(null);
    setPage(1);
  };

  return (
    <AppShell>
      <div className="space-y-5 sm:space-y-6">
        {/* 1. Header Overview: Above-the-fold with quick access */}
        <section
          aria-label="Explore header"
          className="rounded-card border border-sage/80 bg-surface-card p-4 sm:p-6 shadow-sm space-y-2"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest text-ivory text-xs font-bold shadow-xs">
              <CompassIcon className="w-3.5 h-3.5 text-amber" />
              {t('explore.badge')}
            </span>
            <span className="text-xs text-ink-secondary flex items-center gap-1 font-medium">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-forest" />
              {t('explore.independentAudit')}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-ink leading-snug">
            {t('explore.heroTitle')}
          </h1>

          <p className="text-xs sm:text-sm text-ink-secondary leading-normal max-w-2xl">
            {t('explore.heroSubtitle')}
          </p>
        </section>

        {/* 2. 56px Search & Filter Bar with 34 Provinces & Gần tôi */}
        <SearchFilters
          query={query}
          provinceCode={provinceCode}
          activityId={activityId}
          origin={origin}
          radiusKm={radiusKm}
          onQueryChange={handleQueryChange}
          onProvinceChange={handleProvinceChange}
          onActivityChange={handleActivityChange}
          onOriginChange={handleOriginChange}
          onRadiusChange={handleRadiusChange}
          onClearFilters={handleClearFilters}
        />

        {/* 3. Results with Pagination, Distance Badges, Map Sync, & Fallbacks */}
        <AsyncState
          isLoading={isLoading}
          isEmpty={false}
          onRetry={handleClearFilters}
        >
          <PlaceResults
            places={queryData.items}
            allPlaces={queryData.allMatches}
            mappablePlaces={queryData.mappableMatches}
            nearestOutsideRadius={queryData.nearestOutsideRadius}
            total={queryData.total}
            totalPages={queryData.totalPages}
            page={queryData.page}
            pageSize={queryData.pageSize}
            origin={origin}
            radiusKm={radiusKm}
            onPageChange={setPage}
            onExpandRadius={handleRadiusChange}
            onSelectRegion={() => {
              const el = document.getElementById('province-filter');
              el?.focus();
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </AsyncState>

        {/* 4. Community Discovery Banner ("Bạn có dữ liệu thực địa mới?") */}
        <div className="rounded-card border border-sage bg-surface-card p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-forest bg-sage/60 px-3 py-0.5 rounded-full">
              <SparklesIcon className="w-3.5 h-3.5" />
              {t('explore.communityBannerTag')}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-ink">
              {t('explore.communityBannerTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              {t('explore.communityBannerDesc')}
            </p>
          </div>

          <Link
            href={getLocalizedPath('/login')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-control font-bold text-xs sm:text-sm text-white bg-forest hover:bg-forest-hover transition-colors shadow-sm shrink-0"
          >
            <span>{t('explore.proposePlaceButton')}</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-canvas flex items-center justify-center text-ink-muted">Đang tải...</div>}>
      <ExploreViewInner />
    </Suspense>
  );
}
