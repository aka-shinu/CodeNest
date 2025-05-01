'use client';

import React, { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Star color variations
    const getStarColor = () => {
      const colors = [
        '#ffffff', // Pure white
        '#fff9f0', // Warm white
        '#f8f8ff', // Ghost white
        '#fffaf0', // Floral white
        '#fdf5e6', // Old lace
        '#f0f8ff', // Alice blue (very subtle blue)
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    // Create different types of stars
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      color: string;
      pulseSpeed: number;
      pulsePhase: number;
      twinkleSpeed: number;
    }> = [];

    // Background stars (tiny, varied brightness)
    for (let i = 0; i < 400; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 0.3 + 0.1, // Smaller size range
        opacity: Math.random() * 0.3 + 0.1, // Lower opacity range
        color: getStarColor(),
        pulseSpeed: Math.random() * 0.001 + 0.0005,
        pulsePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.005 + 0.002
      });
    }

    // Mid-distance stars (small, brighter)
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 0.5 + 0.3,
        opacity: Math.random() * 0.4 + 0.3,
        color: getStarColor(),
        pulseSpeed: Math.random() * 0.002 + 0.001,
        pulsePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.008 + 0.004
      });
    }

    // Bright foreground stars (slightly larger, brightest)
    for (let i = 0; i < 25; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 0.7 + 0.5,
        opacity: Math.random() * 0.3 + 0.6,
        color: '#ffffff', // Pure white for brightest stars
        pulseSpeed: Math.random() * 0.003 + 0.002,
        pulsePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.01 + 0.005
      });
    }

    // Draw space background
    const drawBackground = () => {
      // Create a gradient for the space background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(0.5, '#000205');
      gradient.addColorStop(1, '#000000');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Animation loop
    const animate = (time: number) => {
      // Clear with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background
      drawBackground();

      // Update and draw stars
      stars.forEach(star => {
        // Calculate twinkling effect
        const twinkle = Math.sin(time * star.twinkleSpeed + star.pulsePhase);
        const pulseEffect = Math.sin(time * star.pulseSpeed + star.pulsePhase);
        const finalOpacity = star.opacity * (0.6 + 0.4 * twinkle);

        // Draw star with subtle glow
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * (2 + pulseEffect * 0.5)
        );

        const opacityHex = Math.floor(finalOpacity * 255).toString(16).padStart(2, '0');
        gradient.addColorStop(0, `${star.color}${opacityHex}`);
        gradient.addColorStop(0.6, `${star.color}33`);
        gradient.addColorStop(1, `${star.color}00`);

        ctx.fillStyle = gradient;
        ctx.arc(star.x, star.y, star.size * (1.5 + pulseEffect * 0.3), 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#000205] to-black opacity-50" />
    </div>
  );
} 