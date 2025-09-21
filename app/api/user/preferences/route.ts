import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase-admin';
import { withCors } from '@/utils/cors';
import { z } from 'zod';

// Input validation schemas
const getUserPreferencesSchema = z.object({
  user_id: z.string().uuid()
});

const updatePreferencesSchema = z.object({
  user_id: z.string().uuid(),
  has_completed_onboarding: z.boolean().optional(),
  onboarding_step: z.number().min(1).max(10).optional(),
  selected_plan_id: z.string().optional(),
  onboarding_completed_at: z.string().datetime().optional()
});

export const GET = withCors(async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const validatedParams = getUserPreferencesSchema.parse({ user_id: userId });
    
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
      .from('user_preferences')
      .select(`
        user_id,
        has_completed_onboarding,
        onboarding_step,
        selected_plan_id,
        onboarding_completed_at
      `)
      .eq('user_id', validatedParams.user_id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching user preferences:', error);
      return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
    }

    // Return default values if no preferences found
    const result = data || {
      user_id: validatedParams.user_id,
      has_completed_onboarding: false,
      onboarding_step: 1
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('User preferences GET error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const POST = withCors(async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updatePreferencesSchema.parse(body);
    
    // MANDATORY: Verify user exists (security check)
    const { data: userCheck } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', validatedData.user_id)
      .single();
      
    if (!userCheck) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('user_preferences')
      .upsert(validatedData);

    if (error) {
      console.error('Error updating user preferences:', error);
      return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('User preferences POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});