import { Toast, ToastType } from './Toast';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  onUndo?: () => void;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

/**
 * Container for displaying multiple toast notifications
 * Positioned at top-center on mobile, top-right on desktop
 */
export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div class="fixed top-20 left-1/2 -translate-x-1/2 z-[60] flex flex-col space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
          onUndo={toast.onUndo}
        />
      ))}
    </div>
  );
}
