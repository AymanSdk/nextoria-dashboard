import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { AppContent } from '@/components/layout/app-content';
import { Toaster } from '@/components/ui/sonner';

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
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'bg-[#894DEF] hover:bg-[#894DEF]/90',
          card: 'shadow-none',
          headerTitle: 'hidden',
          headerSubtitle: 'hidden',
          socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
          formFieldInput: 'border-gray-200 focus:border-[#894DEF] focus:ring-[#894DEF]',
          footerActionLink: 'text-[#894DEF] hover:text-[#894DEF]/80',
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <AppContent>{children}</AppContent>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}