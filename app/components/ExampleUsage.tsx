'use client';

import React from 'react';
import { Unsplashimage } from './common/Unsplashimage';

export const ExampleUsage = () => {
  return (
    <div className="space-y-4">
      <Unsplashimage 
        query="nature"
        className="w-full h-64"
        width={800}
        height={600}
      />
    </div>
  );
};