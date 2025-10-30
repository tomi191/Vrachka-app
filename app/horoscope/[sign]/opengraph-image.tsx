
import { ImageResponse } from 'next/og'
import { zodiacSigns, ZodiacSign } from '@/lib/zodiac'

export const runtime = 'edge'
export const alt = 'Vrachka - AI Хороскопи, Таро Четения и Духовни Насоки'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { sign: ZodiacSign } }) {
  const sign = params.sign
  const signData = zodiacSigns[sign]

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: 40, left: 40, fontSize: 60, opacity: 0.3 }}>✨</div>
        <div style={{ position: 'absolute', top: 100, right: 80, fontSize: 40, opacity: 0.3 }}>🌙</div>
        <div style={{ position: 'absolute', bottom: 80, left: 100, fontSize: 50, opacity: 0.3 }}>🔮</div>
        <div style={{ position: 'absolute', bottom: 120, right: 120, fontSize: 45, opacity: 0.3 }}>⭐</div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', textAlign: 'center' }}>
          {/* Zodiac Emoji */}
          <div style={{ fontSize: 140, marginBottom: 20 }}>
            {signData.emoji}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 30,
            }}
          >
            {signData.name}
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: 36, color: '#e4e4e7', marginBottom: 40, maxWidth: 900, lineHeight: 1.4 }}>
            Дневен Хороскоп, Седмичен и Месечен
          </div>

          {/* Brand Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(139, 92, 246, 0.2)', border: '2px solid rgba(139, 92, 246, 0.5)', borderRadius: 50, padding: '12px 30px', color: '#d4d4d8', fontSize: 24 }}>
            Vrachka.app
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: 30, fontSize: 22, color: '#71717a' }}>
          {signData.dates}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
