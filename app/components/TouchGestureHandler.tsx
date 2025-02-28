import { useEffect } from 'react';
import { workbenchStore } from '~/lib/stores/workbench';
import { isTouchDevice, isMobile, isTablet } from '~/utils/mobile';

export const TouchGestureHandler: React.FC = () => {
  useEffect(() => {
    if (!isTouchDevice()) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const touchDuration = touchEndTime - touchStartTime;
      
      // Only process quick swipes (less than 300ms)
      if (touchDuration > 300) return;
      
      // Detect horizontal swipe (minimum 80px)
      if (Math.abs(deltaX) > 80 && Math.abs(deltaY) < 50) {
        // Right to left swipe
        if (deltaX < 0) {
          if (workbenchStore.currentView.get() === 'code') {
            workbenchStore.currentView.set('preview');
          }
        } 
        // Left to right swipe
        else {
          if (workbenchStore.currentView.get() === 'preview') {
            workbenchStore.currentView.set('code');
          }
        }
      }
      
      // Detect vertical swipe (minimum 80px)
      if (Math.abs(deltaY) > 80 && Math.abs(deltaX) < 50) {
        // Bottom to top swipe (show terminal)
        if (deltaY < 0 && touchStartY > window.innerHeight * 0.7) {
          workbenchStore.toggleTerminal(true);
        }
        // Top to bottom swipe (hide terminal)
        else if (deltaY > 0 && touchStartY < window.innerHeight * 0.3) {
          workbenchStore.toggleTerminal(false);
        }
      }
      
      // Detect double tap (two quick taps within 300ms)
      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        // Double tap logic could be added here
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return null; // This component doesn't render anything
}; 