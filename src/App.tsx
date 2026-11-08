/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Mail,
  Flame,
  Wand2,
} from 'lucide-react';
import { soundFx } from './utils/audio';
import { FloralSparklerCanvas } from './components/FloralSparklerCanvas';
import { BombCracker } from './components/BombCracker';
import { IlluminationOverlay } from './components/IlluminationOverlay';
import { DiyaRow } from './components/DiyaRow';
import { FestiveCrackers } from './components/FestiveCrackers';
import { LoveLetterModal } from './components/LoveLetterModal';
import { SkyLanterns } from './components/SkyLanterns';

export default function App() {
  const [isExploding, setIsExploding] = useState<boolean>(false);
  const [isIlluminated, setIsIlluminated] = useState<boolean>(false);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isWandActive, setIsWandActive] = useState<boolean>(false);
  const [isLetterOpen, setIsLetterOpen] = useState<boolean>(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [slowMoFactor, setSlowMoFactor] = useState<number>(1.0);

  // Sound toggle
  const toggleSound = () => {
    const nextMuted = soundFx.toggleMute();
    setIsMuted(nextMuted);
  };

  // When bomb reaches end of fuse and explodes
  const handleBombExplode = () => {
    // Drop physics speed factor to 0.4 for rich cinematic slow-motion fireworks
    setSlowMoFactor(0.38);
    setIsExploding(true);
    setIsIlluminated(true);
    setIsExploded(true);

    // Return to normal speed gradually
    setTimeout(() => {
      setSlowMoFactor(0.75);
    }, 2800);
    setTimeout(() => {
      setSlowMoFactor(1.0);
    }, 5500);
  };

  const handleResetBomb = () => {
    setIsExploding(false);
    setIsIlluminated(false);
    setIsExploded(false);
    setSlowMoFactor(1.0);
  };

  // Trigger floating hearts shower from love letter
  const handleSendHearts = () => {
    soundFx.playSparklerChime();
    const newHearts = Array.from({ length: 24 }).map((_, i) => ({
      id: Date.now() + i,
      x: 10 + Math.random() * 80,
      y: 80 + Math.random() * 20,
    }));
    setFloatingHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setFloatingHearts([]);
    }, 4000);
  };

  // Sparkler wand toggle
  const handleToggleWand = () => {
    setIsWandActive((prev) => !prev);
    soundFx.playSparklerChime();
  };

  return (
    <div className="min-h-screen bg-[#07050d] text-amber-50 relative overflow-x-hidden font-sans selection:bg-amber-500/30">
      {/* Dynamic Background Sparkler & Fireworks Canvas */}
      <FloralSparklerCanvas
        isExploding={isExploding}
        slowMoFactor={slowMoFactor}
        isWandActive={isWandActive}
        onExplosionComplete={() => {
          setIsExploding(false);
        }}
      />

      {/* Ambient Sky Lanterns */}
      <SkyLanterns />

      {/* Floating Hearts Animation */}
      {floatingHearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 1, scale: 0.5, y: `${h.y}vh`, x: `${h.x}vw` }}
          animate={{
            opacity: 0,
            scale: [0.5, 1.4, 1.2],
            y: `${h.y - 70}vh`,
            x: `${h.x + (Math.random() - 0.5) * 15}vw`,
          }}
          transition={{ duration: 3.5, ease: 'easeOut' }}
          className="fixed pointer-events-none z-50 text-rose-500"
        >
          <Heart className="w-8 h-8 fill-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.9)]" />
        </motion.div>
      ))}

      {/* Top Bar Contract (3-Zone Header) */}
      <header className="relative z-30 flex items-center justify-between gap-8 px-6 py-4 border-b border-amber-900/30 backdrop-blur-md bg-stone-950/40">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-base sm:text-lg font-bold font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400">
            Dr. Trunali & Amit
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-medium text-amber-200/80">
          <a
            href="#celebration"
            className="hover:text-amber-100 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            Floral Sparklers
          </a>
          <a
            href="#bomb"
            className="hover:text-amber-100 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            Grand Bomb
          </a>
          <a
            href="#diyas"
            className="hover:text-amber-100 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            Light Diyas
          </a>
          <button
            onClick={() => setIsLetterOpen(true)}
            className="hover:text-amber-100 hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            Amit&apos;s Note
          </button>
        </nav>

        {/* Zone 3: Primary Action - Audio & Wand Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute firecracker audio' : 'Mute firecracker audio'}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-amber-200 bg-amber-950/60 border border-amber-500/30 rounded-full hover:bg-amber-900/60 transition-colors whitespace-nowrap shrink-0"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Sound Off</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline">Festive Audio On</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="relative z-20 pb-20">
        {/* HERO SECTION: Happy Diwali + Floral Sparkler Effect */}
        <section
          id="celebration"
          className="relative max-w-4xl mx-auto px-4 pt-12 sm:pt-16 pb-8 text-center flex flex-col items-center"
        >
          {/* Subtle Royal Garland Kicker */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/50 border border-amber-400/30 text-amber-300 text-xs font-medium backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.25)] mb-4"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Festival of Lights Celebration</span>
            <span aria-hidden="true">·</span>
            <span>Warmest Diwali Wishes</span>
          </motion.div>

          {/* Grand Happy Diwali Display Title with Floral Sparkler Glow */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-5xl sm:text-7xl md:text-8xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-yellow-500 glow-diwali-title drop-shadow-[0_0_40px_rgba(251,191,36,0.7)]"
          >
            Happy Diwali
          </motion.h1>

          {/* Heartfelt Personalized Dedication */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-4 flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-serif text-amber-200">
              <span>From Amit to</span>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-400 underline decoration-amber-400/50 decoration-wavy underline-offset-4">
                Dr. Trunali
              </span>
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 inline" />
            </div>

            <p className="mt-3 text-sm sm:text-base text-amber-200/80 font-sans max-w-xl text-center leading-relaxed">
              To the wonderful doctor who heals hearts with her warmth and brings light to everyone.
              May your life sparkle with the same brilliance and radiance you bring to everyone around you.
            </p>
          </motion.div>

          {/* Quick Action Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsLetterOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-amber-200 text-xs font-medium transition-all shadow-md"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Read Amit&apos;s Note</span>
            </button>

            <button
              onClick={handleToggleWand}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all shadow-md ${
                isWandActive
                  ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                  : 'bg-stone-900/60 hover:bg-stone-800/80 border-amber-500/30 text-amber-200'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isWandActive ? 'Wand Active (Draw!)' : 'Draw with Sparkler'}</span>
            </button>
          </div>
        </section>

        {/* SECTION: The Diwali Bomb Cracker (Requested Centerpiece) */}
        <section id="bomb" className="relative max-w-2xl mx-auto px-4 py-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-amber-400 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Slow-Mo Celebration Bomb</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-100 mt-1">
            Ignite the Grand Dhamaka
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/70 font-sans mt-1 max-w-md mx-auto">
            Click the bomb below to watch the slow-motion spark sizzle down the fuse and unleash a
            full-screen illumination fireworks spectacle!
          </p>

          {/* Interactive Bomb Component */}
          <BombCracker
            onExplode={handleBombExplode}
            isExploded={isExploded}
            onReset={handleResetBomb}
          />
        </section>

        {/* SECTION: Interactive Diyas */}
        <div id="diyas">
          <DiyaRow />
        </div>

        {/* SECTION: Sparkler Wand & Mini Crackers (Anar & Chakri) */}
        <FestiveCrackers
          onSpawnFountain={(_x, _y) => {
            soundFx.playSparklerChime();
          }}
          isWandActive={isWandActive}
          onToggleWand={handleToggleWand}
        />

        {/* Special Doctor Tribute Card */}
        <section className="max-w-3xl mx-auto px-4 mt-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-amber-950/30 via-[#22102e]/50 to-amber-950/30 p-6 sm:p-8 border border-amber-500/30 backdrop-blur-md text-center shadow-xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-serif text-amber-100">
              For Dr. Trunali
            </h3>

            <p className="mt-2 text-sm sm:text-base text-amber-200/90 font-serif italic max-w-lg mx-auto leading-relaxed">
              &ldquo;You cure pain by day, spread healing with every gesture, and light up the world around you.
              May this Diwali shower you with infinite joy, strength, and wonderful moments.&rdquo;
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-amber-300 font-sans">
              <span>Warmly, Amit</span>
              <span aria-hidden="true">·</span>
              <span>Diwali 2026</span>
            </div>
          </div>
        </section>
      </main>

      {/* Full-Screen Illumination Overlay (When Bomb Explodes) */}
      <IlluminationOverlay
        isVisible={isIlluminated}
        onDismiss={() => setIsIlluminated(false)}
        onOpenLetter={() => {
          setIsIlluminated(false);
          setIsLetterOpen(true);
        }}
      />

      {/* Love Letter Modal */}
      <LoveLetterModal
        isOpen={isLetterOpen}
        onClose={() => setIsLetterOpen(false)}
        onSendHearts={handleSendHearts}
      />

      {/* Footer */}
      <footer className="relative z-20 border-t border-amber-900/30 py-6 text-center text-xs text-amber-300/60 font-sans bg-stone-950/50">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Crafted with warm wishes by Amit for Dr. Trunali · Shubh Deepavali
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLetterOpen(true)}
              className="text-amber-300 hover:text-amber-100 transition-colors"
            >
              Open Diwali Note
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleToggleWand}
              className="text-amber-300 hover:text-amber-100 transition-colors"
            >
              Sparkler Mode
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
