import { useEffect } from 'preact/hooks';
import { CheckCircle, XCircle, X } from 'lucide-preact';

export type ToastType = 'success' | 'error';

export interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
  onUndo?: () => void;
}

/**
 * Toast notification component
 * Displays temporary success/error messages with auto-dismiss and optional undo action
 */
export function Toast({ message, type, onClose, duration = 3000, onUndo }: ToastProps) {
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

  const handleUndo = () => {
    if (onUndo) {
      onUndo();
      onClose();
    }
  };

  return (
    <div class={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 min-w-[240px] max-w-sm animate-slideIn`}>
      <Icon size={18} class="flex-shrink-0" />
      <p class="flex-1 text-xs font-medium">{message}</p>
      {onUndo ? (
        <button
          onClick={handleUndo}
          class="flex-shrink-0 hover:bg-white/30 bg-white/20 rounded px-2 py-1 transition-colors text-xs font-semibold flex items-center space-x-1"
          aria-label="Visszavonás"
        >
          <span>Visszavonás</span>
        </button>
      ) : (
        <button
          onClick={onClose}
          class="flex-shrink-0 hover:bg-white/20 rounded p-0.5 transition-colors"
          aria-label="Bezárás"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
