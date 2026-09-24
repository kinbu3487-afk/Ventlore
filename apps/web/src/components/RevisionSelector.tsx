'use client';

import React from 'react';
import Link from 'next/link';
import { RevisionItemSummaryDTO } from '@ventlore/api-client';
import { VerificationBadge } from './VerificationPanel';
import { LayersIcon, ClockIcon } from './Icons';

interface RevisionSelectorProps {
  postId: string;
  currentRevisionId: string;
  revisions: RevisionItemSummaryDTO[];
}

export function RevisionSelector({
  postId,
  currentRevisionId,
  revisions,
}: RevisionSelectorProps) {
  return (
    <div className="rounded-card border border-sage bg-surface-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-sage/60 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <LayersIcon className="w-5 h-5 text-forest" />
          <h3 className="font-semibold text-ink text-sm sm:text-base">
            Lịch sử phiên bản bài viết ({revisions.length})
          </h3>
        </div>
        <span className="text-xs text-ink-muted">Bất biến (Immutable)</span>
      </div>

      <div className="space-y-2">
        {revisions.map((rev) => {
          const isSelected = rev.revisionId === currentRevisionId;
          const formattedDate = new Date(rev.createdAt).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });

          return (
            <Link
              key={rev.revisionId}
              href={`/posts/${postId}?revisionId=${rev.revisionId}`}
              className={`block p-3 rounded-control border transition-all text-left ${
                isSelected
                  ? 'border-forest bg-forest/5 ring-1 ring-forest shadow-xs'
                  : 'border-sage/80 bg-surface-card hover:bg-surface-canvas hover:border-sage'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink text-sm">
                    Phiên bản {rev.versionNumber}
                  </span>
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-sage/60 text-ink-secondary">
                    {rev.displayCode}
                  </span>
                  {isSelected && (
                    <span className="text-[11px] font-medium text-forest bg-sage/80 px-2 py-0.5 rounded-full">
                      Đang xem
                    </span>
                  )}
                </div>
                <VerificationBadge status={rev.verificationStatus} size="sm" />
              </div>

              <div className="mt-1.5 text-xs text-ink-secondary line-clamp-1">
                {rev.title}
              </div>

              <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-muted">
                <ClockIcon className="w-3 h-3" />
                <span>Nộp ngày: {formattedDate}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] text-ink-muted border-t border-sage/40 pt-2">
        Mỗi phiên bản là một snapshot cố định. Khi tác giả nộp bản sửa mới, trạng thái kiểm định và route nhận tip không tự động kế thừa từ bản cũ.
      </p>
    </div>
  );
}
