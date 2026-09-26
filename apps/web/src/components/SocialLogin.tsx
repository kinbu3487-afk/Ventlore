'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '../lib/i18n';
import { ArrowRightIcon } from './Icons';

interface SocialLoginProps {
  returnTo?: string;
}

export function SocialLogin({ returnTo: initialReturnTo }: SocialLoginProps) {
  const router = useRouter();
  const { t, getLocalizedPath } = useI18n();
  const [targetReturnTo, setTargetReturnTo] = useState<string>(initialReturnTo || '/explore');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!initialReturnTo && typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search).get('returnTo');
      if (q && q.startsWith('/') && !q.startsWith('//')) {
        setTargetReturnTo(q);
      }
    }
  }, [initialReturnTo]);

  // Validate returnTo to prevent open redirects (same-origin allowlist)
  const safeReturnTo =
    targetReturnTo && targetReturnTo.startsWith('/') && !targetReturnTo.startsWith('//')
      ? targetReturnTo
      : '/explore';

  const handleOAuthClick = (provider: string) => {
    setNotice(
      `Cổng đăng nhập qua ${provider} đang trong quá trình tích hợp hệ thống xác thực. Bạn có thể tiếp tục xem nội dung công khai với tư cách Khách.`
    );
  };

  return (
    <div className="rounded-card border border-sage bg-surface-card p-6 sm:p-8 max-w-md w-full mx-auto shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-ink">{t('auth.title')}</h2>
        <p className="mt-1.5 text-xs sm:text-sm text-ink-secondary leading-relaxed">
          {t('auth.subtitle')}
        </p>
      </div>

      <div className="space-y-3.5">
        {/* Google Social OAuth Button */}
        <button
          type="button"
          onClick={() => handleOAuthClick('Google')}
          className="w-full min-h-control flex items-center justify-center gap-3 px-4 py-3 rounded-control border border-sage font-medium text-ink bg-white hover:bg-surface-canvas active:scale-[0.99] transition-all shadow-xs text-sm"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{t('auth.continueGoogle')}</span>
        </button>

        {/* Apple Sign-in Button */}
        <button
          type="button"
          onClick={() => handleOAuthClick('Apple')}
          className="w-full min-h-control flex items-center justify-center gap-3 px-4 py-3 rounded-control border border-sage font-medium text-ink bg-white hover:bg-surface-canvas active:scale-[0.99] transition-all shadow-xs text-sm"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.58.67-1.09 1.74-.95 2.77.99.08 2.03-.52 2.68-1.27z" />
          </svg>
          <span>Tiếp tục với Apple</span>
        </button>

        {/* Notice if clicked */}
        {notice && (
          <div className="p-3 rounded-control bg-status-pending-bg text-status-pending text-xs border border-status-pending/30 animate-fadeIn">
            {notice}
          </div>
        )}

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-sage/60" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface-card px-3 text-ink-muted">
              Xem nội dung công khai
            </span>
          </div>
        </div>

        {/* Continue exploring as Guest */}
        <Link
          href={getLocalizedPath(safeReturnTo)}
          className="w-full min-h-control flex items-center justify-center gap-2 px-5 py-3 rounded-control font-semibold text-white bg-forest hover:bg-forest-hover transition-colors shadow-sm text-sm"
        >
          <span>Tiếp tục khám phá</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>

      <div className="mt-6 pt-4 border-t border-sage/40 text-center text-xs text-ink-muted">
        Ventlore tôn trọng quyền riêng tư. Bạn có thể tự do đọc toàn bộ thông tin điểm đến mà không bắt buộc tạo tài khoản.
      </div>
    </div>
  );
}
