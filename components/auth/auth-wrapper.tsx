'use client';

import { useAuth } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { SignIn } from '@/components/auth/sign-in';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();

  // Show loading spinner while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Show sign-in page if user is not authenticated
  if (!isSignedIn) {
    return <SignIn />;
  }

  // User is authenticated, show the main app
  return <>{children}</>;
}