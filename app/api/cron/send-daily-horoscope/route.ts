import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Zodiac signs mapping
const zodiacSigns = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

const zodiacNamesБГ: Record<string, string> = {
  aries: 'Овен',
  taurus: 'Телец',
  gemini: 'Близнаци',
  cancer: 'Рак',
  leo: 'Лъв',
  virgo: 'Дева',
  libra: 'Везни',
  scorpio: 'Скорпион',
  sagittarius: 'Стрелец',
  capricorn: 'Козирог',
  aquarius: 'Водолей',
  pisces: 'Риби'
};

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Get all confirmed subscribers with daily frequency
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, name, interests')
      .eq('status', 'confirmed')
      .eq('frequency', 'daily');

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No subscribers to send to',
        sent: 0
      });
    }

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Fetch today's horoscopes from cache
    const { data: horoscopes, error: horoscopesError } = await supabase
      .from('daily_content')
      .select('target_key, content_body')
      .eq('content_type', 'horoscope')
      .eq('target_date', today);

    if (horoscopesError) {
      console.error('Error fetching horoscopes:', horoscopesError);
      return NextResponse.json({ error: 'Failed to fetch horoscopes' }, { status: 500 });
    }

    // Convert to map for easy lookup
    const horoscopeMap = new Map(
      horoscopes?.map(h => [h.target_key, h.content_body]) || []
    );

    let emailsSent = 0;
    let emailsFailed = 0;

    // Send emails (batch by interests if specified, otherwise send general)
    for (const subscriber of subscribers) {
      try {
        // Determine which horoscope to send
        // If subscriber has specific interests (zodiac signs), send those
        // Otherwise, send all horoscopes

        let horoscopeHTML = '';

        if (subscriber.interests && subscriber.interests.length > 0) {
          // Send only subscribed zodiac signs
          for (const sign of subscriber.interests) {
            if (horoscopeMap.has(sign)) {
              const horoscope = horoscopeMap.get(sign);
              horoscopeHTML += `
                <div style="margin-bottom: 30px; padding: 20px; background: #1a1a1a; border-radius: 8px;">
                  <h2 style="color: #a78bfa; margin-bottom: 15px;">${zodiacNamesБГ[sign] || sign}</h2>
                  <div style="color: #e4e4e7; line-height: 1.6;">
                    ${typeof horoscope === 'string' ? horoscope : JSON.stringify(horoscope)}
                  </div>
                </div>
              `;
            }
          }
        } else {
          // Send all horoscopes
          for (const sign of zodiacSigns) {
            if (horoscopeMap.has(sign)) {
              const horoscope = horoscopeMap.get(sign);
              horoscopeHTML += `
                <div style="margin-bottom: 25px; padding: 15px; background: #1a1a1a; border-radius: 8px;">
                  <h3 style="color: #a78bfa; margin-bottom: 10px; font-size: 18px;">${zodiacNamesБГ[sign]}</h3>
                  <div style="color: #e4e4e7; line-height: 1.6; font-size: 14px;">
                    ${typeof horoscope === 'string' ? horoscope : JSON.stringify(horoscope)}
                  </div>
                </div>
              `;
            }
          }
        }

        if (!horoscopeHTML) {
          console.warn(`No horoscope content for subscriber ${subscriber.email}`);
          continue;
        }

        // Get unsubscribe token
        const { data: subData } = await supabase
          .from('newsletter_subscribers')
          .select('unsubscribe_token')
          .eq('id', subscriber.id)
          .single();

        const unsubscribeLink = `https://vrachka.eu/unsubscribe?token=${subData?.unsubscribe_token}`;

        // Send email via Resend
        await resend.emails.send({
          from: 'Vrachka <daily@vrachka.eu>',
          to: subscriber.email,
          subject: `🌟 Твоят хороскоп за днес - ${new Date().toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })}`,
          html: `
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

                  <!-- Greeting -->
                  <div style="background: #18181b; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                    <h2 style="color: #fafafa; margin: 0 0 15px 0;">Здравей${subscriber.name ? `, ${subscriber.name}` : ''}! 👋</h2>
                    <p style="color: #a1a1aa; margin: 0; line-height: 1.6;">
                      Ето твоят дневен хороскоп за <strong style="color: #fafafa;">${new Date().toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                    </p>
                  </div>

                  <!-- Horoscopes -->
                  ${horoscopeHTML}

                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 40px 0;">
                    <a href="https://vrachka.eu/horoscope"
                       style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Виж пълния хороскоп
                    </a>
                  </div>

                  <!-- Footer -->
                  <div style="border-top: 1px solid #27272a; padding-top: 25px; margin-top: 40px;">
                    <p style="color: #71717a; font-size: 13px; line-height: 1.6; margin: 0 0 10px 0; text-align: center;">
                      Получаваш този имейл, защото си абониран за дневния хороскоп от Vrachka.
                    </p>
                    <p style="text-align: center; margin: 15px 0 0 0;">
                      <a href="${unsubscribeLink}" style="color: #71717a; font-size: 12px; text-decoration: underline;">
                        Отписване от имейлите
                      </a>
                    </p>
                    <p style="color: #52525b; font-size: 12px; text-align: center; margin: 15px 0 0 0;">
                      © ${new Date().getFullYear()} Vrachka.eu - Всички права запазени
                    </p>
                  </div>

                </div>
              </body>
            </html>
          `,
        });

        // Update tracking
        await supabase
          .from('newsletter_subscribers')
          .update({
            emails_sent: (subscriber as any).emails_sent + 1,
            last_email_sent_at: new Date().toISOString()
          })
          .eq('id', subscriber.id);

        emailsSent++;

      } catch (emailError) {
        console.error(`Failed to send email to ${subscriber.email}:`, emailError);
        emailsFailed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Daily horoscope emails sent successfully`,
      sent: emailsSent,
      failed: emailsFailed,
      total: subscribers.length
    });

  } catch (error) {
    console.error('Daily horoscope email cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
