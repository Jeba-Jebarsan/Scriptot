import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cubicEasingFn } from '~/utils/easings';

interface DeploymentSuccessAnimationProps {
  deploymentUrl: string;
  onClose: () => void;
}

export function DeploymentSuccessAnimation({ 
  deploymentUrl, 
  onClose 
}: DeploymentSuccessAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    // Start confetti animation after component mounts
    setShowConfetti(true);
    
    // Clean up confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      {showConfetti && <Confetti />}
      
      <motion.div 
        className="relative w-full max-w-md p-8 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-gray-700"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: cubicEasingFn }}
      >
        {/* Background rays */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-[#283e63]/40 to-transparent rounded-full blur-[80px] -top-[200px] -right-[200px]" />
          <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-[#1c344e]/40 to-transparent rounded-full blur-[70px] -bottom-[200px] -left-[200px]" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex flex-col items-center gap-6">
            {/* Success icon with pulse animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 10,
                delay: 0.2 
              }}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 flex items-center justify-center animate-pulse-ring"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <div className="i-ph:rocket-launch text-3xl text-white" />
              </div>
            </motion.div>

            {/* Success message */}
            <div className="text-center">
              <motion.h3 
                className="text-2xl font-bold text-white mb-2 animate-text-glow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Successfully Deployed!
              </motion.h3>
              
              <motion.p 
                className="text-gray-300 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Your project is now live and ready to share
              </motion.p>
              
              {/* URL display with animated border */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="relative p-4 mb-6 overflow-hidden"
              >
                <svg className="absolute inset-0 w-full h-full">
                  <defs>
                    <linearGradient
                      id="url-border-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#4079ff" stopOpacity="80%"></stop>
                      <stop offset="50%" stopColor="#40ffaa" stopOpacity="80%"></stop>
                      <stop offset="100%" stopColor="#4079ff" stopOpacity="80%"></stop>
                    </linearGradient>
                  </defs>
                  <rect 
                    width="100%" 
                    height="100%" 
                    fill="transparent" 
                    stroke="url(#url-border-gradient)" 
                    strokeWidth="2" 
                    rx="8"
                    strokeDasharray="35 65"
                    strokeDashoffset="10"
                    className="animate-borderAnimation"
                  />
                </svg>
                
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-blue-400 hover:text-blue-300 break-all transition-colors"
                >
                  {deploymentUrl}
                </a>
              </motion.div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 w-full">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-600 hover:bg-gray-700 text-gray-300 transition-all"
              >
                Close
              </motion.button>
              
              <motion.a
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                href={deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white flex items-center justify-center gap-2 transition-all"
              >
                <div className="i-ph:arrow-square-out" />
                Visit Site
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Confetti animation component
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: `${Math.random() * -10}%`,
            left: `${Math.random() * 100}%`,
            backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`,
            boxShadow: `0 0 10px hsl(${Math.random() * 360}, 100%, 70%)`,
            animation: `confetti ${3 + Math.random() * 5}s linear forwards`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(${window.innerHeight}px) rotate(${720 + Math.random() * 720}deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
} 