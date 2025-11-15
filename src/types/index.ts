/**
 * Type definitions for the Fitness Calorie Calculator application
 *
 * This is the main entry point for all type imports.
 * Types are organized into 3 modules:
 * - models: Core domain models (Profile, Food, Meal, Exercise)
 * - tracking: History, stats, and gamification (DailyHistory, Achievement, UserStats)
 * - context: AppContextType
 */

// Core models
export type {
  // Type aliases
  Gender,
  ActivityLevel,
  Goal,
  MealType,
  ExerciseCategory,
  // User
  Profile,
  // Nutrition
  Food,
  Meal,
  // Exercise
  ExerciseTemplate,
  Exercise
} from './models';

// Tracking, history, and gamification
export type {
  WeightEntry,
  DailyHistory,
  ChartData,
  Achievement,
  UserStats
} from './tracking';

// Context
export type {
  AppContextType
} from './context';
