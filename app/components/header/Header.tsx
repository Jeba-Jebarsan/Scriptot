import { useStore } from '@nanostores/react';  
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { useState, useEffect, useRef } from 'react';
import { useRevalidator, Link } from '@remix-run/react';
import { supabase } from '~/lib/supabase';

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Check authentication state and update UI
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (session?.user) {
        const userData = {
          email: session.user.email,
          name: session.user.user_metadata.full_name || session.user.email,
          picture: session.user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.user_metadata.full_name || session.user.email)}`,
          supabaseId: session.user.id
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUserInfo(userData);
        setShowLoginPopup(false);
      } else {
        localStorage.removeItem('user');
        setUserInfo(null);
      }
    };

    checkAuth();

    // ✅ Sync auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth event: ${event}`, session);
      checkAuth();
    });

    return () => subscription?.unsubscribe();
  }, [setShowLoginPopup]);

  // ✅ Sign out and ensure full state reset
  const handleSignOut = async () => {
    try {
      localStorage.removeItem('user'); // Clear first
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUserInfo(null);
      setShowDropdown(false);

      // Reset chat store to prevent stale messages
      chatStore.set({ started: false, aborted: false, showChat: false });

      // Refresh the page or trigger Remix revalidation
      revalidator.revalidate(); // Ensures Remix syncs with new session state
      window.location.reload(); // Optional: Hard reset if needed

    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className={classNames('flex items-center justify-between p-5 border-b h-[var(--header-height)]', {
      'border-transparent': !chat.started,
      'border-bolt-elements-borderColor': chat.started,
    })}>
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        {isAuthenticated && (
          <img 
            src="/sidebar.png"
            alt="menu" 
            className="w-6 h-6" 
          />
        )}
        <a href="/" className="text-2xl font-semibold text-accent flex items-center">
          <img src="/logo-light-styled.png" alt="logo" className="w-[90px] inline-block dark:hidden" />
          <img src="/logo-dark-styled.png" alt="logo" className="w-[90px] inline-block hidden dark:block" />
        </a>
      </div>

      {chat.started && (
        <div className="flex items-center gap-4">
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>{() => <HeaderActionButtons />}</ClientOnly>
        </div>
      )}

      {isAuthenticated && userInfo ? (
        <div className="relative z-50" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-[#1A1B1E] border border-gray-700 rounded-lg hover:bg-gray-800 active:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out flex items-center gap-2"
          >
            {userInfo.name}
            <div className={`i-ph:caret-down transition-transform ${showDropdown ?'rotate-180' : ''}`} />
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
                onClick={handleSignOut}
                className="w-full px-4 py-3 text-left text-sm text-white bg-black/7 hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 border-t border-gray-700"
              >
                <div className="i-ph:sign-out text-lg" />
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
