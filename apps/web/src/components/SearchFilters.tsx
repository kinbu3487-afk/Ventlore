'use client';

import React, { useState } from 'react';
import { SearchIcon, CloseIcon, MapPinIcon, CompassIcon } from './Icons';

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
  const [gpsNotice, setGpsNotice] = useState<string | null>(null);

  const regions = [
    { id: 'all', name: 'Tất cả vùng miền' },
    { id: 'reg-north-coast', name: 'Hải Phòng / Cát Bà' },
    { id: 'reg-north-island', name: 'Quảng Ninh / Cô Tô' },
    { id: 'reg-north-mountain', name: 'Hà Giang / Hoàng Su Phì' },
    { id: 'reg-central-highlands', name: 'Tây Nguyên / Kon Tum' },
  ];

  const activities = [
    { id: 'all', name: 'Tất cả hoạt động' },
    { id: 'Trekking', name: 'Trekking' },
    { id: 'Chèo Kayak', name: 'Chèo Kayak' },
    { id: 'Leo núi cao', name: 'Leo núi cao' },
    { id: 'Khám phá rừng', name: 'Khám phá rừng' },
  ];

  const handleSimulateGps = () => {
    // Invariant: GPS rejection does not block usage.
    setGpsNotice(
      'Mô phỏng vị trí GPS: Người dùng từ chối cấp quyền hoặc chưa bật GPS. Hệ thống chuyển sang tìm kiếm danh mục thủ công mà không chặn giao diện.'
    );
  };

  const hasFilters = query !== '' || regionId !== 'all' || activity !== 'all';

  return (
    <div className="rounded-card border border-sage bg-surface-card p-4 sm:p-5 shadow-sm space-y-4">
      {/* 1. Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
          <SearchIcon className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Tìm tên địa điểm, cảnh báo, cung đường (ví dụ: Cát Cò, Cô Tô)..."
          className="w-full min-h-control pl-11 pr-10 py-2.5 rounded-control border border-sage bg-surface-canvas text-ink text-sm sm:text-base focus:border-forest focus:ring-1 focus:ring-forest transition-colors placeholder:text-ink-muted"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-muted hover:text-ink"
            aria-label="Xóa từ khóa tìm kiếm"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 2. Filter Selectors & GPS button */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Region dropdown */}
        <div>
          <label htmlFor="region-filter" className="block text-xs font-semibold text-ink-secondary mb-1">
            Khu vực / Vùng miền
          </label>
          <select
            id="region-filter"
            value={regionId}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full min-h-control px-3 py-2 rounded-control border border-sage bg-white text-ink text-sm focus:border-forest"
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
            Loại hình hoạt động
          </label>
          <select
            id="activity-filter"
            value={activity}
            onChange={(e) => onActivityChange(e.target.value)}
            className="w-full min-h-control px-3 py-2 rounded-control border border-sage bg-white text-ink text-sm focus:border-forest"
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
          <span className="block text-xs font-semibold text-ink-secondary mb-1">Định vị thực địa</span>
          <button
            type="button"
            onClick={handleSimulateGps}
            className="w-full min-h-control flex items-center justify-center gap-2 px-3 py-2 rounded-control border border-sage bg-surface-canvas text-ink text-sm font-medium hover:bg-sage/40 transition-colors"
          >
            <MapPinIcon className="w-4 h-4 text-forest" />
            <span>Tìm điểm gần tôi</span>
          </button>
        </div>
      </div>

      {/* 3. GPS Alert (graceful notification without blocking) */}
      {gpsNotice && (
        <div className="p-3 rounded-control bg-status-pending-bg text-status-pending text-xs flex items-start justify-between gap-2 border border-status-pending/30">
          <span>{gpsNotice}</span>
          <button
            type="button"
            onClick={() => setGpsNotice(null)}
            className="text-status-pending hover:underline font-semibold shrink-0 ml-2"
          >
            Đóng
          </button>
        </div>
      )}

      {/* 4. Filter chips & Reset */}
      {hasFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-sage/40 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-ink-secondary">
            <span>Đang lọc:</span>
            {query && (
              <span className="px-2 py-0.5 rounded bg-sage/60 text-ink font-medium">
                &quot;{query}&quot;
              </span>
            )}
            {regionId !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-sage/60 text-ink font-medium">
                Vùng: {regions.find((r) => r.id === regionId)?.name}
              </span>
            )}
            {activity !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-sage/60 text-ink font-medium">
                Hoạt động: {activity}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClearFilters}
            className="text-forest hover:text-forest-hover font-semibold underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
