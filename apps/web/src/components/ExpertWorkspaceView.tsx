'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  mockApiClient,
  ExpertTaskDTO,
  ExpertPayableDTO,
  TaskWorkStatus,
  PayableStatus,
  generateUUIDv7,
} from '@ventlore/api-client';
import { useSession } from '@/components/SessionContext';
import { useI18n } from '@/lib/i18n';
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ClockIcon,
  FileTextIcon,
  CloseIcon,
  InfoIcon,
  ArrowRightIcon,
  ExternalLink,
  PlusCircleIcon,
} from '@/components/Icons';

type TaskFilter = 'ALL' | 'OFFERED' | 'IN_PROGRESS' | 'SUBMITTED' | 'ACCEPTED_WORK';

export function ExpertWorkspaceView() {
  const { session, persona, setPersona } = useSession();
  const { t, formatDate, getLocalizedPath } = useI18n();

  const [activeTab, setActiveTab] = useState<'tasks' | 'payables'>('tasks');
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('ALL');

  const [tasks, setTasks] = useState<ExpertTaskDTO[]>([]);
  const [payables, setPayables] = useState<ExpertPayableDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected Task Drawer & Submission state
  const [selectedTask, setSelectedTask] = useState<ExpertTaskDTO | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [findings, setFindings] = useState('');
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>(['https://example.com/field-survey-photo-1.jpg']);
  const [claimsEval, setClaimsEval] = useState<Array<{ claimId: string; verified: boolean; notes: string }>>([]);
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);

  // Load expert data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tList, pList] = await Promise.all([
        mockApiClient.getExpertTasks(session?.userId),
        mockApiClient.getExpertPayables(session?.userId),
      ]);
      setTasks(tList);
      setPayables(pList);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [session?.userId]);

  // Handle Accept / Decline Task
  const handleAcceptTask = async (taskId: string) => {
    try {
      await mockApiClient.acceptTask(taskId);
      await loadData();
    } catch (err: any) {
      alert(`Lỗi: ${err?.message || 'Không thể nhận task'}`);
    }
  };

  const handleDeclineTask = async (taskId: string) => {
    try {
      await mockApiClient.declineTask(taskId);
      await loadData();
    } catch (err: any) {
      alert(`Lỗi: ${err?.message || 'Không thể từ chối'}`);
    }
  };

  // Open Submit Evidence Modal
  const handleOpenSubmit = (task: ExpertTaskDTO) => {
    setSelectedTask(task);
    setFindings('');
    setEvidenceUrls(['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80']);
    setClaimsEval(
      task.claims.map(c => ({
        claimId: c.claimId,
        verified: true,
        notes: 'Đã đối chiếu thực địa, vị trí và thông số khớp thực tế.',
      }))
    );
    setShowSubmitModal(true);
  };

  // Submit Evidence
  const handleSubmitEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !findings.trim()) {
      alert('Vui lòng nhập báo cáo kết luận thẩm định.');
      return;
    }

    setIsSubmittingEvidence(true);
    try {
      await mockApiClient.submitTaskEvidence(
        selectedTask.taskId,
        findings,
        claimsEval,
        evidenceUrls.filter(u => u.trim().length > 0)
      );
      await loadData();
      setShowSubmitModal(false);
      setSelectedTask(null);
      alert('Đã gửi báo cáo thẩm định thành công! Trạng thái đã chuyển sang SUBMITTED (Đang chờ Admin nghiệm thu công việc).');
    } catch (err: any) {
      alert(`Lỗi: ${err?.message || 'Không thể gửi'}`);
    } finally {
      setIsSubmittingEvidence(false);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === 'ALL') return true;
    if (taskFilter === 'OFFERED') return t.workStatus === TaskWorkStatus.OFFERED;
    if (taskFilter === 'IN_PROGRESS') return t.workStatus === TaskWorkStatus.IN_PROGRESS;
    if (taskFilter === 'SUBMITTED') return t.workStatus === TaskWorkStatus.SUBMITTED;
    if (taskFilter === 'ACCEPTED_WORK') return t.workStatus === TaskWorkStatus.ACCEPTED_WORK;
    return true;
  });

  // Gate for Guest / Non-Expert Personas
  if (persona !== 'expert' && persona !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-waypoint/15 text-waypoint mx-auto flex items-center justify-center shadow-sm">
          <ShieldCheckIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-waypoint/15 text-waypoint text-xs font-bold uppercase tracking-wider">
            Khu vực Thẩm định viên Độc lập
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Không Gian Chuyên Gia Thẩm Định Thực Địa
          </h1>
          <p className="text-sm text-ink-secondary leading-relaxed">
            Đây là khu vực nghiệp vụ nội bộ dành cho các chuyên gia kiểm lâm, cứu hộ và người dẫn đường dã ngoại độc lập. Các chuyên gia tiến hành khảo sát thực địa, đối chiếu tọa độ và lập biên bản kiểm định độc lập để bảo vệ an toàn cho cộng đồng.
          </p>
        </div>

        <div className="p-6 rounded-card border border-sage bg-surface-card text-left space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
            Tiêu chuẩn Thẩm định viên Ventlore:
          </h2>
          <ul className="text-xs text-ink-secondary space-y-2 list-disc list-inside">
            <li>
              <strong>Kiểm định độc lập:</strong> Chuyên gia không được thẩm định bài viết do chính mình làm tác giả; hai tài khoản thuộc cùng một cá nhân không được coi là độc lập.
            </li>
            <li>
              <strong>Khảo sát thực tế:</strong> Phải có kinh nghiệm thực tế tại địa bàn khảo sát và cung cấp bằng chứng GPS, hình ảnh đối chứng cụ thể.
            </li>
            <li>
              <strong>Thù lao độc lập:</strong> Chuyên gia thực hiện đúng quy trình khảo sát vẫn được nghiệm thu và nhận tiền công đầy đủ ngay cả khi bài viết bị từ chối phê duyệt.
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setPersona('expert')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-control font-bold text-white bg-waypoint hover:opacity-90 transition-opacity shadow-sm text-xs"
          >
            Trải nghiệm vai trò Chuyên gia (Hoàng Kiểm Lâm)
          </button>
          {persona === 'guest' ? (
            <Link
              href={getLocalizedPath(`/login?returnTo=${encodeURIComponent('/expert')}`)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-control border border-sage text-ink text-xs font-semibold hover:bg-surface-canvas transition-colors"
            >
              Đăng nhập với tài khoản Chuyên gia
            </Link>
          ) : (
            <Link
              href={getLocalizedPath('/explore')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-control border border-sage text-ink text-xs font-semibold hover:bg-surface-canvas transition-colors"
            >
              Quay lại Khám phá
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-card border border-sage bg-surface-card shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-waypoint text-white flex items-center justify-center font-extrabold text-xl shrink-0 shadow-md">
            <ShieldCheckIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
                Không Gian Chuyên Gia (Expert Workspace)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-waypoint/20 text-waypoint font-bold text-xs">
                EXPERT ROLE
              </span>
            </div>
            <p className="text-xs text-ink-secondary">
              Quản lý nhiệm vụ kiểm định thực địa, nộp bằng chứng đối chứng và theo dõi công nợ chi trả (`payables`).
            </p>
          </div>
        </div>

        {/* Quick Switch to Expert Persona if not already */}
        {persona !== 'expert' && (
          <button
            type="button"
            onClick={() => setPersona('expert')}
            className="px-3 py-1.5 rounded-control text-xs font-bold text-white bg-waypoint hover:opacity-90 transition-opacity shadow-xs"
          >
            Chuyển sang Persona Chuyên gia (Hoàng)
          </button>
        )}
      </div>

      {/* Invariant Banner */}
      <div className="p-4 rounded-card bg-surface-canvas border border-sage flex items-start gap-3 text-xs text-ink-secondary shadow-xs">
        <ShieldCheckIcon className="w-5 h-5 text-forest shrink-0 mt-0.5" />
        <div>
          <strong className="text-ink font-semibold">Bất biến Hai Quyết Định Độc Lập: </strong>
          Đánh giá chất lượng thực hiện công việc của chuyên gia (<code className="text-forest">acceptanceId</code> &rarr; <code className="text-forest">payableId</code>) tách biệt hoàn toàn với kết luận tính chính xác của nội dung bài viết (<code className="text-forest">decisionId</code>). Chuyên gia thực hiện đúng quy trình vẫn được nghiệm thu và nhận tiền công dù bài viết bị từ chối kiểm định.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sage">
        <button
          type="button"
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'tasks'
              ? 'border-forest text-forest bg-surface-card rounded-t-card'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <FileTextIcon className="w-4 h-4" />
          <span>Bảng Nhiệm Vụ ({tasks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payables')}
          className={`flex items-center gap-2 py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'payables'
              ? 'border-forest text-forest bg-surface-card rounded-t-card'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <ClockIcon className="w-4 h-4" />
          <span>Công Phải Nhận ({payables.length})</span>
        </button>
      </div>

      {/* TAB 1: TASKS BOARD */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Subfilters */}
          <div className="flex flex-wrap gap-2 text-xs">
            {(['ALL', 'OFFERED', 'IN_PROGRESS', 'SUBMITTED', 'ACCEPTED_WORK'] as TaskFilter[]).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setTaskFilter(f)}
                className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                  taskFilter === f
                    ? 'bg-forest text-white'
                    : 'bg-surface-card border border-sage text-ink hover:bg-surface-canvas'
                }`}
              >
                {f === 'ALL' && 'Tất cả'}
                {f === 'OFFERED' && 'Lời mời mới (Offered)'}
                {f === 'IN_PROGRESS' && 'Đang làm (In Progress)'}
                {f === 'SUBMITTED' && 'Đã nộp chờ duyệt (Submitted)'}
                {f === 'ACCEPTED_WORK' && 'Đã nghiệm thu (Accepted Work)'}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="h-28 bg-sage/20 animate-pulse rounded-card" />
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-8 rounded-card border border-dashed border-sage bg-surface-card text-center text-xs text-ink-muted">
              Không có nhiệm vụ nào trong mục này.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map(t => {
                const isOffered = t.workStatus === TaskWorkStatus.OFFERED;
                const isInProgress = t.workStatus === TaskWorkStatus.IN_PROGRESS;
                const isSubmitted = t.workStatus === TaskWorkStatus.SUBMITTED;
                const isAcceptedWork = t.workStatus === TaskWorkStatus.ACCEPTED_WORK;

                return (
                  <div
                    key={t.taskId}
                    className="p-5 rounded-card border border-sage bg-surface-card space-y-3 shadow-xs hover:border-forest/40 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-forest">
                            {t.displayCode}
                          </span>
                          <span className="text-xs text-ink-muted">&bull;</span>
                          <span className="text-xs text-ink-secondary font-medium">
                            {t.placeName}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-ink">{t.postTitle}</h3>
                      </div>

                      {/* Work Status Badge */}
                      <div>
                        {isOffered && (
                          <span className="px-2.5 py-1 rounded-full bg-waypoint/20 text-waypoint font-bold text-xs">
                            LỜI MỜI MỚI (OFFERED)
                          </span>
                        )}
                        {isInProgress && (
                          <span className="px-2.5 py-1 rounded-full bg-status-pending-bg text-status-pending font-bold text-xs">
                            ĐANG THỰC HIỆN
                          </span>
                        )}
                        {isSubmitted && (
                          <span className="px-2.5 py-1 rounded-full bg-forest/15 text-forest font-bold text-xs">
                            ĐÃ NỘP BẰNG CHỨNG (SUBMITTED)
                          </span>
                        )}
                        {isAcceptedWork && (
                          <span className="px-2.5 py-1 rounded-full bg-status-success-bg text-status-success font-bold text-xs flex items-center gap-1">
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                            ĐÃ NGHIỆM THU CÔNG
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-ink-secondary leading-relaxed">
                      <strong>Phạm vi thẩm định: </strong>
                      {t.scope}
                    </p>

                    {/* Meta info & Compensation */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-control bg-surface-canvas border border-sage/60 text-xs">
                      <div>
                        <span className="text-ink-muted block text-[11px]">Tiền công thẩm định:</span>
                        <strong className="text-forest text-sm">{t.rewardAmountFormatted}</strong>
                      </div>
                      <div>
                        <span className="text-ink-muted block text-[11px]">Hạn hoàn thành:</span>
                        <span className="text-ink font-medium">{formatDate(t.deadline)}</span>
                      </div>
                      <div>
                        <span className="text-ink-muted block text-[11px]">Số nhận định cần kiểm tra:</span>
                        <span className="font-mono text-ink">{t.claims.length} claims</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-sage/40 text-xs">
                      <div className="text-ink-muted text-[11px]">
                        {t.submissions.length > 0 && (
                          <span>Đã nộp {t.submissions.length} lần báo cáo</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isOffered && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAcceptTask(t.taskId)}
                              className="px-4 py-1.5 rounded-control bg-forest text-white font-bold hover:bg-forest-hover shadow-xs"
                            >
                              Nhận nhiệm vụ (Accept)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeclineTask(t.taskId)}
                              className="px-3 py-1.5 rounded-control border border-sage text-ink font-medium hover:bg-surface-canvas"
                            >
                              Từ chối
                            </button>
                          </>
                        )}

                        {isInProgress && (
                          <button
                            type="button"
                            onClick={() => handleOpenSubmit(t)}
                            className="px-4 py-1.5 rounded-control bg-forest text-white font-bold hover:bg-forest-hover shadow-xs"
                          >
                            Nộp báo cáo thực địa (Submit Evidence)
                          </button>
                        )}

                        {isSubmitted && (
                          <span className="text-ink-muted italic text-[11px]">
                            Đang chờ Ban Điều Hành nghiệm thu hồ sơ...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAYABLES TABLE */}
      {activeTab === 'payables' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-ink">Bảng Công Phải Nhận (Accrued Payables)</h2>
              <p className="text-xs text-ink-secondary">
                Khoản thù lao đã được nghiệm thu chất lượng công việc, sẵn sàng chi trả từ Quỹ dự án.
              </p>
            </div>
          </div>

          {payables.length === 0 ? (
            <div className="p-8 rounded-card border border-dashed border-sage bg-surface-card text-center text-xs text-ink-muted">
              Chưa có khoản công nợ nào được tạo. Khi một nhiệm vụ được Admin duyệt <code className="text-forest">ACCEPTED_WORK</code>, công nợ sẽ xuất hiện tại đây.
            </div>
          ) : (
            <div className="rounded-card border border-sage bg-surface-card overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-sage bg-surface-canvas text-ink-secondary font-semibold">
                    <th className="py-3 px-4">Mã công nợ (UUIDv7)</th>
                    <th className="py-3 px-4">Mã nhiệm vụ</th>
                    <th className="py-3 px-4">Bài viết khảo sát</th>
                    <th className="py-3 px-4 text-right">Mức thù lao</th>
                    <th className="py-3 px-4">Trạng thái chi trả</th>
                    <th className="py-3 px-4">Ngày nghiệm thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage/40">
                  {payables.map(p => (
                    <tr key={p.payableId} className="hover:bg-surface-canvas/60">
                      <td className="py-3 px-4 font-mono font-medium text-forest">
                        {p.payableId.slice(0, 13)}...
                      </td>
                      <td className="py-3 px-4 font-mono text-ink">
                        {p.taskDisplayCode}
                      </td>
                      <td className="py-3 px-4 text-ink font-medium max-w-[200px] truncate">
                        {p.postTitle}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-ink">
                        {p.amountFormatted}
                      </td>
                      <td className="py-3 px-4">
                        {p.status === PayableStatus.OPEN && (
                          <span className="px-2 py-0.5 rounded-full bg-status-pending-bg text-status-pending font-bold text-[10px]">
                            OPEN (SẴN SÀNG CHI)
                          </span>
                        )}
                        {p.status === PayableStatus.PAID && (
                          <span className="px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-bold text-[10px]">
                            PAID (ĐÃ CHI TRẢ)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-ink-muted">
                        {formatDate(p.acceptedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Evidence Submission Modal */}
      {showSubmitModal && selectedTask && (
        <div className="fixed inset-0 z-modal bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmitEvidence}
            className="bg-surface-card rounded-card border-2 border-forest shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-sage/60 pb-3">
              <div className="flex items-center gap-2 text-forest font-bold text-base">
                <ShieldCheckIcon className="w-5 h-5" />
                <span>Nộp Báo Cáo Thẩm Định Thực Địa ({selectedTask.displayCode})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="p-1 text-ink-muted hover:text-ink rounded-control"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-control bg-surface-canvas border border-sage/60 text-xs text-ink-secondary">
              <strong>Tiêu chí nghiệm thu: </strong>
              {selectedTask.acceptanceCriteria.join('; ')}
            </div>

            {/* Claims Evaluation Table */}
            {selectedTask.claims.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                  Đánh giá từng nhận định (Claims Assessment)
                </label>
                <div className="space-y-2.5">
                  {selectedTask.claims.map((claim, idx) => {
                    const evalItem = claimsEval.find(ce => ce.claimId === claim.claimId);
                    return (
                      <div key={claim.claimId} className="p-3 rounded-control border border-sage bg-white space-y-2 text-xs">
                        <div className="font-semibold text-ink">
                          #{idx + 1}: {claim.text}
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <label className="inline-flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`claim-${claim.claimId}`}
                              checked={evalItem?.verified === true}
                              onChange={() => {
                                setClaimsEval(claimsEval.map(ce => ce.claimId === claim.claimId ? { ...ce, verified: true } : ce));
                              }}
                              className="text-forest focus:ring-forest"
                            />
                            <span className="text-status-success font-bold">Xác nhận đúng</span>
                          </label>

                          <label className="inline-flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`claim-${claim.claimId}`}
                              checked={evalItem?.verified === false}
                              onChange={() => {
                                setClaimsEval(claimsEval.map(ce => ce.claimId === claim.claimId ? { ...ce, verified: false } : ce));
                              }}
                              className="text-status-danger focus:ring-status-danger"
                            />
                            <span className="text-status-danger font-bold">Không chính xác / Nguy hiểm</span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* General Findings */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                Kết luận thực địa & Khuyến nghị an toàn <span className="text-status-danger">*</span>
              </label>
              <textarea
                value={findings}
                onChange={e => setFindings(e.target.value)}
                rows={4}
                placeholder="Ghi nhận điều kiện thời tiết, đường mòn, độ khó, các điểm sạt lở hoặc nguồn nước thực tế..."
                className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest"
                required
              />
            </div>

            {/* Evidence Photo URLs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                Ảnh đối chứng thực địa (Evidence URLs)
              </label>
              {evidenceUrls.map((url, i) => (
                <input
                  key={i}
                  type="url"
                  value={url}
                  onChange={e => {
                    const updated = [...evidenceUrls];
                    updated[i] = e.target.value;
                    setEvidenceUrls(updated);
                  }}
                  className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink font-mono text-xs focus:outline-none focus:ring-2 focus:ring-forest"
                />
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-sage">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-control border border-sage text-ink text-xs font-medium"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={isSubmittingEvidence}
                className="px-5 py-2 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover shadow-sm disabled:opacity-50"
              >
                {isSubmittingEvidence ? 'Đang lưu...' : 'Gửi hồ sơ thẩm định (Demo Submit)'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
