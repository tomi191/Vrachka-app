import { NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/email/send';

export async function POST(request: Request) {
  try {
    const { email, resetUrl } = await request.json();

    if (!email || !resetUrl) {
      return NextResponse.json(
        { error: 'Email and reset URL are required' },
        { status: 400 }
      );
    }

    // Send password reset email using centralized send function
    const result = await sendPasswordResetEmail(email, resetUrl);

    if (!result.success) {
      console.error('Error sending password reset email:', result.error);
      return NextResponse.json(
        { error: 'Failed to send password reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Error in send-password-reset route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
