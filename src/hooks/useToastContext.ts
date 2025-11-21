import { useContext } from 'preact/hooks';
import ToastContext from '../context/ToastContext';

/**
 * Hook to access toast notification functions from context
 * Returns showSuccess and showError functions
 */
export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastContext.Provider');
  }
  return context;
}
