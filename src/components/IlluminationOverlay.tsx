import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, X, Gift } from 'lucide-react';

interface IlluminationOverlayProps {
  isVisible: boolean;
  onDismiss: () => void;
  onOpenLetter: () => void;
}

export const IlluminationOverlay: React.FC<IlluminationOverlayProps> = ({
  isVisible,
  onDismiss,
  onOpenLetter,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center p-4">
          {/* 1. Dramatic Slow-Motion Radiant Screen Illumination (Flash & Glow) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.95, 0.45, 0.65],
              background: [
                'radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(251,191,36,0.9) 35%, rgba(220,38,38,0.7) 100%)',
                'radial-gradient(circle at center, rgba(254,240,138,0.8) 0%, rgba(245,158,11,0.5) 40%, rgba(13,10,24,0.4) 100%)',
                'radial-gradient(circle at center, rgba(251,191,36,0.3) 0%, rgba(180,83,9,0.2) 50%, rgba(7,5,13,0.1) 100%)',
              ],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          />

          {/* 2. Expanding Golden Light Rays */}
          <motion.div
            initial={{ scale: 0.2, rotate: 0, opacity: 0 }}
            animate={{ scale: [0.2, 1.4, 2], rotate: 180, opacity: [0, 0.8, 0.25] }}
            transition={{ duration: 5, ease: 'easeOut' }}
            className="absolute w-[800px] h-[800px] rounded-full pointer-events-none"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, rgba(251,191,36,0.4) 20deg, transparent 40deg, rgba(244,63,94,0.3) 70deg, transparent 90deg, rgba(251,191,36,0.4) 120deg, transparent 150deg, rgba(245,158,11,0.4) 200deg, transparent 240deg, rgba(251,191,36,0.4) 290deg, transparent 330deg)',
              filter: 'blur(16px)',
            }}
          />

          {/* 3. Central Illuminated Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ delay: 0.5, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto relative max-w-lg w-full max-h-[85vh] overflow-y-auto bg-gradient-to-b from-[#1a102f]/98 via-[#130b24]/98 to-[#090514]/99 rounded-3xl p-5 sm:p-8 border border-amber-400/50 shadow-[0_0_80px_rgba(245,158,11,0.5),0_0_120px_rgba(236,72,153,0.3)] backdrop-blur-xl text-center flex flex-col items-center my-auto pb-safe"
          >
            {/* iOS Mobile Grab Handle */}
            <div className="w-12 h-1 bg-amber-400/30 rounded-full mx-auto -mt-1 mb-3 sm:hidden" />

            {/* Dismiss button with 44px touch hitbox */}
            <button
              onClick={onDismiss}
              aria-label="Close Greeting"
              className="absolute top-3 right-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-amber-200/70 hover:text-amber-100 hover:bg-white/10 rounded-full transition-colors active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Golden Top Accent */}
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-300/90 font-sans">
                Full-Screen Illumination
              </span>
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            {/* Main Festive Headline */}
            <h2 className="text-3xl sm:text-4xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] leading-tight">
              Happy Diwali, Dr. Trunali!
            </h2>

            {/* Personalized Dedication */}
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-200 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>To Dr. Trunali · From Amit</span>
            </div>

            {/* Sweet Message */}
            <p className="mt-4 text-amber-100/90 font-serif text-base sm:text-lg leading-relaxed italic max-w-md">
              &ldquo;Just like this firecracker lit up the entire screen with thousands of sparks,
              you bring so much light, warmth, and joy with your grace and radiant smile.&rdquo;
            </p>

            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent my-4" />

            {/* Doctor Note */}
            <p className="text-xs sm:text-sm text-amber-200/80 font-sans leading-relaxed">
              May this festival of lights bring you endless triumph in medicine, eternal happiness,
              boundless energy, and sweetest joy.
            </p>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full">
              <button
                onClick={onOpenLetter}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-semibold text-sm hover:from-amber-400 hover:to-yellow-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] transition-all hover:scale-105 active:scale-95"
              >
                <Gift className="w-4 h-4" />
                <span>Read Amit&apos;s Note</span>
              </button>

              <button
                onClick={onDismiss}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-amber-200 border border-amber-300/30 font-medium text-sm transition-all"
              >
                Enjoy Screen Illumination
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
