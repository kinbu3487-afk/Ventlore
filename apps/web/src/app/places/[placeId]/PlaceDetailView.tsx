'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { PlaceSummary } from '@/components/PlaceSummary';
import { AsyncState } from '@/components/AsyncState';
import { mockApiClient, PlaceDetailDTO } from '@ventlore/api-client';
import { useSession } from '@/components/SessionContext';
import { useI18n } from '@/lib/i18n';
import { ArrowLeftIcon } from '@/components/Icons';

interface PlaceDetailViewProps {
  initialPlaceId?: string;
}

export function PlaceDetailView({ initialPlaceId }: PlaceDetailViewProps) {
  const params = useParams();
  const placeId = initialPlaceId || (params?.placeId as string);
  const { persona } = useSession();
  const { t, locale, getLocalizedPath } = useI18n();

  const [place, setPlace] = useState<PlaceDetailDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadPlace() {
      if (!placeId) return;
      setIsLoading(true);
      setNotFound(false);
      try {
        const data = await mockApiClient.getPlace(placeId, locale);
        if (mounted) {
          if (!data) {
            setNotFound(true);
          } else {
            setPlace(data);
          }
          setIsLoading(false);
        }
      } catch {
        if (mounted) {
          setNotFound(true);
          setIsLoading(false);
        }
      }
    }
    loadPlace();
    return () => {
      mounted = false;
    };
  }, [placeId, persona, locale]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href={getLocalizedPath('/explore')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-hover hover:underline transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>{t('nav.backToExplore')}</span>
          </Link>
        </div>

        {/* Async State Handler */}
        <AsyncState
          isLoading={isLoading}
          errorCode={notFound ? 404 : null}
          errorMessage={t('errors.notFoundMessage')}
        >
          {place && <PlaceSummary place={place} />}
        </AsyncState>
      </div>
    </AppShell>
  );
}
