import { useStore } from '@nanostores/react';
import { deploymentState } from '~/lib/stores/deployment';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { chatStore } from '~/lib/stores/chat';

export function BuildErrorDisplay() {
  const deployment = useStore(deploymentState);
  const [showFullOutput, setShowFullOutput] = useState(false);
  
  if (!deployment.buildError) return null;
  
  // Extract common error patterns and suggest solutions
  const suggestSolution = (output: string) => {
    if (output.includes('Module not found')) {
      const moduleMatch = output.match(/Module not found: Error: Can't resolve '([^']+)'/);
      if (moduleMatch) {
        const moduleName = moduleMatch[1];
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg"
          >
            <h4 className="font-medium text-amber-400 flex items-center gap-2">
              <div className="i-ph:lightbulb-filament text-lg" />
              Suggested Solution
            </h4>
            <p className="mt-2">Missing module: <code className="bg-bolt-elements-bg-depth-1 px-1.5 py-0.5 rounded font-mono">{moduleName}</code></p>
            <p className="mt-1">Run this command in your terminal:</p>
            <div className="mt-2 relative">
              <pre className="bg-bolt-elements-bg-depth-1 p-3 rounded-md overflow-x-auto font-mono text-sm">
                npm install {moduleName}
              </pre>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`npm install ${moduleName}`);
                  // You could add a toast here
                }}
                className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-bolt-elements-bg-depth-2 text-bolt-elements-textSecondary"
                title="Copy to clipboard"
              >
                <div className="i-ph:copy text-lg" />
              </button>
            </div>
          </motion.div>
        );
      }
    }
    
    if (output.includes('SyntaxError')) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg"
        >
          <h4 className="font-medium text-amber-400 flex items-center gap-2">
            <div className="i-ph:lightbulb-filament text-lg" />
            Suggested Solution
          </h4>
          <p className="mt-2">You have a syntax error in your code. Check for:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Missing brackets, parentheses, or curly braces</li>
            <li>Unclosed quotes or template literals</li>
            <li>Invalid JavaScript/TypeScript syntax</li>
          </ul>
        </motion.div>
      );
    }
    
    if (output.includes('Failed to resolve import')) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg"
        >
          <h4 className="font-medium text-amber-400 flex items-center gap-2">
            <div className="i-ph:lightbulb-filament text-lg" />
            Suggested Solution
          </h4>
          <p className="mt-2">There's an import error in your code. Check that:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>All imported files exist at the specified paths</li>
            <li>Package names are spelled correctly</li>
            <li>All required dependencies are installed</li>
          </ul>
        </motion.div>
      );
    }
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg"
      >
        <h4 className="font-medium text-amber-400 flex items-center gap-2">
          <div className="i-ph:lightbulb-filament text-lg" />
          Suggested Solution
        </h4>
        <p className="mt-2">Review the build output carefully for specific errors.</p>
        <p className="mt-1">Common fixes include:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Installing missing dependencies</li>
          <li>Fixing syntax errors in your code</li>
          <li>Checking for incorrect import paths</li>
          <li>Ensuring your build script is correctly configured in package.json</li>
        </ul>
      </motion.div>
    );
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-gradient-to-b from-red-950/30 to-red-900/10 rounded-xl border border-red-500/20 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 p-2 bg-red-500/20 rounded-full">
          <div className="i-ph:warning-circle text-red-500 text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-red-400">Build Failed</h3>
          <p className="mt-1 text-bolt-elements-textSecondary">{deployment.buildError.message}</p>
        </div>
      </div>
      
      {deployment.buildError.output && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-bolt-elements-textPrimary">Build Output</h4>
            <button 
              onClick={() => setShowFullOutput(!showFullOutput)}
              className="flex items-center gap-1.5 text-sm text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary transition-colors px-2 py-1 rounded-md hover:bg-bolt-elements-bg-depth-1"
            >
              <div className={`i-ph:${showFullOutput ? 'eye-slash' : 'eye'} text-lg`} />
              {showFullOutput ? 'Hide' : 'Show'} details
            </button>
          </div>
          
          {showFullOutput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 relative"
            >
              <pre className="p-4 bg-bolt-elements-bg-depth-1 rounded-lg text-xs overflow-x-auto max-h-64 overflow-y-auto font-mono border border-bolt-elements-borderColor">
                {deployment.buildError.output}
              </pre>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(deployment.buildError?.output || '');
                  // You could add a toast here
                }}
                className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-bolt-elements-bg-depth-2 text-bolt-elements-textSecondary"
                title="Copy to clipboard"
              >
                <div className="i-ph:copy text-lg" />
              </button>
            </motion.div>
          )}
          
          {suggestSolution(deployment.buildError.output)}
        </motion.div>
      )}
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex gap-3 justify-end"
      >
        <button 
          onClick={() => {
            // Send the build error to the AI
            const errorMessage = deployment.buildError?.output || 'No output available';
            const prompt = `I'm getting this build error when trying to deploy my project. Can you help me fix it?\n\n\`\`\`\n${errorMessage}\n\`\`\``;
            
            // Close the error display
            deploymentState.set({
              ...deployment,
              error: null,
              buildError: null,
              isDeploying: false,
              isBuildReady: false
            });
            
            // Use the correct method to send a message to the AI
            // This assumes there's a method in the chat context to send messages
            const chat = chatStore.get();
            // Add the message to the chat history or use whatever method your app uses
            // For example:
            if (typeof window !== 'undefined') {
              // Dispatch a custom event that your chat component listens for
              window.dispatchEvent(new CustomEvent('ai:message', { detail: prompt }));
            }
          }}
          className="px-4 py-2 bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text rounded-md flex items-center gap-2"
        >
          <div className="i-ph:wrench" />
          Ask AI to Fix
        </button>
        <button 
          onClick={() => {
            // Close the error display
            deploymentState.set({
              ...deployment,
              error: null,
              buildError: null,
              isDeploying: false,
              isBuildReady: false
            });
          }}
          className="px-4 py-2 bg-bolt-elements-bg-depth-1 hover:bg-bolt-elements-bg-depth-2 text-bolt-elements-textSecondary rounded-md"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
} 