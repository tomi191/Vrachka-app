import { resend, FROM_EMAIL } from './client';
import {
  WelcomeEmail,
  PaymentConfirmationEmail,
  SubscriptionRenewalEmail,
  WeeklyDigestEmail,
  UpsellEmail,
  EmailVerificationTemplate,
  PasswordResetTemplate,
  TrialGrantedEmail,
  ReferralRewardEmail,
  ReferralRedeemedEmail,
  SubscriptionCancelledEmail,
  TrialExpiringEmail,
  PaymentFailedEmail,
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

export async function sendVerificationEmail(to: string, confirmationUrl: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Потвърди имейл адреса си във Vrachka 📧',
      react: EmailVerificationTemplate({ confirmationUrl }),
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Нулиране на парола - Vrachka 🔐',
      react: PasswordResetTemplate({ resetUrl }),
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
}

export async function sendTrialGrantedEmail(
  to: string,
  {
    firstName,
    trialDays,
  }: {
    firstName: string;
    trialDays: number;
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `🎉 Твоят ${trialDays}-дневен пробен период започна!`,
      react: TrialGrantedEmail({ firstName, trialDays }),
    });

    if (error) {
      console.error('Error sending trial granted email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending trial granted email:', error);
    return { success: false, error };
  }
}

export async function sendReferralRewardEmail(
  to: string,
  {
    firstName,
    referralCode,
    rewardAmount,
    referredUserName,
  }: {
    firstName: string;
    referralCode: string;
    rewardAmount: number;
    referredUserName: string;
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: '🎁 Получи награда за препоръка!',
      react: ReferralRewardEmail({
        firstName,
        referralCode,
        rewardAmount,
        referredUserName,
      }),
    });

    if (error) {
      console.error('Error sending referral reward email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending referral reward email:', error);
    return { success: false, error };
  }
}

export async function sendReferralRedeemedEmail(
  to: string,
  {
    firstName,
    referrerName,
    rewardAmount,
  }: {
    firstName: string;
    referrerName: string;
    rewardAmount: number;
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: '✅ Успешно използва препоръчителен код!',
      react: ReferralRedeemedEmail({
        firstName,
        referrerName,
        rewardAmount,
      }),
    });

    if (error) {
      console.error('Error sending referral redeemed email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending referral redeemed email:', error);
    return { success: false, error };
  }
}

export async function sendSubscriptionCancelledEmail(
  to: string,
  {
    firstName,
    plan,
    cancelDate,
    reason,
  }: {
    firstName: string;
    plan: string;
    cancelDate: string;
    reason?: string;
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Твоят абонамент беше прекратен',
      react: SubscriptionCancelledEmail({
        firstName,
        plan,
        cancelDate,
        reason,
      }),
    });

    if (error) {
      console.error('Error sending subscription cancelled email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending subscription cancelled email:', error);
    return { success: false, error };
  }
}

export async function sendTrialExpiringEmail(
  to: string,
  {
    firstName,
    expiryDate,
    daysLeft,
  }: {
    firstName: string;
    expiryDate: string;
    daysLeft: number;
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: '⏰ Пробният ти период изтича скоро!',
      react: TrialExpiringEmail({
        firstName,
        expiryDate,
        daysLeft,
      }),
    });

    if (error) {
      console.error('Error sending trial expiring email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending trial expiring email:', error);
    return { success: false, error };
  }
}

export async function sendPaymentFailedEmail(
  to: string,
  {
    firstName,
    plan,
    amount,
    retryDate,
  }: {
    firstName: string;
    plan: string;
    amount: string;
    retryDate: string;
  }
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: '⚠️ Проблем с плащането на абонамента ти',
      react: PaymentFailedEmail({
        firstName,
        plan,
        amount,
        retryDate,
      }),
    });

    if (error) {
      console.error('Error sending payment failed email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending payment failed email:', error);
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
