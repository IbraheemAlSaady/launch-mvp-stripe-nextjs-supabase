'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingSteps } from '@/components/onboarding/OnboardingSteps';
import { useNavigation } from '@/hooks/useNavigation';
import { OnboardingSkeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const { user } = useAuth();
  const { redirectIfNeeded, isLoading } = useNavigation();
  const router = useRouter();

  // Centralized navigation logic
  useEffect(() => {
    redirectIfNeeded('/onboarding');
  }, [redirectIfNeeded]);

  const handleOnboardingComplete = () => {
    router.push('/dashboard');
  };

  // Show skeleton loading instead of spinner
  if (isLoading) {
    return <OnboardingSkeleton />;
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <OnboardingSteps onComplete={handleOnboardingComplete} />
  );
}