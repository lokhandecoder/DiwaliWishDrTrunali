import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Lantern {
  id: number;
  xPercent: number;
  duration: number;
  delay: number;
  message: string;
  size: number;
}

const INITIAL_LANTERNS: Lantern[] = [
  { id: 1, xPercent: 12, duration: 18, delay: 0, message: 'Health & Smiles', size: 38 },
  { id: 2, xPercent: 82, duration: 22, delay: 2, message: 'Joy & Light', size: 42 },
  { id: 3, xPercent: 28, duration: 25, delay: 6, message: 'Dr. Trunali & Amit', size: 45 },
  { id: 4, xPercent: 70, duration: 20, delay: 10, message: 'Endless Warmth', size: 36 },
  { id: 5, xPercent: 48, duration: 24, delay: 14, message: 'Brightest Tomorrow', size: 40 },
];

export const SkyLanterns: React.FC = () => {
  const [lanterns, setLanterns] = useState<Lantern[]>(INITIAL_LANTERNS);
  const [customWish, setCustomWish] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);

  const launchCustomLantern = (e: React.FormEvent) => {
    e.preventDefault();
    const wishText = customWish.trim() || 'A Beautiful Diwali with Dr. Trunali';
    soundFx.playDiyaLight(1);

    const newLantern: Lantern = {
      id: Date.now(),
      xPercent: Math.random() * 70 + 15,
      duration: 16 + Math.random() * 6,
      delay: 0,
      message: wishText,
      size: 44,
    };

    setLanterns((prev) => [...prev, newLantern]);
    setCustomWish('');
    setShowInput(false);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-15 overflow-hidden">
      {/* Floating lanterns */}
      {lanterns.map((lantern) => (
        <motion.div
          key={lantern.id}
          initial={{ y: '110vh', opacity: 0, x: `${lantern.xPercent}vw` }}
          animate={{
            y: '-20vh',
            opacity: [0, 0.9, 0.95, 0.7, 0],
            x: [
              `${lantern.xPercent}vw`,
              `${lantern.xPercent + (Math.sin(lantern.id) * 4)}vw`,
              `${lantern.xPercent - (Math.cos(lantern.id) * 3)}vw`,
            ],
          }}
          transition={{
            duration: lantern.duration,
            delay: lantern.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute flex flex-col items-center pointer-events-auto cursor-pointer group"
          title={lantern.message}
        >
          {/* Glowing Lantern Body */}
          <div
            className="rounded-t-2xl rounded-b-md bg-gradient-to-t from-red-600 via-amber-500 to-yellow-300 p-1 flex flex-col items-center justify-between shadow-[0_0_25px_rgba(245,158,11,0.85)] border border-amber-200/50"
            style={{ width: `${lantern.size}px`, height: `${lantern.size * 1.3}px` }}
          >
            {/* Inner flame light */}
            <div className="w-2.5 h-4 bg-white rounded-full shadow-[0_0_10px_#FFF] animate-pulse mt-auto mb-1" />
          </div>

          {/* Candle glow underneath */}
          <div className="w-3 h-1 bg-amber-400 rounded-full blur-[1px]" />

          {/* Tag Wish */}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-amber-200 bg-stone-950/80 px-2 py-0.5 rounded-full border border-amber-500/40 whitespace-nowrap mt-1 pointer-events-none">
            {lantern.message}
          </span>
        </motion.div>
      ))}

      {/* Floating Action Button to Release a Wish Lantern */}
      <div className="absolute bottom-6 right-6 pointer-events-auto z-30">
        <AnimatePresence>
          {showInput ? (
            <motion.form
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onSubmit={launchCustomLantern}
              className="bg-[#1c0f2b] p-3 rounded-2xl border border-amber-400/40 shadow-2xl flex items-center gap-2 max-w-xs"
            >
              <input
                type="text"
                placeholder="Write a sweet wish..."
                value={customWish}
                onChange={(e) => setCustomWish(e.target.value)}
                maxLength={30}
                className="bg-black/40 text-xs text-amber-100 placeholder-amber-300/40 px-3 py-1.5 rounded-xl border border-amber-500/30 focus:outline-none focus:border-amber-400 w-44"
                autoFocus
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 hover:scale-105 transition-transform"
                title="Release Sky Lantern"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowInput(false)}
                className="text-xs text-amber-300/60 hover:text-amber-200 px-1"
              >
                ✕
              </button>
            </motion.form>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-amber-950/80 hover:bg-amber-900/90 text-amber-200 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-xs font-medium backdrop-blur-md transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Release Sky Lantern</span>
            </button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
