import { useState, useEffect } from 'react';

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
}

export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    (window.innerWidth > 768 && window.innerWidth <= 1024) ||
    /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent)
  );
}

export function useResponsive() {
  const [state, setState] = useState({
    isMobile: isMobile(),
    isTablet: isTablet(),
  });

  useEffect(() => {
    const handleResize = () => {
      setState({
        isMobile: isMobile(),
        isTablet: isTablet(),
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return state;
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}
