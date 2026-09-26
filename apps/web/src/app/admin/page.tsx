'use client';

import React, { Suspense } from 'react';
import { AppShell } from '@/components/AppShell';
import { AdminWorkspaceView } from '@/components/AdminWorkspaceView';

export default function AdminPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-ink-muted">Đang tải...</div>}>
        <AdminWorkspaceView />
      </Suspense>
    </AppShell>
  );
}
