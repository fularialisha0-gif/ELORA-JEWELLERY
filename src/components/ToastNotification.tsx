import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../hooks/useStore';

export const ToastNotification: React.FC = () => {
  const { toastMessage } = useStore();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.22 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-[#1C090F] border border-[#D8A384]/45 text-xs sm:text-sm text-[#F7F1EB] shadow-2xl whitespace-nowrap"
          role="status"
          aria-live="polite"
        >
          {toastMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
