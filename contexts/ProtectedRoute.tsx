'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/hooks/useNavigation';
import { DashboardSkeleton } from '@/components/DashboardSkeleton';
import { ProfileSkeleton } from '@/components/ProfileSkeleton';
import { PageSkeleton } from '@/components/PageSkeleton';
import { ChartsSkeleton } from '@/components/ChartsSkeleton';
import DashboardLayout from '@/components/layout/DashboardLayout';

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
  const { user } = useAuth();
  const { shouldShowPage, redirectIfNeeded, isLoading, hasOptimisticData } = useNavigation();
  const pathname = usePathname();

  useEffect(() => {
    // Use the optimized navigation logic
    redirectIfNeeded(pathname);
  }, [pathname, redirectIfNeeded]);

  // Show loading state only when necessary (much faster)
  if (isLoading && !hasOptimisticData) {
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

  // Use optimized navigation logic to determine if page should show
  if (shouldShowPage(pathname)) {
    return <>{children}</>;
  }

  // If we shouldn't show the page, return null (redirect will happen)
  return null;
} 