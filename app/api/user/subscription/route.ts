import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase-admin';
import { withCors } from '@/utils/cors';
import { z } from 'zod';

// Input validation schema
const getSubscriptionSchema = z.object({
  user_id: z.string().uuid()
});

export const GET = withCors(async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const validatedParams = getSubscriptionSchema.parse({ user_id: userId });
    
    // MANDATORY: Verify user exists (security check)
    const { data: userCheck } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', validatedParams.user_id)
      .single();
      
    if (!userCheck) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', validatedParams.user_id)
      .in('status', ['active', 'trialing'])
      .order('created_at', { ascending: false })
      .maybeSingle();

    if (error) {
      console.error('Error fetching subscription:', error);
      return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
    }

    // Check if subscription is valid
    const isValid = data && 
      ['active', 'trialing'].includes(data.status) && 
      new Date(data.current_period_end) > new Date();

    return NextResponse.json({
      subscription: data,
      isSubscriber: !!isValid,
      isValid: !!isValid
    });
  } catch (error) {
    console.error('Subscription GET error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});