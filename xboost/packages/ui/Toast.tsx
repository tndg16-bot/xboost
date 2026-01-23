import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, type, message, duration };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      hideToast(id);
    }, duration);
  };

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} hideToast={hideToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, hideToast }: { toasts: Toast[]; hideToast: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-800 animate-in slide-in"
          style={{
            minWidth: '300px',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          {/* Icon */}
          {toast.type === 'success' && (
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414 1.414L9 10.586 7.707 7.293a1 1 0 00-1.414-1.414l1.293-1.293a1 1 0 001.414 1.414z" clipRule="evenodd" />
            </svg>
          )}
          {toast.type === 'error' && (
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 8C4 8 0 12 8 0 12s4 12 12 12-4 12-12-12-4-12-4 8-8 8 8zm0 12c2 0 2-2 2-2s-2-2-2 2-2 2-2 2-2zm-2-4c1.11 0 2-.89 2-2s-.89-2-2 2-2-2-2 2-2-2 2 2 2z" clipRule="evenodd" />
            </svg>
          )}
          {toast.type === 'info' && (
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 2 10 10 10 10c0 1.84-.63 3.37-1.68 4.59l-8.5-8.5c-.95-.23-1.77-.87-2.2-1.74a1 1 0 00-.29-.59l.9.56-1.76a1 1 0 00-.82-2.12l-.56-.82A9.957 9.957 0 0110-3.138L10.94 2a9.959 9.959 0 01-3.138 2.001l-5.5 8.5c-.95.23-1.77.87-2.2 1.74a1 1 0 00.29.59l-.9.56 1.76a9.959 9.959 0 01-5.5 2.001c-.95.23-1.77-.87-2.2-1.74a1 1 0 00-.82.29l-.56.82A9.959 9.959 0 0110-3.138l-8.5-8.5a9.96 9.96 0 01-1.414 1.414z" clipRule="evenodd" />
            </svg>
          )}

          {/* Message */}
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {toast.message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => hideToast(toast.id)}
            className="shrink-0 rounded-full p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 dark:hover:text-zinc-200 transition-colors"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
