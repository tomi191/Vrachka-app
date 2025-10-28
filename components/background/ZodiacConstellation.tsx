'use client';

import Image from 'next/image';

interface ZodiacConstellationProps {
  sign: string;
}

export function ZodiacConstellation({ sign }: ZodiacConstellationProps) {
  // Map zodiac signs to their SVG files
  const constellationMap: Record<string, string> = {
    oven: '/zodii/oven.svg',
    telec: '/zodii/telec.svg',
    bliznaci: '/zodii/bliznaci.svg',
    rak: '/zodii/rak.svg',
    lav: '/zodii/luv.svg',
    deva: '/zodii/deva.svg',
    vezni: '/zodii/vezni.svg',
    skorpion: '/zodii/skorpion.svg',
    strelec: '/zodii/strelec.svg',
    kozirog: '/zodii/kozirog.svg',
    vodolej: '/zodii/vodoley.svg',
    ribi: '/zodii/ribi.svg',
  };

  const constellationSrc = constellationMap[sign];

  if (!constellationSrc) return null;

  return (
    <>
      <style jsx>{`
        @keyframes float-main {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-20px) rotate(3deg);
          }
        }

        @keyframes float-secondary {
          0%, 100% {
            transform: translateY(0px) rotate(45deg) scale(1);
          }
          50% {
            transform: translateY(15px) rotate(48deg) scale(1.05);
          }
        }

        @keyframes float-tertiary {
          0%, 100% {
            transform: translateY(0px) rotate(-12deg) scale(1);
          }
          50% {
            transform: translateY(-12px) rotate(-15deg) scale(0.95);
          }
        }

        .float-main {
          animation: float-main 25s ease-in-out infinite;
        }

        .float-secondary {
          animation: float-secondary 30s ease-in-out infinite;
        }

        .float-tertiary {
          animation: float-tertiary 35s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Main constellation - centered */}
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] opacity-[0.03] float-main">
          <Image
            src={constellationSrc}
            alt={`${sign} constellation`}
            fill
            className="object-contain brightness-0 invert"
            priority
          />
        </div>

        {/* Secondary constellation - top right */}
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] opacity-[0.02] float-secondary">
          <Image
            src={constellationSrc}
            alt={`${sign} constellation`}
            fill
            className="object-contain brightness-0 invert"
          />
        </div>

        {/* Tertiary constellation - bottom left */}
        <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] opacity-[0.015] float-tertiary">
          <Image
            src={constellationSrc}
            alt={`${sign} constellation`}
            fill
            className="object-contain brightness-0 invert"
          />
        </div>
      </div>
    </>
  );
}
