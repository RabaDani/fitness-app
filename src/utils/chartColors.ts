/**
 * Chart color utilities for dark mode support
 */

/**
 * Get chart colors based on current theme (light/dark mode)
 * Automatically detects dark mode from document class
 * @returns Object containing grid, axis, and tooltip colors for the current theme
 */
export const getChartColors = () => {
  const isDark = document.documentElement.classList.contains('dark');
  return {
    grid: isDark ? '#374151' : '#e5e7eb',
    axis: isDark ? '#9ca3af' : '#6b7280',
    tooltip: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
      color: isDark ? '#ffffff' : '#000000'
    }
  };
};
