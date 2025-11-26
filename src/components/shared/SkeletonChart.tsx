import { h } from 'preact';

interface SkeletonChartProps {
  /** Height of the chart skeleton */
  height?: string;
  /** Whether to show legend placeholders */
  showLegend?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * SkeletonChart component displays a loading placeholder for charts
 * Used in statistics page while calculating data
 */
export function SkeletonChart({ height = 'h-64', showLegend = true, className = '' }: SkeletonChartProps) {
  return (
    <div class={`card ${className}`}>
      <div class="animate-pulse">
        {/* Chart title */}
        <div class="mb-4">
          <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
        </div>

        {/* Chart area */}
        <div class={`${height} bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-end justify-around p-4`}>
          {/* Simulated bar chart */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              class="bg-gray-300 dark:bg-gray-600 rounded-t w-8"
              style={{ height: `${Math.random() * 60 + 40}%` }}
            ></div>
          ))}
        </div>

        {/* Legend */}
        {showLegend && (
          <div class="flex justify-center space-x-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
