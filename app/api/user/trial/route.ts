import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase-admin';
import { withCors } from '@/utils/cors';
import { z } from 'zod';

// Input validation schema
const getTrialSchema = z.object({
  user_id: z.string().uuid()
});

export const GET = withCors(async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const validatedParams = getTrialSchema.parse({ user_id: userId });
    
    // MANDATORY: Verify user exists (security check)
    const { data: userCheck } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', validatedParams.user_id)
      .single();
      
    if (!userCheck) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Get subscription status
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('status')
      .eq('user_id', validatedParams.user_id)
      .maybeSingle();

    // Get trial information
    const { data: trial, error: trialError } = await supabaseAdmin
      .from('user_trials')
      .select('trial_end_time, is_trial_used')
      .eq('user_id', validatedParams.user_id)
      .maybeSingle();

    if (trialError) {
      console.error('Error fetching trial status:', trialError);
      return NextResponse.json({ error: 'Failed to fetch trial status' }, { status: 500 });
    }

    // Calculate trial status
    const now = new Date();
    const trialEndTime = trial?.trial_end_time ? new Date(trial.trial_end_time) : null;
    const isTrialActive = trialEndTime ? now < trialEndTime : false;
    const isTrialExpired = trialEndTime ? now >= trialEndTime : false;
    const hasActiveSubscription = subscription?.status === 'active';

    return NextResponse.json({
      subscription: subscription,
      trial: trial,
      isTrialActive,
      isTrialExpired,
      isTrialUsed: trial?.is_trial_used || false,
      hasActiveSubscription,
      trialEndTime: trial?.trial_end_time || null
    });
  } catch (error) {
    console.error('Trial GET error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});