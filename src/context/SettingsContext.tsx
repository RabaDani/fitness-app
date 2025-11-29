import { createContext } from "preact";
import { useContext } from "preact/compat";
import { Food, ExerciseTemplate } from "../types";

/**
 * Settings context type definition
 * Manages app settings, food database, favorites, and toast notifications
 */
export interface SettingsContextType {
  /** Dark mode enabled state */
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  /** Local food database */
  foodsDB: Food[];
  setFoodsDB: (foods: Food[]) => void;
  /** Favorite foods list */
  favorites: Food[];
  setFavorites: (favorites: Food[]) => void;
  /** Custom exercise templates */
  customExercises: ExerciseTemplate[];
  setCustomExercises: (exercises: ExerciseTemplate[]) => void;
  /** Show success toast notification */
  showSuccess: (message: string, onUndo?: () => void) => void;
  /** Show error toast notification */
  showError: (message: string, onUndo?: () => void) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * Hook to access settings context
 * Provides app settings, food data, and notification functions
 * @returns SettingsContextType object with settings and helpers
 * @throws Error if used outside SettingsProvider
 */
export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}

export default SettingsContext;
