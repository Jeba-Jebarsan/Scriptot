import React from 'react';

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
  { text: 'Build a pomodoro timer app' }
];

export function ExamplePrompts(sendMessage?: { (event: React.UIEvent, messageInput?: string): void | undefined }) {
  return (
    <div id="examples" className="relative flex flex-col gap-9 w-full max-w-3xl mx-auto flex justify-center mt-6">
      <div
        className="flex flex-wrap justify-center gap-2"
        style={{
          animation: '.25s ease-out 0s 1 _fade-and-move-in_g2ptj_1 forwards',
        }}
      >
        {EXAMPLE_PROMPTS.map((examplePrompt, index: number) => {
          return (
            <button
              key={index}
              onClick={(event) => {
                sendMessage?.(event, examplePrompt.text);
              }}
              className="border border-bolt-elements-borderColor rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-900 text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary px-3 py-1 text-xs transition-theme"
            >
              {examplePrompt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
