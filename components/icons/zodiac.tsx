/**
 * Custom Zodiac SVG Icons
 * Modern, minimalist design with Tailwind support
 */

import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

// Овен (Aries) ♈
export const AriesIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7 12 C7 6, 4 3, 2 2 M7 12 L7 20" />
    <path d="M17 12 C17 6, 20 3, 22 2 M17 12 L17 20" />
  </svg>
)

// Телец (Taurus) ♉
export const TaurusIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="16" r="5" />
    <path d="M3 8 Q3 4, 7 4 L17 4 Q21 4, 21 8" />
  </svg>
)

// Близнаци (Gemini) ♊
export const GeminiIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="7" y1="4" x2="7" y2="20" />
    <line x1="17" y1="4" x2="17" y2="20" />
    <line x1="4" y1="4" x2="10" y2="4" />
    <line x1="4" y1="20" x2="10" y2="20" />
    <line x1="14" y1="4" x2="20" y2="4" />
    <line x1="14" y1="20" x2="20" y2="20" />
  </svg>
)

// Рак (Cancer) ♋
export const CancerIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="7" cy="7" r="3" />
    <circle cx="17" cy="17" r="3" />
    <path d="M10 7 Q12 7, 12 10 L12 14 Q12 17, 14 17" />
  </svg>
)

// Лъв (Leo) ♌
export const LeoIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="6" cy="8" r="3" />
    <path d="M9 8 Q12 8, 12 12 L12 18 Q12 20, 14 20 L18 20 Q20 20, 20 18" />
    <circle cx="20" cy="15" r="2" fill="currentColor" />
  </svg>
)

// Дева (Virgo) ♍
export const VirgoIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 4 L4 14" />
    <path d="M4 14 Q4 18, 8 18 Q12 18, 12 14 L12 4" />
    <path d="M12 14 Q12 18, 16 18 Q20 18, 20 14 L20 4" />
    <path d="M20 14 L22 20" />
  </svg>
)

// Везни (Libra) ♎
export const LibraIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" y1="18" x2="20" y2="18" />
    <path d="M4 14 L8 14 L8 18 M20 14 L16 14 L16 18" />
    <line x1="12" y1="6" x2="12" y2="14" />
    <line x1="6" y1="14" x2="18" y2="14" />
  </svg>
)

// Скорпион (Scorpio) ♏
export const ScorpioIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 4 L4 14" />
    <path d="M4 14 Q4 18, 8 18 Q12 18, 12 14 L12 4" />
    <path d="M12 14 Q12 18, 16 18 Q20 18, 20 14 L20 4" />
    <path d="M20 14 L20 18 L22 16" />
    <path d="M20 18 L22 20" />
  </svg>
)

// Стрелец (Sagittarius) ♐
export const SagittariusIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" y1="20" x2="20" y2="4" />
    <polyline points="14 4 20 4 20 10" />
    <line x1="8" y1="16" x2="12" y2="12" />
  </svg>
)

// Козирог (Capricorn) ♑
export const CapricornIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 4 L4 12 Q4 16, 8 16 Q12 16, 12 12 L12 8" />
    <path d="M12 12 Q12 16, 16 18 Q18 19, 20 17" />
    <circle cx="20" cy="14" r="3" />
  </svg>
)

// Водолей (Aquarius) ♒
export const AquariusIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 10 Q5 8, 7 10 Q9 12, 12 10 Q15 8, 17 10 Q19 12, 22 10" />
    <path d="M2 16 Q5 14, 7 16 Q9 18, 12 16 Q15 14, 17 16 Q19 18, 22 16" />
  </svg>
)

// Риби (Pisces) ♓
export const PiscesIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 4 Q4 8, 4 12 Q4 16, 6 20" />
    <path d="M18 4 Q20 8, 20 12 Q20 16, 18 20" />
    <line x1="4" y1="12" x2="20" y2="12" />
  </svg>
)

// Zodiac icon map for dynamic usage
export const zodiacIcons = {
  oven: AriesIcon,
  telec: TaurusIcon,
  bliznaci: GeminiIcon,
  rak: CancerIcon,
  lav: LeoIcon,
  deva: VirgoIcon,
  vezni: LibraIcon,
  skorpion: ScorpioIcon,
  strelec: SagittariusIcon,
  kozirog: CapricornIcon,
  vodolej: AquariusIcon,
  ribi: PiscesIcon,
} as const

// Helper component for dynamic zodiac icon rendering
export const ZodiacIcon: React.FC<{
  sign: keyof typeof zodiacIcons
  className?: string
  size?: number
}> = ({ sign, className, size }) => {
  const Icon = zodiacIcons[sign]
  return <Icon className={className} size={size} />
}
