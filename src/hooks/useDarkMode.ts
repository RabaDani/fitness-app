import { useEffect } from "preact/hooks";

// Apply dark mode class to HTML element and update status bar color
export function useDarkMode(darkMode: boolean) {
  useEffect(() => {
    // Force remove all dark classes first
    document.documentElement.classList.remove('dark');

    // Update theme-color meta tag for status bar
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    // Then add if darkMode is true
    if (darkMode === true) {
      document.documentElement.classList.add('dark');
      // Dark mode: dark gray status bar
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#1f2937');
      }
    } else {
      // Light mode: white status bar
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#ffffff');
      }
    }
  }, [darkMode]);
}