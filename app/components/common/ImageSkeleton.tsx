import React from 'react';

export const ImageSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}
      style={{ aspectRatio: '16/9' }}
    />
  );
};