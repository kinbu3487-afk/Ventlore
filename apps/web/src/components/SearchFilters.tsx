'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import {
  SearchIcon,
  CloseIcon,
  MapPinIcon,
  CompassIcon,
  RefreshCwIcon,
  AlertTriangleIcon,
  FilterIcon,
  ChevronDownIcon,
} from './Icons';
import { destinationsData, readDevicePosition, Origin, GeolocationStatus } from '@/lib/nearby';

export interface SearchFiltersProps {
  query: string;
  provinceCode: string;
  activityId: string;
  origin?: Origin | null;
  radiusKm?: number | null;
  onQueryChange: (q: string) => void;
  onProvinceChange: (p: string) => void;
  onActivityChange: (a: string) => void;
  onOriginChange?: (origin: Origin | null) => void;
  onRadiusChange?: (radius: number | null) => void;
  onClearFilters: () => void;
  // Compatibility with older usage
  regionId?: string;
  onRegionChange?: (r: string) => void;
  activity?: string;
}

export function SearchFilters({
  query,
  provinceCode,
  activityId,
  origin = null,
  radiusKm = null,
  onQueryChange,
  onProvinceChange,
  onActivityChange,
  onOriginChange,
  onRadiusChange,
  onClearFilters,
  regionId,
  onRegionChange,
}: SearchFiltersProps) {
  const { t } = useI18n();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<GeolocationStatus | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const modalSelectRef = useRef<HTMLSelectElement>(null);

  // Sync provinceCode with regionId if provided
  const activeProvinceCode =
    provinceCode || (regionId?.startsWith('reg-prov-') ? regionId.replace('reg-prov-', '') : provinceCode) || 'all';

  const handleProvinceSelect = (code: string) => {
    onProvinceChange(code);
    if (onRegionChange) {
      onRegionChange(code === 'all' ? 'all' : `reg-prov-${code}`);
    }
  };

  const provinces = destinationsData.provinces;
  const activities = [
    { id: 'all', label: t('explore.allActivities') },
    { id: 'lake', label: t('explore.actLake') },
    { id: 'walking', label: t('explore.actWalking') },
    { id: 'forest', label: t('explore.actForest') },
    { id: 'mountain', label: t('explore.actMountain') },
    { id: 'coastal', label: t('explore.actCoastal') },
    { id: 'culture', label: t('explore.actCulture') },
    { id: 'landscape', label: t('explore.actLandscape') },
  ];

  const radiusOptions = [5, 25, 50, 100, 200, null];

  // Clean up controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsPopoverOpen(false);
      }
    };
    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isPopoverOpen]);

  const handleStartLocating = async () => {
    if (!onOriginChange) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLocating(true);
    setLocationError(null);

    try {
      const res = await readDevicePosition({
        signal: controller.signal,
        timeoutMs: 10000,
      });

      if (controller.signal.aborted) return;

      if (res.status === 'ready' && res.origin) {
        onOriginChange(res.origin);
        if (onRadiusChange && (radiusKm === null || radiusKm === undefined)) {
          onRadiusChange(50); // Default to 50km
        }
        // Section 6 invariant: Clear province constraint when switching to Near Me to avoid empty intersection
        onProvinceChange('all');
        if (onRegionChange) {
          onRegionChange('all');
        }
        setLocationError(null);
      } else {
        if (res.status !== 'cancelled') {
          setLocationError(res.status);
        }
      }
    } catch {
      setLocationError('unavailable');
    } finally {
      if (!controller.signal.aborted) {
        setIsLocating(false);
      }
    }
  };

  const handleClearLocation = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLocating(false);
    setLocationError(null);
    setIsPopoverOpen(false);
    if (onOriginChange) {
      onOriginChange(null);
    }
    if (onRadiusChange) {
      onRadiusChange(null);
    }
  };

  const handleNearMeClick = () => {
    if (origin) {
      setIsPopoverOpen((prev) => !prev);
    } else {
      handleStartLocating();
    }
  };

  const hasActiveFilters = activeProvinceCode !== 'all' || query.trim() !== '';

  return (
    <div id="search-bar" className="space-y-2.5">
      {/* 1. Small Title "Bạn muốn đi đâu?" */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-base sm:text-lg font-bold text-ink flex items-center gap-1.5 tracking-tight">
          <CompassIcon className="w-4 h-4 text-forest" />
          <span>{t('explore.whereToGo')}</span>
        </h1>
      </div>

      {/* 2. Primary Search Row: Search input + "Gần tôi" + "Bộ lọc" */}
      <div className="flex items-center gap-2">
        {/* Search input (occupies major width) */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
            <SearchIcon className="w-4 h-4 text-forest" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t('explore.searchPlaceholder')}
            className="w-full h-11 min-h-[44px] pl-10 pr-9 rounded-control border border-sage/80 bg-surface-canvas text-ink text-xs sm:text-sm focus:border-forest focus:ring-1 focus:ring-forest/20 transition-all placeholder:text-ink-muted shadow-2xs"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-muted hover:text-ink transition-colors"
              aria-label={t('explore.clearSearch')}
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Near Me ("Gần tôi") button */}
        <button
          type="button"
          onClick={handleNearMeClick}
          className={`min-h-[44px] h-11 px-3.5 sm:px-4 rounded-control text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer ${
            origin
              ? 'border border-forest bg-forest/10 text-forest ring-1 ring-forest/30'
              : isLocating
              ? 'border border-forest bg-surface-canvas text-forest animate-pulse'
              : 'bg-forest text-white hover:bg-forest-hover'
          }`}
          title={t('explore.nearMe')}
        >
          {isLocating ? (
            <div className="w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
          ) : (
            <MapPinIcon className={`w-4 h-4 ${origin ? 'text-forest' : 'text-amber'}`} />
          )}
          <span className="hidden xs:inline sm:inline">
            {isLocating ? t('explore.locatingPosition') : t('explore.nearMe')}
          </span>
          {origin && <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />}
        </button>

        {/* Filter Modal Toggle Button ("Bộ lọc") */}
        <button
          type="button"
          onClick={() => setIsFilterModalOpen(true)}
          className={`min-h-[44px] h-11 px-3 sm:px-3.5 rounded-control border text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer ${
            activeProvinceCode !== 'all'
              ? 'border-forest bg-forest/10 text-forest font-semibold'
              : 'border-sage bg-surface-card text-ink hover:bg-sage/20'
          }`}
          title={t('explore.filtersButton')}
        >
          <FilterIcon className="w-4 h-4 text-forest" />
          <span className="hidden md:inline">{t('explore.filtersButton')}</span>
          {activeProvinceCode !== 'all' && (
            <span className="w-2 h-2 rounded-full bg-forest" />
          )}
        </button>
      </div>

      {/* 3. Secondary Compact Toolbar: Activity Chips & Active Near Me Popover Chip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {/* Activity Taxonomy Chips */}
        <div className="flex items-center gap-1.5 shrink-0">
          {activities.map((a) => {
            const isSelected = activityId === a.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onActivityChange(a.id)}
                className={`min-h-[34px] px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-forest text-white shadow-xs font-semibold'
                    : 'bg-surface-card border border-sage/80 text-ink hover:bg-sage/30'
                }`}
              >
                {a.label}
              </button>
            );
          })}
        </div>

        {/* Active Near Me Chip with Popover Trigger */}
        {origin && (
          <div className="relative shrink-0" ref={popoverRef}>
            <button
              type="button"
              onClick={() => setIsPopoverOpen((prev) => !prev)}
              className="min-h-[34px] px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap bg-forest/10 border border-forest/40 text-forest flex items-center gap-1.5 shadow-2xs hover:bg-forest/20 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse" />
              <span>
                {radiusKm
                  ? t('explore.nearMeActiveChip', { radius: `${radiusKm} km` })
                  : t('explore.nearMeActiveChip', { radius: t('explore.radiusUnlimited') })}
              </span>
              <ChevronDownIcon className="w-3 h-3 text-forest" />
            </button>

            {/* Popover */}
            {isPopoverOpen && (
              <div className="absolute left-0 sm:right-0 top-full mt-2 w-72 p-3.5 bg-surface-card rounded-card border border-forest/30 shadow-xl z-50 text-xs space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-sage/40">
                  <div className="font-bold text-forest flex items-center gap-1">
                    <MapPinIcon className="w-3.5 h-3.5 text-forest" />
                    <span>{t('explore.locatingAroundYou')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPopoverOpen(false)}
                    className="text-ink-muted hover:text-ink p-1 cursor-pointer"
                  >
                    <CloseIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {origin.accuracyMeters && (
                  <div className="text-[11px] text-ink-muted">
                    {t('explore.accuracyMeters', { acc: Math.round(origin.accuracyMeters) })}
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-ink-secondary">
                    {t('explore.searchRadius')}:
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {radiusOptions.map((r) => {
                      const isSel = radiusKm === r;
                      const label = r === null ? t('explore.radiusUnlimited') : `${r} km`;
                      return (
                        <button
                          key={String(r)}
                          type="button"
                          onClick={() => {
                            onRadiusChange?.(r);
                            setIsPopoverOpen(false);
                          }}
                          className={`px-2 py-1.5 rounded text-[11px] font-medium border text-center transition-colors cursor-pointer ${
                            isSel
                              ? 'bg-forest text-white border-forest font-bold shadow-xs'
                              : 'bg-white border-sage text-ink hover:border-forest/50'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-sage/40">
                  <button
                    type="button"
                    onClick={() => {
                      handleStartLocating();
                      setIsPopoverOpen(false);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-forest font-semibold hover:underline cursor-pointer"
                  >
                    <RefreshCwIcon className="w-3 h-3" />
                    <span>{t('explore.updatePosition')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleClearLocation();
                      setIsPopoverOpen(false);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-status-danger font-semibold hover:underline cursor-pointer"
                  >
                    <CloseIcon className="w-3 h-3" />
                    <span>{t('explore.clearPosition')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Non-blocking Dismissible Geolocation Error / Notice */}
      {locationError && !isLocating && (
        <div className="p-3 rounded-control bg-amber/10 border border-amber/30 text-ink text-xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangleIcon className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              {locationError === 'denied' && t('explore.gpsDenied')}
              {locationError === 'unavailable' && t('explore.gpsUnavailable')}
              {locationError === 'timeout' && t('explore.gpsTimeout')}
              {locationError === 'unsupported' && t('explore.gpsUnsupported')}
              {locationError === 'insecure_context' && t('explore.gpsInsecure')}
              {locationError === 'cancelled' && t('explore.gpsCancelled')}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setLocationError(null);
                setIsFilterModalOpen(true);
              }}
              className="px-2.5 py-1 rounded bg-white border border-sage text-forest font-bold text-xs hover:bg-sage/20 cursor-pointer"
            >
              {t('explore.selectRegion')}
            </button>
            <button
              type="button"
              onClick={() => setLocationError(null)}
              className="text-ink-muted hover:text-ink p-1 cursor-pointer"
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Filter Modal ("Bộ lọc") */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-surface-card rounded-card border border-sage shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sage/60">
              <h3 className="font-bold text-base text-ink flex items-center gap-2">
                <FilterIcon className="w-4 h-4 text-forest" />
                <span>{t('explore.filterDrawerTitle')}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="text-ink-muted hover:text-ink p-1 cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Province selector */}
            <div className="space-y-1.5">
              <label htmlFor="modal-province-filter" className="block text-xs font-semibold text-ink-secondary">
                {t('explore.provinceFilter')}
              </label>
              <select
                ref={modalSelectRef}
                id="modal-province-filter"
                value={activeProvinceCode}
                onChange={(e) => handleProvinceSelect(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-control border border-sage bg-white text-ink text-sm focus:border-forest focus:ring-1 focus:ring-forest"
              >
                <option value="all">{t('explore.allProvinces')}</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name} ({p.seedCount} {t('explore.placesUnit')})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-sage/60">
              <button
                type="button"
                onClick={() => {
                  onClearFilters();
                  setIsFilterModalOpen(false);
                }}
                className="text-xs font-semibold text-ink-muted hover:text-status-danger cursor-pointer"
              >
                {t('explore.clearFilters')}
              </button>
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="min-h-[40px] px-5 py-2 rounded-control bg-forest text-white font-bold text-xs hover:bg-forest-hover shadow-xs cursor-pointer"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
