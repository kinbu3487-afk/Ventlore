import React from 'react';
import { PostDetailView } from './PostDetailView';

export function generateStaticParams() {
  return [
    { postId: 'PST-000001' },
    { postId: 'PST-000002' },
    { postId: 'PST-000003' },
    { postId: 'PST-000004' },
    { postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10' },
    { postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e20' },
    { postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30' },
    { postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e40' },
  ];
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const resolvedParams = await params;
  return <PostDetailView initialPostId={resolvedParams.postId} />;
}
