import { RoleType, PlaceStatus, PostVisibility, AccessTier, VerificationStatus } from '@ventlore/domain';

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
  capabilities: string[];
}

export interface PlaceSummaryDTO {
  placeId: string;
  displayCode: string;
  name: string;
  regionId?: string;
  status: PlaceStatus;
  canonicalPlaceId?: string | null;
  summary: string;
  warnings: string[];
}

export interface PostDetailDTO {
  postId: string;
  displayCode: string;
  placeId: string;
  authorUserId: string;
  currentRevisionId: string;
  visibility: PostVisibility;
  revision: {
    revisionId: string;
    displayCode: string;
    postId: string;
    parentRevisionId?: string | null;
    versionNumber: number;
    title: string;
    content: string;
    observedAt: string;
    accessTier: AccessTier;
    verificationStatus: VerificationStatus;
    checkedAt?: string | null;
    validUntil?: string | null;
    claims: Array<{
      claimId: string;
      text: string;
      category?: string;
    }>;
  };
}
