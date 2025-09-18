/**
 * Generic page skeleton loading component
 * Used as fallback for general page loading states
 */

interface PageSkeletonProps {
  showHeader?: boolean;
  showSidebar?: boolean;
}

export function PageSkeleton({ showHeader = true, showSidebar = false }: PageSkeletonProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
      {/* Header Skeleton */}
      {showHeader && (
        <div className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar Skeleton */}
        {showSidebar && (
          <div className="w-64 bg-[#1a1f2e] border-r border-slate-700 min-h-screen pt-4">
            <div className="space-y-2 px-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2">
                  <div className="w-4 h-4 bg-slate-600 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-slate-600 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Skeleton */}
        <div className={`flex-1 p-8 ${showSidebar ? 'max-w-none' : 'max-w-4xl mx-auto'}`}>
          {/* Page Title */}
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          {/* Content Cards */}
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="flex gap-3 mt-6">
                  <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}