import React from 'react';
import { PlaceDetailView } from './PlaceDetailView';
import { destinationsData } from '@ventlore/api-client';

export function generateStaticParams() {
  const existingCodes = [
    'PLC-000001',
    'PLC-000002',
    'PLC-000003',
    'PLC-000004',
    'PLC-000005',
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e03',
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e04',
  ];
  const placeIds = Array.from(
    new Set([
      ...existingCodes,
      ...destinationsData.places.map((p: any) => p.placeId),
    ])
  );
  return placeIds.map((placeId) => ({ placeId }));
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ placeId: string }>;
}) {
  const resolvedParams = await params;
  return <PlaceDetailView initialPlaceId={resolvedParams.placeId} />;
}
