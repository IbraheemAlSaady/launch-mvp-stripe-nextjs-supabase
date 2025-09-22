'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { AuthService, type AuthData } from '@/services/AuthService';
import { 
  Session, 
  User, 
  SupabaseClient, 
  AuthTokenResponse 
} from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  supabase: SupabaseClient;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{
    user: User | null;
    session: Session | null;
  }>;
  signOut: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<{ 
    data: { user: User | null } | null; 
    error: Error | null;
  }>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateEmail: (newEmail: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isSubscriber: boolean;
  hasCompletedOnboarding: boolean;
  authData: AuthData | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface SubscriptionPayload {
  new: {
    user_id: string;
    [key: string]: any;
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const router = useRouter();

  const loadAuthData = useCallback(async (currentUser: User | null, currentSession: Session | null) => {
    try {
      const data = await AuthService.fetchAuthData(currentUser, currentSession);
      setAuthData(data);
      return data;
    } catch (error) {
      console.error('Auth data load error:', error);
      setAuthData({
        user: currentUser,
        session: currentSession,
        isSubscriber: false,
        hasCompletedOnboarding: false,
        selectedPlan: null,
        subscription: null
      });
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !mounted) {
          setIsLoading(false);
          return;
        }

        // Update initial state
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        // Load auth data in parallel (non-blocking)
        if (currentUser) {
          loadAuthData(currentUser, session).finally(() => {
            if (mounted) setIsLoading(false);
          });
        } else {
          setAuthData(null);
          setIsLoading(false);
        }
        
        // Set up listener for future changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, newSession) => {
            if (!mounted) return;
            
            const newUser = newSession?.user ?? null;
            setSession(newSession);
            setUser(newUser);
            
            if (newUser) {
              // Non-blocking auth data load
              loadAuthData(newUser, newSession);
            } else {
              setAuthData(null);
              AuthService.clearCache();
            }
          }
        );

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();
    
    // Subscribe to AuthService updates
    const unsubscribe = AuthService.subscribe((data) => {
      if (mounted) {
        setAuthData(data);
      }
    });
    
    return unsubscribe;
  }, [loadAuthData]);

  const value = {
    user,
    session,
    isLoading,
    supabase,
    signInWithGoogle: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${baseUrl}/auth/callback`
        }
      });
    },
    signInWithEmail: async (email: string, password: string) => {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) throw authError;

      // Check if user was previously soft-deleted and reactivate via API
      try {
        await fetch('/api/user/account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'reactivate',
            user_id: authData.user?.id
          }),
        });
      } catch (error) {
        // Silently handle reactivation errors - user can still proceed
        console.warn('Account reactivation check failed:', error);
      }

      return authData;
    },
    signOut: async () => {
      try {
        // First cleanup all active connections/states
        window.dispatchEvent(new Event('cleanup-before-logout'));
        
        // Clear auth service cache
        AuthService.clearCache();
        
        // Wait a small amount of time for cleanup
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Then perform the actual signout
        await supabase.auth.signOut();
        
        // Use Next.js router for faster redirect
        router.replace('/login');
      } catch (error) {
        console.error('Error signing out:', error);
        // Fallback to window.location if router fails
        window.location.assign('/login');
      }
    },
    signUpWithEmail: async (email: string, password: string) => {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${baseUrl}/auth/callback`
        }
      });
      if (error) throw error;
      return { data, error };
    },
    updatePassword: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
    },
    updateEmail: async (newEmail: string) => {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });
      if (error) throw error;
    },
    resetPassword: async (email: string) => {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/update-password`
      });
      if (error) throw error;
    },
    // deleteAccount functionality moved to dedicated API endpoint for security
    isSubscriber: authData?.isSubscriber || false,
    hasCompletedOnboarding: authData?.hasCompletedOnboarding || false,
    authData,
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 