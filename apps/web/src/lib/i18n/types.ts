export type SupportedLocale = 'vi' | 'en' | 'ja' | 'zh-Hans' | 'ko' | 'fr';

export const SUPPORTED_LOCALES: { code: SupportedLocale; name: string; nativeName: string }[] = [
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'zh-Hans', name: 'Simplified Chinese', nativeName: '中文（简体）' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
];

export const DEFAULT_LOCALE: SupportedLocale = 'vi';

export interface TranslationCatalog {
  common: {
    appName: string;
    tagline: string;
    loading: string;
    error: string;
    empty: string;
    back: string;
    close: string;
    save: string;
    cancel: string;
    retry: string;
    demoLabel: string;
    notConfigured: string;
    searchPlaceholder: string;
    allRegions: string;
    allActivities: string;
    offlineNotice: string;
    viewDetails: string;
    date: string;
    status: string;
  };
  nav: {
    explore: string;
    contribute: string;
    vip: string;
    transparency: string;
    login: string;
    logout: string;
    profile: string;
    role: string;
    switchRole: string;
    guest: string;
    member: string;
    author: string;
    expert: string;
  };
  explore: {
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    searchButton: string;
    searching: string;
    clearSearch: string;
    filterRegion: string;
    filterActivity: string;
    filterNearby: string;
    gpsDeniedNotice: string;
    resultsCount: string;
    viewList: string;
    viewMap: string;
    mapUnavailableTitle: string;
    mapUnavailableDesc: string;
    communityBannerTitle: string;
    communityBannerDesc: string;
    communityBannerCta: string;
    noResultsTitle: string;
    noResultsDesc: string;
    featuredDestinations: string;
    activitiesLabel: string;
    postsCount: string;
    updatedAt: string;
  };
  place: {
    explorePlaces: string;
    viewPlace: string;
    warningsTitle: string;
    practicalNotices: string;
    experiencesTitle: string;
    mergedNoticeTitle: string;
    mergedNoticeDesc: string;
    originalTrailLabel: string;
    shareExperienceCta: string;
    coordinatesLabel: string;
    accessInfoLabel: string;
    noPostsYet: string;
    safetyCommitment: string;
  };
  post: {
    readTime: string;
    observedAt: string;
    authorTitle: string;
    verifiedBadge: string;
    unverifiedBadge: string;
    expiredBadge: string;
    reviewingBadge: string;
    scopeLabel: string;
    validUntilLabel: string;
    revisionHistory: string;
    selectRevision: string;
    activeVersion: string;
    expiredVersion: string;
    tipAuthorTitle: string;
    tipAuthorDesc: string;
    tipAuthorButton: string;
    reportCorrectionButton: string;
    originalContentNotice: string;
    contentInVietnameseOnly: string;
    viewOriginal: string;
    claimsChecked: string;
    authorShareRatio: string;
    fundShareRatio: string;
  };
  vip: {
    title: string;
    subtitle: string;
    priceDisplay: string;
    annualTerm: string;
    buyButton: string;
    activeStatus: string;
    expiredStatus: string;
    benefitsTitle: string;
    benefit1: string;
    benefit2: string;
    benefit3: string;
    benefit4: string;
    gateTitle: string;
    gateDesc: string;
    gateCta: string;
  };
  transparency: {
    title: string;
    subtitle: string;
    availableBalance: string;
    committedFunds: string;
    disbursedFunds: string;
    incomeBreakdown: string;
    expenseBreakdown: string;
    publicReserve: string;
    platformDonations: string;
    vipMemberships: string;
    expertPayables: string;
    securityNotice: string;
    recentTransactions: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    googleButton: string;
    walletButton: string;
    disclaimer: string;
    returnNotice: string;
  };
  errors: {
    notFoundTitle: string;
    notFoundDesc: string;
    serverErrorTitle: string;
    serverErrorDesc: string;
    accessDeniedTitle: string;
    accessDeniedDesc: string;
    retryButton: string;
  };
}
