import { createContext } from "preact";
import { useContext } from "preact/compat";
import { Meal, Exercise, DailyHistory, WeightEntry } from "../types";

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

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

export default DataContext;
