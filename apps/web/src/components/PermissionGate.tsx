'use client';

import React, { ReactNode } from 'react';
import { useSession } from './SessionContext';

interface PermissionGateProps {
  capability: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({
  capability,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return null;
  }

  const hasPermission = session?.capabilities.includes(capability);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
