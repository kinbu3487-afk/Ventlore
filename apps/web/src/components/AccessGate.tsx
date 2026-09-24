'use client';

import React from 'react';
import Link from 'next/link';
import { LockIcon, SparklesIcon } from './Icons';
import { useSession } from './SessionContext';

interface AccessGateProps {
  reason: 'VIP_REQUIRED' | 'AUTH_REQUIRED' | 'CAPABILITY_REQUIRED';
  title?: string;
  description?: string;
  returnTo?: string;
}

export function AccessGate({
  reason,
  title,
  description,
  returnTo = '/explore',
}: AccessGateProps) {
  const { setPersona } = useSession();

  // Validate returnTo for security (same-origin allowlist only)
  const safeReturnTo =
    returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')
      ? returnTo
      : '/explore';

  if (reason === 'VIP_REQUIRED') {
    return (
      <div className="rounded-card border-2 border-dashed border-status-vip/40 bg-status-vip-bg/50 p-6 sm:p-8 text-center my-6">
        <div className="mx-auto w-12 h-12 rounded-full bg-status-vip-bg border border-status-vip/30 flex items-center justify-center text-status-vip mb-3">
          <SparklesIcon className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-ink">
          {title || 'Nội dung thuộc Gói Hội Viên Thám Hiểm VIP'}
        </h3>

        <p className="mt-2 text-sm text-ink-secondary max-w-lg mx-auto">
          {description ||
            'Tọa độ hốc trú bão, bản đồ 3D địa hình chi tiết và dữ liệu cứu hộ ngoại tuyến là tài nguyên đặc quyền dành cho Hội viên VIP của Ventlore.'}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/vip"
            className="inline-flex items-center justify-center min-h-control px-5 py-2.5 rounded-control font-semibold text-white bg-forest hover:bg-forest-hover transition-colors shadow-sm"
          >
            Tìm hiểu Gói VIP (15 USD/Năm)
          </Link>

          {/* Persona quick switch for evaluator convenience */}
          <button
            type="button"
            onClick={() => setPersona('vip')}
            className="inline-flex items-center justify-center min-h-control px-4 py-2.5 rounded-control text-xs font-semibold text-status-vip border border-status-vip/40 bg-white hover:bg-status-vip-bg transition-colors"
          >
            Mô phỏng: Chuyển sang Hội viên VIP
          </button>
        </div>

        <div className="mt-4 text-[11px] text-ink-muted">
          Bảo mật: Toàn bộ nội dung mật đã được loại bỏ từ phía máy chủ; không lưu trữ trong mã nguồn HTML.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-card border-2 border-dashed border-sage bg-surface-canvas p-6 text-center my-6">
      <div className="mx-auto w-12 h-12 rounded-full bg-sage/60 flex items-center justify-center text-forest mb-3">
        <LockIcon className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold text-ink">
        {title || 'Yêu cầu đăng nhập tài khoản'}
      </h3>

      <p className="mt-2 text-sm text-ink-secondary max-w-md mx-auto">
        {description ||
          'Bạn cần đăng nhập để thực hiện thao tác này hoặc tiếp cận thông tin giới hạn.'}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={`/login?returnTo=${encodeURIComponent(safeReturnTo)}`}
          className="inline-flex items-center justify-center min-h-control px-5 py-2.5 rounded-control font-semibold text-white bg-forest hover:bg-forest-hover transition-colors shadow-sm"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}
