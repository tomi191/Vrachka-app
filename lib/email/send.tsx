import { resend, FROM_EMAIL } from './client';
import {
  WelcomeEmail,
  PaymentConfirmationEmail,
  SubscriptionRenewalEmail,
  WeeklyDigestEmail,
  UpsellEmail,
} from './templates';

export async function sendWelcomeEmail(to: string, firstName?: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Добре дошъл във Vrachka! ✨',
      react: WelcomeEmail({ firstName: firstName || '' }),
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

export async function sendPaymentConfirmationEmail(
  to: string,
  {
    firstName,
    plan,
    amount,
    nextBillingDate,
  }: {
    firstName: string;
    plan: 'Basic' | 'Ultimate';
    amount: string;
    nextBillingDate: string;
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Потвърждение за ${plan} абонамент 🎉`,
      react: PaymentConfirmationEmail({
        firstName,
        plan,
        amount,
        nextBillingDate,
      }),
    });

    if (error) {
      console.error('Error sending payment confirmation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendSubscriptionRenewalEmail(
  to: string,
  {
    firstName,
    plan,
    amount,
    renewalDate,
  }: {
    firstName: string;
    plan: string;
    amount: string;
    renewalDate: string;
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Твоят абонамент се удължава скоро',
      react: SubscriptionRenewalEmail({
        firstName,
        plan,
        amount,
        renewalDate,
      }),
    });

    if (error) {
      console.error('Error sending renewal email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending renewal email:', error);
    return { success: false, error };
  }
}

export async function sendWeeklyDigestEmail(
  to: string,
  {
    firstName,
    zodiacSign,
    weeklyHighlight,
  }: {
    firstName: string;
    zodiacSign: string;
    weeklyHighlight: string;
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Твоята седмична прогноза - ${zodiacSign} 🌙`,
      react: WeeklyDigestEmail({
        firstName,
        zodiacSign,
        weeklyHighlight,
      }),
    });

    if (error) {
      console.error('Error sending weekly digest email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending weekly digest email:', error);
    return { success: false, error };
  }
}

export async function sendUpsellEmail(to: string, firstName?: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Отключи пълната сила на Vrachka ✨',
      react: UpsellEmail({ firstName: firstName || '' }),
    });

    if (error) {
      console.error('Error sending upsell email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending upsell email:', error);
    return { success: false, error };
  }
}

// Batch email sending (for weekly digests, etc.)
export async function sendBatchEmails(
  emails: Array<{
    to: string;
    subject: string;
    react: React.ReactElement;
  }>
) {
  try {
    const results = await Promise.allSettled(
      emails.map((email) =>
        resend.emails.send({
          from: FROM_EMAIL,
          ...email,
        })
      )
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    return {
      success: true,
      results: { successful, failed, total: emails.length },
    };
  } catch (error) {
    console.error('Error sending batch emails:', error);
    return { success: false, error };
  }
}
