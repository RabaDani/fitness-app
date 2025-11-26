import { h } from 'preact';

interface SkeletonCardProps {
  /** Number of lines to show in the skeleton */
  lines?: number;
  /** Whether to show a header skeleton */
  showHeader?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SkeletonCard component displays a loading placeholder for card content
 * Used while data is being fetched or processed
 */
export function SkeletonCard({ lines = 3, showHeader = true, className = '' }: SkeletonCardProps) {
  return (
    <div class={`card ${className} animate-pulse`}>
      {showHeader && (
        <div class="mb-4">
          <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      )}
      <div class="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            class={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
              i === lines - 1 ? 'w-5/6' : 'w-full'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
