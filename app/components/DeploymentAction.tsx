import { motion } from 'framer-motion';
import { useState } from 'react';
import { useWorkbench } from '~/lib/stores/workbench';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

export function DeploymentAction({ 
  isOpen,
  onClose
}: { 
  isOpen: boolean;
  onClose: () => void;
}) {
  const [projectName, setProjectName] = useState('friendly-purchasehub');
  const [isDeploying, setIsDeploying] = useState(false);
  const [isProjectCreated, setIsProjectCreated] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const workbench = useWorkbench();
  const netlifyToken = Cookies.get('netlifyToken');

  const handleDeploy = async () => {
    if (!netlifyToken) {
      toast.error('Please configure your Netlify token in Settings first');
      return;
    }

    if (!projectName) {
      toast.error('Please enter a project name');
      return;
    }

    setIsDeploying(true);
    setError(null);

    try {
      const result = await workbench.deployToNetlify(projectName, netlifyToken);
      setDeploymentUrl(result.url);
      toast.success(`Successfully published! Your app is now available at ${result.url}`);
      setIsProjectCreated(true);
      onClose();
    } catch (err) {
      console.error('Publication failed:', err);
      const error = err as Error;
      toast.error(error.message || 'Failed to publish');
      setError(error.message || 'Failed to publish');
    } finally {
      setIsDeploying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <motion.div 
        className="w-full max-w-md p-6 bg-bolt-elements-background rounded-lg shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="i-ph:cloud-arrow-up text-bolt-elements-textPrimary text-xl" />
            <h3 className="text-lg font-medium text-bolt-elements-textPrimary">
              {netlifyToken ? 'Publish Project' : 'Connect Netlify Account'}
            </h3>
          </div>
          <button onClick={onClose} className="text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary">
            <div className="i-ph:x-circle text-xl" />
          </button>
        </div>

        {!netlifyToken ? (
          <div>
            <p className="text-sm text-bolt-elements-textSecondary mb-4">
              To deploy your project, please connect your Netlify account first.
            </p>
            <a 
              href="/settings"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text transition-all"
            >
              <div className="i-ph:gear" />
              Go to Settings
            </a>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-2">
                Project Name
              </label>
              <input
                type="text"
                placeholder="friendly-purchasehub"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                className="w-full p-2 bg-bolt-elements-bg-depth-1 border border-bolt-elements-borderColor rounded"
              />
            </div>

            {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
            {deploymentUrl && (
              <div className="mt-4 text-green-500 text-sm">
                Published successfully! Visit: <a href={deploymentUrl} target="_blank" rel="noopener noreferrer" className="underline">{deploymentUrl}</a>
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg border border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeploy}
                disabled={isDeploying || (!projectName && !isProjectCreated)}
                className="flex-1 px-4 py-2 rounded-lg bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
          </>
        )}
      </motion.div>
    </motion.div>
  );
} 