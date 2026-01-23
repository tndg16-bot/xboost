'use client';

import React, { useEffect } from 'react';
import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const toastVariants = cva(
  'relative flex items-start gap-3 rounded-[4px] border transition-all duration-200 animate-in slide-in-from-right-5 fade-in',
  {
    variants: {
      variant: {
        success: 'bg-white border-[#E1E8ED] text-[#0F1419]',
        error: 'bg-white border-[#E1E8ED] text-[#0F1419]',
        info: 'bg-white border-[#E1E8ED] text-[#0F1419]',
      },
      size: {
        sm: 'px-3 py-2 text-xs',
        md: 'px-4 py-3 text-sm',
      },
    },
    defaultVariants: {
      variant: 'success',
      size: 'md',
    },
  }
);

export interface ToastProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string;
  message?: string;
  onClose?: () => void;
  duration?: number;
  showClose?: boolean;
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, size, title, message, onClose, duration, showClose = true, ...props }, ref) => {
    useEffect(() => {
      if (duration && onClose) {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);

    const getIcon = () => {
      switch (variant) {
        case 'success':
          return (
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#00BA7C" fillOpacity="0.1" />
              <path
                d="M8 12L11 15L16 9"
                stroke="#00BA7C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );
        case 'error':
          return (
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#F91880" fillOpacity="0.1" />
              <path
                d="M9 9L15 15M15 9L9 15"
                stroke="#F91880"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );
        case 'info':
          return (
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#1D9BF0" fillOpacity="0.1" />
              <circle cx="12" cy="12" r="4" stroke="#1D9BF0" strokeWidth="2" />
              <path
                d="M12 7V8"
                stroke="#1D9BF0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          toastVariants({ variant, size }),
          'w-[300px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]',
          className
        )}
        {...props}
      >
        {getIcon()}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-medium text-[14px] leading-tight text-[#0F1419] mb-0.5">
              {title}
            </h4>
          )}
          {message && (
            <p className="text-[14px] text-[#536471] leading-tight break-words">
              {message}
            </p>
          )}
        </div>
        {showClose && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 text-[#536471] hover:text-[#0F1419] hover:bg-[#F7F9F9] rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';
export { Toast, toastVariants };
