'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { PostReader } from '@/components/PostReader';
import { AsyncState } from '@/components/AsyncState';
import { mockApiClient, PostDetailDTO } from '@ventlore/api-client';
import { useSession } from '@/components/SessionContext';
import { useI18n } from '@/lib/i18n';
import { ArrowLeftIcon } from '@/components/Icons';

interface PostDetailViewProps {
  initialPostId?: string;
  initialRevisionId?: string;
}

export function PostDetailView({ initialPostId, initialRevisionId }: PostDetailViewProps) {
  const params = useParams();
  const postId = initialPostId || (params?.postId as string);
  const { persona } = useSession();
  const { t, locale, getLocalizedPath } = useI18n();

  // Safely read revisionId from prop or window location without triggering Next.js searchParams suspense
  const [revisionId, setRevisionId] = useState<string | undefined>(initialRevisionId);

  useEffect(() => {
    if (!initialRevisionId && typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search).get('revisionId');
      if (q) {
        setRevisionId(q);
      }
    }
  }, [initialRevisionId]);

  const [post, setPost] = useState<PostDetailDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadPost() {
      if (!postId) return;
      setIsLoading(true);
      setNotFound(false);
      try {
        const data = await mockApiClient.getPost(postId, revisionId, locale);
        if (mounted) {
          if (!data) {
            setNotFound(true);
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
  }, [postId, revisionId, persona, locale]);

  return (
    <AppShell>
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

        {/* Async State */}
        <AsyncState
          isLoading={isLoading}
          errorCode={notFound ? 404 : null}
          errorMessage={t('errors.notFoundMessage')}
        >
          {post && <PostReader post={post} />}
        </AsyncState>
      </div>
    </AppShell>
  );
}
