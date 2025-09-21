import { ReactElement } from 'react';
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): ReactElement {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-100 dark:bg-slate-800',
        className
      )}
      {...props}
    />
  );
}

function PricingCardSkeleton(): ReactElement {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <Skeleton className="h-6 w-1/2 mb-2" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-8 w-1/3 mb-6" />
      
      <div className="space-y-3 mb-6">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
      
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}

function OnboardingSkeleton(): ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="p-6 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-2xl mx-auto">
          {/* Step Indicators */}
          <div className="flex items-center justify-center mb-6">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-16 h-0.5 mx-2" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
          
          {/* Progress Bar */}
          <Skeleton className="h-2 w-full mb-4" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
          <Skeleton className="h-6 w-full mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }, (_, i) => (
              <PricingCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton(): ReactElement {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      
      {/* Chart Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

function ProfileSkeleton(): ReactElement {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Avatar & Name */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      
      {/* Form Fields */}
      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i}>
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

function LoginSkeleton(): ReactElement {
  return (
    <div className="min-h-screen flex mt-20 justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <Skeleton className="h-8 w-48 mx-auto" />
        
        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Tab Buttons */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 flex-1 rounded-md" />
          </div>
          
          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
          
          {/* Submit Button */}
          <Skeleton className="h-12 w-full mt-6 rounded-lg" />
          
          {/* Divider */}
          <div className="flex items-center my-6">
            <Skeleton className="h-px flex-1" />
            <Skeleton className="h-4 w-8 mx-4" />
            <Skeleton className="h-px flex-1" />
          </div>
          
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export { Skeleton, PricingCardSkeleton, OnboardingSkeleton, DashboardSkeleton, ProfileSkeleton, LoginSkeleton };