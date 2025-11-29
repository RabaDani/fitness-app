import { createContext } from "preact";
import { useContext } from "preact/compat";
import { Meal, Exercise, DailyHistory, WeightEntry } from "../types";

/**
 * Data context type definition
 * Manages daily tracking data (meals, exercises, history, weight)
 */
export interface DataContextType {
  dailyMeals: Meal[];
  setDailyMeals: (meals: Meal[]) => void;
  dailyExercises: Exercise[];
  setDailyExercises: (exercises: Exercise[]) => void;
  dailyHistory: DailyHistory[];
  setDailyHistory: (history: DailyHistory[]) => void;
  weightHistory: WeightEntry[];
  setWeightHistory: (history: WeightEntry[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * Hook to access data context
 * Provides access to daily meals, exercises, and tracking history
 * @returns DataContextType object with daily data and setters
 * @throws Error if used outside DataProvider
 */
export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

export default DataContext;
