import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase-admin';
import { withCors } from '@/utils/cors';
import { z } from 'zod';

const requestSchema = z.object({
  user_id: z.string().uuid(),
});

/**
 * Batch endpoint to get all auth-related data in a single request
 * Replaces separate calls to subscription and preferences endpoints
 */
export const GET = withCors(async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const user_id = url.searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json({ 
        error: 'user_id parameter is required' 
      }, { status: 400 });
    }

    // Validate user_id format
    const validatedData = requestSchema.parse({ user_id });

    // Verify user exists (security check)
    const { data: userCheck } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', validatedData.user_id)
      .single();
      
    if (!userCheck) {
      return NextResponse.json({ 
        error: 'Invalid user ID' 
      }, { status: 400 });
    }

    // Fetch all auth data in parallel
    const [subscriptionResult, preferencesResult] = await Promise.all([
      // Get subscription data
      supabaseAdmin
        .from('subscriptions')
        .select(`
          id,
          status,
          stripe_customer_id,
          stripe_subscription_id,
          cancel_at_period_end,
          current_period_end,
          product_name,
          created_at,
          updated_at
        `)
        .eq('user_id', validatedData.user_id)
        .eq('status', 'active')
        .single(),
      
      // Get user preferences
      supabaseAdmin
        .from('user_preferences')
        .select('has_completed_onboarding, onboarding_step, selected_plan_id, onboarding_completed_at')
        .eq('user_id', validatedData.user_id)
        .single()
    ]);

    // Process subscription data
    const subscription = subscriptionResult.data;
    const isSubscriber = !!subscription && subscription.status === 'active';

    // Process preferences data with defaults
    let preferences = preferencesResult.data;
    
    // If no preferences record exists, create one with defaults
    if (preferencesResult.error && preferencesResult.error.code === 'PGRST116') {
      const { data: newPreferences } = await supabaseAdmin
        .from('user_preferences')
        .insert({
          user_id: validatedData.user_id,
          has_completed_onboarding: false,
          onboarding_step: 1
        })
        .select('has_completed_onboarding, onboarding_step, selected_plan_id, onboarding_completed_at')
        .single();
      
      preferences = newPreferences;
    }

    // Return consolidated auth data
    return NextResponse.json({
      success: true,
      data: {
        // Subscription info
        isSubscriber,
        subscription: subscription || null,
        
        // Onboarding info
        hasCompletedOnboarding: preferences?.has_completed_onboarding || false,
        onboardingStep: preferences?.onboarding_step || 1,
        selectedPlanId: preferences?.selected_plan_id || null,
        onboardingCompletedAt: preferences?.onboarding_completed_at || null,
        
        // Combined flags for navigation decisions
        shouldRedirectToOnboarding: !isSubscriber,
        shouldRedirectToDashboard: isSubscriber
      }
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }
    
    console.error('Auth data fetch error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
});