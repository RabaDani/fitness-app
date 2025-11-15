/**
 * Core domain models
 */

// ============================================================================
// Type Aliases
// ============================================================================

export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type Goal = 'lose' | 'maintain' | 'gain';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ExerciseCategory = 'cardio' | 'strength' | 'mobility' | 'sports';

// ============================================================================
// User Profile
// ============================================================================

/**
 * User profile with fitness goals and preferences
 */
export interface Profile {
  gender: Gender;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  goalWeight: number; // in kg
  activity: ActivityLevel;
  goal: Goal;
  dailyCalories: number; // kcal
  macros: {
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
  };
}

// ============================================================================
// Nutrition
// ============================================================================

/**
 * Food item from database or API
 * Represents nutritional information per serving
 */
export interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: number; // Base serving size in grams
  image?: string;
}

/**
 * Meal entry - logged food consumption
 * Does not extend Food to avoid confusion with serving sizes
 */
export interface Meal {
  id: number;
  name: string;
  mealType: MealType;
  amount: number; // Actual amount consumed in grams
  calories: number; // Calculated for the actual amount
  protein: number; // Calculated for the actual amount
  carbs: number; // Calculated for the actual amount
  fat: number; // Calculated for the actual amount
  timestamp: string;
  image?: string;
}

// ============================================================================
// Exercise
// ============================================================================

/**
 * Exercise template - predefined or custom exercise type
 */
export interface ExerciseTemplate {
  id: number;
  name: string;
  caloriesPerMinute: number; // Calories burned per minute
  category: ExerciseCategory;
}

/**
 * Exercise entry - logged workout activity
 */
export interface Exercise {
  id: number;
  name: string;
  caloriesBurned: number; // Total calories burned
  duration: number; // Duration in minutes
  timestamp: string;
  category: ExerciseCategory;
  isCustom?: boolean; // Flag for user-created exercises
}
