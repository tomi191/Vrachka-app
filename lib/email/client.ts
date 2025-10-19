import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender configuration
// Domain verified in Resend ✅
export const FROM_EMAIL = 'Vrachka <noreply@vrachka.eu>';
export const REPLY_TO_EMAIL = 'support@vrachka.eu';
