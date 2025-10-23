'use client'

import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'

interface HoverCardWrapperProps {
  children: React.ReactNode
  className?: string
  tiltAmount?: number
  glowColor?: string
}

export const HoverCardWrapper: React.FC<HoverCardWrapperProps> = ({
  children,
  className,
  tiltAmount = 10,
  glowColor = '#8b5cf6',
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = ((y - centerY) / centerY) * tiltAmount
      const rotateY = ((x - centerX) / centerX) * tiltAmount

      gsap.to(card, {
        rotateX: -rotateX,
        rotateY: rotateY,
        duration: 0.3,
        ease: 'power2.out',
      })

      // Glow effect position
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: x - rect.width / 2,
          y: y - rect.height / 2,
          opacity: 0.6,
          duration: 0.3,
        })
      }
    }

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
      })

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0,
          duration: 0.3,
        })
      }
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [tiltAmount])

  return (
    <div
      ref={cardRef}
      className={cn('relative transition-transform duration-300', className)}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-4 rounded-xl blur-xl opacity-0"
        style={{
          background: `radial-gradient(circle, ${glowColor}60 0%, transparent 70%)`,
        }}
      />
      {children}
    </div>
  )
}
