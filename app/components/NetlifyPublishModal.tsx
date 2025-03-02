import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useWorkbench } from '~/lib/stores/workbench';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useStore } from '@nanostores/react';
import { deploymentState, streamingState } from '~/lib/stores/deployment';
import { useNavigate } from '@remix-run/react';
import { fetchNetlifyStats, netlifyConnection } from '~/lib/services/netlify';
import { NetlifyDeploymentLink } from './chat/NetlifyDeploymentLink.client';
import { DeploymentSuccessAnimation } from './DeploymentSuccessAnimation';

export function DeploymentProgressCard({ onComplete, provider }: { onComplete: () => void, provider: string }) {
  useEffect(() => {
    // Simulate deployment progress
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full max-w-md p-8 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-gray-700">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="i-ph:spinner animate-spin text-4xl text-blue-500" />
        <h3 className="text-xl font-bold text-white">Deploying to {provider}...</h3>
        <p className="text-gray-300">Your site is being published</p>
      </div>
    </div>
  );
}

export function NetlifyPublishModal({ 
  isOpen,
  onClose
}: { 
  isOpen: boolean;
  onClose: () => void;
}) {
  const [projectName, setProjectName] = useState('friendly-purchasehub');
  const { isDeploying, error } = useStore(deploymentState);
  const isStreaming = useStore(streamingState);
  const connection = useStore(netlifyConnection);
  const workbench = useWorkbench();
  const navigate = useNavigate();
  const netlifyToken = Cookies.get('netlifyToken');
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showDeploymentProgress, setShowDeploymentProgress] = useState(false);

  useEffect(() => {
    if (netlifyToken && !connection.user) {
      fetchNetlifyStats(netlifyToken);
    }
  }, [netlifyToken]);

  const handleDeploy = async () => {
    if (!netlifyToken) {
      toast.error('Please add your Netlify token in the Settings → Connections tab');
      onClose();
      return;
    }

    if (!connection.user) {
      try {
        const verified = await fetchNetlifyStats(netlifyToken);
        if (!verified) {
          onClose();
          return;
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Invalid token';
        toast.error(`Invalid Netlify token`);
        onClose();
        return;
      }
    }

    deploymentState.set({ isDeploying: true, isBuildReady: false, error: null });

    try {
      const result = await workbench.deployToNetlify(projectName, netlifyToken);
      setDeploymentUrl(result.url);
      
      // Show success animation immediately
      setShowSuccessAnimation(true);
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to publish';
      deploymentState.set({ isDeploying: false, isBuildReady: false, error: errorMsg });
      toast.error(errorMsg);
    } finally {
      deploymentState.set({ isDeploying: false, isBuildReady: false, error: null });
    }
  };

  const handleProgressComplete = () => {
    setShowDeploymentProgress(false);
    setShowSuccessAnimation(true);
  };

  const handleSuccessAnimationClose = () => {
    setShowSuccessAnimation(false);
    onClose();
  };

  if (showSuccessAnimation && deploymentUrl) {
    return (
      <DeploymentSuccessAnimation 
        deploymentUrl={deploymentUrl} 
        onClose={handleSuccessAnimationClose} 
      />
    );
  }

  if (showDeploymentProgress) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      >
        <DeploymentProgressCard onComplete={handleProgressComplete} provider="netlify" />
      </motion.div>
    );
  }

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <motion.div className="w-full max-w-md p-8 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img 
              className="w-5 h-5"
              height="24"
              width="24"
              crossOrigin="anonymous"
              src="https://cdn.simpleicons.org/netlify"
              alt="Netlify"
            />
            <h3 className="text-xl font-bold text-white">
              {!connection.user ? 'No Account Connected' : 'Deploy to Netlify'}
            </h3>
            {connection.user && <NetlifyDeploymentLink />}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <div className="i-ph:x-circle text-2xl" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900">{error}</div>
          )}

          <div className="flex justify-end gap-4 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeploy}
              disabled={isDeploying || isStreaming}
              className="px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              {isDeploying ? (
                <>
                  <div className="i-ph:spinner animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <div className="i-ph:cloud-arrow-up" />
                  Publish
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 