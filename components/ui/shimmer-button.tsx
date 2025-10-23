'use client'

import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  shimmerColor?: string
  shimmerSize?: number
  borderRadius?: string
  shimmerDuration?: number
  background?: string
  className?: string
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      children,
      shimmerColor = '#ffffff',
      shimmerSize = 100,
      borderRadius = '8px',
      shimmerDuration = 2,
      background = 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      className,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const shimmerRef = useRef<HTMLSpanElement>(null)

    useGSAP(() => {
      if (!shimmerRef.current) return

      // Shimmer animation
      gsap.to(shimmerRef.current, {
        x: '200%',
        duration: shimmerDuration,
        repeat: -1,
        ease: 'power2.inOut',
        repeatDelay: 1,
      })
    }, [shimmerDuration])

    return (
      <button
        ref={ref || buttonRef}
        className={cn(
          'relative overflow-hidden px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95',
          className
        )}
        style={{
          background,
          borderRadius,
        }}
        {...props}
      >
        <span
          ref={shimmerRef}
          className="absolute inset-0 -translate-x-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${shimmerColor}40, transparent)`,
            width: `${shimmerSize}%`,
          }}
        />
        <span className="relative z-10">{children}</span>
      </button>
    )
  }
)

ShimmerButton.displayName = 'ShimmerButton'
