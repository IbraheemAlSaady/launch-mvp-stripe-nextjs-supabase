/**
 * Centralized pricing configuration
 * 
 * This file contains all pricing tier definitions used across the application.
 * Both onboarding and upgrade components use this shared configuration to ensure consistency.
 */

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  interval: string;
  description: string;
  features: string[];
  popular?: boolean;
  priceId?: string; // Stripe Price ID for upgrades
  stripePaymentLink?: string; // Stripe Payment Link for onboarding
  cta: string;
}

/**
 * Available pricing tiers configuration
 */
export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    interval: '/month',
    description: 'Perfect for small teams and startups',
    features: [
      'All template features',
      'Priority support',
      'Custom branding',
      'Analytics dashboard',
      'Team collaboration'
    ],
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    stripePaymentLink: process.env.NEXT_PUBLIC_STRIPE_PRO_PAYMENT_LINK!,
    cta: 'Get Started'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$49',
    interval: '/month',
    description: 'For larger organizations',
    features: [
      'Everything in Pro',
      'Advanced security',
      'Custom integrations',
      '24/7 support',
      'SLA guarantee'
    ],
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID!,
    stripePaymentLink: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PAYMENT_LINK!,
    cta: 'Start Trial'
  },
  {
    id: 'custom',
    name: 'Custom',
    price: 'Custom',
    interval: '',
    description: 'Tailored to your needs',
    features: [
      'Custom development',
      'Dedicated support',
      'Custom SLA',
      'On-premise options',
      'Training sessions'
    ],
    popular: false,
    cta: 'Contact Sales'
  }
];

/**
 * Get pricing tier by ID
 */
export function getPricingTier(id: string): PricingTier | undefined {
  return PRICING_TIERS.find(tier => tier.id === id);
}

/**
 * Get all pricing tiers
 */
export function getAllPricingTiers(): PricingTier[] {
  return PRICING_TIERS;
}

/**
 * Transform pricing tier for onboarding (includes payment links and CTA)
 */
export function getOnboardingPricingTiers(): Array<PricingTier & { stripePaymentLink: string }> {
  return PRICING_TIERS.map(tier => ({
    ...tier,
    stripePaymentLink: tier.stripePaymentLink!
  }));
}

/**
 * Transform pricing tier for upgrade component (includes price IDs and current status)
 */
export function getUpgradePricingTiers(currentPlan: string): Array<PricingTier & { priceId: string; current: boolean }> {
  return PRICING_TIERS.filter(tier => tier.priceId).map(tier => ({
    ...tier,
    priceId: tier.priceId!,
    current: currentPlan === tier.id
  }));
}

/**
 * Get pricing tiers for marketing/landing page display
 */
export function getMarketingPricingTiers(): PricingTier[] {
  return PRICING_TIERS;
}