'use client';

import React, { Suspense } from 'react';
import { AppShell } from '@/components/AppShell';
import { AccountView } from '@/components/AccountView';

export default function AccountPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-ink-muted">Đang tải...</div>}>
        <AccountView />
      </Suspense>
    </AppShell>
  );
}
