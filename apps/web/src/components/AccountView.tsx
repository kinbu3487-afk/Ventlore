'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  mockApiClient,
  ContributionItemDTO,
  BenefitsDTO,
  VerificationStatus,
  PostVisibility,
  TipRouteStatus,
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

const VALID_TABS: AccountTab[] = ['profile', 'contributions', 'vip', 'benefits', 'expert'];

export function AccountView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { session, persona, setPersona } = useSession();
  const { openPayment } = usePayment();
  const { t, formatDate, getLocalizedPath } = useI18n();

  const isExpertOrAdmin = session?.roleAssignments?.some(
    (ra) => ra.role === 'EXPERT' || ra.role === 'ADMIN'
  );

  const rawTab = searchParams.get('tab');
  const isValidTab = useCallback(
    (tab: string | null): tab is AccountTab => {
      if (!tab) return false;
      if (!VALID_TABS.includes(tab as AccountTab)) return false;
      if (tab === 'expert' && !isExpertOrAdmin) return false;
      return true;
    },
    [isExpertOrAdmin]
  );

  const initialTab: AccountTab = isValidTab(rawTab) ? rawTab : 'profile';
  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);

  // Two-way sync: Handle URL query / back / forward changes and normalize invalid/unauthorized query
  useEffect(() => {
    if (!rawTab) {
      setActiveTab((prev) => (prev !== 'profile' ? 'profile' : prev));
      return;
    }
    if (isValidTab(rawTab)) {
      setActiveTab((prev) => (prev !== rawTab ? rawTab : prev));
    } else {
      // Invalid tab or unauthorized query -> normalize to 'profile' using replace
      setActiveTab('profile');
      const params = new URLSearchParams(searchParams.toString());
      params.delete('tab');
      const newQuery = params.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [rawTab, isValidTab, pathname, router, searchParams]);

  // Tab change handler pushing history for back/forward navigation
  const handleTabChange = (newTab: AccountTab) => {
    if (newTab === activeTab) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', newTab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Contributions state
  const [contributions, setContributions] = useState<ContributionItemDTO[]>([]);
  const [isLoadingContribs, setIsLoadingContribs] = useState(true);

  // Benefits state
  const [benefits, setBenefits] = useState<BenefitsDTO | null>(null);
  const [isLoadingBenefits, setIsLoadingBenefits] = useState(true);

  // Profile Editor state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileDisplayName, setProfileDisplayName] = useState(session?.displayName || '');
  const [profileBio, setProfileBio] = useState('Đam mê khảo sát các cung đường mòn và bảo tồn thiên nhiên hoang dã.');
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);

  // Sync profile display name when session changes
  useEffect(() => {
    if (session?.displayName) {
      setProfileDisplayName(session.displayName);
    }
  }, [session?.displayName]);

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
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-forest/10 text-forest mx-auto flex items-center justify-center">
          <UserIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Hồ Sơ Thành Viên
          </h1>
          <p className="text-sm text-ink-secondary leading-relaxed">
            Vui lòng đăng nhập để xem thông tin tài khoản, quản lý bài viết đã đóng góp, gói hội viên và các quyền lợi tác giả.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href={getLocalizedPath(`/login?returnTo=${encodeURIComponent(searchParams.toString() ? `/account?${searchParams.toString()}` : '/account')}`)}
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
            <span>{t('account.newPostButton')}</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-sage no-scrollbar">
        <button
          type="button"
          onClick={() => handleTabChange('profile')}
          className={`flex items-center gap-2 py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'profile'
              ? 'border-forest text-forest bg-surface-card rounded-t-card'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>{t('account.tabProfile')}</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('contributions')}
          className={`flex items-center gap-2 py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'contributions'
              ? 'border-forest text-forest bg-surface-card rounded-t-card'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <FileTextIcon className="w-4 h-4" />
          <span>{t('account.tabContributions')} ({contributions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('vip')}
          className={`flex items-center gap-2 py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'vip'
              ? 'border-forest text-forest bg-surface-card rounded-t-card'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <SparklesIcon className="w-4 h-4" />
          <span>{t('account.tabVip')}</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('benefits')}
          className={`flex items-center gap-2 py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'benefits'
              ? 'border-forest text-forest bg-surface-card rounded-t-card'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <AwardIcon className="w-4 h-4" />
          <span>{t('account.tabBenefits')}</span>
        </button>

        {isExpertOrAdmin && (
          <button
            type="button"
            onClick={() => handleTabChange('expert')}
            className={`flex items-center gap-2 py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'expert'
                ? 'border-forest text-forest bg-surface-card rounded-t-card'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <ShieldCheckIcon className="w-4 h-4" />
            <span>{t('account.tabExpert')}</span>
          </button>
        )}
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="p-6 rounded-card border border-sage bg-surface-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink">
                {t('account.tabProfile')}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsEditingProfile(!isEditingProfile);
                  setProfileSavedNotice(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control border border-sage hover:bg-surface-canvas text-xs font-semibold text-ink transition-colors"
              >
                <EditIcon className="w-3.5 h-3.5 text-forest" />
                <span>{isEditingProfile ? t('account.cancel') : t('account.editProfile')}</span>
              </button>
            </div>

            {profileSavedNotice && (
              <div className="p-3 rounded-control bg-status-success-bg text-status-success text-xs font-semibold flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 shrink-0" />
                <span>{t('account.profileSaved')}</span>
              </div>
            )}

            {isEditingProfile ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (session) {
                    session.displayName = profileDisplayName;
                  }
                  setIsEditingProfile(false);
                  setProfileSavedNotice(true);
                  setTimeout(() => setProfileSavedNotice(false), 3000);
                }}
                className="space-y-3 p-4 rounded-control bg-surface-canvas border border-sage"
              >
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">{t('account.displayName')}:</label>
                  <input
                    type="text"
                    value={profileDisplayName}
                    onChange={(e) => setProfileDisplayName(e.target.value)}
                    className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:ring-2 focus:ring-forest"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">{t('account.bio')}:</label>
                  <textarea
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:ring-2 focus:ring-forest"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-3 py-1.5 rounded-control border border-sage text-ink text-xs font-medium"
                  >
                    {t('account.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover"
                  >
                    {t('account.saveChanges')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-ink-muted block mb-1">ID:</label>
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
                <div className="sm:col-span-2">
                  <label className="text-ink-muted block mb-1">Giới thiệu ngắn:</label>
                  <div className="p-2 rounded-control bg-surface-canvas border border-sage text-ink-secondary">
                    {profileBio}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Linked Wallet Block */}
          <div className="space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink">
              Ví Web3 liên kết
            </h2>
            <WalletBinding walletBinding={session.walletBinding} />
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
                  Mỗi lần nộp sửa đổi sẽ tạo phiên bản mới <strong className="font-mono text-ink">v{editingPost.versionNumber + 1}</strong>. Phiên bản trước vẫn được lưu giữ đầy đủ trong lịch sử bài viết.
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
                    {isSubmittingRevision ? 'Đang lưu bản sửa đổi...' : 'Nộp bản sửa đổi'}
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
                {isVipActive ? t('vip.renewButton') : t('vip.subscribeButton')}
              </button>

              <Link
                href={getLocalizedPath('/vip')}
                className="px-4 py-2.5 rounded-control border border-sage text-ink text-xs font-semibold hover:bg-surface-canvas"
              >
                Xem chi tiết đặc quyền VIP
              </Link>
            </div>
          </div>

          {/* VIP Information Callout */}
          <div className="p-5 rounded-card border border-sage bg-surface-card space-y-2 text-xs text-ink-secondary">
            <div className="flex items-center gap-2 font-bold text-ink text-sm">
              <ShieldCheckIcon className="w-4 h-4 text-forest" />
              <span>Thông tin gói VIP:</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>
                <strong>Quyền lợi gắn theo tài khoản:</strong> Quyền VIP liên kết trực tiếp với tài khoản của bạn, duy trì xuyên suốt khi bạn đăng nhập trên các thiết bị khác nhau.
              </li>
              <li>
                <strong>Thời hạn và mức phí:</strong> 15 USD / năm (12 tháng lịch), kích hoạt ngay sau khi đăng ký hoặc cộng dồn nếu gói hiện tại còn hạn.
              </li>
              <li>
                <strong>Gia hạn chủ động:</strong> Hệ thống không tự động trừ tiền định kỳ. Bạn hoàn toàn chủ động gia hạn khi có nhu cầu tiếp tục sử dụng.
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
              {t('account.tabBenefits')}
            </h2>
            <p className="text-xs text-ink-secondary">
              {t('account.benefitsIntro')}
            </p>
          </div>

          {/* If 0 verified posts, show clear explanatory banner and disabled states */}
          {(benefits?.verifiedContentCount ?? 0) === 0 && (
            <div className="p-4 rounded-card border-2 border-amber/40 bg-status-caution-bg text-ink space-y-2 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-dark">
                <InfoIcon className="w-4 h-4 text-amber shrink-0" />
                <span>{t('account.noVerifiedPosts')}</span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                {t('account.benefitsIntro')}
              </p>
              <div className="pt-1">
                <Link
                  href={getLocalizedPath('/contribute')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover shadow-xs"
                >
                  <PlusCircleIcon className="w-3.5 h-3.5" />
                  <span>{t('account.newPostButton')}</span>
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Block 1: Verified Content Label */}
            <div className="p-5 rounded-card border border-sage bg-surface-card space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-ink">
                  <ShieldCheckIcon className="w-4 h-4 text-forest" />
                  <span>1. {t('account.benefit1Title')}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-status-success-bg text-status-success font-bold text-[10px]">
                  ON-WEB
                </span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                {t('account.benefit1Desc')}
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
                  <span>2. {t('account.benefit2Title')}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-status-vip-bg text-status-vip font-bold text-[10px]">
                  SOULBOUND
                </span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                {t('account.benefit2Desc')}
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-control bg-surface-canvas border border-sage/60 text-xs space-y-1 font-mono">
                  <div>Hạng mục: Contributor SBT</div>
                  <div>
                    Trạng thái:{' '}
                    <strong>
                      {(benefits?.verifiedContentCount ?? 0) === 0
                        ? t('account.notEligible')
                        : 'Đủ điều kiện nhận'}
                    </strong>
                  </div>
                </div>

                {(benefits?.verifiedContentCount ?? 0) === 0 ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-2 px-3 rounded-control bg-sage/40 text-ink-muted text-xs font-bold cursor-not-allowed opacity-60"
                  >
                    {t('account.notEligible')}
                  </button>
                ) : (
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      disabled
                      className="w-full py-2 px-3 rounded-control bg-sage/40 text-ink-muted text-xs font-bold cursor-not-allowed"
                    >
                      Nhận Contributor SBT (Đang kết nối onchain)
                    </button>
                    <p className="text-[10px] text-ink-muted text-center">
                      Cổng đúc chứng nhận onchain đang được chuẩn bị tích hợp trên Arbitrum.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Block 3: Author NFT */}
            <div className="p-5 rounded-card border border-sage bg-surface-card space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-ink">
                  <SparklesIcon className="w-4 h-4 text-forest" />
                  <span>3. {t('account.benefit3Title')}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-canvas border border-sage text-ink font-bold text-[10px]">
                  ERC-721
                </span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                {t('account.benefit3Desc')}
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-control bg-surface-canvas border border-sage/60 text-xs space-y-1 font-mono">
                  <div>Tiêu đề: {benefits?.nft.postTitle}</div>
                  <div>
                    Trạng thái:{' '}
                    <strong>
                      {(benefits?.verifiedContentCount ?? 0) === 0
                        ? t('account.notEligible')
                        : 'Đủ điều kiện đúc'}
                    </strong>
                  </div>
                </div>

                {(benefits?.verifiedContentCount ?? 0) === 0 ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-2 px-3 rounded-control bg-sage/40 text-ink-muted text-xs font-bold cursor-not-allowed opacity-60"
                  >
                    {t('account.notEligible')}
                  </button>
                ) : (
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      disabled
                      className="w-full py-2 px-3 rounded-control bg-sage/40 text-ink-muted text-xs font-bold cursor-not-allowed"
                    >
                      Đúc Author NFT (Đang kết nối onchain)
                    </button>
                    <p className="text-[10px] text-ink-muted text-center">
                      Hợp đồng Author NFT ERC-721 đang được chuẩn bị tích hợp trên Arbitrum.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Block 4: Tip Route Consent & Wallet Binding */}
            <div className="p-5 rounded-card border border-sage bg-surface-card space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-ink">
                  <CheckCircleIcon className="w-4 h-4 text-forest" />
                  <span>4. {t('account.benefit4Title')}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-waypoint/20 text-waypoint font-bold text-[10px]">
                  SPLITTER
                </span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                {t('account.benefit4Desc')}
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-control bg-surface-canvas border border-sage/60 text-xs space-y-1 font-mono">
                  <div>Tỷ lệ: 80% Tác giả &bull; 20% Quỹ cộng đồng Ventlore</div>
                  <div>
                    Trạng thái Tuyến tip:{' '}
                    <strong>
                      {(benefits?.verifiedContentCount ?? 0) === 0
                        ? 'CHƯA KÍCH HOẠT'
                        : benefits?.tipRoute.status}
                    </strong>
                  </div>
                  <div>Đồng ý nhận tiền (Consent): {benefits?.tipRoute.consentGiven ? 'ĐÃ ĐỒNG Ý' : 'CHƯA ĐỒNG Ý'}</div>
                </div>

                {(benefits?.verifiedContentCount ?? 0) === 0 ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-2 px-3 rounded-control bg-sage/40 text-ink-muted text-xs font-bold cursor-not-allowed opacity-60"
                  >
                    Chưa đủ điều kiện mở tuyến tip
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleToggleTipConsent}
                    className="w-full py-2 px-3 rounded-control border border-forest text-forest text-xs font-bold hover:bg-forest/10 transition-colors"
                  >
                    {benefits?.tipRoute.consentGiven
                      ? 'Tạm dừng nhận tip onchain'
                      : 'Ký xác nhận đồng ý nhận tip onchain (80/20)'}
                  </button>
                )}
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
