import React from 'react';
import { AppShell } from '@/components/AppShell';
import { SocialLogin } from '@/components/SocialLogin';

export default function LoginPage() {
  return (
    <AppShell>
      <div className="py-6 sm:py-12 flex flex-col items-center justify-center">
        <SocialLogin />
      </div>
    </AppShell>
  );
}
