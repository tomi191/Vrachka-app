import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender configuration
export const FROM_EMAIL = 'Vrachka <noreply@vrachka.app>';
export const REPLY_TO_EMAIL = 'support@vrachka.app';
