'use client';

import React from 'react';
import Link from 'next/link';
import { PostDetailDTO } from '@ventlore/api-client';
import { TipRouteStatus } from '@ventlore/domain';
import { useI18n } from '../lib/i18n';
import { VerificationPanel } from './VerificationPanel';
import { RevisionSelector } from './RevisionSelector';
import { AccessGate } from './AccessGate';
import { MarkdownView } from './MarkdownView';
import {
  MapPinIcon,
  ClockIcon,
  UserIcon,
  AlertTriangleIcon,
  WalletIcon,
  CheckIcon,
  GlobeIcon,
} from './Icons';

interface PostReaderProps {
  post: PostDetailDTO;
}

export function PostReader({ post }: PostReaderProps) {
  const { t, formatDate, locale, getLocalizedPath } = useI18n();
  const { revision, author, place, revisionsList } = post;

  const isUntranslated = revision.isTranslated === false && locale !== 'vi';
  const coverImage = revision.coverImageUrl || '/destinations/hero-coastal.svg';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left / Main Column: Content, Author, Verification (lg:col-span-8) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Post Title & Location Breadcrumb */}
        <div className="rounded-card border border-sage bg-surface-card p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted mb-3">
            <Link
              href={getLocalizedPath(`/places/${place.placeId}`)}
              className="inline-flex items-center gap-1 text-forest hover:underline font-semibold"
            >
              <MapPinIcon className="w-3.5 h-3.5 text-forest" />
              <span>{place.name}</span>
            </Link>
            <span>•</span>
            <span className="font-mono">{place.regionName}</span>
            <span>•</span>
            <span className="font-mono bg-sage/60 px-2 py-0.5 rounded text-ink-secondary">
              {post.displayCode}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight mb-4 tracking-tight">
            {revision.title}
          </h1>

          {/* Fallback Notice when translation is not available in non-vi locale */}
          {isUntranslated && (
            <div className="mb-4 p-3 rounded-control bg-surface-canvas border border-sage/80 text-xs text-ink-secondary flex items-start gap-2.5">
              <GlobeIcon className="w-4 h-4 text-forest shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold text-ink">
                  {t('post.contentInVietnameseOnly')}
                </span>
                <p className="text-[11px] text-ink-muted">
                  Bản dịch cho ngôn ngữ hiện tại đang được cộng đồng thực địa cập nhật.
                </p>
              </div>
            </div>
          )}

          {/* Author Byline */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-sage/60 text-xs">
            <Link
              href={getLocalizedPath(`/people/${author.handle}`)}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                {author.avatarUrl ? (
                  <img
                    src={author.avatarUrl}
                    alt={author.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="font-semibold text-ink group-hover:text-forest transition-colors">
                  {author.displayName}
                </div>
                <div className="text-ink-muted">@{author.handle}</div>
              </div>
            </Link>

            <div className="flex items-center gap-1.5 text-ink-muted">
              <ClockIcon className="w-3.5 h-3.5" />
              <span>
                {t('place.observedAt')}: <strong className="text-ink">{formatDate(revision.observedAt)}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Verification Details Panel (C06) */}
        <VerificationPanel
          status={revision.verificationStatus}
          scope={revision.scope}
          checkedAt={revision.checkedAt}
          validUntil={revision.validUntil}
          inspectorNotes={revision.inspectorNotes}
          revisionDisplayCode={revision.displayCode}
        />

        {/* Post Body & Content */}
        <div className="rounded-card border border-sage bg-surface-card p-6 sm:p-8 shadow-sm">
          {/* Cover image if available */}
          {revision.coverImageUrl && (
            <div className="mb-6 rounded-control overflow-hidden aspect-[16/9] max-h-80 bg-sage/20">
              <img
                src={coverImage}
                alt={revision.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {revision.isContentRedacted ? (
            /* Access Gate if content is VIP and user is not entitled */
            <AccessGate
              reason="VIP_REQUIRED"
              returnTo={`/posts/${post.postId}?revisionId=${revision.revisionId}`}
            />
          ) : (
            <div className="prose max-w-none text-ink">
              <MarkdownView content={revision.content} />
            </div>
          )}

          {/* Mandatory Disclaimers: Never "absolute safety guarantee" */}
          <div className="mt-8 p-4 rounded-control bg-surface-canvas border border-sage text-xs text-ink-secondary space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-ink">
              <AlertTriangleIcon className="w-4 h-4 text-amber-600" />
              <span>{t('place.warningsTitle')}</span>
            </div>
            <p>
              {t('post.safetyDisclaimer')}
            </p>
          </div>
        </div>

        {/* Claims Checklist (Nhận định thực địa gắn với revision) */}
        {revision.claims.length > 0 && (
          <div className="rounded-card border border-sage bg-surface-card p-6 shadow-sm">
            <h3 className="font-bold text-base text-ink mb-3 flex items-center justify-between">
              <span>{t('post.claimsTitle', { count: revision.claims.length })}</span>
              <span className="text-xs font-normal text-ink-muted">
                {t('post.claimsAttachedToRevision')}
              </span>
            </h3>

            <div className="space-y-2">
              {revision.claims.map((claim) => (
                <div
                  key={claim.claimId}
                  className="p-3 rounded-control border border-sage/60 bg-surface-canvas text-xs flex items-start gap-2.5"
                >
                  <CheckIcon className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-medium text-ink">{claim.text}</span>
                    {claim.category && (
                      <span className="ml-2 font-mono text-[10px] text-ink-muted bg-white px-1.5 py-0.5 rounded border border-sage/40">
                        {claim.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Onchain Tip Route Status (Branch 4 after approval: 80% author / 20% project) */}
        {revision.tipRoute && revision.tipRoute.status === TipRouteStatus.ACTIVE && (
          <div className="rounded-card border border-forest/30 bg-forest/5 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center shrink-0 shadow-xs">
                <WalletIcon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-ink">
                  {t('post.tipRouteTitle')}
                </h4>
                <p className="text-xs text-ink-secondary">
                  {t('post.tipSplitRatio')} • {t('post.beneficiaryAddress')}: <code className="font-mono text-forest font-semibold">{revision.tipRoute.beneficiaryAddress}</code>
                </p>
              </div>
            </div>

            <div className="text-xs font-semibold text-forest bg-white px-3 py-1.5 rounded-control border border-forest/20 shadow-xs">
              {t('post.tipRouteActive', { version: revision.versionNumber })}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Revision Selector & Meta (lg:col-span-4) */}
      <div className="lg:col-span-4 space-y-6">
        {/* Revision Selector (C07) */}
        <RevisionSelector
          postId={post.postId}
          currentRevisionId={revision.revisionId}
          revisions={revisionsList}
        />

        {/* Sources and References */}
        {revision.sources.length > 0 && (
          <div className="rounded-card border border-sage bg-surface-card p-4 shadow-sm text-xs">
            <h4 className="font-bold text-ink mb-2">{t('post.sourcesTitle')}</h4>
            <ul className="space-y-1.5 text-ink-secondary list-disc list-inside">
              {revision.sources.map((src, idx) => (
                <li key={idx} className="line-clamp-2">
                  {src.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Author Short Bio */}
        <div className="rounded-card border border-sage bg-surface-card p-5 shadow-sm text-xs space-y-3">
          <h4 className="font-bold text-ink">{t('post.aboutAuthor')}</h4>
          <p className="text-ink-secondary leading-relaxed">{author.bio}</p>
          <Link
            href={getLocalizedPath(`/people/${author.handle}`)}
            className="inline-block text-forest hover:text-forest-hover font-semibold underline"
          >
            {t('post.viewAuthorProfile')} →
          </Link>
        </div>
      </div>
    </div>
  );
}
