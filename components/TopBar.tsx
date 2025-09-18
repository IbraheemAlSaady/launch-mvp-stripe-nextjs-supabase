'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSubscription } from '@/hooks/useSubscription';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { LayoutDashboard, Settings, LogOut, Moon, Sun } from 'lucide-react';
// import { supabase } from '@/utils/supabase';

// TopBar component handles user profile display and navigation
export default function TopBar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { subscription, isLoading: isLoadingSubscription } = useSubscription();
  const { isInTrial } = useTrialStatus();

  // State for tracking logout process
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Theme management state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme on component mount
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    checkTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Theme toggle function
  const toggleTheme = () => {
    const html = document.documentElement;
    const newTheme = html.classList.contains('dark') ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      html.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      html.classList.remove('dark');
      localStorage.theme = 'light';
    }
    
    setIsDarkMode(newTheme === 'dark');
  };

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle user logout with error handling and loading state
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      setIsDropdownOpen(false);
      setIsLoggingOut(false);
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-full bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        <Link href={user ? "/dashboard" : "/"} className="text-md sm:text-lg font-medium text-text dark:text-text-dark flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">🎬</span>
          <span className="font-sans">NextTemp</span>
        </Link>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              {/* Show login button for unauthenticated users */}
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-full transition-colors shadow-subtle hover:shadow-hover"
              >
                Sign in
              </Link>
            </>
          ) : (
            // Show subscription and profile for authenticated users
            <>
              {!isLoadingSubscription && (!isInTrial) && (
                !subscription || 
                subscription.status === 'canceled' || 
                (subscription.cancel_at_period_end && new Date(subscription.current_period_end) > new Date())
              ) && (
                <button
                  onClick={() => router.push('/profile')}
                  className="hidden sm:block px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-full text-sm font-medium transition-colors shadow-subtle hover:shadow-hover"
                >
                  View Subscription
                </button>
              )}

              {!isLoadingSubscription && (
                subscription || isInTrial
              ) && pathname !== '/dashboard' && (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="hidden sm:block px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-full text-sm font-medium transition-colors shadow-subtle hover:shadow-hover"
                >
                  {isInTrial ? "Start Free Trial" : "Start Building"}
                </button>
              )}

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-neutral-darker/10 dark:hover:bg-neutral-darker/50 transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              
              <div className="relative" ref={dropdownRef}>
                {/* Avatar button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-neutral-darker/10 dark:hover:bg-neutral-darker/50 px-1 py-1 rounded-full transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary dark:text-primary-light font-semibold text-sm">
                    {user.email?.[0].toUpperCase()}
                  </div>
                </button>
                
                {/* Enhanced Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl py-2 z-[60] border border-gray-200 dark:border-gray-700">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      {/* Dashboard */}
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          router.push('/dashboard');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </button>

                      {/* Settings */}
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          router.push('/profile');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                    </div>

                    {/* Separator */}
                    <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>

                    {/* Log out */}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      <LogOut className="w-4 h-4" />
                      {isLoggingOut ? 'Signing Out...' : 'Log out'}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 