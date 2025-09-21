'use client';

import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/contexts/ProtectedRoute';
import TopBar from '@/components/TopBar';
import { Analytics } from "@vercel/analytics/react"
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/contexts/ThemeContext';
// import { PostHogProvider } from '@/contexts/PostHogContext';
// import { PostHogErrorBoundary } from '@/components/PostHogErrorBoundary';

const geist = Geist({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={geist.className}>
        <ThemeProvider>
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
        </ThemeProvider>
      </body>
    </html>
  );
}

// Separate component to use usePathname
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show TopBar on dashboard-related routes as they have their own layout
  const dashboardRoutes = ['/dashboard', '/charts', '/billing', '/posts', '/settings'];
  const showTopBar = !dashboardRoutes.some(route => pathname?.startsWith(route));
  
  return (
    <>
      {showTopBar && <TopBar />}
      <main>{children}</main>
    </>
  );
}
