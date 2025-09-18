'use client';

import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/contexts/ProtectedRoute';
import TopBar from '@/components/TopBar';
import { Analytics } from "@vercel/analytics/react"
import { usePathname } from 'next/navigation';
// import { PostHogProvider } from '@/contexts/PostHogContext';
// import { PostHogErrorBoundary } from '@/components/PostHogErrorBoundary';

const geist = Geist({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={geist.className}>
        <Analytics mode="auto" />
        {/* <PostHogErrorBoundary>
          <PostHogProvider> */}
            <AuthProvider>   
                <ProtectedRoute>
                  <LayoutContent>{children}</LayoutContent>
                </ProtectedRoute>
            </AuthProvider>
          {/* </PostHogProvider>
        </PostHogErrorBoundary> */}
      </body>
    </html>
  );
}

// Separate component to use usePathname
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show TopBar on dashboard route as it has its own header
  const showTopBar = !pathname?.startsWith('/dashboard');
  
  return (
    <>
      {showTopBar && <TopBar />}
      <main>{children}</main>
    </>
  );
}
