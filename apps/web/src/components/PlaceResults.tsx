'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlaceSummaryDTO } from '@ventlore/api-client';
import { PlaceStatus } from '@ventlore/domain';
import { useI18n } from '../lib/i18n';
import { PlaceMap } from './PlaceMap';
import {
  MapPinIcon,
  AlertTriangleIcon,
  MapIcon,
  ListIcon,
  CompassIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from './Icons';

interface PlaceResultsProps {
  places: PlaceSummaryDTO[];
  isLoading?: boolean;
}

export function PlaceResults({ places, isLoading }: PlaceResultsProps) {
  const { t, getLocalizedPath } = useI18n();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [expandedWarnings, setExpandedWarnings] = useState<Record<string, boolean>>({});

  const toggleWarning = (placeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedWarnings((prev) => ({
      ...prev,
      [placeId]: !prev[placeId],
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 bg-sage/40 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-card border border-sage bg-surface-card overflow-hidden animate-pulse">
              <div className="aspect-[16/9] bg-sage/30 w-full" />
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
      <div className="rounded-card border border-sage bg-surface-card p-10 sm:p-12 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-sage/40 text-forest flex items-center justify-center mx-auto">
          <CompassIcon className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-ink">{t('explore.noPlacesFound')}</h3>
        <p className="text-xs text-ink-secondary max-w-md mx-auto leading-relaxed">
          {t('explore.noPlacesHint')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header: Found count & View Switcher (List vs Map) */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-ink-secondary">
          {t('explore.placesFound', { count: places.length })}
        </span>

        <div className="inline-flex rounded-control border border-sage bg-surface-card p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-pressed={viewMode === 'list'}
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
            aria-pressed={viewMode === 'map'}
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

      {/* Map Mode: Interactive OpenStreetMap with responsive split on desktop */}
      {viewMode === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Desktop): Compact Places List */}
          <div className="lg:col-span-5 space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {places.map((place) => {
              const isSelected = selectedPlaceId === place.placeId;
              const coordsStr = place.coordinates
                ? `${place.coordinates.lat.toFixed(4)}, ${place.coordinates.lng.toFixed(4)}`
                : '';

              return (
                <div
                  key={place.placeId}
                  onClick={() => setSelectedPlaceId(place.placeId)}
                  className={`p-4 rounded-card border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-forest bg-forest/5 ring-1 ring-forest shadow-xs'
                      : 'border-sage/80 bg-surface-card hover:border-forest/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="font-bold text-sm text-ink truncate hover:text-forest">
                        {place.name}
                      </div>
                      <div className="text-xs text-ink-muted flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3 text-forest shrink-0" />
                        <span>{place.regionName}</span>
                        {coordsStr && <span className="font-mono text-[10px] ml-1">({coordsStr})</span>}
                      </div>
                    </div>

                    <Link
                      href={getLocalizedPath(`/places/${place.placeId}`)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:text-forest-hover shrink-0 pt-0.5"
                    >
                      <span>{t('explore.viewPlace')}</span>
                      <ChevronRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <p className="mt-2 text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                    {place.summary}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column (Desktop) / Full Width (Mobile): Interactive Leaflet Map */}
          <div className="lg:col-span-7 h-[420px] lg:h-[560px]">
            <PlaceMap
              places={places}
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={setSelectedPlaceId}
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* List Mode: 3 Columns on Wide Desktop, 2 on Tablet, 1 on Mobile */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => {
            const isMerged = place.status === PlaceStatus.MERGED;
            const coverImage = place.coverImageUrl || place.imageUrl || '/destinations/hero-coastal.svg';
            const isWarningExpanded = expandedWarnings[place.placeId] === true;

            return (
              <article
                key={place.placeId}
                className={`rounded-card border transition-all overflow-hidden flex flex-col bg-surface-card hover:shadow-md ${
                  isMerged
                    ? 'border-dashed border-sage bg-surface-canvas/60'
                    : 'border-sage/80 hover:border-forest/50'
                }`}
              >
                {/* Card Cover Image with 16:9 Ratio */}
                <Link
                  href={getLocalizedPath(`/places/${place.placeId}`)}
                  className="relative block aspect-[16/9] overflow-hidden bg-sage/20 group"
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
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-control bg-forest/90 text-ivory text-xs font-medium backdrop-blur-xs shadow-xs">
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
                    <h2 className="font-bold text-base sm:text-lg text-ink hover:text-forest transition-colors line-clamp-1">
                      <Link href={getLocalizedPath(`/places/${place.placeId}`)}>
                        {place.name}
                      </Link>
                    </h2>

                    <p className="mt-2 text-xs sm:text-sm text-ink-secondary line-clamp-2 leading-relaxed">
                      {place.summary}
                    </p>
                  </div>

                  {/* Safety Warning with Expand/Collapse */}
                  {place.warnings.length > 0 && (
                    <div className="p-2.5 rounded-control bg-amber/15 border border-amber/30 text-ink text-xs space-y-1.5">
                      <div className="flex items-start gap-1.5 font-semibold text-amber-900">
                        <AlertTriangleIcon className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                        <span>{t('place.warningsTitle')}</span>
                      </div>
                      <p className={`text-xs text-ink-secondary ${isWarningExpanded ? '' : 'line-clamp-1'}`}>
                        {place.warnings[0]}
                      </p>
                      {place.warnings[0] && place.warnings[0].length > 40 && (
                        <button
                          type="button"
                          onClick={(e) => toggleWarning(place.placeId, e)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-forest hover:underline pt-0.5"
                        >
                          <span>{isWarningExpanded ? t('explore.closeWarning') : t('explore.readFullWarning')}</span>
                          <ChevronDownIcon className={`w-3 h-3 transition-transform ${isWarningExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Tags & Action Row */}
                  <div className="pt-3 border-t border-sage/50 flex items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap gap-1.5 items-center min-w-0">
                      {place.activities.slice(0, 2).map((act) => (
                        <span
                          key={act}
                          className="px-2 py-0.5 rounded-full bg-surface-canvas text-ink-secondary text-[11px] border border-sage/40 truncate"
                        >
                          {act}
                        </span>
                      ))}
                      <span className="text-[11px] text-ink-muted shrink-0">
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
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
