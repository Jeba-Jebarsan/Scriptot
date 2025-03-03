import { useStore } from '@nanostores/react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import { workbenchStore } from '~/lib/stores/workbench';
import { PortDropdown } from './PortDropdown';
import { ScreenshotSelector } from './ScreenshotSelector';

type ResizeSide = 'left' | 'right' | null;

export const Preview = memo(() => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [isPortDropdownOpen, setIsPortDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hasSelectedPreview = useRef(false);
  const previews = useStore(workbenchStore.previews);
  const activePreview = previews[activePreviewIndex];

  const [url, setUrl] = useState('');
  const [iframeUrl, setIframeUrl] = useState<string | undefined>();
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Toggle between responsive mode and device mode
  const [isDeviceModeOn, setIsDeviceModeOn] = useState(false);

  // Use percentage for width - increased from 37.5 to 50
  const [widthPercent, setWidthPercent] = useState<number>(50); // 500px assuming 1000px window width initially

  const resizingState = useRef({
    isResizing: false,
    side: null as ResizeSide,
    startX: 0,
    startWidthPercent: 50, // Increased from 37.5 to 50
    windowWidth: window.innerWidth,
  });

  // Define the scaling factor
  const SCALING_FACTOR = 2; // Adjust this value to increase/decrease sensitivity

  useEffect(() => {
    if (!activePreview) {
      setUrl('');
      setIframeUrl(undefined);
      return;
    }

    const { baseUrl } = activePreview;
    
    // Extract project identifier from the WebContainer URL
    const projectId = baseUrl.split('.')[0].split('//')[1];
    
    // Extract port if available
    let port = '';
    const portMatch = baseUrl.match(/--(\d+)--/);
    if (portMatch) {
      port = `:${portMatch[1]}`;
    }
    
    // Create a clean display URL with domain at the end
    const displayUrl = `https://${projectId}${port}.deepgen.dev`;
    
    setUrl(displayUrl);
    setIframeUrl(baseUrl); // Keep the actual WebContainer URL for iframe
  }, [activePreview]);

  // Update validateUrl to handle the new URL format
  const validateUrl = useCallback(
    (value: string) => {
      if (!activePreview) {
        return false;
      }

      const { baseUrl } = activePreview;
      const projectId = baseUrl.split('.')[0].split('//')[1];
      
      let port = '';
      const portMatch = baseUrl.match(/--(\d+)--/);
      if (portMatch) {
        port = `:${portMatch[1]}`;
      }
      
      const displayUrl = `https://${projectId}${port}.deepgen.dev`;
      
      if (value === displayUrl) {
        return true;
      } else if (value.startsWith(displayUrl)) {
        return ['/', '?', '#'].includes(value.charAt(displayUrl.length));
      }

      // Also allow the actual WebContainer URL for compatibility
      if (value === baseUrl) {
        return true;
      } else if (value.startsWith(baseUrl)) {
        return ['/', '?', '#'].includes(value.charAt(baseUrl.length));
      }

      return false;
    },
    [activePreview]
  );

  const findMinPortIndex = useCallback(
    (minIndex: number, preview: { port: number }, index: number, array: { port: number }[]) => {
      return preview.port < array[minIndex].port ? index : minIndex;
    },
    []
  );

  // When previews change, display the lowest port if user hasn't selected a preview
  useEffect(() => {
    if (previews.length > 1 && !hasSelectedPreview.current) {
      const minPortIndex = previews.reduce(findMinPortIndex, 0);
      setActivePreviewIndex(minPortIndex);
    }
  }, [previews, findMinPortIndex]);

  const reloadPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const toggleFullscreen = async () => {
    if (!isFullscreen && containerRef.current) {
      await containerRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleDeviceMode = () => {
    setIsDeviceModeOn((prev) => !prev);
  };

  const startResizing = (e: React.MouseEvent | React.TouchEvent, side: ResizeSide) => {
    if (!isDeviceModeOn) {
      return;
    }

    // Prevent text selection
    document.body.style.userSelect = 'none';

    resizingState.current.isResizing = true;
    resizingState.current.side = side;
    
    // Handle both mouse and touch events
    if ('touches' in e) {
      // Touch event
      resizingState.current.startX = e.touches[0].clientX;
    } else {
      // Mouse event
      resizingState.current.startX = e.clientX;
    }
    
    resizingState.current.startWidthPercent = widthPercent;
    resizingState.current.windowWidth = window.innerWidth;

    // Add both mouse and touch event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onTouchEnd);

    // Prevent default behavior to avoid scrolling on touch devices
    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!resizingState.current.isResizing) {
      return;
    }

    const dx = e.clientX - resizingState.current.startX;
    const windowWidth = resizingState.current.windowWidth;

    // Apply scaling factor to increase sensitivity
    const dxPercent = (dx / windowWidth) * 100 * SCALING_FACTOR;

    let newWidthPercent = resizingState.current.startWidthPercent;

    if (resizingState.current.side === 'right') {
      newWidthPercent = resizingState.current.startWidthPercent + dxPercent;
    } else if (resizingState.current.side === 'left') {
      newWidthPercent = resizingState.current.startWidthPercent - dxPercent;
    }

    // Clamp the width between 10% and 90%
    newWidthPercent = Math.max(10, Math.min(newWidthPercent, 90));

    setWidthPercent(newWidthPercent);
  };

  const onMouseUp = () => {
    resizingState.current.isResizing = false;
    resizingState.current.side = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    // Restore text selection
    document.body.style.userSelect = '';
  };

  // Add a touch move handler
  const onTouchMove = (e: TouchEvent) => {
    if (!resizingState.current.isResizing) {
      return;
    }

    const touch = e.touches[0];
    const dx = touch.clientX - resizingState.current.startX;
    const windowWidth = resizingState.current.windowWidth;

    // Apply scaling factor to increase sensitivity
    const dxPercent = (dx / windowWidth) * 100 * SCALING_FACTOR;

    let newWidthPercent = resizingState.current.startWidthPercent;

    if (resizingState.current.side === 'right') {
      newWidthPercent = resizingState.current.startWidthPercent + dxPercent;
    } else if (resizingState.current.side === 'left') {
      newWidthPercent = resizingState.current.startWidthPercent - dxPercent;
    }

    // Clamp the width between 10% and 90%
    newWidthPercent = Math.max(10, Math.min(newWidthPercent, 90));

    setWidthPercent(newWidthPercent);
    
    // Prevent default to stop scrolling while resizing
    e.preventDefault();
  };

  // Add a touch end handler
  const onTouchEnd = () => {
    resizingState.current.isResizing = false;
    resizingState.current.side = null;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('touchend', onTouchEnd);
    document.removeEventListener('mouseup', onMouseUp);

    // Restore text selection
    document.body.style.userSelect = '';
  };

  // Handle window resize to ensure widthPercent remains valid
  useEffect(() => {
    const handleWindowResize = () => {
      /*
       * Optional: Adjust widthPercent if necessary
       * For now, since widthPercent is relative, no action is needed
       */
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  // A small helper component for the handle's "grip" icon
  const GripIcon = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: '10px',
          lineHeight: '5px',
          userSelect: 'none',
          marginLeft: '1px',
        }}
      >
        ⋮ ⋮ ⋮
      </div>
    </div>
  );

  const PreviewLoader = () => {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center bg-gradient-to-br from-gray-800 to-gray-950 dark:from-gray-900 dark:to-black relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-full">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full opacity-20 animate-pulse"
                style={{
                  width: `${Math.random() * 300 + 100}px`,
                  height: `${Math.random() * 300 + 100}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `radial-gradient(circle, rgba(99,102,241,0.8) 0%, rgba(99,102,241,0.1) 70%)`,
                  animationDuration: `${Math.random() * 4 + 3}s`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Loading spinner */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-medium text-white mb-2">
              Loading Preview
            </h3>
            <p className="text-indigo-300 text-sm max-w-xs text-center">
              Setting up your development environment and preparing your preview
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-64 h-1.5 bg-gray-700 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-indigo-500 rounded-full animate-progress-bar"></div>
          </div>
        </div>

        <style jsx>{`
          @keyframes progress-bar {
            0% { width: 0%; }
            20% { width: 20%; }
            40% { width: 40%; }
            60% { width: 60%; }
            80% { width: 80%; }
            95% { width: 95%; }
            100% { width: 95%; }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col relative bg-gray-900">
      {isPortDropdownOpen && (
        <div className="z-iframe-overlay w-full h-full absolute" onClick={() => setIsPortDropdownOpen(false)} />
      )}
      <div className="bg-gray-800 p-2 flex items-center gap-1.5">
        <IconButton icon="i-ph:arrow-clockwise" onClick={reloadPreview} className="text-gray-300 hover:text-white hover:bg-gray-700" />
        <IconButton
          icon="i-ph:selection"
          onClick={() => setIsSelectionMode(!isSelectionMode)}
          className={isSelectionMode ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}
        />
        <div
          className="flex items-center gap-2 flex-grow bg-gray-900 border border-gray-700 text-gray-300 rounded-md px-3 py-1.5 text-sm hover:border-gray-600 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:text-white transition-all duration-200"
        >
          <span className="text-indigo-400 text-xs">
            <i className="i-ph:globe-simple w-4 h-4"></i>
          </span>
          <input
            title="URL"
            ref={inputRef}
            className="w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            value={url}
            placeholder="Loading URL..."
            onChange={(event) => {
              setUrl(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && validateUrl(url)) {
                setIframeUrl(url);

                if (inputRef.current) {
                  inputRef.current.blur();
                }
              }
            }}
          />
          <button 
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => {
              if (validateUrl(url)) {
                setIframeUrl(url);
                if (inputRef.current) {
                  inputRef.current.blur();
                }
              }
            }}
            title="Go to URL"
          >
            <i className="i-ph:arrow-right w-4 h-4"></i>
          </button>
        </div>

        {previews.length > 1 && (
          <PortDropdown
            activePreviewIndex={activePreviewIndex}
            setActivePreviewIndex={setActivePreviewIndex}
            isDropdownOpen={isPortDropdownOpen}
            setHasSelectedPreview={(value) => (hasSelectedPreview.current = value)}
            setIsDropdownOpen={setIsPortDropdownOpen}
            previews={previews}
          />
        )}

        {/* Device mode toggle button */}
        <IconButton
          icon="i-ph:devices"
          onClick={toggleDeviceMode}
          title={isDeviceModeOn ? 'Switch to Responsive Mode' : 'Switch to Device Mode'}
          className={isDeviceModeOn ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'}
        />

        {/* Fullscreen toggle button */}
        <IconButton
          icon={isFullscreen ? 'i-ph:arrows-in' : 'i-ph:arrows-out'}
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
          className="text-gray-300 hover:text-white hover:bg-gray-700"
        />
      </div>

      <div className="flex-1 border-t border-gray-700 flex justify-center items-center overflow-auto bg-gray-800">
        <div
          style={{
            width: isDeviceModeOn ? `${widthPercent}%` : '100%',
            height: '100%', // Always full height
            overflow: 'visible',
            background: '#fff',
            position: 'relative',
            display: 'flex',
            boxShadow: isDeviceModeOn ? '0 0 20px rgba(0,0,0,0.3)' : 'none',
          }}
        >
          {activePreview ? (
            <>
              <iframe
                ref={iframeRef}
                title="preview"
                className="border-none w-full h-full bg-white"
                src={iframeUrl}
                allowFullScreen
              />
              <ScreenshotSelector
                isSelectionMode={isSelectionMode}
                setIsSelectionMode={setIsSelectionMode}
                containerRef={iframeRef}
              />
            </>
          ) : (
            <PreviewLoader />
          )}

          {isDeviceModeOn && (
            <>
              {/* Left handle */}
              <div
                onMouseDown={(e) => startResizing(e, 'left')}
                onTouchStart={(e) => startResizing(e, 'left')}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '15px',
                  marginLeft: '-15px',
                  height: '100%',
                  cursor: 'ew-resize',
                  background: 'rgba(79, 70, 229, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                  userSelect: 'none',
                  borderRadius: '4px 0 0 4px',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(79, 70, 229, 0.6)')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(79, 70, 229, 0.3)')}
                title="Drag to resize width"
              >
                <GripIcon />
              </div>

              {/* Right handle */}
              <div
                onMouseDown={(e) => startResizing(e, 'right')}
                onTouchStart={(e) => startResizing(e, 'right')}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '15px',
                  marginRight: '-15px',
                  height: '100%',
                  cursor: 'ew-resize',
                  background: 'rgba(79, 70, 229, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                  userSelect: 'none',
                  borderRadius: '0 4px 4px 0',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(79, 70, 229, 0.6)')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(79, 70, 229, 0.3)')}
                title="Drag to resize width"
              >
                <GripIcon />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
