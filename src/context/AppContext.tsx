import { useProfile } from './ProfileContext';
import { useData } from './DataContext';
import { useSettings } from './SettingsContext';
import { AppContextType } from "../types";

/**
 * Composite hook that combines all contexts for backward compatibility
 * This allows existing components to continue using useAppContext()
 * while internally the state is split across multiple contexts
 *
 * Benefits of this approach:
 * - Existing components don't need refactoring
 * - State is logically separated into smaller contexts
 * - Better performance - components only re-render when their specific context changes
 * - Easier to test and maintain
 */
export function useAppContext(): AppContextType {
  const profile = useProfile();
  const data = useData();
  const settings = useSettings();

  // Combine all contexts into a single object
  return {
    profile: profile.profile,
    setProfile: profile.setProfile,
    userStats: profile.userStats,
    setUserStats: profile.setUserStats,
    dailyMeals: data.dailyMeals,
    setDailyMeals: data.setDailyMeals,
    dailyExercises: data.dailyExercises,
    setDailyExercises: data.setDailyExercises,
    dailyHistory: data.dailyHistory,
    setDailyHistory: data.setDailyHistory,
    weightHistory: data.weightHistory,
    setWeightHistory: data.setWeightHistory,
    darkMode: settings.darkMode,
    setDarkMode: settings.setDarkMode,
    foodsDB: settings.foodsDB,
    setFoodsDB: settings.setFoodsDB,
    favorites: settings.favorites,
    setFavorites: settings.setFavorites,
    customExercises: settings.customExercises,
    setCustomExercises: settings.setCustomExercises,
    showSuccess: settings.showSuccess,
    showError: settings.showError
  };
}