import React from 'react';
import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const textareaVariants = cva(
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

type TextareaVariants = VariantProps<typeof textareaVariants>;

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>, Omit<TextareaVariants, 'hasError'> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, label, error, helperText, disabled, id, ...props }, ref) => {
    const hasError = !!error;
    const inputId = id || `textarea-${React.useId()}`;

    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="block mb-1.5 text-sm font-medium text-gray-700">{label}</label>}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(textareaVariants({ variant, size, hasError }), className)}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {hasError && <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600 flex items-center gap-1">{error}</p>}
        {helperText && !hasError && <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
export { Textarea, textareaVariants };
