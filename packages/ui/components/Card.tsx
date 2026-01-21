import React from 'react';
import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const cardVariants = cva('rounded-lg transition-all duration-200', {
  variants: {
    variant: {
      default: 'bg-white border border-gray-200',
      elevated: 'bg-white shadow-md',
      outlined: 'bg-gray-50 border border-gray-300',
      flat: 'bg-white',
    },
    size: { sm: 'p-4', md: 'p-6', lg: 'p-8' },
    hoverable: {
      true: 'hover:shadow-lg hover:border-gray-300 cursor-pointer',
      false: '',
    },
  },
  defaultVariants: { variant: 'default', size: 'md', hoverable: false },
});

export interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  title?: string;
  description?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, hoverable, title, description, leftIcon, rightElement, children, footer, ...props }, ref) => {
    const paddingSize = size;
    return (
      <div ref={ref} className={cn(cardVariants({ variant, size, hoverable }), className)} {...props}>
        {(title || description || leftIcon || rightElement) && (
          <div className={cn(paddingSize === 'sm' ? 'pb-3' : 'pb-4', 'border-b border-gray-100')}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {leftIcon && <div className="flex-shrink-0 mt-0.5 text-gray-500">{leftIcon}</div>}
                <div className="flex-1 min-w-0">
                  {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
                  {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
                </div>
              </div>
              {rightElement && <div className="flex-shrink-0">{rightElement}</div>}
            </div>
          </div>
        )}
        {children && <div className={cn(paddingSize === 'sm' ? 'p-4' : paddingSize === 'md' ? 'p-6' : 'p-8')}>{children}</div>}
        {footer && <div className={cn('border-t border-gray-100', paddingSize === 'sm' ? 'p-4 pt-3' : 'p-6 pt-4')}>{footer}</div>}
      </div>
    );
  }
);
Card.displayName = 'Card';
export { Card, cardVariants };
