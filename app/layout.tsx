import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/sonner';
import { AuthWrapper } from '@/components/auth/auth-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nextoria - Digital Marketing Dashboard',
  description: 'Internal admin dashboard for digital marketing agency',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <AuthWrapper>
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-auto p-6">
                  {children}
                </main>
              </div>
            </div>
          </AuthWrapper>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}