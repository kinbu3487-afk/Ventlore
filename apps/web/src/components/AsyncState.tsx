import React from 'react';
import { AlertCircleIcon, AlertTriangleIcon, ClockIcon } from './Icons';

export type AsyncErrorCode =
  | 401
  | 403
  | 404
  | 409
  | 422
  | 429
  | 'timeout'
  | 'offline'
  | 'unknown';

import { useI18n } from '../lib/i18n';

interface AsyncStateProps {
  isLoading?: boolean;
  isEmpty?: boolean;
  errorCode?: AsyncErrorCode | null;
  loadingLabel?: string;
  emptyMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
  children?: React.ReactNode;
}

export function LoadingSpinner({
  label,
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  const { t } = useI18n();
  const displayLabel = label || t('common.loading');

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-ink-secondary ${className}`}>
      <div className="w-8 h-8 border-3 border-sage border-t-forest rounded-full animate-spin mb-3" />
      <span className="text-sm">{displayLabel}</span>
    </div>
  );
}

export function AmountLoadingPlaceholder() {
  const { t } = useI18n();
  return (
    <span className="inline-block animate-pulse bg-sage/80 rounded px-2 py-0.5 text-xs text-ink-muted">
      {t('common.loading')}
    </span>
  );
}

export function AsyncState({
  isLoading,
  isEmpty,
  errorCode,
  loadingLabel,
  emptyMessage,
  errorMessage,
  onRetry,
  children,
}: AsyncStateProps) {
  const { t } = useI18n();
  const finalEmptyMessage = emptyMessage || t('common.empty');

  if (isLoading) {
    return <LoadingSpinner label={loadingLabel || t('common.loading')} />;
  }

  if (errorCode) {
    const errorDetails: Record<
      AsyncErrorCode,
      { title: string; defaultMsg: string; icon: React.ReactNode }
    > = {
      401: {
        title: 'Yêu cầu đăng nhập (401)',
        defaultMsg: 'Phiên làm việc đã hết hạn hoặc bạn chưa đăng nhập tài khoản.',
        icon: <AlertCircleIcon className="w-8 h-8 text-status-review" />,
      },
      403: {
        title: 'Không có quyền truy cập (403)',
        defaultMsg: 'Tài khoản của bạn chưa có đủ quyền hoặc thiếu gói VIP để truy cập tài nguyên này.',
        icon: <AlertCircleIcon className="w-8 h-8 text-status-pending" />,
      },
      404: {
        title: 'Không tìm thấy nội dung (404)',
        defaultMsg: 'Địa điểm hoặc bài viết bạn yêu cầu không tồn tại hoặc đã bị gỡ bỏ.',
        icon: <AlertCircleIcon className="w-8 h-8 text-ink-muted" />,
      },
      409: {
        title: 'Xung đột dữ liệu (409)',
        defaultMsg: 'Dữ liệu đã bị thay đổi bởi thao tác khác. Vui lòng làm mới trang để cập nhật phiên bản mới nhất.',
        icon: <AlertTriangleIcon className="w-8 h-8 text-status-pending" />,
      },
      422: {
        title: 'Dữ liệu không hợp lệ (422)',
        defaultMsg: 'Thông tin gửi lên không đúng định dạng quy định của hợp đồng dữ liệu.',
        icon: <AlertCircleIcon className="w-8 h-8 text-status-danger" />,
      },
      429: {
        title: 'Quá nhiều yêu cầu (429)',
        defaultMsg: 'Hệ thống đang tiếp nhận lưu lượng lớn. Vui lòng chờ một lát rồi thử lại.',
        icon: <ClockIcon className="w-8 h-8 text-status-pending" />,
      },
      timeout: {
        title: 'Hết thời gian phản hồi (Timeout)',
        defaultMsg: 'Máy chủ phản hồi quá chậm. Vui lòng kiểm tra lại kết nối mạng.',
        icon: <ClockIcon className="w-8 h-8 text-status-danger" />,
      },
      offline: {
        title: 'Mất kết nối Internet (Offline)',
        defaultMsg: 'Thiết bị của bạn đang ngoại tuyến. Vui lòng kiểm tra lại mạng wifi hoặc dữ liệu di động.',
        icon: <AlertTriangleIcon className="w-8 h-8 text-status-danger" />,
      },
      unknown: {
        title: 'Đã xảy ra sự cố kỹ thuật',
        defaultMsg: 'Có lỗi không xác định xảy ra. Vui lòng thử lại sau.',
        icon: <AlertCircleIcon className="w-8 h-8 text-status-danger" />,
      },
    };

    const err = errorDetails[errorCode] || errorDetails.unknown;

    return (
      <div className="rounded-card border border-sage bg-surface-card p-6 sm:p-8 text-center max-w-md mx-auto my-6">
        <div className="mx-auto w-14 h-14 rounded-full bg-surface-canvas flex items-center justify-center mb-3">
          {err.icon}
        </div>
        <h3 className="text-base font-bold text-ink">{err.title}</h3>
        <p className="mt-2 text-xs text-ink-secondary">{errorMessage || err.defaultMsg}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 min-h-control px-4 py-2 rounded-control text-xs font-semibold text-white bg-forest hover:bg-forest-hover transition-colors"
          >
            Thử lại thao tác
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="rounded-card border border-dashed border-sage bg-surface-card/60 p-8 text-center my-6">
        <AlertCircleIcon className="w-10 h-10 text-ink-muted mx-auto mb-2" />
        <p className="text-sm text-ink-secondary">{emptyMessage}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 text-xs font-semibold text-forest underline hover:text-forest-hover"
          >
            Làm mới danh sách
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
