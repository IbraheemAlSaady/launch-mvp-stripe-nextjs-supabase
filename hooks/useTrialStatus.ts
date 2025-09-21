import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';

export function useTrialStatus() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [trialStatus, setTrialStatus] = useState<{
    isInTrial: boolean;
    trialEndTime: string | null;
    hasSubscription: boolean;
  }>({ isInTrial: false, trialEndTime: null, hasSubscription: false });

  useEffect(() => {
    async function checkTrialStatus() {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // First check if user has an active subscription
        const trialResponse = await fetch(`/api/user/trial?user_id=${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const trialData = trialResponse.ok ? await trialResponse.json() : null;
        const subscription = trialData?.subscription;

        // If user has an active subscription, skip trial creation
        if (subscription?.status === 'active' || subscription?.status === 'trialing') {
          setTrialStatus({
            isInTrial: false,
            trialEndTime: null,
            hasSubscription: true
          });
          setIsLoading(false);
          return;
        }

        // Check if user has an existing trial
        const trial = trialData?.trial;
        const trialError = !trialResponse.ok;

        if (trialError) {
          console.error('Failed to fetch trial status:', trialError);
          return;
        }

        if (trial) {
          // Check if trial is still valid
          const now = new Date();
          const endTime = new Date(trial.trial_end_time);
          const isInTrial = !trial.is_trial_used && now < endTime;

          setTrialStatus({
            isInTrial,
            trialEndTime: trial.trial_end_time,
            hasSubscription: false
          });
        } else {
          // User has no trial record - they are in trial period but don't create record yet
          setTrialStatus({
            isInTrial: true,
            trialEndTime: null,
            hasSubscription: false
          });
        }
      } catch (error) {
        // Set default state on error
        setTrialStatus({
          isInTrial: false,
          trialEndTime: null,
          hasSubscription: false
        });
      } finally {
        setIsLoading(false);
      }
    }

    checkTrialStatus();
  }, [user?.id]);

  return { ...trialStatus, isLoading };
}