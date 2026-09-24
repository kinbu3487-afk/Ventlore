'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { SearchFilters } from '@/components/SearchFilters';
import { PlaceResults } from '@/components/PlaceResults';
import { AsyncState } from '@/components/AsyncState';
import { mockApiClient, PlaceSummaryDTO } from '@ventlore/api-client';
import { useSession } from '@/components/SessionContext';

export default function ExplorePage() {
  const { persona } = useSession();
  const [query, setQuery] = useState('');
  const [regionId, setRegionId] = useState('all');
  const [activity, setActivity] = useState('all');
  const [places, setPlaces] = useState<PlaceSummaryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchPlaces() {
      setIsLoading(true);
      try {
        const res = await mockApiClient.listPlaces({
          query,
          regionId,
          activity,
        });
        if (active) {
          setPlaces(res.items);
          setIsLoading(false);
        }
      } catch {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    fetchPlaces();
    return () => {
      active = false;
    };
  }, [query, regionId, activity, persona]);

  const handleClearFilters = () => {
    setQuery('');
    setRegionId('all');
    setActivity('all');
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Hero / Introduction */}
        <div className="border-b border-sage/60 pb-6">
          <div className="flex flex-wrap items-baseline gap-2 mb-1">
            <span className="text-xs font-bold text-forest uppercase tracking-wider">
              Khám Phá Thực Địa (S01)
            </span>
            <span className="text-xs text-ink-muted">• Kiểm chứng độc lập</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Hiểu nơi đến. Vững bước đi.
          </h1>
          <p className="mt-2 text-sm sm:text-base text-ink-secondary max-w-2xl">
            Tra cứu thông tin địa hình, cảnh báo an toàn và biên bản thẩm định thực địa độc lập trước mỗi chuyến phiêu lưu mạo hiểm.
          </p>
        </div>

        {/* Search & Filter Bar (C02) */}
        <SearchFilters
          query={query}
          regionId={regionId}
          activity={activity}
          onQueryChange={setQuery}
          onRegionChange={setRegionId}
          onActivityChange={setActivity}
          onClearFilters={handleClearFilters}
        />

        {/* Results / List (C03) & Async State (C46) */}
        <AsyncState
          isLoading={isLoading}
          isEmpty={places.length === 0}
          emptyMessage="Không tìm thấy địa điểm nào phù hợp với bộ lọc hiện tại. Thử xóa bộ lọc hoặc đổi từ khóa tìm kiếm."
          onRetry={handleClearFilters}
        >
          <PlaceResults places={places} />
        </AsyncState>
      </div>
    </AppShell>
  );
}
