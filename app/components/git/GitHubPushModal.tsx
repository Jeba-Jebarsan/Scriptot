import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { workbenchStore } from '~/lib/stores/workbench';
import Cookies from 'js-cookie';

interface PushSuccessProps {
  repoUrl: string;
  onClose: () => void;
}

function PushSuccess({ repoUrl, onClose }: PushSuccessProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-bolt-elements-background-depth-1 rounded-lg p-6 max-w-md w-full mx-4"
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center"
        >
          <div className="i-ph:check-circle text-3xl text-green-600" />
        </motion.div>

        <div className="text-center">
          <h3 className="text-xl font-medium text-bolt-elements-textPrimary mb-2">Successfully Pushed!</h3>
          <p className="text-sm text-bolt-elements-textTertiary mb-4">Your code has been pushed to GitHub</p>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-600 break-all"
          >
            {repoUrl}
          </a>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 rounded-lg bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text transition-all flex items-center justify-center gap-2"
        >
          <div className="i-ph:check" />
          Done
        </button>
      </div>
    </motion.div>
  );
}

export function GitHubPushModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [repoName, setRepoName] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [isPushing, setIsPushing] = useState(false);
  const [step, setStep] = useState<'repo' | 'credentials' | 'success'>('repo');
  const [repoUrl, setRepoUrl] = useState('');

  const handleNext = () => {
    if (!repoName) {
      toast.error('Repository name is required');
      return;
    }

    setStep('credentials');
  };

  const handlePush = async () => {
    try {
      setIsPushing(true);

      if (!githubUsername || !githubToken) {
        toast.error('GitHub username and token are required');
        return;
      }

      const url = await workbenchStore.pushToGitHub(repoName, githubUsername, githubToken);
      setRepoUrl(url);
      setStep('success');
    } catch (err) {
      console.error('Push failed:', err);

      const error = err as Error;

      if (error.message.includes('Resource not accessible by personal access token')) {
        toast.error(
          'Your GitHub token needs additional permissions. Please ensure it has "repo" and "workflow" scopes. Visit GitHub Settings > Developer Settings > Personal Access Tokens to update permissions.',
          { autoClose: 10000 }
        );
      } else {
        toast.error(`Failed to push: ${error.message}`);
      }
    } finally {
      setIsPushing(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {step === 'success' ? (
        <PushSuccess repoUrl={repoUrl} onClose={onClose} />
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-bolt-elements-background-depth-1 rounded-lg p-6 max-w-md w-full mx-4"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h3 className="text-xl font-medium text-bolt-elements-textPrimary mb-2">
                {step === 'repo' ? 'Create Repository' : 'GitHub Credentials'}
              </h3>
              <p className="text-sm text-bolt-elements-textTertiary">
                {step === 'repo'
                  ? 'Enter a name for your new repository'
                  : 'Enter your GitHub credentials to push the code'}
              </p>
            </div>

            {step === 'repo' ? (
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="Repository name"
                className="w-full bg-white dark:bg-bolt-elements-background-depth-4 px-4 py-2 rounded-lg border border-bolt-elements-borderColor focus:outline-none text-bolt-elements-textPrimary"
              />
            ) : (
              <div className="w-full space-y-4">
                <div>
                  <label className="block text-sm text-bolt-elements-textSecondary mb-1">GitHub Username:</label>
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    className="w-full bg-white dark:bg-bolt-elements-background-depth-4 px-4 py-2 rounded-lg border border-bolt-elements-borderColor focus:outline-none text-bolt-elements-textPrimary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-bolt-elements-textSecondary mb-1">Personal Access Token:</label>
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="w-full bg-white dark:bg-bolt-elements-background-depth-4 px-4 py-2 rounded-lg border border-bolt-elements-borderColor focus:outline-none text-bolt-elements-textPrimary"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 w-full">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg border border-bolt-elements-borderColor hover:bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary transition-all"
              >
                Cancel
              </button>
              <button
                onClick={step === 'repo' ? handleNext : handlePush}
                disabled={
                  isPushing ||
                  (!repoName && step === 'repo') ||
                  ((!githubUsername || !githubToken) && step === 'credentials')
                }
                className="flex-1 px-4 py-2 rounded-lg bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isPushing ? (
                  <>
                    <div className="i-ph:spinner animate-spin" />
                    Pushing...
                  </>
                ) : (
                  <>
                    <div className="i-ph:github-logo" />
                    {step === 'repo' ? 'Next' : 'Push'}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
