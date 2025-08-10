"use client";

import { useAuth } from "@/lib/auth/auth-provider";
import { hasPermission } from "@/lib/rbac";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, AlertTriangle } from "lucide-react";

interface RoleGuardProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ resource, action, children, fallback }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const hasAccess = hasPermission(user.role, resource, action);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <div className='flex items-center justify-center mb-4'>
              <div className='p-3 rounded-full bg-red-100'>
                <Shield className='h-8 w-8 text-red-600' />
              </div>
            </div>
            <CardTitle className='text-xl font-bold text-red-600'>
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to {action} {resource}.
            </CardDescription>
          </CardHeader>
          <CardContent className='text-center'>
            <div className='flex items-center justify-center gap-2 text-sm text-gray-600'>
              <AlertTriangle className='h-4 w-4' />
              <span>
                Current role: <strong>{user.role}</strong>
              </span>
            </div>
            <p className='text-xs text-gray-500 mt-2'>
              Contact your administrator if you need access to this resource.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

// Wrapper for protecting action buttons/components
interface ActionGuardProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ActionGuard({
  resource,
  action,
  children,
  fallback = null,
}: ActionGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  const hasAccess = hasPermission(user.role, resource, action);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
