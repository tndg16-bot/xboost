import React from 'react';
import { InputHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const inputVariants = cva(
  'flex w-full rounded-lg border transition-colors duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
  {
    variants: {
      variant: {
        default: 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500',
        filled: 'border-transparent bg-gray-50 focus:bg-white focus:border-gray-300',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-3.5 py-2 text-sm',
        lg: 'px-4 py-2.5 text-base',
      },
      hasError: {
        true: 'border-red-500 focus:border-red-500 focus:ring-red-500',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      hasError: false,
    },
  }
);

type InputVariants = VariantProps<typeof inputVariants>;

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, Omit<InputVariants, 'hasError'> {
  label?: string;
  error?: string;
  helperText?: string;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className, variant, size, label, error, helperText, rightElement, leftElement, disabled, id, multiline = false, ...props }, ref) => {
    const hasError = !!error;
    const defaultId = React.useId();
    const inputId = id || `input-${defaultId}`;

    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="block mb-1.5 text-sm font-medium text-gray-700">{label}</label>}
        <div className="relative">
          {leftElement && !multiline && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">{leftElement}</div>}
          {multiline ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              id={inputId}
              className={cn(inputVariants({ variant, size, hasError }), leftElement && 'pl-10', rightElement && 'pr-10', className)}
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              id={inputId}
              className={cn(inputVariants({ variant, size, hasError }), leftElement && 'pl-10', rightElement && 'pr-10', className)}
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
              {...props}
            />
          )}
          {rightElement && !multiline && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">{rightElement}</div>}
        </div>
        {hasError && <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600 flex items-center gap-1">{error}</p>}
        {helperText && !hasError && <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
export { Input, inputVariants };
