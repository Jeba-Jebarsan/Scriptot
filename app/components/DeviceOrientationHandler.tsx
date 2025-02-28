import { useEffect, useState } from 'react';
import { isTouchDevice } from '~/utils/mobile';

export const DeviceOrientationHandler: React.FC = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    typeof window !== 'undefined' && window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  );

  useEffect(() => {
    const handleResize = () => {
      const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      if (newOrientation !== orientation) {
        setOrientation(newOrientation);
        document.documentElement.setAttribute('data-orientation', newOrientation);
      }
    };

    // Set initial orientation and touch device class
    handleResize();
    if (isTouchDevice()) {
      document.documentElement.classList.add('touch-device');
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [orientation]);

  return null; // This component doesn't render anything
}; 