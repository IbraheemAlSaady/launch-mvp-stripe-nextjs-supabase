import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');
  
  // Use environment variable for redirects instead of requestUrl.origin
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin;

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('AuthCallback: Error:', error);
      return NextResponse.redirect(new URL('/login?error=auth-failed', baseUrl));
    }

    // Get the authenticated user
    const user = data.user;

    if (user) {
      // Warm cache by triggering auth data fetch in background (non-blocking)
      // This will make the AuthContext initialization much faster
      fetch(`${baseUrl}/api/user/auth-data?user_id=${user.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => {
        // Silently handle errors - this is just cache warming
      });

      // Check if user needs onboarding (keep existing logic for redirect decision)
      const preferencesResult = await supabase
        .from('user_preferences')
        .select('has_completed_onboarding')
        .eq('user_id', user.id)
        .single();
      
      let preferences = preferencesResult.data;
      const error = preferencesResult.error;
      
      // If no preferences record exists, create one
      if (error && error.code === 'PGRST116') {
        const { data: newPreferences } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            has_completed_onboarding: false
          })
          .select('has_completed_onboarding')
          .single();
        
        preferences = newPreferences;
      }
      
      const needsOnboarding = !preferences?.has_completed_onboarding;

      // Redirect to the next page if provided, otherwise check onboarding status
      if (next) {
        return NextResponse.redirect(new URL(next, baseUrl));
      }

      const redirectTo = needsOnboarding 
        ? `${baseUrl}/onboarding`
        : `${baseUrl}/dashboard`;
        
      return NextResponse.redirect(redirectTo);
    }

    return NextResponse.redirect(new URL('/dashboard', baseUrl));
  }

  return NextResponse.redirect(new URL('/login', baseUrl));
} 