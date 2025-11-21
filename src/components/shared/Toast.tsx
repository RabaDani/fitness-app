import { useEffect } from 'preact/hooks';
import { CheckCircle, XCircle, X } from 'lucide-preact';

export type ToastType = 'success' | 'error';

export interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

/**
 * Toast notification component
 * Displays temporary success/error messages with auto-dismiss
 */
export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const Icon = type === 'success' ? CheckCircle : XCircle;
  const bgColor = type === 'success'
    ? 'bg-indigo-600 dark:bg-indigo-700'
    : 'bg-red-500 dark:bg-red-600';

  return (
    <div class={`${bgColor} text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2 min-w-[240px] max-w-sm animate-slideIn`}>
      <Icon size={18} class="flex-shrink-0" />
      <p class="flex-1 text-xs font-medium">{message}</p>
      <button
        onClick={onClose}
        class="flex-shrink-0 hover:bg-white/20 rounded p-0.5 transition-colors"
        aria-label="Bezárás"
      >
        <X size={14} />
      </button>
    </div>
  );
}
