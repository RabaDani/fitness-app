import { h } from 'preact';
import { AlertTriangle, X } from 'lucide-preact';

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
    <div class="modal-overlay">
      <div class="modal-container max-w-md">
        <div class="p-6">
          {/* Header */}
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center space-x-3">
              <div class={`p-2 rounded-full ${colors.iconBg}`}>
                <AlertTriangle size={24} class={colors.icon} />
              </div>
              <h2 class="heading-2">{title}</h2>
            </div>
            <button
              onClick={onCancel}
              class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Message */}
          <div class="mb-6 ml-14">
            <p class="text-primary mb-2">{message}</p>
            {details && (
              <div class="card-secondary mt-3">
                <p class="text-sm text-secondary">{details}</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div class="flex space-x-3">
            <button
              onClick={onCancel}
              class="btn-secondary flex-1"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              class={`flex-1 ${colors.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
