'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from './SessionContext';
import { DemoPersona } from '@ventlore/api-client';
import { CheckIcon } from './Icons';

interface SocialLoginProps {
  returnTo?: string;
}

export function SocialLogin({ returnTo = '/explore' }: SocialLoginProps) {
  const router = useRouter();
  const { setPersona, persona } = useSession();
  const [selectedPersona, setSelectedPersona] = useState<DemoPersona>('member');
  const [isProcessing, setIsProcessing] = useState(false);

  // Validate returnTo to prevent open redirects
  const safeReturnTo =
    returnTo && returnTo.startsWith('/') && !returnTo.startsWith('//')
      ? returnTo
      : '/explore';

  const handleLogin = (personaChoice: DemoPersona) => {
    setIsProcessing(true);
    setPersona(personaChoice);
    setTimeout(() => {
      setIsProcessing(false);
      router.push(safeReturnTo);
    }, 400);
  };

  const personaOptions: Array<{
    id: DemoPersona;
    name: string;
    description: string;
    roleTag: string;
  }> = [
    {
      id: 'member',
      name: 'Bin Khám Phá',
      description: 'Thành viên thường, quyền gửi bài và đóng góp ý kiến',
      roleTag: 'MEMBER',
    },
    {
      id: 'vip',
      name: 'An Thám Hiểm VIP',
      description: 'Hội viên VIP có quyền xem toàn bộ tọa độ khẩn cấp',
      roleTag: 'VIP_MEMBER',
    },
    {
      id: 'author',
      name: 'Minh Hướng Dẫn Viên',
      description: 'Tác giả bài viết Cát Cò 3, có ví liên kết nhận tip onchain',
      roleTag: 'AUTHOR',
    },
    {
      id: 'expert',
      name: 'Hoàng Kiểm Lâm Viên',
      description: 'Chuyên gia độc lập thẩm định thực địa vùng Đông Bắc',
      roleTag: 'EXPERT',
    },
  ];

  return (
    <div className="rounded-card border border-sage bg-surface-card p-6 sm:p-8 max-w-md w-full mx-auto shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-ink">Đăng nhập vào Ventlore</h2>
        <p className="mt-1 text-xs text-ink-secondary">
          Hệ thống xác thực một tài khoản duy nhất cho mọi vai trò
        </p>
      </div>

      <div className="space-y-4">
        {/* Google Social OAuth Button */}
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => handleLogin('member')}
          className="w-full min-h-control flex items-center justify-center gap-3 px-4 py-3 rounded-control border border-sage font-medium text-ink bg-white hover:bg-surface-canvas transition-colors shadow-xs"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
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
          <span>{isProcessing ? 'Đang xác thực...' : 'Tiếp tục với Google'}</span>
        </button>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-sage/60" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-surface-card px-3 text-ink-muted">
              HOẶC CHỌN TÀI KHOẢN MÔ PHỎNG (DEMO)
            </span>
          </div>
        </div>

        {/* Demo persona switcher */}
        <div className="space-y-2">
          {personaOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedPersona(opt.id)}
              className={`w-full p-3 rounded-control border text-left flex items-start justify-between transition-colors ${
                selectedPersona === opt.id
                  ? 'border-forest bg-forest/5 ring-1 ring-forest'
                  : 'border-sage hover:bg-surface-canvas'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink text-sm">{opt.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sage/60 text-ink-secondary">
                    {opt.roleTag}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-secondary">{opt.description}</p>
              </div>
              {selectedPersona === opt.id && (
                <CheckIcon className="w-4 h-4 text-forest shrink-0 mt-0.5" />
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={isProcessing}
          onClick={() => handleLogin(selectedPersona)}
          className="w-full min-h-control mt-3 px-5 py-3 rounded-control font-semibold text-white bg-forest hover:bg-forest-hover transition-colors shadow-sm"
        >
          {isProcessing ? 'Đang chuyển hướng...' : `Đăng nhập với vai trò đã chọn`}
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-sage/40 text-[11px] text-ink-muted text-center space-y-1">
        <p>Return URL: <code className="font-mono text-ink">{safeReturnTo}</code></p>
        <p>Không chuyển hướng sang tên miền bên ngoài (Chống Open Redirect).</p>
      </div>
    </div>
  );
}
