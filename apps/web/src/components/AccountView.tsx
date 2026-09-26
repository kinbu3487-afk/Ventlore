'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  mockApiClient,
  ContributionItemDTO,
  BenefitsDTO,
  VerificationStatus,
  PostVisibility,
  TipRouteStatus,
  generateUUIDv7,
} from '@ventlore/api-client';
import { useSession } from '@/components/SessionContext';
import { usePayment } from '@/components/PaymentContext';
import { useI18n } from '@/lib/i18n';
import { WalletBinding } from '@/components/WalletBinding';
import {
  UserIcon,
  FileTextIcon,
  SparklesIcon,
  AwardIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ClockIcon,
  EditIcon,
  ExternalLink,
  PlusCircleIcon,
  ArrowRightIcon,
  CloseIcon,
  InfoIcon,
} from '@/components/Icons';

type AccountTab = 'profile' | 'contributions' | 'vip' | 'benefits' | 'expert';

export function AccountView() {
  const searchParams = useSearchParams();
  const { session, persona, setPersona } = useSession();
  const { openPayment } = usePayment();
  const { t, formatDate, getLocalizedPath } = useI18n();

  const initialTab = (searchParams.get('tab') as AccountTab) || 'profile';
  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);

  // Contributions state
  const [contributions, setContributions] = useState<ContributionItemDTO[]>([]);
  const [isLoadingContribs, setIsLoadingContribs] = useState(true);

  // Benefits state
  const [benefits, setBenefits] = useState<BenefitsDTO | null>(null);
  const [isLoadingBenefits, setIsLoadingBenefits] = useState(true);
  const [isClaimingSbt, setIsClaimingSbt] = useState(false);
  const [isClaimingNft, setIsClaimingNft] = useState(false);

  // New Revision inline modal
  const [editingPost, setEditingPost] = useState<ContributionItemDTO | null>(null);
  const [revisionTitle, setRevisionTitle] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);

  // Load user contributions and benefits
  useEffect(() => {
    let mounted = true;
    async function loadUserData() {
      if (persona === 'guest' || !session) {
        setIsLoadingContribs(false);
        setIsLoadingBenefits(false);
        return;
      }
      setIsLoadingContribs(true);
      setIsLoadingBenefits(true);
      try {
        const [contribList, benefitsData] = await Promise.all([
          mockApiClient.getContributions(session.userId),
          mockApiClient.getBenefits(session.userId),
        ]);
        if (mounted) {
          setContributions(contribList);
          setBenefits(benefitsData);
          setIsLoadingContribs(false);
          setIsLoadingBenefits(false);
        }
      } catch {
        if (mounted) {
          setIsLoadingContribs(false);
          setIsLoadingBenefits(false);
        }
      }
    }
    loadUserData();
    return () => {
      mounted = false;
    };
  }, [persona, session?.userId]);

  // Handle SBT Claim demo
  const handleClaimSbt = async () => {
    if (!session) return;
    setIsClaimingSbt(true);
    try {
      const updated = await mockApiClient.claimBenefit(session.userId, 'sbt');
      setBenefits(updated);
    } finally {
      setIsClaimingSbt(false);
    }
  };

  // Handle NFT Claim demo
  const handleClaimNft = async () => {
    if (!session) return;
    setIsClaimingNft(true);
    try {
      const updated = await mockApiClient.claimBenefit(session.userId, 'nft');
      setBenefits(updated);
    } finally {
      setIsClaimingNft(false);
    }
  };

  // Handle Tip Consent Toggle
  const handleToggleTipConsent = async () => {
    if (!benefits || !session) return;
    const newConsent = !benefits.tipRoute.consentGiven;
    const updated = await mockApiClient.updateTipConsent(session.userId, newConsent);
    setBenefits(updated);
  };

  // Handle Submit New Revision (Parent revision -> new revisionId)
  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !revisionTitle.trim() || !session) return;

    setIsSubmittingRevision(true);
    try {
      await mockApiClient.submitRevision(
        editingPost.postId,
        {
          title: revisionTitle,
          content: revisionNotes ? `## Cập nhật sửa đổi:\n${revisionNotes}` : undefined,
        },
        session.userId
      );

      // Refresh contributions
      const updated = await mockApiClient.getContributions(session.userId);
      setContributions(updated);
      setEditingPost(null);
    } catch (err: any) {
      alert(`Lỗi gửi bản sửa đổi: ${err?.message || 'Không thể gửi'}`);
    } finally {
      setIsSubmittingRevision(false);
    }
  };

  // Gate for Guest
  if (persona === 'guest' || !session) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-forest/10 text-forest mx-auto flex items-center justify-center">
          <UserIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Khu vực Tài khoản Thành viên
          </h1>
          <p className="text-sm text-ink-secondary leading-relaxed">
            Bạn đang truy cập với tư cách khách (Guest). Vui lòng đăng nhập hoặc lựa chọn một hồ sơ mẫu để trải nghiệm đầy đủ các tính năng quản lý đóng góp, gói VIP và nhận quyền lợi tác giả.
          </p>
        </div>

        <div className="p-6 rounded-card border border-sage bg-surface-card space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
            Chuyển nhanh sang hồ sơ thử nghiệm (Demo Personas)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPersona('author')}
              className="p-3 rounded-control border border-sage hover:border-forest hover:bg-forest/5 text-left transition-colors"
            >
              <div className="font-bold text-xs text-forest">Minh Hướng Dẫn Viên</div>
              <div className="text-[11px] text-ink-muted">Tác giả đóng góp bài viết thực địa & Candidate place</div>
            </button>
            <button
              type="button"
              onClick={() => setPersona('vip')}
              className="p-3 rounded-control border border-sage hover:border-status-vip hover:bg-status-vip-bg/40 text-left transition-colors"
            >
              <div className="font-bold text-xs text-status-vip">Lan Khám Phá VIP</div>
              <div className="text-[11px] text-ink-muted">Hội viên VIP đã kích hoạt gói 15 USD/năm</div>
            </button>
            <button
              type="button"
              onClick={() => setPersona('expert')}
              className="p-3 rounded-control border border-sage hover:border-waypoint hover:bg-status-caution-bg text-left transition-colors"
            >
              <div className="font-bold text-xs text-waypoint">Hoàng Kiểm Định Viên</div>
              <div className="text-[11px] text-ink-muted">Chuyên gia thực địa có nhiệm vụ thẩm định & công nợ</div>
            </button>
            <button
              type="button"
              onClick={() => setPersona('admin')}
              className="p-3 rounded-control border border-sage hover:border-ink hover:bg-surface-canvas text-left transition-colors"
            >
              <div className="font-bold text-xs text-ink">Linh Quản Trị Viên</div>
              <div className="text-[11px] text-ink-muted">Ban điều hành duyệt tiếp nhận, giao việc & quyết định</div>
            </button>
          </div>
        </div>

        <div>
          <Link
            href={getLocalizedPath(`/login?returnTo=${encodeURIComponent('/account')}`)}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-control font-bold text-white bg-forest hover:bg-forest-hover transition-colors shadow-sm text-sm"
          >
            Đến trang Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  const isVipActive = session?.membership?.isActive === true;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Profile summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-card border border-sage bg-surface-card shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-forest text-white flex items-center justify-center font-extrabold text-xl shrink-0 shadow-inner">
            {session.displayName.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
                {session.displayName}
              </h1>
              {isVipActive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-vip-bg border border-status-vip/40 text-status-vip text-[11px] font-bold">
                  <SparklesIcon className="w-3 h-3" />
                  VIP
                </span>
              )}
            </div>
            <p className="text-xs text-ink-secondary font-mono">
              @{session.handle} &bull; ID: {session.userId.slice(0, 13)}...
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {session.roleAssignments.map(ra => (
                <span
                  key={ra.roleAssignmentId}
                  className="px-2 py-0.5 rounded-control bg-surface-canvas border border-sage text-[10px] font-bold text-ink-muted uppercase"
                >
                  {ra.role}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Link
            href={getLocalizedPath('/contribute')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover transition-colors shadow-xs"
          >
            <PlusCircleIcon className="w-3.5 h-3.5" />
            <span>Viết bài mới</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-sage no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'profile'
              ? 'border-forest text-forest bg-surface-card rounded-t-card'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Hồ sơ cá nhân</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contributions')}
          className={`flex items-center gap-2 py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'contributions'
              ? 'border-forest text-forest bg-surface-card rounded-t-card'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <FileTextIcon className="w-4 h-4" />
          <span>Đóng góp của tôi ({contributions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vip')}
          className={`flex items-center gap-2 py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'vip'
              ? 'border-forest text-forest bg-surface-card rounded-t-card'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <SparklesIcon className="w-4 h-4" />
          <span>Gói VIP & Quyền đọc</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('benefits')}
          className={`flex items-center gap-2 py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'benefits'
              ? 'border-forest text-forest bg-surface-card rounded-t-card'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <AwardIcon className="w-4 h-4" />
          <span>Quyền lợi đóng góp (4 Khối)</span>
        </button>

        {session.roleAssignments.some(ra => ra.role === 'EXPERT' || ra.role === 'ADMIN') && (
          <button
            type="button"
            onClick={() => setActiveTab('expert')}
            className={`flex items-center gap-2 py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'expert'
                ? 'border-forest text-forest bg-surface-card rounded-t-card'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <ShieldCheckIcon className="w-4 h-4" />
            <span>Nhiệm vụ Chuyên gia</span>
          </button>
        )}
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="p-6 rounded-card border border-sage bg-surface-card space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink">
              Thông tin Tài khoản (Canonical User)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-ink-muted block mb-1">Mã định danh duy nhất (UUIDv7):</label>
                <div className="p-2 rounded-control bg-surface-canvas border border-sage font-mono text-ink">
                  {session.userId}
                </div>
              </div>
              <div>
                <label className="text-ink-muted block mb-1">Tên hiển thị & Handle:</label>
                <div className="p-2 rounded-control bg-surface-canvas border border-sage font-mono text-ink">
                  {session.displayName} (@{session.handle})
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-control bg-surface-canvas border border-sage/60 text-xs text-ink-secondary">
              <strong className="text-ink">Bất biến kiến trúc: </strong>
              Một <code className="text-forest">userId</code> duy nhất đại diện cho người dùng xuyên suốt mọi vai trò. Quyền đọc, vai trò đóng góp, gói VIP và ví Web3 liên kết đều là các quan hệ trỏ về <code className="text-forest">userId</code> này.
            </div>
          </div>

          {/* Linked Wallet Block */}
          <div className="space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink">
              Ví Web3 liên kết (Wallet Binding)
            </h2>
            <WalletBinding walletBinding={session.walletBinding} />
            {!session.walletBinding && (
              <div className="p-4 rounded-card border border-sage bg-surface-card flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-ink">Mô phỏng liên kết ví (Demo Wallet Binding)</div>
                  <div className="text-[11px] text-ink-muted">Gắn địa chỉ ví mẫu để thử nghiệm nhận Contributor SBT và Author NFT</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    session.walletBinding = {
                      walletBindingId: generateUUIDv7(),
                      address: '0x71C8364420423171638202937038a174FB774053',
                      chainNamespace: 'eip155:421614',
                      isVerified: true,
                    };
                    alert('Đã liên kết ví demo thành công (Arbitrum Sepolia)!');
                  }}
                  className="px-3.5 py-2 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover transition-colors"
                >
                  Liên kết ví mẫu
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CONTRIBUTIONS */}
      {activeTab === 'contributions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-base font-extrabold text-ink">Danh sách đóng góp của bạn</h2>
              <p className="text-xs text-ink-secondary">
                Theo dõi tiến trình kiểm định thực địa, phiên bản nội dung và các phản hồi từ Ban Điều Hành.
              </p>
            </div>
            <Link
              href={getLocalizedPath('/contribute')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover"
            >
              <PlusCircleIcon className="w-3.5 h-3.5" />
              <span>Đóng góp mới</span>
            </Link>
          </div>

          {isLoadingContribs ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-sage/20 animate-pulse rounded-card" />
              ))}
            </div>
          ) : contributions.length === 0 ? (
            <div className="text-center py-12 p-6 rounded-card border border-dashed border-sage bg-surface-card space-y-3">
              <FileTextIcon className="w-10 h-10 text-ink-muted mx-auto" />
              <div className="font-bold text-sm text-ink">Chưa có bài đóng góp nào</div>
              <p className="text-xs text-ink-secondary max-w-sm mx-auto">
                Hãy là người đầu tiên chia sẻ hải trình hoặc đề xuất tọa độ mới để nhận huy hiệu Contributor SBT!
              </p>
              <Link
                href={getLocalizedPath('/contribute')}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover"
              >
                Bắt đầu đóng góp
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {contributions.map(item => (
                <div
                  key={item.postId}
                  className="p-5 rounded-card border border-sage bg-surface-card space-y-3 shadow-xs hover:border-forest/40 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-forest">
                          {item.displayCode}
                        </span>
                        <span className="text-xs text-ink-muted">&bull;</span>
                        <span className="text-xs text-ink-secondary font-medium">
                          {item.placeName}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-surface-canvas border border-sage text-ink font-mono text-[10px]">
                          REV v{item.versionNumber}
                        </span>
                        {item.isCandidatePlace && (
                          <span className="px-2 py-0.5 rounded-full bg-status-pending-bg text-status-pending text-[10px] font-bold">
                            ĐỀ XUẤT ĐIỂM MỚI
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-ink">{item.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Badges */}
                      {item.verificationStatus === VerificationStatus.VERIFIED && (
                        <span className="px-2.5 py-1 rounded-full bg-status-success-bg text-status-success text-xs font-bold flex items-center gap-1">
                          <CheckCircleIcon className="w-3.5 h-3.5" />
                          ĐÃ KIỂM ĐỊNH
                        </span>
                      )}
                      {item.verificationStatus === VerificationStatus.UNVERIFIED && (
                        <span className="px-2.5 py-1 rounded-full bg-status-pending-bg text-status-pending text-xs font-bold">
                          CHƯA KIỂM ĐỊNH (UNVERIFIED)
                        </span>
                      )}
                      {item.verificationStatus === VerificationStatus.IN_REVIEW && (
                        <span className="px-2.5 py-1 rounded-full bg-waypoint/20 text-waypoint text-xs font-bold">
                          ĐANG THẨM ĐỊNH
                        </span>
                      )}
                      {item.verificationStatus === VerificationStatus.REJECTED && (
                        <span className="px-2.5 py-1 rounded-full bg-status-danger-bg text-status-danger text-xs font-bold">
                          BỊ TỪ CHỐI
                        </span>
                      )}
                      {item.visibility === PostVisibility.REVIEW_ONLY && (
                        <span className="px-2 py-0.5 rounded-full bg-surface-canvas border border-status-pending text-status-pending text-[10px] font-bold">
                          REVIEW_ONLY
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Feedback notes */}
                  {item.feedbackNotes && (
                    <div className="p-3 rounded-control bg-surface-canvas border border-sage/60 text-xs text-ink-secondary flex items-start gap-2">
                      <InfoIcon className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                      <div>{item.feedbackNotes}</div>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-sage/40 text-xs">
                    <span className="text-ink-muted">
                      Ngày quan sát: {formatDate(item.observedAt)}
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost(item);
                          setRevisionTitle(item.title);
                          setRevisionNotes('');
                        }}
                        className="inline-flex items-center gap-1 text-forest hover:underline font-semibold"
                      >
                        <EditIcon className="w-3.5 h-3.5" />
                        <span>Nộp bản sửa đổi (New Revision)</span>
                      </button>

                      <Link
                        href={getLocalizedPath(`/posts/${item.postId}`)}
                        className="inline-flex items-center gap-1 text-ink hover:text-forest font-semibold"
                      >
                        <span>Xem chi tiết bài</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New Revision Drawer / Modal */}
          {editingPost && (
            <div className="fixed inset-0 z-modal bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <form
                onSubmit={handleSubmitRevision}
                className="bg-surface-card rounded-card border-2 border-forest shadow-xl max-w-lg w-full p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-sage/60 pb-3">
                  <div className="flex items-center gap-2 text-forest font-bold text-base">
                    <EditIcon className="w-5 h-5" />
                    <span>Nộp bản sửa đổi mới ({editingPost.displayCode})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="p-1 text-ink-muted hover:text-ink rounded-control"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 rounded-control bg-surface-canvas border border-sage/60 text-xs text-ink-secondary">
                  <strong className="text-ink">Quy tắc Bất biến Revisions: </strong>
                  Mỗi lần nộp sửa đổi sẽ tạo <code className="text-forest">revisionId</code> mới và tăng số phiên bản lên <strong className="font-mono text-ink">v{editingPost.versionNumber + 1}</strong>. Phiên bản cũ được đóng băng bất biến trong lịch sử đối soát.
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                    Tiêu đề phiên bản mới
                  </label>
                  <input
                    type="text"
                    value={revisionTitle}
                    onChange={e => setRevisionTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                    Ghi chú sửa đổi / bổ sung dữ liệu
                  </label>
                  <textarea
                    value={revisionNotes}
                    onChange={e => setRevisionNotes(e.target.value)}
                    rows={4}
                    placeholder="Mô tả những điểm đã được cập nhật hoặc chỉnh lý theo phản hồi của kiểm định viên..."
                    className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="px-4 py-2 rounded-control border border-sage text-ink text-xs font-medium"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingRevision}
                    className="px-5 py-2 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover shadow-sm disabled:opacity-50"
                  >
                    {isSubmittingRevision ? 'Đang lưu revision...' : 'Xác nhận nộp bản mới (Demo)'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: VIP MEMBERSHIP */}
      {activeTab === 'vip' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-7 rounded-card border-2 border-forest bg-surface-card space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-status-vip text-white flex items-center justify-center shrink-0 shadow-md">
                  <SparklesIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-ink">
                    Gói Hội Viên Độc Quyền (VIP Membership)
                  </h2>
                  <p className="text-xs text-ink-secondary">
                    Giá niêm yết: <strong className="text-forest text-sm">15 USD / 12 tháng</strong> (1.500 USD cents)
                  </p>
                </div>
              </div>

              {isVipActive ? (
                <span className="px-3.5 py-1.5 rounded-full bg-status-vip text-white font-extrabold text-xs shadow-xs tracking-wider">
                  ACTIVE &bull; ĐANG HOẠT ĐỘNG
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-surface-canvas border border-sage text-ink-muted text-xs font-bold">
                  CHƯA ĐĂNG KÝ
                </span>
              )}
            </div>

            {isVipActive && session.membership && (
              <div className="p-4 rounded-control bg-status-vip-bg/60 border border-status-vip/30 text-xs space-y-1 text-ink">
                <div>
                  Thời hạn hiệu lực:{' '}
                  <strong>{formatDate(session.membership.startsAt)}</strong> đến{' '}
                  <strong>{formatDate(session.membership.endsAt)}</strong> (12 tháng lịch UTC)
                </div>
                <div className="text-[11px] text-ink-secondary">
                  Gia hạn chủ động: Kỳ gia hạn mới sẽ được cộng nối tiếp 12 tháng vào thời điểm hết hạn hiện tại.
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  openPayment('MEMBERSHIP', {
                    targetId: 'VIP_ANNUAL',
                    planPriceUsdCents: 1500,
                    termMonths: 12,
                    targetTitle: 'Hội viên Thường niên VIP',
                  })
                }
                className="px-6 py-2.5 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover shadow-sm transition-colors"
              >
                {isVipActive ? 'Gia hạn gói VIP (15 USD/năm)' : 'Đăng ký Hội viên VIP (15 USD/năm)'}
              </button>

              <Link
                href={getLocalizedPath('/vip')}
                className="px-4 py-2.5 rounded-control border border-sage text-ink text-xs font-semibold hover:bg-surface-canvas"
              >
                Xem chi tiết đặc quyền VIP
              </Link>
            </div>
          </div>

          {/* Architectural Invariants Callout */}
          <div className="p-5 rounded-card border border-sage bg-surface-card space-y-2 text-xs text-ink-secondary">
            <div className="flex items-center gap-2 font-bold text-ink text-sm">
              <ShieldCheckIcon className="w-4 h-4 text-forest" />
              <span>Quy tắc kiến trúc VIP không làm lệch:</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>
                <strong>VIP gắn theo Tài khoản (`userId`):</strong> Không gắn theo địa chỉ ví. Người dùng đổi ví không làm mất quyền VIP; đăng nhập lại cùng tài khoản giữ nguyên quyền lợi.
              </li>
              <li>
                <strong>Gia hạn chủ động:</strong> Không tự động trừ thẻ định kỳ. Người dùng chủ động thanh toán khi muốn tiếp tục sử dụng.
              </li>
              <li>
                <strong>Quyên góp (`DON`) không cấp VIP:</strong> Tiền ủng hộ quỹ dự án và tiền đăng ký gói VIP được đối soát vào hai mã nghiệp vụ tách biệt hoàn toàn.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 4: CONTRIBUTION BENEFITS (4 SEPARATE BLOCKS) */}
      {activeTab === 'benefits' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-ink tracking-tight">
              Bốn Nhánh Quyền Lợi Sau Phê Duyệt (Independent Post-Approval Benefits)
            </h2>
            <p className="text-xs text-ink-secondary">
              Khi một bài viết được APPROVED, 4 quyền lợi sau được kích hoạt hoàn toàn độc lập và không phụ thuộc vào nhau.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Block 1: Verified Content Label */}
            <div className="p-5 rounded-card border border-sage bg-surface-card space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-ink">
                  <ShieldCheckIcon className="w-4 h-4 text-forest" />
                  <span>1. Nhãn kiểm định thực địa</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-bold text-[10px]">
                  ON-WEB
                </span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Hiển thị huy hiệu đã kiểm tra cùng phạm vi và thời hạn trực tiếp trên giao diện công cộng của Ventlore. Người đọc xem không cần kết nối ví.
              </p>
              <div className="p-3 rounded-control bg-surface-canvas border border-sage/60 text-xs font-mono">
                Số nội dung đã xác nhận:{' '}
                <strong className="text-forest text-sm font-bold">
                  {benefits?.verifiedContentCount ?? 0}
                </strong>{' '}
                bài viết
              </div>
            </div>

            {/* Block 2: Contributor SBT */}
            <div className="p-5 rounded-card border border-sage bg-surface-card space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-ink">
                  <AwardIcon className="w-4 h-4 text-forest" />
                  <span>2. Chứng nhận Contributor SBT</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-status-vip-bg text-status-vip font-bold text-[10px]">
                  SOULBOUND
                </span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Huy hiệu danh dự gắn liền với ví Web3 của tác giả. Không thể chuyển nhượng hay mua bán. Tác giả chủ động claim bằng ví đã liên kết.
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-control bg-surface-canvas border border-sage/60 text-xs space-y-1 font-mono">
                  <div>Trạng thái: <strong>{benefits?.sbt.status}</strong></div>
                  {benefits?.sbt.tokenId && (
                    <div className="text-[11px] text-ink-muted">
                      Token ID: {benefits.sbt.tokenId}
                    </div>
                  )}
                </div>

                {benefits?.sbt.status !== 'ISSUED_DEMO' ? (
                  <button
                    type="button"
                    onClick={handleClaimSbt}
                    disabled={isClaimingSbt}
                    className="w-full py-2 px-3 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover shadow-xs disabled:opacity-50"
                  >
                    {isClaimingSbt ? 'Đang xác thực...' : 'Nhận Contributor SBT (Demo Claim)'}
                  </button>
                ) : (
                  <div className="text-center p-2 rounded-control bg-status-success-bg text-status-success text-xs font-bold">
                    ✓ Đã nhận huy hiệu Contributor SBT (Demo)
                  </div>
                )}
              </div>
            </div>

            {/* Block 3: Author NFT */}
            <div className="p-5 rounded-card border border-sage bg-surface-card space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-ink">
                  <SparklesIcon className="w-4 h-4 text-forest" />
                  <span>3. Author Field Note NFT</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-canvas border border-sage text-ink font-bold text-[10px]">
                  ERC-721
                </span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Vật phẩm lưu niệm số đại diện cho bài viết đầu tiên được thẩm định thành công. Tối đa 1 NFT cho mỗi bài viết.
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-control bg-surface-canvas border border-sage/60 text-xs space-y-1 font-mono">
                  <div>Tiêu đề: {benefits?.nft.postTitle}</div>
                  <div>Trạng thái: <strong>{benefits?.nft.status}</strong></div>
                  {benefits?.nft.tokenId && (
                    <div className="text-[11px] text-ink-muted">
                      Token ID: {benefits.nft.tokenId}
                    </div>
                  )}
                </div>

                {benefits?.nft.status !== 'ISSUED_DEMO' ? (
                  <button
                    type="button"
                    onClick={handleClaimNft}
                    disabled={isClaimingNft}
                    className="w-full py-2 px-3 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover shadow-xs disabled:opacity-50"
                  >
                    {isClaimingNft ? 'Đang tạo giao dịch...' : 'Nhận Author NFT (Demo Claim)'}
                  </button>
                ) : (
                  <div className="text-center p-2 rounded-control bg-status-success-bg text-status-success text-xs font-bold">
                    ✓ Đã nhận Author NFT (Demo)
                  </div>
                )}
              </div>
            </div>

            {/* Block 4: Tip Route Consent & Wallet Binding */}
            <div className="p-5 rounded-card border border-sage bg-surface-card space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-ink">
                  <CheckCircleIcon className="w-4 h-4 text-forest" />
                  <span>4. Tuyến nhận tip onchain (80/20)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-waypoint/20 text-waypoint font-bold text-[10px]">
                  SPLITTER
                </span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Người đọc tip bài viết sẽ tự động chia 80% tới tác giả và 20% vào quỹ phát triển cộng đồng qua smart contract.
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-control bg-surface-canvas border border-sage/60 text-xs space-y-1 font-mono">
                  <div>Tỷ lệ: 80% Tác giả &bull; 20% Quỹ Ventlore</div>
                  <div>Trạng thái Route: <strong>{benefits?.tipRoute.status}</strong></div>
                  <div>Đồng ý nhận tiền (Consent): {benefits?.tipRoute.consentGiven ? 'ĐÃ ĐỒNG Ý' : 'CHƯA ĐỒNG Ý'}</div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleTipConsent}
                  className="w-full py-2 px-3 rounded-control border border-forest text-forest text-xs font-bold hover:bg-forest/10 transition-colors"
                >
                  {benefits?.tipRoute.consentGiven
                    ? 'Tạm dừng nhận tip onchain'
                    : 'Ký xác nhận đồng ý nhận tip onchain (80/20)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EXPERT INVITATIONS & WORKSPACE */}
      {activeTab === 'expert' && (
        <div className="p-6 rounded-card border border-sage bg-surface-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-ink">Không gian Chuyên gia Thẩm định (Expert Workspace)</h2>
              <p className="text-xs text-ink-secondary">
                Bạn đã được cấp vai trò Chuyên gia Kiểm định thực địa hoặc Ban Quản trị.
              </p>
            </div>
            <Link
              href={getLocalizedPath('/expert')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover shadow-xs"
            >
              <span>Vào Bảng công việc Chuyên gia</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
