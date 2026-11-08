import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface DiyaWish {
  id: number;
  title: string;
  wish: string;
}

const DIYA_WISHES: DiyaWish[] = [
  {
    id: 1,
    title: 'The Healing Light',
    wish: 'For your brilliant doctor hands and compassionate heart that heals every soul you touch.',
  },
  {
    id: 2,
    title: 'The Golden Smile',
    wish: 'For the laughter that brightens my darkest days and turns ordinary moments into pure joy.',
  },
  {
    id: 3,
    title: 'Endless Success',
    wish: 'May every diagnosis be sharp, every surgery triumphant, and your career reach the pinnacle of glory.',
  },
  {
    id: 4,
    title: 'Endless Peace & Joy',
    wish: 'May warmth, sweet sleep, calm shifts, and boundless good health wrap around you always.',
  },
  {
    id: 5,
    title: 'A Bright Future',
    wish: 'From Amit to Dr. Trunali: may your journey shine brighter with peace, good health, and joyful celebrations.',
  },
];

export const DiyaRow: React.FC = () => {
  // Store which diyas are lit (default first 2 lit so page is already glowing)
  const [litDiyas, setLitDiyas] = useState<number[]>([1, 2]);
  const [activeWish, setActiveWish] = useState<DiyaWish | null>(null);

  const toggleDiya = (id: number) => {
    const isCurrentlyLit = litDiyas.includes(id);
    if (!isCurrentlyLit) {
      soundFx.playDiyaLight(id);
      setLitDiyas((prev) => [...prev, id]);
      const found = DIYA_WISHES.find((w) => w.id === id);
      if (found) setActiveWish(found);
    } else {
      // Show the message even if already lit
      const found = DIYA_WISHES.find((w) => w.id === id);
      if (found) setActiveWish(found);
    }
  };

  const lightAll = () => {
    soundFx.playDiyaLight(3);
    setLitDiyas([1, 2, 3, 4, 5]);
    setActiveWish({
      id: 99,
      title: 'Full Deepotsav of Light',
      wish: 'Every lamp is burning bright for you, Dr. Trunali! Wishing you the happiest Diwali filled with joy and success from Amit!',
    });
  };

  return (
    <section className="relative z-20 max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400/90">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Deepotsav</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold font-serif text-amber-100 mt-1">
          Light a Diya for Dr. Trunali
        </h3>
        <p className="text-xs sm:text-sm text-amber-200/70 font-sans mt-1">
          Click each earthen lamp to ignite its flame and reveal Amit&apos;s special blessing for you
        </p>
      </div>

      {/* Diyas Row */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
        {DIYA_WISHES.map((diya, index) => {
          const isLit = litDiyas.includes(diya.id);

          return (
            <motion.div
              key={diya.id}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleDiya(diya.id)}
              className="group cursor-pointer flex flex-col items-center relative"
            >
              {/* Flame (renders when lit) */}
              <div className="h-12 flex items-end justify-center relative">
                {isLit ? (
                  <div className="relative flex flex-col items-center">
                    {/* Flame glow circle */}
                    <div className="absolute -inset-2 rounded-full bg-amber-400/40 blur-md pointer-events-none animate-pulse" />
                    {/* Outer flame shape */}
                    <div className="w-4 h-9 bg-gradient-to-t from-red-500 via-amber-400 to-yellow-200 rounded-full animate-diya-flame shadow-[0_0_15px_#F59E0B] relative flex items-center justify-center">
                      {/* Inner white-hot wick flame */}
                      <div className="w-1.5 h-5 bg-gradient-to-t from-yellow-100 to-white rounded-full opacity-90" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    {/* Unlit wick */}
                    <div className="w-1 h-3 bg-stone-700 rounded-t-sm" />
                    {/* Gentle prompt click cue */}
                    <span className="text-[10px] text-amber-400/60 font-sans group-hover:text-amber-300 transition-colors">
                      Tap to light
                    </span>
                  </div>
                )}
              </div>

              {/* Ornate Terracotta Clay Diya Body */}
              <div className="relative w-16 sm:w-20 h-8 sm:h-9 rounded-b-full bg-gradient-to-b from-[#b45309] via-[#92400e] to-[#78350f] border-t-2 border-amber-300/60 shadow-[0_4px_15px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden">
                {/* Traditional engraved golden ring pattern */}
                <div className="absolute top-1 w-full flex justify-around px-1.5 opacity-60">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                </div>
                {/* Oil reservoir glow if lit */}
                {isLit && (
                  <div className="w-12 h-2.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 blur-[1px] opacity-80" />
                )}
              </div>

              {/* Base shadow */}
              <div className="w-14 h-2 bg-black/40 rounded-full blur-[2px] mt-0.5" />

              {/* Number / Short Label */}
              <span className="mt-2 text-[11px] font-medium text-amber-200/80 group-hover:text-amber-100 transition-colors text-center font-serif">
                Diya #{index + 1}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Button to Light All at once */}
      {litDiyas.length < 5 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={lightAll}
            className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 px-3.5 py-1.5 rounded-full transition-all"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Light All 5 Diyas at Once</span>
          </button>
        </div>
      )}

      {/* Active Diya Blessing Popup */}
      <AnimatePresence>
        {activeWish && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 mx-auto max-w-lg bg-gradient-to-r from-amber-950/80 via-purple-950/80 to-amber-950/80 border border-amber-400/40 rounded-2xl p-4 sm:p-5 text-center shadow-[0_0_30px_rgba(245,158,11,0.25)] backdrop-blur-md"
          >
            <h4 className="text-amber-300 font-serif font-bold text-base sm:text-lg flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{activeWish.title}</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h4>
            <p className="text-sm text-amber-100/90 font-sans mt-2 leading-relaxed italic">
              &ldquo;{activeWish.wish}&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
