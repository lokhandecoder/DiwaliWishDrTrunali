import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame, Wand2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface FestiveCrackersProps {
  onSpawnFountain: (x: number, y: number) => void;
  isWandActive: boolean;
  onToggleWand: () => void;
}

export const FestiveCrackers: React.FC<FestiveCrackersProps> = ({
  onSpawnFountain,
  isWandActive,
  onToggleWand,
}) => {
  const [anarActive, setAnarActive] = useState<boolean>(false);
  const [chakriActive, setChakriActive] = useState<boolean>(false);

  const handleAnarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (anarActive) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([40, 30, 80]);
    }
    setAnarActive(true);
    soundFx.playAnarFountain(3500);

    const rect = e.currentTarget.getBoundingClientRect();
    onSpawnFountain(rect.left + rect.width / 2, rect.top);

    setTimeout(() => {
      setAnarActive(false);
    }, 3800);
  };

  const handleChakriClick = () => {
    if (chakriActive) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([30, 30, 50, 50, 100]);
    }
    setChakriActive(true);
    soundFx.playAnarFountain(3000);

    setTimeout(() => {
      setChakriActive(false);
    }, 3200);
  };

  return (
    <section className="relative z-20 max-w-4xl mx-auto px-4 py-6 sm:py-8 border-t border-amber-900/30">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-amber-950/30 via-purple-950/40 to-amber-950/30 p-5 sm:p-6 rounded-3xl border border-amber-500/20 backdrop-blur-sm">
        {/* Sparkler Wand Controls */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Wand2 className="w-4 h-4 text-amber-400" />
            <span>Magic Phuljhadi (Sparkler Wand)</span>
          </div>
          <h4 className="text-xl font-bold font-serif text-amber-100 mt-1">
            Draw With Light in the Air
          </h4>
          <p className="text-xs text-amber-200/70 font-sans mt-1 max-w-md">
            Activate the sparkler wand and drag your finger across the screen to paint glowing festive sparks!
          </p>
          <div className="mt-3">
            <button
              onClick={onToggleWand}
              className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 rounded-full font-semibold text-xs transition-all shadow-lg active:scale-95 touch-manipulation ${
                isWandActive
                  ? 'bg-amber-400 text-stone-950 shadow-[0_0_20px_#F59E0B] scale-105 font-bold'
                  : 'bg-amber-900/40 text-amber-200 hover:bg-amber-800/60 border border-amber-500/30'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isWandActive ? 'text-stone-950' : 'text-amber-400'}`} />
              <span>{isWandActive ? 'Wand Active (Draw on Screen!)' : 'Turn On Sparkler Wand'}</span>
            </button>
          </div>
        </div>

        {/* Mini Crackers: Anar & Chakri */}
        <div className="flex items-center gap-6">
          {/* Anar (Flowerpot Fountain) */}
          <div className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAnarClick}
              className={`relative cursor-pointer flex flex-col items-center p-2 rounded-xl transition-all ${
                anarActive ? 'shadow-[0_0_30px_#F59E0B]' : ''
              }`}
            >
              {/* Sizzling fountain flame if active */}
              <div className="h-10 flex items-end justify-center">
                {anarActive ? (
                  <motion.div
                    animate={{ scale: [1, 1.4, 1.1, 1.5], opacity: [0.9, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                    className="w-6 h-12 bg-gradient-to-t from-amber-500 via-yellow-300 to-white rounded-full blur-[1px] shadow-[0_0_25px_#FBBF24]"
                  />
                ) : (
                  <Flame className="w-4 h-4 text-amber-400/80 animate-pulse" />
                )}
              </div>

              {/* Conical Pot */}
              <div
                className="w-12 h-14 bg-gradient-to-b from-stone-800 via-amber-900 to-amber-950 rounded-t-sm shadow-md border-b-4 border-amber-500 flex items-center justify-center text-[9px] font-bold text-amber-300 uppercase tracking-tighter"
                style={{
                  clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
                }}
              >
                Anar
              </div>
            </motion.div>
            <span className="text-[11px] font-medium text-amber-200/80 mt-1">
              {anarActive ? 'Fountain Sparkling!' : 'Light Anar Fountain'}
            </span>
          </div>

          {/* Chakri (Ground Spinner) */}
          <div className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChakriClick}
              className="relative cursor-pointer flex flex-col items-center p-2"
            >
              <div className="h-10 flex items-center justify-center">
                <motion.div
                  animate={chakriActive ? { rotate: 1800 } : { rotate: 0 }}
                  transition={chakriActive ? { duration: 3, ease: 'easeOut' } : {}}
                  className={`w-12 h-12 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center shadow-md ${
                    chakriActive
                      ? 'bg-gradient-to-r from-amber-400 via-emerald-400 to-rose-400 shadow-[0_0_25px_#10B981]'
                      : 'bg-stone-900'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                  </div>
                </motion.div>
              </div>
              <div className="w-12 h-2" />
            </motion.div>
            <span className="text-[11px] font-medium text-amber-200/80 mt-1">
              {chakriActive ? 'Spinning Vortex!' : 'Spin Zameen Chakri'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
