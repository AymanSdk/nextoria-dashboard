'use client';

import { useUser } from '@clerk/nextjs';
import { ReactNode } from 'react';

type UserRole = 'Admin' | 'Marketer' | 'Designer';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { user } = useUser();
  
  if (!user) {
    return fallback || null;
  }

  // Get user role from Clerk metadata (you'll set this in Clerk dashboard)
  const userRole = user.publicMetadata?.role as UserRole || 'Marketer';
  
  if (!allowedRoles.includes(userRole)) {
    return fallback || (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}