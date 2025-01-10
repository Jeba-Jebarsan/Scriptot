import React from 'react';
import { useStore } from '@nanostores/react';
import { themeStore, toggleTheme } from '~/lib/stores/theme';
import { Switch } from '~/components/ui/Switch';

export default function AppearanceTab() {
  const theme = useStore(themeStore);
  
  return (
    <div className="p-4 bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor rounded-lg mb-4">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-4">Theme Settings</h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-bolt-elements-textPrimary">Dark Mode</span>
            <p className="text-xs text-bolt-elements-textTertiary">
              Switch between light and dark themes
            </p>
          </div>
          <Switch 
            checked={theme === 'dark'} 
            onCheckedChange={(checked) => {
              if (checked !== (theme === 'dark')) {
                toggleTheme();
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
}