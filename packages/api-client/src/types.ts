import {
  RoleType,
  PlaceStatus,
  PostVisibility,
  AccessTier,
  VerificationStatus,
  TipRouteStatus,
  TreasuryFundingSource,
  ContributionType,
  ReviewDecisionOutcome,
  TaskType,
  TaskWorkStatus,
  PayableStatus,
} from '@ventlore/domain';

export type DemoPersona = 'guest' | 'member' | 'author' | 'vip' | 'expert' | 'admin';

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

export type PaymentMode = 'PROJECT' | 'POST_TIP' | 'MEMBERSHIP';

export interface PaymentIntentDTO {
  id: string; // paymentId or donationId
  mode: PaymentMode;
  targetTitle: string;
  targetId?: string;
  revisionId?: string;
  authorHandle?: string;
  authorDisplayName?: string;
  authorWalletAddress?: string;
  amountAtomic: string;
  amountFormatted: string;
  asset: string;
  authorAmountAtomic?: string;
  treasuryAmountAtomic?: string;
  authorAmountFormatted?: string;
  treasuryAmountFormatted?: string;
  status: 'PENDING' | 'SIMULATED_SUCCESS' | 'FAILED';
  txHashDemo?: string;
  payerUserId?: string;
  targetUserId?: string;
  timestamp: string;
  idempotencyKey?: string;
}

export interface ReportDTO {
  reportId: string;
  postId: string;
  postTitle: string;
  revisionId: string;
  claimId?: string;
  claimText?: string;
  reporterUserId: string;
  reporterHandle: string;
  reason: string;
  evidenceUrl?: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface ContributionItemDTO {
  postId: string;
  displayCode: string;
  placeId: string;
  placeName: string;
  title: string;
  contributionType: ContributionType;
  currentRevisionId: string;
  versionNumber: number;
  observedAt: string;
  createdAt: string;
  verificationStatus: VerificationStatus;
  visibility: PostVisibility;
  accessTier: AccessTier;
  feedbackNotes?: string;
  isCandidatePlace?: boolean;
}

export interface CreatePostInput {
  placeId: string;
  title: string;
  contributionType: ContributionType;
  observedAt: string;
  content: string;
  claims: string[];
  sources: Array<{ title: string; url?: string }>;
  accessTier?: AccessTier;
}

export interface ProposeCandidatePlaceInput {
  name: string;
  regionId: string;
  regionName: string;
  coordinates: { lat: number; lng: number };
  summary: string;
  description: string;
  warnings: string[];
  activities: string[];
  evidenceUrl?: string;
  postTitle: string;
  postContent: string;
  postClaims: string[];
}

export interface BenefitsDTO {
  userId: string;
  verifiedContentCount: number;
  sbt: {
    credentialId: string;
    title: string;
    status: 'NOT_ELIGIBLE' | 'OFFERED' | 'AWAITING_WALLET' | 'CLAIMED_DEMO' | 'ISSUED_DEMO';
    issuedAt?: string;
    tokenId?: string;
  };
  nft: {
    collectibleId: string;
    title: string;
    postTitle: string;
    status: 'NOT_ELIGIBLE' | 'OFFERED' | 'CLAIMED_DEMO' | 'ISSUED_DEMO';
    tokenId?: string;
    imageUrl?: string;
  };
  tipRoute: {
    routeId: string;
    status: TipRouteStatus;
    authorPercent: number;
    treasuryPercent: number;
    walletAddress?: string;
    consentGiven: boolean;
  };
}

export interface TaskSubmissionDTO {
  submissionId: string;
  taskId: string;
  submittedAt: string;
  expertUserId: string;
  expertHandle: string;
  findings: string;
  evidenceUrls: string[];
  claimsEvaluation: Array<{ claimId: string; verified: boolean; notes: string }>;
  versionNumber: number;
}

export interface ExpertTaskDTO {
  taskId: string;
  displayCode: string;
  type: TaskType;
  postId: string;
  postTitle: string;
  placeName: string;
  revisionId: string;
  scope: string;
  claims: ClaimDTO[];
  deadline: string;
  rewardAmountFormatted: string;
  rewardAsset: string;
  workStatus: TaskWorkStatus;
  acceptanceCriteria: string[];
  submissions: TaskSubmissionDTO[];
  payableStatus?: PayableStatus;
}

export interface ExpertPayableDTO {
  payableId: string;
  taskId: string;
  taskDisplayCode: string;
  postTitle: string;
  amountFormatted: string;
  asset: string;
  status: PayableStatus;
  acceptedAt: string;
  paidAt?: string;
}

export interface AdminReviewCaseDTO {
  caseId: string;
  postId: string;
  postTitle: string;
  revisionId: string;
  placeName: string;
  authorHandle: string;
  authorUserId: string;
  status: 'OPEN' | 'ASSIGNED' | 'EVALUATING' | 'DECIDED';
  assignedExpertHandle?: string;
  assignedExpertUserId?: string;
  taskId?: string;
  taskWorkStatus?: TaskWorkStatus;
  submissionCount: number;
  acceptanceStatus?: 'PENDING' | 'ACCEPTED_WORK' | 'REJECTED_WORK';
  contentDecision?: ReviewDecisionOutcome;
  decisionNotes?: string;
  payableId?: string;
  isAppHold?: boolean;
}

export interface AdminIntakeItemDTO {
  intakeId: string;
  type: 'PROPOSAL_NEW_PLACE' | 'NEW_POST' | 'USER_REPORT';
  entityId: string; // placeId, postId, or reportId
  title: string;
  submittedByHandle: string;
  submittedAt: string;
  regionName?: string;
  potentialDuplicates?: Array<{ placeId: string; name: string; similarity: string }>;
  summary: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

