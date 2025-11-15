import { h } from 'preact';
import { Moon, Sun } from 'lucide-preact';
import { useAppContext } from '../../context/AppContext';

/**
 * Theme toggle component for switching between light and dark modes
 * Displays a sun/moon icon and updates the global dark mode setting
 */
export function ThemeToggle() {
  const { darkMode, setDarkMode } = useAppContext();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      class="p-2 rounded-lg transition-colors bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600"
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
