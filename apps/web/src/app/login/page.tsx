import React from 'react';
import { AppShell } from '@/components/AppShell';
import { SocialLogin } from '@/components/SocialLogin';

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ returnTo?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const returnTo = resolvedSearchParams?.returnTo || '/explore';

  return (
    <AppShell>
      <div className="py-6 sm:py-12 flex flex-col items-center justify-center">
        <SocialLogin returnTo={returnTo} />
      </div>
    </AppShell>
  );
}
