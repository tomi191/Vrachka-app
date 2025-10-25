import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email/send';

export async function POST(request: Request) {
  try {
    const { email, confirmationUrl } = await request.json();

    if (!email || !confirmationUrl) {
      return NextResponse.json(
        { error: 'Email and confirmation URL are required' },
        { status: 400 }
      );
    }

    // Send verification email using centralized send function
    const result = await sendVerificationEmail(email, confirmationUrl);

    if (!result.success) {
      console.error('Error sending verification email:', result.error);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Error in send-verification route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
