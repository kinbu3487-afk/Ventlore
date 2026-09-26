'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { PublicLedger } from '@/components/PublicLedger';
import { AsyncState } from '@/components/AsyncState';
import { mockApiClient, TransparencySummaryDTO } from '@ventlore/api-client';
import { useI18n } from '@/lib/i18n';

export default function TransparencyPage() {
  const { locale } = useI18n();
  const [data, setData] = useState<TransparencySummaryDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadLedger() {
      setIsLoading(true);
      try {
        const summary = await mockApiClient.getTransparencySummary(2026, locale);
        if (mounted) {
          setData(summary);
          setIsLoading(false);
        }
      } catch {
        if (mounted) setIsLoading(false);
      }
    }
    loadLedger();
    return () => {
      mounted = false;
    };
  }, [locale]);

  return (
    <AppShell>
      <div className="space-y-6">
        <AsyncState isLoading={isLoading}>
          {data && <PublicLedger data={data} />}
        </AsyncState>
      </div>
    </AppShell>
  );
}
