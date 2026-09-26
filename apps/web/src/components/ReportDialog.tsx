'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from './SessionContext';
import { useI18n } from '../lib/i18n';
import { mockApiClient, ReportDTO } from '@ventlore/api-client';
import { CloseIcon, ShieldCheckIcon, CheckCircleIcon } from './Icons';

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
  revisionId: string;
  claimId?: string;
  claimText?: string;
}

export function ReportDialog({
  isOpen,
  onClose,
  postId,
  postTitle,
  revisionId,
  claimId,
  claimText,
}: ReportDialogProps) {
  const { persona, session } = useSession();
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDivElement>(null);

  const [reason, setReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<ReportDTO | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setEvidenceUrl('');
      setSubmittedReport(null);
      setErrorMsg(null);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Vui lòng mô tả cụ thể nội dung sai lệch hoặc rủi ro thực địa.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const report = await mockApiClient.submitReport({
        postId,
        postTitle,
        revisionId,
        claimId,
        claimText,
        reason: reason.trim(),
        evidenceUrl: evidenceUrl.trim() || undefined,
        reporterUserId: session?.userId || '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e00',
        reporterHandle: session?.handle || 'guest_reader',
      });
      setSubmittedReport(report);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi gửi báo cáo khiếu nại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (dialogRef.current && !dialogRef.current.contains(e.target as Node) && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-lg rounded-2xl border border-sage/80 bg-surface-card p-5 sm:p-7 shadow-2xl text-ink space-y-5 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-start justify-between gap-3 border-b border-sage/60 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-red-600" />
              <span>Báo Cáo Sai Lệch / Rủi Ro An Toàn</span>
            </div>
            <h2 id="report-dialog-title" className="text-lg sm:text-xl font-bold text-ink mt-1">
              Phản Ánh Nội Dung Bài Viết
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-control text-ink-muted hover:text-ink hover:bg-surface-canvas transition-colors disabled:opacity-50"
            aria-label="Đóng"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {submittedReport ? (
          <div className="space-y-4 py-3 animate-in fade-in">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                Đã Tiếp Nhận Báo Cáo
              </h3>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-300">
                Báo cáo của bạn đã được chuyển tới Ban Quản Trị và lưu vào danh sách tiếp nhận thẩm tra.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-sage/80 bg-surface-canvas text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-ink-muted">Mã khiếu nại (Report ID):</span>
                <span className="font-mono font-bold text-ink">{submittedReport.reportId.slice(0, 18)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Trạng thái:</span>
                <span className="font-bold text-amber">Đang chờ xử lý (OPEN)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Bài viết liên quan:</span>
                <span className="font-semibold text-ink max-w-[60%] text-right truncate">{postTitle}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-control py-2.5 rounded-control font-bold text-xs text-white bg-forest hover:bg-forest-hover transition-colors"
            >
              Hoàn Tất
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 rounded-xl border border-sage/70 bg-surface-canvas text-xs space-y-1">
              <div className="text-ink-muted">Bài viết mục tiêu:</div>
              <div className="font-bold text-sm text-ink">{postTitle}</div>
              {claimText && (
                <div className="mt-1.5 p-2 rounded bg-forest/5 border border-forest/20 text-[11px] text-forest">
                  <strong>Khẳng định cần đối chứng:</strong> &ldquo;{claimText}&rdquo;
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-ink">
                Lý do báo sai / rủi ro phát hiện: <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ví dụ: Đoạn đường từ km 12 đã bị sạt lở nghiêm trọng sau bão, không thể đi xe máy như mô tả trong bài..."
                className="w-full p-3 rounded-xl border border-sage text-xs bg-surface-canvas text-ink focus:outline-none focus:ring-2 focus:ring-forest leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-ink">
                Liên kết ảnh / Bằng chứng đối chứng (nếu có):
              </label>
              <input
                type="text"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://... hoặc mô tả nguồn tài liệu đối chiếu"
                className="w-full min-h-control px-3 py-2 rounded-xl border border-sage text-xs bg-surface-canvas text-ink focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 min-h-control py-2.5 rounded-control font-semibold text-xs border border-sage bg-surface-canvas hover:bg-sage/40 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 min-h-control py-2.5 rounded-control font-bold text-xs text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi Phản Ánh'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
