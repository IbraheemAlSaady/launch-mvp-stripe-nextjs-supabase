'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useTheme } from '@/hooks/useTheme';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Moon, 
  Sun, 
  Menu,
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Users,
  Settings as SettingsIcon,
  Home,
  BookOpen,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    category: "MENU",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      { icon: CreditCard, label: "Billing", href: "/billing" },
      { icon: BarChart3, label: "Charts", href: "/charts" },
      { icon: Users, label: "User Posts", href: "/posts" },
    ]
  },
  {
    category: "OPTIONS", 
    items: [
      { icon: SettingsIcon, label: "Settings", href: "/settings" },
      { icon: Home, label: "Homepage", href: "/" },
      { icon: BookOpen, label: "Documentation", href: "/docs" },
      { icon: HelpCircle, label: "Support", href: "/support" },
    ]
  }
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const { subscription } = useSubscription();
  const { isDark, toggleTheme, mounted } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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


  const isPro = subscription?.status === 'active' && subscription?.product_name !== 'Free';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#1a1f2e] border-b border-slate-200 dark:border-slate-700 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left side - Mobile menu only */}
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Right side - Theme toggle and user */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {mounted ? (
                isDark ? (
                  <Sun className="h-5 w-5 text-slate-600 dark:text-slate-400 transition-colors" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400 transition-colors" />
                )
              ) : (
                <div className="h-5 w-5 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
              )}
            </button>
            
            {/* Enhanced Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 px-1 py-1 rounded-full transition-colors"
              >
                <div className="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary dark:text-primary-light font-semibold text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              </button>
              
              {/* Enhanced Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl py-2 z-[60] border border-gray-200 dark:border-gray-700">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email}
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
                      <SettingsIcon className="w-4 h-4" />
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
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-[#1a1f2e] border-r border-gray-200 dark:border-slate-700 transition-all duration-300 z-40 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Sidebar toggle button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-slate-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3 w-3 text-gray-600 dark:text-slate-400" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-gray-600 dark:text-slate-400" />
          )}
        </button>

        <nav className="p-4 h-full flex flex-col">
          {/* Navigation Items */}
          <div className="flex-1 space-y-6">
            {menuItems.map((category) => (
              <div key={category.category}>
                {!sidebarCollapsed && (
                  <h3 className="text-xs font-medium text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-3">
                    {category.category}
                  </h3>
                )}
                <ul className="space-y-1">
                  {category.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          className={`flex items-center rounded-lg text-sm transition-colors ${
                            sidebarCollapsed 
                              ? 'justify-center px-2 py-3' 
                              : 'px-3 py-2'
                          } ${
                            isActive
                              ? 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white'
                              : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <item.icon className={`h-4 w-4 flex-shrink-0 ${sidebarCollapsed ? '' : ''}`} />
                          {!sidebarCollapsed && (
                            <span className="ml-3">{item.label}</span>
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Upgrade Section */}
          {!isPro && (
            <div className={`mt-auto ${sidebarCollapsed ? 'px-2 py-4 flex justify-center' : 'p-4'} bg-gray-100 dark:bg-slate-800 rounded-lg`}>
              {sidebarCollapsed ? (
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">↑</span>
                </div>
              ) : (
                <>
                  <h3 className="text-gray-900 dark:text-white font-medium mb-2">Upgrade to Pro</h3>
                  <p className="text-gray-600 dark:text-slate-400 text-sm mb-4">
                    Unlock all features and get unlimited access to our support team.
                  </p>
                  <button className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                    Upgrade
                  </button>
                </>
              )}
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 pt-16 ${
        sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
      }`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}