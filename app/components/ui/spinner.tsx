import React from 'react';
import { classNames } from '~/utils/classNames';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={classNames(
        'animate-spin rounded-full border-t-transparent',
        {
          'w-4 h-4 border-2': size === 'sm',
          'w-6 h-6 border-2': size === 'md',
          'w-8 h-8 border-3': size === 'lg',
        },
        'border-current',
        className
      )}
    />
  );
} 