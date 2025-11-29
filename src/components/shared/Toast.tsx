import { useEffect, useState } from 'preact/hooks';
import { CheckCircle, XCircle, X, Trophy } from 'lucide-preact';
import confetti from 'canvas-confetti';

export type ToastType = 'success' | 'error' | 'achievement';

export interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
  onUndo?: () => void;
}

/**
 * Toast notification component
 * Displays temporary success/error/achievement messages with auto-dismiss and optional undo action
 */
export function Toast({ message, type, onClose, duration = 3000, onUndo }: ToastProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Trigger confetti when achievement is shown
    if (type === 'achievement') {
      confetti({
        particleCount: 70,
        angle: 90,
        spread: 180,
        startVelocity: 25,
        origin: { x: 0.5, y: 0.15 },
      });
    }
  }, [type]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before actually removing
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  // Select icon based on type
  let Icon = CheckCircle;
  if (type === 'error') {
    Icon = XCircle;
  }

  // Select background color based on type
  let bgColor = 'bg-indigo-600 dark:bg-indigo-700';
  if (type === 'achievement') {
    bgColor = 'bg-indigo-600 dark:bg-indigo-700';
  } else 
  if (type === 'error') {
    bgColor = 'bg-red-500 dark:bg-red-600';
  }

  const handleUndo = () => {
    if (onUndo) {
      onUndo();
      handleClose();
    }
  };

  return (
    <div class={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 min-w-[240px] max-w-sm ${isClosing ? 'animate-slideOut' : 'animate-slideIn'}`}>
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
