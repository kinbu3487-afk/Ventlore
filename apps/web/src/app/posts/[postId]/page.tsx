'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { PostReader } from '@/components/PostReader';
import { AsyncState, LoadingSpinner } from '@/components/AsyncState';
import { mockApiClient, PostDetailDTO } from '@ventlore/api-client';
import { useSession } from '@/components/SessionContext';
import { ArrowLeftIcon } from '@/components/Icons';

function PostDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const postId = params?.postId as string;
  const revisionId = searchParams?.get('revisionId') || undefined;
  const { persona } = useSession();

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
        const data = await mockApiClient.getPost(postId, revisionId);
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
  }, [postId, revisionId, persona]);

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div>
        {post?.placeId ? (
          <Link
            href={`/places/${post.placeId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-hover hover:underline transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Quay lại hồ sơ địa điểm: {post.place.name}</span>
          </Link>
        ) : (
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-hover hover:underline transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Quay lại danh mục Khám phá</span>
          </Link>
        )}
      </div>

      {/* Async State */}
      <AsyncState
        isLoading={isLoading}
        errorCode={notFound ? 404 : null}
        errorMessage="Không tìm thấy bài viết hoặc phiên bản yêu cầu. Vui lòng kiểm tra lại đường dẫn."
      >
        {post && <PostReader post={post} />}
      </AsyncState>
    </div>
  );
}

export default function PostDetailPage() {
  return (
    <AppShell>
      <Suspense fallback={<LoadingSpinner label="Đang tải phiên bản bài viết..." />}>
        <PostDetailContent />
      </Suspense>
    </AppShell>
  );
}
