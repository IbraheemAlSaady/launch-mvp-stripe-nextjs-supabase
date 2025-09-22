'use client';

import { User, Session } from '@supabase/supabase-js';

// Types for auth data
export interface AuthData {
  user: User | null;
  session: Session | null;
  isSubscriber: boolean;
  hasCompletedOnboarding: boolean;
  selectedPlan: string | null;
  subscription: any | null;
}

interface CachedAuthData extends AuthData {
  timestamp: number;
}

// Auth decision result
export interface AuthDecision {
  destination: '/login' | '/onboarding' | '/dashboard';
  shouldRedirect: boolean;
  isLoading: boolean;
}

class AuthServiceClass {
  private cache = new Map<string, CachedAuthData>();
  private readonly CACHE_DURATION = 30000; // 30 seconds
  private readonly OPTIMISTIC_CACHE_DURATION = 5000; // 5 seconds for optimistic updates
  
  // Listeners for auth state changes
  private listeners = new Set<(authData: AuthData) => void>();

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: (authData: AuthData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all subscribers of auth state changes
   */
  private notify(authData: AuthData): void {
    this.listeners.forEach(listener => listener(authData));
  }

  /**
   * Get cached auth data if valid
   */
  private getCachedData(userId: string): AuthData | null {
    const cached = this.cache.get(userId);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(userId);
      return null;
    }

    return {
      user: cached.user,
      session: cached.session,
      isSubscriber: cached.isSubscriber,
      hasCompletedOnboarding: cached.hasCompletedOnboarding,
      selectedPlan: cached.selectedPlan,
      subscription: cached.subscription
    };
  }

  /**
   * Set cached auth data
   */
  private setCachedData(userId: string, data: AuthData): void {
    this.cache.set(userId, {
      ...data,
      timestamp: Date.now()
    });
  }

  /**
   * Fetch all auth data in parallel for maximum performance
   */
  async fetchAuthData(user: User | null, session: Session | null): Promise<AuthData> {
    // Return immediately if no user
    if (!user) {
      const emptyData: AuthData = {
        user: null,
        session: null,
        isSubscriber: false,
        hasCompletedOnboarding: false,
        selectedPlan: null,
        subscription: null
      };
      return emptyData;
    }

    // Check cache first
    const cached = this.getCachedData(user.id);
    if (cached) {
      // Update user/session from current state but keep cached data
      const updatedData = { ...cached, user, session };
      this.notify(updatedData);
      return updatedData;
    }

    try {
      // Use single batch API call for better performance
      const response = await fetch(`/api/user/auth-data?user_id=${user.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Auth data fetch failed: ${response.status}`);
      }

      const result = await response.json();
      const data = result.data;

      const authData: AuthData = {
        user,
        session,
        isSubscriber: data.isSubscriber || false,
        hasCompletedOnboarding: data.hasCompletedOnboarding || false,
        selectedPlan: data.selectedPlanId || null,
        subscription: data.subscription || null
      };

      // Cache the result
      this.setCachedData(user.id, authData);
      
      // Notify subscribers
      this.notify(authData);
      
      return authData;
    } catch (error) {
      console.error('AuthService: Error fetching auth data:', error);
      
      // Return safe defaults on error
      const errorData: AuthData = {
        user,
        session,
        isSubscriber: false,
        hasCompletedOnboarding: false,
        selectedPlan: null,
        subscription: null
      };
      
      return errorData;
    }
  }

  /**
   * Get auth decision based on current state
   * This preserves the exact same redirect logic
   */
  getAuthDecision(authData: AuthData, currentPath: string): AuthDecision {
    // If no user, redirect to login
    if (!authData.user) {
      return {
        destination: '/login',
        shouldRedirect: currentPath !== '/login',
        isLoading: false
      };
    }

    // If user has no subscription, redirect to onboarding
    if (!authData.isSubscriber) {
      return {
        destination: '/onboarding',
        shouldRedirect: currentPath !== '/onboarding',
        isLoading: false
      };
    }

    // If user has subscription, redirect to dashboard
    return {
      destination: '/dashboard',
      shouldRedirect: currentPath !== '/dashboard',
      isLoading: false
    };
  }

  /**
   * Optimistically update cache (for immediate UI feedback)
   */
  optimisticUpdate(userId: string, updates: Partial<AuthData>): void {
    const cached = this.cache.get(userId);
    if (cached) {
      const updated = { ...cached, ...updates, timestamp: Date.now() };
      this.cache.set(userId, updated);
      
      // Notify with optimistic data
      this.notify({
        user: updated.user,
        session: updated.session,
        isSubscriber: updated.isSubscriber,
        hasCompletedOnboarding: updated.hasCompletedOnboarding,
        selectedPlan: updated.selectedPlan,
        subscription: updated.subscription
      });
    }
  }

  /**
   * Invalidate cache for user (force refresh)
   */
  invalidateCache(userId: string): void {
    this.cache.delete(userId);
  }

  /**
   * Clear all cache (on signout)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get optimistic auth data (from cache only, no API calls)
   * Used for immediate UI decisions
   */
  getOptimisticAuthData(user: User | null): AuthData | null {
    if (!user) return null;
    return this.getCachedData(user.id);
  }
}

// Export singleton instance
export const AuthService = new AuthServiceClass();