import { useStore } from '@nanostores/react';
import { toast } from 'react-toastify';
import { chatStore } from '~/lib/stores/chat';
import { workbenchStore } from '~/lib/stores/workbench';
import { webcontainer } from '~/lib/webcontainer';
import { classNames } from '~/utils/classNames';
import { useEffect, useRef, useState } from 'react';
import type { ActionCallbackData } from '~/lib/runtime/message-parser';
import { chatId } from '~/lib/persistence/useChatHistory';
import { NetlifyDeploymentLink } from '~/components/chat/NetlifyDeploymentLink.client';
import { netlifyConnection, updateNetlifyConnection } from '~/lib/services/netlify';
import { streamingState, deploymentState } from '~/lib/stores/deployment';
import Cookies from 'js-cookie';
import type { NetlifyUser } from '~/types/netlify';
import { Globe } from 'lucide-react';
import { DeploymentHistory } from '~/components/DeploymentHistory';
import { isMobile, useResponsive } from '~/utils/mobile';
import { motion } from 'framer-motion';
import { DeploymentSuccessAnimation } from '../DeploymentSuccessAnimation';
import { DeploymentProgressCard } from '~/NetlifyDeploymentProgress';
import { addDeployment } from '~/lib/services/deployments';
import { ActionCommandError } from '~/lib/runtime/message-parser';

interface HeaderActionButtonsProps {}

export function HeaderActionButtons({}: HeaderActionButtonsProps) {
  const [activePreviewIndex] = useState(0);
  const previews = useStore(workbenchStore.previews);
  const activePreview = previews[activePreviewIndex];
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNetlifyVerifying, setIsNetlifyVerifying] = useState(false);
  const [netlifyToken, setNetlifyToken] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isStreaming = useStore(streamingState);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const connection = useStore(netlifyConnection);
  const currentChatId = useStore(chatId);
  const [isCancelling, setIsCancelling] = useState(false);
  const { isMobile: isOnMobile } = useResponsive();
  
  // New states for the deployment progress
  const [showDeploymentProgress, setShowDeploymentProgress] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const verifyNetlifyToken = async () => {
    setIsNetlifyVerifying(true);
    try {
      const cleanToken = netlifyToken.replace('Bearer ', '');
      updateNetlifyConnection({ user: null, token: '' });
      
      const response = await fetch('https://api.netlify.com/api/v1/user', {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      const userData = await response.json() as NetlifyUser;
      updateNetlifyConnection({
        user: userData,
        token: cleanToken,
      });
      Cookies.set('netlifyToken', cleanToken);
      toast.success('Netlify token verified successfully!');
      return true;
    } catch (error) {
      console.error('Netlify verification error:', error);
      updateNetlifyConnection({ user: null, token: '' });
      toast.error('Failed to verify Netlify token. Please check your token and try again.');
      return false;
    } finally {
      setIsNetlifyVerifying(false);
    }
  };

  const handleDeploy = async () => {
    if (!connection.user || !connection.token) {
      toast.error('Please connect to Netlify first in the settings tab!');
      return;
    }

    if (!currentChatId) {
      toast.error('No active chat found');
      return;
    }

    try {
      setIsDeploying(true);
      setDeploymentUrl(null);
      setShowDeploymentProgress(true);
      
      // Update deployment state
      deploymentState.set({ 
        isDeploying: true, 
        isBuildReady: false, 
        error: null,
        buildError: null 
      });

      const artifact = workbenchStore.firstArtifact;

      if (!artifact) {
        throw new Error('No active project found');
      }

      const actionId = 'build-' + Date.now();
      const actionData: ActionCallbackData = {
        messageId: 'netlify build',
        artifactId: artifact.id,
        actionId,
        action: {
          type: 'build' as const,
          content: 'npm run build',
        },
      };

      // Add the action first
      artifact.runner.addAction(actionData);

      // Then run it
      try {
        await artifact.runner.runAction(actionData);
        
        // Wait for build to complete
        const buildResult = await artifact.runner.buildOutput;
        if (!buildResult || buildResult.exitCode !== 0) {
          const errorOutput = buildResult?.output || 'No output available';
          const errorDetails = artifact.runner.extractBuildError?.(errorOutput) || {
            type: 'unknown',
            solution: 'Check the build output for details on what went wrong.'
          };
          
          deploymentState.set({
            isDeploying: false,
            isBuildReady: false,
            error: 'Build failed',
            buildError: {
              message: 'Build process failed with errors',
              output: errorOutput,
              details: errorDetails
            }
          });
          
          // Save failed deployment to history
          await addDeployment({
            name: `deployment-${Date.now()}`,
            url: '',
            provider: 'netlify',
            status: 'failed',
            projectPath: currentChatId,
            error: 'Build failed',
            metadata: {
              buildError: true,
              buildOutput: errorOutput,
              errorDetails
            }
          });
          
          throw new Error('Build failed: ' + errorOutput);
        }
        
        // Build succeeded, update state
        deploymentState.set({
          isDeploying: true,
          isBuildReady: true,
          error: null,
          buildError: null
        });
        
        // Continue with deployment...
      } catch (error) {
        // Check if this is an ActionCommandError with build error details
        if (error instanceof ActionCommandError) {
          deploymentState.set({
            isDeploying: false,
            isBuildReady: false,
            error: 'Build failed',
            buildError: {
              message: error.header || 'Build process failed',
              output: error.output || '',
              details: error.errorDetails
            }
          });
          
          // Save failed deployment to history
          await addDeployment({
            name: `deployment-${Date.now()}`,
            url: '',
            provider: 'netlify',
            status: 'failed',
            projectPath: currentChatId,
            error: error.header || 'Build failed',
            metadata: {
              buildError: true,
              buildOutput: error.output || '',
              errorDetails: error.errorDetails
            }
          });
        } else {
          // Handle other types of errors
          const errorMessage = error instanceof Error ? error.message : 'Unknown build error';
          deploymentState.set({
            isDeploying: false,
            isBuildReady: false,
            error: 'Build failed',
            buildError: {
              message: 'Build process failed',
              output: errorMessage
            }
          });
          
          // Save failed deployment to history
          await addDeployment({
            name: `deployment-${Date.now()}`,
            url: '',
            provider: 'netlify',
            status: 'failed',
            projectPath: currentChatId,
            error: errorMessage
          });
        }
        
        throw error;
      }

      // Get the build files
      const container = await webcontainer;

      // Use the dist directory path directly
      const buildPath = '/dist';

      // Get all files recursively
      async function getAllFiles(dirPath: string): Promise<Record<string, string>> {
        const files: Record<string, string> = {};
        const entries = await container.fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = `${dirPath}/${entry.name}`;

          if (entry.isFile()) {
            const content = await container.fs.readFile(fullPath, 'utf-8');

            // Remove /dist prefix from the path
            const deployPath = fullPath.replace(buildPath, '');
            files[deployPath] = content;
          } else if (entry.isDirectory()) {
            const subFiles = await getAllFiles(fullPath);
            Object.assign(files, subFiles);
          }
        }

        return files;
      }

      const fileContents = await getAllFiles(buildPath);

      // Use chatId instead of artifact.id
      const existingSiteId = localStorage.getItem(`netlify-site-${currentChatId}`);

      // Deploy using the API route with file contents
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteId: existingSiteId || undefined,
          files: fileContents,
          token: connection.token,
          chatId: currentChatId,
        }),
      });

      const data = (await response.json()) as any;

      if (!response.ok || !data.deploy || !data.site) {
        console.error('Invalid deploy response:', data);
        throw new Error(data.error || 'Invalid deployment response');
      }

      // Poll for deployment status
      const maxAttempts = 20; // 2 minutes timeout
      let attempts = 0;
      let deploymentStatus;

      while (attempts < maxAttempts) {
        try {
          const statusResponse = await fetch(
            `https://api.netlify.com/api/v1/sites/${data.site.id}/deploys/${data.deploy.id}`,
            {
              headers: {
                Authorization: `Bearer ${connection.token}`,
              },
            },
          );

          deploymentStatus = (await statusResponse.json()) as any;

          if (deploymentStatus.state === 'ready' || deploymentStatus.state === 'uploaded') {
            break;
          }

          if (deploymentStatus.state === 'error') {
            throw new Error('Deployment failed: ' + (deploymentStatus.error_message || 'Unknown error'));
          }

          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error('Status check error:', error);
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      if (attempts >= maxAttempts) {
        throw new Error('Deployment timed out');
      }

      // Store the site ID if it's a new site
      if (data.site) {
        localStorage.setItem(`netlify-site-${currentChatId}`, data.site.id);
      }

      if (deploymentStatus.state === 'ready' || deploymentStatus.state === 'uploaded') {
        const siteUrl = deploymentStatus.ssl_url || deploymentStatus.url;
        setDeploymentUrl(siteUrl);
        setIsDropdownOpen(false);
        
        // Reset deployment states
        setIsDeploying(false);
        deploymentState.set({
          isDeploying: false,
          isBuildReady: true,
          error: null,
          buildError: null
        });
      }
    } catch (error) {
      console.error('Deploy error:', error);
      toast.error(error instanceof Error ? error.message : 'Deployment failed');
      // Reset states on error
      setShowDeploymentProgress(false);
      setIsDeploying(false);
      deploymentState.set({
        isDeploying: false,
        isBuildReady: false,
        error: error instanceof Error ? error.message : 'Deployment failed',
        buildError: null
      });
    }
  };

  const handleCancelDeploy = async () => {
    try {
      setIsCancelling(true);
      // Cancel the deployment process
      setIsDeploying(false);
      setDeploymentUrl(null);
      toast.info('Deployment cancelled');
    } catch (error) {
      console.error('Error cancelling deployment:', error);
      toast.error('Failed to cancel deployment');
    } finally {
      setIsCancelling(false);
    }
  };

  // Add this new handler for when the progress animation completes
  const handleProgressComplete = () => {
    if (deploymentUrl) {
      setShowDeploymentProgress(false);
      setShowSuccessAnimation(true);
      setIsDeploying(false); // Reset deploying state
      deploymentState.set({
        isDeploying: false,
        isBuildReady: true,
        error: null,
        buildError: null
      });
    }
  };

  // Add this handler for when the success animation is closed
  const handleSuccessAnimationClose = () => {
    setShowSuccessAnimation(false);
  };

  return (
    <div className="flex">
      <div className="relative" ref={dropdownRef}>
        <div className="flex border border-bolt-elements-borderColor rounded-md overflow-hidden mr-2 text-sm">
          <Button
            active
            disabled={isDeploying || !activePreview || isStreaming}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-4 hover:bg-bolt-elements-item-backgroundActive flex items-center gap-2"
          >
            {isDeploying ? (
              <>
                <div className="i-ph:circle-notch animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <Globe size={16} />
                Deploy
              </>
            )}
          </Button>
        </div>

        {isDropdownOpen && (
          <div className="absolute right-2 flex flex-col gap-1 z-[100] p-1 mt-1 min-w-[13.5rem] bg-bolt-elements-background-depth-2 rounded-md shadow-lg bg-bolt-elements-backgroundDefault border border-bolt-elements-borderColor" onClick={(e) => e.stopPropagation()}>
            {!connection.user ? (
              <div className="p-4 bg-[#0D1117] border border-gray-800 rounded-lg">
                <h3 className="text-sm font-medium text-white mb-2">Connect to Netlify</h3>
                <div className="space-y-2">
                  <input
                    type="password"
                    value={netlifyToken}
                    onChange={(e) => setNetlifyToken(e.target.value)}
                    placeholder="Enter Netlify access token"
                    className="w-full px-3 py-1.5 bg-[#161B22] border border-gray-800 rounded text-sm text-white placeholder-gray-500"
                  />
                  <div className="flex items-center gap-2">
                    <a
                      href="https://app.netlify.com/user/applications"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#58a6ff] hover:underline"
                    >
                      Get token →
                    </a>
                    <button
                      onClick={verifyNetlifyToken}
                      disabled={isNetlifyVerifying || !netlifyToken}
                      className="ml-auto px-3 py-1.5 text-sm bg-[#238636] hover:bg-[#2ea043] text-white rounded disabled:opacity-50 flex items-center gap-2"
                    >
                      {isNetlifyVerifying ? (
                        <>
                          <div className="i-ph:spinner animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Connect'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Button
                  active
                  onClick={() => {
                    handleDeploy();
                    setIsDropdownOpen(false);
                  }}
                  disabled={isDeploying || !activePreview || !connection.user}
                  className="flex items-center w-full px-4 py-2 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive gap-2 rounded-md group relative"
                >
                  <img
                    className="w-5 h-5"
                    height="24"
                    width="24"
                    crossOrigin="anonymous"
                    src="https://cdn.simpleicons.org/netlify"
                  />
                  <span className="mx-auto">{!connection.user ? 'No Account Connected' : 'Deploy to Netlify'}</span>
                  {connection.user && <NetlifyDeploymentLink />}
                </Button>
                <Button
                  active={false}
                  disabled
                  className="flex items-center w-full rounded-md px-4 py-2 text-sm text-bolt-elements-textTertiary gap-2"
                >
                  <span className="sr-only">Coming Soon</span>
                  <img
                    className="w-5 h-5 bg-black p-1 rounded"
                    height="24"
                    width="24"
                    crossOrigin="anonymous"
                    src="https://cdn.simpleicons.org/vercel/white"
                    alt="vercel"
                  />
                  <span className="mx-auto">Deploy to Vercel (Coming Soon)</span>
                </Button>
                <Button
                  active={false}
                  disabled
                  className="flex items-center w-full rounded-md px-4 py-2 text-sm text-bolt-elements-textTertiary gap-2"
                >
                  <span className="sr-only">Coming Soon</span>
                  <img
                    className="w-5 h-5"
                    height="24"
                    width="24"
                    crossOrigin="anonymous"
                    src="https://cdn.simpleicons.org/cloudflare"
                    alt="vercel"
                  />
                  <span className="mx-auto">Deploy to Cloudflare (Coming Soon)</span>
                </Button>
                {connection.user && <DeploymentHistory />}
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Deployment progress modal */}
      {showDeploymentProgress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        >
          <DeploymentProgressCard
            onComplete={handleProgressComplete}
            provider="netlify" // or "vercel" or "cloudflare"
          />
        </motion.div>
      )}
      
      {/* Success animation */}
      {showSuccessAnimation && deploymentUrl && (
        <DeploymentSuccessAnimation 
          deploymentUrl={deploymentUrl} 
          onClose={handleSuccessAnimationClose} 
        />
      )}
    </div>
  );
}

interface ButtonProps {
  active?: boolean;
  disabled?: boolean;
  children?: any;
  onClick?: VoidFunction;
  className?: string;
}

function Button({ active = false, disabled = false, children, onClick, className }: ButtonProps) {
  return (
    <button
      className={classNames(
        'flex items-center p-1.5',
        {
          'bg-bolt-elements-item-backgroundDefault hover:bg-bolt-elements-item-backgroundActive text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary':
            !active,
          'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent': active && !disabled,
          'bg-bolt-elements-item-backgroundDefault text-alpha-gray-20 dark:text-alpha-white-20 cursor-not-allowed':
            disabled,
        },
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}