'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import { SearchIcon, CloseIcon, MapPinIcon, CompassIcon, RefreshCwIcon, AlertTriangleIcon } from './Icons';
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
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<GeolocationStatus | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const provinceSelectRef = useRef<HTMLSelectElement>(null);

  // Sync provinceCode with regionId if provided
  const activeProvinceCode = provinceCode || (regionId?.startsWith('reg-prov-') ? regionId.replace('reg-prov-', '') : provinceCode) || 'all';

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
          onRadiusChange(50); // Default to 50km per Section 6
        }
        setIsOptionsOpen(false);
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

  const handleCancelLocating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLocating(false);
    setLocationError(null);
  };

  const handleClearLocation = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLocating(false);
    setLocationError(null);
    setIsOptionsOpen(false);
    if (onOriginChange) {
      onOriginChange(null);
    }
    if (onRadiusChange) {
      onRadiusChange(null);
    }
  };

  const handleSelectRegionFocus = () => {
    setIsOptionsOpen(false);
    provinceSelectRef.current?.focus();
    provinceSelectRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const activeProvinceObj = provinces.find((p) => p.code === activeProvinceCode);
  const activeActivityObj = activities.find((a) => a.id === activityId);
  const hasFilters = query !== '' || activeProvinceCode !== 'all' || activityId !== 'all';

  return (
    <div id="search-bar" className="rounded-card border border-sage bg-surface-card p-4 sm:p-6 shadow-sm space-y-4">
      {/* 1. Large 56px Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-ink-muted">
          <SearchIcon className="w-5 sm:w-6 h-5 sm:h-6 text-forest" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t('explore.searchPlaceholder')}
          className="w-full h-14 min-h-[56px] pl-12 sm:pl-14 pr-12 rounded-control border-2 border-sage/80 bg-surface-canvas text-ink text-sm sm:text-base focus:border-forest focus:ring-2 focus:ring-forest/20 transition-all placeholder:text-ink-muted shadow-inner"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-ink-muted hover:text-ink transition-colors"
            aria-label={t('explore.clearSearch')}
          >
            <div className="w-7 h-7 rounded-full bg-sage/60 hover:bg-sage flex items-center justify-center">
              <CloseIcon className="w-4 h-4" />
            </div>
          </button>
        )}
      </div>

      {/* 2. Filter Selectors & Gần tôi button */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Province dropdown (34 provinces) */}
        <div>
          <label htmlFor="province-filter" className="block text-xs font-semibold text-ink-secondary mb-1">
            {t('explore.provinceFilter')}
          </label>
          <select
            ref={provinceSelectRef}
            id="province-filter"
            value={activeProvinceCode}
            onChange={(e) => handleProvinceSelect(e.target.value)}
            className="w-full min-h-control px-3.5 py-2.5 rounded-control border border-sage bg-white text-ink text-sm focus:border-forest focus:ring-1 focus:ring-forest"
          >
            <option value="all">{t('explore.allProvinces')}</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name} ({p.seedCount} điểm)
              </option>
            ))}
          </select>
        </div>

        {/* Activity dropdown (7 groups) */}
        <div>
          <label htmlFor="activity-filter" className="block text-xs font-semibold text-ink-secondary mb-1">
            {t('explore.activityFilter')}
          </label>
          <select
            id="activity-filter"
            value={activityId}
            onChange={(e) => onActivityChange(e.target.value)}
            className="w-full min-h-control px-3.5 py-2.5 rounded-control border border-sage bg-white text-ink text-sm focus:border-forest focus:ring-1 focus:ring-forest"
          >
            {activities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {/* Near me ("Gần tôi") button */}
        <div>
          <span className="block text-xs font-semibold text-ink-secondary mb-1">
            {t('explore.nearMe')}
          </span>
          <button
            type="button"
            onClick={() => {
              if (origin) {
                // If already active, toggle panel
                setIsOptionsOpen((prev) => !prev);
              } else {
                setIsOptionsOpen((prev) => !prev);
              }
            }}
            aria-expanded={isOptionsOpen || origin !== null}
            className={`w-full min-h-control flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-control border text-sm font-medium transition-colors shadow-xs ${
              origin
                ? 'border-forest bg-forest/10 text-forest font-bold ring-1 ring-forest/30'
                : isLocating
                ? 'border-forest bg-surface-canvas text-forest animate-pulse'
                : 'border-sage bg-surface-canvas text-ink hover:bg-sage/40'
            }`}
          >
            <MapPinIcon className={`w-4 h-4 ${origin ? 'text-forest' : 'text-forest'}`} />
            <span>
              {isLocating
                ? t('explore.locatingPosition')
                : origin
                ? t('explore.nearMe')
                : t('explore.nearMe')}
            </span>
            {origin && (
              <span className="w-2 h-2 rounded-full bg-forest ml-0.5 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Location Prompt Panel (when user clicks "Gần tôi" and location is not active) */}
      {isOptionsOpen && !origin && !isLocating && (
        <div className="p-4 rounded-control border border-forest/30 bg-forest/5 text-ink text-xs space-y-3 animate-fadeIn">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="font-bold text-sm text-forest flex items-center gap-1.5">
                <CompassIcon className="w-4 h-4 text-forest" />
                <span>{t('explore.nearMe')}</span>
              </div>
              <p className="text-ink-secondary leading-relaxed">
                {t('explore.nearMePrompt')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOptionsOpen(false)}
              className="text-ink-muted hover:text-ink shrink-0 p-1"
              aria-label="Đóng"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleStartLocating}
              className="min-h-[40px] px-4 py-2 rounded-control bg-forest hover:bg-forest-hover text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <MapPinIcon className="w-3.5 h-3.5 text-amber" />
              <span>{t('explore.useMyPosition')}</span>
            </button>
            <button
              type="button"
              onClick={handleSelectRegionFocus}
              className="min-h-[40px] px-4 py-2 rounded-control border border-sage bg-white hover:bg-sage/20 text-ink font-semibold text-xs transition-colors shadow-xs"
            >
              <span>{t('explore.selectRegion')}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Active Location Controls (when location has been successfully acquired) */}
      {origin && (
        <div className="p-4 rounded-control border border-forest/40 bg-surface-canvas text-ink text-xs space-y-3 animate-fadeIn shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sage/40 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-forest shrink-0" />
              <span className="font-bold text-sm text-forest">
                {t('explore.locatingAroundYou')}
              </span>
              {origin.accuracyMeters && (
                <span className="text-[11px] text-ink-muted hidden md:inline">
                  • {t('explore.deviceApproximate', { accuracy: Math.round(origin.accuracyMeters) })}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleStartLocating}
                disabled={isLocating}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-sage bg-white text-ink text-[11px] font-medium hover:bg-sage/30 transition-colors"
                title={t('explore.updatePosition')}
              >
                <RefreshCwIcon className={`w-3 h-3 text-forest ${isLocating ? 'animate-spin' : ''}`} />
                <span>{t('explore.updatePosition')}</span>
              </button>
              <button
                type="button"
                onClick={handleClearLocation}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-sage bg-white text-status-danger text-[11px] font-medium hover:bg-status-danger-bg transition-colors"
              >
                <CloseIcon className="w-3 h-3" />
                <span>{t('explore.clearPosition')}</span>
              </button>
            </div>
          </div>

          {/* Radius selector pills */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-ink-secondary">
              <span className="font-semibold">Bán kính tìm kiếm:</span>
              <span className="italic text-ink-muted">{t('explore.straightLineDistance')}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 items-center">
              {radiusOptions.map((r) => {
                const isSelected = radiusKm === r;
                const label = r === null ? t('explore.radiusUnlimited') : t('explore.radiusKm', { radius: r });
                return (
                  <button
                    key={String(r)}
                    type="button"
                    onClick={() => onRadiusChange && onRadiusChange(r)}
                    className={`min-h-[36px] px-3 py-1.5 rounded-control text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-forest text-white shadow-xs font-bold ring-1 ring-forest'
                        : 'bg-white border border-sage text-ink hover:border-forest/60'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. Locating Spinner with Cancel */}
      {isLocating && (
        <div className="p-3 rounded-control bg-forest/10 border border-forest/30 text-forest text-xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
            <span className="font-semibold">{t('explore.locatingPosition')}</span>
          </div>
          <button
            type="button"
            onClick={handleCancelLocating}
            className="px-2.5 py-1 rounded bg-white text-ink text-[11px] font-semibold border border-sage hover:bg-sage/30 transition-colors"
          >
            {t('explore.cancelLocating')}
          </button>
        </div>
      )}

      {/* 6. Geolocation Error / Status Notice */}
      {locationError && !isLocating && (
        <div className="p-3.5 rounded-control bg-amber/15 border border-amber/30 text-ink text-xs space-y-2 animate-fadeIn">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 text-amber-900 font-medium">
              <AlertTriangleIcon className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
              <div>
                {locationError === 'denied' && t('explore.gpsDenied')}
                {locationError === 'unavailable' && t('explore.gpsUnavailable')}
                {locationError === 'timeout' && t('explore.gpsTimeout')}
                {locationError === 'unsupported' && t('explore.gpsUnsupported')}
                {locationError === 'insecure_context' && t('explore.gpsInsecure')}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLocationError(null)}
              className="text-ink-muted hover:text-ink shrink-0 p-0.5"
              aria-label="Đóng"
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1 pl-6">
            <button
              type="button"
              onClick={handleStartLocating}
              className="px-3 py-1 rounded bg-forest text-white text-[11px] font-bold hover:bg-forest-hover transition-colors"
            >
              Thử lại
            </button>
            <button
              type="button"
              onClick={handleSelectRegionFocus}
              className="px-3 py-1 rounded bg-white text-ink text-[11px] font-semibold border border-sage hover:bg-sage/20 transition-colors"
            >
              {t('explore.selectRegion')}
            </button>
          </div>
        </div>
      )}

      {/* 7. Active Province Banner / Chip if a province is selected */}
      {activeProvinceCode !== 'all' && activeProvinceObj && (
        <div className="p-2.5 rounded-control bg-sage/30 border border-sage/60 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-ink font-medium">
            <MapPinIcon className="w-3.5 h-3.5 text-forest" />
            <span>{t('explore.activeProvinceFilter', { province: activeProvinceObj.name })}</span>
          </div>
          <button
            type="button"
            onClick={() => handleProvinceSelect('all')}
            className="text-forest hover:underline font-bold text-[11px] shrink-0"
          >
            {t('explore.filterNationwide')}
          </button>
        </div>
      )}

      {/* 8. Filter chips summary & Clear Filters */}
      {hasFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-sage/40 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-ink-secondary">
            <span>
              {t('explore.filterCount', {
                count:
                  (query ? 1 : 0) +
                  (activeProvinceCode !== 'all' ? 1 : 0) +
                  (activityId !== 'all' ? 1 : 0) +
                  (origin ? 1 : 0),
              })}
            </span>
            {query && (
              <span className="px-2 py-0.5 rounded bg-sage/60 text-ink font-medium">
                &quot;{query}&quot;
              </span>
            )}
            {activeProvinceCode !== 'all' && activeProvinceObj && (
              <span className="px-2 py-0.5 rounded bg-sage/60 text-ink font-medium">
                {activeProvinceObj.name}
              </span>
            )}
            {activityId !== 'all' && activeActivityObj && (
              <span className="px-2 py-0.5 rounded bg-sage/60 text-ink font-medium">
                {activeActivityObj.label}
              </span>
            )}
            {origin && (
              <span className="px-2 py-0.5 rounded bg-forest/20 text-forest font-semibold">
                Gần tôi ({radiusKm ? `${radiusKm} km` : 'Không giới hạn'})
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClearFilters}
            className="text-forest hover:text-forest-hover font-semibold underline"
          >
            {t('explore.clearFilters')}
          </button>
        </div>
      )}
    </div>
  );
}
