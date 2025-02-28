import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface ScreenshotSelectorProps {
  isSelectionMode: boolean;
  setIsSelectionMode: (mode: boolean) => void;
  containerRef: React.RefObject<HTMLElement>;
}

export const ScreenshotSelector = memo(
  ({ isSelectionMode, setIsSelectionMode, containerRef }: ScreenshotSelectorProps) => {
    const [isCapturing, setIsCapturing] = useState(false);
    const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<{ x: number; y: number } | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Add touch state tracking
    const isTouchSelecting = useRef(false);

    useEffect(() => {
      // Cleanup function to stop all tracks when component unmounts
      return () => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.srcObject = null;
          videoRef.current.remove();
          videoRef.current = null;
        }

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
      };
    }, []);

    const initializeStream = async () => {
      if (!mediaStreamRef.current) {
        try {
          const stream = await navigator.mediaDevices.getDisplayMedia({
            audio: false,
            video: {
              displaySurface: 'window',
              preferCurrentTab: true,
              surfaceSwitching: 'include',
              systemAudio: 'exclude',
            },
          } as MediaStreamConstraints);

          // Add handler for when sharing stops
          stream.addEventListener('inactive', () => {
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.srcObject = null;
              videoRef.current.remove();
              videoRef.current = null;
            }

            if (mediaStreamRef.current) {
              mediaStreamRef.current.getTracks().forEach((track) => track.stop());
              mediaStreamRef.current = null;
            }

            setIsSelectionMode(false);
            setSelectionStart(null);
            setSelectionEnd(null);
            setIsCapturing(false);
          });

          mediaStreamRef.current = stream;

          // Initialize video element if needed
          if (!videoRef.current) {
            const video = document.createElement('video');
            video.style.opacity = '0';
            video.style.position = 'fixed';
            video.style.pointerEvents = 'none';
            video.style.zIndex = '-1';
            document.body.appendChild(video);
            videoRef.current = video;
          }

          // Set up video with the stream
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        } catch (error) {
          console.error('Failed to initialize stream:', error);
          setIsSelectionMode(false);
          toast.error('Failed to initialize screen capture');
        }
      }

      return mediaStreamRef.current;
    };

    // Handle selection start for both mouse and touch
    const handleSelectionStart = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isSelectionMode || isCapturing) return;

      let clientX, clientY;
      
      if ('touches' in e) {
        // Touch event
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        isTouchSelecting.current = true;
      } else {
        // Mouse event
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const point = { x: clientX, y: clientY };
      setSelectionStart(point);
      setSelectionEnd(point);
    };

    // Handle selection move for both mouse and touch
    const handleSelectionMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isSelectionMode || !selectionStart || isCapturing) return;

      let clientX, clientY;
      
      if ('touches' in e) {
        // Only process if we started with touch
        if (!isTouchSelecting.current) return;
        
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        // Only process mouse events if we didn't start with touch
        if (isTouchSelecting.current) return;
        
        clientX = e.clientX;
        clientY = e.clientY;
      }

      setSelectionEnd({ x: clientX, y: clientY });
    };

    // Handle selection end and copy for both mouse and touch
    const handleCopySelection = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isSelectionMode || !selectionStart || !selectionEnd || isCapturing) return;

      // For touch events, check if we're in touch mode
      if ('changedTouches' in e && !isTouchSelecting.current) return;
      
      // For mouse events, check if we're not in touch mode
      if (!('changedTouches' in e) && isTouchSelecting.current) return;

      // Reset touch tracking
      isTouchSelecting.current = false;

      // Minimum size check to avoid accidental taps
      const width = Math.abs(selectionEnd.x - selectionStart.x);
      const height = Math.abs(selectionEnd.y - selectionStart.y);
      
      if (width < 10 || height < 10) {
        setSelectionStart(null);
        setSelectionEnd(null);
        return;
      }

      // Continue with the existing screenshot capture logic
      captureScreenshot();
    };

    // Handle touch cancel
    const handleTouchCancel = () => {
      if (isTouchSelecting.current) {
        isTouchSelecting.current = false;
        setSelectionStart(null);
        setSelectionEnd(null);
      }
    };

    const captureScreenshot = async () => {
      // Add type guards for both selection points and containerRef
      if (!selectionStart || !selectionEnd || !containerRef.current) {
        return;
      }
      
      setIsCapturing(true);

      try {
        const stream = await initializeStream();

        if (!stream || !videoRef.current) {
          return;
        }

        // Now TypeScript knows containerRef.current is not null
        const containerRect = containerRef.current.getBoundingClientRect();

        // Offset adjustments for more accurate clipping
        const leftOffset = -9; // Adjust left position
        const bottomOffset = -14; // Adjust bottom position

        // Wait for video to be ready
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Create temporary canvas for full screenshot
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = videoRef.current.videoWidth;
        tempCanvas.height = videoRef.current.videoHeight;

        const tempCtx = tempCanvas.getContext('2d');

        if (!tempCtx) {
          throw new Error('Failed to get temporary canvas context');
        }

        // Draw the full video frame
        tempCtx.drawImage(videoRef.current, 0, 0);

        // Calculate scale factor between video and screen
        const scaleX = videoRef.current.videoWidth / window.innerWidth;
        const scaleY = videoRef.current.videoHeight / window.innerHeight;

        // Get window scroll position
        const scrollX = window.scrollX;
        const scrollY = window.scrollY + 40;

        // Calculate the scaled coordinates with scroll offset and adjustments
        const scaledX = Math.round(
          (containerRect.left + Math.min(selectionStart.x, selectionEnd.x) + scrollX + leftOffset) * scaleX
        );
        const scaledY = Math.round(
          (containerRect.top + Math.min(selectionStart.y, selectionEnd.y) + scrollY + bottomOffset) * scaleY
        );
        const scaledWidth = Math.round(Math.abs(selectionEnd.x - selectionStart.x) * scaleX);
        const scaledHeight = Math.round(Math.abs(selectionEnd.y - selectionStart.y) * scaleY);

        // Create final canvas for the cropped area
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(Math.abs(selectionEnd.x - selectionStart.x));
        canvas.height = Math.round(Math.abs(selectionEnd.y - selectionStart.y));

        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Draw the cropped area
        ctx.drawImage(tempCanvas, scaledX, scaledY, scaledWidth, scaledHeight, 0, 0, canvas.width, canvas.height);

        // Convert to blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          }, 'image/png');
        });

        // Create a FileReader to convert blob to base64
        const reader = new FileReader();

        reader.onload = (e) => {
          const base64Image = e.target?.result as string;

          // Find the textarea element
          const textarea = document.querySelector('textarea');

          if (textarea) {
            // Get the setters from the BaseChat component
            const setUploadedFiles = (window as any).__BOLT_SET_UPLOADED_FILES__;
            const setImageDataList = (window as any).__BOLT_SET_IMAGE_DATA_LIST__;
            const uploadedFiles = (window as any).__BOLT_UPLOADED_FILES__ || [];
            const imageDataList = (window as any).__BOLT_IMAGE_DATA_LIST__ || [];

            if (setUploadedFiles && setImageDataList) {
              // Update the files and image data
              const file = new File([blob], 'screenshot.png', { type: 'image/png' });
              setUploadedFiles([...uploadedFiles, file]);
              setImageDataList([...imageDataList, base64Image]);
              toast.success('Screenshot captured and added to chat');
            } else {
              toast.error('Could not add screenshot to chat');
            }
          }
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Failed to capture screenshot:', error);
        toast.error('Failed to capture screenshot');

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
      } finally {
        setIsCapturing(false);
        setSelectionStart(null);
        setSelectionEnd(null);
        setIsSelectionMode(false); // Turn off selection mode after capture
      }
    };

    if (!isSelectionMode) {
      return null;
    }

    return (
      <div
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={handleSelectionStart}
        onMouseMove={handleSelectionMove}
        onMouseUp={handleCopySelection}
        onTouchStart={handleSelectionStart}
        onTouchMove={handleSelectionMove}
        onTouchEnd={handleCopySelection}
        onTouchCancel={handleTouchCancel}
        onMouseLeave={() => {
          if (selectionStart) {
            setSelectionStart(null);
          }
        }}
        style={{
          backgroundColor: isCapturing ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'all',
          opacity: isCapturing ? 0 : 1,
          zIndex: 50,
          transition: 'opacity 0.1s ease-in-out',
        }}
      >
        {selectionStart && selectionEnd && !isCapturing && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-20"
            style={{
              left: Math.min(selectionStart.x, selectionEnd.x),
              top: Math.min(selectionStart.y, selectionEnd.y),
              width: Math.abs(selectionEnd.x - selectionStart.x),
              height: Math.abs(selectionEnd.y - selectionStart.y),
            }}
          />
        )}
      </div>
    );
  }
);
