'use client'

import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  from?: string
  via?: string
  to?: string
  animate?: boolean
  animationDuration?: number
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className,
  from = '#8b5cf6',
  via = '#ec4899',
  to = '#f59e0b',
  animate = true,
  animationDuration = 3,
}) => {
  const textRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    if (!animate || !textRef.current) return

    // Animate gradient position
    gsap.to(textRef.current, {
      backgroundPosition: '200% center',
      duration: animationDuration,
      repeat: -1,
      ease: 'linear',
    })
  }, [animate, animationDuration])

  return (
    <span
      ref={textRef}
      className={cn('bg-clip-text text-transparent', className)}
      style={{
        backgroundImage: `linear-gradient(90deg, ${from}, ${via}, ${to}, ${from})`,
        backgroundSize: '200% auto',
        backgroundPosition: '0% center',
      }}
    >
      {children}
    </span>
  )
}
