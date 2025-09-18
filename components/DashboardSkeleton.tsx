interface DashboardSkeletonProps {
  showMetrics?: boolean;
  showChart?: boolean;
  showActivity?: boolean;
}

export function DashboardSkeleton({ 
  showMetrics = true, 
  showChart = true, 
  showActivity = true 
}: DashboardSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Dashboard Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
      </div>

      {/* Dashboard Content */}
      <div className="space-y-6">
        {/* Metrics Grid Skeleton */}
        {showMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-neutral-dark rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                  <div className="w-12 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section Skeleton */}
          {showChart && (
            <div className="lg:col-span-2 bg-white dark:bg-neutral-dark rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              </div>
              <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4 animate-pulse"></div>
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity Skeleton */}
          {showActivity && (
            <div className="bg-white dark:bg-neutral-dark rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-6"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1"></div>
                      <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Specific skeleton variants for different contexts
export function MetricCardSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-dark rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
        <div className="w-12 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
      </div>
      <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
      <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
    </div>
  );
}

export function ActivityItemSkeleton() {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
      <div className="flex-1">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1"></div>
        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
}