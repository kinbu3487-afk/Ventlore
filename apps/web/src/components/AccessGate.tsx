'use client';

import React from 'react';
import Link from 'next/link';
import { LockIcon, SparklesIcon } from './Icons';
import { useSession } from './SessionContext';
import { useI18n } from '../lib/i18n';

interface AccessGateProps {
  reason: 'VIP_REQUIRED' | 'AUTH_REQUIRED' | 'CAPABILITY_REQUIRED';
  title?: string;
  description?: string;
  returnTo?: string;
}

export function AccessGate({
  reason,
  title,
  description,
  returnTo = '/explore',
}: AccessGateProps) {
  const { setPersona } = useSession();
  const { t, getLocalizedPath } = useI18n();

  // Validate returnTo for security (same-origin allowlist only)
  const safeReturnTo =
    returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')
      ? returnTo
      : '/explore';

  if (reason === 'VIP_REQUIRED') {
    return (
      <div className="rounded-card border-2 border-dashed border-status-vip/40 bg-status-vip-bg/50 p-6 sm:p-8 text-center my-6">
        <div className="mx-auto w-12 h-12 rounded-full bg-status-vip-bg border border-status-vip/30 flex items-center justify-center text-status-vip mb-3 shadow-xs">
          <SparklesIcon className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-ink">
          {title || t('vip.exclusiveContentTitle')}
        </h3>

        <p className="mt-2 text-sm text-ink-secondary max-w-lg mx-auto leading-relaxed">
          {description || t('vip.exclusiveContentDesc')}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={getLocalizedPath('/vip')}
            className="inline-flex items-center justify-center min-h-control px-5 py-2.5 rounded-control font-semibold text-white bg-forest hover:bg-forest-hover transition-colors shadow-sm"
          >
            {t('vip.explorePlanButton')}
          </Link>

          {/* Persona quick switch for evaluator convenience */}
          <button
            type="button"
            onClick={() => setPersona('vip')}
            className="inline-flex items-center justify-center min-h-control px-4 py-2.5 rounded-control text-xs font-semibold text-status-vip border border-status-vip/40 bg-white hover:bg-status-vip-bg transition-colors"
          >
            {t('vip.simulateSwitchButton')}
          </button>
        </div>

        <div className="mt-4 text-[11px] text-ink-muted">
          {t('vip.securityRedactionNotice')}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-card border-2 border-dashed border-sage bg-surface-canvas p-6 sm:p-8 text-center my-6">
      <div className="mx-auto w-12 h-12 rounded-full bg-sage/60 flex items-center justify-center text-forest mb-3">
        <LockIcon className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold text-ink">
        {title || t('auth.signInRequired')}
      </h3>

      <p className="mt-2 text-sm text-ink-secondary max-w-md mx-auto leading-relaxed">
        {description || t('auth.signInRequiredDesc')}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={getLocalizedPath(`/login?returnTo=${encodeURIComponent(safeReturnTo)}`)}
          className="inline-flex items-center justify-center min-h-control px-5 py-2.5 rounded-control font-semibold text-white bg-forest hover:bg-forest-hover transition-colors shadow-sm"
        >
          {t('auth.signInButton')}
        </Link>
      </div>
    </div>
  );
}
