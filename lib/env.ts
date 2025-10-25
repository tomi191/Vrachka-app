/**
 * Environment Variables Validation
 *
 * Validates that all required environment variables are present at startup.
 * This prevents runtime errors due to missing configuration.
 */

const requiredEnvVars = [
  // Supabase
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',

  // AI
  'OPENROUTER_API_KEY',

  // Stripe
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',

  // Email
  'RESEND_API_KEY',

  // App URLs
  'NEXT_PUBLIC_APP_URL',
] as const;

const optionalEnvVars = [
  'VAPID_PUBLIC_KEY',
  'VAPID_PRIVATE_KEY',
  'NEXT_PUBLIC_VAPID_PUBLIC_KEY',
] as const;

export function validateEnv() {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // Check optional variables (just warn)
  for (const key of optionalEnvVars) {
    if (!process.env[key]) {
      warnings.push(key);
    }
  }

  // Log warnings
  if (warnings.length > 0) {
    console.warn(
      '⚠️  Optional environment variables missing:',
      warnings.join(', ')
    );
    console.warn('   Some features may not work properly.');
  }

  // Throw error if required variables are missing
  if (missing.length > 0) {
    const errorMessage = [
      '🔴 Missing required environment variables:',
      '',
      ...missing.map(key => `  - ${key}`),
      '',
      'Please check your .env.local file or Vercel environment settings.',
      'See .env.example for reference.',
    ].join('\n');

    throw new Error(errorMessage);
  }

  console.log('✅ All required environment variables are present');
}

// Auto-validate on import (only in Node.js environment)
if (typeof window === 'undefined') {
  try {
    validateEnv();
  } catch (error) {
    // Re-throw to fail fast during build/start
    throw error;
  }
}
