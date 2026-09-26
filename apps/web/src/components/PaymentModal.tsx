'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePayment } from './PaymentContext';
import { useSession } from './SessionContext';
import { useI18n } from '../lib/i18n';
import { mockApiClient, PaymentMode, PaymentIntentDTO } from '@ventlore/api-client';
import {
  CloseIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CompassIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  UserIcon,
  AlertTriangleIcon,
} from './Icons';

type SimChainId = '42161' | '421614' | '1'; // 42161 Arbitrum, 421614 Arb Sepolia, 1 Mainnet (wrong network)
type PaymentState = 'IDLE' | 'REVIEW' | 'SUBMITTED' | 'OBSERVED' | 'FINALIZED' | 'ERROR';

export function PaymentModal() {
  const { isOpen, mode, initialData, closePayment } = usePayment();
  const { persona, session } = useSession();
  const { t, getLocalizedPath } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);

  // Form State
  const [activeMode, setActiveMode] = useState<PaymentMode>(mode);
  const [amount, setAmount] = useState<string>('20');
  const [selectedAsset, setSelectedAsset] = useState<'USDC' | 'ETH'>('USDC');
  const [simChain, setSimChain] = useState<SimChainId>('42161');
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(true);
  const [walletAddress, setWalletAddress] = useState<string>('0x71C85A3289aB69b0B29a');
  const [paymentState, setPaymentState] = useState<PaymentState>('IDLE');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<PaymentIntentDTO | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Synchronize mode and context data strictly from the opener (P1-04)
  useEffect(() => {
    if (isOpen) {
      setActiveMode(mode);
      setPaymentState('IDLE');
      setErrorMsg(null);
      setReceipt(null);
      if (mode === 'MEMBERSHIP') {
        setAmount('15');
      } else if (initialData?.defaultAmount) {
        setAmount(initialData.defaultAmount);
      } else {
        setAmount('20');
      }
    }
  }, [isOpen, mode, initialData]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        closePayment();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, closePayment]);

  if (!isOpen) return null;

  // Atomic Units Calculation
  const parsedAmount = parseFloat(amount) || 0;
  const amountAtomicUnits = BigInt(Math.floor(parsedAmount * 1_000_000)); // USDC 6 decimals

  let authorShareAtomic = 0n;
  let treasuryShareAtomic = 0n;
  let authorShareFormatted = '0';
  let treasuryShareFormatted = '0';

  if (activeMode === 'POST_TIP') {
    treasuryShareAtomic = amountAtomicUnits / 5n; // floor(amount / 5) = 20%
    authorShareAtomic = amountAtomicUnits - treasuryShareAtomic; // 80%
    authorShareFormatted = (Number(authorShareAtomic) / 1_000_000).toFixed(2);
    treasuryShareFormatted = (Number(treasuryShareAtomic) / 1_000_000).toFixed(2);
  } else if (activeMode === 'PROJECT') {
    treasuryShareAtomic = amountAtomicUnits;
    treasuryShareFormatted = parsedAmount.toFixed(2);
  } else if (activeMode === 'MEMBERSHIP') {
    treasuryShareAtomic = 15_000_000n; // 15 USDC
    treasuryShareFormatted = '15.00';
  }

  // Network check
  const isWrongNetwork = simChain === '1';

  // Execute Simulated Payment
  const handleSimulatePayment = async () => {
    if (isSubmitting) return;

    // Invariant: Guest can NEVER purchase VIP (P0-02)
    if (activeMode === 'MEMBERSHIP' && (persona === 'guest' || !session || session.handle === 'guest_reader')) {
      setErrorMsg('Khách đọc công khai chưa đăng nhập không thể mua gói VIP. Vui lòng đăng nhập tài khoản.');
      return;
    }

    if (isWrongNetwork) {
      setErrorMsg('Mạng blockchain không hỗ trợ. Vui lòng chuyển sang Arbitrum One.');
      return;
    }
    if (!isWalletConnected) {
      setErrorMsg('Vui lòng kết nối ví trước khi thực hiện thanh toán.');
      return;
    }
    if (activeMode === 'POST_TIP' && initialData && initialData.isEligibleForTip === false) {
      setErrorMsg(initialData.ineligibleReason || 'Bài viết chưa đủ điều kiện nhận tip theo quy chế.');
      return;
    }

    setIsSubmitting(true);
    setPaymentState('REVIEW');
    setErrorMsg(null);

    try {
      // 1. Submitted state
      await new Promise((r) => setTimeout(r, 500));
      setPaymentState('SUBMITTED');

      // 2. Observed state
      await new Promise((r) => setTimeout(r, 600));
      setPaymentState('OBSERVED');

      // 3. Finalized demo state
      await new Promise((r) => setTimeout(r, 600));

      const recorded = await mockApiClient.recordPayment({
        id: '',
        mode: activeMode,
        targetTitle:
          activeMode === 'POST_TIP'
            ? initialData?.targetTitle || 'Ủng hộ tác giả bài viết'
            : activeMode === 'MEMBERSHIP'
            ? 'Gói Hội Viên Khám Phá Thường Niên (12 Tháng)'
            : 'Quỹ Bảo Tồn & Thẩm Định Độc Lập Ventlore',
        targetId: initialData?.targetId,
        revisionId: initialData?.revisionId,
        authorHandle: initialData?.authorHandle,
        authorDisplayName: initialData?.authorDisplayName,
        authorWalletAddress: initialData?.authorWalletAddress,
        payerUserId: session?.userId,
        targetUserId: activeMode === 'MEMBERSHIP' ? session?.userId : undefined,
        amountAtomic: amountAtomicUnits.toString(),
        amountFormatted: `${parsedAmount} ${selectedAsset}`,
        asset: selectedAsset,
        authorAmountAtomic: authorShareAtomic.toString(),
        treasuryAmountAtomic: treasuryShareAtomic.toString(),
        authorAmountFormatted: `${authorShareFormatted} ${selectedAsset}`,
        treasuryAmountFormatted: `${treasuryShareFormatted} ${selectedAsset}`,
        status: 'SIMULATED_SUCCESS',
        timestamp: new Date().toISOString(),
      });

      setReceipt(recorded);
      setPaymentState('FINALIZED');
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi mô phỏng thanh toán.');
      setPaymentState('ERROR');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isSubmitting) {
          closePayment();
        }
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-sage/80 bg-surface-card p-5 sm:p-7 shadow-2xl text-ink space-y-5 animate-in zoom-in-95 duration-200"
      >
        {/* Header with Title */}
        <div className="flex items-start justify-between gap-3 border-b border-sage/60 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-forest/10 text-forest text-[11px] font-bold uppercase tracking-wider">
              <SparklesIcon className="w-3.5 h-3.5 text-amber" />
              <span>
                {activeMode === 'PROJECT' && t('payment.projectTag')}
                {activeMode === 'POST_TIP' && t('payment.postTipTag')}
                {activeMode === 'MEMBERSHIP' && t('payment.membershipTag')}
              </span>
            </div>
            <h2 id="payment-modal-title" className="text-xl sm:text-2xl font-bold text-ink mt-1">
              {activeMode === 'PROJECT' && t('payment.projectTitle')}
              {activeMode === 'POST_TIP' && t('payment.postTipTitle')}
              {activeMode === 'MEMBERSHIP' && t('payment.membershipTitle')}
            </h2>
          </div>

          <button
            type="button"
            onClick={closePayment}
            disabled={isSubmitting}
            className="p-1.5 rounded-control text-ink-muted hover:text-ink hover:bg-surface-canvas transition-colors disabled:opacity-50"
            aria-label="Đóng"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {paymentState === 'FINALIZED' && receipt ? (
          <div className="space-y-5 py-4 animate-in fade-in">
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircleIcon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                {t('payment.successTitle')}
              </h3>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-300">
                {t('payment.successDesc')}
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="rounded-xl border border-sage/80 bg-surface-canvas p-4 text-xs space-y-2.5">
              <div className="flex justify-between border-b border-sage/40 pb-2">
                <span className="text-ink-muted">Mã đối soát mô phỏng (Demo ID):</span>
                <span className="font-mono font-bold text-ink">{receipt.id}</span>
              </div>
              <div className="flex justify-between border-b border-sage/40 pb-2">
                <span className="text-ink-muted">Chế độ giao dịch:</span>
                <span className="font-bold text-forest">{receipt.mode}</span>
              </div>
              <div className="flex justify-between border-b border-sage/40 pb-2">
                <span className="text-ink-muted">Mục đích / Đích hưởng:</span>
                <span className="font-semibold text-ink text-right max-w-[60%]">{receipt.targetTitle}</span>
              </div>
              <div className="flex justify-between border-b border-sage/40 pb-2">
                <span className="text-ink-muted">Tổng số tiền mô phỏng:</span>
                <span className="font-bold text-ink">{receipt.amountFormatted}</span>
              </div>

              {receipt.mode === 'POST_TIP' && (
                <>
                  <div className="flex justify-between text-forest border-b border-sage/40 pb-2">
                    <span>{t('payment.authorShare')}:</span>
                    <span className="font-bold">{receipt.authorAmountFormatted}</span>
                  </div>
                  <div className="flex justify-between text-ink-muted border-b border-sage/40 pb-2">
                    <span>{t('payment.treasuryShare')}:</span>
                    <span className="font-semibold">{receipt.treasuryAmountFormatted}</span>
                  </div>
                </>
              )}

              {receipt.mode === 'MEMBERSHIP' && (
                <div className="flex justify-between text-forest border-b border-sage/40 pb-2">
                  <span>Quyền lợi kích hoạt:</span>
                  <span className="font-bold">Đã mở khóa VIP 12 tháng UTC cho @{session?.handle}</span>
                </div>
              )}

              <div className="flex justify-between pt-1">
                <span className="text-ink-muted">Trạng thái blockchain:</span>
                <span className="font-semibold text-ink-secondary">Mô phỏng off-chain (Chưa có giao dịch on-chain thật)</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={closePayment}
                className="w-full min-h-control py-2.5 rounded-control font-bold text-sm text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs"
              >
                {t('payment.closeModal')}
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form View */
          <div className="space-y-4">
            {/* Target Information Card */}
            <div className="rounded-xl border border-sage/70 bg-surface-canvas p-3.5 text-xs space-y-1.5">
              <div className="text-ink-muted font-medium uppercase tracking-wider text-[10px]">
                {activeMode === 'PROJECT' && 'Đích đến quyên góp'}
                {activeMode === 'POST_TIP' && 'Tác giả & Bài viết'}
                {activeMode === 'MEMBERSHIP' && 'Tài khoản thụ hưởng'}
              </div>

              {activeMode === 'PROJECT' && (
                <div>
                  <div className="font-bold text-sm text-ink">Quỹ Thẩm Định & Bảo Tồn Ventlore</div>
                  <div className="text-ink-secondary text-[11px]">
                    100% số tiền được chuyển trực tiếp vào ví đa chữ ký của quỹ cộng đồng. Chi phí gas riêng.
                  </div>
                </div>
              )}

              {activeMode === 'POST_TIP' && (
                <div>
                  <div className="font-bold text-sm text-ink">
                    {initialData?.targetTitle || 'Bài viết kiểm định thực địa'}
                  </div>
                  <div className="text-ink-secondary text-[11px] flex flex-wrap gap-2 mt-0.5">
                    <span>Tác giả: <strong>{initialData?.authorDisplayName || 'Minh Hướng Dẫn Viên'}</strong></span>
                    <span>Ví nhận: <code className="text-forest">{initialData?.authorWalletAddress || '0x88F...42C1'}</code></span>
                  </div>

                  {initialData?.isEligibleForTip === false && (
                    <div className="mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[11px]">
                      ⚠️ {initialData.ineligibleReason || 'Bài viết chưa có lộ trình tip hiệu lực (chưa kiểm định hoặc đang tạm dừng).'}
                    </div>
                  )}
                </div>
              )}

              {activeMode === 'MEMBERSHIP' && (
                <div>
                  {persona === 'guest' ? (
                    <div className="text-ink-secondary text-xs">
                      Tài khoản: <strong>Chưa đăng nhập</strong> (Cần đăng nhập tài khoản để gắn quyền VIP)
                    </div>
                  ) : (
                    <div>
                      <div className="font-bold text-sm text-ink flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-forest" />
                        <span>{session?.displayName} (@{session?.handle})</span>
                      </div>
                      <div className="text-ink-secondary text-[11px] mt-0.5">
                        Định mức niêm yết: <strong>1.500 USD cents</strong> (15 USD/năm). Thời hạn 12 tháng lịch UTC tính từ lúc kích hoạt.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* If Guest in MEMBERSHIP Mode: Show Login Gate (P0-02) */}
            {activeMode === 'MEMBERSHIP' && persona === 'guest' ? (
              <div className="p-4 sm:p-5 rounded-xl bg-amber-50 border border-amber-200 text-ink space-y-3">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                  <AlertTriangleIcon className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Cần đăng nhập tài khoản để nhận quyền VIP</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Gói Hội viên VIP gắn liền với tài khoản người dùng cá nhân (userId) để đồng bộ trên mọi thiết bị. Tài khoản Khách (Guest) không thể kích hoạt gói thành viên.
                </p>
                <div className="pt-1">
                  <Link
                    href={getLocalizedPath('/login?returnTo=/vip')}
                    onClick={closePayment}
                    className="w-full min-h-control inline-flex items-center justify-center gap-2 py-3 rounded-control font-bold text-sm text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs"
                  >
                    <span>Đăng nhập để đăng ký VIP ($15/năm)</span>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Amount Selection */}
                {activeMode !== 'MEMBERSHIP' ? (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-ink">
                      {t('payment.amountLabel')} ({selectedAsset}):
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['5', '10', '20', '50'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setAmount(preset)}
                          className={`min-h-[38px] py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            amount === preset
                              ? 'border-forest bg-forest text-white'
                              : 'border-sage/80 bg-surface-canvas text-ink hover:border-forest'
                          }`}
                        >
                          {preset} {selectedAsset}
                        </button>
                      ))}
                    </div>
                    <div className="relative mt-2">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full min-h-control px-3 py-2 rounded-xl border border-sage text-sm font-bold bg-surface-canvas text-ink focus:outline-none focus:ring-2 focus:ring-forest"
                        placeholder="Nhập số tiền khác..."
                      />
                      <div className="absolute right-3 top-2.5 text-xs font-bold text-ink-muted">
                        {selectedAsset}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl border border-sage/80 bg-surface-canvas flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-sm text-ink">15 USD / 12 Tháng</div>
                      <div className="text-ink-muted text-[11px]">Quy đổi: 15 USDC theo tỷ giá neo</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-forest/10 text-forest font-bold text-xs">
                      Gói Chuẩn
                    </span>
                  </div>
                )}

                {/* Split Breakdown for Tip */}
                {activeMode === 'POST_TIP' && (
                  <div className="p-3 rounded-xl border border-forest/20 bg-forest/5 text-xs space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-ink">{t('payment.authorShare')}:</span>
                      <span className="font-bold text-forest">{authorShareFormatted} {selectedAsset}</span>
                    </div>
                    <div className="flex justify-between text-ink-muted">
                      <span>{t('payment.treasuryShare')}:</span>
                      <span>{treasuryShareFormatted} {selectedAsset}</span>
                    </div>
                    <div className="text-[10px] text-ink-muted pt-1 border-t border-forest/10">
                      Tác giả nhận 80% số tiền ủng hộ; 20% được chuyển tự động vào quỹ bảo tồn cộng đồng.
                    </div>
                  </div>
                )}

                {/* Client Wallet State & Simulation Controls */}
                <div className="rounded-xl border border-sage/70 bg-surface-canvas p-3.5 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink">Ví kết nối (Mô phỏng demo):</span>
                      {isWalletConnected ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Đã kết nối
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                          Chưa kết nối
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsWalletConnected(!isWalletConnected)}
                      className="text-xs text-forest hover:underline font-semibold"
                    >
                      {isWalletConnected ? 'Ngắt kết nối' : 'Kết nối ví demo'}
                    </button>
                  </div>

                  {isWalletConnected && (
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-sage/40 text-[11px]">
                      <div>
                        <span className="text-ink-muted block">Địa chỉ ví:</span>
                        <span className="font-mono font-bold text-ink">{walletAddress}</span>
                      </div>
                      <div>
                        <span className="text-ink-muted block">Số dư khả dụng (Mô phỏng demo):</span>
                        <span className="font-bold text-forest">250.00 USDC</span>
                      </div>
                    </div>
                  )}

                  {/* Network Selector */}
                  <div className="pt-2 border-t border-sage/40 flex items-center justify-between">
                    <span className="text-ink-muted text-[11px]">{t('payment.networkLabel')}:</span>
                    <select
                      value={simChain}
                      onChange={(e) => setSimChain(e.target.value as SimChainId)}
                      className="px-2 py-1 rounded border border-sage bg-surface-card text-ink font-semibold text-xs focus:outline-none"
                    >
                      <option value="42161">Arbitrum One (Khuyến nghị)</option>
                      <option value="421614">Arbitrum Sepolia Testnet</option>
                      <option value="1">Ethereum Mainnet (Sai mạng demo)</option>
                    </select>
                  </div>

                  {isWrongNetwork && (
                    <div className="p-2 rounded bg-red-50 text-red-700 border border-red-200 text-[11px] font-medium">
                      ⚠️ {t('payment.wrongNetwork')}
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                {/* Submission Progress Indicator */}
                {isSubmitting && (
                  <div className="p-3 rounded-xl bg-forest/5 border border-forest/20 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-forest">
                      <span>Tiến trình mô phỏng: {paymentState}</span>
                      <div className="w-4 h-4 rounded-full border-2 border-forest border-t-transparent animate-spin" />
                    </div>
                    <div className="text-[11px] text-ink-secondary">
                      {t('payment.submitting')}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    disabled={isSubmitting || isWrongNetwork || !isWalletConnected}
                    className="w-full min-h-control py-3 rounded-control font-bold text-sm text-white bg-forest hover:bg-forest-hover transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>{t('payment.submitting')}</span>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4 text-amber" />
                        <span>{t('payment.confirmSimulate')}</span>
                      </>
                    )}
                  </button>

                  <div className="text-center text-[10px] text-ink-muted">
                    Ventlore FE Demo • Tuyệt đối không yêu cầu ký seed phrase hay giao dịch on-chain thật.
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
