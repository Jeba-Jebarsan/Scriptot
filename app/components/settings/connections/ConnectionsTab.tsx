import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { logStore } from '~/lib/stores/logs';
import { netlifyConnection, updateNetlifyConnection, fetchNetlifyStats } from '~/lib/services/netlify';
import { useStore } from '@nanostores/react';
import type { NetlifyUser } from '~/types/netlify';

interface GitHubUserResponse {
  login: string;
  id: number;
  [key: string]: any; // for other properties we don't explicitly need
}

export default function ConnectionsTab() {
  const [githubUsername, setGithubUsername] = useState(Cookies.get('githubUsername') || '');
  const [githubToken, setGithubToken] = useState(Cookies.get('githubToken') || '');
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [isGithubVerifying, setIsGithubVerifying] = useState(false);
  const [netlifyToken, setNetlifyToken] = useState(Cookies.get('netlifyToken') || '');
  const [isNetlifyVerifying, setIsNetlifyVerifying] = useState(false);
  const connection = useStore(netlifyConnection);

  useEffect(() => {
    if (githubUsername && githubToken) {
      verifyGitHubCredentials();
    }
    if (netlifyToken) {
      verifyNetlifyToken();
    }
  }, []);

  const verifyGitHubCredentials = async () => {
    setIsGithubVerifying(true);

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
      });

      if (response.ok) {
        const data = (await response.json()) as GitHubUserResponse;

        if (data.login === githubUsername) {
          setIsGithubConnected(true);
          return true;
        }
      }

      setIsGithubConnected(false);

      return false;
    } catch (error) {
      console.error('Error verifying GitHub credentials:', error);
      setIsGithubConnected(false);

      return false;
    } finally {
      setIsGithubVerifying(false);
    }
  };

  const verifyNetlifyToken = async () => {
    setIsNetlifyVerifying(true);
    try {
      const cleanToken = netlifyToken.replace('Bearer ', '');
      // Reset connection state before verification
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

  const handleSaveConnection = async () => {
    if (!githubUsername || !githubToken) {
      toast.error('Please provide both GitHub username and token');
      return;
    }

    setIsGithubVerifying(true);

    const isValid = await verifyGitHubCredentials();

    if (isValid) {
      Cookies.set('githubUsername', githubUsername);
      Cookies.set('githubToken', githubToken);
      logStore.logSystem('GitHub connection settings updated', {
        username: githubUsername,
        hasToken: !!githubToken,
      });
      toast.success('GitHub credentials verified and saved successfully!');
      Cookies.set('git:github.com', JSON.stringify({ username: githubToken, password: 'x-oauth-basic' }));
      setIsGithubConnected(true);
    } else {
      toast.error('Invalid GitHub credentials. Please check your username and token.');
    }
  };

  const handleDisconnect = () => {
    Cookies.remove('githubUsername');
    Cookies.remove('githubToken');
    Cookies.remove('git:github.com');
    setGithubUsername('');
    setGithubToken('');
    setIsGithubConnected(false);
    logStore.logSystem('GitHub connection removed');
    toast.success('GitHub connection removed successfully!');
  };

  const handleNetlifyDisconnect = () => {
    Cookies.remove('netlifyToken');
    setNetlifyToken('');
    updateNetlifyConnection({ user: null, token: '' });
    localStorage.removeItem('netlify_connection');
    logStore.logSystem('Netlify connection removed');
    toast.success('Netlify connection removed successfully!');
  };

  return (
    <div className="p-4 mb-4 border border-bolt-elements-borderColor rounded-lg bg-bolt-elements-background-depth-3">
      <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-4">GitHub Connection</h3>
      <div className="flex mb-4">
        <div className="flex-1 mr-2">
          <label className="block text-sm text-bolt-elements-textSecondary mb-1">GitHub Username:</label>
          <input
            type="text"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            disabled={isGithubVerifying}
            className="w-full bg-white dark:bg-bolt-elements-background-depth-4 relative px-2 py-1.5 rounded-md focus:outline-none placeholder-bolt-elements-textTertiary text-bolt-elements-textPrimary dark:text-bolt-elements-textPrimary border border-bolt-elements-borderColor disabled:opacity-50"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-bolt-elements-textSecondary mb-1">Personal Access Token:</label>
          <input
            type="password"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            disabled={isGithubVerifying}
            className="w-full bg-white dark:bg-bolt-elements-background-depth-4 relative px-2 py-1.5 rounded-md focus:outline-none placeholder-bolt-elements-textTertiary text-bolt-elements-textPrimary dark:text-bolt-elements-textPrimary border border-bolt-elements-borderColor disabled:opacity-50"
          />
        </div>
      </div>
      <div className="flex mb-4 items-center">
        {!isGithubConnected ? (
          <button
            onClick={handleSaveConnection}
            disabled={isGithubVerifying || !githubUsername || !githubToken}
            className="bg-bolt-elements-button-primary-background rounded-lg px-4 py-2 mr-2 transition-colors duration-200 hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isGithubVerifying ? (
              <>
                <div className="i-ph:spinner animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Connect'
            )}
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="bg-bolt-elements-button-danger-background rounded-lg px-4 py-2 mr-2 transition-colors duration-200 hover:bg-bolt-elements-button-danger-backgroundHover text-bolt-elements-button-danger-text"
          >
            Disconnect
          </button>
        )}
        {isGithubConnected && (
          <span className="text-sm text-green-600 flex items-center">
            <div className="i-ph:check-circle mr-1" />
            Connected to GitHub
          </span>
        )}
      </div>
      <div className="p-4 mb-4 border border-bolt-elements-borderColor rounded-lg bg-bolt-elements-background-depth-3">
        <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-4">Netlify Connection</h3>
        <div className="flex mb-4">
          <div className="flex-1">
            <label className="block text-sm text-bolt-elements-textSecondary mb-1">
              Personal Access Token
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
              value={netlifyToken}
              onChange={async (e) => {
                const newToken = e.target.value.replace('Bearer ', ''); // Remove Bearer if pasted with it
                setNetlifyToken(newToken);
                Cookies.set('netlifyToken', newToken);
                if (newToken) {
                  const isValid = await verifyNetlifyToken();
                  if (isValid) {
                    toast.success('Netlify token verified successfully!');
                  } else {
                    toast.error('Invalid Netlify token');
                  }
                }
              }}
              className="w-full bg-white dark:bg-bolt-elements-background-depth-4 relative px-2 py-1.5 rounded-md focus:outline-none placeholder-bolt-elements-textTertiary text-bolt-elements-textPrimary dark:text-bolt-elements-textPrimary border border-bolt-elements-borderColor"
            />
            <p className="mt-1 text-xs text-bolt-elements-textTertiary">
              Get your token from Netlify: User Settings → Applications → New access token
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {connection.user ? (
            <>
              <button
                onClick={handleNetlifyDisconnect}
                className="bg-bolt-elements-button-danger-background rounded-lg px-4 py-2 mr-2 transition-colors duration-200 hover:bg-bolt-elements-button-danger-backgroundHover text-bolt-elements-button-danger-text"
              >
                Disconnect
              </button>
              <span className="text-sm text-green-600 flex items-center">
                <div className="i-ph:check-circle mr-1" />
                Connected as {connection.user.full_name}
              </span>
            </>
          ) : (
            isNetlifyVerifying && (
              <span className="text-sm text-bolt-elements-textSecondary flex items-center">
                <div className="i-ph:spinner animate-spin mr-2" />
                Verifying...
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
