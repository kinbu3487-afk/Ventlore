'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { SocialLogin } from '@/components/SocialLogin';
import { LoadingSpinner } from '@/components/AsyncState';

function LoginContent() {
  const searchParams = useSearchParams();
  const returnTo = searchParams?.get('returnTo') || '/explore';

  return (
    <div className="py-6 sm:py-12 flex flex-col items-center justify-center">
      <SocialLogin returnTo={returnTo} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AppShell>
      <Suspense fallback={<LoadingSpinner label="Đang chuẩn bị xác thực..." />}>
        <LoginContent />
      </Suspense>
    </AppShell>
  );
}
