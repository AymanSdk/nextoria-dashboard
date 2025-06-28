'use client';

import { useUser } from '@clerk/nextjs';

type UserRole = 'Admin' | 'Marketer' | 'Designer';

export function useUserRole() {
  const { user } = useUser();
  
  const role = (user?.publicMetadata?.role as UserRole) || 'Marketer';
  
  const isAdmin = role === 'Admin';
  const isMarketer = role === 'Marketer';
  const isDesigner = role === 'Designer';
  
  const hasRole = (requiredRole: UserRole) => role === requiredRole;
  const hasAnyRole = (roles: UserRole[]) => roles.includes(role);
  
  return {
    role,
    isAdmin,
    isMarketer,
    isDesigner,
    hasRole,
    hasAnyRole,
    user,
  };
}