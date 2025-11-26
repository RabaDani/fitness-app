import { h, ComponentChildren } from 'preact';

interface EmptyStateProps {
  /** Icon to display (Lucide icon component) */
  icon?: ComponentChildren;
  /** Title of the empty state */
  title: string;
  /** Description/message */
  message: string;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Additional CSS classes */
  className?: string;
}

/**
 * EmptyState component displays when there's no data to show
 * Provides helpful messages and calls-to-action
 */
export function EmptyState({ icon, title, message, action, className = '' }: EmptyStateProps) {
  return (
    <div class={`text-center py-12 ${className}`}>
      {icon && (
        <div class="flex justify-center mb-4">
          <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
            {icon}
          </div>
        </div>
      )}
      <h3 class="heading-3 mb-2">{title}</h3>
      <p class="text-secondary mb-6 max-w-md mx-auto">{message}</p>
      {action && (
        <button onClick={action.onClick} class="btn-primary">
          {action.label}
        </button>
      )}
    </div>
  );
}
