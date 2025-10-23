import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { grantTrial } from '@/lib/subscription/trial'

export async function POST() {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Grant 3-day Ultimate trial
    const success = await grantTrial(user.id)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to grant trial or trial already used' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '3-day Ultimate trial granted successfully',
      tier: 'ultimate',
      daysRemaining: 3,
    })
  } catch (error) {
    console.error('[API] Error granting trial:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
