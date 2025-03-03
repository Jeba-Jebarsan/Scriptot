import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface GitAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (username: string, password: string) => void;
  repoUrl: string;
}

export function GitAuthModal({ isOpen, onClose, onSubmit, repoUrl }: GitAuthModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authType, setAuthType] = useState<'basic' | 'token'>('basic');
  
  const handleSubmit = () => {
    if (!username || !password) {
      toast.error('Username and password are required');
      return;
    }
    onSubmit(username, password);
    onClose();
  };

  if (!isOpen) return null;

  // Extract domain and repo name for display
  const domain = repoUrl.split('/')[2] || '';
  const repoName = repoUrl.split('/').pop()?.replace('.git', '') || '';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-bolt-elements-background-depth-1 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-bolt-elements-background-depth-3 rounded-full flex items-center justify-center">
                <span className="i-ph:lock-simple text-2xl text-bolt-elements-textPrimary"></span>
              </div>
            </div>
            <h3 className="text-xl font-medium text-bolt-elements-textPrimary mb-2">
              Authentication Required
            </h3>
            <p className="text-sm text-bolt-elements-textTertiary mb-1">
              This repository requires authentication
            </p>
            <p className="text-xs text-bolt-elements-textSecondary bg-bolt-elements-background-depth-2 py-1 px-2 rounded inline-flex items-center gap-1">
              <span className="i-ph:git-repository"></span>
              {domain}/{repoName}
            </p>
          </div>

          <div className="w-full">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setAuthType('basic')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${
                  authType === 'basic' 
                    ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text' 
                    : 'bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary'
                }`}
              >
                Username & Password
              </button>
              <button
                onClick={() => setAuthType('token')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${
                  authType === 'token' 
                    ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text' 
                    : 'bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary'
                }`}
              >
                Access Token
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-bolt-elements-textSecondary mb-1">
                  {authType === 'basic' ? 'Username' : 'Username or Email'}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={authType === 'basic' ? "Enter your username" : "Enter username or email"}
                  className="w-full bg-white dark:bg-bolt-elements-background-depth-4 px-4 py-2 rounded-lg border border-bolt-elements-borderColor focus:outline-none text-bolt-elements-textPrimary"
                  autoFocus
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm text-bolt-elements-textSecondary">
                    {authType === 'basic' ? 'Password' : 'Access Token'}
                  </label>
                  {authType === 'token' && (
                    <a 
                      href={domain.includes('github') ? 'https://github.com/settings/tokens' : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                    >
                      Get token
                      <span className="i-ph:arrow-square-out w-3 h-3"></span>
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={authType === 'basic' ? "Enter your password" : "Enter your access token"}
                  className="w-full bg-white dark:bg-bolt-elements-background-depth-4 px-4 py-2 rounded-lg border border-bolt-elements-borderColor focus:outline-none text-bolt-elements-textPrimary"
                />
                {authType === 'token' && (
                  <p className="mt-1 text-xs text-bolt-elements-textTertiary">
                    For GitHub, use a personal access token with the 'repo' scope
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-red-500 text-bolt-elements-textPrimary transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!username || !password}
              className="flex-1 px-4 py-2 rounded-lg bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <div className="i-ph:lock-key"></div>
              Authenticate
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 