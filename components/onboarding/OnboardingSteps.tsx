'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingPricing } from './OnboardingPricing';

interface OnboardingStepsProps {
  initialStep?: number;
  onComplete?: () => void;
}

export function OnboardingSteps({ initialStep = 1, onComplete }: OnboardingStepsProps): React.ReactElement {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 2;

  const updateStep = async (step: number) => {
    if (!user?.id) return;

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          onboarding_step: step,
        }),
      });

      if (!response.ok) {
        // Silently handle the error - step tracking is not critical for user experience
        return;
      }
    } catch {
      // Silently handle the error - step tracking is not critical for user experience
      return;
    }
  };

  const completeOnboarding = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          has_completed_onboarding: true,
          onboarding_completed_at: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        onComplete?.();
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      const next = currentStep + 1;
      setCurrentStep(next);
      updateStep(next);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      updateStep(prev);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    updateStep(step);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header with Progress */}
      <div className="p-6 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-2xl mx-auto">
          {/* Step Indicators */}
          <div className="flex items-center justify-center mb-6">
            {Array.from({ length: totalSteps }, (_, i) => {
              const stepNumber = i + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              
              return (
                <div key={stepNumber} className="flex items-center">
                  <motion.button
                    onClick={() => goToStep(stepNumber)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500 text-white'
                        : isActive 
                        ? 'bg-primary text-white ring-4 ring-primary-light/30 dark:ring-primary-dark/50'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      stepNumber
                    )}
                  </motion.button>
                  
                  {stepNumber < totalSteps && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      stepNumber < currentStep 
                        ? 'bg-green-500' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
          </div>

          {/* Step Counter */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full"
            >
              {currentStep === 1 && <WelcomeStep />}
              {currentStep === 2 && user && (
                <OnboardingPricing 
                  userId={user.id} 
                  userEmail={user.email || ''} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Completing...
              </>
            ) : currentStep === totalSteps ? (
              'Complete Onboarding'
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Step 1: Welcome & Introduction
function WelcomeStep(): React.ReactElement {
  return (
    <div className="text-center max-w-2xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="text-6xl mb-6">👋</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Rocket Start!
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          We&apos;re excited to have you on board! Let&apos;s get you set up with the perfect plan 
          for your needs. This will only take a moment.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
      >
        <FeatureCard
          icon="🚀"
          title="Fast Setup"
          description="Get started in under 2 minutes"
        />
        <FeatureCard
          icon="💳"
          title="Secure Payments"
          description="Powered by Stripe for security"
        />
        <FeatureCard
          icon="🔧"
          title="Easy to Use"
          description="Intuitive interface designed for you"
        />
      </motion.div>
    </div>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps): React.ReactElement {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {description}
      </p>
    </div>
  );
}