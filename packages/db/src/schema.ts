import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  numeric,
  uniqueIndex,
  index
} from 'drizzle-orm/pg-core';

// 1. users
export const users = pgTable('users', {
  userId: uuid('user_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  provider: varchar('provider', { length: 64 }).notNull(),
  providerSubject: varchar('provider_subject', { length: 255 }).notNull(),
  handle: varchar('handle', { length: 64 }).notNull().unique(),
  displayName: varchar('display_name', { length: 128 }).notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, (t) => [
  uniqueIndex('users_provider_idx').on(t.provider, t.providerSubject)
]);

// 2. wallet_bindings
export const walletBindings = pgTable('wallet_bindings', {
  walletBindingId: uuid('wallet_binding_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  userId: uuid('user_id').references(() => users.userId).notNull(),
  chainNamespace: varchar('chain_namespace', { length: 64 }).notNull(),
  walletAddress: varchar('wallet_address', { length: 64 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  verifiedAt: timestamp('verified_at', { withTimezone: true }).defaultNow().notNull()
});

// 3. role_assignments
export const roleAssignments = pgTable('role_assignments', {
  roleAssignmentId: uuid('role_assignment_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  userId: uuid('user_id').references(() => users.userId).notNull(),
  role: varchar('role', { length: 32 }).notNull(),
  scope: varchar('scope', { length: 64 }),
  regionId: uuid('region_id'),
  validUntil: timestamp('valid_until', { withTimezone: true }),
  isActive: boolean('is_active').default(true).notNull()
});

// 4. memberships
export const memberships = pgTable('memberships', {
  membershipId: uuid('membership_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  userId: uuid('user_id').references(() => users.userId).notNull(),
  planCode: varchar('plan_code', { length: 32 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}, (t) => [
  uniqueIndex('memberships_user_plan_idx').on(t.userId, t.planCode)
]);

// 5. vip_payments
export const vipPayments = pgTable('vip_payments', {
  paymentId: uuid('payment_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  membershipId: uuid('membership_id').references(() => memberships.membershipId).notNull(),
  payerUserId: uuid('payer_user_id').references(() => users.userId).notNull(),
  amountCents: integer('amount_cents').notNull(),
  status: varchar('status', { length: 32 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 6. places
export const places = pgTable('places', {
  placeId: uuid('place_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  canonicalPlaceId: uuid('canonical_place_id'),
  sourceRevisionId: uuid('source_revision_id'),
  name: varchar('name', { length: 255 }).notNull(),
  status: varchar('status', { length: 32 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 7. posts
export const posts = pgTable('posts', {
  postId: uuid('post_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  postKey: varchar('post_key', { length: 66 }).unique(),
  placeId: uuid('place_id').references(() => places.placeId).notNull(),
  authorUserId: uuid('author_user_id').references(() => users.userId).notNull(),
  contributionType: varchar('contribution_type', { length: 32 }).notNull(),
  visibility: varchar('visibility', { length: 32 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 8. revisions
export const revisions = pgTable('revisions', {
  revisionId: uuid('revision_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  revisionKey: varchar('revision_key', { length: 66 }).unique(),
  postId: uuid('post_id').references(() => posts.postId).notNull(),
  parentRevisionId: uuid('parent_revision_id'),
  versionNumber: integer('version_number').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  contentHash: varchar('content_hash', { length: 66 }).notNull(),
  accessTier: varchar('access_tier', { length: 32 }).notNull(),
  verificationStatus: varchar('verification_status', { length: 32 }).notNull(),
  observedAt: timestamp('observed_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 9. claims
export const claims = pgTable('claims', {
  claimId: uuid('claim_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  claimKey: varchar('claim_key', { length: 66 }).unique(),
  revisionId: uuid('revision_id').references(() => revisions.revisionId).notNull(),
  text: text('text').notNull(),
  category: varchar('category', { length: 64 })
});

// 10. review_cases
export const reviewCases = pgTable('review_cases', {
  reviewCaseId: uuid('review_case_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  revisionId: uuid('revision_id').references(() => revisions.revisionId).notNull(),
  previousCaseId: uuid('previous_case_id'),
  status: varchar('status', { length: 32 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 11. tasks
export const tasks = pgTable('tasks', {
  taskId: uuid('task_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  reviewCaseId: uuid('review_case_id').references(() => reviewCases.reviewCaseId).notNull(),
  assigneeUserId: uuid('assignee_user_id').references(() => users.userId).notNull(),
  taskType: varchar('task_type', { length: 64 }).notNull(),
  workStatus: varchar('work_status', { length: 32 }).notNull(),
  deadline: timestamp('deadline', { withTimezone: true }).notNull()
});

// 12. reservations
export const reservations = pgTable('reservations', {
  reservationId: uuid('reservation_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  taskId: uuid('task_id').references(() => tasks.taskId).notNull().unique(),
  asset: varchar('asset', { length: 64 }).notNull(),
  amount: numeric('amount').notNull()
});

// 13. submissions
export const submissions = pgTable('submissions', {
  submissionId: uuid('submission_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  taskId: uuid('task_id').references(() => tasks.taskId).notNull(),
  submittedByUserId: uuid('submitted_by_user_id').references(() => users.userId).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 14. evidence
export const evidence = pgTable('evidence', {
  evidenceId: uuid('evidence_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  ownerUserId: uuid('owner_user_id').references(() => users.userId).notNull(),
  mediaId: uuid('media_id'),
  checksum: varchar('checksum', { length: 64 }).notNull()
});

// 15. media
export const media = pgTable('media', {
  mediaId: uuid('media_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  ownerUserId: uuid('owner_user_id').references(() => users.userId).notNull(),
  storageKey: varchar('storage_key', { length: 255 }).notNull(),
  checksum: varchar('checksum', { length: 64 }).notNull()
});

// 16. decisions
export const decisions = pgTable('decisions', {
  decisionId: uuid('decision_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  reviewCaseId: uuid('review_case_id').references(() => reviewCases.reviewCaseId).notNull().unique(),
  revisionId: uuid('revision_id').references(() => revisions.revisionId).notNull(),
  reviewerUserId: uuid('reviewer_user_id').references(() => users.userId).notNull(),
  outcome: varchar('outcome', { length: 32 }).notNull(),
  validUntil: timestamp('valid_until', { withTimezone: true })
});

// 17. acceptances
export const acceptances = pgTable('acceptances', {
  acceptanceId: uuid('acceptance_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  taskId: uuid('task_id').references(() => tasks.taskId).notNull().unique(),
  submissionId: uuid('submission_id').references(() => submissions.submissionId).notNull(),
  acceptedByUserId: uuid('accepted_by_user_id').references(() => users.userId).notNull()
});

// 18. payables
export const payables = pgTable('payables', {
  payableId: uuid('payable_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  payableKey: varchar('payable_key', { length: 66 }).unique(),
  acceptanceId: uuid('acceptance_id').references(() => acceptances.acceptanceId).notNull().unique(),
  payeeUserId: uuid('payee_user_id').references(() => users.userId).notNull(),
  asset: varchar('asset', { length: 64 }).notNull(),
  amount: numeric('amount').notNull(),
  status: varchar('status', { length: 32 }).notNull()
});

// 19. payouts
export const payouts = pgTable('payouts', {
  payoutId: uuid('payout_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  payableId: uuid('payable_id').references(() => payables.payableId).notNull(),
  actionId: uuid('action_id')
});

// 20. tip_routes
export const tipRoutes = pgTable('tip_routes', {
  routeId: uuid('route_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  routeKey: varchar('route_key', { length: 66 }).unique(),
  revisionId: uuid('revision_id').references(() => revisions.revisionId).notNull(),
  decisionId: uuid('decision_id').references(() => decisions.decisionId).notNull(),
  beneficiaryBindingId: uuid('beneficiary_binding_id').references(() => walletBindings.walletBindingId).notNull(),
  status: varchar('status', { length: 32 }).notNull(),
  validUntil: timestamp('valid_until', { withTimezone: true }).notNull()
});

// 21. donations
export const donations = pgTable('donations', {
  donationId: uuid('donation_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  requestKey: varchar('request_key', { length: 66 }).unique(),
  donorUserId: uuid('donor_user_id').references(() => users.userId),
  donorAddress: varchar('donor_address', { length: 64 }).notNull(),
  kind: varchar('kind', { length: 32 }).notNull(),
  routeId: uuid('route_id').references(() => tipRoutes.routeId),
  amountAtomic: varchar('amount_atomic', { length: 78 }).notNull(),
  asset: varchar('asset', { length: 64 }).notNull()
});

// 22. credentials
export const credentials = pgTable('credentials', {
  credentialId: uuid('credential_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  credentialKey: varchar('credential_key', { length: 66 }).unique(),
  subjectUserId: uuid('subject_user_id').references(() => users.userId).notNull(),
  type: varchar('type', { length: 64 }).notNull(),
  status: varchar('status', { length: 32 }).notNull()
});

// 23. author_collectibles
export const authorCollectibles = pgTable('author_collectibles', {
  collectibleId: uuid('collectible_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  collectibleKey: varchar('collectible_key', { length: 66 }).unique(),
  postId: uuid('post_id').references(() => posts.postId).notNull().unique(),
  originalAuthorUserId: uuid('original_author_user_id').references(() => users.userId).notNull(),
  sourceRevisionId: uuid('source_revision_id').references(() => revisions.revisionId).notNull(),
  sourceDecisionId: uuid('source_decision_id').references(() => decisions.decisionId).notNull()
});

// 24. reports
export const reports = pgTable('reports', {
  reportId: uuid('report_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  reporterUserId: uuid('reporter_user_id').references(() => users.userId).notNull(),
  revisionId: uuid('revision_id').references(() => revisions.revisionId).notNull(),
  claimId: uuid('claim_id').references(() => claims.claimId),
  reason: text('reason').notNull()
});

// 25. fundings
export const fundings = pgTable('fundings', {
  fundingId: uuid('funding_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  sourceWallet: varchar('source_wallet', { length: 64 }).notNull(),
  asset: varchar('asset', { length: 64 }).notNull(),
  amount: numeric('amount').notNull()
});

// 26. refunds
export const refunds = pgTable('refunds', {
  refundId: uuid('refund_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  sourceType: varchar('source_type', { length: 64 }).notNull(),
  amount: numeric('amount').notNull()
});

// 27. chain_actions
export const chainActions = pgTable('chain_actions', {
  actionId: uuid('action_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  purpose: varchar('purpose', { length: 64 }).notNull(),
  deploymentId: uuid('deployment_id').notNull(),
  expectedCaller: varchar('expected_caller', { length: 64 }).notNull()
});

// 28. transaction_attempts
export const transactionAttempts = pgTable('transaction_attempts', {
  attemptId: uuid('attempt_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  actionId: uuid('action_id').references(() => chainActions.actionId).notNull(),
  chainId: integer('chain_id').notNull(),
  txHash: varchar('tx_hash', { length: 66 }),
  status: varchar('status', { length: 32 }).notNull()
});

// 29. outbox_events
export const outboxEvents = pgTable('outbox_events', {
  outboxId: uuid('outbox_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  eventType: varchar('event_type', { length: 128 }).notNull(),
  aggregateType: varchar('aggregate_type', { length: 64 }).notNull(),
  aggregateId: uuid('aggregate_id').notNull(),
  payload: text('payload').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 30. audit_events
export const auditEvents = pgTable('audit_events', {
  auditEventId: uuid('audit_event_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  actorUserId: uuid('actor_user_id').references(() => users.userId),
  action: varchar('action', { length: 128 }).notNull(),
  entityType: varchar('entity_type', { length: 64 }).notNull(),
  entityId: uuid('entity_id').notNull(),
  requestTraceId: uuid('request_trace_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 31. request_traces
export const requestTraces = pgTable('request_traces', {
  requestTraceId: uuid('request_trace_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  actorUserId: uuid('actor_user_id'),
  idempotencyKey: uuid('idempotency_key'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 32. deployments
export const deployments = pgTable('deployments', {
  deploymentId: uuid('deployment_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  chainId: integer('chain_id').notNull(),
  registryAddress: varchar('registry_address', { length: 64 }),
  paymentsAddress: varchar('payments_address', { length: 64 }),
  tokenAddress: varchar('token_address', { length: 64 })
});

// 33. regions
export const regions = pgTable('regions', {
  regionId: uuid('region_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  regionKey: varchar('region_key', { length: 66 }).unique(),
  name: varchar('name', { length: 128 }).notNull(),
  code: varchar('code', { length: 32 }).notNull().unique()
});

// 34. reasons
export const reasons = pgTable('reasons', {
  reasonId: uuid('reason_id').primaryKey(),
  displayCode: varchar('display_code', { length: 32 }).notNull().unique(),
  reasonKey: varchar('reason_key', { length: 66 }).unique(),
  publicSummary: text('public_summary').notNull()
});
