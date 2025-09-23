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
      // Use relative URL to avoid baseUrl issues in deployment
      try {
        fetch(`/api/user/auth-data?user_id=${user.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }).catch(() => {
          // Silently handle errors - this is just cache warming
        });
      } catch {
        // Ignore cache warming errors completely
      }

      // We no longer need to check onboarding status here since the loading page will handle it
      // This simplifies the callback and reduces complexity

      // Redirect to the next page if provided, otherwise go to loading page
      if (next) {
        return NextResponse.redirect(new URL(next, baseUrl));
      }

      // Always redirect to loading page for smooth UX
      // The loading page will handle the final redirect based on auth data
      return NextResponse.redirect(new URL('/auth-loading', baseUrl));
    }

    return NextResponse.redirect(new URL('/dashboard', baseUrl));
  }

  return NextResponse.redirect(new URL('/login', baseUrl));
} 