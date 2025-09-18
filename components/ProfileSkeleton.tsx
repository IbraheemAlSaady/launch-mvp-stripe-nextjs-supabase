/**
 * Profile page skeleton loading component
 * Shows placeholder content while profile data loads
 */

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 max-w-4xl mx-auto">
      {/* Page Title Skeleton */}
      <div className="mb-8">
        <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
      </div>

      <div className="space-y-8">
        {/* Your Name Section Skeleton - Read Only */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-4">
            <div className="h-7 w-28 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="h-12 w-full bg-gray-100 dark:bg-gray-600 rounded-lg animate-pulse mb-1"></div>
              <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Subscription Section Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-4">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}