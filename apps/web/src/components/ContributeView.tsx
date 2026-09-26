'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  mockApiClient,
  PlaceSummaryDTO,
  ContributionType,
  AccessTier,
  generateUUIDv7,
  normalizeSearch,
} from '@ventlore/api-client';
import { useSession } from '@/components/SessionContext';
import { useI18n } from '@/lib/i18n';
import { MarkdownView } from '@/components/MarkdownView';
import {
  FileTextIcon,
  MapPinIcon,
  PlusCircleIcon,
  EyeIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
  InfoIcon,
  ArrowRightIcon,
  CloseIcon,
  RefreshCwIcon,
} from '@/components/Icons';

type ContributeTab = 'existing' | 'candidate';

const REGION_PRESETS = [
  { id: 'reg-catba', name: 'Hải Phòng / Cát Bà' },
  { id: 'reg-coto', name: 'Quảng Ninh / Cô Tô' },
  { id: 'reg-north-mountain', name: 'Hà Giang / Hoàng Su Phì' },
  { id: 'reg-sapa', name: 'Lào Cai / Sa Pa' },
  { id: 'reg-caobang', name: 'Cao Bằng / Trùng Khánh' },
  { id: 'reg-dalat', name: 'Lâm Đồng / Đà Lạt' },
];

export function ContributeView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, persona, setPersona } = useSession();
  const { t, getLocalizedPath, locale } = useI18n();

  const initialTab = searchParams.get('tab') === 'candidate' ? 'candidate' : 'existing';
  const preselectedPlaceId = searchParams.get('placeId') || '';

  const [activeTab, setActiveTab] = useState<ContributeTab>(initialTab);
  const [places, setPlaces] = useState<PlaceSummaryDTO[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(true);

  // Tab 1: Existing Place Form State
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(preselectedPlaceId);
  const [placeSearchText, setPlaceSearchText] = useState('');

  const filteredPlaces = useMemo(() => {
    if (!placeSearchText) return places;
    const q = normalizeSearch(placeSearchText);
    const tokens = q.split(' ').filter(Boolean);
    return places.filter(p => {
      const text = normalizeSearch([
        p.name,
        p.regionName,
        p.provinceName,
        p.areaLabel,
        ...(p.searchAliases ?? []),
        p.displayCode,
      ].join(' '));
      return tokens.every(token => text.includes(token));
    });
  }, [places, placeSearchText]);
  const [postTitle, setPostTitle] = useState('');
  const [contributionType, setContributionType] = useState<ContributionType>(ContributionType.DISCOVERY);
  const [observedAt, setObservedAt] = useState(new Date().toISOString().slice(0, 10));
  const [accessTier, setAccessTier] = useState<AccessTier>(AccessTier.PUBLIC);
  const [postContent, setPostContent] = useState('');
  const [claims, setClaims] = useState<string[]>(['']);
  const [sources, setSources] = useState<Array<{ title: string; url: string }>>([
    { title: '', url: '' },
  ]);
  const [mockFiles, setMockFiles] = useState<Array<{ name: string; size: string }>>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{
    postId: string;
    displayCode: string;
    title: string;
    isCandidate?: boolean;
  } | null>(null);

  // Tab 2: Candidate Place Form State
  const [placeName, setPlaceName] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(REGION_PRESETS[0]);
  const [lat, setLat] = useState('20.7258');
  const [lng, setLng] = useState('107.0543');
  const [placeSummary, setPlaceSummary] = useState('');
  const [placeDescription, setPlaceDescription] = useState('');
  const [warnings, setWarnings] = useState<string[]>(['']);
  const [activities, setActivities] = useState<string[]>(['Trekking', 'Dã ngoại']);
  const [candidatePostTitle, setCandidatePostTitle] = useState('');
  const [candidatePostContent, setCandidatePostContent] = useState('');
  const [candidateClaims, setCandidateClaims] = useState<string[]>(['']);

  // Duplicate Place Detection State
  const [duplicateWarning, setDuplicateWarning] = useState<PlaceSummaryDTO | null>(null);
  const [dismissDuplicate, setDismissDuplicate] = useState(false);

  // Local draft status
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  // Load existing places
  useEffect(() => {
    let mounted = true;
    async function loadPlaces() {
      setIsLoadingPlaces(true);
      try {
        const res = await mockApiClient.listPlaces();
        if (mounted) {
          setPlaces(res.items);
          if (preselectedPlaceId) {
            const found = res.items.find(p => p.placeId === preselectedPlaceId);
            if (found) {
              setSelectedPlaceId(found.placeId);
              setPlaceSearchText(found.name);
            }
          }
          setIsLoadingPlaces(false);
        }
      } catch {
        if (mounted) setIsLoadingPlaces(false);
      }
    }
    loadPlaces();
    return () => {
      mounted = false;
    };
  }, [preselectedPlaceId]);

  // Sync place selection if searchParams change
  useEffect(() => {
    const pId = searchParams.get('placeId');
    if (pId && places.length > 0) {
      const found = places.find(p => p.placeId === pId);
      if (found) {
        setSelectedPlaceId(found.placeId);
        setPlaceSearchText(found.name);
        setActiveTab('existing');
      }
    }
  }, [searchParams, places]);

  const currentUserId = session?.userId || 'guest';
  const draftKeyTab1 = `ventlore_draft_${currentUserId}_existing`;
  const draftKeyTab2 = `ventlore_draft_${currentUserId}_candidate`;

  // Sync activeTab with URL searchParams (?tab=existing | ?tab=candidate | ?preset=catco)
  useEffect(() => {
    const tabQuery = searchParams.get('tab');
    if (tabQuery === 'candidate' && activeTab !== 'candidate') {
      setActiveTab('candidate');
    } else if (tabQuery === 'existing' && activeTab !== 'existing') {
      setActiveTab('existing');
    }
    if (searchParams.get('preset') === 'catco') {
      setPlaceName('Cát Cò');
      if (activeTab !== 'candidate') {
        setActiveTab('candidate');
      }
    }
  }, [searchParams, activeTab]);

  const handleSwitchTab = (tab: ContributeTab) => {
    setActiveTab(tab);
    setSubmitSuccess(null);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Duplicate place detector on Tab 2
  useEffect(() => {
    if (!placeName || dismissDuplicate || places.length === 0) {
      setDuplicateWarning(null);
      return;
    }
    const cleanInput = placeName.trim().toLowerCase();
    if (cleanInput.length < 3) {
      setDuplicateWarning(null);
      return;
    }

    const match = places.find(p => {
      const name = p.name.toLowerCase();
      return name.includes(cleanInput) || cleanInput.includes(name);
    });

    if (match) {
      setDuplicateWarning(match);
    } else {
      setDuplicateWarning(null);
    }
  }, [placeName, places, dismissDuplicate]);

  // Tab 1: Draft auto-save to localStorage
  useEffect(() => {
    if (postTitle || postContent) {
      const timer = setTimeout(() => {
        try {
          localStorage.setItem(
            draftKeyTab1,
            JSON.stringify({
              selectedPlaceId,
              postTitle,
              contributionType,
              observedAt,
              postContent,
              claims,
              sources,
              savedAt: new Date().toLocaleTimeString(),
            })
          );
          setDraftSavedAt(new Date().toLocaleTimeString());
        } catch {
          // ignore
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [draftKeyTab1, selectedPlaceId, postTitle, contributionType, observedAt, postContent, claims, sources]);

  // Tab 2: Draft auto-save to localStorage
  useEffect(() => {
    if (placeName || placeSummary || candidatePostTitle || candidatePostContent) {
      const timer = setTimeout(() => {
        try {
          localStorage.setItem(
            draftKeyTab2,
            JSON.stringify({
              placeName,
              selectedRegion,
              lat,
              lng,
              placeSummary,
              placeDescription,
              warnings,
              activities,
              candidatePostTitle,
              candidatePostContent,
              candidateClaims,
              savedAt: new Date().toLocaleTimeString(),
            })
          );
          setDraftSavedAt(new Date().toLocaleTimeString());
        } catch {
          // ignore
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [
    draftKeyTab2,
    placeName,
    selectedRegion,
    lat,
    lng,
    placeSummary,
    placeDescription,
    warnings,
    activities,
    candidatePostTitle,
    candidatePostContent,
    candidateClaims,
  ]);

  // Restore drafts on mount and on user switch
  useEffect(() => {
    try {
      // Restore Tab 1
      const savedTab1 = localStorage.getItem(draftKeyTab1) || localStorage.getItem('ventlore_contribute_draft');
      if (savedTab1) {
        const parsed = JSON.parse(savedTab1);
        if (parsed.selectedPlaceId) setSelectedPlaceId(parsed.selectedPlaceId);
        if (parsed.postTitle) setPostTitle(parsed.postTitle);
        if (parsed.postContent) setPostContent(parsed.postContent);
        if (parsed.contributionType) setContributionType(parsed.contributionType);
        if (parsed.observedAt) setObservedAt(parsed.observedAt);
        if (parsed.claims && parsed.claims.length > 0) setClaims(parsed.claims);
        if (parsed.sources && parsed.sources.length > 0) setSources(parsed.sources);
        if (parsed.savedAt) setDraftSavedAt(parsed.savedAt);
      }

      // Restore Tab 2
      const savedTab2 = localStorage.getItem(draftKeyTab2);
      if (savedTab2) {
        const parsed2 = JSON.parse(savedTab2);
        if (parsed2.placeName) setPlaceName(parsed2.placeName);
        if (parsed2.selectedRegion) setSelectedRegion(parsed2.selectedRegion);
        if (parsed2.lat) setLat(parsed2.lat);
        if (parsed2.lng) setLng(parsed2.lng);
        if (parsed2.placeSummary) setPlaceSummary(parsed2.placeSummary);
        if (parsed2.placeDescription) setPlaceDescription(parsed2.placeDescription);
        if (parsed2.warnings && parsed2.warnings.length > 0) setWarnings(parsed2.warnings);
        if (parsed2.activities && parsed2.activities.length > 0) setActivities(parsed2.activities);
        if (parsed2.candidatePostTitle) setCandidatePostTitle(parsed2.candidatePostTitle);
        if (parsed2.candidatePostContent) setCandidatePostContent(parsed2.candidatePostContent);
        if (parsed2.candidateClaims && parsed2.candidateClaims.length > 0) setCandidateClaims(parsed2.candidateClaims);
        if (parsed2.savedAt && !savedTab1) setDraftSavedAt(parsed2.savedAt);
      }
    } catch {
      // ignore
    }
  }, [draftKeyTab1, draftKeyTab2]);

  // Handlers for Tab 1
  const handleAddClaim = () => setClaims([...claims, '']);
  const handleClaimChange = (index: number, val: string) => {
    const updated = [...claims];
    updated[index] = val;
    setClaims(updated);
  };
  const handleRemoveClaim = (index: number) => {
    setClaims(claims.filter((_, i) => i !== index));
  };

  const handleAddSource = () => setSources([...sources, { title: '', url: '' }]);
  const handleSourceChange = (index: number, field: 'title' | 'url', val: string) => {
    const updated = [...sources];
    if (updated[index]) {
      updated[index][field] = val;
      setSources(updated);
    }
  };
  const handleRemoveSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index));
  };

  const handleMockFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: `${(f.size / 1024).toFixed(1)} KB`,
      }));
      setMockFiles([...mockFiles, ...newFiles]);
    }
  };

  // Submit Tab 1
  const handleSubmitExistingPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim() || !selectedPlaceId) {
      alert('Vui lòng nhập đầy đủ tiêu đề, địa điểm và nội dung bài viết.');
      return;
    }

    if (persona === 'guest' || !session) {
      alert('Bạn đang ở phiên Khách vãng lai. Vui lòng đăng nhập tài khoản để gửi bài viết.');
      return;
    }

    setIsSubmitting(true);
    try {
      const activeClaims = claims.filter(c => c.trim().length > 0);
      const activeSources = sources.filter(s => s.title.trim().length > 0);

      const res = await mockApiClient.submitContributionPost(
        {
          placeId: selectedPlaceId,
          title: postTitle,
          contributionType,
          observedAt: new Date(observedAt).toISOString(),
          content: postContent,
          claims: activeClaims,
          sources: activeSources,
          accessTier,
        },
        session.userId,
        session.handle
      );

      // Clear Tab 1 draft only
      localStorage.removeItem(draftKeyTab1);
      localStorage.removeItem('ventlore_contribute_draft');
      setSubmitSuccess({
        postId: res.postId,
        displayCode: res.displayCode,
        title: res.title,
        isCandidate: false,
      });
    } catch (err: any) {
      alert(`Lỗi gửi bài: ${err?.message || 'Không thể gửi'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Tab 2
  const handleSubmitCandidatePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeName.trim() || !placeSummary.trim() || !candidatePostTitle.trim() || !candidatePostContent.trim()) {
      alert('Vui lòng nhập đầy đủ tên địa điểm, tóm tắt và bài viết khám phá ban đầu.');
      return;
    }

    if (persona === 'guest' || !session) {
      alert('Bạn đang ở phiên Khách vãng lai. Vui lòng đăng nhập tài khoản để đề xuất điểm mới.');
      return;
    }

    setIsSubmitting(true);
    try {
      const activeWarnings = warnings.filter(w => w.trim().length > 0);
      const activeClaims = candidateClaims.filter(c => c.trim().length > 0);
      const activeRegion = selectedRegion || { id: 'reg-catba', name: 'Hải Phòng / Cát Bà' };

      const res = await mockApiClient.proposeCandidatePlace(
        {
          name: placeName,
          regionId: activeRegion.id,
          regionName: activeRegion.name,
          coordinates: {
            lat: parseFloat(lat) || 20.7258,
            lng: parseFloat(lng) || 107.0543,
          },
          summary: placeSummary,
          description: placeDescription || placeSummary,
          warnings: activeWarnings,
          activities,
          postTitle: candidatePostTitle,
          postContent: candidatePostContent,
          postClaims: activeClaims,
        },
        session.userId,
        session.handle
      );

      // Clear Tab 2 draft only
      localStorage.removeItem(draftKeyTab2);
      setSubmitSuccess({
        postId: res.post.postId,
        displayCode: res.post.displayCode,
        title: res.place.name,
        isCandidate: true,
      });
    } catch (err: any) {
      alert(`Lỗi đề xuất điểm mới: ${err?.message || 'Không thể gửi'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-bold uppercase tracking-wider">
          <FileTextIcon className="w-3.5 h-3.5" />
          <span>{t('contribute.headerBadge')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          {t('contribute.mainTitle')}
        </h1>
        <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
          {t('contribute.mainSubtitle')}
        </p>
      </div>

      {/* Guest Notice */}
      {persona === 'guest' && (
        <div className="p-4 rounded-card border border-status-pending/40 bg-status-pending-bg text-ink text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <InfoIcon className="w-5 h-5 text-status-pending shrink-0" />
            <div>
              <p className="font-semibold text-xs text-status-pending uppercase tracking-wider">
                {t('contribute.guestSessionTitle')}
              </p>
              <p className="text-xs text-ink-secondary">
                {t('contribute.guestSessionDesc')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={getLocalizedPath(`/login?returnTo=${encodeURIComponent(`/contribute?tab=${activeTab}${selectedPlaceId ? `&placeId=${selectedPlaceId}` : ''}`)}`)}
              className="px-4 py-2 rounded-control text-xs font-bold text-white bg-forest hover:bg-forest-hover transition-colors whitespace-nowrap shadow-xs"
            >
              {t('contribute.guestLoginCta')}
            </Link>
          </div>
        </div>
      )}

      {/* Success Modal / Banner */}
      {submitSuccess && (
        <div className="p-6 rounded-card border-2 border-status-success bg-status-success-bg/80 text-ink space-y-4 shadow-md">
          <div className="flex items-center gap-3 text-status-success">
            <CheckCircleIcon className="w-8 h-8 shrink-0" />
            <div>
              <h3 className="font-extrabold text-lg">
                {submitSuccess.isCandidate
                  ? t('contribute.successCandidateTitle')
                  : t('contribute.successExistingTitle')}
              </h3>
              <p className="text-xs text-ink-secondary">
                {t('contribute.systemIdLabel')}: <strong className="font-mono text-ink">{submitSuccess.displayCode}</strong>
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-ink-secondary">
            {submitSuccess.isCandidate
              ? t('contribute.successCandidateDesc')
              : t('contribute.successExistingDesc')}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={getLocalizedPath('/account?tab=contributions')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover transition-colors shadow-sm"
            >
              <span>{t('contribute.viewMyContributions')}</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmitSuccess(null);
                setPostTitle('');
                setPostContent('');
                setClaims(['']);
                setPlaceName('');
                setPlaceSummary('');
              }}
              className="px-4 py-2 rounded-control border border-sage text-ink text-xs font-semibold hover:bg-surface-canvas transition-colors"
            >
              {t('account.newPostButton')}
            </button>
          </div>
        </div>
      )}

      {/* Main Tabs */}
      <div className="flex border-b border-sage">
        <button
          type="button"
          onClick={() => handleSwitchTab('existing')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'existing'
              ? 'border-forest text-forest bg-surface-card rounded-t-card'
              : 'border-transparent text-ink-muted hover:text-ink hover:border-sage'
          }`}
        >
          <FileTextIcon className="w-4 h-4" />
          <span>{t('contribute.tabExisting')}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab('candidate')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'candidate'
              ? 'border-forest text-forest bg-surface-card rounded-t-card'
              : 'border-transparent text-ink-muted hover:text-ink hover:border-sage'
          }`}
        >
          <MapPinIcon className="w-4 h-4" />
          <span>{t('contribute.tabCandidate')}</span>
        </button>
      </div>

      {/* TAB 1: Existing Place Form */}
      {activeTab === 'existing' && (
        <form onSubmit={handleSubmitExistingPost} className="space-y-6 bg-surface-card p-6 sm:p-8 rounded-card border border-sage shadow-sm">
          {/* Invariant Banner */}
          <div className="p-3.5 rounded-control bg-surface-canvas border border-sage/80 flex items-start gap-2.5 text-xs text-ink-secondary">
            <ShieldCheckIcon className="w-4 h-4 text-forest shrink-0 mt-0.5" />
            <div>
              {t('contribute.ruleExistingNotice')}
            </div>
          </div>

          {/* Place Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink">
              {t('contribute.placeLabel')} <span className="text-status-danger">*</span>
            </label>
            {isLoadingPlaces ? (
              <div className="h-10 bg-sage/30 animate-pulse rounded-control" />
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={placeSearchText}
                  onChange={e => setPlaceSearchText(e.target.value)}
                  placeholder={t('contribute.searchPlacePlaceholder')}
                  className="w-full px-3 py-2 rounded-control border border-sage bg-surface-canvas text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest placeholder:text-ink-muted"
                />
                <select
                  value={selectedPlaceId}
                  onChange={e => setSelectedPlaceId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-control border border-sage bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                  required
                >
                  <option value="" disabled>
                    {t('contribute.selectPlacePlaceholder')}
                  </option>
                  {filteredPlaces.length === 0 ? (
                    <option value="" disabled>
                      {t('contribute.noPlaceMatch')}
                    </option>
                  ) : (
                    filteredPlaces.map(p => (
                      <option key={p.placeId} value={p.placeId}>
                        {p.name} — {p.regionName} ({p.displayCode})
                      </option>
                    ))
                  )}
                </select>
                {placeSearchText && (
                  <p className="text-[11px] text-ink-muted">
                    {t('contribute.foundPlacesMatch', { count: filteredPlaces.length })}
                  </p>
                )}
              </div>
            )}
            <p className="text-[11px] text-ink-muted">
              {t('contribute.cantFindPlaceHint')}
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink">
              {t('contribute.titleLabel')} <span className="text-status-danger">*</span>
            </label>
            <input
              type="text"
              value={postTitle}
              onChange={e => setPostTitle(e.target.value)}
              placeholder={t('contribute.titlePlaceholder')}
              className="w-full px-3.5 py-2.5 rounded-control border border-sage bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest"
              required
            />
          </div>

          {/* Metadata Row: Type, Date, Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                {t('contribute.typeLabel')}
              </label>
              <select
                value={contributionType}
                onChange={e => setContributionType(e.target.value as ContributionType)}
                className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <option value={ContributionType.DISCOVERY}>{t('contribute.typeDiscovery')}</option>
                <option value={ContributionType.GUIDE}>{t('contribute.typeGuide')}</option>
                <option value={ContributionType.EXPERIENCE}>{t('contribute.typeExperience')}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                {t('contribute.observedAtLabel')}
              </label>
              <input
                type="date"
                value={observedAt}
                onChange={e => setObservedAt(e.target.value)}
                className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                {t('contribute.accessTierLabel')}
              </label>
              <select
                value={accessTier}
                onChange={e => setAccessTier(e.target.value as AccessTier)}
                className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <option value={AccessTier.PUBLIC}>{t('contribute.accessPublic')}</option>
                <option value={AccessTier.VIP}>{t('contribute.accessVip')}</option>
              </select>
            </div>
          </div>

          {/* Claims (Nhận định kiểm chứng) */}
          <div className="space-y-3 pt-2 border-t border-sage/60">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                  {t('contribute.claimsLabel')}
                </label>
                <p className="text-[11px] text-ink-muted">
                  {t('contribute.claimsHint')}
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddClaim}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-control bg-forest/10 text-forest text-xs font-bold hover:bg-forest/20 transition-colors"
              >
                <PlusCircleIcon className="w-3.5 h-3.5" />
                <span>{t('contribute.addClaim')}</span>
              </button>
            </div>

            <div className="space-y-2">
              {claims.map((claim, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-ink-muted w-6 text-right">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={claim}
                    onChange={e => handleClaimChange(idx, e.target.value)}
                    placeholder={t('contribute.claimPlaceholder')}
                    className="flex-1 px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                  {claims.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveClaim(idx)}
                      className="p-1.5 text-ink-muted hover:text-status-danger rounded-control transition-colors"
                      title={t('contribute.removeClaimTitle')}
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Markdown Content & Live Preview */}
          <div className="space-y-2 pt-2 border-t border-sage/60">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                {t('contribute.contentLabel')} <span className="text-status-danger">*</span>
              </label>
              <div className="flex items-center gap-2">
                {draftSavedAt && (
                  <span className="text-[11px] text-ink-muted">
                    {t('contribute.draftSavedAt')} {draftSavedAt}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-control text-xs font-semibold transition-colors ${
                    showPreview
                      ? 'bg-forest text-white'
                      : 'bg-surface-canvas border border-sage text-ink hover:bg-sage/40'
                  }`}
                >
                  <EyeIcon className="w-3.5 h-3.5" />
                  <span>{showPreview ? t('contribute.editTab') : t('contribute.previewTab')}</span>
                </button>
              </div>
            </div>

            {showPreview ? (
              <div className="p-4 rounded-control border border-sage bg-surface-canvas min-h-[220px]">
                <div className="text-xs font-bold text-ink-muted mb-2 uppercase tracking-wider border-b border-sage/40 pb-1">
                  {t('contribute.previewTab')}:
                </div>
                {postContent ? (
                  <MarkdownView content={postContent} />
                ) : (
                  <p className="text-xs text-ink-muted italic">...</p>
                )}
              </div>
            ) : (
              <textarea
                value={postContent}
                onChange={e => setPostContent(e.target.value)}
                rows={10}
                placeholder={`## ${t('contribute.mainTitle')}\n\n### ${t('contribute.warningsSectionLabel')}`}
                className="w-full px-3.5 py-2.5 rounded-control border border-sage bg-white text-ink text-sm font-mono focus:outline-none focus:ring-2 focus:ring-forest"
                required
              />
            )}
          </div>

          {/* Sources & Evidence */}
          <div className="space-y-3 pt-2 border-t border-sage/60">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                  {t('post.sourcesTitle')}
                </label>
              </div>
              <button
                type="button"
                onClick={handleAddSource}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-control bg-forest/10 text-forest text-xs font-bold hover:bg-forest/20 transition-colors"
              >
                <PlusCircleIcon className="w-3.5 h-3.5" />
                <span>+</span>
              </button>
            </div>

            {sources.map((src, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={src.title}
                  onChange={e => handleSourceChange(idx, 'title', e.target.value)}
                  placeholder={t('contribute.sourceNamePlaceholder')}
                  className="px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={src.url}
                    onChange={e => handleSourceChange(idx, 'url', e.target.value)}
                    placeholder={t('contribute.sourceUrlPlaceholder')}
                    className="flex-1 px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                  {sources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSource(idx)}
                      className="p-1.5 text-ink-muted hover:text-status-danger rounded-control transition-colors"
                      title={t('contribute.removeSourceTitle')}
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Media Attachments */}
          <div className="space-y-2 pt-2 border-t border-sage/60">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink">
              {t('contribute.mediaLabel')}
            </label>
            <div className="p-4 rounded-control border-2 border-dashed border-sage bg-surface-canvas text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleMockFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-control bg-white border border-sage text-ink text-xs font-bold hover:bg-sage/20 transition-colors shadow-xs"
              >
                <PlusCircleIcon className="w-4 h-4 text-forest" />
                <span>{t('contribute.chooseFilesBtn')}</span>
              </label>
              <p className="text-[11px] text-ink-muted mt-2">
                {t('contribute.mediaHint')}
              </p>

              {mockFiles.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  {mockFiles.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-sage text-[11px] text-ink font-mono"
                    >
                      <span>{f.name}</span>
                      <span className="text-ink-muted">({f.size})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-sage flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-control inline-flex items-center justify-center px-6 py-2.5 rounded-control font-bold text-white bg-forest hover:bg-forest-hover transition-colors shadow-sm text-sm disabled:opacity-50"
            >
              {isSubmitting ? t('contribute.submittingLabel') : t('contribute.submitButton')}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Propose Candidate Place Form */}
      {activeTab === 'candidate' && (
        <form onSubmit={handleSubmitCandidatePlace} className="space-y-6 bg-surface-card p-6 sm:p-8 rounded-card border border-sage shadow-sm">
          {/* Invariant Banner */}
          <div className="p-3.5 rounded-control bg-status-pending-bg/60 border border-status-pending/30 flex items-start gap-2.5 text-xs text-ink-secondary">
            <ShieldCheckIcon className="w-4 h-4 text-status-pending shrink-0 mt-0.5" />
            <div>
              {t('contribute.ruleCandidateNotice')}
            </div>
          </div>

          {/* Place Name & Real-time Duplicate Detection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink">
              {t('contribute.candidateNameLabel')} <span className="text-status-danger">*</span>
            </label>
            <input
              type="text"
              value={placeName}
              onChange={e => {
                setPlaceName(e.target.value);
                setDismissDuplicate(false);
              }}
              placeholder={t('contribute.candidateNamePlaceholder')}
              className="w-full px-3.5 py-2.5 rounded-control border border-sage bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest"
              required
            />

            {/* Duplicate warning popup */}
            {duplicateWarning && (
              <div className="p-4 rounded-card border-2 border-waypoint bg-status-caution-bg text-ink space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-xs text-waypoint">
                  <AlertTriangleIcon className="w-4 h-4" />
                  <span>{t('contribute.duplicateWarningTitle')}</span>
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {t('contribute.duplicateWarningDesc')}{' '}
                  <strong className="text-ink">{duplicateWarning.name}</strong> ({duplicateWarning.displayCode} — {duplicateWarning.regionName}).
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      handleSwitchTab('existing');
                      setSelectedPlaceId(duplicateWarning.placeId);
                    }}
                    className="px-3 py-1.5 rounded-control bg-forest text-white text-xs font-bold hover:bg-forest-hover transition-colors shadow-xs"
                  >
                    {t('contribute.writeForExistingButton')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDismissDuplicate(true)}
                    className="px-3 py-1.5 rounded-control border border-sage bg-white text-xs text-ink font-medium hover:bg-surface-canvas transition-colors"
                  >
                    {t('contribute.confirmDistinctButton')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Region & Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                {t('contribute.candidateRegionLabel')} <span className="text-status-danger">*</span>
              </label>
              <select
                value={selectedRegion?.id || 'reg-catba'}
                onChange={e => {
                  const reg = REGION_PRESETS.find(r => r.id === e.target.value);
                  if (reg) setSelectedRegion(reg);
                }}
                className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest"
              >
                {REGION_PRESETS.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                {t('contribute.candidateCoordinatesLabel')} (Lat)
              </label>
              <input
                type="text"
                value={lat}
                onChange={e => setLat(e.target.value)}
                placeholder="20.7258"
                className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink font-mono text-xs focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                {t('contribute.candidateCoordinatesLabel')} (Lng)
              </label>
              <input
                type="text"
                value={lng}
                onChange={e => setLng(e.target.value)}
                placeholder="107.0543"
                className="w-full px-3 py-2 rounded-control border border-sage bg-white text-ink font-mono text-xs focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>
          </div>

          {/* Place Summary */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-ink">
              {t('contribute.candidateSummaryPlaceholder')} <span className="text-status-danger">*</span>
            </label>
            <input
              type="text"
              value={placeSummary}
              onChange={e => setPlaceSummary(e.target.value)}
              placeholder={t('contribute.candidateSummaryPlaceholder')}
              className="w-full px-3.5 py-2.5 rounded-control border border-sage bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest"
              required
            />
          </div>

          {/* Place Warnings & Safety */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                {t('contribute.warningsSectionLabel')}
              </label>
              <button
                type="button"
                onClick={() => setWarnings([...warnings, ''])}
                className="text-xs font-bold text-forest hover:underline"
              >
                + {t('contribute.addWarningBtn')}
              </button>
            </div>
            {warnings.map((w, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={w}
                  onChange={e => {
                    const updated = [...warnings];
                    updated[idx] = e.target.value;
                    setWarnings(updated);
                  }}
                  placeholder={t('contribute.warningPlaceholder')}
                  className="flex-1 px-3 py-2 rounded-control border border-sage bg-white text-ink text-xs focus:outline-none focus:ring-2 focus:ring-forest"
                />
                {warnings.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setWarnings(warnings.filter((_, i) => i !== idx))}
                    className="p-1.5 text-ink-muted hover:text-status-danger"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Attached Discovery Post Section */}
          <div className="space-y-4 pt-4 border-t border-sage">
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-ink uppercase tracking-wider">
                {t('contribute.candidatePostSectionTitle')}
              </h3>
              <p className="text-xs text-ink-secondary">
                {t('contribute.candidatePostSectionSubtitle')}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                {t('contribute.titleLabel')} <span className="text-status-danger">*</span>
              </label>
              <input
                type="text"
                value={candidatePostTitle}
                onChange={e => setCandidatePostTitle(e.target.value)}
                placeholder={t('contribute.titlePlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-control border border-sage bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink">
                {t('contribute.contentLabel')} <span className="text-status-danger">*</span>
              </label>
              <textarea
                value={candidatePostContent}
                onChange={e => setCandidatePostContent(e.target.value)}
                rows={6}
                placeholder={t('contribute.candidateDescPlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-control border border-sage bg-white text-ink text-sm font-mono focus:outline-none focus:ring-2 focus:ring-forest"
                required
              />
            </div>
          </div>

          {/* Submit Candidate Place */}
          <div className="pt-4 border-t border-sage flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-control inline-flex items-center justify-center px-6 py-2.5 rounded-control font-bold text-white bg-forest hover:bg-forest-hover transition-colors shadow-sm text-sm disabled:opacity-50"
            >
              {isSubmitting ? t('contribute.submittingLabel') : t('contribute.submitCandidateButton')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
