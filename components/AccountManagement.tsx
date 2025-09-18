import { useAuth } from '@/contexts/AuthContext';

export function AccountManagement() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Your Name Section - Read Only */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Name</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Your display name from your account.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''}
              readOnly
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This field is read-only</p>
          </div>
        </div>
      </div>
    </div>
  );
} 