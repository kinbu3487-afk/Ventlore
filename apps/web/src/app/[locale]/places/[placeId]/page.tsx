import React from 'react';
import { PlaceDetailView } from '@/app/places/[placeId]/PlaceDetailView';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

export function generateStaticParams() {
  const placeIds = [
    'PLC-000001',
    'PLC-000002',
    'PLC-000003',
    'PLC-000004',
    'PLC-000005',
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e02',
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e03',
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e04',
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e08',
  ];

  const params: Array<{ locale: string; placeId: string }> = [];
  for (const loc of SUPPORTED_LOCALES) {
    for (const placeId of placeIds) {
      params.push({ locale: loc.code, placeId });
    }
  }
  return params;
}

export default async function LocalizedPlaceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; placeId: string }>;
}) {
  const resolvedParams = await params;
  return <PlaceDetailView initialPlaceId={resolvedParams.placeId} />;
}
