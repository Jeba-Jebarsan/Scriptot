import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { classNames } from '~/utils/classNames';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        secondary: 'bg-[#F5F5F5] text-[#666666] dark:bg-[#333333] dark:text-[#CCCCCC]',
        destructive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        outline: 'border border-[#E5E5E5] dark:border-[#333333] text-bolt-elements-textSecondary',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={classNames(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants }; 