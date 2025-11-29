import { useState, useCallback } from 'preact/hooks';
import { ToastType } from '../components/shared/Toast';
import { ToastItem } from '../components/shared/ToastContainer';

const MAX_TOASTS = 4;

/**
 * Hook for managing toast notifications
 * Returns toasts array and functions to add/remove toasts
 * Limits to 4 toasts maximum, removes oldest when limit exceeded
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'success', onUndo?: () => void) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastItem = { id, message, type, onUndo };

    setToasts(prev => {
      const newToasts = [...prev, newToast];

      // If we exceed max toasts, remove the oldest ones
      if (newToasts.length > MAX_TOASTS) {
        return newToasts.slice(newToasts.length - MAX_TOASTS);
      }

      return newToasts;
    });
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

  const showAchievement = useCallback((message: string) => {
    addToast(message, 'achievement');
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showAchievement
  };
}
