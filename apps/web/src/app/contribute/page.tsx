'use client';

import React, { Suspense } from 'react';
import { AppShell } from '@/components/AppShell';
import { ContributeView } from '@/components/ContributeView';

export default function ContributePage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-ink-muted">Đang tải...</div>}>
        <ContributeView />
      </Suspense>
    </AppShell>
  );
}
