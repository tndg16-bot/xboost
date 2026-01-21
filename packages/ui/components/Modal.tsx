'use client';
import React, { useEffect, useCallback } from 'react';
import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const modalVariants = cva('rounded-lg bg-white shadow-2xl', {
  variants: {
    size: {
      sm: 'max-w-md w-full mx-4',
      md: 'max-w-lg w-full mx-4',
      lg: 'max-w-2xl w-full mx-4',
      xl: 'max-w-4xl w-full mx-4',
      full: 'w-screen h-screen rounded-none',
    },
  },
  defaultVariants: { size: 'md' },
});

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'size'>, VariantProps<typeof modalVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ className, size, isOpen, onClose, title, description, children, footer, showCloseButton = true, closeOnBackdropClick = true, closeOnEscape = true, ...props }, ref) => {
    const handleEscape = useCallback((event: KeyboardEvent) => { if (event.key === 'Escape' && closeOnEscape) onClose(); }, [onClose, closeOnEscape]);
    const handleBackdropClick = (e: React.MouseEvent) => { if (e.target === e.currentTarget && closeOnBackdropClick) onClose(); };

    useEffect(() => {
      if (isOpen) { document.body.style.overflow = 'hidden'; document.addEventListener('keydown', handleEscape); }
      else { document.body.style.overflow = ''; document.removeEventListener('keydown', handleEscape); }
      return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', handleEscape); };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={handleBackdropClick} />
        <div ref={ref} className={cn(modalVariants({ size }), 'relative animate-in zoom-in-95 duration-200', className)} {...props}>
          {(title || description || showCloseButton) && (
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex-1 min-w-0">
                {title && <h2 id="modal-title" className="text-lg font-semibold text-gray-900">{title}</h2>}
                {description && <p id="modal-description" className="mt-1 text-sm text-gray-500">{description}</p>}
              </div>
              {showCloseButton && (
                <button type="button" onClick={onClose} className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1 hover:bg-gray-100 transition-colors" aria-label="Close modal">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          )}
          {children && <div className="px-6 py-4">{children}</div>}
          {footer && <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">{footer}</div>}
        </div>
      </div>
    );
  }
);
Modal.displayName = 'Modal';
export { Modal, modalVariants };
