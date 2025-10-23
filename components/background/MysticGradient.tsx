'use client';

import { useEffect, useRef } from 'react';

export function MysticGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Gradient orbs configuration
    const orbs = [
      { x: 0.2, y: 0.3, radiusScale: 0.4, color: 'rgba(168, 85, 247, 0.15)', speed: 0.0005 }, // Purple
      { x: 0.8, y: 0.6, radiusScale: 0.5, color: 'rgba(147, 51, 234, 0.12)', speed: 0.0007 }, // Darker purple
      { x: 0.5, y: 0.8, radiusScale: 0.35, color: 'rgba(192, 132, 252, 0.1)', speed: 0.0004 },  // Lighter purple
    ];

    // Animation
    let animationFrame: number;
    let time = 0;

    const animate = () => {
      time += 0.5;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((orb, index) => {
        // Calculate position with subtle movement
        const offsetX = Math.sin(time * orb.speed + index) * 50;
        const offsetY = Math.cos(time * orb.speed * 0.8 + index) * 50;

        const x = canvas.width * orb.x + offsetX;
        const y = canvas.height * orb.y + offsetY;
        const radius = Math.min(canvas.width, canvas.height) * orb.radiusScale;

        // Create radial gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      animationFrame = requestAnimationFrame(animate);
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      animate();
    } else {
      // Static gradient for reduced motion
      orbs.forEach((orb) => {
        const x = canvas.width * orb.x;
        const y = canvas.height * orb.y;
        const radius = Math.min(canvas.width, canvas.height) * orb.radiusScale;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      style={{ filter: 'blur(80px)' }}
      aria-hidden="true"
    />
  );
}
