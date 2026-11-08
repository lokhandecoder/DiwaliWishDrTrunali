import React, { useEffect, useRef } from 'react';
import { soundFx } from '../utils/audio';

export interface FloralSparklerCanvasProps {
  isExploding: boolean;
  slowMoFactor: number;
  isWandActive: boolean;
  onExplosionComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  decay: number;
  gravity: number;
  drag: number;
  flicker: boolean;
  sparkleSpeed: number;
  shape?: 'spark' | 'star' | 'petal' | 'heart' | 'ring';
  rotation?: number;
  rotationSpeed?: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  lineWidth: number;
}

export const FloralSparklerCanvas: React.FC<FloralSparklerCanvasProps> = ({
  isExploding,
  slowMoFactor,
  isWandActive,
  onExplosionComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const floralTimeRef = useRef<number>(0);
  const mousePosRef = useRef<{ x: number; y: number; isDown: boolean }>({ x: 0, y: 0, isDown: false });
  const prevExplodingRef = useRef<boolean>(false);
  const explosionTimerRef = useRef<number | null>(null);

  // Colors for Diwali floral sparklers
  const goldPalette = ['#FFF4D0', '#FFD700', '#FFA500', '#FF7F50', '#FF4500', '#F59E0B', '#FBBF24', '#F43F5E'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initial ambient golden fireflies
    for (let i = 0; i < 40; i++) {
      particlesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.4,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.7 + 0.2,
        color: Math.random() > 0.4 ? '#FBBF24' : '#FDE68A',
        decay: 0.0003,
        gravity: -0.01,
        drag: 0.99,
        flicker: true,
        sparkleSpeed: Math.random() * 0.05 + 0.02,
        shape: 'spark',
      });
    }

    // Animation Loop
    const render = () => {
      floralTimeRef.current += 0.02 * slowMoFactor;
      const t = floralTimeRef.current;

      // Subtle clear trail for sparkler motion blur
      ctx.fillStyle = isExploding
        ? 'rgba(7, 5, 13, 0.15)'
        : 'rgba(7, 5, 13, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // 1. GENERATE CONTINUOUS FLORAL SPARKLER EFFECT AROUND HERO CENTER
      // Creates an intricate blooming mathematical rose (polar curve) emitting bright sparks
      if (!isExploding) {
        const centerX = width / 2;
        // Position floral sparkler near the upper-middle of hero section
        const centerY = Math.min(height * 0.38, 320);

        // Petals formula: 6-petaled rose r = a * cos(k * theta)
        const petals = 6;
        const numEmitters = 3;
        for (let e = 0; e < numEmitters; e++) {
          const theta = t * 1.5 + (e * Math.PI * 2) / numEmitters;
          const r = (110 + Math.sin(t * 3) * 25) * Math.cos(petals * theta * 0.5);
          const px = centerX + r * Math.cos(theta);
          const py = centerY + r * Math.sin(theta);

          // Spawn sparkler sparks
          for (let s = 0; s < 2; s++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = (Math.random() * 3 + 1.2);
            particlesRef.current.push({
              x: px,
              y: py,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed + 0.3,
              size: Math.random() * 2.5 + 0.8,
              alpha: 1,
              color: goldPalette[Math.floor(Math.random() * goldPalette.length)],
              decay: Math.random() * 0.025 + 0.02,
              gravity: 0.04,
              drag: 0.96,
              flicker: true,
              sparkleSpeed: 0.15,
              shape: 'spark',
            });
          }
        }
      }

      // 2. RENDER SHOCKWAVES
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += (sw.maxRadius - sw.radius) * (0.04 * slowMoFactor);
        sw.alpha -= 0.012 * slowMoFactor;

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, Math.max(1, sw.radius), 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = sw.lineWidth * sw.alpha;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.shadowColor = '#FBBF24';
        ctx.shadowBlur = 30;
        ctx.stroke();
        ctx.restore();

        if (sw.alpha <= 0.01 || sw.radius >= sw.maxRadius * 0.98) {
          shockwavesRef.current.splice(i, 1);
        }
      }

      // 3. RENDER PARTICLES
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        // Apply physics scaled by slowMoFactor for dramatic slow-motion explosion!
        p.x += p.vx * slowMoFactor;
        p.y += p.vy * slowMoFactor;
        p.vy += p.gravity * slowMoFactor;
        p.vx *= Math.pow(p.drag, slowMoFactor);
        p.vy *= Math.pow(p.drag, slowMoFactor);
        p.alpha -= p.decay * slowMoFactor;

        if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
          p.rotation += p.rotationSpeed * slowMoFactor;
        }

        // Particle flicker
        let currentAlpha = p.alpha;
        if (p.flicker) {
          currentAlpha *= 0.6 + Math.sin(floralTimeRef.current * 15 + i) * 0.4;
        }

        if (currentAlpha <= 0 || p.alpha <= 0 || p.x < -100 || p.x > width + 100 || p.y > height + 100) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));

        if (p.shape === 'heart') {
          // Heart shaped particles for romantic touch
          ctx.translate(p.x, p.y);
          if (p.rotation) ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          const s = p.size;
          ctx.moveTo(0, s * 0.3);
          ctx.bezierCurveTo(-s, -s * 0.5, -s * 1.5, s * 0.4, 0, s * 1.5);
          ctx.bezierCurveTo(s * 1.5, s * 0.4, s, -s * 0.5, 0, s * 0.3);
          ctx.fill();
        } else if (p.shape === 'star') {
          // 4-pointed sparkler star
          ctx.translate(p.x, p.y);
          if (p.rotation) ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.shadowColor = '#FFF';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          const s = p.size * 2;
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();
        } else {
          // Glowing round spark
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.size > 2 ? 14 : 6;
          ctx.fill();

          // White-hot core for real sparkler brilliance
          if (p.size > 1.8) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
          }
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isExploding, slowMoFactor]);

  // Handle Explosion Trigger
  useEffect(() => {
    if (isExploding && !prevExplodingRef.current) {
      prevExplodingRef.current = true;
      triggerSlowMoExplosion();
    } else if (!isExploding) {
      prevExplodingRef.current = false;
    }
  }, [isExploding]);

  // Massive full-screen slow-motion explosion sequence!
  const triggerSlowMoExplosion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height * 0.55; // Bomb location

    // Sound FX
    soundFx.playBombExplosion();

    // 1. Shockwaves expanding
    shockwavesRef.current.push(
      {
        x: centerX,
        y: centerY,
        radius: 10,
        maxRadius: Math.max(width, height) * 1.2,
        alpha: 1,
        color: '#FFFFFF',
        lineWidth: 18,
      },
      {
        x: centerX,
        y: centerY,
        radius: 5,
        maxRadius: Math.max(width, height) * 0.9,
        alpha: 0.85,
        color: '#F59E0B',
        lineWidth: 12,
      },
      {
        x: centerX,
        y: centerY,
        radius: 2,
        maxRadius: Math.max(width, height) * 0.7,
        alpha: 0.7,
        color: '#EC4899',
        lineWidth: 8,
      }
    );

    // 2. Primary Core Burst (High velocity slow-motion golden particles)
    const primaryCount = 350;
    for (let i = 0; i < primaryCount; i++) {
      const angle = (i / primaryCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const speed = Math.random() * 12 + 3;
      const colors = ['#FFFBEB', '#FDE68A', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#10B981'];
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 1.5,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        decay: Math.random() * 0.006 + 0.003, // Ultra slow decay for slow-mo
        gravity: 0.02,
        drag: 0.985,
        flicker: true,
        sparkleSpeed: 0.2,
        shape: Math.random() > 0.7 ? 'star' : 'spark',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      });
    }

    // 3. Heart & Floral Rings for Dr. Trunali
    const heartCount = 60;
    for (let i = 0; i < heartCount; i++) {
      const t = (i / heartCount) * Math.PI * 2;
      // Parametric heart formula
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const scale = 0.45;
      particlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: hx * scale,
        vy: hy * scale,
        size: Math.random() * 4 + 3,
        alpha: 1,
        color: i % 2 === 0 ? '#FB7185' : '#F43F5E',
        decay: 0.004,
        gravity: 0.015,
        drag: 0.988,
        flicker: true,
        sparkleSpeed: 0.1,
        shape: 'heart',
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    // 4. Staggered secondary bursts all over the screen!
    const burstLocations = [
      { x: width * 0.2, y: height * 0.25 },
      { x: width * 0.8, y: height * 0.25 },
      { x: width * 0.15, y: height * 0.65 },
      { x: width * 0.85, y: height * 0.65 },
      { x: width * 0.35, y: height * 0.18 },
      { x: width * 0.65, y: height * 0.18 },
    ];

    burstLocations.forEach((loc, index) => {
      setTimeout(() => {
        soundFx.playSparklerChime();
        for (let j = 0; j < 80; j++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 7 + 2;
          const palette = index % 2 === 0
            ? ['#FDE047', '#EAB308', '#F97316', '#EF4444']
            : ['#F472B6', '#EC4899', '#A855F7', '#6366F1'];
          particlesRef.current.push({
            x: loc.x,
            y: loc.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 3 + 1,
            alpha: 1,
            color: palette[Math.floor(Math.random() * palette.length)],
            decay: Math.random() * 0.008 + 0.004,
            gravity: 0.025,
            drag: 0.98,
            flicker: true,
            sparkleSpeed: 0.2,
            shape: 'star',
          });
        }
      }, 300 + index * 180);
    });

    // Notify parent on completion
    if (explosionTimerRef.current) clearTimeout(explosionTimerRef.current);
    explosionTimerRef.current = window.setTimeout(() => {
      if (onExplosionComplete) onExplosionComplete();
    }, 6000);
  };

  // Sparkler wand interaction (mouse / touch move)
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosRef.current = { x, y, isDown: true };

    if (isWandActive) {
      soundFx.playSparklerChime();
      // Emit vibrant sparkler embers around pointer
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          size: Math.random() * 2.8 + 1,
          alpha: 1,
          color: goldPalette[Math.floor(Math.random() * goldPalette.length)],
          decay: Math.random() * 0.03 + 0.015,
          gravity: 0.08,
          drag: 0.95,
          flicker: true,
          sparkleSpeed: 0.25,
          shape: Math.random() > 0.8 ? 'star' : 'spark',
        });
      }
    }
  };

  // Click anywhere to burst a mini sparkler
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // If not clicking a UI button (handled via pointer event on canvas background)
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    soundFx.playSparklerChime();
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
        alpha: 1,
        color: goldPalette[Math.floor(Math.random() * goldPalette.length)],
        decay: Math.random() * 0.02 + 0.01,
        gravity: 0.05,
        drag: 0.96,
        flicker: true,
        sparkleSpeed: 0.2,
        shape: Math.random() > 0.6 ? 'star' : 'spark',
      });
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      className={`fixed inset-0 pointer-events-auto z-10 transition-opacity duration-700 ${
        isWandActive ? 'cursor-crosshair' : 'cursor-default'
      }`}
      style={{ touchAction: 'none' }}
    />
  );
};
