import React from 'react';
import { WalletBindingDTO } from '@ventlore/api-client';
import { WalletIcon, CheckIcon, AlertCircleIcon } from './Icons';

interface WalletBindingProps {
  walletBinding?: WalletBindingDTO | null;
  className?: string;
}

export function WalletBinding({ walletBinding, className = '' }: WalletBindingProps) {
  if (!walletBinding) {
    return (
      <div className={`p-4 rounded-card border border-dashed border-sage bg-surface-card text-xs text-ink-secondary ${className}`}>
        <div className="flex items-center gap-2 mb-1 text-ink font-semibold">
          <WalletIcon className="w-4 h-4 text-ink-muted" />
          <span>Chưa liên kết ví Web3</span>
        </div>
        <p>
          Bạn vẫn có thể đọc toàn bộ nội dung công khai mà không cần kết nối ví. Ví chỉ cần thiết khi bạn muốn nhận huy hiệu Contributor SBT, Author NFT hoặc nhận tip onchain.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-card border border-sage bg-surface-card text-xs ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-ink font-semibold">
          <WalletIcon className="w-4 h-4 text-forest" />
          <span>Ví liên kết (Arbitrum Sepolia)</span>
        </div>
        {walletBinding.isVerified ? (
          <span className="inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-full bg-status-success-bg text-status-success text-[11px]">
            <CheckIcon className="w-3 h-3" />
            Đã xác minh chữ ký
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-full bg-status-pending-bg text-status-pending text-[11px]">
            <AlertCircleIcon className="w-3 h-3" />
            Chờ xác minh
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-ink font-mono bg-surface-canvas p-2 rounded-control border border-sage/60">
        <span>{walletBinding.address}</span>
        <span className="text-[10px] text-ink-muted">{walletBinding.chainNamespace}</span>
      </div>

      <p className="mt-2 text-[11px] text-ink-muted">
        Ví liên kết độc lập với tài khoản người dùng (`userId`). Thay đổi địa chỉ ví không làm thay đổi lịch sử đóng góp hoặc tài khoản cá nhân.
      </p>
    </div>
  );
}
