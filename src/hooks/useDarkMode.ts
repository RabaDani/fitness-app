import { useEffect } from "preact/hooks";

/**
 * Apply dark mode class to HTML element based on darkMode state
 * Automatically updates the 'dark' class on document root when theme changes
 * Note: Status bar color is now handled by Navigation component based on scroll position
 * @param darkMode - Boolean indicating whether dark mode is enabled
 */
export function useDarkMode(darkMode: boolean) {
  useEffect(() => {
    // Force remove all dark classes first
    document.documentElement.classList.remove('dark');

    // Then add if darkMode is true
    if (darkMode === true) {
      document.documentElement.classList.add('dark');
    }
  }, [darkMode]);
}