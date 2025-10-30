import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, source = 'blog', interests = [] } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email е задължителен' },
        { status: 400 }
      );
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Невалиден имейл адрес' },
        { status: 400 }
      );
    }

    // Get user agent and IP for tracking
    const userAgent = request.headers.get('user-agent') || '';
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0] : null;

    const supabase = await createClient();

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email.toLowerCase())
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.status === 'confirmed') {
        return NextResponse.json(
          { error: 'Този имейл вече е записан за нашия бюлетин' },
          { status: 409 }
        );
      } else if (existingSubscriber.status === 'pending') {
        return NextResponse.json(
          {
            success: true,
            message: 'Този имейл вече е регистриран. Моля, провери пощата си за потвърждение.',
            status: 'pending'
          },
          { status: 200 }
        );
      } else if (existingSubscriber.status === 'unsubscribed') {
        // Resubscribe - update status back to pending
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({
            status: 'pending',
            unsubscribed_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingSubscriber.id);

        if (updateError) {
          console.error('Error resubscribing:', updateError);
          return NextResponse.json(
            { error: 'Възникна грешка при записването' },
            { status: 500 }
          );
        }

        return NextResponse.json(
          {
            success: true,
            message: 'Успешно се записахте отново за бюлетина!',
            status: 'resubscribed'
          },
          { status: 200 }
        );
      }
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase(),
        name: name || null,
        status: 'pending', // Will be 'confirmed' after email verification
        source,
        interests: interests.length > 0 ? interests : null,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select('id, confirmation_token, unsubscribe_token')
      .single();

    if (error) {
      console.error('Error subscribing to newsletter:', error);
      return NextResponse.json(
        { error: 'Възникна грешка при записването' },
        { status: 500 }
      );
    }

    // Send welcome email
    try {
      await resend.emails.send({
        from: 'Vrachka <newsletter@vrachka.eu>',
        to: email.toLowerCase(),
        subject: '🌟 Добре дошъл в Vrachka!',
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
                  <h1 style="color: #a78bfa; margin: 0; font-size: 36px;">✨ Добре дошъл!</h1>
                  <p style="color: #71717a; margin: 10px 0 0 0; font-size: 18px;">Успешно се абонира за Vrachka Newsletter</p>
                </div>

                <!-- Main Content -->
                <div style="background: #18181b; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                  <p style="color: #fafafa; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                    Здравей${name ? `, ${name}` : ''}! 👋
                  </p>
                  <p style="color: #a1a1aa; margin: 0 0 20px 0; line-height: 1.6;">
                    Благодарим ти, че се абонира за дневния хороскоп от Vrachka!
                  </p>
                  <p style="color: #a1a1aa; margin: 0 0 20px 0; line-height: 1.6;">
                    Всяка сутрин в <strong style="color: #fafafa;">7:00</strong> ще получаваш персонализиран хороскоп директно в пощата си. 📬
                  </p>

                  <div style="background: #1a1a1a; border-left: 3px solid #a78bfa; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p style="color: #d4d4d8; margin: 0; font-size: 14px; line-height: 1.6;">
                      💡 <strong>Съвет:</strong> Добави <span style="color: #a78bfa;">newsletter@vrachka.eu</span> в контактите си, за да не пропуснеш нито един хороскоп.
                    </p>
                  </div>
                </div>

                <!-- What's Next -->
                <div style="background: #18181b; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                  <h2 style="color: #fafafa; margin: 0 0 20px 0; font-size: 20px;">Какво следва? 🎯</h2>
                  <ul style="color: #a1a1aa; margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li>Получаваш дневен хороскоп всяка сутрин</li>
                    <li>Вижте специални астрологични съвети</li>
                    <li>Бъдеш информиран за космически събития</li>
                    <li>Достъп до ексклузивно съдържание</li>
                  </ul>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 40px 0;">
                  <a href="https://vrachka.eu/horoscope"
                     style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Виж своя хороскоп сега
                  </a>
                </div>

                <!-- Footer -->
                <div style="border-top: 1px solid #27272a; padding-top: 25px; margin-top: 40px;">
                  <p style="color: #71717a; font-size: 13px; line-height: 1.6; margin: 0 0 10px 0; text-align: center;">
                    Ако искаш да се отпишеш, можеш да го направиш по всяко време.
                  </p>
                  <p style="text-align: center; margin: 15px 0 0 0;">
                    <a href="https://vrachka.eu/unsubscribe?token=${data.unsubscribe_token}"
                       style="color: #71717a; font-size: 12px; text-decoration: underline;">
                      Отписване
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
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    // Auto-confirm the subscription
    await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      })
      .eq('id', data.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Благодарим ви! Успешно се записахте за нашия бюлетин. Проверете имейла си за потвърждение.',
        status: 'confirmed',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Възникна неочаквана грешка' },
      { status: 500 }
    );
  }
}

// GET endpoint to check subscription status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('status, confirmed_at, created_at')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !data) {
      return NextResponse.json(
        { subscribed: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        subscribed: data.status === 'confirmed',
        status: data.status,
        confirmed_at: data.confirmed_at,
        created_at: data.created_at,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
