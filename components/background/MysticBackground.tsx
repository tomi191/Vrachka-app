'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
}

interface Orb {
  x: number;
  y: number;
  radiusScale: number;
  color: string;
  speed: number;
}

export function MysticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Generate stars
    const stars: Star[] = [];
    const starCount = Math.floor((window.innerWidth * window.innerHeight) / 8000);

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleDelay: Math.random() * 3,
      });
    }

    // Gradient orbs configuration
    const orbs: Orb[] = [
      { x: 0.2, y: 0.3, radiusScale: 0.4, color: 'rgba(168, 85, 247, 0.15)', speed: 0.0005 },
      { x: 0.8, y: 0.6, radiusScale: 0.5, color: 'rgba(147, 51, 234, 0.12)', speed: 0.0007 },
      { x: 0.5, y: 0.8, radiusScale: 0.35, color: 'rgba(192, 132, 252, 0.1)', speed: 0.0004 },
    ];

    // Animation
    let animationFrame: number;
    let time = 0;

    const animate = () => {
      time += 0.01;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient orbs FIRST (background layer)
      orbs.forEach((orb, index) => {
        const offsetX = Math.sin(time * 50 * orb.speed + index) * 50;
        const offsetY = Math.cos(time * 50 * orb.speed * 0.8 + index) * 50;

        const x = canvas.width * orb.x + offsetX;
        const y = canvas.height * orb.y + offsetY;
        const radius = Math.min(canvas.width, canvas.height) * orb.radiusScale;

        // Create radial gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

        // Apply blur effect manually for orbs
        ctx.save();
        ctx.filter = 'blur(80px)';
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      });

      // Draw stars SECOND (foreground layer)
      stars.forEach((star) => {
        // Twinkling effect using sine wave
        const twinkle = Math.sin(time + star.twinkleDelay) * 0.3 + 0.7;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

        // Purple/white gradient for stars
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 2
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * twinkle})`);
        gradient.addColorStop(0.5, `rgba(168, 85, 247, ${star.opacity * twinkle * 0.6})`);
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      animate();
    } else {
      // Static version for reduced motion
      // Draw orbs
      orbs.forEach((orb) => {
        const x = canvas.width * orb.x;
        const y = canvas.height * orb.y;
        const radius = Math.min(canvas.width, canvas.height) * orb.radiusScale;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

        ctx.save();
        ctx.filter = 'blur(80px)';
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      });

      // Draw stars
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });
    }

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hidden md:block fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}
