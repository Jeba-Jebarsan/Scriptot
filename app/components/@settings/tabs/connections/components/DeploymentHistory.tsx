import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { motion } from 'framer-motion';
import { deploymentsStore, loadDeployments, deleteDeployment, type Deployment } from '~/lib/services/deployments';
import { Button } from '~/components/ui/Buttons';
import { classNames } from '~/utils/classNames';
import { toast } from 'react-toastify';

export function DeploymentHistory() {
  const deployments = useStore(deploymentsStore);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedErrorId, setExpandedErrorId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeployments = async () => {
      setIsLoading(true);
      try {
        await loadDeployments();
      } catch (error) {
        console.error('Error loading deployments:', error);
        toast.error('Failed to load deployment history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeployments();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDeployment(id);
      toast.success('Deployment removed from history');
    } catch (error) {
      console.error('Error deleting deployment:', error);
      toast.error('Failed to delete deployment');
    }
  };

  const getStatusColor = (status: Deployment['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'in-progress':
        return 'text-blue-500';
      default:
        return 'text-bolt-elements-textSecondary';
    }
  };

  const getProviderIcon = (provider: Deployment['provider']) => {
    switch (provider) {
      case 'netlify':
        return 'i-simple-icons:netlify';
      case 'vercel':
        return 'i-simple-icons:vercel';
      case 'github-pages':
        return 'i-ph:github-logo';
      default:
        return 'i-ph:globe';
    }
  };

  return (
    <motion.div
      className="border border-bolt-elements-borderColor rounded-lg p-4 bg-bolt-elements-background-depth-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="i-ph:rocket-launch w-8 h-8 text-purple-500" />
        <div>
          <h3 className="text-md font-medium text-bolt-elements-textPrimary">Deployment History</h3>
          <p className="text-sm text-bolt-elements-textSecondary">View your recent project deployments</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="i-svg-spinners:90-ring-with-bg w-8 h-8 text-purple-500" />
        </div>
      ) : deployments.length === 0 ? (
        <div className="text-center py-8 bg-bolt-elements-background-depth-2 rounded-lg">
          <div className="i-ph:rocket w-12 h-12 mx-auto mb-2 text-bolt-elements-textTertiary" />
          <p className="text-bolt-elements-textSecondary">No deployments yet</p>
          <p className="text-sm text-bolt-elements-textTertiary mt-1">
            Deploy your projects to see them here
          </p>
        </div>
      ) : (
        <div className="space-y-3 mt-2">
          {deployments.map((deployment) => (
            <div
              key={deployment.id}
              className="p-3 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 hover:bg-bolt-elements-background-depth-3 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={classNames(getProviderIcon(deployment.provider), "w-6 h-6")} />
                  <div>
                    <h4 className="font-medium text-bolt-elements-textPrimary">{deployment.name}</h4>
                    <a 
                      href={deployment.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                    >
                      {deployment.url}
                      <div className="i-ph:arrow-square-out w-3 h-3" />
                    </a>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={classNames("text-xs flex items-center gap-1", getStatusColor(deployment.status))}>
                        {deployment.status === 'success' && <div className="i-ph:check-circle w-3 h-3" />}
                        {deployment.status === 'failed' && <div className="i-ph:x-circle w-3 h-3" />}
                        {deployment.status === 'in-progress' && <div className="i-ph:spinner-gap w-3 h-3 animate-spin" />}
                        {deployment.status.charAt(0).toUpperCase() + deployment.status.slice(1)}
                      </span>
                      <span className="text-xs text-bolt-elements-textTertiary">
                        {new Date(deployment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(deployment.id)}
                  className="text-red-500 hover:bg-red-500/10"
                >
                  <div className="i-ph:trash w-4 h-4" />
                </Button>
              </div>
              {deployment.error && (
                <div className="mt-2 p-2 bg-red-500/10 rounded text-xs text-red-500 border border-red-500/20">
                  {deployment.error}
                  
                  {deployment.metadata?.buildError && (
                    <div className="mt-2">
                      <button 
                        onClick={() => setExpandedErrorId(expandedErrorId === deployment.id ? null : deployment.id)}
                        className="text-xs underline"
                      >
                        {expandedErrorId === deployment.id ? 'Hide' : 'Show'} build details
                      </button>
                      
                      {expandedErrorId === deployment.id && deployment.metadata?.buildOutput && (
                        <pre className="mt-2 p-2 bg-bolt-elements-bg-depth-2 rounded text-xs overflow-x-auto max-h-32 overflow-y-auto">
                          {deployment.metadata.buildOutput}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
} 