import React from 'react';
import { VerificationStatus } from '@ventlore/domain';
import {
  ShieldCheckIcon,
  ShieldAlertIcon,
  ClockIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
} from './Icons';

interface VerificationPanelProps {
  status: VerificationStatus;
  scope?: string | null;
  checkedAt?: string | null;
  validUntil?: string | null;
  inspectorNotes?: string | null;
  revisionDisplayCode?: string;
  isDetailed?: boolean;
}

export function VerificationBadge({
  status,
  size = 'md',
}: {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2',
  }[size];

  switch (status) {
    case VerificationStatus.VERIFIED:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-control border border-status-success/30 bg-status-success-bg text-status-success ${sizeClasses}`}
        >
          <ShieldCheckIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Đã kiểm định</span>
        </span>
      );
    case VerificationStatus.UNVERIFIED:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-control border border-status-neutral/30 bg-status-neutral-bg text-status-neutral ${sizeClasses}`}
        >
          <AlertCircleIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Chưa kiểm định</span>
        </span>
      );
    case VerificationStatus.IN_REVIEW:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-control border border-status-review/30 bg-status-review-bg text-status-review ${sizeClasses}`}
        >
          <ClockIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Đang kiểm định</span>
        </span>
      );
    case VerificationStatus.NEEDS_CHANGES:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-control border border-status-pending/30 bg-status-pending-bg text-status-pending ${sizeClasses}`}
        >
          <AlertTriangleIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Yêu cầu chỉnh sửa</span>
        </span>
      );
    case VerificationStatus.INCONCLUSIVE:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-control border border-status-pending/30 bg-status-pending-bg text-status-pending ${sizeClasses}`}
        >
          <AlertCircleIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Chưa đủ kết luận</span>
        </span>
      );
    case VerificationStatus.EXPIRED:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-control border border-status-danger/30 bg-status-danger-bg text-status-danger ${sizeClasses}`}
        >
          <AlertTriangleIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Kiểm định hết hạn</span>
        </span>
      );
    case VerificationStatus.REJECTED:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-control border border-status-danger/30 bg-status-danger-bg text-status-danger ${sizeClasses}`}
        >
          <ShieldAlertIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Từ chối duyệt</span>
        </span>
      );
    case VerificationStatus.SUSPENDED:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-control border border-status-danger/30 bg-status-danger-bg text-status-danger ${sizeClasses}`}
        >
          <AlertTriangleIcon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Tạm đình chỉ</span>
        </span>
      );
    default:
      return null;
  }
}

export function VerificationPanel({
  status,
  scope,
  checkedAt,
  validUntil,
  inspectorNotes,
  revisionDisplayCode,
  isDetailed = true,
}: VerificationPanelProps) {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const formattedCheckedAt = formatDate(checkedAt);
  const formattedValidUntil = formatDate(validUntil);

  return (
    <div className="rounded-card border border-sage bg-surface-card p-4 sm:p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sage/60 pb-3">
        <div className="flex items-center gap-2.5">
          <VerificationBadge status={status} size="md" />
          {revisionDisplayCode && (
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sage/60 text-ink-secondary">
              {revisionDisplayCode}
            </span>
          )}
        </div>
        {status === VerificationStatus.VERIFIED && validUntil && (
          <span className="text-xs text-ink-secondary flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5 text-status-success" />
            Có hiệu lực đến: <strong className="text-ink">{formattedValidUntil}</strong>
          </span>
        )}
      </div>

      {isDetailed && (
        <div className="mt-3.5 space-y-2.5 text-sm">
          {scope && (
            <div className="text-ink">
              <span className="font-semibold text-ink-secondary">Phạm vi kiểm tra: </span>
              <span>{scope}</span>
            </div>
          )}

          {status === VerificationStatus.UNVERIFIED && (
            <p className="text-ink-secondary italic bg-status-neutral-bg/60 p-2.5 rounded-control text-xs">
              Lưu ý: Nội dung phiên bản này do thành viên cộng đồng cung cấp, chưa qua quy trình thẩm định độc lập bởi chuyên gia thực địa của Ventlore.
            </p>
          )}

          {status === VerificationStatus.EXPIRED && (
            <div className="bg-status-danger-bg text-status-danger p-3 rounded-control text-xs">
              <strong>Cảnh báo:</strong> Kết quả kiểm định cho phiên bản này đã hết hạn vào ngày{' '}
              {formattedValidUntil}. Địa hình và điều kiện an toàn thực tế có thể đã biến đổi sau các mùa mưa bão gần nhất.
            </div>
          )}

          {inspectorNotes && (
            <div className="text-xs bg-surface-canvas p-3 rounded-control border border-sage">
              <div className="font-semibold text-ink-secondary mb-1">Ghi chú của chuyên gia thẩm định:</div>
              <p className="text-ink">{inspectorNotes}</p>
              {formattedCheckedAt && (
                <div className="mt-1 text-[11px] text-ink-muted">
                  Thời điểm kiểm tra: {formattedCheckedAt}
                </div>
              )}
            </div>
          )}

          <div className="pt-2 text-[11px] text-ink-muted border-t border-sage/40 flex items-center justify-between">
            <span>Kiểm định độc lập gắn chặt với phiên bản nội dung</span>
            <span>Không cam kết an toàn tuyệt đối</span>
          </div>
        </div>
      )}
    </div>
  );
}
