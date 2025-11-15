import { h, ComponentChildren } from 'preact';
import { X } from 'lucide-preact';

interface ModalHeaderProps {
  title: string | ComponentChildren;
  onClose: () => void;
  icon?: ComponentChildren;
}

/**
 * Reusable modal header with title and close button
 * Eliminates duplicate header structure across multiple modals
 */
export function ModalHeader({ title, onClose, icon }: ModalHeaderProps) {
  return (
    <div class="modal-header">
      <h2 class="text-primary text-lg font-bold flex items-center space-x-2">
        {icon && icon}
        {typeof title === 'string' ? <span>{title}</span> : title}
      </h2>
      <button
        onClick={onClose}
        class="btn-icon"
      >
        <X size={20} />
      </button>
    </div>
  );
}
