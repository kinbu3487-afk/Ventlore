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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="rounded-card border border-sage bg-surface-card p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-sage/60 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <LayersIcon className="w-5 h-5 text-forest shrink-0" />
          <h3 className="font-bold text-ink text-sm sm:text-base">
            {t('post.revisionHistory', { count: revisions.length })}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-xs text-ink-secondary hover:text-ink flex items-center gap-1 font-medium"
          aria-expanded={!isCollapsed}
        >
          <span className="text-[11px] font-medium text-ink-muted hidden sm:inline">
            {t('post.immutableSnapshot')}
          </span>
          <ChevronDownIcon
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isCollapsed ? '-rotate-90' : ''
            }`}
          />
        </button>
      </div>

      {!isCollapsed && (
        <div className="space-y-2.5">
          {revisions.map((rev) => {
            const isSelected = rev.revisionId === currentRevisionId;

            return (
              <Link
                key={rev.revisionId}
                href={getLocalizedPath(`/posts/${postId}?revisionId=${rev.revisionId}`)}
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
