/**
 * Application context type definition
 */

import { Profile, Food, Meal, Exercise, ExerciseTemplate } from './models';
import { UserStats, DailyHistory, WeightEntry } from './tracking';

/**
 * Global application context type
 * Contains all shared state and setters
 */
export interface AppContextType {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  dailyMeals: Meal[];
  setDailyMeals: (meals: Meal[]) => void;
  foodsDB: Food[];
  setFoodsDB: (foods: Food[]) => void;
  favorites: Food[];
  setFavorites: (favorites: Food[]) => void;
  dailyHistory: DailyHistory[];
  setDailyHistory: (history: DailyHistory[]) => void;
  dailyExercises: Exercise[];
  setDailyExercises: (exercises: Exercise[]) => void;
  weightHistory: WeightEntry[];
  setWeightHistory: (history: WeightEntry[]) => void;
  customExercises: ExerciseTemplate[];
  setCustomExercises: (exercises: ExerciseTemplate[]) => void;
  userStats: UserStats;
  setUserStats: (stats: UserStats) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}
