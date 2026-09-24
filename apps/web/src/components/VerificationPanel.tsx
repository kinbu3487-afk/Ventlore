'use client';

import React from 'react';
import { VerificationStatus } from '@ventlore/domain';
import { useI18n } from '../lib/i18n';
import {
  ShieldCheckIcon,
  ShieldAlertIcon,
  ClockIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
} from './Icons';

interface VerificationPanelProps {
  status: VerificationStatus;
  scope?: string | null;
  checkedAt?: string | null;
  validUntil?: string | null;
  inspectorNotes?: string | null;
  revisionDisplayCode?: string;
  isDetailed?: boolean;
}

export function VerificationBadge({
  status,
  size = 'md',
}: {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { t } = useI18n();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2',
  }[size];

  switch (status) {
    case VerificationStatus.VERIFIED:
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-control border border-status-success/30 bg-status-success-bg text-status-success ${sizeClasses}`}
        >
          <ShieldCheckIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>{t('post.verifiedTitle')}</span>
        </span>
      );
    case VerificationStatus.UNVERIFIED:
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-control border border-status-neutral/30 bg-status-neutral-bg text-status-neutral ${sizeClasses}`}
        >
          <AlertCircleIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>{t('post.unverifiedTitle')}</span>
        </span>
      );
    case VerificationStatus.IN_REVIEW:
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-control border border-status-review/30 bg-status-review-bg text-status-review ${sizeClasses}`}
        >
          <ClockIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>{t('post.inReviewTitle')}</span>
        </span>
      );
    case VerificationStatus.NEEDS_CHANGES:
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-control border border-status-pending/30 bg-status-pending-bg text-status-pending ${sizeClasses}`}
        >
          <AlertTriangleIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>{t('post.needsChangesTitle')}</span>
        </span>
      );
    case VerificationStatus.INCONCLUSIVE:
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-control border border-status-pending/30 bg-status-pending-bg text-status-pending ${sizeClasses}`}
        >
          <AlertCircleIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>{t('post.inconclusiveTitle')}</span>
        </span>
      );
    case VerificationStatus.EXPIRED:
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-control border border-status-danger/30 bg-status-danger-bg text-status-danger ${sizeClasses}`}
        >
          <AlertTriangleIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>{t('post.expiredTitle')}</span>
        </span>
      );
    case VerificationStatus.REJECTED:
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-control border border-status-danger/30 bg-status-danger-bg text-status-danger ${sizeClasses}`}
        >
          <ShieldAlertIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>{t('post.rejectedTitle')}</span>
        </span>
      );
    case VerificationStatus.SUSPENDED:
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-control border border-status-danger/30 bg-status-danger-bg text-status-danger ${sizeClasses}`}
        >
          <AlertTriangleIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>{t('post.suspendedTitle')}</span>
        </span>
      );
    default:
      return null;
  }
}

export function VerificationPanel({
  status,
  scope,
  checkedAt,
  validUntil,
  inspectorNotes,
  revisionDisplayCode,
  isDetailed = true,
}: VerificationPanelProps) {
  const { t, formatDate } = useI18n();

  const formattedCheckedAt = checkedAt ? formatDate(checkedAt) : null;
  const formattedValidUntil = validUntil ? formatDate(validUntil) : null;

  return (
    <div className="rounded-card border border-sage bg-surface-card p-4 sm:p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sage/60 pb-3">
        <div className="flex items-center gap-2.5">
          <VerificationBadge status={status} size="md" />
          {revisionDisplayCode && (
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sage/60 text-ink-secondary">
              {revisionDisplayCode}
            </span>
          )}
        </div>
        {status === VerificationStatus.VERIFIED && validUntil && (
          <span className="text-xs text-ink-secondary flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5 text-status-success" />
            {t('post.validUntil')}: <strong className="text-ink">{formattedValidUntil}</strong>
          </span>
        )}
      </div>

      {isDetailed && (
        <div className="mt-3.5 space-y-2.5 text-sm">
          {scope && (
            <div className="text-ink text-xs sm:text-sm">
              <span className="font-semibold text-ink-secondary">{t('post.verificationScope')}: </span>
              <span>{scope}</span>
            </div>
          )}

          {/* Status-specific descriptions according to C06 state machine */}
          {status === VerificationStatus.UNVERIFIED && (
            <p className="text-ink-secondary italic bg-status-neutral-bg/60 p-2.5 rounded-control text-xs">
              {t('post.unverifiedDesc')}
            </p>
          )}

          {status === VerificationStatus.IN_REVIEW && (
            <p className="text-status-review font-medium bg-status-review-bg/60 p-2.5 rounded-control text-xs">
              {t('post.inReviewDesc')}
            </p>
          )}

          {status === VerificationStatus.NEEDS_CHANGES && (
            <p className="text-status-pending font-medium bg-status-pending-bg/60 p-2.5 rounded-control text-xs">
              {t('post.needsChangesDesc')}
            </p>
          )}

          {status === VerificationStatus.INCONCLUSIVE && (
            <p className="text-status-pending font-medium bg-status-pending-bg/60 p-2.5 rounded-control text-xs">
              {t('post.inconclusiveDesc')}
            </p>
          )}

          {status === VerificationStatus.REJECTED && (
            <p className="text-status-danger font-medium bg-status-danger-bg/60 p-2.5 rounded-control text-xs">
              {t('post.rejectedDesc')}
            </p>
          )}

          {status === VerificationStatus.EXPIRED && (
            <div className="bg-status-danger-bg text-status-danger p-3 rounded-control text-xs">
              <strong>{t('post.expiredTitle')}: </strong>
              <span>{t('post.expiredDesc', { date: formattedValidUntil || '' })}</span>
            </div>
          )}

          {status === VerificationStatus.SUSPENDED && (
            <p className="text-status-danger font-medium bg-status-danger-bg/60 p-2.5 rounded-control text-xs">
              {t('post.suspendedDesc')}
            </p>
          )}

          {/* Inspector notes only show if this revision was legitimately inspected */}
          {inspectorNotes && status !== VerificationStatus.UNVERIFIED && (
            <div className="text-xs bg-surface-canvas p-3 rounded-control border border-sage">
              <div className="font-semibold text-ink-secondary mb-1">{t('post.inspectorNotes')}:</div>
              <p className="text-ink leading-relaxed">{inspectorNotes}</p>
              {formattedCheckedAt && (
                <div className="mt-1 text-[11px] text-ink-muted">
                  {t('post.checkedAt')}: {formattedCheckedAt}
                </div>
              )}
            </div>
          )}

          {/* Bottom disclaimer: only VERIFIED gets affirmative statement, noAbsoluteSafety is global */}
          <div className="pt-2 text-[11px] text-ink-muted border-t border-sage/40 flex flex-wrap items-center justify-between gap-2">
            <span>
              {status === VerificationStatus.VERIFIED
                ? t('post.independentVerificationDesc')
                : t('post.unverifiedDesc')}
            </span>
            <span className="font-medium text-amber-700">{t('place.noAbsoluteSafety')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
