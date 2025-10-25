/**
 * Simple in-memory rate limiter
 * For production with multiple instances, consider using Redis
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per interval
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Store rate limit data per identifier (IP address or user ID)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Rate limit middleware for API routes
 * @param identifier - Unique identifier (IP or user ID)
 * @param config - Rate limit configuration
 * @returns { allowed: boolean, remaining: number, resetAt: number }
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No entry or expired - create new
  if (!entry || entry.resetAt < now) {
    const resetAt = now + config.interval;
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt,
    });

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt,
    };
  }

  // Increment counter
  entry.count++;

  // Check if exceeded
  const allowed = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);

  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
  };
}

/**
 * Get rate limit response headers
 */
export function getRateLimitHeaders(
  remaining: number,
  resetAt: number
): Record<string, string> {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(resetAt).toISOString(),
    'Retry-After': Math.ceil((resetAt - Date.now()) / 1000).toString(),
  };
}

/**
 * Predefined rate limit configurations
 */
export const RATE_LIMITS = {
  // Oracle API - 10 requests per hour per IP
  oracle: {
    interval: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
  },
  // Tarot API - 20 requests per hour per IP
  tarot: {
    interval: 60 * 60 * 1000, // 1 hour
    maxRequests: 20,
  },
  // Horoscope API - 50 requests per hour per IP (daily horoscopes change once per day)
  horoscope: {
    interval: 60 * 60 * 1000, // 1 hour
    maxRequests: 50,
  },
  // Auth endpoints - 5 requests per 15 minutes per IP
  auth: {
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
} as const;

/**
 * Get client IP address from request headers
 */
export function getClientIp(request: Request): string {
  // Check various headers for real IP (behind proxies/CDN)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback - should not happen in production
  return 'unknown';
}

// Optional: DB-backed rate limiting via Supabase RPC
// Falls back to in-memory if env/service key not available
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function rateLimitAdaptive(
  identifier: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return rateLimit(identifier, config);
  }

  try {
    const supabase = createServiceClient(url, serviceKey);
    const windowSeconds = Math.max(1, Math.floor(config.interval / 1000));
    const { data, error } = await supabase.rpc('rate_limit_increment', {
      p_key: identifier,
      p_window_seconds: windowSeconds,
      p_max_requests: config.maxRequests,
    });

    if (error || !data) {
      console.warn('[rateLimitAdaptive] RPC fallback to memory:', error?.message);
      return rateLimit(identifier, config);
    }

    const allowed: boolean = data.allowed;
    const remaining: number = data.remaining;
    const resetAt: number = new Date(data.reset_at).getTime();
    return { allowed, remaining, resetAt };
  } catch (e) {
    console.warn('[rateLimitAdaptive] Error, fallback to memory:', e);
    return rateLimit(identifier, config);
  }
}
