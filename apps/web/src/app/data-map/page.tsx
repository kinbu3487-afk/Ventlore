'use client';

import React, { Suspense } from 'react';
import { AppShell } from '@/components/AppShell';
import { DataMapView } from '@/components/DataMapView';

export default function DataMapPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-ink-muted">Đang tải Data Map...</div>}>
        <DataMapView />
      </Suspense>
    </AppShell>
  );
}
