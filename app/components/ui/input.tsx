import * as React from 'react';
import { classNames } from '~/utils/classNames';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          className={classNames(
            "w-full px-3 py-2 rounded-lg text-sm",
            "bg-[#F8F8F8] dark:bg-[#1A1A1A]",
            "border border-[#E5E5E5] dark:border-[#333333]",
            "text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary",
            "focus:outline-none focus:ring-1 focus:ring-purple-500",
            "disabled:opacity-50",
            error ? "border-red-500" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input }; 