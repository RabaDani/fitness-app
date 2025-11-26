import { h } from 'preact';
import { RefreshCw } from 'lucide-preact';

interface PullToRefreshIndicatorProps {
  /** Current pull distance */
  pullDistance: number;
  /** Threshold distance to trigger refresh */
  threshold: number;
  /** Whether refresh is in progress */
  isRefreshing: boolean;
}

/**
 * Visual indicator for pull-to-refresh
 * Shows progress and spinning animation during refresh
 */
export function PullToRefreshIndicator({
  pullDistance,
  threshold,
  isRefreshing
}: PullToRefreshIndicatorProps) {
  // Calculate opacity and rotation based on pull distance
  const opacity = Math.min(pullDistance / threshold, 1);
  const rotation = (pullDistance / threshold) * 360;
  const scale = Math.min(pullDistance / threshold, 1);

  return (
    <div
      class="fixed top-0 left-0 right-0 flex justify-center items-center z-50 pointer-events-none"
      style={{
        transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
        transition: isRefreshing ? 'transform 0.3s ease-out' : 'none'
      }}
    >
      <div
        class={`bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border-2 ${
          pullDistance >= threshold
            ? 'border-green-500'
            : 'border-gray-300 dark:border-gray-600'
        }`}
        style={{
          opacity: isRefreshing ? 1 : opacity,
          transform: `scale(${isRefreshing ? 1 : scale})`,
          transition: 'opacity 0.2s ease-out, transform 0.2s ease-out'
        }}
      >
        <RefreshCw
          size={24}
          class={`${
            pullDistance >= threshold || isRefreshing
              ? 'text-green-500'
              : 'text-gray-400 dark:text-gray-500'
          } ${isRefreshing ? 'animate-spin' : ''}`}
          style={{
            transform: isRefreshing ? 'none' : `rotate(${rotation}deg)`,
            transition: isRefreshing ? 'none' : 'transform 0.1s linear'
          }}
        />
      </div>
    </div>
  );
}
