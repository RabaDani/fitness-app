/**
 * Tracking, history, and gamification types
 */

import { Meal, Exercise } from './models';

// ============================================================================
// Weight Tracking
// ============================================================================

/**
 * Weight tracking entry
 */
export interface WeightEntry {
  date: string; // YYYY-MM-DD format
  weight: number; // in kg
  note?: string;
}

// ============================================================================
// Daily History
// ============================================================================

/**
 * Daily history entry - comprehensive daily tracking data
 */
export interface DailyHistory {
  date: string; // YYYY-MM-DD format
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: Meal[];
  exercises: Exercise[];
  caloriesBurned: number;
  netCalories: number; // calories - caloriesBurned
  weight?: number; // optional daily weight log
  water?: number; // optional daily water intake in ml
}

/**
 * Chart data for statistics visualization
 */
export interface ChartData {
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  dailyCalories: number;
  dailyMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  water?: number; // Water intake in ml
}

// ============================================================================
// Gamification
// ============================================================================

/**
 * Achievement definition
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number; // 0-100
  target: number;
  category: 'meals' | 'exercise' | 'streak' | 'weight' | 'water';
}

/**
 * User statistics for gamification
 */
export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalMealsLogged: number;
  totalExercises: number;
  totalCaloriesBurned: number;
  totalWaterLogged: number; // Total water logged in ml
  achievementsUnlocked: string[]; // Achievement IDs
  lastLogDate: string; // YYYY-MM-DD
}
