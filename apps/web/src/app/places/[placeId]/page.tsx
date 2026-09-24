import React from 'react';
import { PlaceDetailView } from './PlaceDetailView';

export function generateStaticParams() {
  return [
    { placeId: 'PLC-000001' },
    { placeId: 'PLC-000002' },
    { placeId: 'PLC-000003' },
    { placeId: 'PLC-000004' },
    { placeId: 'PLC-000005' },
    { placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e02' },
    { placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e03' },
    { placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e04' },
    { placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e08' },
    { placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e09' },
  ];
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ placeId: string }>;
}) {
  const resolvedParams = await params;
  return <PlaceDetailView initialPlaceId={resolvedParams.placeId} />;
}
