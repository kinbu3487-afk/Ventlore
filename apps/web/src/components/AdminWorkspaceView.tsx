'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  mockApiClient,
  AdminIntakeItemDTO,
  AdminReviewCaseDTO,
  ReviewDecisionOutcome,
  TaskWorkStatus,
  generateUUIDv7,
} from '@ventlore/api-client';
import { useSession } from '@/components/SessionContext';
import { useI18n } from '@/lib/i18n';
import {
  ShieldAlertIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ClockIcon,
  FileTextIcon,
  CloseIcon,
  InfoIcon,
  ArrowRightIcon,
  LockIcon,
  SparklesIcon,
  RefreshCwIcon,
} from '@/components/Icons';

type AdminTab = 'intake' | 'review_cases' | 'app_hold';

export function AdminWorkspaceView() {
  const { session, persona, setPersona } = useSession();
  const { t, formatDate, getLocalizedPath } = useI18n();

  const searchParams = useSearchParams();
  const urlTab = searchParams.get('tab') as AdminTab | null;
  const [activeTab, setActiveTab] = useState<AdminTab>(
    urlTab && ['intake', 'review_cases', 'app_hold'].includes(urlTab) ? urlTab : 'intake'
  );

  useEffect(() => {
    if (urlTab && ['intake', 'review_cases', 'app_hold'].includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const [intakeList, setIntakeList] = useState<AdminIntakeItemDTO[]>([]);
  const [reviewCases, setReviewCases] = useState<AdminReviewCaseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Assign Task Modal State
  const [assignCase, setAssignCase] = useState<AdminReviewCaseDTO | null>(null);
  const [assignDeadlineDays, setAssignDeadlineDays] = useState(7);
  const [assignReward, setAssignReward] = useState('50');
  const [isAssigning, setIsAssigning] = useState(false);

  // Work Acceptance Modal State
  const [evalCase, setEvalCase] = useState<AdminReviewCaseDTO | null>(null);
  const [evalReason, setEvalReason] = useState('Bằng chứng thực địa rõ ràng, đạt chuẩn khảo sát.');
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Content Decision Modal State
  const [decideCase, setDecideCase] = useState<AdminReviewCaseDTO | null>(null);
  const [decisionOutcome, setDecisionOutcome] = useState<ReviewDecisionOutcome>(ReviewDecisionOutcome.APPROVED);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [decisionScope, setDecisionScope] = useState('Tuyến đường ven vách đá và bãi cắm trại mùa cạn');
  const [isDeciding, setIsDeciding] = useState(false);

  // Duplicate Place Compare Modal
  const [compareIntake, setCompareIntake] = useState<AdminIntakeItemDTO | null>(null);

  // Load Admin Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [iList, rcList] = await Promise.all([
        mockApiClient.getAdminIntake(),
        mockApiClient.getAdminReviewCases(),
      ]);
      setIntakeList(iList);
      setReviewCases(rcList);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handler: Assign Task
  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignCase) return;

    setIsAssigning(true);
    try {
      await mockApiClient.adminAssignTask(
        assignCase.caseId,
        '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e07', // Hoang Ranger
        assignDeadlineDays,
        assignReward
      );
      await loadData();
      setAssignCase(null);
      alert('Đã giao nhiệm vụ thẩm định cho Chuyên gia Hoàng Kiểm Định Viên thành công!');
    } catch (err: any) {
      alert(`Lỗi: ${err?.message || 'Không thể giao việc'}`);
    } finally {
      setIsAssigning(false);
    }
  };

  // Handler: Work Acceptance (Decision 1)
  const handleWorkAcceptance = async (outcome: 'ACCEPTED_WORK' | 'REJECTED_WORK') => {
    if (!evalCase || !evalCase.taskId) return;

    setIsEvaluating(true);
    try {
      const res = await mockApiClient.adminAcceptWork(evalCase.taskId, outcome, evalReason);
      await loadData();
      setEvalCase(null);
      if (outcome === 'ACCEPTED_WORK' && res.payable) {
        alert(`Nghiệm thu công việc ĐẠT YÊU CẦU! Đã tạo nghĩa vụ công nợ thù lao cho chuyên gia (${res.payable.amountFormatted}) với mã payableId: ${res.payable.payableId.slice(0, 13)}...`);
      } else {
        alert('Đã ghi nhận kết quả nghiệm thu công việc của chuyên gia.');
      }
    } catch (err: any) {
      alert(`Lỗi: ${err?.message || 'Không thể nghiệm thu'}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Handler: Content Decision (Decision 2)
  const handleContentDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decideCase) return;

    setIsDeciding(true);
    try {
      await mockApiClient.adminDecideContent(
        decideCase.caseId,
        decisionOutcome,
        decisionNotes || 'Quyết định thẩm định nội dung theo kết quả thực địa',
        decisionScope
      );
      await loadData();
      setDecideCase(null);
      alert(`Đã ban hành quyết định nội dung bài viết: ${decisionOutcome}!`);
    } catch (err: any) {
      alert(`Lỗi: ${err?.message || 'Không thể ban hành quyết định'}`);
    } finally {
      setIsDeciding(false);
    }
  };

  // Toggle App Hold
  const handleToggleHold = async (revisionId: string, currentHold: boolean) => {
    try {
      await mockApiClient.adminToggleAppHold(revisionId, !currentHold);
      await loadData();
    } catch (err: any) {
      alert(`Lỗi: ${err?.message}`);
    }
  };

  // Gate for Non-Admin Personas
  if (persona !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-forest/15 text-forest mx-auto flex items-center justify-center shadow-sm">
          <LockIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-forest/15 text-forest text-xs font-bold uppercase tracking-wider">
            Khu vực Giới hạn Ban Quản Trị
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Không Gian Quản Trị Hệ Thống (Admin & Operator)
          </h1>
          <p className="text-sm text-ink-secondary leading-relaxed">
            Khu vực này chỉ dành cho Ban Điều Hành và Quản Trị Viên hệ thống. Nơi tiếp nhận hồ sơ đề xuất điểm mới, phát hiện trùng lặp, phân công nhiệm vụ khảo sát cho chuyên gia, nghiệm thu công việc và đối soát ngân quỹ minh bạch.
          </p>
        </div>

        <div className="p-6 rounded-card border border-sage bg-surface-card text-left space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
            Thẩm quyền của Ban Quản trị:
          </h2>
          <ul className="text-xs text-ink-secondary space-y-2 list-disc list-inside">
            <li>
              <strong>Tiếp nhận hồ sơ (Intake):</strong> Thẩm tra ban đầu các đề xuất điểm mới, phát hiện trùng lặp địa lý với dữ liệu sẵn có.
            </li>
            <li>
              <strong>Giao việc & Nghiệm thu:</strong> Phân công chuyên gia độc lập, nghiệm thu chất lượng khảo sát thực địa để sinh công nợ chi trả.
            </li>
            <li>
              <strong>Quyết định phê duyệt:</strong> Ban hành quyết định xuất bản chính thức (APPROVED) hoặc từ chối (REJECTED) theo kết quả đối chứng.
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {persona === 'guest' ? (
            <Link
              href={getLocalizedPath(`/login?returnTo=${encodeURIComponent('/admin')}`)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-control font-bold text-white bg-forest hover:bg-forest-hover transition-colors shadow-sm text-xs text-center"
            >
              Đăng nhập với tài khoản Quản trị
            </Link>
          ) : (
            <div className="space-y-3 text-center">
              <p className="text-xs text-status-danger font-medium">Tài khoản hiện tại chưa có quyền quản trị hệ thống.</p>
              <Link
                href={getLocalizedPath('/')}
                className="inline-block px-5 py-2.5 rounded-control border border-sage text-ink text-xs font-semibold hover:bg-surface-canvas transition-colors"
              >
                Quay về Trang chủ
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-card border border-sage bg-surface-card shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-forest text-white flex items-center justify-center font-extrabold text-xl shrink-0 shadow-md">
            <LockIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
                Không Gian Ban Quản Trị (Admin Workspace)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-forest/15 text-forest font-bold text-xs">
                OPERATOR &bull; ADMIN
              </span>
            </div>
            <p className="text-xs text-ink-secondary">
              Tiếp nhận hồ sơ mới, phát hiện điểm trùng, giao việc chuyên gia, nghiệm thu công việc và ban hành quyết định kiểm định.
            </p>
          </div>
        </div>
      </div>

      {/* Invariant Banner */}
      <div className="p-4 rounded-card bg-surface-canvas border border-sage flex items-start gap-3 text-xs text-ink-secondary shadow-xs">
        <SparklesIcon className="w-5 h-5 text-forest shrink-0 mt-0.5" />
        <div>
          <strong className="text-ink font-semibold">Quy chuẩn Thẩm định: Hai Quyết Định Độc Lập. </strong>
          Đánh giá chất lượng thực hiện công việc của chuyên gia (<code className="text-forest">acceptanceId</code> &rarr; <code className="text-forest">payableId</code>) tách biệt hoàn toàn với kết luận tính chính xác của nội dung bài viết (<code className="text-forest">decisionId</code>). Chuyên gia thực hiện đúng quy trình vẫn được nghiệm thu và nhận thù lao dù bài viết bị từ chối phê duyệt.
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-sage">
        <button
          type="button"
          onClick={() => setActiveTab('intake')}
          className={`flex items-center gap-2 py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'intake'
              ? 'border-forest text-forest bg-surface-card rounded-t-card'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <FileTextIcon className="w-4 h-4" />
          <span>1. Hàng Đợi Tiếp Nhận ({intakeList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('review_cases')}
          className={`flex items-center gap-2 py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'review_cases'
              ? 'border-forest text-forest bg-surface-card rounded-t-card'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <ShieldCheckIcon className="w-4 h-4" />
          <span>2. Hồ Sơ Thẩm Định & Quyết Định ({reviewCases.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('app_hold')}
          className={`flex items-center gap-2 py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'app_hold'
              ? 'border-forest text-forest bg-surface-card rounded-t-card'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <ShieldAlertIcon className="w-4 h-4" />
          <span>3. Giám Sát & App Hold</span>
        </button>
      </div>

      {/* TAB 1: INTAKE QUEUE */}
      {activeTab === 'intake' && (
        <div className="space-y-4">
          <p className="text-xs text-ink-secondary">
            Sàng lọc hồ sơ đề xuất điểm mới (Candidate Place), bài viết mới đăng ký kiểm định và các khiếu nại báo sai từ cộng đồng.
          </p>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-sage/20 animate-pulse rounded-card" />
              ))}
            </div>
          ) : intakeList.length === 0 ? (
            <div className="p-8 rounded-card border border-dashed border-sage bg-surface-card text-center text-xs text-ink-muted">
              Hàng đợi tiếp nhận trống.
            </div>
          ) : (
            <div className="space-y-4">
              {intakeList.map(item => {
                const isProposal = item.type === 'PROPOSAL_NEW_PLACE';
                const isReport = item.type === 'USER_REPORT';

                return (
                  <div
                    key={item.intakeId}
                    className="p-5 rounded-card border border-sage bg-surface-card space-y-3 shadow-xs"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {isProposal && (
                            <span className="px-2 py-0.5 rounded-full bg-status-vip-bg text-status-vip font-bold text-[10px]">
                              ĐỀ XUẤT ĐIỂM MỚI
                            </span>
                          )}
                          {isReport && (
                            <span className="px-2 py-0.5 rounded-full bg-status-danger-bg text-status-danger font-bold text-[10px]">
                              BÁO CÁO KHIẾU NẠI
                            </span>
                          )}
                          {!isProposal && !isReport && (
                            <span className="px-2 py-0.5 rounded-full bg-forest/15 text-forest font-bold text-[10px]">
                              BÀI VIẾT MỚI
                            </span>
                          )}

                          <span className="text-xs text-ink-muted">&bull;</span>
                          <span className="text-xs text-ink-secondary">
                            Người gửi: <strong>@{item.submittedByHandle}</strong>
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-ink">{item.title}</h3>
                      </div>

                      <span className="text-xs text-ink-muted">
                        {formatDate(item.submittedAt)}
                      </span>
                    </div>

                    <p className="text-xs text-ink-secondary leading-relaxed bg-surface-canvas p-3 rounded-control border border-sage/60">
                      {item.summary}
                    </p>

                    {/* Duplicate Warning Callout if any */}
                    {item.potentialDuplicates && item.potentialDuplicates.length > 0 && (
                      <div className="p-3 rounded-control bg-status-caution-bg border border-waypoint/40 flex items-center justify-between gap-3 text-xs text-ink">
                        <div className="flex items-center gap-2">
                          <AlertTriangleIcon className="w-4 h-4 text-waypoint shrink-0" />
                          <span>
                            Phát hiện {item.potentialDuplicates.length} địa điểm có sẵn có tên tương tự: <strong>{item.potentialDuplicates[0]?.name}</strong> ({item.potentialDuplicates[0]?.similarity})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCompareIntake(item)}
                          className="px-3 py-1 rounded-control bg-waypoint text-white text-xs font-bold hover:opacity-90 whitespace-nowrap"
                        >
                          So sánh đối chiếu
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-sage/40 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          alert(`Đã duyệt chuyển hồ sơ "${item.title}" sang danh sách Thẩm định!`);
                          setIntakeList(intakeList.filter(i => i.intakeId !== item.intakeId));
                        }}
                        className="px-4 py-1.5 rounded-control bg-forest text-white font-bold hover:bg-forest-hover shadow-xs"
                      >
                        Chấp nhận & Mở hồ sơ thẩm định
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIntakeList(intakeList.filter(i => i.intakeId !== item.intakeId));
                        }}
                        className="px-3 py-1.5 rounded-control border border-sage text-ink font-medium hover:bg-surface-canvas"
                      >
                        Bác bỏ hồ sơ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REVIEW CASES & THE 2 INDEPENDENT DECISIONS */}
      {activeTab === 'review_cases' && (
        <div className="space-y-4">
          <p className="text-xs text-ink-secondary">
            Danh sách các hồ sơ đang trong quy trình thẩm định. Admin thực hiện giao việc cho chuyên gia, nghiệm thu chất lượng công việc (`acceptanceId`), và ban hành kết luận nội dung độc lập (`decisionId`).
          </p>

          <div className="space-y-4">
            {reviewCases.map(c => {
              const isAssigned = !!c.taskId;
              const hasSubmissions = c.submissionCount > 0;
              const isWorkAccepted = c.acceptanceStatus === 'ACCEPTED_WORK';
              const isWorkRejected = c.acceptanceStatus === 'REJECTED_WORK';
              const hasContentDecision = !!c.contentDecision;

              return (
                <div
                  key={c.caseId}
                  className="p-5 rounded-card border border-sage bg-surface-card space-y-4 shadow-xs"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-forest">
                          CASE: {c.caseId.slice(0, 8)}...
                        </span>
                        <span className="text-xs text-ink-muted">&bull;</span>
                        <span className="text-xs text-ink-secondary font-medium">
                          {c.placeName}
                        </span>
                        <span className="text-xs text-ink-muted">&bull;</span>
                        <span className="text-xs text-ink-secondary">
                          Tác giả: @{c.authorHandle}
                        </span>
                        {c.isAppHold && (
                          <span className="px-2 py-0.5 rounded-full bg-status-danger-bg text-status-danger font-bold text-[10px]">
                            APP HOLD
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-ink">{c.postTitle}</h3>
                    </div>

                    {/* Overall Status */}
                    <span className="px-2.5 py-1 rounded-full bg-surface-canvas border border-sage text-ink font-mono text-xs font-bold">
                      TRẠNG THÁI: {c.status}
                    </span>
                  </div>

                  {/* Operational Status Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-control bg-surface-canvas border border-sage/60 text-xs">
                    <div>
                      <span className="text-ink-muted block text-[11px]">Chuyên gia phụ trách:</span>
                      <strong className="text-ink">
                        {c.assignedExpertHandle ? `@${c.assignedExpertHandle}` : 'Chưa phân công'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-ink-muted block text-[11px]">Tiến độ khảo sát:</span>
                      <span className="text-ink">
                        {c.taskWorkStatus || 'Chưa nhận việc'} ({c.submissionCount} bản nộp)
                      </span>
                    </div>

                    <div>
                      <span className="text-ink-muted block text-[11px]">Nghiệm thu công & Quyết định:</span>
                      <div className="space-y-0.5">
                        <div>
                          Công:{' '}
                          {isWorkAccepted ? (
                            <strong className="text-status-success">ACCEPTED_WORK</strong>
                          ) : isWorkRejected ? (
                            <strong className="text-status-danger">REJECTED_WORK</strong>
                          ) : (
                            <span className="text-ink-muted">Chờ duyệt</span>
                          )}
                        </div>
                        <div>
                          Bài:{' '}
                          {c.contentDecision ? (
                            <strong className="text-forest">{c.contentDecision}</strong>
                          ) : (
                            <span className="text-ink-muted">Chưa quyết định</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row: Assign Task, Decision 1 (Work Acceptance), Decision 2 (Content) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-sage/40 text-xs">
                    <div className="text-ink-muted text-[11px]">
                      {c.payableId && (
                        <span>Đã sinh công nợ payableId: {c.payableId.slice(0, 13)}...</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Step 1: Assign Task if not assigned */}
                      {!isAssigned && (
                        <button
                          type="button"
                          onClick={() => setAssignCase(c)}
                          className="px-3 py-1.5 rounded-control bg-forest text-white font-bold hover:bg-forest-hover shadow-xs"
                        >
                          Giao việc Chuyên gia
                        </button>
                      )}

                      {/* Step 2: Work Acceptance (Independent Decision 1) */}
                      {isAssigned && !isWorkAccepted && !isWorkRejected && (
                        <button
                          type="button"
                          onClick={() => setEvalCase(c)}
                          className="px-3 py-1.5 rounded-control bg-waypoint text-white font-bold hover:opacity-90 shadow-xs"
                        >
                          1. Nghiệm thu công chuyên gia
                        </button>
                      )}

                      {/* Step 3: Content Decision (Independent Decision 2) */}
                      {!hasContentDecision && (
                        <button
                          type="button"
                          onClick={() => {
                            setDecideCase(c);
                            setDecisionNotes('');
                          }}
                          className="px-3 py-1.5 rounded-control border-2 border-forest text-forest font-bold hover:bg-forest/10"
                        >
                          2. Ban hành quyết định nội dung
                        </button>
                      )}

                      {/* App Hold Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleHold(c.revisionId, !!c.isAppHold)}
                        className={`px-2.5 py-1.5 rounded-control border text-[11px] font-semibold transition-colors ${
                          c.isAppHold
                            ? 'border-status-danger bg-status-danger-bg text-status-danger'
                            : 'border-sage text-ink hover:bg-surface-canvas'
                        }`}
                      >
                        {c.isAppHold ? 'Bỏ App Hold' : 'Đặt App Hold'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: APP HOLD & SUPERVISION */}
      {activeTab === 'app_hold' && (
        <div className="space-y-6">
          <div className="p-5 rounded-card border border-sage bg-surface-card space-y-3">
            <h2 className="text-base font-extrabold text-ink">Cơ Chế Khóa Khẩn Cấp (App Hold & Chain Block)</h2>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Theo quy định phân cấp, <strong className="text-ink">App Hold</strong> là cơ chế phản ứng nhanh của Ban Điều Hành nhằm tạm ngừng hiển thị hoặc khóa luồng nhận tip của bài viết/địa điểm ngay lập tức trên giao diện ứng dụng khi có khiếu nại nguy hiểm.
            </p>
            <div className="p-3.5 rounded-control bg-surface-canvas border border-sage/60 text-xs text-ink-secondary space-y-1">
              <div>
                <strong>Bất biến kỹ thuật: </strong>
                Yêu cầu chặn ở tầng ứng dụng (<code className="text-forest">App Hold</code>) và kết quả thực thi chặn smart contract trên blockchain (<code className="text-forest">Chain Block</code>) là <strong>hai trạng thái riêng biệt</strong>. App Hold có hiệu lực tức thời mà không phụ thuộc vào tình trạng mạng hay xác nhận block onchain.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Assign Task to Expert */}
      {assignCase && (
        <div className="fixed inset-0 z-modal bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAssignTask}
            className="bg-surface-card rounded-card border-2 border-forest shadow-xl max-w-lg w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-sage/60 pb-3">
              <h3 className="text-base font-bold text-ink">Giao Nhiệm Vụ Thẩm Định Thực Địa</h3>
              <button
                type="button"
                onClick={() => setAssignCase(null)}
                className="p-1 text-ink-muted hover:text-ink"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-ink-secondary">
              Hồ sơ: <strong className="text-ink">{assignCase.postTitle}</strong> tại {assignCase.placeName}
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                Chọn Chuyên gia (Accredited Field Expert)
              </label>
              <select className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest">
                <option value="hoang">Hoàng Kiểm Định Viên (@hoang_ranger — Chuyên gia Vùng Đông Bắc)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                  Thời hạn hoàn thành
                </label>
                <select
                  value={assignDeadlineDays}
                  onChange={e => setAssignDeadlineDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest"
                >
                  <option value={5}>5 ngày</option>
                  <option value={7}>7 ngày (Khuyến nghị)</option>
                  <option value={14}>14 ngày</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                  Mức thù lao (USDC)
                </label>
                <input
                  type="number"
                  value={assignReward}
                  onChange={e => setAssignReward(e.target.value)}
                  className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-sage">
              <button
                type="button"
                onClick={() => setAssignCase(null)}
                className="px-4 py-2 rounded-control border border-sage text-ink text-xs font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isAssigning}
                className="px-5 py-2 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover shadow-xs disabled:opacity-50"
              >
                {isAssigning ? 'Đang giao việc...' : 'Xác nhận giao nhiệm vụ'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Work Acceptance (Decision 1) */}
      {evalCase && (
        <div className="fixed inset-0 z-modal bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-card rounded-card border-2 border-waypoint shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-sage/60 pb-3">
              <h3 className="text-base font-bold text-ink">Nghiệm Thu Công Việc Chuyên Gia (Decision 1)</h3>
              <button
                type="button"
                onClick={() => setEvalCase(null)}
                className="p-1 text-ink-muted hover:text-ink"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-control bg-surface-canvas border border-sage/60 text-xs text-ink-secondary">
              Nghiệm thu xem chuyên gia có thực hiện khảo sát nghiêm túc, đúng tiêu chí và cung cấp đủ ảnh/bằng chứng hay không. Quyết định này <strong>không phụ thuộc</strong> vào việc bài viết có được phê duyệt hay không.
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                Nhận xét đánh giá quy trình thực địa
              </label>
              <textarea
                value={evalReason}
                onChange={e => setEvalReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-sage">
              <button
                type="button"
                disabled={isEvaluating}
                onClick={() => handleWorkAcceptance('REJECTED_WORK')}
                className="px-4 py-2 rounded-control bg-status-danger-bg text-status-danger border border-status-danger/40 text-xs font-bold hover:bg-status-danger-bg/80"
              >
                Không đạt (REJECTED_WORK)
              </button>
              <button
                type="button"
                disabled={isEvaluating}
                onClick={() => handleWorkAcceptance('ACCEPTED_WORK')}
                className="px-5 py-2 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover shadow-xs"
              >
                {isEvaluating ? 'Đang lưu...' : 'Nghiệm thu đạt yêu cầu (Tạo công nợ)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Content Decision (Decision 2) */}
      {decideCase && (
        <div className="fixed inset-0 z-modal bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleContentDecision}
            className="bg-surface-card rounded-card border-2 border-forest shadow-xl max-w-lg w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-sage/60 pb-3">
              <h3 className="text-base font-bold text-ink">Ban Hành Quyết Định Nội Dung Bài Viết (Decision 2)</h3>
              <button
                type="button"
                onClick={() => setDecideCase(null)}
                className="p-1 text-ink-muted hover:text-ink"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                Kết luận thẩm định (Outcome)
              </label>
              <select
                value={decisionOutcome}
                onChange={e => setDecisionOutcome(e.target.value as ReviewDecisionOutcome)}
                className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <option value={ReviewDecisionOutcome.APPROVED}>PHÊ DUYỆT (APPROVED — Gắn nhãn & mở 4 quyền lợi)</option>
                <option value={ReviewDecisionOutcome.REJECTED}>TỪ CHỐI (REJECTED — Chứa nguy hiểm hoặc sai lệch)</option>
                <option value={ReviewDecisionOutcome.CHANGES_REQUESTED}>YÊU CẦU BỔ SUNG (CHANGES_REQUESTED)</option>
                <option value={ReviewDecisionOutcome.INCONCLUSIVE}>CHƯA KẾT LUẬN ĐƯỢC (INCONCLUSIVE)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                Phạm vi chứng thực (Scope)
              </label>
              <input
                type="text"
                value={decisionScope}
                onChange={e => setDecisionScope(e.target.value)}
                className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                Căn cứ quyết định & Ghi chú cho tác giả
              </label>
              <textarea
                value={decisionNotes}
                onChange={e => setDecisionNotes(e.target.value)}
                rows={3}
                placeholder="Ghi rõ lý do căn cứ theo biên bản thực địa..."
                className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-sage">
              <button
                type="button"
                onClick={() => setDecideCase(null)}
                className="px-4 py-2 rounded-control border border-sage text-ink text-xs font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isDeciding}
                className="px-5 py-2 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover shadow-xs disabled:opacity-50"
              >
                {isDeciding ? 'Đang lưu...' : 'Ban hành quyết định'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Duplicate Comparison */}
      {compareIntake && compareIntake.potentialDuplicates && compareIntake.potentialDuplicates[0] && (
        <div className="fixed inset-0 z-modal bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-card rounded-card border-2 border-waypoint shadow-xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-sage/60 pb-3">
              <div className="flex items-center gap-2 text-waypoint font-bold text-base">
                <AlertTriangleIcon className="w-5 h-5" />
                <span>So Sánh Đối Chiếu Địa Điểm Trùng Lặp Tiềm Năng</span>
              </div>
              <button
                type="button"
                onClick={() => setCompareIntake(null)}
                className="p-1 text-ink-muted hover:text-ink"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-control bg-surface-canvas border border-sage space-y-2">
                <div className="font-bold text-forest uppercase tracking-wider text-[11px]">
                  Hồ sơ mới đề xuất:
                </div>
                <div>Tên: <strong>{compareIntake.title}</strong></div>
                <div>Vùng: {compareIntake.regionName}</div>
                <div>Tóm tắt: {compareIntake.summary}</div>
              </div>

              <div className="p-4 rounded-control bg-status-caution-bg/40 border border-waypoint/40 space-y-2">
                <div className="font-bold text-waypoint uppercase tracking-wider text-[11px]">
                  Địa điểm có sẵn trên hệ thống:
                </div>
                <div>Tên: <strong>{compareIntake.potentialDuplicates[0].name}</strong></div>
                <div>Độ tương đồng thuật toán: <strong className="text-forest">{compareIntake.potentialDuplicates[0].similarity}</strong></div>
                <div>ID: {compareIntake.potentialDuplicates[0].placeId}</div>
              </div>
            </div>

            <div className="p-3 rounded-control bg-surface-canvas text-xs text-ink-secondary">
              <strong>Quy tắc hợp nhất: </strong>
              Ventlore không tự động gộp điểm chỉ dựa trên khoảng cách GPS. Người quản trị cần xem xét tính độc lập của lối mòn hoặc tuyến tiếp cận trước khi quyết định.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCompareIntake(null)}
                className="px-4 py-2 rounded-control border border-sage text-ink text-xs font-medium"
              >
                Đóng đối chiếu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
