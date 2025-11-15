import { useState, useMemo } from 'preact/hooks';
import ProfileContext from './context/ProfileContext';
import DataContext from './context/DataContext';
import SettingsContext from './context/SettingsContext';
import { Navigation } from './components/layout';
import { Dashboard, Statistics, ProfileView, MealsLog, ExerciseLog, WeightLog } from './components/pages';
import { ProfileSetup } from './components/features/profile';
import { ErrorBoundary } from './components/shared';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDailyHistory } from './hooks/useDailyHistory';
import { useGamification } from './hooks/useGamification';
import { useDailyReset } from './hooks/useDailyReset';
import { Profile, Meal, Food, DailyHistory, Exercise, ExerciseTemplate, WeightEntry, UserStats } from './types';
import { initialFoodsDB, defaultUserStats } from './utils/constants/database';
import { useDarkMode } from './hooks/useDarkMode';

/**
 * Main App Component
 * Manages global state and routing between different views
 * Uses localStorage for data persistence and split contexts for state management
 *
 * Context Architecture:
 * - ProfileContext: User profile and stats/achievements
 * - DataContext: Daily meals, exercises, history, weight tracking
 * - SettingsContext: App preferences (dark mode, food DB, favorites, custom exercises)
 */
function FitnessApp() {
  // View state
  const [currentView, setCurrentView] = useState<'dashboard' | 'meals' | 'stats' | 'profile' | 'exercise' | 'weight'>('dashboard');

  // Profile Context State
  const [profile, setProfile] = useLocalStorage<Profile | null>('fitnessProfile', null);
  const [userStats, setUserStats] = useLocalStorage<UserStats>('userStats', defaultUserStats);

  // Data Context State
  const [dailyMeals, setDailyMeals] = useLocalStorage<Meal[]>('dailyMeals', []);
  const [dailyExercises, setDailyExercises] = useLocalStorage<Exercise[]>('dailyExercises', []);
  const [dailyHistory, setDailyHistory] = useLocalStorage<DailyHistory[]>('dailyHistory', []);
  const [weightHistory, setWeightHistory] = useLocalStorage<WeightEntry[]>('weightHistory', []);

  // Settings Context State
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false);
  const [foodsDB, setFoodsDB] = useLocalStorage<Food[]>('foodsDB', initialFoodsDB);
  const [favorites, setFavorites] = useLocalStorage<Food[]>('favorites', []);
  const [customExercises, setCustomExercises] = useLocalStorage<ExerciseTemplate[]>('customExercises', []);

  // Apply dark mode class to HTML element
  useDarkMode(darkMode);
  
  // Automatically reset daily data when a new day begins
  useDailyReset(dailyMeals, setDailyMeals, dailyExercises, setDailyExercises);

  // Automatically update history when meals or exercises change
  useDailyHistory(dailyMeals, dailyExercises, setDailyHistory);

  // Automatically track gamification stats and achievements
  useGamification(dailyMeals, dailyExercises, dailyHistory, userStats, setUserStats);

  // Context values - memoized to prevent unnecessary re-renders
  const profileValue = useMemo(() => ({
    profile,
    setProfile,
    userStats,
    setUserStats
  }), [profile, setProfile, userStats, setUserStats]);

  const dataValue = useMemo(() => ({
    dailyMeals,
    setDailyMeals,
    dailyExercises,
    setDailyExercises,
    dailyHistory,
    setDailyHistory,
    weightHistory,
    setWeightHistory
  }), [dailyMeals, setDailyMeals, dailyExercises, setDailyExercises, dailyHistory, setDailyHistory, weightHistory, setWeightHistory]);

  const settingsValue = useMemo(() => ({
    darkMode,
    setDarkMode,
    foodsDB,
    setFoodsDB,
    favorites,
    setFavorites,
    customExercises,
    setCustomExercises
  }), [darkMode, setDarkMode, foodsDB, setFoodsDB, favorites, setFavorites, customExercises, setCustomExercises]);

  // Show profile setup if no profile exists
  if (!profile) {
    return (
      <ErrorBoundary>
        <ProfileContext.Provider value={profileValue}>
          <DataContext.Provider value={dataValue}>
            <SettingsContext.Provider value={settingsValue}>
              <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-900">
                <ProfileSetup />
              </div>
            </SettingsContext.Provider>
          </DataContext.Provider>
        </ProfileContext.Provider>
      </ErrorBoundary>
    );
  }

  // Main app with navigation
  return (
    <ErrorBoundary>
      <ProfileContext.Provider value={profileValue}>
        <DataContext.Provider value={dataValue}>
          <SettingsContext.Provider value={settingsValue}>
            <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-900">
              <Navigation currentView={currentView} setCurrentView={setCurrentView} />
              <div class="container mx-auto px-4 py-6">
                <ErrorBoundary>
                  {currentView === 'dashboard' && <Dashboard />}
                  {currentView === 'meals' && <MealsLog />}
                  {currentView === 'exercise' && <ExerciseLog />}
                  {currentView === 'weight' && <WeightLog />}
                  {currentView === 'stats' && <Statistics />}
                  {currentView === 'profile' && <ProfileView />}
                </ErrorBoundary>
              </div>
            </div>
          </SettingsContext.Provider>
        </DataContext.Provider>
      </ProfileContext.Provider>
    </ErrorBoundary>
  );
}

export default FitnessApp;
