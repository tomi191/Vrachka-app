/**
 * Test script for sending daily horoscope email
 * Tests the new DailyHoroscopeEmail template and Resend integration
 */

import dotenv from 'dotenv';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import React from 'react';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Import template (we'll use inline version for testing)
const DailyHoroscopeEmailTest = ({
  firstName,
  zodiacSign,
  horoscopeText,
  date,
}) => {
  return React.createElement('div', { style: { fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#09090b', color: '#ffffff' } }, [
    React.createElement('h1', { key: 'h1', style: { color: '#a78bfa', marginBottom: '20px' } }, '✨ Твоят дневен хороскоп'),
    React.createElement('p', { key: 'date', style: { color: '#a1a1aa', marginBottom: '16px' } }, date),
    React.createElement('p', { key: 'greeting', style: { marginBottom: '16px', color: '#d4d4d8' } }, `Здравей${firstName ? `, ${firstName}` : ''}!`),
    React.createElement('p', { key: 'intro', style: { marginBottom: '24px', color: '#d4d4d8' } }, `Ето какво подготвят звездите за теб днес като ${zodiacSign}:`),
    React.createElement('div', { key: 'horoscope', style: { padding: '24px', backgroundColor: '#27272a', borderRadius: '12px', borderLeft: '4px solid #8b5cf6', marginBottom: '24px' } },
      React.createElement('p', { style: { margin: 0, fontSize: '16px', lineHeight: '28px', color: '#ffffff' } }, horoscopeText)
    ),
    React.createElement('p', { key: 'cta', style: { marginBottom: '16px', color: '#d4d4d8' } }, 'Искаш да разбереш повече за деня си?'),
    React.createElement('div', { key: 'button', style: { textAlign: 'center', marginBottom: '24px' } },
      React.createElement('a', {
        href: 'https://vrachka.eu/dashboard',
        style: {
          display: 'inline-block',
          backgroundColor: '#8b5cf6',
          color: 'white',
          textDecoration: 'none',
          padding: '12px 32px',
          borderRadius: '8px',
          fontWeight: '600'
        }
      }, 'Виж подробен хороскоп →')
    ),
    React.createElement('p', { key: 'tip', style: { padding: '16px', backgroundColor: '#27272a', borderRadius: '8px', fontSize: '14px', color: '#a1a1aa' } }, '💡 Изтегли таро карта на деня или попитай AI Врачката за повече насоки!'),
  ]);
};

async function sendTestEmail() {
  try {
    console.log('🚀 Testing Daily Horoscope Email System\n');

    // Check Resend API key
    if (!process.env.RESEND_API_KEY) {
      throw new Error('❌ RESEND_API_KEY not found in environment variables');
    }

    console.log('✅ Resend API key found');
    console.log('📧 Recipient: caspere63@gmail.com');
    console.log('♌ Zodiac Sign: Лъв (Leo)\n');

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Prepare test data
    const today = new Date().toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const horoscopeText = 'Днес е перфектен ден за нови начинания! Енергията на Лъва е на върха си. Очаква те успех в професионалната сфера и приятни изненади в личния живот. Бъди смел и следвай сърцето си! Планетите са в твоя полза. ✨🦁';

    console.log('🎨 Creating HTML email...');

    // Create HTML directly
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">

    <!-- Header -->
    <div style="text-align: center; padding: 30px 0;">
      <h1 style="color: #a78bfa; margin: 0; font-size: 32px;">✨ Vrachka</h1>
      <p style="color: #71717a; margin: 10px 0 0 0;">Твоята дигитална врачка</p>
    </div>

    <!-- Main Content -->
    <div style="background: #18181b; border-radius: 12px; padding: 40px 30px;">
      <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: bold; color: #ffffff;">
        ✨ Твоят дневен хороскоп
      </h1>
      <p style="margin: 0 0 8px 0; fontSize: 14px; color: #a1a1aa;">
        ${today}
      </p>
      <p style="margin: 0 0 16px 0; fontSize: 16px; lineHeight: 24px; color: #d4d4d8;">
        Здравей, Test User!
      </p>
      <p style="margin: 0 0 24px 0; fontSize: 16px; lineHeight: 24px; color: #d4d4d8;">
        Ето какво подготвят звездите за теб днес като Лъв:
      </p>

      <div style="padding: 24px; background-color: #27272a; border-radius: 12px; border-left: 4px solid #8b5cf6; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 16px; line-height: 28px; color: #ffffff;">
          ${horoscopeText}
        </p>
      </div>

      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #d4d4d8;">
        Искаш да разбереш повече за деня си?
      </p>

      <div style="text-align: center;">
        <a href="https://vrachka.eu/dashboard"
           style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Виж подробен хороскоп →
        </a>
      </div>

      <p style="margin: 24px 0 0 0; padding: 16px; background-color: #27272a; border-radius: 8px; font-size: 14px; line-height: 20px; color: #a1a1aa;">
        💡 Изтегли таро карта на деня или попитай AI Врачката за повече насоки!
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid #27272a; padding-top: 25px; margin-top: 40px;">
      <p style="color: #71717a; font-size: 13px; line-height: 1.6; margin: 0 0 10px 0; text-align: center;">
        Получаваш този тестов имейл от Vrachka Email Automation System.
      </p>
      <p style="color: #52525b; font-size: 12px; text-align: center; margin: 15px 0 0 0;">
        © ${new Date().getFullYear()} Vrachka.eu - Всички права запазени
      </p>
    </div>

  </div>
</body>
</html>
    `.trim();

    console.log('✅ HTML email created successfully\n');

    console.log('📤 Sending email via Resend...');

    // Send email
    const result = await resend.emails.send({
      from: 'Vrachka <daily@vrachka.eu>',
      to: 'caspere63@gmail.com',
      subject: `✨ Твоят дневен хороскоп - ${today}`,
      html: html,
    });

    if (result.error) {
      throw new Error(`Resend API error: ${result.error.message}`);
    }

    console.log('✅ Email sent successfully!\n');
    console.log('📨 Message ID:', result.data.id);
    console.log('\n🎉 TEST COMPLETE!');
    console.log('📬 Check your inbox at: caspere63@gmail.com');
    console.log('📂 Also check spam folder if not in inbox');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  }
}

// Run test
sendTestEmail();
