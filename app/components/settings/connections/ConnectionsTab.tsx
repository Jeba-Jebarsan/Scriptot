import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { logStore } from '~/lib/stores/logs';
import { netlifyConnection, updateNetlifyConnection, fetchNetlifyStats } from '~/lib/services/netlify';
import { useStore } from '@nanostores/react';
import type { NetlifyUser } from '~/types/netlify';
import { motion } from 'framer-motion';
import { GithubConnection } from '~/components/@settings/tabs/connections/components/GithubConnection';
import { NetlifyConnection } from '~/components/@settings/tabs/connections/components/NetlifyConnection';
import { DeploymentHistory } from '~/components/@settings/tabs/connections/components/DeploymentHistory';

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
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        className="flex items-center gap-2 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="i-ph:plugs-connected w-5 h-5 text-purple-500" />
        <h2 className="text-lg font-medium text-bolt-elements-textPrimary">Connection Settings</h2>
      </motion.div>
      <p className="text-sm text-bolt-elements-textSecondary mb-6">
        Manage your external service connections and integrations
      </p>

      <div className="grid grid-cols-1 gap-4">
        <GithubConnection />
        <NetlifyConnection />
        <DeploymentHistory />
      </div>
    </div>
  );
}
