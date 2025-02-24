import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { checkAuthStatus, signOut } from '~/utils/auth';
import { useLocation } from '@remix-run/react';

interface HeaderProps {
  setShowLoginPopup: (show: boolean) => void;
}

export function Header({ setShowLoginPopup }: HeaderProps) {
  const chat = useStore(chatStore);
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuthStatus());
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = checkAuthStatus();
      setIsAuthenticated(isAuth);

      if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');

        if (user) {
          setUserInfo(JSON.parse(user));
          setShowLoginPopup(false);
        } else {
          setUserInfo(null);
        }
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, [setShowLoginPopup]);

  const handleSignOut = async () => {
    await signOut()
    window.location.reload()
  }

  return (
    <header
      className={classNames('flex items-center justify-between p-5 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <div className="i-ph:sidebar-simple-duotone text-xl" />
        <a href="/" className="text-2xl font-semibold text-accent flex items-center">
          <img src="/logo-light-styled.png" alt="logo" className="w-[90px] inline-block dark:hidden" />
          <img src="/logo-dark-styled.png" alt="logo" className="w-[90px] inline-block hidden dark:block" />
        </a>
      </div>
      {chat.started && (
        <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
          <ClientOnly>{() => <ChatDescription />}</ClientOnly>
        </span>
      )}
      {isAuthenticated && userInfo ? (
        <div className="relative z-50" ref={dropdownRef}>
          <button onClick={() => setShowDropdown(!showDropdown)} className="w-10 h-10 rounded-full">
            <img src={userInfo.picture} alt={userInfo.name} className="w-10 h-10 rounded-full" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-lg rounded-xl shadow-2xl py-2 border border-white/10">
              <div className="px-4 py-3 text-sm text-gray-300 border-b border-white/10">
                <div className="font-medium">{userInfo.name}</div>
                <div className="text-xs mt-1 text-gray-400">{userInfo.email}</div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-white bg-red-600 hover:bg-white/5 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setShowLoginPopup(true)}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
        >
          Sign In
        </button>
      )}
    </header>
  );
}
