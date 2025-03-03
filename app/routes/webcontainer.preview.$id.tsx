import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cleanStackTrace } from '~/utils/stacktrace';

const PREVIEW_CHANNEL = 'preview-updates';

// Helper function to clean WebContainer ID
function cleanWebContainerId(id: string): string {
  // Extract the base ID without port and hash
  const baseId = id.split('--')[0];
  return baseId;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const previewId = params.id;

  if (!previewId) {
    throw new Response('Preview ID is required', { status: 400 });
  }

  return json({ previewId });
}

export default function WebContainerPreview() {
  const { previewId } = useLoaderData<typeof loader>();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const broadcastChannelRef = useRef<BroadcastChannel>();
  const [previewUrl, setPreviewUrl] = useState('');
  const [displayUrl, setDisplayUrl] = useState('');

  // Handle preview refresh
  const handleRefresh = useCallback(() => {
    if (iframeRef.current && previewUrl) {
      // Force a clean reload
      iframeRef.current.src = '';
      requestAnimationFrame(() => {
        if (iframeRef.current) {
          iframeRef.current.src = previewUrl;
        }
      });
    }
  }, [previewUrl]);

  // Notify other tabs that this preview is ready
  const notifyPreviewReady = useCallback(() => {
    if (broadcastChannelRef.current && previewUrl) {
      broadcastChannelRef.current.postMessage({
        type: 'preview-ready',
        previewId,
        url: previewUrl,
        timestamp: Date.now(),
      });
    }
  }, [previewId, previewUrl]);

  useEffect(() => {
    // Initialize broadcast channel
    broadcastChannelRef.current = new BroadcastChannel(PREVIEW_CHANNEL);

    // Listen for preview updates
    broadcastChannelRef.current.onmessage = (event) => {
      if (event.data.previewId === previewId) {
        if (event.data.type === 'refresh-preview' || event.data.type === 'file-change') {
          handleRefresh();
        }
      }
    };

    // Clean the WebContainer ID
    const cleanId = cleanWebContainerId(previewId);

    // Construct the WebContainer preview URL
    // Support both URL formats - local-credentialless and local-corp
    const isCorpFormat = previewId.includes('-');
    const url = isCorpFormat 
      ? `https://${previewId}.local-corp.webcontainer-api.io`
      : `https://${previewId}.local-credentialless.webcontainer-api.io`;
    
    // Extract port number from URL if available
    let port = '';
    if (isCorpFormat) {
      const portMatch = previewId.match(/--(\d+)--/);
      port = portMatch ? `:${portMatch[1]}` : '';
    }
    
    // Set the actual URL for the iframe
    setPreviewUrl(url);
    
    // Set a cleaner display URL with cleaned ID - domain at the end
    const cleanUrl = `https://${cleanId}${port}.deepgen.dev`;
    setDisplayUrl(cleanUrl);
    
    // Update the browser's address bar without navigation
    if (window.history && window.history.replaceState) {
      try {
        const originalUrl = window.location.href;
        window.history.replaceState({ originalUrl }, '', cleanUrl);
        
        return () => {
          window.history.replaceState({}, '', originalUrl);
        };
      } catch (error) {
        console.error('Failed to update URL:', error);
      }
    }

    // Set the iframe src
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }

    // Notify other tabs that this preview is ready
    notifyPreviewReady();

    // Cleanup
    return () => {
      broadcastChannelRef.current?.close();
    };
  }, [previewId, handleRefresh, notifyPreviewReady]);

  // Override console.error to clean WebContainer URLs from stack traces
  useEffect(() => {
    const originalConsoleError = console.error;
    
    console.error = (...args) => {
      const cleanedArgs = args.map(arg => {
        if (typeof arg === 'string' && (
            arg.includes('webcontainer-api.io') || 
            arg.includes('local-corp.webcontainer-api.io')
          )) {
          return cleanStackTrace(arg);
        }
        return arg;
      });
      
      originalConsoleError(...cleanedArgs);
    };
    
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <div className="w-full h-full">
      {displayUrl && (
        <div className="absolute top-0 left-0 right-0 bg-bolt-elements-background-depth-2 p-2 text-center text-bolt-elements-textSecondary text-sm z-10">
          {displayUrl}
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="WebContainer Preview"
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-forms allow-popups allow-modals allow-storage-access-by-user-activation allow-same-origin"
        allow="cross-origin-isolated"
        loading="eager"
        onLoad={notifyPreviewReady}
      />
    </div>
  );
}