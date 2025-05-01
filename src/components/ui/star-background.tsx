"use client";

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  speed: number;
  twinkleSpeed: number;
  color: string;
  type: 'star' | 'nebula';
  layer: number; // 1: far, 2: medium, 3: close
  rotation?: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitAngle?: number;
}

export function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create space elements
    const createSpaceElements = () => {
      const elements: Star[] = [];
      
      // Create stars in different layers for parallax
      for (let layer = 1; layer <= 3; layer++) {
        const starCount = layer === 1 ? 150 : layer === 2 ? 100 : 50;
        const baseSize = layer === 1 ? 0.5 : layer === 2 ? 1 : 1.5;
        const baseSpeed = layer === 1 ? 0.05 : layer === 2 ? 0.1 : 0.15;

        for (let i = 0; i < starCount; i++) {
          elements.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: baseSize + Math.random() * baseSize,
            brightness: 0.1 + Math.random() * 0.4,
            speed: baseSpeed,
            twinkleSpeed: 0.01 + Math.random() * 0.02,
            color: `rgba(255, 255, 255, ${0.3 + Math.random() * 0.3})`,
            type: 'star',
            layer
          });
        }
      }

      // Create nebula clouds
      const nebulaColors = [
        'rgba(20, 20, 35, 0.05)',   // Very dark blue-grey
        'rgba(25, 25, 40, 0.05)',   // Dark blue-grey
        'rgba(15, 15, 25, 0.05)',   // Darker blue-grey
      ];

      for (let i = 0; i < 3; i++) {
        elements.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 100 + Math.random() * 150,
          brightness: 0.2,
          speed: 0.02 + Math.random() * 0.03,
          twinkleSpeed: 0.005,
          color: nebulaColors[i % nebulaColors.length],
          type: 'nebula',
          layer: 2,
          rotation: Math.random() * Math.PI * 2,
          orbitRadius: 200 + Math.random() * 300,
          orbitSpeed: 0.0001 + Math.random() * 0.0002,
          orbitAngle: Math.random() * Math.PI * 2
        });
      }

      return elements;
    };

    starsRef.current = createSpaceElements();

    // Draw space elements
    const drawElement = (element: Star) => {
      ctx.save();
      
      if (element.type === 'nebula') {
        // Draw nebula cloud
        ctx.translate(element.x, element.y);
        ctx.rotate(element.rotation!);
        
        // Nebula glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, element.size);
        gradient.addColorStop(0, element.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = element.brightness;
        ctx.beginPath();
        ctx.arc(0, 0, element.size, 0, Math.PI * 2);
        ctx.fill();

        // Add subtle ring
        ctx.strokeStyle = element.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = element.brightness * 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, element.size * 0.8, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Draw star
        ctx.fillStyle = element.color;
        ctx.globalAlpha = element.brightness;
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw space gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a0f');
      gradient.addColorStop(1, '#050507');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((element) => {
        // Update element properties
        if (element.type === 'star') {
          element.brightness += element.twinkleSpeed;
          if (element.brightness > 0.5 || element.brightness < 0.1) {
            element.twinkleSpeed *= -1;
          }

          // Parallax movement based on mouse position
          const mouseX = (mouseRef.current.x - canvas.width / 2) * 0.0005 * element.layer;
          const mouseY = (mouseRef.current.y - canvas.height / 2) * 0.0005 * element.layer;
          element.x += mouseX;
          element.y += mouseY;

          // Wrap stars around screen
          if (element.x < 0) element.x = canvas.width;
          if (element.x > canvas.width) element.x = 0;
          if (element.y < 0) element.y = canvas.height;
          if (element.y > canvas.height) element.y = 0;
        } else if (element.type === 'nebula') {
          // Update nebula orbit
          element.orbitAngle! += element.orbitSpeed!;
          element.x = canvas.width / 2 + Math.cos(element.orbitAngle!) * element.orbitRadius!;
          element.y = canvas.height / 2 + Math.sin(element.orbitAngle!) * element.orbitRadius!;
          element.rotation! += 0.0001;
        }

        drawElement(element);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div id="space-background" className="fixed inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
} 