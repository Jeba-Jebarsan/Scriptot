import React from 'react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold">
            Social Dashboard
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="i-ph:bell text-xl" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="i-ph:gear text-xl" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          </motion.div>
        </div>
      </div>
    </header>
  );
};
