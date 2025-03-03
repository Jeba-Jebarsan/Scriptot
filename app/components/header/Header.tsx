import { useStore } from '@nanostores/react';  
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { checkAuthStatus } from '~/utils/auth';
import { useLocation } from '@remix-run/react';

interface HeaderProps {
  setShowLoginPopup: (show: boolean) => void;
}

export function Header({ setShowLoginPopup }: HeaderProps) {
  const chat = useStore(chatStore);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const revalidator = useRevalidator();

  // ✅ Close dropdown when clicking outside
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

  // ✅ Check authentication state and update UI
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
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-10 h-10 rounded-full"
            >
            <img 
              src={userInfo.picture} 
              alt={userInfo.name} 
              className="w-10 h-10 rounded-full"
            />
          </button>

          {showDropdown && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700"
              style={{
                transform: 'translateX(-10px)',
                transition: 'transform 200ms ease-out, opacity 200ms ease-out',
                opacity: showDropdown ? 1 : 0
              }}
            >
              <Link
                to={`/profile/${userInfo.supabaseId}`}
                className="w-full px-4 py-3 text-left text-sm text-white hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
              >
                <div className="i-ph:user text-lg" />
                Profile
              </Link>
              <Link
                to="/settings"
                className="w-full px-4 py-3 text-left text-sm text-white hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 border-t border-gray-700"
              >
                <div className="i-ph:gear text-lg" />
                Settings
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  window.dispatchEvent(new Event('storage'));
                  window.location.reload();
                }}
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
