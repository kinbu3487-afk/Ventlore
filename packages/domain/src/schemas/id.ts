import { z } from 'zod';

export const uuidSchema = z
  .string()
  .uuid({ message: 'Phải là chuỗi UUID chuẩn (RFC 9562 / UUIDv7)' });

export const displayCodeSchema = z
  .string()
  .regex(/^[A-Z]{3}-[0-9]{6,}$/, { message: 'Display code phải có định dạng PREFIX-000001 (tối thiểu 6 chữ số)' });

export const prefixMap = {
  userId: 'USR',
  walletBindingId: 'WLT',
  roleAssignmentId: 'ROL',
  membershipId: 'MEM',
  paymentId: 'VPM',
  placeId: 'PLC',
  postId: 'PST',
  revisionId: 'REV',
  claimId: 'CLM',
  reviewCaseId: 'RVC',
  taskId: 'TSK',
  reservationId: 'RSV',
  submissionId: 'SUB',
  evidenceId: 'EVD',
  mediaId: 'MED',
  decisionId: 'DEC',
  acceptanceId: 'ACP',
  payableId: 'PAY',
  payoutId: 'OUT',
  routeId: 'RTE',
  donationId: 'DON',
  credentialId: 'CRD',
  collectibleId: 'COL',
  reportId: 'RPT',
  fundingId: 'FND',
  refundId: 'RFD',
  actionId: 'ACT',
  attemptId: 'ATT',
  outboxId: 'OBX',
  auditEventId: 'AUD',
  requestTraceId: 'TRC',
  deploymentId: 'DPL',
  regionId: 'RGN',
  reasonId: 'RSN',
} as const;

export type IDField = keyof typeof prefixMap;
