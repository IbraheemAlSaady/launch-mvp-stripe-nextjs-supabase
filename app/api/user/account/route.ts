import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase-admin';
import { withCors } from '@/utils/cors';
import { z } from 'zod';

// Input validation schema for account reactivation
const reactivateAccountSchema = z.object({
  user_id: z.string().uuid()
});

export const POST = withCors(async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, user_id } = body;

    if (action !== 'reactivate') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const validatedData = reactivateAccountSchema.parse({ user_id });
    
    // MANDATORY: Verify user exists (security check)
    const { data: userCheck } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', validatedData.user_id)
      .single();
      
    if (!userCheck) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Check if user account is currently soft-deleted
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('is_deleted, deleted_at')
      .eq('id', validatedData.user_id)
      .single();

    if (!profile?.is_deleted) {
      return NextResponse.json({ error: 'Account is not deleted' }, { status: 400 });
    }

    // Reactivate the account
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        is_deleted: false, 
        deleted_at: null,
        reactivated_at: new Date().toISOString() 
      })
      .eq('id', validatedData.user_id);

    if (updateError) {
      console.error('Error reactivating account:', updateError);
      return NextResponse.json({ error: 'Failed to reactivate account' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Account reactivated successfully' });
  } catch (error) {
    console.error('Account reactivation error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});