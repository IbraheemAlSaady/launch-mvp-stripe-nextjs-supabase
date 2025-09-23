'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthService, type AuthData } from '@/services/AuthService';

type AuthState = 'unauthenticated' | 'needs_onboarding' | 'authenticated' | 'loading';

interface RedirectOptions {
  searchParams?: URLSearchParams | ReadonlyURLSearchParams;
}

export function useNavigation(): {
  redirectIfNeeded: (currentPath: string, options?: RedirectOptions) => void;
  getDestination: () => string;
  shouldShowPage: (currentPath: string, options?: RedirectOptions) => boolean;
  isLoading: boolean;
  hasOptimisticData: boolean;
  authData: AuthData | null;
} {
  const { user, authData, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Use optimistic data for immediate navigation decisions
  const optimisticAuthData = useMemo(() => {
    if (authData) return authData;
    if (!user) return null;
    return AuthService.getOptimisticAuthData(user);
  }, [authData, user]);

  // Simple auth state check with conservative decisions
  const getAuthState = (): AuthState => {
    if (!user) {
      return 'unauthenticated';
    }

    const dataToUse = optimisticAuthData || authData;

    if (!dataToUse) {
      return 'loading';
    }

    const { isSubscriber, hasCompletedOnboarding } = dataToUse;

    if (!isSubscriber && !hasCompletedOnboarding) {
      return 'needs_onboarding';
    }

    return 'authenticated';
  };
  
  // Only determine where to redirect for initial auth decisions
  const getRedirectDestination = (): string => {
    const authState = getAuthState();

    if (authState === 'unauthenticated') {
      return '/login';
    }

    if (authState === 'needs_onboarding') {
      return '/onboarding';
    }

    return '/dashboard';
  };

  const redirectIfNeeded = (currentPath: string, options?: RedirectOptions): void => {
    if (isAuthLoading && !optimisticAuthData && !user) {
      return;
    }

    const authState = getAuthState();
    const publicRoutes = ['/login', '/', '/signup', '/verify-email', '/reset-password', '/update-password', '/auth-loading'];
    const hasPendingPayment = options?.searchParams?.has('payment_success') ?? false;

    if (authState === 'loading') {
      return;
    }

    // Simple handling for login page - redirect to loading page for smooth UX
    if (user && currentPath === '/login') {
      if (authState === 'authenticated') {
        router.replace('/dashboard');
      } else if (authState === 'needs_onboarding') {
        if (!hasPendingPayment) {
          router.replace('/onboarding');
        }
      } else {
        router.replace('/auth-loading');
      }
      return;
    }

    if (authState === 'needs_onboarding' && currentPath !== '/onboarding') {
      if (hasPendingPayment) {
        return;
      }
      router.replace('/onboarding');
    }
    // Redirect authenticated users away from login page to dashboard
    else if (authState === 'authenticated' && currentPath === '/login') {
      router.replace('/dashboard');
    }
    // Only redirect unauthenticated users to login when they try to access protected routes
    else if (authState === 'unauthenticated' && !publicRoutes.includes(currentPath)) {
      router.replace('/login');
    }
  };

  const shouldShowPage = (currentPath: string, options?: RedirectOptions): boolean => {
    // Public routes are always accessible
    const publicRoutes = ['/login', '/', '/signup', '/verify-email', '/reset-password', '/update-password', '/auth-loading'];
    if (publicRoutes.includes(currentPath)) {
      return true;
    }

    const authState = getAuthState();
    const hasPendingPayment = options?.searchParams?.has('payment_success') ?? false;

    if (authState === 'loading') {
      return true;
    }

    // Simple access control
    if (authState === 'unauthenticated') {
      return publicRoutes.includes(currentPath);
    }
    
    if (authState === 'needs_onboarding') {
      if (currentPath === '/onboarding') {
        return true;
      }

      return hasPendingPayment && currentPath === '/dashboard';
    }

    // If authenticated with subscription, allow access to any protected page
    return true;
  };

  return {
    redirectIfNeeded,
    getDestination: getRedirectDestination,
    shouldShowPage,
    isLoading: getAuthState() === 'loading',
    hasOptimisticData: !!optimisticAuthData,
    authData: (optimisticAuthData || authData) ?? null
  };
}
