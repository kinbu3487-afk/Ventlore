import React from 'react';
import { PostDetailView } from '@/app/posts/[postId]/PostDetailView';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

export function generateStaticParams() {
  const postIds = [
    'PST-000001',
    'PST-000002',
    'PST-000003',
    'PST-000004',
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10',
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e20',
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30',
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e40',
  ];

  const params: Array<{ locale: string; postId: string }> = [];
  for (const loc of SUPPORTED_LOCALES) {
    for (const postId of postIds) {
      params.push({ locale: loc.code, postId });
    }
  }
  return params;
}

export default async function LocalizedPostDetailPage({
  params,
}: {
  params: Promise<{ locale: string; postId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <PostDetailView
      initialPostId={resolvedParams.postId}
    />
  );
}
