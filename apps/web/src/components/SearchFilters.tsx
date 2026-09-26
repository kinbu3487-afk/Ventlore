'use client';

import React, { useState } from 'react';
import { useI18n } from '../lib/i18n';
import { SearchIcon, CloseIcon, MapPinIcon } from './Icons';

interface SearchFiltersProps {
  query: string;
  regionId: string;
  activity: string;
  onQueryChange: (q: string) => void;
  onRegionChange: (r: string) => void;
  onActivityChange: (a: string) => void;
  onClearFilters: () => void;
}

export function SearchFilters({
  query,
  regionId,
  activity,
  onQueryChange,
  onRegionChange,
  onActivityChange,
  onClearFilters,
}: SearchFiltersProps) {
  const { t } = useI18n();
  const [gpsNotice, setGpsNotice] = useState<string | null>(null);

  const regions = [
    { id: 'all', name: t('explore.allRegions') },
    { id: 'reg-north-coast', name: 'Hải Phòng / Cát Bà' },
    { id: 'reg-north-island', name: 'Quảng Ninh / Cô Tô' },
    { id: 'reg-north-mountain', name: 'Hà Giang / Hoàng Su Phì' },
    { id: 'reg-central-highlands', name: 'Tây Nguyên / Kon Tum' },
  ];

  const activities = [
    { id: 'all', name: t('explore.allActivities') },
    { id: 'Trekking', name: t('explore.actTrekking') },
    { id: 'Chèo Kayak', name: t('explore.actKayaking') },
    { id: 'Leo núi cao', name: t('explore.actMountaineering') },
    { id: 'Khám phá rừng', name: t('explore.actForest') },
  ];

  const handleGpsLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setGpsNotice(t('explore.gpsSimulated'));
        },
        () => {
          setGpsNotice('Không thể lấy vị trí thiết bị. Bạn có thể chọn vùng miền trong danh sách bộ lọc.');
        },
        { timeout: 5000 }
      );
    } else {
      setGpsNotice('Trình duyệt không hỗ trợ định vị. Bạn có thể chọn vùng miền trong danh sách bộ lọc.');
    }
  };

  const hasFilters = query !== '' || regionId !== 'all' || activity !== 'all';

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
            aria-label="Clear search input"
          >
            <div className="w-7 h-7 rounded-full bg-sage/60 hover:bg-sage flex items-center justify-center">
              <CloseIcon className="w-4 h-4" />
            </div>
          </button>
        )}
      </div>

      {/* 2. Filter Selectors & GPS button */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Region dropdown */}
        <div>
          <label htmlFor="region-filter" className="block text-xs font-semibold text-ink-secondary mb-1">
            {t('explore.regionFilter')}
          </label>
          <select
            id="region-filter"
            value={regionId}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full min-h-control px-3.5 py-2.5 rounded-control border border-sage bg-white text-ink text-sm focus:border-forest focus:ring-1 focus:ring-forest"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Activity dropdown */}
        <div>
          <label htmlFor="activity-filter" className="block text-xs font-semibold text-ink-secondary mb-1">
            {t('explore.activityFilter')}
          </label>
          <select
            id="activity-filter"
            value={activity}
            onChange={(e) => onActivityChange(e.target.value)}
            className="w-full min-h-control px-3.5 py-2.5 rounded-control border border-sage bg-white text-ink text-sm focus:border-forest focus:ring-1 focus:ring-forest"
          >
            {activities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Near me (GPS) */}
        <div>
          <span className="block text-xs font-semibold text-ink-secondary mb-1">
            {t('explore.nearMe')}
          </span>
          <button
            type="button"
            onClick={handleGpsLocation}
            className="w-full min-h-control flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-control border border-sage bg-surface-canvas text-ink text-sm font-medium hover:bg-sage/40 transition-colors shadow-xs"
          >
            <MapPinIcon className="w-4 h-4 text-forest" />
            <span>{t('explore.nearMe')}</span>
          </button>
        </div>
      </div>

      {/* 3. GPS Alert (graceful notification without blocking) */}
      {gpsNotice && (
        <div className="p-3 rounded-control bg-status-pending-bg text-status-pending text-xs flex items-start justify-between gap-2 border border-status-pending/30 animate-fadeIn">
          <span>{gpsNotice}</span>
          <button
            type="button"
            onClick={() => setGpsNotice(null)}
            className="text-status-pending hover:underline font-semibold shrink-0 ml-2"
          >
            {t('common.close')}
          </button>
        </div>
      )}

      {/* 4. Filter chips & Reset */}
      {hasFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-sage/40 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-ink-secondary">
            <span>{t('explore.filterCount', { count: (query ? 1 : 0) + (regionId !== 'all' ? 1 : 0) + (activity !== 'all' ? 1 : 0) })}</span>
            {query && (
              <span className="px-2 py-0.5 rounded bg-sage/60 text-ink font-medium">
                &quot;{query}&quot;
              </span>
            )}
            {regionId !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-sage/60 text-ink font-medium">
                {regions.find((r) => r.id === regionId)?.name}
              </span>
            )}
            {activity !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-sage/60 text-ink font-medium">
                {activities.find((a) => a.id === activity)?.name || activity}
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
