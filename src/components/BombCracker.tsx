import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Flame, RotateCcw } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface BombCrackerProps {
  onExplode: () => void;
  isExploded: boolean;
  onReset: () => void;
}

export const BombCracker: React.FC<BombCrackerProps> = ({
  onExplode,
  isExploded,
  onReset,
}) => {
  // states: 'idle' | 'ignited' | 'countdown' | 'exploding' | 'exploded'
  const [bombState, setBombState] = useState<'idle' | 'ignited' | 'exploded'>('idle');
  const [fuseProgress, setFuseProgress] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (!isExploded && bombState === 'exploded') {
      setBombState('idle');
      setFuseProgress(0);
      setCountdown(null);
    }
  }, [isExploded, bombState]);

  const handleIgnite = () => {
    if (bombState !== 'idle') return;

    setBombState('ignited');
    setCountdown(3);

    // Play sound of sizzling fuse
    const fuseAudio = soundFx.playFuseSound(3200);

    // Animate fuse burning down in dramatic slow motion
    const startTime = Date.now();
    const duration = 3200;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setFuseProgress(progress);

      const remainingSec = Math.ceil((duration - elapsed) / 1000);
      if (remainingSec > 0) {
        setCountdown(remainingSec);
      }

      if (progress >= 100) {
        clearInterval(interval);
        fuseAudio.stop();

        // Slow motion breath/tension right before blast
        soundFx.playSlowMoTension();
        setCountdown(null);

        // Explode!
        setTimeout(() => {
          setBombState('exploded');
          onExplode();
        }, 300);
      }
    }, 40);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBombState('idle');
    setFuseProgress(0);
    setCountdown(null);
    onReset();
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-6 select-none">
      {/* Glow Aura behind Bomb */}
      <div
        className={`absolute -inset-10 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
          bombState === 'ignited'
            ? 'bg-amber-500/40 scale-125 animate-pulse'
            : 'bg-amber-600/15 scale-100'
        }`}
      />

      {/* Main Interactive Bomb Container */}
      <motion.div
        whileHover={bombState === 'idle' ? { scale: 1.05 } : {}}
        whileTap={bombState === 'idle' ? { scale: 0.95 } : {}}
        onClick={handleIgnite}
        className={`relative z-20 cursor-pointer flex flex-col items-center group transition-transform ${
          bombState === 'ignited' ? 'animate-bounce' : ''
        }`}
        style={{ animationDuration: '0.8s' }}
      >
        {/* Fuse (Rope & Spark) */}
        <div className="relative w-2 h-16 flex flex-col items-center">
          {/* Unburned rope */}
          <div className="w-1.5 h-full bg-gradient-to-b from-stone-600 via-stone-700 to-amber-900 rounded-full shadow-inner relative overflow-hidden border border-amber-950/60">
            {/* Burn progress (darkens as burned) */}
            <div
              className="w-full bg-stone-900 transition-all duration-75"
              style={{ height: `${fuseProgress}%` }}
            />
          </div>

          {/* Sizzling Spark at the current fuse position */}
          {bombState === 'ignited' && (
            <motion.div
              className="absolute -left-3 flex items-center justify-center z-30"
              style={{
                top: `${fuseProgress}%`,
                transform: 'translateY(-50%)',
              }}
              animate={{ rotate: 360, scale: [1, 1.4, 0.9, 1.3] }}
              transition={{ repeat: Infinity, duration: 0.25 }}
            >
              {/* Outer bright glow */}
              <div className="w-8 h-8 rounded-full bg-amber-400/60 blur-sm animate-ping absolute" />
              {/* Core intense spark */}
              <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_#F59E0B] relative flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-200 animate-pulse" />
              </div>
            </motion.div>
          )}

          {/* Idle prompt flame icon pointing to fuse */}
          {bombState === 'idle' && (
            <motion.div
              className="absolute -top-6 text-amber-400 flex flex-col items-center"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <Flame className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] fill-amber-400" />
            </motion.div>
          )}
        </div>

        {/* The Bomb Body (Traditional Sutli / Laxmi Royal Bomb) */}
        <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-stone-950 shadow-2xl border-2 border-emerald-700/60 flex items-center justify-center overflow-hidden transition-shadow group-hover:shadow-[0_0_35px_rgba(245,158,11,0.5)]">
          {/* Sutli Twine / Jute Thread Overlay Texture */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #10b981 0, #10b981 2px, transparent 2px, transparent 12px), repeating-linear-gradient(-45deg, #059669 0, #059669 2px, transparent 2px, transparent 12px)',
            }}
          />

          {/* Golden Center Label */}
          <div className="relative z-10 w-28 h-28 md:w-32 md:h-32 rounded-xl bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 shadow-lg border border-amber-300">
            <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-[#7f1d1d] via-[#991b1b] to-[#450a0a] p-2 flex flex-col items-center justify-center text-center border border-amber-300/40">
              <span className="text-[10px] tracking-widest uppercase font-bold text-amber-300/90 font-sans">
                SPECIAL DHAMAKA
              </span>
              <h4 className="text-sm md:text-base font-bold text-amber-100 font-serif leading-tight mt-0.5 drop-shadow">
                Dr. Trunali
              </h4>
              <div className="w-12 h-0.5 bg-amber-400/70 my-1 rounded-full" />
              <p className="text-[9px] md:text-[10px] text-amber-200 font-sans font-medium leading-tight">
                Warm Wishes From Amit
              </p>
              <div className="mt-1 flex items-center gap-1 text-[9px] text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-400/30">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                <span>1000x Spark</span>
              </div>
            </div>
          </div>

          {/* Glossy corner highlights */}
          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-12 h-12 bg-amber-400/10 rounded-full blur-md pointer-events-none" />
        </div>

        {/* Slow-Motion Countdown Pill Overlay */}
        <AnimatePresence>
          {bombState === 'ignited' && countdown !== null && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              key={countdown}
              className="absolute -top-12 z-30 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-stone-950 font-black text-xl px-4 py-1 rounded-full shadow-[0_0_20px_#F59E0B] font-display flex items-center gap-1.5"
            >
              <span>Slow-Mo Spark: {countdown}...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Prompt CTA Button */}
        <div className="mt-4 flex flex-col items-center">
          {bombState === 'idle' && (
            <div className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-stone-950 font-semibold text-sm shadow-[0_0_25px_rgba(245,158,11,0.6)] group-hover:shadow-[0_0_35px_rgba(245,158,11,0.85)] transition-all transform group-hover:-translate-y-0.5 active:translate-y-0">
              <Flame className="w-4 h-4 text-stone-950 fill-stone-950 animate-bounce" />
              <span>Click to Light Bomb for Dr. Trunali</span>
            </div>
          )}

          {bombState === 'ignited' && (
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-300 uppercase animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Fuse burning in slow motion... watch the magic!</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Relight button if already exploded */}
      {isExploded && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleReset}
          className="mt-4 flex items-center gap-2 px-4 py-2 text-xs font-medium text-amber-300 bg-amber-950/60 border border-amber-600/40 rounded-full hover:bg-amber-900/60 transition-colors shadow-lg"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Light the Bomb Again</span>
        </motion.button>
      )}
    </div>
  );
};
