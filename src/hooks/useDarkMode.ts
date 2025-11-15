import { useEffect } from "preact/hooks";

// Apply dark mode class to HTML element
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