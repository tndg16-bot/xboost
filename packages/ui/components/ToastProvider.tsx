'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastProps } from './Toast';

export interface ToastMessage extends Omit<ToastProps, 'id'> {
  id: string;
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxToasts?: number;
}

export const ToastProvider = ({
  children,
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => {
      const newToasts = [...prevToasts, { ...toast, id }];
      return newToasts.slice(-maxToasts);
    });
    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <div className={`fixed z-50 ${getPositionClasses()} flex flex-col gap-2 w-fit max-w-md`}>
        {toasts.map((toast) => (
          <div key={toast.id}>
            <Toast
              {...toast}
              onClose={() => removeToast(toast.id)}
              duration={toast.duration ?? (toast.variant === 'error' ? 5000 : 3000)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
