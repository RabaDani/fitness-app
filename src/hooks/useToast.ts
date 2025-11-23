import { useState, useCallback } from 'preact/hooks';
import { ToastType } from '../components/shared/Toast';
import { ToastItem } from '../components/shared/ToastContainer';

/**
 * Hook for managing toast notifications
 * Returns toasts array and functions to add/remove toasts
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'success', onUndo?: () => void) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastItem = { id, message, type, onUndo };

    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message: string, onUndo?: () => void) => {
    addToast(message, 'success', onUndo);
  }, [addToast]);

  const showError = useCallback((message: string, onUndo?: () => void) => {
    addToast(message, 'error', onUndo);
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError
  };
}
