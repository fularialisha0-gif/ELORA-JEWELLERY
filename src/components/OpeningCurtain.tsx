import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EloraEmblem } from './EloraEmblem';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export const OpeningCurtain: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(!prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(false);
      return;
    }
    const timer = window.setTimeout(() => setVisible(false), 950);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#12060A] pointer-events-none"
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <EloraEmblem size="lg" />
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D8A384] to-transparent" />
            <span className="font-serif italic text-sm tracking-[0.22em] text-[#E8C5B0]">
              Beyond the Ordinary
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
