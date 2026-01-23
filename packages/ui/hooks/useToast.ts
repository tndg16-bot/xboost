import { useCallback } from 'react';
import { useToastContext } from '../components/ToastProvider';
import type { ToastProps } from '../components/Toast';

export interface UseToastReturn {
  showSuccess: (message: string, options?: Partial<ToastProps>) => string;
  showError: (message: string, options?: Partial<ToastProps>) => string;
  showInfo: (message: string, options?: Partial<ToastProps>) => string;
  showCustom: (options: ToastProps) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export const useToast = (): UseToastReturn => {
  const { addToast, removeToast, clearToasts } = useToastContext();

  const showSuccess = useCallback(
    (message: string, options?: Partial<ToastProps>) => {
      return addToast({
        ...options,
        variant: 'success',
        message,
        duration: 3000,
      });
    },
    [addToast]
  );

  const showError = useCallback(
    (message: string, options?: Partial<ToastProps>) => {
      return addToast({
        ...options,
        variant: 'error',
        message,
        duration: 5000,
      });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message: string, options?: Partial<ToastProps>) => {
      return addToast({
        ...options,
        variant: 'info',
        message,
        duration: 3000,
      });
    },
    [addToast]
  );

  const showCustom = useCallback(
    (options: ToastProps) => {
      return addToast(options);
    },
    [addToast]
  );

  const dismiss = useCallback(
    (id: string) => {
      removeToast(id);
    },
    [removeToast]
  );

  const dismissAll = useCallback(() => {
    clearToasts();
  }, [clearToasts]);

  return {
    showSuccess,
    showError,
    showInfo,
    showCustom,
    dismiss,
    dismissAll,
  };
};
