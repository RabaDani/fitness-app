import { createContext } from "preact";
import { useContext } from "preact/compat";
import { Food, ExerciseTemplate } from "../types";

export interface SettingsContextType {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  foodsDB: Food[];
  setFoodsDB: (foods: Food[]) => void;
  favorites: Food[];
  setFavorites: (favorites: Food[]) => void;
  customExercises: ExerciseTemplate[];
  setCustomExercises: (exercises: ExerciseTemplate[]) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}

export default SettingsContext;
