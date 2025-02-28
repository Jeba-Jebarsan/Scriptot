import React, { useState, useEffect } from 'react';
import { isMobile } from './utils/mobile';

export const ResponsiveContainer: React.FC<{
  children: React.ReactNode;
  mobileLayout?: React.ReactNode;
}> = ({ children, mobileLayout }) => {
  const [isOnMobile, setIsOnMobile] = useState(isMobile());
  
  useEffect(() => {
    const checkMobile = () => setIsOnMobile(isMobile());
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isOnMobile && mobileLayout ? mobileLayout : children;
}; 