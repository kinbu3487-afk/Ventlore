'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PlaceSummaryDTO } from '@ventlore/api-client';
import { useI18n } from '../lib/i18n';
import { MapPinIcon, CompassIcon, AlertTriangleIcon, RefreshCwIcon, SearchIcon } from './Icons';
import { Origin } from '@/lib/nearby';

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface PlaceMapProps {
  places: PlaceSummaryDTO[];
  origin?: Origin | null;
  selectedPlaceId?: string | null;
  onSelectPlace?: (placeId: string) => void;
  onSearchArea?: (bounds: MapBounds) => void;
  className?: string;
}

declare global {
  interface Window {
    L: any;
  }
}

export function PlaceMap({
  places,
  origin = null,
  selectedPlaceId,
  onSelectPlace,
  onSearchArea,
  className = '',
}: PlaceMapProps) {
  const { t, getLocalizedPath } = useI18n();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const originMarkerRef = useRef<any>(null);
  const originCircleRef = useRef<any>(null);
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [currentZoom, setCurrentZoom] = useState<number>(6);
  const [showSearchArea, setShowSearchArea] = useState<boolean>(false);
  const initialFitRef = useRef<boolean>(false);
  const isUserInteractingRef = useRef<boolean>(false);

  // Load Leaflet CSS and JS dynamically if not already present
  useEffect(() => {
    let isMounted = true;

    if (typeof window !== 'undefined' && window.L) {
      if (isMounted) setMapStatus('ready');
      return;
    }

    // 1. Add Leaflet CSS
    const existingLink = document.querySelector('link[href*="leaflet.css"]');
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // 2. Add Leaflet JS
    const existingScript = document.querySelector('script[src*="leaflet.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.async = true;

      const timer = setTimeout(() => {
        if (isMounted && !window.L) {
          setMapStatus('error');
        }
      }, 5000);

      script.onload = () => {
        clearTimeout(timer);
        if (isMounted) setMapStatus('ready');
      };

      script.onerror = () => {
        clearTimeout(timer);
        if (isMounted) setMapStatus('error');
      };

      document.body.appendChild(script);
    } else {
      existingScript.addEventListener('load', () => {
        if (isMounted) setMapStatus('ready');
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Fit bounds helper
  const fitAllBounds = useCallback(() => {
    if (!mapInstanceRef.current || !window.L) return;
    setShowSearchArea(false);
    isUserInteractingRef.current = false;
    const L = window.L;
    const bounds = L.latLngBounds([]);
    let count = 0;

    places.forEach((p) => {
      const lat = p.coordinates?.lat ?? p.location?.latitude;
      const lng = p.coordinates?.lng ?? p.location?.longitude;
      if (typeof lat === 'number' && typeof lng === 'number') {
        bounds.extend([lat, lng]);
        count++;
      }
    });

    if (origin && typeof origin.latitude === 'number' && typeof origin.longitude === 'number') {
      bounds.extend([origin.latitude, origin.longitude]);
      count++;
    }

    if (count > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [places, origin]);

  const handleSearchThisArea = () => {
    if (!mapInstanceRef.current || !onSearchArea) return;
    const b = mapInstanceRef.current.getBounds();
    onSearchArea({
      north: b.getNorth(),
      south: b.getSouth(),
      east: b.getEast(),
      west: b.getWest(),
    });
    setShowSearchArea(false);
  };

  // Initialize and update Map when Leaflet is ready
  useEffect(() => {
    if (mapStatus !== 'ready' || !mapContainerRef.current || !window.L) return;

    const L = window.L;

    // Create map instance once
    if (!mapInstanceRef.current) {
      // Default center: Central Vietnam (around Da Nang coords) for national overview
      const defaultCenter = [16.05, 108.2];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors | Ventlore GIS',
        maxZoom: 18,
      }).addTo(map);

      map.on('movestart', () => {
        if (initialFitRef.current) {
          isUserInteractingRef.current = true;
        }
      });

      map.on('moveend', () => {
        setCurrentZoom(map.getZoom());
        if (isUserInteractingRef.current && onSearchArea) {
          setShowSearchArea(true);
        }
      });

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous destination markers
    Object.values(markersRef.current).forEach((m: any) => m.remove());
    markersRef.current = {};

    // Clear previous origin marker & circle
    if (originMarkerRef.current) {
      originMarkerRef.current.remove();
      originMarkerRef.current = null;
    }
    if (originCircleRef.current) {
      originCircleRef.current.remove();
      originCircleRef.current = null;
    }

    // 1. Render User Origin Marker if available
    if (origin && typeof origin.latitude === 'number' && typeof origin.longitude === 'number') {
      const originIcon = L.divIcon({
        className: 'ventlore-origin-pin',
        html: `
          <div style="
            width: 20px;
            height: 20px;
            background: #2563eb;
            border: 3px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(37,99,235,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="width: 6px; height: 6px; background: #ffffff; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const oMarker = L.marker([origin.latitude, origin.longitude], {
        icon: originIcon,
        title: t('explore.yourLocation'),
      }).addTo(map);

      const oAccuracyStr = origin.accuracyMeters
        ? t('explore.accuracyMeters', { acc: Math.round(origin.accuracyMeters) })
        : t('explore.yourLocation');

      oMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; padding: 2px;">
          <strong style="color: #2563eb;">📍 ${t('explore.yourLocation')}</strong>
          <div style="color: #666; font-size: 11px; margin-top: 2px;">${oAccuracyStr}</div>
        </div>
      `);

      originMarkerRef.current = oMarker;

      if (origin.accuracyMeters && origin.accuracyMeters > 0) {
        const oCircle = L.circle([origin.latitude, origin.longitude], {
          radius: origin.accuracyMeters,
          color: '#2563eb',
          weight: 1,
          opacity: 0.5,
          fillColor: '#2563eb',
          fillOpacity: 0.1,
        }).addTo(map);
        originCircleRef.current = oCircle;
      }
    }

    // 2. Render Destination Markers
    const bounds = L.latLngBounds([]);
    let validCoordsCount = 0;

    places.forEach((place) => {
      const lat = place.coordinates?.lat ?? place.location?.latitude;
      const lng = place.coordinates?.lng ?? place.location?.longitude;
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        return;
      }

      bounds.extend([lat, lng]);
      validCoordsCount++;

      const isSelected = selectedPlaceId === place.placeId;
      const isCompact = currentZoom <= 6 && !isSelected;
      const pinColor = isSelected ? '#F0A44B' : '#173F35';
      const iconText = isSelected ? '★' : '📍';

      const customIcon = isCompact
        ? L.divIcon({
            className: 'ventlore-map-dot',
            html: `
              <div style="
                width: 14px;
                height: 14px;
                background: #173F35;
                border-radius: 50%;
                border: 2px solid #F5F1E8;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                cursor: pointer;
              " title="${place.name} — ${place.regionName}"></div>
            `,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
            popupAnchor: [0, -10],
          })
        : L.divIcon({
            className: `ventlore-map-pin ${isSelected ? 'ventlore-pin-selected' : ''}`,
            html: `
              <div style="
                width: ${isSelected ? 32 : 28}px;
                height: ${isSelected ? 32 : 28}px;
                background: ${pinColor};
                color: #F5F1E8;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                border: 2px solid #F5F1E8;
                cursor: pointer;
              " aria-label="${place.name} — ${place.regionName}">
                <div style="transform: rotate(45deg); font-size: ${isSelected ? 14 : 12}px; font-weight: bold; line-height: 1;">
                  ${iconText}
                </div>
              </div>
            `,
            iconSize: isSelected ? [32, 32] : [28, 28],
            iconAnchor: isSelected ? [16, 32] : [14, 28],
            popupAnchor: isSelected ? [0, -32] : [0, -28],
          });

      const placeUrl = getLocalizedPath(`/places/${place.placeId}`);
      const distanceBadge =
        place.distanceKm !== null && place.distanceKm !== undefined
          ? `<div style="display: inline-block; background: #e0ece4; color: #173F35; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; margin-bottom: 4px;">
               ≈ ${place.distanceKm < 1 ? '< 1' : place.distanceKm.toFixed(1)} km (${t('explore.straightLineDistance')})
             </div>`
          : '';

      const popupHtml = `
        <div style="font-family: inherit; font-size: 13px; line-height: 1.4; min-width: 190px; max-width: 250px; padding: 2px;">
          <div style="color: #173F35; font-weight: 700; font-size: 14px; margin-bottom: 2px;">
            ${place.name}
          </div>
          <div style="color: #666; font-size: 11px; margin-bottom: 4px;">
            📍 ${place.regionName}
          </div>
          ${distanceBadge}
          <p style="color: #333; font-size: 11px; margin: 0 0 8px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${place.summary}
          </p>
          <a
            href="${placeUrl}"
            style="
              display: inline-block;
              background: #173F35;
              color: #ffffff;
              padding: 5px 10px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 600;
              text-decoration: none;
            "
          >
            ${t('explore.viewPlace')} &rarr;
          </a>
        </div>
      `;

      const marker = L.marker([lat, lng], {
        icon: customIcon,
        title: `Xem ${place.name} — ${place.regionName}`,
      })
        .addTo(map)
        .bindPopup(popupHtml);

      marker.on('click', () => {
        if (onSelectPlace) {
          onSelectPlace(place.placeId);
        }
      });

      markersRef.current[place.placeId] = marker;
    });

    // Fit bounds initially or when filter changes
    if (!initialFitRef.current && validCoordsCount > 0) {
      if (origin && typeof origin.latitude === 'number') {
        bounds.extend([origin.latitude, origin.longitude]);
      }
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      initialFitRef.current = true;
    }

    // Invalidate size when layout settles
    const resizeTimer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);

    return () => {
      clearTimeout(resizeTimer);
    };
  }, [places, origin, mapStatus, getLocalizedPath, t, onSelectPlace, selectedPlaceId, currentZoom, onSearchArea]);

  // Synchronize selectedPlaceId with popup and pan
  useEffect(() => {
    if (!selectedPlaceId || !markersRef.current[selectedPlaceId] || !mapInstanceRef.current) return;
    const marker = markersRef.current[selectedPlaceId];
    marker.openPopup();
    const latLng = marker.getLatLng();
    if (latLng) {
      mapInstanceRef.current.panTo(latLng, { animate: true });
    }
  }, [selectedPlaceId]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative rounded-card border border-sage overflow-hidden bg-surface-card shadow-sm ${className}`}>
      {/* 1. Map Canvas Element */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[420px] lg:min-h-[560px] bg-sage/20 z-0"
        aria-label="Interactive Geographic Map"
      />

      {/* 2. Loading State Overlay */}
      {mapStatus === 'loading' && (
        <div className="absolute inset-0 bg-surface-card/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-10 space-y-3">
          <div className="w-10 h-10 border-3 border-sage border-t-forest rounded-full animate-spin" />
          <p className="text-xs font-semibold text-ink-secondary">{t('common.loading')}</p>
        </div>
      )}

      {/* 3. Graceful Fallback if Leaflet CDN fails or Offline */}
      {mapStatus === 'error' && (
        <div className="absolute inset-0 bg-surface-canvas/95 flex flex-col items-center justify-center p-6 text-center z-10 space-y-3">
          <div className="w-12 h-12 rounded-full bg-status-pending-bg text-status-pending flex items-center justify-center">
            <AlertTriangleIcon className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm text-ink">{t('common.offlineNotice')}</h4>
          <p className="text-xs text-ink-secondary max-w-md leading-relaxed">
            {t('explore.mapHint')}
          </p>
          <div className="text-[11px] text-ink-muted border-t border-sage/60 pt-2 font-mono">
            OpenStreetMap Tiles • Offline Fallback Enabled
          </div>
        </div>
      )}

      {/* 4. Sleek Map Controls: Pins Counter & Fit Bounds */}
      {mapStatus === 'ready' && (
        <>
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest/90 text-ivory text-xs font-semibold backdrop-blur-xs shadow-sm">
              <MapPinIcon className="w-3.5 h-3.5 text-amber" />
              <span>{places.length} {t('explore.placesUnit')}</span>
            </span>

            <button
              type="button"
              onClick={fitAllBounds}
              title={t('explore.fitAllBoundsTitle')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-ink text-xs font-semibold backdrop-blur-xs border border-sage hover:bg-white shadow-xs transition-colors min-h-[32px]"
            >
              <RefreshCwIcon className="w-3 h-3 text-forest" />
              <span>{t('explore.fitAllBounds')}</span>
            </button>
          </div>

          {/* 5. Floating "Search this area" Button */}
          {showSearchArea && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 animate-fadeIn">
              <button
                type="button"
                onClick={handleSearchThisArea}
                className="min-h-[36px] px-4 py-1.5 rounded-full bg-forest text-white text-xs font-bold shadow-md hover:bg-forest-hover transition-all flex items-center gap-1.5 border border-white/20 hover:scale-105 active:scale-95"
              >
                <SearchIcon className="w-3.5 h-3.5 text-amber" />
                <span>{t('explore.searchThisArea')}</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
