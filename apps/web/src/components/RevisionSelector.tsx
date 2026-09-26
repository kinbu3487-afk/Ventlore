'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RevisionItemSummaryDTO } from '@ventlore/api-client';
import { useI18n } from '../lib/i18n';
import { VerificationBadge } from './VerificationPanel';
import { LayersIcon, ClockIcon, ChevronDownIcon } from './Icons';

interface RevisionSelectorProps {
  postId: string;
  currentRevisionId: string;
  revisions: RevisionItemSummaryDTO[];
}

export function RevisionSelector({
  postId,
  currentRevisionId,
  revisions,
}: RevisionSelectorProps) {
  const { t, formatDate, getLocalizedPath } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const currentRev = revisions.find((r) => r.revisionId === currentRevisionId) || revisions[0];

  return (
    <div className="rounded-card border border-sage bg-surface-card p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-sage/60 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <LayersIcon className="w-5 h-5 text-forest shrink-0" />
          <h3 className="font-bold text-ink text-sm sm:text-base">
            {t('post.revisionHistory')}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-forest hover:text-forest-hover flex items-center gap-1 font-semibold px-2 py-1 rounded bg-forest/10 hover:bg-forest/15 transition-colors"
          aria-expanded={isExpanded}
        >
          <span>
            {isExpanded
              ? t('post.hideVersionHistory', { count: revisions.length })
              : t('post.viewVersionHistory', { count: revisions.length })}
          </span>
          <ChevronDownIcon
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Summary card when collapsed: shows current viewing version clearly */}
      {!isExpanded && currentRev && (
        <div className="p-3 rounded-control border border-forest/40 bg-forest/5 text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-ink text-sm">
                {t('post.version', { number: currentRev.versionNumber })}
              </span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-sage/60 text-ink-secondary">
                {currentRev.displayCode}
              </span>
              <span className="text-[10px] font-bold text-forest bg-sage/80 px-2 py-0.5 rounded-full">
                {t('post.viewingNow')}
              </span>
            </div>
            <VerificationBadge status={currentRev.verificationStatus} size="sm" />
          </div>
          <div className="text-xs text-ink-secondary line-clamp-2">
            {currentRev.title}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-ink-muted pt-1">
            <ClockIcon className="w-3 h-3 shrink-0" />
            <span>{t('post.submittedAt')}: {formatDate(currentRev.createdAt)}</span>
          </div>
        </div>
      )}

      {/* Expanded list of all revisions for deep linking */}
      {isExpanded && (
        <div className="space-y-2.5">
          {revisions.map((rev) => {
            const isSelected = rev.revisionId === currentRevisionId;

            return (
              <Link
                key={rev.revisionId}
                href={getLocalizedPath(`/posts/${postId}?revisionId=${rev.revisionId}`)}
                scroll={false}
                className={`block p-3 rounded-control border transition-all text-left ${
                  isSelected
                    ? 'border-forest bg-forest/5 ring-1 ring-forest shadow-xs'
                    : 'border-sage/80 bg-surface-card hover:bg-surface-canvas hover:border-sage'
                }`}
              >
                {/* Header row: Version number + display code + Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-ink text-sm">
                      {t('post.version', { number: rev.versionNumber })}
                    </span>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-sage/60 text-ink-secondary">
                      {rev.displayCode}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-forest bg-sage/80 px-2 py-0.5 rounded-full">
                        {t('post.viewingNow')}
                      </span>
                    )}
                  </div>

                  <div className="shrink-0 max-w-full">
                    <VerificationBadge status={rev.verificationStatus} size="sm" />
                  </div>
                </div>

                {/* Title */}
                <div className="mt-1.5 text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                  {rev.title}
                </div>

                {/* Meta: Submission time */}
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-muted">
                  <ClockIcon className="w-3 h-3 shrink-0" />
                  <span>{t('post.submittedAt')}: {formatDate(rev.createdAt)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <p className="mt-3 text-[11px] text-ink-muted border-t border-sage/40 pt-2 leading-relaxed">
        {t('post.immutableExplanation')}
      </p>
    </div>
  );
}
