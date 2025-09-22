'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthService } from '@/services/AuthService';

export function useNavigation() {
  const { user, authData, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Use optimistic data for immediate navigation decisions
  const optimisticAuthData = useMemo(() => {
    if (authData) return authData;
    if (!user) return null;
    return AuthService.getOptimisticAuthData(user);
  }, [authData, user]);

  // Simple auth state check
  const getAuthState = () => {
    if (!user) return 'unauthenticated';
    
    const dataToUse = optimisticAuthData || authData;
    if (!dataToUse?.isSubscriber) return 'needs_onboarding';
    
    return 'authenticated';
  };
  
  // Only determine where to redirect for initial auth decisions
  const getRedirectDestination = () => {
    const authState = getAuthState();
    
    if (authState === 'unauthenticated') return '/login';
    if (authState === 'needs_onboarding') return '/onboarding';
    return '/dashboard'; // Default for authenticated users
  };

  const redirectIfNeeded = (currentPath: string) => {
    // Don't redirect if we're still loading auth state AND we have no optimistic data
    if (isAuthLoading && !optimisticAuthData) return;
    
    const authState = getAuthState();
    
    // Redirect unauthenticated users to login
    if (authState === 'unauthenticated' && currentPath !== '/login') {
      router.replace('/login');
    } 
    // Redirect users without subscription to onboarding
    else if (authState === 'needs_onboarding' && currentPath !== '/onboarding') {
      router.replace('/onboarding');
    }
    // Redirect authenticated users away from login page
    else if (authState === 'authenticated' && currentPath === '/login') {
      router.replace('/dashboard');
    }
  };

  const shouldShowPage = (currentPath: string) => {
    // Public routes are always accessible
    const publicRoutes = ['/login', '/', '/signup', '/verify-email', '/reset-password', '/update-password'];
    if (publicRoutes.includes(currentPath)) {
      return true;
    }
    
    // During loading, be permissive
    if (isAuthLoading && !optimisticAuthData) {
      return true;
    }
    
    const authState = getAuthState();
    
    // Simple access control
    if (authState === 'unauthenticated') {
      return publicRoutes.includes(currentPath);
    }
    
    if (authState === 'needs_onboarding') {
      return currentPath === '/onboarding';
    }
    
    // If authenticated with subscription, allow access to any protected page
    return true;
  };

  return {
    redirectIfNeeded,
    getDestination: getRedirectDestination,
    shouldShowPage,
    isLoading: isAuthLoading && !optimisticAuthData,
    hasOptimisticData: !!optimisticAuthData,
    authData: optimisticAuthData || authData
  };
}