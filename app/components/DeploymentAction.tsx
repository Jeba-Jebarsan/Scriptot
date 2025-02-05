import { motion } from 'framer-motion';
import { useState } from 'react';
import { useWorkbench } from '~/lib/stores/workbench';
import { toast } from 'react-toastify';

export function DeploymentAction({ 
  isOpen,
  onClose
}: { 
  isOpen: boolean;
  onClose: () => void;
}) {
  const [netlifyToken, setNetlifyToken] = useState('');
  const [projectName, setProjectName] = useState('friendly-purchasehub');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const workbench = useWorkbench();

  const handleDeploy = async () => {
    if (!netlifyToken) {
      toast.error('Please enter your Netlify token');
      return;
    }

    if (!projectName) {
      toast.error('Please enter a project name');
      return;
    }

    const domainName = `preview--${projectName}.codeiq.app`;
    setIsDeploying(true);
    setError(null);

    try {
      console.log('Starting deployment to:', domainName);
      const result = await workbench.deployToNetlify(projectName, netlifyToken);
      const deployUrl = `https://${domainName}`;
      setDeploymentUrl(deployUrl);
      toast.success(`Successfully deployed! Your app is now available at ${deployUrl}`);
      onClose();
    } catch (err) {
      console.error('Deployment failed:', err);
      const error = err as Error;
      toast.error(error.message || 'Failed to deploy');
      setError(error.message || 'Failed to deploy');
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
            <div className="i-ph:rocket-launch text-bolt-elements-textPrimary text-xl" />
            <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Deploy to Netlify</h3>
          </div>
          <button onClick={onClose} className="text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary">
            <div className="i-ph:x-circle text-xl" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-2">
              Project Name
            </label>
            <div className="flex items-center">
              <span className="p-2 bg-bolt-elements-bg-depth-2 border border-r-0 border-bolt-elements-borderColor rounded-l text-bolt-elements-textTertiary">
                preview--
              </span>
              <input
                type="text"
                placeholder="friendly-purchasehub"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                className="flex-1 p-2 bg-bolt-elements-bg-depth-1 border border-bolt-elements-borderColor"
              />
              <span className="p-2 bg-bolt-elements-bg-depth-2 border border-l-0 border-bolt-elements-borderColor rounded-r text-bolt-elements-textTertiary">
                .codeiq.app
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-2">
              Netlify Access Token
              <a 
                href="https://app.netlify.com/user/applications" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ml-2 text-blue-500 hover:underline"
              >
                Get token →
              </a>
            </label>
            <input
              type="password"
              placeholder="Enter your Netlify access token from app.netlify.com/user/applications"
              value={netlifyToken}
              onChange={(e) => setNetlifyToken(e.target.value)}
              className="w-full p-2 bg-bolt-elements-bg-depth-1 border border-bolt-elements-borderColor rounded"
            />
            <p className="mt-1 text-xs text-bolt-elements-textTertiary">
              Get your token from Netlify: Applications → New access token
            </p>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {deploymentUrl && (
            <div className="text-green-500 text-sm">
              Deployed successfully! Visit: <a href={deploymentUrl} target="_blank" rel="noopener noreferrer" className="underline">{deploymentUrl}</a>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDeploy}
              disabled={isDeploying || !netlifyToken || !projectName}
              className="flex-1 px-4 py-2 rounded-lg bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isDeploying ? (
                <>
                  <div className="i-ph:spinner animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <div className="i-ph:rocket-launch" />
                  Deploy
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 