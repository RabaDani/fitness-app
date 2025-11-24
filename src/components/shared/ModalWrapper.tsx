import { h, ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';
import { createPortal } from 'preact/compat';

interface ModalWrapperProps {
  children: ComponentChildren;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  onBackdropClick?: () => void;
  onEscapeKey?: () => void;
}

/**
 * Reusable modal wrapper with backdrop and responsive sizing
 * Eliminates duplicate modal container structure across 6+ modals
 * Supports ESC key and backdrop click to close
 */
export function ModalWrapper({
  children,
  maxWidth = 'lg',
  onBackdropClick,
  onEscapeKey
}: ModalWrapperProps) {
  const widthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl'
  }[maxWidth];

  const handleBackdropClick = (e: MouseEvent): void => {
    if (e.target === e.currentTarget && onBackdropClick) {
      onBackdropClick();
    }
  };

  // ESC key support for closing modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Call onEscapeKey if provided, otherwise fall back to onBackdropClick
        if (onEscapeKey) {
          onEscapeKey();
        } else if (onBackdropClick) {
          onBackdropClick();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onEscapeKey, onBackdropClick]);

  const modalContent = (
    <div
      class="modal-overlay"
      onClick={handleBackdropClick}
    >
      <div class={`bg-white dark:bg-gray-800 rounded-lg shadow-xl ${widthClass} w-full`}>
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
