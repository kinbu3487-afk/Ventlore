'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PlaceSummaryDTO } from '@ventlore/api-client';
import { useI18n } from '../lib/i18n';
import { MapPinIcon, CompassIcon, AlertTriangleIcon } from './Icons';

interface PlaceMapProps {
  places: PlaceSummaryDTO[];
  selectedPlaceId?: string | null;
  onSelectPlace?: (placeId: string) => void;
  className?: string;
}

declare global {
  interface Window {
    L: any;
  }
}

export function PlaceMap({ places, selectedPlaceId, onSelectPlace, className = '' }: PlaceMapProps) {
  const { t, getLocalizedPath } = useI18n();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  // Load Leaflet CSS and JS dynamically if not already present
  useEffect(() => {
    let isMounted = true;

    // Check if Leaflet is already loaded
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
          // Timeout after 5s if CDN is blocked / offline
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

  // Initialize and update Map when Leaflet is ready
  useEffect(() => {
    if (mapStatus !== 'ready' || !mapContainerRef.current || !window.L) return;

    const L = window.L;

    // Avoid re-creating existing map instance
    if (!mapInstanceRef.current) {
      // Default center: Northern Vietnam (around Cat Ba / Ha Long coords)
      const defaultCenter = [20.85, 107.2];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 8,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      // Standard OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors | Ventlore GIS',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    Object.values(markersRef.current).forEach((m: any) => m.remove());
    markersRef.current = {};

    // Custom Ventlore Pine Green SVG Marker Icon
    const customIcon = L.divIcon({
      className: 'ventlore-map-pin',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: #173F35;
          color: #F0A44B;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          border: 2px solid #F5F1E8;
        ">
          <div style="transform: rotate(45deg); font-size: 14px; font-weight: bold; line-height: 1;">
            📍
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const bounds = L.latLngBounds([]);
    let validCoordsCount = 0;

    places.forEach((place) => {
      if (!place.coordinates || typeof place.coordinates.lat !== 'number' || typeof place.coordinates.lng !== 'number') {
        return;
      }

      const { lat, lng } = place.coordinates;
      bounds.extend([lat, lng]);
      validCoordsCount++;

      const placeUrl = getLocalizedPath(`/places/${place.placeId}`);
      const popupHtml = `
        <div style="font-family: inherit; font-size: 13px; line-height: 1.4; min-width: 180px; max-width: 240px; padding: 2px;">
          <div style="color: #173F35; font-weight: 700; font-size: 14px; margin-bottom: 3px;">
            ${place.name}
          </div>
          <div style="color: #666; font-size: 11px; margin-bottom: 6px;">
            📍 ${place.regionName}
          </div>
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

      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupHtml);

      marker.on('click', () => {
        if (onSelectPlace) {
          onSelectPlace(place.placeId);
        }
      });

      markersRef.current[place.placeId] = marker;
    });

    if (validCoordsCount > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }

    // Handle map resize when layout settles
    const resizeTimer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);

    return () => {
      clearTimeout(resizeTimer);
    };
  }, [places, mapStatus, getLocalizedPath, t, onSelectPlace]);

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
        className="w-full h-full min-h-[420px] bg-sage/20 z-0"
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

      {/* 4. Map View Hints & Pin Counter */}
      {mapStatus === 'ready' && (
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/90 text-ivory text-xs font-semibold backdrop-blur-xs shadow-md">
            <CompassIcon className="w-3.5 h-3.5 text-amber" />
            <span>OpenStreetMap</span>
            <span className="text-[10px] opacity-75 font-mono">({places.length} ghim)</span>
          </span>
        </div>
      )}
    </div>
  );
}
