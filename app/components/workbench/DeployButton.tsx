import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeployButtonProps {
  onSelectNetlify: () => void;
  onSelectVercel: () => void;
}

export function DeployButton({ onSelectNetlify, onSelectVercel }: DeployButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium transition-colors"
      >
        Deploy
        <div className={`i-ph:caret-down transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute right-0 mt-1 w-40 bg-bolt-elements-background rounded-lg shadow-lg border border-bolt-elements-borderColor z-50"
            >
              <button
                onClick={() => {
                  onSelectNetlify();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2"
              >
                <div className="i-simple-icons:netlify text-[#00AD9F]" />
                Deploy to Netlify
              </button>
              <button
                onClick={() => {
                  onSelectVercel();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2"
              >
                <div className="i-simple-icons:vercel" />
                Deploy to Vercel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 