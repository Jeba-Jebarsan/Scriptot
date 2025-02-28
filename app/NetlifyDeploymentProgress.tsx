import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface NetlifyDeploymentProgressProps {
  onComplete: () => void;
}

export function NetlifyDeploymentProgress({ onComplete }: NetlifyDeploymentProgressProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const deploymentSteps = [
    "Initializing deployment...",
    "Preparing your files...",
    "Building your project...",
    "Optimizing assets...",
    "Finalizing deployment..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        
        // Update the current step based on progress
        const newProgress = prev + Math.random() * 3;
        const stepIndex = Math.min(
          Math.floor((newProgress / 100) * deploymentSteps.length),
          deploymentSteps.length - 1
        );
        
        setCurrentStep(stepIndex);
        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="relative w-full max-w-md p-8 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-gray-700">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="ray1"></div>
        <div className="ray2"></div>
        <div className="ray3"></div>
        <div className="ray4"></div>
        
        {/* Code particles effect */}
        <CodeParticles />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-6">
          <img 
            className="w-8 h-8 mr-3"
            height="32"
            width="32"
            crossOrigin="anonymous"
            src="https://cdn.simpleicons.org/netlify"
            alt="Netlify"
          />
          <h3 className="text-xl font-bold text-white">
            Deploying to Netlify
          </h3>
        </div>
        
        <motion.div 
          className="mb-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-blue-400 font-medium">{deploymentSteps[currentStep]}</p>
          <p className="text-gray-400 text-sm mt-1">This might take a few moments...</p>
        </motion.div>
        
        {/* Progress bar */}
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-6">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-teal-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Animated deployment visualization */}
        <DeploymentVisualization currentStep={currentStep} />
      </div>
    </div>
  );
}

function CodeParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xs font-mono text-blue-500/30"
          initial={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`,
            opacity: 0 
          }}
          animate={{ 
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: [0, 0.7, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3 + Math.random() * 5,
            delay: Math.random() * 2
          }}
        >
          {getRandomCodeSymbol()}
        </motion.div>
      ))}
    </div>
  );
}

function getRandomCodeSymbol() {
  const symbols = ['<>', '/>', '{}', '()', '[]', '=>', '&&', '||', '==', '===', '!=', '!==', '++', '--'];
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function DeploymentVisualization({ currentStep }: { currentStep: number }) {
  const steps = [
    // Files preparation visualization
    <div key="files" className="flex justify-center space-x-3">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-10 h-12 bg-gray-800 border border-gray-700 rounded-md flex items-center justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.2 }}
        >
          <div className={`i-ph:${i === 1 ? 'file-html' : i === 2 ? 'file-css' : 'file-js'} text-gray-400 text-xl`} />
        </motion.div>
      ))}
    </div>,
    
    // Building visualization
    <div key="building" className="flex justify-center">
      <motion.div 
        className="relative w-16 h-16"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="i-ph:gear text-blue-400 text-3xl" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="i-ph:gear text-teal-400 text-2xl"
            initial={{ rotate: 0 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </div>,
    
    // Optimizing visualization
    <div key="optimizing" className="flex justify-center">
      <motion.div
        className="w-16 h-16 relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="i-ph:chart-line-up text-green-400 text-3xl" />
        </div>
      </motion.div>
    </div>,
    
    // Finalizing visualization
    <div key="finalizing" className="flex justify-center">
      <motion.div
        className="w-16 h-16 relative"
        initial={{ y: 0 }}
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="i-ph:cloud-arrow-up text-blue-400 text-3xl" />
        </div>
      </motion.div>
    </div>
  ];

  return (
    <motion.div 
      className="h-24 flex items-center justify-center"
      key={currentStep}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {steps[Math.min(currentStep, steps.length - 1)]}
    </motion.div>
  );
} 