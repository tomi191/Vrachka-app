import { NextRequest, NextResponse } from 'next/server'
import { generateAllDailyHoroscopes } from '@/lib/blog/generator'

/**
 * Daily Cron Job: Generate horoscopes for all 12 zodiac signs
 *
 * Setup on Vercel:
 * 1. Go to Project Settings -> Cron Jobs
 * 2. Add new cron job:
 *    - Path: /api/cron/daily-horoscopes
 *    - Schedule: 0 6 * * * (every day at 6:00 AM UTC / 9:00 AM Sofia)
 *
 * Security:
 * - Vercel automatically adds Authorization header with CRON_SECRET
 * - Only Vercel cron system can trigger this endpoint
 */
export async function GET(request: NextRequest) {
  try {
    // Verify this is a valid Vercel cron request
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    // If CRON_SECRET is set, verify the request
    if (cronSecret) {
      if (authHeader !== `Bearer ${cronSecret}`) {
        console.error('[Cron] Unauthorized cron request')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    } else {
      console.warn('[Cron] CRON_SECRET not set - cron endpoint is unprotected!')
    }

    console.log('[Cron] Starting daily horoscope generation...')
    const startTime = Date.now()

    // Generate all daily horoscopes
    const result = await generateAllDailyHoroscopes()

    const duration = Date.now() - startTime
    console.log(`[Cron] Completed in ${duration}ms`)

    return NextResponse.json({
      success: true,
      result,
      duration_ms: duration,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Cron] Error in daily horoscopes job:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

/**
 * Manual trigger (for testing) - POST request
 *
 * Usage:
 * curl -X POST http://localhost:3000/api/cron/daily-horoscopes \
 *   -H "Authorization: Bearer YOUR_SECRET_HERE"
 */
export async function POST(request: NextRequest) {
  return GET(request)
}
