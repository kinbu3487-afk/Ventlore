import {
  RoleType,
  PlaceStatus,
  PostVisibility,
  AccessTier,
  VerificationStatus,
  TipRouteStatus,
  TreasuryFundingSource,
} from '@ventlore/domain';

export type DemoPersona = 'guest' | 'member' | 'author' | 'vip' | 'expert';

export interface WalletBindingDTO {
  walletBindingId: string;
  address: string;
  chainNamespace: string;
  isVerified: boolean;
}

export interface UserSessionDTO {
  userId: string;
  handle: string;
  displayName: string;
  avatarUrl?: string;
  roleAssignments: Array<{
    roleAssignmentId: string;
    role: RoleType;
    scope?: string;
    regionId?: string;
    validUntil?: string;
  }>;
  membership?: {
    membershipId: string;
    planCode: string;
    startsAt: string;
    endsAt: string;
    isActive: boolean;
  } | null;
  walletBinding?: WalletBindingDTO | null;
  capabilities: string[];
}

export interface PlaceSummaryDTO {
  placeId: string;
  displayCode: string;
  name: string;
  regionId?: string;
  regionName: string;
  status: PlaceStatus;
  canonicalPlaceId?: string | null;
  summary: string;
  warnings: string[];
  activities: string[];
  imageUrl?: string;
  coverImageUrl?: string;
  translations?: Record<string, LocalizedContentDTO>;
  isTranslated?: boolean;
  originalLocale?: string;
  postsCount: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PlacePostPreviewDTO {
  postId: string;
  displayCode: string;
  author: {
    userId: string;
    handle: string;
    displayName: string;
    avatarUrl?: string;
  };
  currentRevision: {
    revisionId: string;
    displayCode: string;
    title: string;
    observedAt: string;
    verificationStatus: VerificationStatus;
    accessTier: AccessTier;
  };
}

export interface LocalizedContentDTO {
  locale: string;
  name?: string;
  title?: string;
  summary?: string;
  description?: string;
  content?: string;
  warnings?: string[];
  activities?: string[];
  regionName?: string;
  scope?: string;
  inspectorNotes?: string;
  claims?: Array<{
    claimId: string;
    text: string;
    category?: string;
    status: string;
  }>;
}

export interface PlaceDetailDTO extends PlaceSummaryDTO {
  description: string;
  canonicalPlace?: {
    placeId: string;
    displayCode: string;
    name: string;
  } | null;
  posts: PlacePostPreviewDTO[];
  translations?: Record<string, LocalizedContentDTO>;
  isTranslated?: boolean;
  originalLocale?: string;
}

export interface ClaimDTO {
  claimId: string;
  text: string;
  category?: string;
  status?: string;
}

export interface SourceRefDTO {
  title: string;
  url?: string;
}

export interface TipRouteDTO {
  routeId: string;
  status: TipRouteStatus;
  beneficiaryAddress: string;
}

export interface RevisionItemSummaryDTO {
  revisionId: string;
  displayCode: string;
  versionNumber: number;
  title: string;
  createdAt: string;
  verificationStatus: VerificationStatus;
  accessTier: AccessTier;
}

export interface PostRevisionDTO {
  revisionId: string;
  displayCode: string;
  postId: string;
  parentRevisionId?: string | null;
  versionNumber: number;
  title: string;
  content: string;
  isContentRedacted?: boolean;
  redactedReason?: string;
  observedAt: string;
  accessTier: AccessTier;
  verificationStatus: VerificationStatus;
  checkedAt?: string | null;
  validUntil?: string | null;
  scope?: string | null;
  inspectorNotes?: string | null;
  claims: ClaimDTO[];
  sources: SourceRefDTO[];
  tipRoute?: TipRouteDTO | null;
  coverImageUrl?: string;
  translations?: Record<string, LocalizedContentDTO>;
  isTranslated?: boolean;
  originalLocale?: string;
}

export interface PostDetailDTO {
  postId: string;
  displayCode: string;
  placeId: string;
  place: {
    placeId: string;
    displayCode: string;
    name: string;
    regionName: string;
  };
  author: {
    userId: string;
    handle: string;
    displayName: string;
    avatarUrl?: string;
    bio?: string;
  };
  currentRevisionId: string;
  visibility: PostVisibility;
  revision: PostRevisionDTO;
  revisionsList: RevisionItemSummaryDTO[];
}

export interface UserProfileDTO {
  userId: string;
  handle: string;
  displayName: string;
  avatarUrl?: string;
  bio: string;
  isOriginalBio?: boolean;
  originalBioLanguage?: string;
  joinedAt: string;
  credentials: Array<{
    credentialId: string;
    title: string;
    badgeType: string;
    issuedAt: string;
    tokenId?: string;
  }>;
  publishedPosts: Array<{
    postId: string;
    displayCode: string;
    placeName: string;
    title: string;
    verificationStatus: VerificationStatus;
    observedAt: string;
    isUntranslated?: boolean;
  }>;
}

export interface VipPlanDTO {
  planCode: string;
  name: string;
  priceUsdCents: number;
  termMonths: number;
  benefits: string[];
  status: 'AVAILABLE' | 'NOT_CONFIGURED';
}

export interface TreasuryBalanceDTO {
  asset: string;
  availableAtomic: string;
  reservedAtomic: string;
  spentAtomic: string;
  availableFormatted: string;
  reservedFormatted: string;
  spentFormatted: string;
}

export interface TreasurySourceDTO {
  sourceType: TreasuryFundingSource;
  amountFormatted: string;
  asset: string;
  description: string;
}

export interface TreasuryDisbursementDTO {
  payoutId: string;
  displayCode: string;
  purpose: string;
  asset: string;
  amountFormatted: string;
  date: string;
  txHash?: string;
}

export interface TransparencySummaryDTO {
  year: number;
  balances: TreasuryBalanceDTO[];
  sources: TreasurySourceDTO[];
  recentDisbursements: TreasuryDisbursementDTO[];
}
