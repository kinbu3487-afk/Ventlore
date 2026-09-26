'use client';

import React, { Suspense } from 'react';
import { AppShell } from '@/components/AppShell';
import { ExpertWorkspaceView } from '@/components/ExpertWorkspaceView';

export default function ExpertPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-ink-muted">Đang tải...</div>}>
        <ExpertWorkspaceView />
      </Suspense>
    </AppShell>
  );
}
