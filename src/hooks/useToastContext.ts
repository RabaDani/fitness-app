import { useAppContext } from '../context/AppContext';

/**
 * Hook to access toast notification functions from context
 * Returns showSuccess and showError functions from SettingsContext via AppContext
 */
export function useToastContext() {
  const { showSuccess, showError } = useAppContext();
  return { showSuccess, showError };
}
