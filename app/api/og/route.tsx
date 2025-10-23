import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Vrachka - AI Хороскопи и Таро';
  const description = searchParams.get('description') || 'Персонализирани дневни хороскопи, таро четения и духовни консултации';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a0b2e 0%, #3d1e6d 50%, #8b5cf6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Mystical background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 60% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
            backgroundSize: '100px 100px',
          }}
        />

        {/* Logo/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              marginRight: '20px',
            }}
          >
            🔮
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              color: 'white',
              letterSpacing: '-2px',
            }}
          >
            Vrachka
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.2,
            marginBottom: '30px',
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          {description}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          www.vrachka.eu
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
