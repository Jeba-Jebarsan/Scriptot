import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { classNames } from '~/utils/classNames';

interface DeploymentDropdownProps {
  onSelectNetlify: () => void;
  onSelectVercel: () => void;
}

export function DeploymentDropdown({ onSelectNetlify, onSelectVercel }: DeploymentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover',
          'text-bolt-elements-button-primary-text text-sm font-medium'
        )}
      >
        <div className="i-ph:rocket-launch" />
        Deploy
        <div className={`i-ph:caret-down transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor z-50"
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    onSelectNetlify();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundHover"
                >
                  <div className="i-simple-icons:netlify text-[#00AD9F]" />
                  Deploy to Netlify
                </button>
                <button
                  onClick={() => {
                    onSelectVercel();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundHover"
                >
                  <div className="i-simple-icons:vercel" />
                  Deploy to Vercel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 