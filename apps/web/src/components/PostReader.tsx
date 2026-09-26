'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PostDetailDTO } from '@ventlore/api-client';
import { TipRouteStatus, VerificationStatus } from '@ventlore/domain';
import { useI18n } from '../lib/i18n';
import { usePayment } from './PaymentContext';
import { VerificationPanel } from './VerificationPanel';
import { RevisionSelector } from './RevisionSelector';
import { AccessGate } from './AccessGate';
import { MarkdownView } from './MarkdownView';
import { ReportDialog } from './ReportDialog';
import {
  MapPinIcon,
  ClockIcon,
  UserIcon,
  AlertTriangleIcon,
  WalletIcon,
  CheckIcon,
  GlobeIcon,
  SparklesIcon,
} from './Icons';

interface PostReaderProps {
  post: PostDetailDTO;
}

export function PostReader({ post }: PostReaderProps) {
  const { t, formatDate, locale, getLocalizedPath } = useI18n();
  const { openPayment } = usePayment();
  const { revision, author, place, revisionsList } = post;

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<{ id?: string; text?: string } | undefined>(undefined);

  const isUntranslated = revision.isTranslated === false && locale !== 'vi';
  const coverImage = revision.coverImageUrl || '/destinations/hero-coastal.svg';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left / Main Column: Content, Author, Verification (lg:col-span-8) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Post Title & Location Breadcrumb */}
        <div className="rounded-card border border-sage bg-surface-card p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted mb-3">
            <Link
              href={getLocalizedPath(`/places/${place.placeId}`)}
              className="inline-flex items-center gap-1 text-forest hover:underline font-semibold"
            >
              <MapPinIcon className="w-3.5 h-3.5 text-forest" />
              <span>{place.name}</span>
            </Link>
            <span>•</span>
            <span className="font-mono">{place.regionName}</span>
            <span>•</span>
            <span className="font-mono bg-sage/60 px-2 py-0.5 rounded text-ink-secondary">
              {post.displayCode}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight mb-4 tracking-tight">
            {revision.title}
          </h1>

          {/* Fallback Notice when translation is not available in non-vi locale */}
          {isUntranslated && (
            <div className="mb-4 p-3 rounded-control bg-surface-canvas border border-sage/80 text-xs text-ink-secondary flex items-start gap-2.5">
              <GlobeIcon className="w-4 h-4 text-forest shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold text-ink">
                  {t('post.contentInVietnameseOnly')}
                </span>
                <p className="text-[11px] text-ink-muted">
                  {locale === 'en'
                    ? 'Official translations are progressively curated by local trail communities.'
                    : locale === 'ja'
                    ? '公式翻訳は現地のトレイルコミュニティによって順次更新されています。'
                    : locale === 'zh-Hans'
                    ? '官方翻译正由本地向导社群逐步完善更新中。'
                    : locale === 'ko'
                    ? '공식 번역은 현지 트레일 커뮤니티를 통해 순차적으로 업데이트되고 있습니다.'
                    : locale === 'fr'
                    ? 'Les traductions officielles sont progressivement enrichies par les communautés locales.'
                    : 'Bản dịch cho ngôn ngữ hiện tại đang được cộng đồng thực địa cập nhật.'}
                </p>
              </div>
            </div>
          )}

          {/* Author Byline */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-sage/60 text-xs">
            <Link
              href={getLocalizedPath(`/people/${author.handle}`)}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                {author.avatarUrl ? (
                  <img
                    src={author.avatarUrl}
                    alt={author.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="font-semibold text-ink group-hover:text-forest transition-colors">
                  {author.displayName}
                </div>
                <div className="text-ink-muted">@{author.handle}</div>
              </div>
            </Link>

            <div className="flex items-center gap-1.5 text-ink-muted">
              <ClockIcon className="w-3.5 h-3.5" />
              <span>
                {t('place.observedAt')}: <strong className="text-ink">{formatDate(revision.observedAt)}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Verification Details Panel (C06) */}
        <VerificationPanel
          status={revision.verificationStatus}
          scope={revision.scope}
          checkedAt={revision.checkedAt}
          validUntil={revision.validUntil}
          inspectorNotes={revision.inspectorNotes}
          revisionDisplayCode={revision.displayCode}
        />

        {/* Post Body & Content */}
        <div className="rounded-card border border-sage bg-surface-card p-6 sm:p-8 shadow-sm">
          {/* Cover image if available */}
          {revision.coverImageUrl && (
            <div className="mb-6 rounded-control overflow-hidden aspect-[16/9] max-h-80 bg-sage/20">
              <img
                src={coverImage}
                alt={revision.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {revision.isContentRedacted ? (
            /* Access Gate if content is VIP and user is not entitled */
            <AccessGate
              reason="VIP_REQUIRED"
              returnTo={`/posts/${post.postId}?revisionId=${revision.revisionId}`}
            />
          ) : (
            <div className="prose max-w-[70ch] mx-auto lg:mx-0 text-ink leading-relaxed">
              <MarkdownView content={revision.content} />
            </div>
          )}

          {/* Mandatory Disclaimers: Never "absolute safety guarantee" */}
          <div className="mt-8 p-4 rounded-control bg-surface-canvas border border-sage text-xs text-ink-secondary space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-ink">
              <AlertTriangleIcon className="w-4 h-4 text-amber-600" />
              <span>{t('place.warningsTitle')}</span>
            </div>
            <p>
              {t('post.safetyDisclaimer')}
            </p>
          </div>
        </div>

        {/* Claims Checklist (Nhận định thực địa gắn với revision) */}
        {revision.claims.length > 0 && (
          <div className="rounded-card border border-sage bg-surface-card p-6 shadow-sm">
            <h3 className="font-bold text-base text-ink mb-3 flex flex-wrap items-center justify-between gap-2">
              <span>
                {revision.verificationStatus === VerificationStatus.VERIFIED
                  ? t('post.verifiedClaimsTitle', { count: revision.claims.length })
                  : revision.verificationStatus === VerificationStatus.EXPIRED
                  ? t('post.expiredClaimsTitle', { count: revision.claims.length })
                  : t('post.unverifiedClaimsTitle', { count: revision.claims.length })}
              </span>
              <span className="text-xs font-normal text-ink-muted">
                {revision.verificationStatus === VerificationStatus.VERIFIED
                  ? t('post.claimsAttachedToRevision')
                  : revision.verificationStatus === VerificationStatus.EXPIRED
                  ? t('post.expiredClaimsSubtitle')
                  : t('post.unverifiedClaimsSubtitle')}
              </span>
            </h3>

            <div className="space-y-2">
              {revision.claims.map((claim) => (
                <div
                  key={claim.claimId}
                  className="p-3 rounded-control border border-sage/60 bg-surface-canvas text-xs flex items-start gap-2.5"
                >
                  {revision.verificationStatus === VerificationStatus.VERIFIED ? (
                    <CheckIcon className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  ) : revision.verificationStatus === VerificationStatus.EXPIRED ? (
                    <ClockIcon className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-ink-muted/50 shrink-0 mt-1.5 ml-1 mr-1" />
                  )}
                  <div className="flex-1 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-medium text-ink">{claim.text}</span>
                      {claim.category && (
                        <span className="ml-2 font-mono text-[10px] text-ink-muted bg-white px-1.5 py-0.5 rounded border border-sage/40">
                          {claim.category}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClaim({ id: claim.claimId, text: claim.text });
                        setIsReportOpen(true);
                      }}
                      className="text-[10px] text-ink-muted hover:text-red-700 underline shrink-0 transition-colors"
                      title="Phản ánh sai lệch cho khẳng định này"
                    >
                      Báo sai
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tip & Report Actions Section */}
        <div className="rounded-card border border-forest/30 bg-forest/5 p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center shrink-0 shadow-xs">
                <WalletIcon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-ink">
                  {t('post.tipRouteTitle')} (Tỷ lệ 80/20)
                </h4>
                <p className="text-xs text-ink-secondary">
                  80% gửi tới tác giả <strong>{author.displayName}</strong>, 20% vào quỹ bảo tồn cộng đồng.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const isEligible =
                  revision.tipRoute?.status === TipRouteStatus.ACTIVE &&
                  revision.verificationStatus === VerificationStatus.VERIFIED;
                openPayment('POST_TIP', {
                  targetTitle: revision.title,
                  targetId: post.postId,
                  revisionId: revision.revisionId,
                  authorHandle: author.handle,
                  authorDisplayName: author.displayName,
                  authorWalletAddress: revision.tipRoute?.beneficiaryAddress || '0x88F...42C1',
                  isEligibleForTip: isEligible,
                  ineligibleReason: !isEligible
                    ? revision.verificationStatus === VerificationStatus.EXPIRED
                      ? 'Phiên bản này đã hết hạn kiểm định. Lộ trình tip tạm dừng để đảm bảo tính an toàn dữ liệu.'
                      : 'Phiên bản này chưa được thẩm định đạt chuẩn hoặc chưa hoàn tất đăng ký route on-chain.'
                    : undefined,
                });
              }}
              className="min-h-control inline-flex items-center gap-2 px-4 py-2 rounded-control font-bold text-xs text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs"
            >
              <WalletIcon className="w-4 h-4 text-amber" />
              <span>Ủng Hộ Tác Giả (Tip)</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-forest/20 text-xs">
            <span className="text-ink-secondary text-[11px]">
              Phát hiện thông tin sai lệch hoặc rủi ro an toàn thực địa?
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedClaim(undefined);
                setIsReportOpen(true);
              }}
              className="inline-flex items-center gap-1.5 text-red-700 hover:text-red-800 font-semibold hover:underline"
            >
              <AlertTriangleIcon className="w-3.5 h-3.5" />
              <span>Báo Sai / Phản Ánh Rủi Ro</span>
            </button>
          </div>
        </div>

        <ReportDialog
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          postId={post.postId}
          postTitle={revision.title}
          revisionId={revision.revisionId}
          claimId={selectedClaim?.id}
          claimText={selectedClaim?.text}
        />
      </div>

      {/* Right Column: Revision Selector & Meta (lg:col-span-4) */}
      <div className="lg:col-span-4 space-y-6">
        {/* Revision Selector (C07) */}
        <RevisionSelector
          postId={post.postId}
          currentRevisionId={revision.revisionId}
          revisions={revisionsList}
        />

        {/* Sources and References */}
        {revision.sources.length > 0 && (
          <div className="rounded-card border border-sage bg-surface-card p-4 shadow-sm text-xs">
            <h4 className="font-bold text-ink mb-2">{t('post.sourcesTitle')}</h4>
            <ul className="space-y-1.5 text-ink-secondary list-disc list-inside">
              {revision.sources.map((src, idx) => (
                <li key={idx} className="line-clamp-2">
                  {src.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Author Short Bio */}
        <div className="rounded-card border border-sage bg-surface-card p-5 shadow-sm text-xs space-y-3">
          <h4 className="font-bold text-ink">{t('post.aboutAuthor')}</h4>
          <p className="text-ink-secondary leading-relaxed">{author.bio}</p>
          <Link
            href={getLocalizedPath(`/people/${author.handle}`)}
            className="inline-block text-forest hover:text-forest-hover font-semibold underline"
          >
            {t('post.viewAuthorProfile')} →
          </Link>
        </div>

        {/* Collapsible Technical ID Details (Business UUIDv7 & Display Codes) */}
        <details className="rounded-card border border-sage/60 bg-surface-canvas p-4 text-xs text-ink-secondary">
          <summary className="font-bold text-ink cursor-pointer hover:text-forest transition-colors select-none">
            {locale === 'en'
              ? 'Technical Version Details (IDs)'
              : locale === 'ja'
              ? '技術仕様および識別子情報'
              : locale === 'zh-Hans'
              ? '技术标识与版本规范'
              : locale === 'ko'
              ? '기술 사양 및 식별자 정보'
              : locale === 'fr'
              ? 'Spécifications techniques de la révision'
              : 'Thông tin kỹ thuật phiên bản (ID)'}
          </summary>
          <div className="mt-3 space-y-2 font-mono text-[11px] border-t border-sage/40 pt-2.5">
            <div>
              <span className="text-ink-muted">Post ID (UUIDv7):</span>
              <div className="text-ink break-all font-semibold">{post.postId}</div>
            </div>
            <div>
              <span className="text-ink-muted">Display Code:</span>
              <div className="text-ink font-semibold">{post.displayCode}</div>
            </div>
            <div>
              <span className="text-ink-muted">Revision ID (UUIDv7):</span>
              <div className="text-ink break-all font-semibold">{revision.revisionId}</div>
            </div>
            <div>
              <span className="text-ink-muted">Revision Display Code:</span>
              <div className="text-ink font-semibold">{revision.displayCode}</div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
