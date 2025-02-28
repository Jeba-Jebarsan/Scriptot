import * as RadixDialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { useState, type ReactElement, useEffect, useRef } from 'react';
import { classNames } from '~/utils/classNames';
import { DialogTitle, dialogVariants, dialogBackdropVariants } from '~/components/ui/Dialog';
import { IconButton } from '~/components/ui/IconButton';
import styles from './Settings.module.scss';
import ProvidersTab from './providers/ProvidersTab';
import { useSettings } from '~/lib/hooks/useSettings';
import FeaturesTab from './features/FeaturesTab';
import DebugTab from './debug/DebugTab';
import EventLogsTab from './event-logs/EventLogsTab';
import ConnectionsTab from './connections/ConnectionsTab';
import DataTab from './data/DataTab';
import AppearanceTab from './Appearance/AppearanceTab';
import HelpTab from './Help/HelpTab';
import { signOut } from '~/utils/auth';
import { useResponsive } from '~/utils/mobile';

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

type TabType = 'data' | 'features' | 'debug' | 'event-logs' | 'connection' | 'appearance' | 'help';

export const SettingsWindow = ({ open, onClose }: SettingsProps) => {
  const { debug, eventLogs } = useSettings();
  const [activeTab, setActiveTab] = useState<TabType>('data');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useResponsive();

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        if (user) {
          setUserInfo(JSON.parse(user));
          setIsAuthenticated(true);
        } else {
          setUserInfo(null);
          setIsAuthenticated(false);
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
  }, []);

  const handleLogout = async () => {
    await signOut();
  };

  const tabs: { id: TabType; label: string; icon: string; component?: ReactElement }[] = [
    { id: 'data', label: 'Data', icon: 'i-ph:database', component: <DataTab /> },
    { id: 'connection', label: 'Connection', icon: 'i-ph:link', component: <ConnectionsTab /> },
    { id: 'features', label: 'Features', icon: 'i-ph:star', component: <FeaturesTab /> },
    { id: 'appearance', label: 'Appearance', icon: 'i-ph:palette', component: <AppearanceTab /> },
    {
      id: 'help',
      label: 'Help',
      icon: 'i-ph:question',
      component: <HelpTab />,
    },
    ...(debug
      ? [
          {
            id: 'debug' as TabType,
            label: 'Debug Tab',
            icon: 'i-ph:bug',
            component: <DebugTab />,
          },
        ]
      : []),
    ...(eventLogs
      ? [
          {
            id: 'event-logs' as TabType,
            label: 'Event Logs',
            icon: 'i-ph:list-bullets',
            component: <EventLogsTab />,
          },
        ]
      : []),
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!contentRef.current) return;
    
    const touchY = e.touches[0].clientY;
    const touchX = e.touches[0].clientX;
    
    // Calculate the difference
    const diffY = touchStartY - touchY;
    const diffX = touchStartX - touchX;
    
    // If horizontal swipe is greater than vertical, prevent default to allow scrolling
    if (Math.abs(diffX) > Math.abs(diffY)) {
      return;
    }
    
    // If at the top and trying to scroll down, or at the bottom and trying to scroll up
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    
    if ((scrollTop <= 0 && diffY < 0) || (scrollTop + clientHeight >= scrollHeight && diffY > 0)) {
      e.preventDefault();
    }
  };

  return (
    <RadixDialog.Root open={open}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay asChild onClick={onClose}>
          <motion.div
            className="bg-black/50 fixed inset-0 z-max backdrop-blur-sm"
            initial="closed"
            animate="open"
            exit="closed"
            variants={dialogBackdropVariants}
          />
        </RadixDialog.Overlay>
        <RadixDialog.Content aria-describedby={undefined} asChild>
          <motion.div
            className={`fixed top-[50%] left-[50%] z-max ${
              isMobile ? 'h-[100vh] w-[100vw]' : 'h-[85vh] w-[90vw] max-w-[900px]'
            } translate-x-[-50%] translate-y-[-50%] border border-bolt-elements-borderColor bg-bolt-elements-background rounded-xl shadow-2xl focus:outline-none overflow-hidden backdrop-blur-lg`}
            initial="closed"
            animate="open"
            exit="closed"
            variants={dialogVariants}
          >
            <div className={`flex h-full ${isMobile ? 'flex-col' : ''}`}>
              <div
                className={classNames(
                  isMobile ? 'w-full border-b' : 'w-48 border-r',
                  'border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 p-4 flex flex-col',
                  styles['settings-tabs']
                )}
              >
                <DialogTitle className="flex-shrink-0 text-lg font-semibold text-bolt-elements-textPrimary mb-2">
                  Settings
                </DialogTitle>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={classNames(activeTab === tab.id ? styles.active : '')}
                  >
                    <div className={tab.icon} />
                    {tab.label}
                  </button>
                ))}
              
              </div>
              <div 
                ref={contentRef}
                className={`${isMobile ? 'h-full' : 'flex-1'} overflow-y-auto`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              >
                {tabs.find((tab) => tab.id === activeTab)?.component}
              </div>
            </div>
            <RadixDialog.Close asChild onClick={onClose}>
              <IconButton 
                icon="i-ph:x" 
                className={`absolute ${isMobile ? 'top-[15px] right-[15px]' : 'top-[10px] right-[10px]'}`} 
              />
            </RadixDialog.Close>
          </motion.div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};
