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
import { MapBounds } from '@/components/PlaceMap';

function ExploreViewInner() {
  const { persona } = useSession();
  const { t, locale, getLocalizedPath } = useI18n();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState('');
  const [provinceCode, setProvinceCode] = useState('all');
  const [activityId, setActivityId] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
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
    const v = searchParams.get('view') === 'list' ? 'list' : 'map';
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
      setViewMode(p.get('view') === 'list' ? 'list' : 'map');
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
    if (viewMode === 'list') p.set('view', 'list'); else p.delete('view');
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
    if (!newOrigin) {
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

  const handleSearchArea = useCallback((bounds: MapBounds) => {
    // Section 6 invariant: "Tìm trong vùng này" switches to map bounds mode, clears Near Me radius limit, keeps device position if any
    setRadiusKm(null);
    setPage(1);

    const inBounds = queryData.allMatches.filter((p) => {
      const lat = p.coordinates?.lat ?? p.location?.latitude;
      const lng = p.coordinates?.lng ?? p.location?.longitude;
      if (typeof lat !== 'number' || typeof lng !== 'number') return false;
      return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
    });

    setQueryData((prev) => ({
      ...prev,
      items: inBounds.slice(0, 12),
      mappableMatches: inBounds,
      total: inBounds.length,
      totalPages: Math.ceil(inBounds.length / 12) || 1,
      page: 1,
    }));
  }, [queryData.allMatches]);

  return (
    <AppShell>
      <div className="space-y-4 sm:space-y-5">
        {/* 1. Compact Search & Filter Toolbar: Title "Bạn muốn đi đâu?", Search, Near Me, Filter, Activity chips */}
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

        {/* 2. Results: Independent Cards Panel on Left (30-35%), Map on Right (65-70%) */}
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
            onSearchArea={handleSearchArea}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </AsyncState>

        {/* 3. Independent Field Verification Methodology Explanation */}
        <section
          aria-label="Independent verification methodology"
          className="rounded-card border border-sage/80 bg-surface-card p-5 sm:p-6 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center text-forest shrink-0">
              <ShieldCheckIcon className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-ink">
              {t('explore.aboutAuditTitle')}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-3xl">
            {t('explore.aboutAuditDesc')}
          </p>

          <div className="pt-1">
            <Link
              href={getLocalizedPath('/transparency')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-forest hover:text-forest-hover hover:underline"
            >
              <span>{t('explore.learnMoreAudit')}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </section>

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
            href={getLocalizedPath('/contribute?tab=candidate')}
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
    <Suspense fallback={<div className="min-h-screen bg-surface-canvas flex items-center justify-center text-ink-muted">...</div>}>
      <ExploreViewInner />
    </Suspense>
  );
}
