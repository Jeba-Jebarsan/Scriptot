import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { forwardRef, type ForwardedRef, type ReactElement } from 'react';
import { classNames } from '~/utils/classNames';

interface RadixTooltipProps {
  tooltip: React.ReactNode;
  children: ReactElement;
  sideOffset?: number;
  className?: string;
  arrowClassName?: string;
  tooltipStyle?: React.CSSProperties;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: number;
  delay?: number;
}

const WithTooltip = forwardRef(
  (
    {
      tooltip,
      children,
      sideOffset = 5,
      className = '',
      arrowClassName = '',
      tooltipStyle = {},
      position = 'top',
      maxWidth = 250,
      delay = 0,
    }: RadixTooltipProps,
    _ref: ForwardedRef<HTMLElement>
  ) => {
    return (
      <RadixTooltip.Root delayDuration={delay}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={position}
            className={`
              z-[2000]
              px-2.5
              py-1.5
              max-h-[300px]
              select-none
              rounded-md
              bg-bolt-elements-background-depth-3
              text-bolt-elements-textPrimary
              text-sm
              leading-tight
              shadow-lg
              animate-in
              fade-in-0
              zoom-in-95
              data-[state=closed]:animate-out
              data-[state=closed]:fade-out-0
              data-[state=closed]:zoom-out-95
              ${className}
            `}
            sideOffset={sideOffset}
            style={{
              maxWidth,
              ...tooltipStyle,
            }}
          >
            <div className="break-words">{tooltip}</div>
            <RadixTooltip.Arrow
              className={`
                fill-bolt-elements-background-depth-3
                ${arrowClassName}
              `}
              width={12}
              height={6}
            />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    );
  }
);

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = React.useState(false);
  
  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      
      {show && (
        <div className={classNames(
          "absolute z-50 px-2 py-1 text-xs rounded-md",
          "bg-[#333] text-white dark:bg-[#EEE] dark:text-[#333]",
          "transform -translate-x-1/2 left-1/2 -top-8"
        )}>
          {content}
          <div className={classNames(
            "absolute w-2 h-2 rotate-45",
            "bg-[#333] dark:bg-[#EEE]",
            "left-1/2 -translate-x-1/2 -bottom-1"
          )} />
        </div>
      )}
    </div>
  );
}

export default WithTooltip;
