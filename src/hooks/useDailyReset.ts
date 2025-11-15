import { useEffect, useRef } from 'preact/hooks';
import { Meal, Exercise } from '../types';
import { getTodayString } from '../utils/dateHelpers';

/**
 * Custom hook to automatically reset daily data when a new day begins
 * Checks localStorage for last app open date and clears meals/exercises if date changed
 * Monitors page visibility and window focus to detect day changes even if app stays open
 *
 * @param dailyMeals - Current meals array
 * @param setDailyMeals - Function to update meals
 * @param dailyExercises - Current exercises array
 * @param setDailyExercises - Function to update exercises
 */
export function useDailyReset(
  dailyMeals: Meal[],
  setDailyMeals: (meals: Meal[] | ((prev: Meal[]) => Meal[])) => void,
  dailyExercises: Exercise[],
  setDailyExercises: (exercises: Exercise[] | ((prev: Exercise[]) => Exercise[])) => void
): void {
  // Use refs to track current values without triggering re-renders
  const mealsRef = useRef(dailyMeals);
  const exercisesRef = useRef(dailyExercises);

  // Update refs when values change
  useEffect(() => {
    mealsRef.current = dailyMeals;
    exercisesRef.current = dailyExercises;
  }, [dailyMeals, dailyExercises]);

  useEffect(() => {
    /**
     * Check if day has changed and reset data if needed
     */
    const checkAndResetIfNewDay = () => {
      const today = getTodayString();
      const lastOpenDate = localStorage.getItem('lastAppOpenDate');

      // If this is a new day and there was a previous date
      if (lastOpenDate && lastOpenDate !== today) {
        // Reset daily data using functional updates to get latest state
        setDailyMeals((current) => {
          if (current.length > 0) {
            return [];
          }
          return current;
        });
        setDailyExercises((current) => {
          if (current.length > 0) {
            return [];
          }
          return current;
        });
      }

      // Update last open date
      localStorage.setItem('lastAppOpenDate', today);
    };

    // Check on mount
    checkAndResetIfNewDay();

    // Check when window regains focus (user returns to app)
    const handleFocus = () => {
      checkAndResetIfNewDay();
    };

    // Check when page becomes visible (tab switching, minimizing)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndResetIfNewDay();
      }
    };

    // Set up interval to check every 5 minutes (in case app stays open overnight)
    const intervalId = setInterval(checkAndResetIfNewDay, 5 * 60 * 1000); // 5 minutes

    // Add event listeners
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // Only depend on setters, not on the data itself to prevent memory leak
  }, [setDailyMeals, setDailyExercises]);
}
