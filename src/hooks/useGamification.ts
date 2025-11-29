import { useEffect } from 'preact/hooks';
import { Meal, Exercise, UserStats, DailyHistory } from '../types';
import { achievementsDatabase } from '../utils/constants/database';
import { getTodayString, getYesterdayString } from '../utils/dateHelpers';
import { calculateTotalCaloriesBurned } from '../utils/calculations';

/**
 * Custom hook for tracking gamification stats and achievements
 * Automatically updates streaks, counts, and unlocks achievements
 *
 * @param dailyMeals - Today's logged meals
 * @param dailyExercises - Today's logged exercises
 * @param dailyHistory - Historical daily data
 * @param userStats - Current user statistics
 * @param setUserStats - Function to update user statistics
 * @param showAchievement - Optional function to show achievement toast notifications
 */
export function useGamification(
  dailyMeals: Meal[],
  dailyExercises: Exercise[],
  dailyHistory: DailyHistory[],
  userStats: UserStats,
  setUserStats: (stats: UserStats | ((prev: UserStats) => UserStats)) => void,
  showAchievement?: (message: string) => void
): void {
  useEffect(() => {
    const today = getTodayString();
    const hasActivity = dailyMeals.length > 0 || dailyExercises.length > 0;

    // Don't update if no activity today
    if (!hasActivity) return;

    setUserStats(prevStats => {
      // Calculate current streak
      let newCurrentStreak = prevStats.currentStreak;
      const yesterdayStr = getYesterdayString();

      if (prevStats.lastLogDate === '') {
        // First time logging
        newCurrentStreak = 1;
      } else if (prevStats.lastLogDate === today) {
        // Already logged today, keep current streak
        newCurrentStreak = prevStats.currentStreak;
      } else if (prevStats.lastLogDate === yesterdayStr) {
        // Logged yesterday, increment streak
        newCurrentStreak = prevStats.currentStreak + 1;
      } else {
        // Streak broken, start over
        newCurrentStreak = 1;
      }

      // Calculate longest streak
      const newLongestStreak = Math.max(newCurrentStreak, prevStats.longestStreak);

      // Calculate totals from history (excluding today) + today's current data
      const historicalCaloriesBurned = dailyHistory
        .filter(day => day.date !== today)
        .reduce((sum, day) => sum + day.caloriesBurned, 0);

      const historicalMealsCount = dailyHistory
        .filter(day => day.date !== today)
        .reduce((sum, day) => sum + day.meals.length, 0);

      const historicalExercisesCount = dailyHistory
        .filter(day => day.date !== today)
        .reduce((sum, day) => sum + day.exercises.length, 0);

      const historicalWaterLogged = dailyHistory
        .filter(day => day.date !== today)
        .reduce((sum, day) => sum + (day.water || 0), 0);

      const todaysCaloriesBurned = calculateTotalCaloriesBurned(dailyExercises);

      // Calculate totals including today's data
      const totalCaloriesBurned = historicalCaloriesBurned + todaysCaloriesBurned;
      const totalMealsLogged = historicalMealsCount + dailyMeals.length;
      const totalExercises = historicalExercisesCount + dailyExercises.length;
      const totalWaterLogged = historicalWaterLogged; // Today's water is already in history

      // Check for newly unlocked achievements
      const newAchievements: string[] = [...prevStats.achievementsUnlocked];

      for (const achievement of achievementsDatabase) {
        // Skip if already unlocked
        if (newAchievements.includes(achievement.id)) continue;

        let shouldUnlock = false;

        switch (achievement.category) {
          case 'streak':
            shouldUnlock = newCurrentStreak >= achievement.target;
            break;
          case 'meals':
            shouldUnlock = totalMealsLogged >= achievement.target;
            break;
          case 'exercise':
            if (achievement.id.startsWith('burn-')) {
              shouldUnlock = totalCaloriesBurned >= achievement.target;
            } else {
              shouldUnlock = totalExercises >= achievement.target;
            }
            break;
          case 'water':
            shouldUnlock = totalWaterLogged >= achievement.target;
            break;
        }

        if (shouldUnlock) {
          newAchievements.push(achievement.id);

          // Show achievement toast notification
          if (showAchievement) {
            showAchievement(`${achievement.name} elérve! 🎉🏆`);
          }
        }
      }

      // Update user stats - always update totals to reflect current state
      return {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        totalMealsLogged,
        totalExercises,
        totalCaloriesBurned,
        totalWaterLogged,
        achievementsUnlocked: newAchievements,
        lastLogDate: today
      };
    });
  }, [dailyMeals, dailyExercises, dailyHistory, setUserStats]);
}
