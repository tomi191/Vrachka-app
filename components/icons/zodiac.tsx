/**
 * Custom Zodiac Icons using SVG images from /zodii directory
 * With hover effects and glow animations
 */

import React from 'react'
import Image from 'next/image'

interface IconProps {
  className?: string
  size?: number
}

// Base styles for zodiac icons with hover effects
const baseIconStyles = `
  transition-all duration-300 ease-in-out
  brightness-0 invert
  hover:scale-110
  hover:drop-shadow-[0_0_20px_rgba(168,85,247,1)]
  hover:brightness-125
  cursor-pointer
  opacity-90 hover:opacity-100
`

// Mapping of zodiac sign keys to their SVG filenames
const zodiacImageMap = {
  oven: 'oven.svg',
  telec: 'telec.svg',
  bliznaci: 'bliznaci.svg',
  rak: 'rak.svg',
  lav: 'luv.svg',
  deva: 'deva.svg',
  vezni: 'vezni.svg',
  skorpion: 'skorpion.svg',
  strelec: 'strelec.svg',
  kozirog: 'kozirog.svg',
  vodolej: 'vodoley.svg',
  ribi: 'ribi.svg',
} as const

// Овен (Aries) ♈
export const AriesIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <Image
    src="/zodii/oven.svg"
    alt="Овен"
    width={size}
    height={size}
    className={`${baseIconStyles} ${className}`}
  />
)

// Телец (Taurus) ♉
export const TaurusIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <Image
    src="/zodii/telec.svg"
    alt="Телец"
    width={size}
    height={size}
    className={`${baseIconStyles} ${className}`}
  />
)

// Близнаци (Gemini) ♊
export const GeminiIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <Image
    src="/zodii/bliznaci.svg"
    alt="Близнаци"
    width={size}
    height={size}
    className={`${baseIconStyles} ${className}`}
  />
)

// Рак (Cancer) ♋
export const CancerIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <Image
    src="/zodii/rak.svg"
    alt="Рак"
    width={size}
    height={size}
    className={`${baseIconStyles} ${className}`}
  />
)

// Лъв (Leo) ♌
export const LeoIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <Image
    src="/zodii/luv.svg"
    alt="Лъв"
    width={size}
    height={size}
    className={`${baseIconStyles} ${className}`}
  />
)

// Дева (Virgo) ♍
export const VirgoIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <Image
    src="/zodii/deva.svg"
    alt="Дева"
    width={size}
    height={size}
    className={`${baseIconStyles} ${className}`}
  />
)

// Везни (Libra) ♎
export const LibraIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <Image
    src="/zodii/vezni.svg"
    alt="Везни"
    width={size}
    height={size}
    className={`${baseIconStyles} ${className}`}
  />
)

// Скорпион (Scorpio) ♏
export const ScorpioIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <Image
    src="/zodii/skorpion.svg"
    alt="Скорпион"
    width={size}
    height={size}
    className={`${baseIconStyles} ${className}`}
  />
)

// Стрелец (Sagittarius) ♐
export const SagittariusIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <Image
    src="/zodii/strelec.svg"
    alt="Стрелец"
    width={size}
    height={size}
    className={`${baseIconStyles} ${className}`}
  />
)

// Козирог (Capricorn) ♑
export const CapricornIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <Image
    src="/zodii/kozirog.svg"
    alt="Козирог"
    width={size}
    height={size}
    className={`${baseIconStyles} ${className}`}
  />
)

// Водолей (Aquarius) ♒
export const AquariusIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <Image
    src="/zodii/vodoley.svg"
    alt="Водолей"
    width={size}
    height={size}
    className={`${baseIconStyles} ${className}`}
  />
)

// Риби (Pisces) ♓
export const PiscesIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <Image
    src="/zodii/ribi.svg"
    alt="Риби"
    width={size}
    height={size}
    className={`${baseIconStyles} ${className}`}
  />
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

// Helper component for dynamic zodiac icon rendering (memoized for performance)
export const ZodiacIcon = React.memo<{
  sign: keyof typeof zodiacIcons
  className?: string
  size?: number
}>(({ sign, className, size }) => {
  const Icon = zodiacIcons[sign]
  return (
    <div className="relative inline-block group">
      {/* Glow effect background */}
      <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150" />
      {/* Icon */}
      <Icon className={className} size={size} />
    </div>
  )
})

ZodiacIcon.displayName = 'ZodiacIcon'
