import DashboardLayout from '@/components/layout/DashboardLayout';
import { BarChart3 } from 'lucide-react';

export function ChartsSkeleton() {
  return (
    <DashboardLayout>
      {/* Page Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          <div>
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Charts Grid Skeleton */}
      <div className="space-y-12">
        {[...Array(4)].map((_, sectionIndex) => (
          <section key={sectionIndex} className="space-y-6">
            {/* Section Header Skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
              <div>
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1"></div>
                <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Charts Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(2)].map((_, chartIndex) => (
                <div
                  key={chartIndex}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  {/* Chart Header Skeleton */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  </div>

                  {/* Chart Content Skeleton */}
                  <div className="p-4">
                    <div className="h-64 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-slate-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </DashboardLayout>
  );
}