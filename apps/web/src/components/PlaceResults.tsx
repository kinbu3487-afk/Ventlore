'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlaceSummaryDTO } from '@ventlore/api-client';
import { PlaceStatus } from '@ventlore/domain';
import {
  MapPinIcon,
  AlertTriangleIcon,
  ChevronRightIcon,
  MapIcon,
  ListIcon,
  CompassIcon,
} from './Icons';

interface PlaceResultsProps {
  places: PlaceSummaryDTO[];
  isLoading?: boolean;
}

export function PlaceResults({ places, isLoading }: PlaceResultsProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  return (
    <div className="space-y-4">
      {/* View Switcher: List vs Map */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-ink-secondary">
          {places.length} địa điểm mạo hiểm được lập chỉ mục
        </span>

        <div className="inline-flex rounded-control border border-sage bg-surface-card p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-control transition-colors ${
              viewMode === 'list'
                ? 'bg-forest text-white'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <ListIcon className="w-4 h-4" />
            <span>Danh sách</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-control transition-colors ${
              viewMode === 'map'
                ? 'bg-forest text-white'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Bản đồ</span>
          </button>
        </div>
      </div>

      {/* Map Adapter (Optional / Not-configured provider placeholder) */}
      {viewMode === 'map' && (
        <div className="rounded-card border-2 border-dashed border-sage bg-surface-canvas p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-sage/60 flex items-center justify-center text-forest mx-auto mb-3">
            <CompassIcon className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-ink text-base">Khung Bản Đồ Thử Nghiệm</h4>
          <p className="mt-1 text-xs text-ink-secondary max-w-md mx-auto">
            Nhà cung cấp bản đồ số trả phí chưa được cấu hình cho môi trường thử nghiệm này.
            Hệ thống tiếp tục hỗ trợ định vị và duyệt địa điểm thông qua danh mục tọa độ bên dưới.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {places.map((p) => (
              <span
                key={p.placeId}
                className="text-xs bg-white px-2.5 py-1 rounded-control border border-sage font-mono text-ink-secondary"
              >
                📍 {p.name} ({p.coordinates?.lat}, {p.coordinates?.lng})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Place Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {places.map((place) => {
          const isMerged = place.status === PlaceStatus.MERGED;

          return (
            <Link
              key={place.placeId}
              href={`/places/${place.placeId}`}
              className={`block rounded-card border transition-all p-5 text-left bg-surface-card hover:shadow-md ${
                isMerged
                  ? 'border-dashed border-status-pending/60 bg-status-pending-bg/20'
                  : 'border-sage hover:border-forest/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-sage/60 text-ink-secondary">
                      {place.displayCode}
                    </span>
                    <span className="text-xs text-ink-muted flex items-center gap-1">
                      <MapPinIcon className="w-3.5 h-3.5 text-forest" />
                      {place.regionName}
                    </span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-ink hover:text-forest transition-colors">
                    {place.name}
                  </h3>
                </div>

                <div className="shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-surface-canvas flex items-center justify-center text-ink-muted group-hover:text-forest">
                    <ChevronRightIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {isMerged && (
                <div className="mb-3 px-2.5 py-1 rounded-control bg-status-pending-bg text-status-pending text-xs font-medium">
                  Địa điểm đã được sáp nhập vào hồ sơ chuẩn. Nhấn để xem chuyển hướng.
                </div>
              )}

              <p className="text-xs sm:text-sm text-ink-secondary line-clamp-2 mb-3">
                {place.summary}
              </p>

              {/* Warnings preview */}
              {place.warnings.length > 0 && (
                <div className="mb-3 p-2.5 rounded-control bg-status-danger-bg/60 border border-status-danger/20 text-status-danger text-xs flex items-start gap-2">
                  <AlertTriangleIcon className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">
                    <strong>Rủi ro quan sát:</strong> {place.warnings[0]}
                  </span>
                </div>
              )}

              {/* Tags & Posts count */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-sage/40 text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {place.activities.map((act) => (
                    <span
                      key={act}
                      className="px-2 py-0.5 rounded-full bg-surface-canvas text-ink-secondary text-[11px]"
                    >
                      {act}
                    </span>
                  ))}
                </div>

                <span className="text-[11px] font-medium text-ink-secondary">
                  {place.postsCount > 0
                    ? `${place.postsCount} bài viết & báo cáo`
                    : 'Chưa có bài viết'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
