interface ModalFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  disabled?: boolean;
  hideCancel?: boolean;
  confirmButtonClass?: string;
}

/**
 * Reusable modal footer with cancel and confirm buttons
 * Eliminates duplicate footer structure across all modals
 */
export function ModalFooter({
  onCancel,
  onConfirm,
  cancelText = 'Mégse',
  confirmText = 'Mentés',
  disabled = false,
  hideCancel = false,
  confirmButtonClass
}: ModalFooterProps) {
  return (
    <div class="modal-footer">
      {!hideCancel && (
        <button
          onClick={onCancel}
          class="btn-secondary flex-1"
        >
          {cancelText}
        </button>
      )}
      <button
        onClick={onConfirm}
        disabled={disabled}
        class={`${confirmButtonClass || 'btn-primary'} flex-1`}
      >
        {confirmText}
      </button>
    </div>
  );
}
