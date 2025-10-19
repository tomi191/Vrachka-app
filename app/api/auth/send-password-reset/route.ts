import { NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/email/client';
import { PasswordResetTemplate } from '@/lib/email/templates';

export async function POST(request: Request) {
  try {
    const { email, resetUrl } = await request.json();

    if (!email || !resetUrl) {
      return NextResponse.json(
        { error: 'Email and reset URL are required' },
        { status: 400 }
      );
    }

    // Send password reset email
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Нулиране на парола - Vrachka 🔐',
      react: PasswordResetTemplate({ resetUrl }),
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return NextResponse.json(
        { error: 'Failed to send password reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in send-password-reset route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
