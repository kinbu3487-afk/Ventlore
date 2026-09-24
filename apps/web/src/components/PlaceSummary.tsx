'use client';

import React from 'react';
import Link from 'next/link';
import { PlaceDetailDTO } from '@ventlore/api-client';
import { PlaceStatus } from '@ventlore/domain';
import { useI18n } from '../lib/i18n';
import { VerificationBadge } from './VerificationPanel';
import {
  MapPinIcon,
  AlertTriangleIcon,
  ChevronRightIcon,
  CompassIcon,
  ArrowRightIcon,
} from './Icons';

interface PlaceSummaryProps {
  place: PlaceDetailDTO;
}

export function PlaceSummary({ place }: PlaceSummaryProps) {
  const { t, formatDate, getLocalizedPath } = useI18n();
  const isMerged = place.status === PlaceStatus.MERGED;
  const coverImage = place.coverImageUrl || place.imageUrl || '/destinations/hero-coastal.svg';

  const statusLabel =
    place.status === PlaceStatus.ACTIVE
      ? t('place.statusActive')
      : place.status === PlaceStatus.MERGED
      ? t('place.statusMerged')
      : t('place.statusCandidate');

  return (
    <div className="space-y-6">
      {/* 1. Neutral Merged Notification Banner */}
      {isMerged && place.canonicalPlace && (
        <div className="rounded-card border border-sage bg-surface-canvas p-5 text-ink shadow-xs">
          <div className="flex items-start gap-3">
            <CompassIcon className="w-5 h-5 text-forest shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-bold text-sm sm:text-base text-ink">
                {t('place.mergedTitle')}
              </h4>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {t('place.mergedDescription')}
              </p>
              <div className="pt-1">
                <Link
                  href={getLocalizedPath(`/places/${place.canonicalPlace.placeId}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-control font-semibold text-xs text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs"
                >
                  <span>{t('place.redirectToCanonical', { name: place.canonicalPlace.name })}</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hero Cover Banner with Depth */}
      <div className="rounded-card border border-sage overflow-hidden bg-surface-card shadow-sm">
        <div className="relative h-64 sm:h-80 md:h-96 w-full bg-forest/20">
          <img
            src={coverImage}
            alt={place.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const fallback = place.displayCode === 'PLC-000004'
                ? '/destinations/co-to.svg'
                : place.displayCode === 'PLC-000005'
                ? '/destinations/tay-con-linh.svg'
                : '/destinations/cat-co-3.svg';
              (e.currentTarget as HTMLImageElement).src = fallback;
            }}
          />
          <div className="absolute top-4 right-4 z-10">
            <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[11px] text-white/90 font-medium">
              {t('explore.imageAttribution')}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-control bg-white/20 text-ivory text-xs font-semibold backdrop-blur-md">
                <MapPinIcon className="w-3.5 h-3.5 text-amber" />
                {place.regionName}
              </span>
              {place.coordinates && (
                <span className="font-mono text-xs text-ivory/90 bg-black/40 px-2.5 py-1 rounded-control backdrop-blur-sm">
                  {place.coordinates.lat.toFixed(4)}°N, {place.coordinates.lng.toFixed(4)}°E
                </span>
              )}
              <span className="px-2.5 py-1 rounded-control bg-white/20 text-ivory text-xs font-medium backdrop-blur-sm">
                {statusLabel}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {place.name}
            </h1>
          </div>
        </div>

        {/* Place Description Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
            {place.description}
          </p>

          {/* 3. Safety Warnings Section (Crucial Invariant: No 'absolute safety') */}
          {place.warnings.length > 0 && (
            <div className="rounded-card border border-amber/30 bg-amber/10 p-5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-ink text-sm">
                <AlertTriangleIcon className="w-5 h-5 shrink-0 text-amber-600" />
                <span>{t('place.warningsTitle')}</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-ink list-disc list-inside">
                {place.warnings.map((warn, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {warn}
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-amber/20 text-[11px] text-ink-muted">
                {t('place.safetyDisclaimer')}
              </div>
            </div>
          )}

          {/* Activities list */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-sage/60 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-ink-secondary">{t('place.suitableActivities')}:</span>
              {place.activities.map((a) => (
                <span
                  key={a}
                  className="px-2.5 py-1 rounded-full bg-surface-canvas text-ink font-medium border border-sage/60"
                >
                  {a}
                </span>
              ))}
            </div>

            <div className="text-ink-muted">
              {t('place.postsSectionTitle', { count: place.posts.length })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Posts relating to this place */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-ink flex items-center justify-between">
          <span>{t('place.postsSectionTitle', { count: place.posts.length })}</span>
        </h2>

        {place.posts.length === 0 ? (
          <div className="p-8 rounded-card border border-dashed border-sage bg-surface-card text-center text-sm text-ink-secondary">
            {t('place.emptyPosts')}
          </div>
        ) : (
          <div className="space-y-3">
            {place.posts.map((post) => (
              <Link
                key={post.postId}
                href={getLocalizedPath(`/posts/${post.postId}`)}
                className="block p-5 rounded-card border border-sage bg-surface-card hover:border-forest/60 hover:shadow-md transition-all text-left group"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base sm:text-lg text-ink group-hover:text-forest transition-colors">
                      {post.currentRevision.title}
                    </h3>
                  </div>
                  <VerificationBadge
                    status={post.currentRevision.verificationStatus}
                    size="sm"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted pt-3 border-t border-sage/40">
                  <div className="flex items-center gap-2">
                    <span>
                      {t('place.authorPrefix')}: <strong className="text-ink">{post.author.displayName}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      {t('place.observedAt')}: {formatDate(post.currentRevision.observedAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-forest font-semibold">
                    <span>{t('explore.viewPlace')}</span>
                    <ChevronRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
