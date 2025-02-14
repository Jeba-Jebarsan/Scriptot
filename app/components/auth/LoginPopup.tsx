import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from 'react-toastify';
import { useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from '@remix-run/react';

interface LoginPopupProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function LoginPopup({ onSuccess, onClose }: LoginPopupProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const upsertUser = useMutation(api.users.upsertUser);
  const getUser = useQuery(api.users.getUser, { 
    email: typeof window !== 'undefined' && localStorage.getItem('user') 
      ? JSON.parse(localStorage.getItem('user')!).email 
      : "" 
  });

  const handleLoginSuccess = useCallback(() => {
    onSuccess();
    onClose();
    
    // Force a full page refresh to reinitialize all states
    window.location.href = location.pathname;
  }, [onSuccess, onClose, location.pathname]);

  const handleGoogleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        
        const result = await upsertUser({
          email: userInfo.data.email,
          name: userInfo.data.name,
          picture: userInfo.data.picture,
          googleToken: tokenResponse.access_token,
        });
        
        const userData = {
          email: userInfo.data.email,
          name: userInfo.data.name,
          picture: userInfo.data.picture,
          _id: result,
          googleToken: tokenResponse.access_token
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('auth-change'));
        
        toast.success('Successfully logged in!');
        handleLoginSuccess();
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Login failed. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast.error('Google login failed. Please try again.');
    },
  });

  const handleGitHubLogin = () => {
    // Get client ID from environment variables
    const clientId = process.env.VITE_GITHUB_CLIENT_ID || 
                    import.meta.env.VITE_GITHUB_CLIENT_ID;
    
    if (!clientId) {
      console.error('GitHub Client ID is not configured. Current environment:', {
        processEnv: process.env.VITE_GITHUB_CLIENT_ID,
        importMetaEnv: import.meta.env.VITE_GITHUB_CLIENT_ID
      });
      toast.error('GitHub login is not properly configured. Please contact support.');
      return;
    }

    // Use the deployed URL for production, localhost for development
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://scriptot.pages.dev'
      : window.location.origin;
      
    const redirectUri = `${baseUrl}/auth/github/callback`;
    const scope = 'read:user user:email';
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  useEffect(() => {
    function getCookie(name: string) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    }

    const userDataCookie = getCookie('userData');
    if (userDataCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataCookie));
        if (!userData.email || !userData._id) {
          throw new Error('Invalid user data');
        }
        localStorage.setItem('user', JSON.stringify(userData));
        document.cookie = 'userData=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('auth-change'));
        toast.success('Successfully logged in with GitHub!');
        handleLoginSuccess();
      } catch (error) {
        console.error('Error processing user data:', error);
        toast.error('Login failed. Please try again.');
      }
    }
  }, [handleLoginSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-bolt-elements-background-depth-2 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary transition-colors">
          <div className="i-ph:x text-xl" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-bolt-elements-textPrimary mb-3">Welcome Back</h2>
          <p className="text-bolt-elements-textSecondary">
            Sign in to unlock the full potential of our chat application
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleGoogleLogin();
            }}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl 
                     bg-white dark:bg-bolt-elements-background-depth-4 text-bolt-elements-textPrimary
                     border border-bolt-elements-borderColor hover:border-accent-500
                     transition-all duration-200 hover:shadow-md"
          >
            <img src="/google.webp" alt="Google" className="w-5 h-5" />
            <span className="font-medium">Continue with Google</span>
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              handleGitHubLogin();
            }}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl 
                     bg-[#24292e] text-white
                     border border-[#1b1f23] hover:bg-[#2c3137]
                     transition-all duration-200 hover:shadow-md"
          >
            <div className="i-ph:github-logo text-xl" />
            <span className="font-medium">Continue with GitHub</span>
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-bolt-elements-textTertiary">
          By continuing, you agree to our 
          <a href="#" className="text-accent-500 hover:underline ml-1">Terms of Service</a>
        </div>
      </motion.div>
    </motion.div>
  );
}