/**
 * Astrology SVG Icons - Planets and Elements
 * Authentic astronomical and elemental symbols in SVG format
 * Matches the style of zodiac icons for visual consistency
 */

import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

// ========== PLANET ICONS ==========

// Марс (Mars) ♂ - Male symbol: circle with arrow
export const MarsIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
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
    <circle cx="9" cy="15" r="6" />
    <line x1="14" y1="10" x2="20" y2="4" />
    <polyline points="15 4 20 4 20 9" />
  </svg>
)

// Венера (Venus) ♀ - Female symbol: circle with cross below
export const VenusIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
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
    <circle cx="12" cy="8" r="6" />
    <line x1="12" y1="14" x2="12" y2="22" />
    <line x1="9" y1="19" x2="15" y2="19" />
  </svg>
)

// Меркурий (Mercury) ☿ - Circle with semicircle on top and cross below
export const MercuryIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
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
    <path d="M12 2 Q8 2, 8 5 Q8 7, 12 7 Q16 7, 16 5 Q16 2, 12 2" />
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="17" x2="12" y2="22" />
    <line x1="9" y1="20" x2="15" y2="20" />
  </svg>
)

// Луна (Moon) ☽ - Crescent moon
export const MoonIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
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
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

// Слънце (Sun) ☉ - Circle with dot in center
export const SunIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
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
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
)

// Плутон (Pluto) ♇ - PL monogram
export const PlutoIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
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
    <path d="M6 4 L6 20" />
    <path d="M6 4 L12 4 Q16 4, 16 8 Q16 12, 12 12 L6 12" />
    <line x1="10" y1="12" x2="10" y2="20" />
    <line x1="6" y1="20" x2="14" y2="20" />
  </svg>
)

// Юпитер (Jupiter) ♃ - Stylized "4" with cross
export const JupiterIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
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
    <path d="M6 4 L6 12 L18 12" />
    <line x1="18" y1="4" x2="18" y2="20" />
    <line x1="12" y1="12" x2="4" y2="12" />
  </svg>
)

// Сатурн (Saturn) ♄ - Stylized "h" with tail
export const SaturnIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
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
    <path d="M8 4 L8 20" />
    <path d="M8 12 Q8 8, 12 8 Q16 8, 16 12 L16 20" />
    <line x1="4" y1="20" x2="12" y2="20" />
  </svg>
)

// Уран (Uranus) ♅ - H with circle
export const UranusIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
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
    <line x1="7" y1="4" x2="7" y2="14" />
    <line x1="17" y1="4" x2="17" y2="14" />
    <line x1="7" y1="9" x2="17" y2="9" />
    <circle cx="12" cy="17" r="3" />
  </svg>
)

// Нептун (Neptune) ♆ - Trident
export const NeptuneIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
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
    <line x1="12" y1="4" x2="12" y2="20" />
    <line x1="6" y1="10" x2="6" y2="4" />
    <line x1="18" y1="10" x2="18" y2="4" />
    <path d="M6 10 Q9 13, 12 10 Q15 13, 18 10" />
  </svg>
)

// ========== ELEMENT ICONS ==========

// Огън (Fire) 🔥 - Stylized flame
export const FireIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
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
    <path d="M12 2 Q8 6, 8 10 Q8 14, 12 16 Q16 14, 16 10 Q16 6, 12 2" />
    <path d="M12 8 Q10 10, 10 12 Q10 14, 12 15 Q14 14, 14 12 Q14 10, 12 8" />
  </svg>
)

// Земя (Earth) 🌍 - Globe/planet
export const EarthIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
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
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3 Q15 6, 15 9 Q15 12, 12 12 Q9 12, 9 15 Q9 18, 12 21" />
    <path d="M3 12 Q6 9, 9 12 Q12 15, 15 12 Q18 9, 21 12" />
  </svg>
)

// Въздух (Air) 💨 - Wavy lines/wind
export const AirIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
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
    <path d="M4 8 Q7 6, 10 8 Q13 10, 16 8 Q19 6, 20 8" />
    <path d="M4 12 Q7 10, 10 12 Q13 14, 16 12 Q19 10, 20 12" />
    <path d="M4 16 Q7 14, 10 16 Q13 18, 16 16 Q19 14, 20 16" />
  </svg>
)

// Вода (Water) 💧 - Water droplet
export const WaterIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
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
    <path d="M12 3 Q16 7, 16 12 Q16 16, 12 20 Q8 16, 8 12 Q8 7, 12 3" />
  </svg>
)

// ========== PLANET ICON MAP ==========

export const planetIcons = {
  'Марс': MarsIcon,
  'Венера': VenusIcon,
  'Меркурий': MercuryIcon,
  'Луна': MoonIcon,
  'Слънце': SunIcon,
  'Плутон': PlutoIcon,
  'Юпитер': JupiterIcon,
  'Сатурн': SaturnIcon,
  'Уран': UranusIcon,
  'Нептун': NeptuneIcon,
} as const

export type PlanetName = keyof typeof planetIcons

// ========== ELEMENT ICON MAP ==========

export const elementIcons = {
  'Огън': FireIcon,
  'Земя': EarthIcon,
  'Въздух': AirIcon,
  'Вода': WaterIcon,
} as const

export type ElementName = keyof typeof elementIcons

// ========== ELEMENT COLORS ==========

export const ELEMENT_COLORS: Record<ElementName, { bg: string; text: string; border: string }> = {
  'Огън': {
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    border: 'border-red-500/30',
  },
  'Земя': {
    bg: 'bg-green-500/10',
    text: 'text-green-500',
    border: 'border-green-500/30',
  },
  'Въздух': {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-500/30',
  },
  'Вода': {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-500',
    border: 'border-cyan-500/30',
  },
} as const

// ========== HELPER COMPONENTS ==========

// Dynamic planet icon renderer (memoized for performance)
export const PlanetIcon = React.memo<{
  planet: PlanetName
  className?: string
  size?: number
}>(({ planet, className, size }) => {
  const Icon = planetIcons[planet]
  return Icon ? <Icon className={className} size={size} /> : null
})

PlanetIcon.displayName = 'PlanetIcon'

// Dynamic element icon renderer (memoized for performance)
export const ElementIcon = React.memo<{
  element: ElementName
  className?: string
  size?: number
}>(({ element, className, size }) => {
  const Icon = elementIcons[element]
  return Icon ? <Icon className={className} size={size} /> : null
})

ElementIcon.displayName = 'ElementIcon'

// Helper function to get element styling
export function getElementColors(element: string) {
  return ELEMENT_COLORS[element as ElementName] || ELEMENT_COLORS['Огън']
}
