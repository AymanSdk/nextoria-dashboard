'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { SignIn } from '@/components/auth/sign-in';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AppContentProps {
  children: React.ReactNode;
}

export function AppContent({ children }: AppContentProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  // Show loading spinner while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  // Show sign-in page if user is not authenticated
  if (!isSignedIn) {
    return <SignIn />;
  }

  // User is authenticated, show the main app
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}