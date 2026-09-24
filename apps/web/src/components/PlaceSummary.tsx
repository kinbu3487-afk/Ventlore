import React from 'react';
import Link from 'next/link';
import { PlaceDetailDTO } from '@ventlore/api-client';
import { PlaceStatus } from '@ventlore/domain';
import { VerificationBadge } from './VerificationPanel';
import {
  MapPinIcon,
  AlertTriangleIcon,
  ChevronRightIcon,
  CompassIcon,
  ClockIcon,
  ArrowRightIcon,
} from './Icons';

interface PlaceSummaryProps {
  place: PlaceDetailDTO;
}

export function PlaceSummary({ place }: PlaceSummaryProps) {
  const isMerged = place.status === PlaceStatus.MERGED;

  return (
    <div className="space-y-6">
      {/* 1. Merged Banner (if place has been merged into canonical place) */}
      {isMerged && place.canonicalPlace && (
        <div className="rounded-card border-2 border-status-pending bg-status-pending-bg p-5 text-ink">
          <div className="flex items-start gap-3">
            <AlertTriangleIcon className="w-5 h-5 text-status-pending shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm sm:text-base text-status-pending">
                Hồ sơ địa điểm này đã được sáp nhập (MERGED)
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-ink-secondary">
                Hội đồng chuyên môn đã sáp nhập địa danh này vào hồ sơ chính thức nhằm tránh phân mảnh dữ liệu kiểm định.
              </p>
              <div className="mt-3">
                <Link
                  href={`/places/${place.canonicalPlace.placeId}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-control font-semibold text-xs text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs"
                >
                  <span>Chuyển sang địa điểm chuẩn: {place.canonicalPlace.name}</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Place Main Header */}
      <div className="rounded-card border border-sage bg-surface-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sage/60 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-sage/80 text-ink">
                {place.displayCode}
              </span>
              <span className="text-xs text-ink-muted flex items-center gap-1">
                <MapPinIcon className="w-3.5 h-3.5 text-forest" />
                {place.regionName}
              </span>
              {place.coordinates && (
                <span className="text-xs font-mono text-ink-muted bg-surface-canvas px-2 py-0.5 rounded">
                  {place.coordinates.lat}°N, {place.coordinates.lng}°E
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink">{place.name}</h1>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                place.status === PlaceStatus.ACTIVE
                  ? 'bg-status-success-bg text-status-success border border-status-success/30'
                  : place.status === PlaceStatus.MERGED
                  ? 'bg-status-pending-bg text-status-pending border border-status-pending/30'
                  : 'bg-status-review-bg text-status-review border border-status-review/30'
              }`}
            >
              Trạng thái: {place.status}
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-ink-secondary leading-relaxed mb-6">
          {place.description}
        </p>

        {/* 3. Warnings Section (Crucial Domain Requirement) */}
        {place.warnings.length > 0 && (
          <div className="rounded-control border-l-4 border-status-danger bg-status-danger-bg/50 p-4 sm:p-5 mb-6">
            <div className="flex items-center gap-2 font-bold text-status-danger text-sm mb-2">
              <AlertTriangleIcon className="w-5 h-5 shrink-0" />
              <span>Cảnh báo an toàn và rủi ro quan sát được</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-ink list-disc list-inside">
              {place.warnings.map((warn, idx) => (
                <li key={idx} className="leading-snug">
                  {warn}
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-2 border-t border-status-danger/20 text-[11px] text-ink-muted">
              Ventlore không cam kết địa điểm &quot;an toàn tuyệt đối&quot;. Mọi cá nhân cần chuẩn bị đầy đủ trang bị phòng hộ cá nhân và tự lượng sức.
            </div>
          </div>
        )}

        {/* Activities and meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-sage/60 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink-secondary">Hoạt động phù hợp:</span>
            {place.activities.map((a) => (
              <span
                key={a}
                className="px-2.5 py-1 rounded-full bg-surface-canvas text-ink font-medium"
              >
                {a}
              </span>
            ))}
          </div>

          <div className="text-ink-muted">
            {place.postsCount} bài viết & báo cáo thẩm định
          </div>
        </div>
      </div>

      {/* 4. Posts relating to this place */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-ink flex items-center justify-between">
          <span>Bài viết & Báo cáo thực địa ({place.posts.length})</span>
          <span className="text-xs font-normal text-ink-muted">
            Kiểm định gắn chặt theo từng phiên bản bài viết
          </span>
        </h2>

        {place.posts.length === 0 ? (
          <div className="p-8 rounded-card border border-dashed border-sage bg-surface-card text-center text-sm text-ink-secondary">
            Chưa có bài viết nào được xuất bản cho địa điểm này.
          </div>
        ) : (
          <div className="space-y-3">
            {place.posts.map((post) => {
              const formattedDate = new Date(
                post.currentRevision.observedAt
              ).toLocaleDateString('vi-VN');

              return (
                <Link
                  key={post.postId}
                  href={`/posts/${post.postId}`}
                  className="block p-4 sm:p-5 rounded-card border border-sage bg-surface-card hover:border-forest hover:shadow-sm transition-all text-left"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-sage/60 text-ink-secondary">
                        {post.displayCode}
                      </span>
                      <h3 className="font-bold text-base text-ink hover:text-forest transition-colors">
                        {post.currentRevision.title}
                      </h3>
                    </div>
                    <VerificationBadge
                      status={post.currentRevision.verificationStatus}
                      size="sm"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted pt-2 border-t border-sage/40">
                    <div className="flex items-center gap-2">
                      <span>Tác giả: <strong>{post.author.displayName}</strong></span>
                      <span>•</span>
                      <span>Quan sát ngày: {formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-1 text-forest font-semibold">
                      <span>Đọc bài & kiểm chứng</span>
                      <ChevronRightIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
