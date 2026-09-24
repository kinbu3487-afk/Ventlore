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
    demoNotice: string;
    role: string;
    switchRole: string;
    notConfigured: string;
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
    backToExplore: string;
    guest: string;
    member: string;
    author: string;
    expert: string;
  };
  explore: {
    badge: string;
    independentAudit: string;
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    heroCtaSecondary: string;
    searchPlaceholder: string;
    searchButton: string;
    searching: string;
    clearSearch: string;
    clearFilters: string;
    regionFilter: string;
    activityFilter: string;
    allRegions: string;
    allActivities: string;
    nearMe: string;
    gpsSimulated: string;
    filterCount: string;
    placesFound: string;
    listView: string;
    mapView: string;
    mapHint: string;
    viewPlace: string;
    readFullWarning: string;
    closeWarning: string;
    communityBannerTag: string;
    communityBannerTitle: string;
    communityBannerDesc: string;
    proposePlaceButton: string;
    noPlacesFound: string;
    noPlacesHint: string;
    mergedNoticePrefix: string;
  };
  place: {
    mergedTitle: string;
    mergedNotice: string;
    mergedDescription: string;
    redirectToCanonical: string;
    warningsTitle: string;
    safetyDisclaimer: string;
    noAbsoluteSafety: string;
    suitableActivities: string;
    postsSectionTitle: string;
    emptyPosts: string;
    authorPrefix: string;
    observedAt: string;
    statusActive: string;
    statusMerged: string;
    statusCandidate: string;
    postsCount: string;
  };
  post: {
    verifiedTitle: string;
    unverifiedTitle: string;
    expiredTitle: string;
    inReviewTitle: string;
    needsChangesTitle: string;
    inconclusiveTitle: string;
    rejectedTitle: string;
    suspendedTitle: string;
    validUntil: string;
    verificationScope: string;
    unverifiedDesc: string;
    expiredDesc: string;
    inspectorNotes: string;
    checkedAt: string;
    independentVerificationDesc: string;
    contentInVietnameseOnly: string;
    claimsTitle: string;
    claimsAttachedToRevision: string;
    tipRouteTitle: string;
    tipSplitRatio: string;
    tipRouteActive: string;
    beneficiaryAddress: string;
    revisionHistory: string;
    immutableSnapshot: string;
    immutableExplanation: string;
    version: string;
    viewingNow: string;
    submittedAt: string;
    sourcesTitle: string;
    aboutAuthor: string;
    viewAuthorProfile: string;
    backToPlace: string;
    loadingPost: string;
    safetyDisclaimer: string;
  };
  vip: {
    badge: string;
    mainTitle: string;
    subtitle: string;
    activeStatusTitle: string;
    validUntilDate: string;
    recommended: string;
    term12Months: string;
    alreadyActiveNotice: string;
    signInToSubscribe: string;
    simulateActivate: string;
    rulesTitle: string;
    roleIndependence: string;
    roleIndependenceDesc: string;
    activeRenewal: string;
    activeRenewalDesc: string;
    donationSeparation: string;
    donationSeparationDesc: string;
    exclusiveContentTitle: string;
    exclusiveContentDesc: string;
    explorePlanButton: string;
    simulateSwitchButton: string;
    securityRedactionNotice: string;
  };
  transparency: {
    badge: string;
    fiscalYear: string;
    mainTitle: string;
    realTimeReconciliation: string;
    introDescription: string;
    asset: string;
    available: string;
    reserved: string;
    spent: string;
    sourcesTitle: string;
    disbursementsTitle: string;
    anonymizedNotice: string;
    voucherCode: string;
    purpose: string;
    amount: string;
    date: string;
    receipt: string;
    splitRuleNotice: string;
    privacyNotice: string;
  };
  auth: {
    title: string;
    subtitle: string;
    continueGoogle: string;
    orDemoRole: string;
    loginAsSelectedRole: string;
    signInRequired: string;
    signInRequiredDesc: string;
    signInButton: string;
  };
  errors: {
    notFoundTitle: string;
    notFoundMessage: string;
    serverError: string;
    retry: string;
  };
}
