/**
 * Chart color utilities for dark mode support
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
