import React from 'react';
import { motion } from 'framer-motion';

interface SocialCardProps {
  platform: string;
  followers: string;
  growth: string;
  icon: string;
}

export const SocialCard: React.FC<SocialCardProps> = ({ platform, followers, growth, icon }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${icon} text-2xl`} />
        <span className={`text-sm ${
          growth.startsWith('+') ? 'text-green-500' : 'text-red-500'
        }`}>
          {growth}
        </span>
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm">{platform}</h3>
      <p className="text-2xl font-bold mt-1">{followers}</p>
      <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          className="h-full bg-blue-500 rounded"
        />
      </div>
    </motion.div>
  );
}