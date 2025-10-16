import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendPushToUser } from '@/lib/push/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Send test notification
    const result = await sendPushToUser(user.id, {
      title: '🎉 Test Notification',
      body: 'Ако видиш това съобщение, push notifications работят!',
      url: '/dashboard',
      tag: 'test',
    })

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      sent: result.sent,
      failed: result.failed,
    })
  } catch (error) {
    console.error('Error in push test route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
