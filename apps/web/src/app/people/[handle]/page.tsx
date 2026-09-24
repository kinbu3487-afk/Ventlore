import React from 'react';
import { UserProfileView } from './UserProfileView';

export function generateStaticParams() {
  return [
    { handle: 'minh_trailguide' },
    { handle: 'bin_traveler' },
    { handle: 'hoang_ranger' },
    { handle: 'an_vip_explorer' },
    { handle: 'guest_reader' },
  ];
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const resolvedParams = await params;
  return <UserProfileView initialHandle={resolvedParams.handle} />;
}
