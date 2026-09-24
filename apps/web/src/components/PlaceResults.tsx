'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlaceSummaryDTO } from '@ventlore/api-client';
import { PlaceStatus } from '@ventlore/domain';
import { useI18n } from '../lib/i18n';
import {
  MapPinIcon,
  AlertTriangleIcon,
  MapIcon,
  ListIcon,
  CompassIcon,
  ChevronRightIcon,
} from './Icons';

interface PlaceResultsProps {
  places: PlaceSummaryDTO[];
  isLoading?: boolean;
}

export function PlaceResults({ places, isLoading }: PlaceResultsProps) {
  const { t, getLocalizedPath } = useI18n();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 bg-sage/40 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-card border border-sage bg-surface-card overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-sage/30 w-full" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-sage/40 rounded" />
                <div className="h-4 w-full bg-sage/30 rounded" />
                <div className="h-4 w-1/2 bg-sage/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="rounded-card border border-sage bg-surface-card p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-sage/40 text-forest flex items-center justify-center mx-auto">
          <CompassIcon className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-ink">{t('explore.noPlacesFound')}</h3>
        <p className="text-xs text-ink-secondary max-w-md mx-auto">
          {t('explore.noPlacesHint')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* View Switcher: List vs Map */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-ink-secondary">
          {t('explore.placesFound', { count: places.length })}
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
            <span>{t('explore.listView')}</span>
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
            <span>{t('explore.mapView')}</span>
          </button>
        </div>
      </div>

      {/* Map Mode (Curated Vector Map Preview with Destination Waypoints) */}
      {viewMode === 'map' && (
        <div className="rounded-card border border-sage overflow-hidden bg-surface-card shadow-sm">
          <div className="relative h-72 sm:h-96 w-full bg-[#173F35]/10 overflow-hidden">
            <img
              src="/destinations/hero-coastal.svg"
              alt="Ventlore Interactive Topo Map"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent flex items-end p-6">
              <div className="text-ivory space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber text-ink text-xs font-bold">
                  <CompassIcon className="w-3.5 h-3.5" />
                  {t('explore.mapView')}
                </span>
                <p className="text-xs text-ivory/80 max-w-lg">
                  {t('explore.mapHint')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-surface-canvas border-t border-sage/60">
            {places.map((p) => {
              const coordsStr = p.coordinates ? `${p.coordinates.lat.toFixed(4)}, ${p.coordinates.lng.toFixed(4)}` : '20.7250, 107.0520';
              return (
                <Link
                  key={p.placeId}
                  href={getLocalizedPath(`/places/${p.placeId}`)}
                  className="p-3 rounded-control border border-sage bg-surface-card hover:border-forest/60 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="truncate mr-2">
                    <div className="font-bold text-ink truncate">{p.name}</div>
                    <div className="text-[11px] font-mono text-ink-muted flex items-center gap-1 mt-0.5">
                      <MapPinIcon className="w-3 h-3 text-forest shrink-0" />
                      <span>{coordsStr}</span>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-ink-muted shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Place Cards 2-Column Grid (16:10 Visual Ratio) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {places.map((place) => {
          const isMerged = place.status === PlaceStatus.MERGED;
          const coverImage = place.coverImageUrl || '/destinations/hero-coastal.svg';

          return (
            <div
              key={place.placeId}
              className={`rounded-card border transition-all overflow-hidden flex flex-col bg-surface-card hover:shadow-lg ${
                isMerged
                  ? 'border-dashed border-sage bg-surface-canvas/60'
                  : 'border-sage hover:border-forest/50'
              }`}
            >
              {/* Card Cover Image with 16:10 Ratio */}
              <Link
                href={getLocalizedPath(`/places/${place.placeId}`)}
                className="relative block aspect-[16/10] overflow-hidden bg-sage/20 group"
              >
                <img
                  src={coverImage}
                  alt={place.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Region Badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-control bg-forest/90 text-ivory text-xs font-medium backdrop-blur-sm shadow-xs">
                    <MapPinIcon className="w-3 h-3 text-amber" />
                    {place.regionName}
                  </span>
                </div>

                {/* Merged Notice Tag */}
                {isMerged && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded bg-sage text-ink text-[11px] font-semibold border border-sage/80 shadow-xs">
                      {t('place.mergedNotice')}
                    </span>
                  </div>
                )}
              </Link>

              {/* Card Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-ink hover:text-forest transition-colors line-clamp-1">
                    <Link href={getLocalizedPath(`/places/${place.placeId}`)}>
                      {place.name}
                    </Link>
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-ink-secondary line-clamp-2 leading-relaxed">
                    {place.summary}
                  </p>
                </div>

                {/* Warnings preview */}
                {place.warnings.length > 0 && (
                  <div className="p-2.5 rounded-control bg-amber/15 border border-amber/30 text-ink text-xs flex items-start gap-2">
                    <AlertTriangleIcon className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span className="line-clamp-1">
                      <strong className="font-semibold">{t('place.warningsTitle')}:</strong> {place.warnings[0]}
                    </span>
                  </div>
                )}

                {/* Tags & Action Row */}
                <div className="pt-3 border-t border-sage/50 flex items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {place.activities.slice(0, 2).map((act) => (
                      <span
                        key={act}
                        className="px-2 py-0.5 rounded-full bg-surface-canvas text-ink-secondary text-[11px] border border-sage/40"
                      >
                        {act}
                      </span>
                    ))}
                    <span className="text-[11px] text-ink-muted">
                      {t('place.postsCount', { count: place.postsCount })}
                    </span>
                  </div>

                  <Link
                    href={getLocalizedPath(`/places/${place.placeId}`)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:text-forest-hover shrink-0 group"
                  >
                    <span>{t('explore.viewPlace')}</span>
                    <ChevronRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
