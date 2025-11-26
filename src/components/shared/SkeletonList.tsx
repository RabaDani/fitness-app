import { h } from 'preact';

interface SkeletonListProps {
  /** Number of list items to show */
  count?: number;
  /** Whether to show avatar/icon placeholder */
  showAvatar?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SkeletonList component displays a loading placeholder for list items
 * Used in food search, exercise lists, etc.
 */
export function SkeletonList({ count = 5, showAvatar = false, className = '' }: SkeletonListProps) {
  return (
    <div class={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} class="card-list-item animate-pulse">
          <div class="flex items-center space-x-3">
            {showAvatar && (
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>
            )}
            <div class="flex-1 min-w-0 space-y-2">
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div class="flex-shrink-0">
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
