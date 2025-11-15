import { useEffect } from 'preact/hooks';
import { Meal, Exercise, DailyHistory } from '../types';
import { calculateTotalNutrition, calculateTotalCaloriesBurned } from '../utils/calculations';
import { getTodayString } from '../utils/dateHelpers';

/**
 * Custom hook to automatically update daily history when meals or exercises change
 * Keeps track of the last 30 days of nutritional and exercise data
 * @param dailyMeals - Current day's meals
 * @param dailyExercises - Current day's exercises
 * @param setDailyHistory - Function to update history (supports functional updates)
 */
export function useDailyHistory(
  dailyMeals: Meal[],
  dailyExercises: Exercise[],
  setDailyHistory: (history: DailyHistory[] | ((prev: DailyHistory[]) => DailyHistory[])) => void
): void {
  useEffect(() => {
    const today = getTodayString();

    // Calculate totals for today
    const mealTotals = calculateTotalNutrition(dailyMeals);

    // Calculate exercise calories burned
    const caloriesBurned = calculateTotalCaloriesBurned(dailyExercises);

    // Calculate net calories (intake - burned)
    const netCalories = mealTotals.calories - caloriesBurned;

    // Use functional update to avoid needing dailyHistory in dependencies
    setDailyHistory((prevHistory: DailyHistory[]) => {
      // Remove existing entry for today (if any) and add new one
      const newHistory = prevHistory.filter((h: DailyHistory) => h.date !== today);

      // Only add today's entry if there's data to record
      if (dailyMeals.length > 0 || dailyExercises.length > 0) {
        newHistory.push({
          date: today,
          ...mealTotals,
          meals: [...dailyMeals],
          exercises: [...dailyExercises],
          caloriesBurned,
          netCalories
        });
      }

      // Keep only last 30 days, sorted by date (newest first)
      return newHistory
        .sort((a: DailyHistory, b: DailyHistory) => b.date.localeCompare(a.date))
        .slice(0, 30);
    });
  }, [dailyMeals, dailyExercises, setDailyHistory]);
}
