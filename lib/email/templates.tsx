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
