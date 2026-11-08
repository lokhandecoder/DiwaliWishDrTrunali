import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, Sparkles, Feather } from 'lucide-react';

interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendHearts: () => void;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({
  isOpen,
  onClose,
  onSendHearts,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Letter Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-xl max-h-[85vh] overflow-y-auto bg-gradient-to-b from-[#241223] via-[#1a0e1c] to-[#120715] rounded-3xl p-5 sm:p-8 border border-amber-400/40 shadow-[0_0_60px_rgba(245,158,11,0.35)] text-amber-50 my-auto pb-safe"
          >
            {/* iOS Mobile Grab Handle */}
            <div className="w-12 h-1 bg-amber-400/30 rounded-full mx-auto -mt-1 mb-4 sm:hidden" />

            {/* Close Button with 44px touch target */}
            <button
              onClick={onClose}
              aria-label="Close Note"
              className="absolute top-3 right-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-amber-300/70 hover:text-amber-100 hover:bg-white/10 rounded-full transition-colors active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Letter Header */}
            <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Feather className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold">
                  A Heartfelt Diwali Note
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-100">
                  To Dearest Dr. Trunali
                </h3>
              </div>
            </div>

            {/* Letter Body */}
            <div className="space-y-4 font-serif text-amber-100/90 text-sm sm:text-base leading-relaxed">
              <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-amber-400 first-letter:mr-1">
                Dearest Trunali,
              </p>

              <p>
                In a world that can often feel chaotic, you spend your days bringing healing, comfort,
                and life-saving care to those who need it most. Watching your dedication, sharp intellect,
                and tender empathy as a doctor inspires me more than words can express.
              </p>

              <p>
                They say Diwali is the triumph of light over darkness and warmth over cold.
                To me, you are that very light. Your laughter has a way of dissolving all my stress,
                and your presence turns even the simplest conversation into something extraordinary.
              </p>

              <p>
                As thousands of diyas flicker tonight and fireworks paint the evening sky with gold,
                my only wish is for your days to be filled with endless smiles, calm night shifts, triumphant breakthroughs,
                and all the sweetness life has to offer.
              </p>

              <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 my-3 text-center">
                <p className="font-display text-base sm:text-lg text-amber-300 font-bold">
                  &ldquo;Happy Diwali Dr. Trunali.&rdquo;
                </p>
                <span className="text-xs text-amber-200/70 font-sans mt-1 block">
                  Wishing you the brightest year ahead filled with joy and success.
                </span>
              </div>

              <div className="text-right pt-2 font-serif">
                <p className="text-xs text-amber-300/80 uppercase tracking-widest font-sans">
                  Always with you,
                </p>
                <p className="text-xl font-bold text-amber-200 font-display mt-0.5">
                  Amit ♥
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  onSendHearts();
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(244,63,94,0.5)] hover:scale-105 active:scale-95 transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Shower Floating Hearts for Amit</span>
              </button>

              <button
                onClick={onClose}
                className="text-xs text-amber-300/80 hover:text-amber-200 font-sans transition-colors"
              >
                Close & Enjoy Fireworks
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
