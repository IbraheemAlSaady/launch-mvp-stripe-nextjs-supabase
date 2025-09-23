'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { ReactElement } from 'react';

export function AuthLoadingContent(): ReactElement {
  const { user, authData, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && (!isLoading || authData)) {
      const timer = setTimeout(() => {
        if (authData) {
          if (authData.isSubscriber) {
            router.replace('/dashboard');
          } else {
            router.replace('/onboarding');
          }
        } else if (!isLoading) {
          router.replace('/onboarding');
        }
      }, 1500);

      return () => clearTimeout(timer);
    }

    if (!user && !isLoading) {
      router.replace('/login');
    }
  }, [authData, isLoading, router, user]);

  if (!user && !isLoading) {
    return <div />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-dark rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              {authData ? (
                <CheckCircle className="w-8 h-8 text-primary" />
              ) : (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
            >
              {authData ? 'Welcome back!' : 'Setting up your account...'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 dark:text-gray-400"
            >
              {authData
                ? 'Redirecting you to your dashboard'
                : 'Please wait while we prepare your experience'}
            </motion.p>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center space-x-3"
            >
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Authentication verified
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="flex items-center space-x-3"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  authData ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600 animate-pulse'
                }`}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Loading account details
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: authData ? 1 : 0.5, x: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-center space-x-3"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  authData ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Preparing your workspace
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-center">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

