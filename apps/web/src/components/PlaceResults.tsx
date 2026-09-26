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
  ChevronLeftIcon,
} from './Icons';
import { Origin } from '@/lib/nearby';

interface PlaceResultsProps {
  places: PlaceSummaryDTO[];
  allPlaces?: PlaceSummaryDTO[];
  mappablePlaces?: PlaceSummaryDTO[];
  nearestOutsideRadius?: PlaceSummaryDTO[];
  total?: number;
  totalPages?: number;
  page?: number;
  pageSize?: number;
  origin?: Origin | null;
  radiusKm?: number | null;
  onPageChange?: (page: number) => void;
  onExpandRadius?: (radius: number | null) => void;
  onSelectRegion?: () => void;
  isLoading?: boolean;
  viewMode?: 'list' | 'map';
  onViewModeChange?: (mode: 'list' | 'map') => void;
}

export function PlaceResults({
  places,
  allPlaces,
  mappablePlaces,
  nearestOutsideRadius = [],
  total,
  totalPages = 1,
  page = 1,
  pageSize = 12,
  origin = null,
  radiusKm = null,
  onPageChange,
  onExpandRadius,
  onSelectRegion,
  isLoading,
  viewMode,
  onViewModeChange,
}: PlaceResultsProps) {
  const { t, getLocalizedPath } = useI18n();
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'map'>('list');
  const currentViewMode = viewMode ?? internalViewMode;

  const handleSetViewMode = (mode: 'list' | 'map') => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    } else {
      setInternalViewMode(mode);
    }
  };

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

  React.useEffect(() => {
    if (selectedPlaceId && currentViewMode === 'map') {
      const el = document.getElementById(`map-card-${selectedPlaceId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedPlaceId, currentViewMode]);

  const totalCount = total !== undefined ? total : places.length;
  const fromIndex = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const toIndex = Math.min(page * pageSize, totalCount);

  // Map uses all mappable places or allPlaces or places
  const mapData = mappablePlaces || allPlaces || places;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 bg-sage/40 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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

  // Helper to render a destination card
  const renderPlaceCard = (place: PlaceSummaryDTO) => {
    const isMerged = place.status === PlaceStatus.MERGED;
    const coverImage = place.coverImageUrl || place.imageUrl;
    const fallbackSvg =
      place.displayCode === 'PLC-000004'
        ? '/destinations/co-to.svg'
        : place.displayCode === 'PLC-000005'
        ? '/destinations/tay-con-linh.svg'
        : place.displayCode === 'PLC-000001'
        ? '/destinations/cat-co-3.svg'
        : '/destinations/hero-coastal.svg';
    const isWarningExpanded = expandedWarnings[place.placeId] === true;
    const hasRealDistance = place.distanceKm !== null && place.distanceKm !== undefined;
    const isApproximate = place.location?.coordinateKind === 'approximate_area';

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
            src={coverImage || fallbackSvg}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackSvg;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Region Badge & Distance Badge */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-control bg-forest/90 text-ivory text-xs font-medium backdrop-blur-xs shadow-xs">
              <MapPinIcon className="w-3 h-3 text-amber" />
              {place.regionName}
            </span>

            {hasRealDistance && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-control bg-black/75 text-ivory text-[11px] font-bold backdrop-blur-xs shadow-xs"
                title={t('explore.straightLineDistance')}
              >
                <CompassIcon className="w-3 h-3 text-amber" />
                <span>≈ {place.distanceKm! < 1 ? '< 1' : place.distanceKm!.toFixed(1)} km</span>
              </span>
            )}
          </div>

          {/* Approximate Area or Attribution Badge */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            {isApproximate && (
              <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white/90 text-[10px] font-medium">
                {t('explore.approximateLocation')}
              </span>
            )}
            <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white/80 text-[10px] font-medium">
              {(coverImage || fallbackSvg).endsWith('.svg') || (coverImage || fallbackSvg).includes('/destinations/')
                ? t('explore.imageAttributionIllustration')
                : t('explore.imageAttributionPhoto')}
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

          {/* Safety Warning with Expand/Collapse (only if place has warnings) */}
          {place.warnings && place.warnings.length > 0 && (
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
              {place.activities?.slice(0, 2).map((act) => (
                <span
                  key={act}
                  className="px-2 py-0.5 rounded-full bg-surface-canvas text-ink-secondary text-[11px] border border-sage/40 truncate"
                >
                  {act}
                </span>
              ))}
              <span className="text-[11px] text-ink-muted shrink-0">
                {place.postsCount > 0
                  ? t('place.postsCount', { count: place.postsCount })
                  : t('explore.noFieldPostsYet')}
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
  };

  // Empty state when 0 matches
  if (places.length === 0) {
    const isRadiusEmpty = origin !== null && radiusKm !== null;

    return (
      <div className="space-y-6">
        <div className="rounded-card border border-sage bg-surface-card p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto">
            <CompassIcon className="w-6 h-6" />
          </div>

          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-ink">
              {isRadiusEmpty
                ? t('explore.emptyInRadius', { radius: radiusKm })
                : t('explore.noPlacesFound')}
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              {isRadiusEmpty
                ? t('explore.emptyInRadiusDesc', { radius: radiusKm })
                : t('explore.noPlacesHint')}
            </p>
          </div>

          {isRadiusEmpty && (
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              {radiusKm < 100 && onExpandRadius && (
                <button
                  type="button"
                  onClick={() => onExpandRadius(100)}
                  className="px-4 py-2 rounded-control bg-forest hover:bg-forest-hover text-white text-xs font-bold transition-colors shadow-xs"
                >
                  {t('explore.expandTo100km')}
                </button>
              )}
              {onExpandRadius && (
                <button
                  type="button"
                  onClick={() => onExpandRadius(null)}
                  className="px-4 py-2 rounded-control border border-forest text-forest hover:bg-forest/10 text-xs font-bold transition-colors shadow-xs"
                >
                  {t('explore.viewNearestUnlimited')}
                </button>
              )}
              {onSelectRegion && (
                <button
                  type="button"
                  onClick={onSelectRegion}
                  className="px-4 py-2 rounded-control border border-sage text-ink hover:bg-sage/20 text-xs font-medium transition-colors shadow-xs"
                >
                  {t('explore.selectAnotherArea')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Section: Nearest destinations outside selected radius */}
        {isRadiusEmpty && nearestOutsideRadius.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-sage/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="font-bold text-sm sm:text-base text-ink flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-forest" />
                <span>{t('explore.nearestOutsideRadiusTitle')}</span>
              </h3>
              <span className="text-xs text-ink-muted italic">
                {t('explore.straightLineDistance')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearestOutsideRadius.map((place) => renderPlaceCard(place))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header: Showing count & View Switcher (List vs Map) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sage/40 pb-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-ink-secondary">
          <span>
            {t('explore.showingCount', { from: fromIndex, to: toIndex, total: totalCount })}
          </span>
          {origin && radiusKm !== null && (
            <span className="text-[11px] text-forest font-bold bg-forest/10 px-2 py-0.5 rounded-full">
              ({t('explore.searchRadius')}: {radiusKm} km)
            </span>
          )}
        </div>

        <div className="inline-flex rounded-control border border-sage bg-surface-card p-1 shadow-xs shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleSetViewMode('list')}
            aria-pressed={currentViewMode === 'list'}
            className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-control transition-colors ${
              currentViewMode === 'list'
                ? 'bg-forest text-white'
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <ListIcon className="w-4 h-4" />
            <span>{t('explore.listView')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSetViewMode('map')}
            aria-pressed={currentViewMode === 'map'}
            className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-control transition-colors ${
              currentViewMode === 'map'
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
      {currentViewMode === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Desktop): Compact Places List */}
          <div className="lg:col-span-5 space-y-3 max-h-[580px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between pb-1 px-1">
              <span className="text-xs font-bold text-ink">
                {t('explore.mapPlacesList', { count: mapData.length })}
              </span>
            </div>
            {mapData.map((place) => {
              const isSelected = selectedPlaceId === place.placeId;
              const hasDistance = place.distanceKm !== null && place.distanceKm !== undefined;

              return (
                <div
                  key={place.placeId}
                  id={`map-card-${place.placeId}`}
                  onClick={() => setSelectedPlaceId(place.placeId)}
                  className={`p-3.5 rounded-card border transition-all cursor-pointer ${
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
                      <div className="text-xs text-ink-muted flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="w-3 h-3 text-forest shrink-0" />
                          <span>{place.regionName}</span>
                        </span>
                        {hasDistance && (
                          <span className="text-forest font-bold text-[11px] bg-forest/10 px-1.5 py-0.2 rounded">
                            ≈ {place.distanceKm! < 1 ? '< 1' : place.distanceKm!.toFixed(1)} km
                          </span>
                        )}
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

          {/* Right Column: Interactive Leaflet Map with all mappable places */}
          <div className="lg:col-span-7 h-[460px] lg:h-[580px]">
            <PlaceMap
              places={mapData}
              origin={origin}
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={setSelectedPlaceId}
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* List Mode: 3 Columns on Wide Desktop, 2 on Tablet, 1 on Mobile */}
      {currentViewMode === 'list' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => renderPlaceCard(place))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && onPageChange && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-sage/60">
              <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="min-h-[40px] px-4 py-2 rounded-control border border-sage bg-surface-card text-ink text-xs font-bold hover:bg-sage/30 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs flex items-center gap-1"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <span>{t('explore.prevPage')}</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
                <span className="font-semibold text-ink">
                  {t('explore.pageOf', { page, total: totalPages })}
                </span>
                <span className="text-ink-muted">({totalCount} {t('explore.placesUnit')})</span>
              </div>

              <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="min-h-[40px] px-4 py-2 rounded-control border border-sage bg-surface-card text-ink text-xs font-bold hover:bg-sage/30 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs flex items-center gap-1"
              >
                <span>{t('explore.nextPage')}</span>
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
