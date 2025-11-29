import { AlertTriangle } from 'lucide-preact';
import { ModalWrapper, ModalHeader, ModalFooter } from '.';

interface ConfirmationModalProps {
  title: string;
  message: string;
  details?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

/**
 * Reusable confirmation modal for delete and other destructive actions
 * @param title - Modal title
 * @param message - Main confirmation message
 * @param details - Optional additional details to show
 * @param onConfirm - Callback when user confirms
 * @param onCancel - Callback when user cancels
 * @param confirmText - Custom text for confirm button (default: "Törlés")
 * @param cancelText - Custom text for cancel button (default: "Mégse")
 * @param variant - Visual variant (default: "danger")
 */
export function ConfirmationModal({
  title,
  message,
  details,
  onConfirm,
  onCancel,
  confirmText = 'Törlés',
  cancelText = 'Mégse',
  variant = 'danger'
}: ConfirmationModalProps) {
  const getVariantColors = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-500',
          button: 'btn-danger',
          iconBg: 'bg-red-50 dark:bg-red-900/30'
        };
      case 'warning':
        return {
          icon: 'text-yellow-500',
          button: 'bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-medium transition-colors',
          iconBg: 'bg-yellow-50 dark:bg-yellow-900/30'
        };
      case 'info':
        return {
          icon: 'text-blue-500',
          button: 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors',
          iconBg: 'bg-blue-50 dark:bg-blue-900/30'
        };
    }
  };

  const colors = getVariantColors();

  return (
    <ModalWrapper maxWidth="md" onBackdropClick={onCancel}>
      <ModalHeader
        title={title}
        onClose={onCancel}
        icon={
          <div class={`p-2 rounded-full ${colors.iconBg}`}>
            <AlertTriangle size={20} class={colors.icon} />
          </div>
        }
      />

      <div class="modal-body">
        <p class="text-primary mb-2">{message}</p>
        {details && (
          <div class="card-secondary mt-3">
            <p class="text-sm text-secondary whitespace-pre-line">{details}</p>
          </div>
        )}
      </div>

      <ModalFooter
        onCancel={onCancel}
        onConfirm={onConfirm}
        cancelText={cancelText}
        confirmText={confirmText}
        confirmButtonClass={colors.button}
      />
    </ModalWrapper>
  );
}
