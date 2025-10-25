import * as React from 'react';

// Email wrapper with consistent styling
const EmailWrapper = ({ children }: { children: React.ReactNode }) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style={{
      margin: 0,
      padding: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
    }}>
      <table width="100%" border={0} cellSpacing={0} cellPadding={0} style={{ backgroundColor: '#0a0a0a' }}>
        <tr>
          <td align="center" style={{ padding: '40px 20px' }}>
            <table width="600" border={0} cellSpacing={0} cellPadding={0} style={{ maxWidth: '600px' }}>
              {children}
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
);

// Header with logo
const EmailHeader = () => (
  <tr>
    <td align="center" style={{ padding: '0 0 30px 0' }}>
      <div style={{
        fontSize: '32px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        ✨ Vrachka
      </div>
    </td>
  </tr>
);

// Footer
const EmailFooter = () => (
  <tr>
    <td style={{
      padding: '30px 0 0 0',
      borderTop: '1px solid #27272a',
      textAlign: 'center',
      fontSize: '14px',
      color: '#71717a',
    }}>
      <p style={{ margin: '0 0 10px 0' }}>
        © 2025 Vrachka. Всички права запазени.
      </p>
      <p style={{ margin: '10px 0 0 0' }}>
        <a href="https://vrachka.app/privacy" style={{ color: '#8b5cf6', textDecoration: 'none' }}>Поверителност</a>
        {' · '}
        <a href="https://vrachka.app/terms" style={{ color: '#8b5cf6', textDecoration: 'none' }}>Условия</a>
        {' · '}
        <a href="https://vrachka.app/contact" style={{ color: '#8b5cf6', textDecoration: 'none' }}>Контакт</a>
      </p>
    </td>
  </tr>
);

// Button component
const Button = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} style={{
    display: 'inline-block',
    padding: '14px 32px',
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    marginTop: '20px',
  }}>
    {children}
  </a>
);

// Welcome Email Template
export const WelcomeEmail = ({ firstName }: { firstName: string }) => (
  <EmailWrapper>
    <EmailHeader />
    <tr>
      <td style={{
        backgroundColor: '#18181b',
        padding: '40px 30px',
        borderRadius: '12px',
      }}>
        <h1 style={{
          margin: '0 0 20px 0',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          Добре дошъл{firstName ? `, ${firstName}` : ''}! 🌟
        </h1>
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Благодарим ти, че се присъедини към Vrachka - твоят личен астрологичен асистент!
        </p>
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Ето какво можеш да правиш:
        </p>
        <ul style={{
          margin: '0 0 24px 0',
          padding: '0 0 0 20px',
          fontSize: '16px',
          lineHeight: '28px',
          color: '#d4d4d8',
        }}>
          <li>📅 Получавай дневни персонализирани хороскопи</li>
          <li>🃏 Изтегли карта на деня за духовна насока</li>
          <li>✨ Задавай въпроси на AI Врачката</li>
          <li>🔮 Открий таро четения за любов, кариера и повече</li>
        </ul>
        <div style={{ textAlign: 'center' }}>
          <Button href="https://vrachka.app/dashboard">
            Започни сега →
          </Button>
        </div>
      </td>
    </tr>
    <EmailFooter />
  </EmailWrapper>
);

// Payment Confirmation Email
export const PaymentConfirmationEmail = ({
  firstName,
  plan,
  amount,
  nextBillingDate,
}: {
  firstName: string;
  plan: 'Basic' | 'Ultimate';
  amount: string;
  nextBillingDate: string;
}) => (
  <EmailWrapper>
    <EmailHeader />
    <tr>
      <td style={{
        backgroundColor: '#18181b',
        padding: '40px 30px',
        borderRadius: '12px',
      }}>
        <h1 style={{
          margin: '0 0 20px 0',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          Благодарим за абонамента! 🎉
        </h1>
        <p style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Здравей{firstName ? `, ${firstName}` : ''}! Успешно активирахме твоя {plan} план.
        </p>

        <table width="100%" border={0} cellSpacing={0} cellPadding={0} style={{
          backgroundColor: '#27272a',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <tr>
            <td style={{ padding: '8px 0', fontSize: '14px', color: '#a1a1aa' }}>
              План:
            </td>
            <td align="right" style={{ padding: '8px 0', fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
              {plan}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', fontSize: '14px', color: '#a1a1aa' }}>
              Цена:
            </td>
            <td align="right" style={{ padding: '8px 0', fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
              {amount} лв/месец
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', fontSize: '14px', color: '#a1a1aa' }}>
              Следващо плащане:
            </td>
            <td align="right" style={{ padding: '8px 0', fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
              {nextBillingDate}
            </td>
          </tr>
        </table>

        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Вече имаш достъп до всички премиум функции!
        </p>

        <div style={{ textAlign: 'center' }}>
          <Button href="https://vrachka.app/dashboard">
            Отвори Dashboard
          </Button>
        </div>

        <p style={{
          margin: '24px 0 0 0',
          padding: '16px',
          backgroundColor: '#27272a',
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '20px',
          color: '#a1a1aa',
        }}>
          💡 Можеш да управляваш абонамента си по всяко време от настройките на профила.
        </p>
      </td>
    </tr>
    <EmailFooter />
  </EmailWrapper>
);

// Subscription Renewal Reminder
export const SubscriptionRenewalEmail = ({
  firstName,
  plan,
  amount,
  renewalDate,
}: {
  firstName: string;
  plan: string;
  amount: string;
  renewalDate: string;
}) => (
  <EmailWrapper>
    <EmailHeader />
    <tr>
      <td style={{
        backgroundColor: '#18181b',
        padding: '40px 30px',
        borderRadius: '12px',
      }}>
        <h1 style={{
          margin: '0 0 20px 0',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          Твоят абонамент се удължава скоро
        </h1>
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Здравей{firstName ? `, ${firstName}` : ''}!
        </p>
        <p style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Твоят {plan} план ще се удължи автоматично на <strong>{renewalDate}</strong> за <strong>{amount} лв</strong>.
        </p>
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Ако искаш да промениш или откажеш абонамента, можеш да го направиш от настройките.
        </p>
        <div style={{ textAlign: 'center' }}>
          <Button href="https://vrachka.app/profile/settings">
            Управление на абонамент
          </Button>
        </div>
      </td>
    </tr>
    <EmailFooter />
  </EmailWrapper>
);

// Weekly Digest Email (for engagement)
export const WeeklyDigestEmail = ({
  firstName,
  zodiacSign,
  weeklyHighlight,
}: {
  firstName: string;
  zodiacSign: string;
  weeklyHighlight: string;
}) => (
  <EmailWrapper>
    <EmailHeader />
    <tr>
      <td style={{
        backgroundColor: '#18181b',
        padding: '40px 30px',
        borderRadius: '12px',
      }}>
        <h1 style={{
          margin: '0 0 20px 0',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          Твоята седмична прогноза 🌙
        </h1>
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Здравей{firstName ? `, ${firstName}` : ''}!
        </p>
        <p style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Ето какво подготвят звездите за теб тази седмица като {zodiacSign}:
        </p>
        <div style={{
          padding: '20px',
          backgroundColor: '#27272a',
          borderRadius: '8px',
          borderLeft: '4px solid #8b5cf6',
          marginBottom: '24px',
        }}>
          <p style={{
            margin: 0,
            fontSize: '16px',
            lineHeight: '24px',
            color: '#ffffff',
            fontStyle: 'italic',
          }}>
            {weeklyHighlight}
          </p>
        </div>
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Искаш пълната седмична прогноза? Отвори Vrachka за повече детайли.
        </p>
        <div style={{ textAlign: 'center' }}>
          <Button href="https://vrachka.app/dashboard">
            Виж пълната прогноза
          </Button>
        </div>
      </td>
    </tr>
    <EmailFooter />
  </EmailWrapper>
);

// Free to Premium Upsell Email
export const UpsellEmail = ({ firstName }: { firstName: string }) => (
  <EmailWrapper>
    <EmailHeader />
    <tr>
      <td style={{
        backgroundColor: '#18181b',
        padding: '40px 30px',
        borderRadius: '12px',
      }}>
        <h1 style={{
          margin: '0 0 20px 0',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          Готов за повече духовни прозрения? ✨
        </h1>
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Здравей{firstName ? `, ${firstName}` : ''}!
        </p>
        <p style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Радваме се, че използваш Vrachka! 🎉 Видяхме, че харесваш дневните хороскопи.
        </p>
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          С Premium план получаваш:
        </p>
        <ul style={{
          margin: '0 0 24px 0',
          padding: '0 0 0 20px',
          fontSize: '16px',
          lineHeight: '28px',
          color: '#d4d4d8',
        }}>
          <li>🃏 3+ таро четения на ден</li>
          <li>💬 Разговори с AI Врачката</li>
          <li>📅 Седмични и месечни прогнози</li>
          <li>⭐ Персонализирани съвети</li>
        </ul>
        <div style={{ textAlign: 'center' }}>
          <Button href="https://vrachka.app/pricing">
            Виж плановете
          </Button>
        </div>
        <p style={{
          margin: '24px 0 0 0',
          textAlign: 'center',
          fontSize: '14px',
          color: '#71717a',
        }}>
          Започни от само 9.99 лв/месец
        </p>
      </td>
    </tr>
    <EmailFooter />
  </EmailWrapper>
);

// Email Verification Template (for Supabase Auth)
export const EmailVerificationTemplate = ({ confirmationUrl }: { confirmationUrl: string }) => (
  <EmailWrapper>
    <EmailHeader />
    <tr>
      <td style={{
        backgroundColor: '#18181b',
        padding: '40px 30px',
        borderRadius: '12px',
      }}>
        <h1 style={{
          margin: '0 0 20px 0',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          Потвърди имейл адреса си 📧
        </h1>
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Здравей!
        </p>
        <p style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Благодарим ти, че се регистрира във Vrachka! Моля, кликни на бутона по-долу, за да потвърдиш имейл адреса си и да активираш акаунта си.
        </p>

        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <Button href={confirmationUrl}>
            Потвърди имейл адреса →
          </Button>
        </div>

        <p style={{
          margin: '24px 0 0 0',
          padding: '16px',
          backgroundColor: '#27272a',
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '20px',
          color: '#a1a1aa',
        }}>
          💡 Ако не си създавал акаунт във Vrachka, можеш спокойно да игнорираш този имейл.
        </p>

        <p style={{
          margin: '16px 0 0 0',
          fontSize: '12px',
          lineHeight: '18px',
          color: '#71717a',
        }}>
          Или копирай и постави този линк в браузъра си:<br />
          <a href={confirmationUrl} style={{ color: '#8b5cf6', wordBreak: 'break-all' }}>
            {confirmationUrl}
          </a>
        </p>
      </td>
    </tr>
    <EmailFooter />
  </EmailWrapper>
);

// Password Reset Template (for Supabase Auth)
export const PasswordResetTemplate = ({ resetUrl }: { resetUrl: string }) => (
  <EmailWrapper>
    <EmailHeader />
    <tr>
      <td style={{
        backgroundColor: '#18181b',
        padding: '40px 30px',
        borderRadius: '12px',
      }}>
        <h1 style={{
          margin: '0 0 20px 0',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          Нулиране на парола 🔐
        </h1>
        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Здравей!
        </p>
        <p style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Получихме заявка за нулиране на паролата за твоя Vrachka акаунт. Кликни на бутона по-долу, за да създадеш нова парола.
        </p>

        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <Button href={resetUrl}>
            Нулирай паролата →
          </Button>
        </div>

        <p style={{
          margin: '24px 0 0 0',
          padding: '16px',
          backgroundColor: '#27272a',
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '20px',
          color: '#a1a1aa',
        }}>
          💡 Ако не си заявявал нулиране на парола, можеш спокойно да игнорираш този имейл. Паролата ти остава непроменена.
        </p>

        <p style={{
          margin: '16px 0 0 0',
          padding: '16px',
          backgroundColor: '#451a03',
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '20px',
          color: '#fdba74',
          borderLeft: '4px solid #f97316',
        }}>
          ⚠️ Този линк е валиден само 1 час. Ако изтече, ще трябва да заявиш ново нулиране.
        </p>

        <p style={{
          margin: '16px 0 0 0',
          fontSize: '12px',
          lineHeight: '18px',
          color: '#71717a',
        }}>
          Или копирай и постави този линк в браузъра си:<br />
          <a href={resetUrl} style={{ color: '#8b5cf6', wordBreak: 'break-all' }}>
            {resetUrl}
          </a>
        </p>
      </td>
    </tr>
    <EmailFooter />
  </EmailWrapper>
);

// Trial Granted Email Template
export const TrialGrantedEmail = ({ firstName, trialDays }: { firstName: string; trialDays: number }) => (
  <EmailWrapper>
    <EmailHeader />
    <tr>
      <td style={{
        backgroundColor: '#18181b',
        padding: '40px 30px',
        borderRadius: '12px',
      }}>
        <h1 style={{
          margin: '0 0 20px 0',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          🎉 Твоят {trialDays}-дневен пробен период започна!
        </h1>

        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Здравей {firstName},
        </p>

        <p style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Радваме се да ти съобщим, че получи {trialDays} дни безплатен достъп до <strong style={{ color: '#ffffff' }}>Ultimate</strong> плана на Vrachka!
        </p>

        <div style={{
          margin: '24px 0',
          padding: '20px',
          backgroundColor: '#27272a',
          borderRadius: '8px',
          borderLeft: '4px solid #8b5cf6',
        }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#a1a1aa', fontWeight: 'bold' }}>
            🌟 Какво можеш да правиш през пробния период:
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#d4d4d8', fontSize: '14px', lineHeight: '24px' }}>
            <li>Неограничен брой таро четения</li>
            <li>До 10 въпроса дневно към AI Врачката</li>
            <li>Седмични и месечни хороскопи</li>
            <li>Детайлна натална карта</li>
            <li>Запазване на история за 90 дни</li>
          </ul>
        </div>

        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <Button href="https://vrachka.eu/dashboard">
            Започни сега →
          </Button>
        </div>

        <p style={{
          margin: '24px 0 0 0',
          padding: '16px',
          backgroundColor: '#451a03',
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '20px',
          color: '#fdba74',
          borderLeft: '4px solid #f97316',
        }}>
          ⏰ Пробният ти период изтича след {trialDays} дни. След това ще преминеш автоматично към Безплатния план, освен ако не избереш да продължиш с Ultimate.
        </p>
      </td>
    </tr>
    <EmailFooter />
  </EmailWrapper>
);

// Referral Reward Email Template
export const ReferralRewardEmail = ({ firstName, referredUserName, rewardDays }: { firstName: string; referredUserName: string; rewardDays: number }) => (
  <EmailWrapper>
    <EmailHeader />
    <tr>
      <td style={{
        backgroundColor: '#18181b',
        padding: '40px 30px',
        borderRadius: '12px',
      }}>
        <h1 style={{
          margin: '0 0 20px 0',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          🎁 Получи {rewardDays} дни безплатен Ultimate!
        </h1>

        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Браво, {firstName}!
        </p>

        <p style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Някой, когото си препоръчал (<strong style={{ color: '#ffffff' }}>{referredUserName}</strong>), току-що премина към платен план на Vrachka! 🎉
        </p>

        <div style={{
          margin: '24px 0',
          padding: '24px',
          backgroundColor: '#1e1b4b',
          borderRadius: '12px',
          textAlign: 'center',
          border: '2px solid #6366f1',
        }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#a5b4fc', fontWeight: 'bold' }}>
            Твоята награда
          </p>
          <p style={{ margin: '0', fontSize: '32px', color: '#ffffff', fontWeight: 'bold' }}>
            +{rewardDays} дни Ultimate
          </p>
        </div>

        <p style={{
          margin: '24px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Абонаментът ти автоматично е удължен с {rewardDays} дни! Продължавай да споделяш Vrachka с приятели и получавай още награди. 🌟
        </p>

        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <Button href="https://vrachka.eu/profile/referral">
            Виж твоите препоръки →
          </Button>
        </div>
      </td>
    </tr>
    <EmailFooter />
  </EmailWrapper>
);

// Referral Redeemed Email Template
export const ReferralRedeemedEmail = ({ firstName, referrerName, rewardAmount }: { firstName: string; referrerName: string; rewardAmount: number }) => (
  <EmailWrapper>
    <EmailHeader />
    <tr>
      <td style={{
        backgroundColor: '#18181b',
        padding: '40px 30px',
        borderRadius: '12px',
      }}>
        <h1 style={{
          margin: '0 0 20px 0',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          ✅ Референтен код активиран!
        </h1>

        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Добре дошъл, {firstName}!
        </p>

        <p style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Успешно активира референтния код от <strong style={{ color: '#8b5cf6' }}>{referrerName}</strong>! 🎊
        </p>

        <div style={{
          margin: '24px 0',
          padding: '20px',
          backgroundColor: '#27272a',
          borderRadius: '8px',
          borderLeft: '4px solid #10b981',
        }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#ffffff', fontWeight: 'bold' }}>
            💡 Какво следва?
          </p>
          <p style={{ margin: 0, color: '#d4d4d8', fontSize: '14px', lineHeight: '20px' }}>
            Когато премине към платен план (Basic или Ultimate), лицето което те препоръча ще получи {rewardAmount} дни безплатен Ultimate достъп като благодарност!
          </p>
        </div>

        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <Button href="https://vrachka.eu/pricing">
            Разгледай плановете →
          </Button>
        </div>
      </td>
    </tr>
    <EmailFooter />
  </EmailWrapper>
);

// Subscription Cancelled Email Template
export const SubscriptionCancelledEmail = ({ firstName, planType, endDate }: { firstName: string; planType: string; endDate: string }) => (
  <EmailWrapper>
    <EmailHeader />
    <tr>
      <td style={{
        backgroundColor: '#18181b',
        padding: '40px 30px',
        borderRadius: '12px',
      }}>
        <h1 style={{
          margin: '0 0 20px 0',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          Твоят абонамент беше прекратен
        </h1>

        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Здравей {firstName},
        </p>

        <p style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Твоят <strong style={{ color: '#ffffff' }}>{planType}</strong> абонамент беше успешно прекратен.
        </p>

        <div style={{
          margin: '24px 0',
          padding: '20px',
          backgroundColor: '#27272a',
          borderRadius: '8px',
        }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#a1a1aa' }}>
            📅 Достъп до {endDate}
          </p>
          <p style={{ margin: 0, color: '#d4d4d8', fontSize: '14px', lineHeight: '20px' }}>
            Ще продължиш да имаш пълен достъп до премиум функциите до края на текущия платен период ({endDate}). След това автоматично ще преминеш към Безплатния план.
          </p>
        </div>

        <p style={{
          margin: '24px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Съжаляваме, че си решил да напуснеш! Ако имаш въпроси или обратна връзка, моля свържи се с нас.
        </p>

        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <Button href="https://vrachka.eu/contact">
            Свържи се с нас →
          </Button>
        </div>

        <p style={{
          margin: '24px 0 0 0',
          padding: '16px',
          backgroundColor: '#27272a',
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '20px',
          color: '#a1a1aa',
        }}>
          💡 Винаги можеш да се върнеш! Твоята история и настройки ще останат запазени.
        </p>
      </td>
    </tr>
    <EmailFooter />
  </EmailWrapper>
);

// Trial Expiring Email Template
export const TrialExpiringEmail = ({ firstName, expiresAt }: { firstName: string; expiresAt: string }) => (
  <EmailWrapper>
    <EmailHeader />
    <tr>
      <td style={{
        backgroundColor: '#18181b',
        padding: '40px 30px',
        borderRadius: '12px',
      }}>
        <h1 style={{
          margin: '0 0 20px 0',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          ⏰ Твоят пробен период скоро изтича!
        </h1>

        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Здравей {firstName},
        </p>

        <p style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Това е напомняне, че твоят 3-дневен Ultimate пробен период изтича на <strong style={{ color: '#ffffff' }}>{expiresAt}</strong>.
        </p>

        <div style={{
          margin: '24px 0',
          padding: '20px',
          backgroundColor: '#451a03',
          borderRadius: '8px',
          borderLeft: '4px solid #f97316',
        }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#fdba74', fontWeight: 'bold' }}>
            ⚠️ Какво се случва след изтичането?
          </p>
          <p style={{ margin: 0, color: '#fdba74', fontSize: '14px', lineHeight: '20px' }}>
            След {expiresAt} автоматично ще преминеш към Безплатния план. Ще загубиш достъп до неограничени таро четения, AI Врачката и детайлната натална карта.
          </p>
        </div>

        <div style={{
          margin: '24px 0',
          padding: '20px',
          backgroundColor: '#1e1b4b',
          borderRadius: '8px',
          borderLeft: '4px solid #8b5cf6',
        }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#ffffff', fontWeight: 'bold' }}>
            🌟 Продължи с Ultimate за само 19.99 лв/месец:
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#d4d4d8', fontSize: '14px', lineHeight: '24px' }}>
            <li>Неограничен брой таро четения</li>
            <li>10 въпроса дневно към AI Врачката</li>
            <li>Седмични и месечни хороскопи</li>
            <li>Пълна натална карта с интерпретация</li>
            <li>История за 90 дни</li>
          </ul>
        </div>

        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <Button href="https://vrachka.eu/pricing">
            Продължи с Ultimate →
          </Button>
        </div>
      </td>
    </tr>
    <EmailFooter />
  </EmailWrapper>
);

// Payment Failed Email Template
export const PaymentFailedEmail = ({ firstName, planType, nextRetry }: { firstName: string; planType: string; nextRetry: string }) => (
  <EmailWrapper>
    <EmailHeader />
    <tr>
      <td style={{
        backgroundColor: '#18181b',
        padding: '40px 30px',
        borderRadius: '12px',
      }}>
        <h1 style={{
          margin: '0 0 20px 0',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#ffffff',
        }}>
          ❌ Проблем с плащането
        </h1>

        <p style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Здравей {firstName},
        </p>

        <p style={{
          margin: '0 0 24px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Имаше проблем при обработката на плащането за твоя <strong style={{ color: '#ffffff' }}>{planType}</strong> абонамент.
        </p>

        <div style={{
          margin: '24px 0',
          padding: '20px',
          backgroundColor: '#7f1d1d',
          borderRadius: '8px',
          borderLeft: '4px solid #ef4444',
        }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#fca5a5', fontWeight: 'bold' }}>
            ⚠️ Действие необходимо
          </p>
          <p style={{ margin: 0, color: '#fca5a5', fontSize: '14px', lineHeight: '20px' }}>
            Моля, актуализирай данните си за плащане възможно най-скоро, за да избегнеш прекъсване на услугата. Ще направим автоматичен опит за събиране на плащането на {nextRetry}.
          </p>
        </div>

        <p style={{
          margin: '24px 0',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#d4d4d8',
        }}>
          Причини могат да включват:
        </p>
        <ul style={{ margin: '0 0 24px 0', paddingLeft: '20px', color: '#d4d4d8', fontSize: '14px', lineHeight: '24px' }}>
          <li>Недостатъчно средства</li>
          <li>Изтекла карта</li>
          <li>Банката блокира транзакцията</li>
        </ul>

        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <Button href="https://vrachka.eu/profile">
            Актуализирай данните за плащане →
          </Button>
        </div>

        <p style={{
          margin: '24px 0 0 0',
          padding: '16px',
          backgroundColor: '#27272a',
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '20px',
          color: '#a1a1aa',
        }}>
          💡 Имаш въпроси? Свържи се с нашия екип за поддръжка на support@vrachka.eu
        </p>
      </td>
    </tr>
    <EmailFooter />
  </EmailWrapper>
);
