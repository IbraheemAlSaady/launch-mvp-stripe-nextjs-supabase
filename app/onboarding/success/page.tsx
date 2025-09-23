import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function OnboardingSuccessPage() {
  // Get the authenticated user
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  try {
    // Mark onboarding as complete
    const onboardingResponse = await fetch('/api/user/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,
        has_completed_onboarding: true,
        onboarding_completed_at: new Date().toISOString()
      }),
    });

    const onboardingError = !onboardingResponse.ok;

    if (onboardingError) {
      console.error('OnboardingSuccess: Error updating onboarding status:', onboardingError);
    }

    // Refresh auth data after onboarding completion
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/user/auth-data?user_id=${user.id}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('OnboardingSuccess: Failed to refresh auth data:', response.status);
      }
    } catch (refreshError) {
      console.error('OnboardingSuccess: Auth data refresh error:', refreshError);
      // Don't fail the onboarding completion if refresh fails
    }

  } catch (error) {
    console.error('OnboardingSuccess: Error processing completion:', error);
  }

  // Always redirect to dashboard after processing
  redirect('/dashboard');
}