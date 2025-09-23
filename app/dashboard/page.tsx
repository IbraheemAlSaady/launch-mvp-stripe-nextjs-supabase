"use client";

// import { useWebSocket } from '@/contexts/WebSocketContext';
import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import { DashboardSkeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { AuthService } from '@/services/AuthService';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Settings,
  PlusCircle,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';


// Dashboard metrics data
const dashboardMetrics = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12.3%",
    icon: <Users className="h-6 w-6 text-primary" />,
    trend: "up"
  },
  {
    title: "Revenue",
    value: "$12.4k",
    change: "+8.2%",
    icon: <CreditCard className="h-6 w-6 text-primary" />,
    trend: "up"
  },
  {
    title: "Active Sessions",
    value: "432",
    change: "-3.1%",
    icon: <Activity className="h-6 w-6 text-primary" />,
    trend: "down"
  },
  {
    title: "Growth Rate",
    value: "18.2%",
    change: "+2.4%",
    icon: <TrendingUp className="h-6 w-6 text-primary" />,
    trend: "up"
  }
];

// Recent activity data
const recentActivity = [
  {
    id: 1,
    action: "New user signup",
    timestamp: "2 minutes ago",
    icon: <PlusCircle className="h-4 w-4" />
  },
  {
    id: 2,
    action: "Payment processed",
    timestamp: "15 minutes ago",
    icon: <CreditCard className="h-4 w-4" />
  },
  {
    id: 3,
    action: "Settings updated",
    timestamp: "1 hour ago",
    icon: <Settings className="h-4 w-4" />
  },
  {
    id: 4,
    action: "Session completed",
    timestamp: "2 hours ago",
    icon: <Clock className="h-4 w-4" />
  }
];

function DashboardContent() {
  const { user, session, isSubscriber } = useAuth();
  const { redirectIfNeeded, shouldShowPage, isLoading, authData } = useNavigation();
  const searchParams = useSearchParams();
  const hasClearedPaymentFlag = useRef(false);
  const hasRequestedPaymentRefresh = useRef(false);
  const subscription = authData?.subscription;
  
  // Track individual loading states for better UX
  const [isMetricsLoading, setIsMetricsLoading] = useState(true);
  const [isActivityLoading, setIsActivityLoading] = useState(true);

  // Add new states for dashboard functionality
  // const [repositories, setRepositories] = useState([]);
  // const [feedbackSources, setFeedbackSources] = useState([]);
  // const [recentFeedback, setRecentFeedback] = useState([]);
  // const [pendingPRs, setPendingPRs] = useState([]);

  // Centralized navigation logic
  useEffect(() => {
    redirectIfNeeded('/dashboard', { searchParams });
  }, [redirectIfNeeded, searchParams]);

  // Navigation handled by useNavigation hook - no need for separate subscription fetching

  // Check for payment success
  const isPaymentSuccess = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('payment_success');
  }, []);

  // Clean up URL after detecting payment success
  useEffect(() => {
    if (!isPaymentSuccess || typeof window === 'undefined') {
      return;
    }

    if (!user || hasRequestedPaymentRefresh.current) {
      return;
    }

    hasRequestedPaymentRefresh.current = true;

    const refreshAuthData = async () => {
      AuthService.invalidateCache(user.id);

      try {
        await AuthService.fetchAuthData(user, session ?? null);
      } catch (error) {
        console.error('Failed to refresh auth data after payment:', error);
      }
    };

    void refreshAuthData();
  }, [isPaymentSuccess, user, session]);

  useEffect(() => {
    if (!isPaymentSuccess || typeof window === 'undefined' || hasClearedPaymentFlag.current) {
      return;
    }

    if (!authData) {
      return;
    }

    if (!authData.isSubscriber && !authData.hasCompletedOnboarding) {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.delete('payment_success');
    window.history.replaceState({}, '', url.pathname + url.search);
    hasClearedPaymentFlag.current = true;
  }, [isPaymentSuccess, authData]);

  // Simulate loading states for dashboard data
  useEffect(() => {
    if (user && isSubscriber) {
      // Simulate metrics loading
      const metricsTimer = setTimeout(() => {
        setIsMetricsLoading(false);
      }, 1000);
      
      // Simulate activity loading
      const activityTimer = setTimeout(() => {
        setIsActivityLoading(false);
      }, 1500);
      
      return () => {
        clearTimeout(metricsTimer);
        clearTimeout(activityTimer);
      };
    }
  }, [user, isSubscriber]);

  const canShowDashboard = shouldShowPage('/dashboard', { searchParams }) || (isPaymentSuccess && !!user);

  // If user shouldn't be on dashboard, show loading or redirect
  if (!canShowDashboard) {
    if (isLoading) {
      // User has no subscription but we're still loading - redirect to onboarding
      if (user && !isSubscriber) {
        return <DashboardSkeleton />;
      }
      return <DashboardSkeleton />;
    }
    return null; // Will redirect via useEffect
  }


  return (
    <DashboardLayout>
      {/* Payment Success Banner */}
      {isPaymentSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-6">
          <div className="px-4 py-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Payment successful! Your subscription is being activated...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {subscription?.product_name ? (
            <>
              {subscription.product_name}
              {subscription.status === "trialing" && (
                <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">
                  (Trial)
                </span>
              )}
            </>
          ) : (
            "Free Plan"
          )}
        </p>
      </div>

      {/* Dashboard Content */}
      <div className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isMetricsLoading ? (
            // Show skeleton cards while loading
            [...Array(4)].map((_, index) => (
              <div key={`skeleton-${index}`} className="bg-white dark:bg-neutral-dark rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <div className="w-6 h-6 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
                  </div>
                  <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
                <div className="w-20 h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
                <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              </div>
            ))
          ) : (
            // Show actual metrics when loaded
            dashboardMetrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-neutral-dark rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-primary/10 dark:bg-primary-light/10 rounded-lg">
                    {metric.icon}
                  </div>
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                  {metric.value}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {metric.title}
                </p>
              </motion.div>
            ))
          )}
        </div>

        {/* Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-dark rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Analytics Overview
              </h3>
              <BarChart3 className="h-5 w-5 text-slate-400" />
            </div>
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-slate-400" />
              </div>
              <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No content created
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                You don&apos;t have any content yet. Start creating content.
              </p>
              <button className="bg-white dark:bg-slate-700 text-slate-900 dark:text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600">
                Add Content
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-neutral-dark rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {isActivityLoading ? (
                // Show skeleton items while loading
                [...Array(4)].map((_, index) => (
                  <div key={`activity-skeleton-${index}`} className="flex items-center space-x-3 text-sm">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <div className="w-4 h-4 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1"></div>
                      <div className="w-20 h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : (
                // Show actual activity when loaded
                recentActivity.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-3 text-sm"
                  >
                    <div className="p-2 bg-primary/10 dark:bg-primary-light/10 rounded-lg">
                      {activity.icon}
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">
                        {activity.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
