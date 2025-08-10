import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth/auth-provider";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nextoria - Digital Marketing Dashboard",
  description: "Internal admin dashboard for digital marketing agency",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthProvider>
          <AuthGuard>
            <div className='flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20'>
              <Sidebar />
              <div className='flex-1 flex flex-col overflow-hidden'>
                <Header />
                <main className='flex-1 overflow-auto p-8 bg-gradient-to-b from-transparent to-white/10'>
                  <div className='max-w-none'>{children}</div>
                </main>
              </div>
            </div>
          </AuthGuard>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
