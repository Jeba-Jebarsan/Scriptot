import React, { useState, useEffect, useCallback } from 'react';

const EXAMPLE_PROMPTS = [
  { text: 'Help me create a simple todo list app' },
  { text: 'Build a weather app that fetches data from an API' },
  { text: 'Create a basic calculator with JavaScript' },
  { text: 'Build a markdown note taking app' },
  { text: 'Create a simple e-commerce product page' },
  { text: 'Build a photo gallery with image upload' },
  { text: 'Create a countdown timer app' },
  { text: 'Build a recipe search and save app' },
  { text: 'Create a budget tracking tool' },
  { text: 'Build a simple music player' },
  { text: 'Create a habit tracking app' },
  { text: 'Build a pomodoro timer app' },
  { text: 'Create Login Signup Screen' },
  { text: 'Create Netflix Clone' },
  { text: 'Create YouTube Clone' },
  { text: 'Create Instagram Clone' },
  { text: 'Create Twitter Clone' },
  { text: 'Create Amazon Clone' },
  { text: 'Create Spotify Clone' },
  { text: 'Create WhatsApp Clone' },
  { text: 'Create TikTok Clone' },
  { text: 'Create LinkedIn Clone' },
  { text: 'Create Airbnb Clone' },
];

export function ExamplePrompts({
  sendMessage,
  setShowLoginPopup,
}: {
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  setShowLoginPopup?: (show: boolean) => void;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        setIsAuthenticated(!!localStorage.getItem('user'));
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

  const handleExampleClick = useCallback(
    (event: React.UIEvent, text: string) => {
      event.preventDefault();

      if (!isAuthenticated) {
        setShowLoginPopup?.(true);
        return;
      }

      sendMessage?.(event, text);
    },
    [isAuthenticated, sendMessage, setShowLoginPopup]
  );

  return (
    <div id="examples" className="relative flex flex-col gap-9 w-full max-w-3xl mx-auto flex justify-center mt-6">
      <div className="flex flex-wrap justify-center gap-2">
        {EXAMPLE_PROMPTS.map((examplePrompt, index: number) => (
          <button
            key={index}
            onClick={(event) => handleExampleClick(event, examplePrompt.text)}
            className="border border-bolt-elements-borderColor rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-900 text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary px-3 py-1 text-xs transition-theme"
          >
            {examplePrompt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
