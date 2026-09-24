import React from 'react';
import { UserProfileView } from '@/app/people/[handle]/UserProfileView';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

export function generateStaticParams() {
  const handles = [
    'minh_trailguide',
    'bin_traveler',
    'hoang_ranger',
    'an_vip_explorer',
    'guest_reader',
  ];

  const params: Array<{ locale: string; handle: string }> = [];
  for (const loc of SUPPORTED_LOCALES) {
    for (const handle of handles) {
      params.push({ locale: loc.code, handle });
    }
  }
  return params;
}

export default async function LocalizedUserProfilePage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const resolvedParams = await params;
  return <UserProfileView initialHandle={resolvedParams.handle} />;
}
