# AGENTS.md

This file provides essential guidance for AI coding assistants working with Next.js 15, React 19, TypeScript, and Supabase.

## Core Development Philosophy

### Design Principles
- **KISS & YAGNI**: Simple solutions over complex ones, implement only when needed
- **Dependency Inversion**: Depend on abstractions, not concretions
- **Component-First**: Reusable, composable components with single responsibility
- **Fail Fast**: Validate inputs early, throw errors immediately
- **Vertical Slice Architecture**: Organize by features, not layers

## 🤖 AI Assistant Guidelines

### Context Awareness & Workflow
- Always check existing patterns before implementing features
- Use existing utilities before creating new ones
- Preferably create tests BEFORE implementation (TDD)
- Break complex tasks into smaller, testable units
- **CRITICAL**: Always use `rg` (ripgrep) instead of `grep` and `find`

```bash
# ✅ Use rg instead of grep/find
rg "pattern"
rg --files -g "*.tsx"
```

### Common Pitfalls to Avoid
- Creating duplicate functionality
- Modifying core frameworks without explicit instruction
- Adding dependencies without checking existing alternatives
- Overwriting existing tests

## 🧱 Code Structure Limits (MANDATORY)

- **Files**: MAX 500 lines (refactor if approaching)
- **Components**: MAX 200 lines
- **Functions**: MAX 50 lines, single responsibility
- **Organize by feature**: Group related components by domain

## 🚀 Technology Stack

### Next.js 15 & React 19
- **App Router**: File-system routing with layouts
- **Server Components**: Default for data fetching
- **Client Components**: Only for interactivity
- **Turbopack**: Development bundler

### TypeScript (MANDATORY REQUIREMENTS)
- **MUST use `ReactElement`** instead of `JSX.Element`
- **MUST import types from 'react'** explicitly
- **NEVER use `any` type** - use `unknown` if needed
- **MUST have explicit return types** for all functions/components
- **NEVER use `@ts-ignore`** - fix the type issue properly

```typescript
// ✅ CORRECT: Modern React 19 typing
import { ReactElement } from 'react';
function MyComponent(): ReactElement {
  return <div>Content</div>;
}

// ❌ FORBIDDEN: Legacy JSX namespace
function MyComponent(): JSX.Element {
  return <div>Content</div>;
}
```

## 🏗️ Project Structure

```
/
├── app/                   # Next.js App Router
│   ├── api/               # API routes (use supabaseAdmin)
│   ├── auth/              # Authentication routes
│   ├── dashboard/         # Protected dashboard
│   ├── onboarding/        # User onboarding flow
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Shared UI components
├── contexts/              # React contexts (AuthContext)
├── hooks/                 # Custom React hooks
├── utils/                 # Utilities (supabase.ts, supabase-admin.ts)
├── types/                 # TypeScript definitions
└── supabase/              # Database migrations
```

### Architecture Notes
- **No src/ folder**: Uses Next.js app directory at root
- **Feature Co-location**: Group components by domain
- **Context Pattern**: AuthContext for global auth state
- **Database Integration**: Supabase with migrations and RLS

## 🔐 Authentication & Database (Supabase Architecture)

### Environment Variables (MANDATORY)
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Required for API routes
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Supabase Client Configuration
```typescript
// utils/supabase.ts - Client-side
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: true, autoRefreshToken: true }
  }
);

// utils/supabase-admin.ts - Server-side (API routes ONLY)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false }
  }
);
```

### Authentication Context Pattern
```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isSubscriber: boolean; // For feature gating
}
```

## 🚀 API Architecture (MANDATORY STRUCTURE)

### Standard API Route Pattern
```typescript
// All API routes MUST follow this pattern
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase-admin';  // NEVER use client supabase
import { withCors } from '@/utils/cors';
import { z } from 'zod';

const requestSchema = z.object({
  user_id: z.string().uuid(),
  // ... other fields
});

export const POST = withCors(async function POST(request: NextRequest) {
  try {
    // 1. Validate input with Zod
    const body = await request.json();
    const validatedData = requestSchema.parse(body);
    
    // 2. MANDATORY: Verify user exists (security check)
    const { data: userCheck } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', validatedData.user_id)
      .single();
      
    if (!userCheck) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    
    // 3. Perform operation using supabaseAdmin
    const { data, error } = await supabaseAdmin
      .from('table_name')
      .insert(validatedData)
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ 
        error: 'Operation failed'  // Generic message only
      }, { status: 500 });
    }
    
    // 4. Standard success response
    return NextResponse.json({ 
      success: true,
      data: data,
      message: 'Operation completed successfully'
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
});
```

### CORS Configuration (MANDATORY)
```typescript
// utils/cors.ts - Apply to all API routes
export function withCors(handler: Function) {
  return async function corsHandler(request: NextRequest) {
    if (request.method === 'OPTIONS') {
      return NextResponse.json({}, { headers: getCorsHeaders(request) });
    }
    const response = await handler(request);
    Object.entries(getCorsHeaders(request)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  };
}
```

## 🎨 Icon Usage (Lucide React - MANDATORY)

```typescript
// ✅ CORRECT: Named imports only
import { User, Mail, Github, Chrome, Loader2 } from 'lucide-react';

// ❌ FORBIDDEN: Default imports
import Lucide from 'lucide-react';

// Icon component with consistent sizing
const iconSizes = { sm: 16, md: 20, lg: 24, xl: 32 } as const;

export const Icon = ({ 
  icon: IconComponent, 
  size = 'md', 
  className,
  ...props 
}: IconProps): ReactElement => (
  <IconComponent
    size={iconSizes[size]}
    className={cn('flex-shrink-0', className)}
    {...props}
  />
);
```

## 🛡️ Data Validation (Zod - MANDATORY)

### MUST Follow These Rules
- **MUST validate ALL external data**: API inputs, form data, environment variables
- **MUST use branded types** for all IDs
- **MUST fail fast** at system boundaries
- **MUST use type inference** from schemas

```typescript
// MUST use branded types for IDs
const UserIdSchema = z.string().uuid().brand<'UserId'>();
type UserId = z.infer<typeof UserIdSchema>;

// Comprehensive validation with cross-field checks
const onboardingSchema = z.object({
  content_goal: z.enum(['get_views_engagement', 'content_ideas', 'other']).optional(),
  content_goal_other: z.string().max(500).optional(),
  platforms: z.array(z.enum(['twitter', 'linkedin'])).max(5).optional(),
});

// Cross-field validation
if (validatedData.content_goal === 'other' && !validatedData.content_goal_other?.trim()) {
  return NextResponse.json({ 
    error: 'Description required when selecting "other"' 
  }, { status: 400 });
}
```

## 🔄 State Management Hierarchy (STRICT ORDER)

1. **Local State**: `useState` for component-specific state only
2. **Context**: Cross-component state within features (AuthContext)
3. **URL State**: Search params for shareable state
4. **Server State**: TanStack Query for ALL API data
5. **Global State**: Zustand only when truly needed app-wide
6. **Auth State**: Supabase auth state management

```typescript
// Server state with TanStack Query
function useUser(id: UserId) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw new Error(`Failed to fetch user: ${error.message}`);
      return supabaseUserSchema.parse(data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

## 🔐 Security Implementation (MULTI-LAYER)

### Security Layers
1. **Client Authentication** (Supabase Auth + RLS)
2. **Server Validation** (supabaseAdmin + user verification)
3. **Input Validation** (Zod schemas)
4. **CORS Protection** (withCors wrapper)

### User Existence Validation (MANDATORY)
```typescript
// MANDATORY in ALL API routes
const { data: userCheck } = await supabaseAdmin
  .from('users')
  .select('id')
  .eq('id', body.user_id)
  .single();
  
if (!userCheck) {
  return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
}
```

### RLS Policies vs Admin Access
```sql
-- RLS for client-side access
CREATE POLICY "Users can view own data" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

-- API routes use supabaseAdmin to bypass RLS with manual verification
```

### Business Rule Enforcement
```typescript
// Subscription limit enforcement
const { count } = await supabaseAdmin
  .from('competitors')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', user.id);

if (count && count >= limit) {
  return NextResponse.json({ 
    error: `Limit reached for your ${productName} plan (${limit} max)` 
  }, { status: 403 });
}

// Duplicate prevention
const { data: existing } = await supabaseAdmin
  .from('competitors')
  .select('id')
  .eq('user_id', user.id)
  .eq('username', validatedData.username)
  .single();

if (existing) {
  return NextResponse.json({ 
    error: `@${validatedData.username} already in your list` 
  }, { status: 409 });
}
```

## 🧪 Testing (MANDATORY REQUIREMENTS)

- **MINIMUM 80% code coverage** - NO EXCEPTIONS
- **Co-locate tests** in `__tests__` folders
- **React Testing Library** for component tests
- **Test user behavior** not implementation details
- **Mock external dependencies** (Supabase, Stripe)

```typescript
// Mock Supabase in tests
vi.mock('@/utils/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: vi.fn(),
      getUser: vi.fn(() => ({ data: { user: null } })),
    }
  }
}));
```

## 💳 Stripe Integration

```typescript
// Webhook with signature verification
const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

// Prevent duplicate subscriptions
const hasActive = await checkExistingSubscription(session.customer as string);
if (hasActive) {
  await stripe.subscriptions.cancel(session.subscription as string);
  return NextResponse.json({ status: 'blocked' });
}

// Update database with supabaseAdmin
await supabaseAdmin
  .from('subscriptions')
  .update({ status: subscription.status })
  .eq('stripe_subscription_id', subscription.id);
```

## 💅 Development & Quality

### ESLint Rules (MANDATORY)
```javascript
{
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "no-console": ["error", { "allow": ["warn", "error"] }],
  }
}
```

### Component Documentation (MANDATORY)
```typescript
/**
 * Authentication button with provider-specific styling.
 * 
 * @component
 * @example
 * ```tsx
 * <AuthButton provider="github" onClick={handleSignIn}>
 *   Sign in with GitHub
 * </AuthButton>
 * ```
 */
```

## ⚠️ CRITICAL REQUIREMENTS (MUST FOLLOW ALL)

### 🔒 Security & API (MANDATORY)
1. **MUST use supabaseAdmin for ALL API routes** - Never client supabase in API
2. **MUST validate user_id in ALL API calls** - Check user exists before operations
3. **MUST use withCors() wrapper** - For all API routes needing CORS
4. **MUST validate ALL inputs with Zod** - Comprehensive schemas with cross-field validation
5. **MUST implement proper error handling** - No information leakage, generic messages only

### 🏗️ Architecture & Patterns (MANDATORY)
6. **MUST follow response standardization** - `{ success: true, data }` or `{ error, status }`
7. **MUST use contexts/AuthContext.tsx** - For client-side auth state
8. **MUST check subscription status** - Use isSubscriber for feature gating
9. **MUST handle soft account deletion** - Use is_deleted flag, not hard deletion
10. **MAXIMUM 500 lines per file** - Split if larger

### 📦 Dependencies & Types (MANDATORY)
11. **MUST use Lucide React icons** - Named imports only
12. **NEVER use `JSX.Element`** - Use `ReactElement` from React 19
13. **MUST use ReactElement return types** - All components need explicit types
14. **MUST use branded types with Zod** - For all IDs and domain values

### 🧪 Data & Validation (MANDATORY)
15. **MUST implement business rule validation** - Limits, duplicates, etc.
16. **MUST use proper database patterns** - supabaseAdmin for server, regular for client
17. **MUST handle database errors gracefully** - Log server-side, generic client messages
18. **MUST prevent duplicate subscriptions** - Check existing before creating

## 📋 Pre-commit Checklist (ALL REQUIRED)

- [ ] TypeScript compiles with ZERO errors
- [ ] Tests pass with 80%+ coverage
- [ ] ESLint passes with ZERO warnings
- [ ] All components have JSDoc documentation
- [ ] Zod validates ALL external data
- [ ] ALL states handled (loading, error, empty, success)
- [ ] No console.log in production code
- [ ] Component files under 200 lines
- [ ] Supabase RLS policies implemented
- [ ] Auth flows tested properly

### FORBIDDEN Practices (PROJECT CONSTRAINTS)

- **NEVER use client supabase in API routes** - Always supabaseAdmin
- **NEVER skip user validation in APIs** - Always verify user exists
- **NEVER expose database errors to client** - Generic messages only
- **NEVER use `any` type** - Strict TypeScript required
- **NEVER use `JSX.Element`** - Use `ReactElement` instead
- **NEVER ignore Zod validation** - Validate ALL external inputs
- **NEVER skip CORS configuration** - Use withCors() wrapper
- **NEVER use default imports** from lucide-react - Named imports only
- **NEVER do hard account deletion** - Use soft deletion flags
- **NEVER trust Stripe webhooks** without signature verification
- **NEVER exceed file size limits** - 500 lines max per file
- **NEVER store sensitive data** in client state

---

## Useful Guidelines & References
- **Color Scheme**: @tailwind.config.ts
- **Plan Pricing Options**: @components/onboarding/OnboardingPricing.tsx
- **Database Schema**: All migrations files can be found here: @supabase/migrations
- **Button Shapes**: Always use fully rounded buttons

*Optimized for Next.js 15, React 19, Supabase Auth, TypeScript strict mode.*
*Focus on security, type safety, and maintainability in all decisions.*