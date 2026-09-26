'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { PostReader } from '@/components/PostReader';
import { AsyncState } from '@/components/AsyncState';
import { mockApiClient, PostDetailDTO } from '@ventlore/api-client';
import { useSession } from '@/components/SessionContext';
import { useI18n } from '@/lib/i18n';
import { ArrowLeftIcon, AlertTriangleIcon } from '@/components/Icons';

interface PostDetailViewProps {
  initialPostId?: string;
  initialRevisionId?: string;
}

function PostDetailInner({ initialPostId, initialRevisionId }: PostDetailViewProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const postId = initialPostId || (params?.postId as string);
  const { persona } = useSession();
  const { t, locale, getLocalizedPath } = useI18n();

  // Read revisionId directly from query params reactively
  const queryRevisionId = searchParams?.get('revisionId');
  const activeRevisionId = queryRevisionId || initialRevisionId || undefined;

  const [post, setPost] = useState<PostDetailDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isRevisionNotFound, setIsRevisionNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadPost() {
      if (!postId) return;
      setIsLoading(true);
      setNotFound(false);
      setIsRevisionNotFound(false);
      try {
        const data = await mockApiClient.getPost(postId, activeRevisionId, locale);
        if (mounted) {
          if (!data) {
            if (activeRevisionId) {
              setIsRevisionNotFound(true);
            } else {
              setNotFound(true);
            }
          } else {
            setPost(data);
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
    loadPost();
    return () => {
      mounted = false;
    };
  }, [postId, activeRevisionId, persona, locale]);

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div>
        {post?.placeId ? (
          <Link
            href={getLocalizedPath(`/places/${post.placeId}`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-hover hover:underline transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>{t('post.backToPlace', { name: post.place.name })}</span>
          </Link>
        ) : (
          <Link
            href={getLocalizedPath('/explore')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-hover hover:underline transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>{t('nav.backToExplore')}</span>
          </Link>
        )}
      </div>

      {/* Invalid Revision Notice */}
      {isRevisionNotFound && (
        <div className="rounded-card border-2 border-amber-400 bg-amber-50 p-6 sm:p-8 text-ink space-y-3">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-base">
            <AlertTriangleIcon className="w-5 h-5 text-amber-700" />
            <span>Phiên bản yêu cầu không tồn tại</span>
          </div>
          <p className="text-xs text-amber-800">
            Mã phiên bản <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300 font-bold">{activeRevisionId}</code> không tìm thấy hoặc không thuộc bài viết này.
          </p>
          <div>
            <Link
              href={getLocalizedPath(`/posts/${postId}`)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-control font-bold text-xs text-white bg-forest hover:bg-forest-hover transition-colors shadow-xs"
            >
              <span>Xem phiên bản hiện hành của bài viết</span>
            </Link>
          </div>
        </div>
      )}

      {/* Async State */}
      {!isRevisionNotFound && (
        <AsyncState
          isLoading={isLoading}
          errorCode={notFound ? 404 : null}
          errorMessage={t('errors.notFoundMessage')}
        >
          {post && <PostReader post={post} />}
        </AsyncState>
      )}
    </div>
  );
}

export function PostDetailView(props: PostDetailViewProps) {
  return (
    <AppShell>
      <Suspense fallback={<div className="h-64 flex items-center justify-center text-ink-muted text-xs">Đang tải nội dung bài viết...</div>}>
        <PostDetailInner {...props} />
      </Suspense>
    </AppShell>
  );
}
