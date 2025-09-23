import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/utils/supabase-admin';
// Removed CORS import - not needed for server-to-server webhooks

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Helper function for consistent logging
function logWebhookEvent(message: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] WEBHOOK: ${message}`, data ? JSON.stringify(data, null, 2) : '');
}

// Define interfaces for stored data
interface StoredSessionData {
  userId: string;
  customerId: string;
}

interface StoredSubscriptionData {
  id: string;
  customer: string;
}

// Store both checkout sessions and subscriptions temporarily
const checkoutSessionMap = new Map<string, StoredSessionData>();
const pendingSubscriptions = new Map<string, StoredSubscriptionData>();

// Note: In Next.js App Router, we handle raw body directly

async function checkExistingSubscription(customerId: string): Promise<boolean> {
  const { data: existingSubs } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .in('status', ['active', 'trialing'])
    .single();

  return !!existingSubs;
}

// Currently Handled Events:
// 1. checkout.session.completed - When a customer completes checkout
// 2. customer.subscription.created - When a new subscription is created
// 3. customer.subscription.updated - When a subscription is updated
// 4. customer.subscription.deleted - When a subscription is cancelled/deleted
// 5. customer.subscription.pending_update_applied - When a pending update is applied
// 6. customer.subscription.pending_update_expired - When a pending update expires
// 7. customer.subscription.trial_will_end - When a trial is about to end

// Other Important Events You Might Want to Handle:
// Payment Related:
// - invoice.paid - When an invoice is paid successfully
// - invoice.payment_failed - When a payment fails
// - invoice.upcoming - When an invoice is going to be created
// - payment_intent.succeeded - When a payment is successful
// - payment_intent.payment_failed - When a payment fails

// Customer Related:
// - customer.created - When a new customer is created
// - customer.updated - When customer details are updated
// - customer.deleted - When a customer is deleted

// Subscription Related:
// - customer.subscription.paused - When a subscription is paused
// - customer.subscription.resumed - When a subscription is resumed
// - customer.subscription.trial_will_end - 3 days before trial ends

// Checkout Related:
// - checkout.session.async_payment_succeeded - Async payment success
// - checkout.session.async_payment_failed - Async payment failure
// - checkout.session.expired - When checkout session expires

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables first
    if (!process.env.STRIPE_SECRET_KEY) {
      logWebhookEvent('Missing STRIPE_SECRET_KEY');
      return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
    }
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      logWebhookEvent('Missing STRIPE_WEBHOOK_SECRET');
      return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
    }

    // Get raw body for signature verification
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      logWebhookEvent('Missing stripe-signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    logWebhookEvent('Received webhook request');

    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      logWebhookEvent('Signature verification failed', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    logWebhookEvent(`Event received: ${event.type}`, event.data.object);
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Check for existing active subscription
        const hasActiveSubscription = await checkExistingSubscription(session.customer as string);
        
        if (hasActiveSubscription) {
          logWebhookEvent('Duplicate subscription attempt blocked', {
            customerId: session.customer,
            sessionId: session.id
          });
          
          // Cancel the new subscription immediately
          if (session.subscription) {
            await stripe.subscriptions.cancel(session.subscription as string);
          }
          
          return NextResponse.json({ 
            status: 'blocked',
            message: 'Customer already has an active subscription'
          });
        }

        logWebhookEvent('Processing checkout.session.completed', {
          sessionId: session.id,
          clientReferenceId: session.client_reference_id,
          customerId: session.customer,
          subscriptionId: session.subscription
        });

        if (!session.client_reference_id || !session.customer || !session.subscription) {
          logWebhookEvent('Missing required session data', {
            clientReferenceId: session.client_reference_id,
            customerId: session.customer,
            subscriptionId: session.subscription
          });
          return NextResponse.json({ error: 'Invalid session data' }, { status: 400 });
        }

        try {
          const subscription = await createSubscription(
            session.subscription as string,
            session.client_reference_id!,
            session.customer as string
          );
          logWebhookEvent('Successfully created subscription', subscription);
        } catch (error) {
          logWebhookEvent('Failed to create subscription', error);
          throw error;
        }
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Check if we have the session data already
        const sessionData = checkoutSessionMap.get(subscription.id);
        if (sessionData) {
          // We can create the subscription now
          await createSubscription(
            subscription.id,
            sessionData.userId,
            sessionData.customerId
          );
          checkoutSessionMap.delete(subscription.id);
        } else {
          // Store the subscription data until we get the session
          pendingSubscriptions.set(subscription.id, {
            id: subscription.id,
            customer: subscription.customer as string
          });
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.pending_update_applied':
      case 'customer.subscription.pending_update_expired':
      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Get updated product information
        const priceId = subscription.items.data[0]?.price.id;
        const price = priceId ? await stripe.prices.retrieve(priceId) : null;
        const product = price?.product ? await stripe.products.retrieve(price.product as string) : null;
        
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status,
            price_id: priceId,
            product_name: product?.name,
            product_id: product?.id,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);
        
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status,
            cancel_at_period_end: false,
            current_period_end: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);
        
        break;
      }

      // Note: You might want to add handlers for these common events:
      // case 'invoice.paid': {
      //   const invoice = event.data.object as Stripe.Invoice;
      //   // Handle successful payment
      // }

      // case 'invoice.payment_failed': {
      //   const invoice = event.data.object as Stripe.Invoice;
      //   // Handle failed payment, notify user
      // }

      // case 'customer.subscription.trial_will_end': {
      //   const subscription = event.data.object as Stripe.Subscription;
      //   // Notify user about trial ending
      // }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    logWebhookEvent('Webhook error', err);
    
    // More specific error handling
    if (err instanceof Error) {
      if (err.message.includes('signature')) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
      if (err.message.includes('timestamp')) {
        return NextResponse.json({ error: 'Invalid timestamp' }, { status: 400 });
      }
    }
    
    return NextResponse.json(
      { error: 'Webhook handler failed', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function createSubscription(subscriptionId: string, userId: string, customerId: string) {
  logWebhookEvent('Starting createSubscription', { subscriptionId, userId, customerId });

  try {
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    logWebhookEvent('Retrieved Stripe subscription', stripeSubscription);

    // Get the price and product information
    const priceId = stripeSubscription.items.data[0]?.price.id;
    const price = priceId ? await stripe.prices.retrieve(priceId) : null;
    const product = price?.product ? await stripe.products.retrieve(price.product as string) : null;
    
    logWebhookEvent('Retrieved price and product info', { 
      priceId, 
      productName: product?.name,
      productId: product?.id 
    });

    const { data: existingData, error: checkError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (checkError) {
      logWebhookEvent('Error checking existing subscription', checkError);
    }

    if (existingData) {
      logWebhookEvent('Found existing subscription', existingData);
      const { error: updateError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          status: stripeSubscription.status,
          price_id: stripeSubscription.items.data[0]?.price.id,
          product_name: product?.name || existingData.product_name,
          product_id: product?.id || existingData.product_id,
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: stripeSubscription.cancel_at_period_end,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscriptionId)
        .select()
        .single();

      if (updateError) {
        logWebhookEvent('Error updating existing subscription', updateError);
        throw updateError;
      }
      return existingData;
    }

    logWebhookEvent('Creating new subscription record');
    const { data, error: insertError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        status: stripeSubscription.status,
        price_id: stripeSubscription.items.data[0]?.price.id,
        product_name: product?.name || null,
        product_id: product?.id || null,
        current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: stripeSubscription.cancel_at_period_end,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      logWebhookEvent('Error inserting new subscription', insertError);
      throw insertError;
    }

    logWebhookEvent('Successfully created new subscription', data);

    // Update user preferences to mark onboarding as completed
    try {
      const { error: preferencesError } = await supabaseAdmin
        .from('user_preferences')
        .upsert({
          user_id: userId,
          has_completed_onboarding: true,
          updated_at: new Date().toISOString()
        });

      if (preferencesError) {
        logWebhookEvent('Error updating user preferences', preferencesError);
        // Don't throw error here - subscription creation should succeed even if preferences update fails
      } else {
        logWebhookEvent('Successfully updated user onboarding status', { userId });
      }
    } catch (preferencesUpdateError) {
      logWebhookEvent('Error in preferences update', preferencesUpdateError);
      // Log but don't fail the subscription creation
    }

    return data;
  } catch (error) {
    logWebhookEvent('Error in createSubscription', error);
    throw error;
  }
} 