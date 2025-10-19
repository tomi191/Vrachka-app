import { NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/email/client';
import { EmailVerificationTemplate } from '@/lib/email/templates';

export async function POST(request: Request) {
  try {
    const { email, confirmationUrl } = await request.json();

    if (!email || !confirmationUrl) {
      return NextResponse.json(
        { error: 'Email and confirmation URL are required' },
        { status: 400 }
      );
    }

    // Send verification email
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Потвърди имейл адреса си във Vrachka 📧',
      react: EmailVerificationTemplate({ confirmationUrl }),
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in send-verification route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
