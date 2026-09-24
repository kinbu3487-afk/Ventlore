'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { AsyncState } from '@/components/AsyncState';
import { VerificationBadge } from '@/components/VerificationPanel';
import { mockApiClient, UserProfileDTO } from '@ventlore/api-client';
import { useI18n } from '@/lib/i18n';
import {
  UserIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
} from '@/components/Icons';

interface UserProfileViewProps {
  initialHandle?: string;
}

export function UserProfileView({ initialHandle }: UserProfileViewProps) {
  const params = useParams();
  const handle = initialHandle || (params?.handle as string);
  const { t, formatDate, getLocalizedPath } = useI18n();

  const [profile, setProfile] = useState<UserProfileDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      if (!handle) return;
      setIsLoading(true);
      setNotFound(false);
      try {
        const data = await mockApiClient.getUserProfile(handle);
        if (mounted) {
          if (!data) {
            setNotFound(true);
          } else {
            setProfile(data);
          }
          setIsLoading(false);
        }
      } catch {
        if (mounted) {
          setNotFound(true);
          setIsLoading(false);
        }
      }
    }
    loadProfile();
    return () => {
      mounted = false;
    };
  }, [handle]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <Link
            href={getLocalizedPath('/explore')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-hover hover:underline transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>{t('nav.backToExplore')}</span>
          </Link>
        </div>

        <AsyncState
          isLoading={isLoading}
          errorCode={notFound ? 404 : null}
          errorMessage={t('errors.notFoundMessage')}
        >
          {profile && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="rounded-card border border-sage bg-surface-card p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="w-20 h-20 rounded-full bg-forest text-white flex items-center justify-center font-bold text-2xl shrink-0 overflow-hidden shadow-sm">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-10 h-10" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold text-ink">{profile.displayName}</h1>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-sage/60 text-ink-secondary">
                        @{profile.handle}
                      </span>
                    </div>

                    <p className="text-sm text-ink-secondary max-w-2xl leading-relaxed">
                      {profile.bio}
                    </p>

                    <div className="pt-2 flex items-center gap-4 text-xs text-ink-muted">
                      <span>Tham gia: {formatDate(profile.joinedAt)}</span>
                      <span>•</span>
                      <span>Mã định danh: <code className="font-mono">{profile.userId.slice(0, 18)}...</code></span>
                    </div>
                  </div>
                </div>

                {/* SBT Credentials / Badges */}
                {profile.credentials.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-sage/60">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink-secondary mb-3 flex items-center gap-1.5">
                      <SparklesIcon className="w-4 h-4 text-forest" />
                      <span>Chứng chỉ Soulbound Token (SBT) Onchain</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {profile.credentials.map((cred) => (
                        <div
                          key={cred.credentialId}
                          className="p-3.5 rounded-control border border-status-success/30 bg-status-success-bg/40 flex items-start gap-3"
                        >
                          <ShieldCheckIcon className="w-5 h-5 text-status-success shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-xs text-ink">{cred.title}</div>
                            <div className="text-[11px] text-ink-secondary mt-0.5">
                              Cấp ngày: {formatDate(cred.issuedAt)}
                            </div>
                            {cred.tokenId && (
                              <div className="text-[10px] font-mono text-forest mt-1">
                                Token ID: {cred.tokenId} (ERC-5192)
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Published Posts List */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-ink">
                  Các bài viết & Đóng góp thực địa ({profile.publishedPosts.length})
                </h2>

                <div className="space-y-3">
                  {profile.publishedPosts.map((post) => (
                    <Link
                      key={post.postId}
                      href={getLocalizedPath(`/posts/${post.postId}`)}
                      className="block p-4 sm:p-5 rounded-card border border-sage bg-surface-card hover:border-forest transition-all"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                        <div>
                          <span className="text-xs font-mono text-ink-muted mr-2">
                            {post.displayCode}
                          </span>
                          <span className="text-xs font-semibold text-forest">
                            {post.placeName}
                          </span>
                          <h3 className="font-bold text-base text-ink mt-0.5 hover:text-forest transition-colors">
                            {post.title}
                          </h3>
                        </div>
                        <VerificationBadge status={post.verificationStatus} size="sm" />
                      </div>

                      <div className="flex items-center justify-between text-xs text-ink-muted pt-2 border-t border-sage/40">
                        <span>
                          {t('place.observedAt')}: {formatDate(post.observedAt)}
                        </span>
                        <span className="text-forest font-semibold flex items-center gap-1">
                          Đọc bài viết <ChevronRightIcon className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </AsyncState>
      </div>
    </AppShell>
  );
}
