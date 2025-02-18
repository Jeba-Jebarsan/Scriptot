import { motion } from 'framer-motion';
import { classNames } from '~/utils/classNames';
import { cubicEasingFn } from '~/utils/easings';

interface GradientTextProps {
  children: React.ReactNode;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  className?: string;
}

export const GradientText = ({
  children,
  colors = ['#40ffaa', '#4079ff', '#40ffaa', '#4079ff', '#40ffaa'],
  animationSpeed = 3,
  showBorder = false,
  className,
}: GradientTextProps) => {
  const gradientColors = colors.join(', ');

  return (
    <motion.span
      className={classNames(
        'inline-block bg-clip-text text-transparent animate-gradient-text',
        showBorder ? 'border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2' : '',
        className
      )}
      style={{
        backgroundImage: `linear-gradient(to right, ${gradientColors})`,
        backgroundSize: `${colors.length * 100}% 100%`,
        animationDuration: `${animationSpeed}s`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: cubicEasingFn }}
    >
      {children}
    </motion.span>
  );
};
