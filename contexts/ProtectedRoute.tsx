'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {usePathname } from 'next/navigation';
import { DashboardSkeleton } from '@/components/DashboardSkeleton';
import { ProfileSkeleton } from '@/components/ProfileSkeleton';
import { PageSkeleton } from '@/components/PageSkeleton';
import { ChartsSkeleton } from '@/components/ChartsSkeleton';
import DashboardLayout from '@/components/layout/DashboardLayout';
// import { useRouter, usePathname } from 'next/navigation';

// List of public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',  // Add landing page
  '/login', 
  '/signup', 
  '/verify-email', 
  '/reset-password', 
  '/update-password'
];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  // const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user && !PUBLIC_ROUTES.includes(pathname)) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      window.location.assign(redirectUrl);
    }
  }, [user, isLoading, pathname]);

  // Show loading state only if actually loading
  if (isLoading) {
    // Show appropriate skeleton for each route
    if (pathname === '/dashboard') {
      return (
        <DashboardLayout>
          <DashboardSkeleton />
        </DashboardLayout>
      );
    }
    
    if (pathname === '/charts') {
      return <ChartsSkeleton />;
    }
    
    // For other protected routes, show appropriate skeleton loading
    if (!PUBLIC_ROUTES.includes(pathname)) {
      // Show profile skeleton for profile pages
      if (pathname?.startsWith('/profile')) {
        return <ProfileSkeleton />;
      }
      
      // For other routes, show page skeleton
      return <PageSkeleton showHeader={true} />;
    }
    
    // For public routes, show minimal loading
    return <PageSkeleton showHeader={false} />;
  }

  // Only render children if we're on a public route or user is authenticated
  if (PUBLIC_ROUTES.includes(pathname) || user) {
    return <>{children}</>;
  }

  return null;
} 