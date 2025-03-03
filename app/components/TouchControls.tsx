import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { isMobile, isTablet, isTouchDevice } from '~/utils/mobile';
import { GitHubPushModal } from './git/GitHubPushModal';

export const TouchControls: React.FC = () => {
  const activeView = useStore(workbenchStore.currentView);
  const showTerminal = useStore(workbenchStore.showTerminal);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    typeof window !== 'undefined' && window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  );
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleViewChange = (view: 'code' | 'preview') => {
    workbenchStore.currentView.set(view);
  };
  
  const toggleTerminal = () => {
    workbenchStore.toggleTerminal(!showTerminal);
  };
  
  // Only show on touch devices
  if (!isTouchDevice()) {
    return null;
  }
  
  const isLandscape = orientation === 'landscape';
  
  return (
    <>
      <div className={`fixed ${isLandscape ? 'right-0 top-1/2 -translate-y-1/2 flex-col h-auto' : 'bottom-0 left-0 right-0 flex-row'} bg-bolt-elements-background border-t border-bolt-elements-borderColor p-2 flex justify-around z-50 touch-controls`}>
        <button 
          className={`p-3 rounded-full ${activeView === 'code' ? 'bg-bolt-elements-focus text-white' : 'bg-bolt-elements-buttonBackground'} ${isLandscape ? 'mb-2' : 'mx-2'}`}
          onClick={() => handleViewChange('code')}
          aria-label="Code Editor"
        >
          <div className="i-ph:code text-xl" />
        </button>
        <button 
          className={`p-3 rounded-full ${activeView === 'preview' ? 'bg-bolt-elements-focus text-white' : 'bg-bolt-elements-buttonBackground'} ${isLandscape ? 'mb-2' : 'mx-2'}`}
          onClick={() => handleViewChange('preview')}
          aria-label="Preview"
        >
          <div className="i-ph:eye text-xl" />
        </button>
        <button 
          className={`p-3 rounded-full ${showTerminal ? 'bg-bolt-elements-focus text-white' : 'bg-bolt-elements-buttonBackground'} ${isLandscape ? 'mb-2' : 'mx-2'}`}
          onClick={toggleTerminal}
          aria-label="Terminal"
        >
          <div className="i-ph:terminal text-xl" />
        </button>
        <button 
          className={`p-3 rounded-full bg-bolt-elements-buttonBackground ${isLandscape ? 'mb-2' : 'mx-2'}`}
          onClick={() => workbenchStore.downloadZip()}
          aria-label="Download Code"
        >
          <div className="i-ph:download text-xl" />
        </button>
        <button 
          className={`p-3 rounded-full bg-bolt-elements-buttonBackground ${isLandscape ? 'mb-2' : 'mx-2'}`}
          onClick={() => setShowGitHubModal(true)}
          aria-label="Push to GitHub"
        >
          <div className="i-ph:github-logo text-xl" />
        </button>
      </div>
      
      {showGitHubModal && (
        <GitHubPushModal
          isOpen={showGitHubModal}
          onClose={() => setShowGitHubModal(false)}
        />
      )}
    </>
  );
}; 