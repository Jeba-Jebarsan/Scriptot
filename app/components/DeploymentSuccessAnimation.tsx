import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
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
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async (platform: string) => {
    const shareText = `✨ Exciting news! Just launched my latest project at ${deploymentUrl}! 🚀\n\n#WebDev #Innovation #NewProject`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(deploymentUrl)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(deploymentUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(deploymentUrl);
          const toast = document.createElement('div');
          toast.className = 'fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 animate-fade-in-up';
          toast.textContent = '🎉 URL copied to clipboard!';
          document.body.appendChild(toast);
          setTimeout(() => {
            toast.classList.add('animate-fade-out-down');
            setTimeout(() => document.body.removeChild(toast), 500);
          }, 2000);
        } catch (err) {
          console.error('Failed to copy URL:', err);
        }
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg"
    >
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}
      
      <motion.div 
        className="relative w-full max-w-lg mx-4 overflow-hidden"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: cubicEasingFn }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[800px] h-[800px] bg-gradient-conic from-blue-500 via-purple-500 to-pink-500 rounded-full blur-[120px] opacity-30 animate-slow-spin -top-[400px] -right-[400px]" />
          <div className="absolute w-[600px] h-[600px] bg-gradient-conic from-green-500 via-teal-500 to-blue-500 rounded-full blur-[100px] opacity-30 animate-slow-spin-reverse -bottom-[300px] -left-[300px]" />
        </div>

        {/* Main content card */}
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl shadow-blue-500/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.07] to-transparent" />
          
          <div className="relative p-8">
            {/* Close button */}
            <div className="absolute top-4 right-4">
              <button 
                onClick={onClose}
                className="group p-2 hover:bg-white/10 rounded-full transition-all duration-300"
              >
                <div className="i-ph:x-circle text-2xl text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center pt-4">
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2
                }}
                className="relative w-20 h-20 mb-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="i-ph:check-bold text-white text-4xl" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full opacity-30 animate-ping" />
              </motion.div>

              {/* Success text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-8"
              >
                <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-3">
                  Deployment Successful!
                </h3>
                <p className="text-gray-300 text-lg">
                  Your project is now live and ready to shine ✨
                </p>
              </motion.div>

              {/* URL display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full mb-8"
              >
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between w-full p-4 bg-gray-800/50 hover:bg-gray-800/70 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                >
                  <span className="text-blue-400 font-mono text-sm truncate max-w-[90%] group-hover:text-blue-300">
                    {deploymentUrl}
                  </span>
                  <div className="i-ph:arrow-square-out text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
                </a>
              </motion.div>

              {/* Share section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-full space-y-4"
              >
                <button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="group relative w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/20 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="relative flex items-center justify-center gap-3 text-white font-medium">
                    <div className="i-ph:share-network text-xl group-hover:rotate-12 transition-transform duration-300" />
                    Share Your Project
                  </div>
                </button>

                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="grid grid-cols-5 gap-3 pt-4"
                  >
                    {[
                      { id: 'twitter', icon: '/twitter.png', label: 'Twitter' },
                      { id: 'facebook', icon: '/fb.png', label: 'Facebook' },
                      { id: 'linkedin', icon: '/link.png', label: 'LinkedIn' },
                      { id: 'whatsapp', icon: '/whats.png', label: 'WhatsApp' },
                      { id: 'copy', icon: 'i-ph:copy', label: 'Copy URL' }
                    ].map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => handleShare(platform.id)}
                        className="group flex flex-col items-center justify-center p-3 bg-gray-800/50 backdrop-blur rounded-xl hover:bg-gray-800/70 hover:scale-105 transform transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 border border-gray-700/50 hover:border-blue-500/50"
                      >
                        {platform.id === 'copy' ? (
                          <div className="relative">
                            <div className={`${platform.icon} text-2xl text-gray-300 group-hover:text-blue-400 group-hover:rotate-12 transition-all duration-300`} />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                          </div>
                        ) : (
                          <img 
                            src={platform.icon}
                            alt={platform.label}
                            className="w-6 h-6 mb-1 group-hover:rotate-12 transition-transform duration-300"
                          />
                        )}
                        <span className="text-xs text-gray-300 group-hover:text-blue-400 transition-colors">
                          {platform.label}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}