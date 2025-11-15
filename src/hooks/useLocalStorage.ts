import { useState, useEffect } from 'preact/hooks';

/**
 * Custom hook for syncing state with localStorage
 * @param key - localStorage key
 * @param initialValue - Initial value if localStorage is empty
 * @returns [value, setValue] tuple
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Check if localStorage is available
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available');
        return initialValue;
      }

      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error reading localStorage key "${key}":`, error.message);

        // Handle specific error cases
        if (error.name === 'SecurityError') {
          console.warn('localStorage access denied. Running in private/incognito mode?');
        } else if (error instanceof SyntaxError) {
          console.warn(`Invalid JSON in localStorage key "${key}". Removing corrupt data and resetting to initial value.`);
          // Remove corrupt data to prevent repeated parse errors
          try {
            localStorage.removeItem(key);
          } catch (removeError) {
            console.error(`Failed to remove corrupt localStorage key "${key}"`);
          }
        }
      }
      return initialValue;
    }
  });

  // Update localStorage whenever storedValue changes
  useEffect(() => {
    try {
      // Check if localStorage is available
      if (typeof localStorage === 'undefined') {
        return;
      }

      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error setting localStorage key "${key}":`, error.message);

        // Handle specific error cases
        if (error.name === 'QuotaExceededError') {
          console.error('localStorage quota exceeded! Consider clearing old data.');
          alert('Az adatok mentése sikertelen: nincs elég hely a böngészőben. Próbálj meg régi adatokat törölni!');
        } else if (error.name === 'SecurityError') {
          console.warn('localStorage access denied. Changes will not be persisted.');
        }
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
