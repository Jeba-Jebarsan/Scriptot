import { motion } from 'framer-motion';
import { classNames } from '~/utils/classNames';
import { cubicEasingFn } from '~/utils/easings';

interface ShinyTextButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ShinyTextButton = ({ children, onClick, className }: ShinyTextButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={classNames(
        "group relative mt-8 px-12 py-4",
        "text-sm font-medium text-white",
        "rounded-full overflow-hidden",
        "transition-all duration-300",
        className
      )}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-[length:200%_100%] animate-gradient" />
      
      {/* Shine overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform rotate-[30deg] group-hover:animate-shine" />
        </div>
      </div>

      {/* Text with glow effect */}
      <span className="relative z-10 group-hover:animate-text-glow">{children}</span>
    </motion.button>
  );
}; 