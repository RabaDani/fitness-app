import { Profile, Food } from '../types';
import { activityMultipliers } from './constants';
import { validateAge, validateHeight, validateWeight, validateCalories } from './validation';
import {
  MIFFLIN_ST_JEOR,
  CALORIE_ADJUSTMENT,
  MACRO_CONSTANTS,
  BMI_CONSTANTS
} from './constants';

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor equation
 * @param gender - User's gender
 * @param age - User's age in years
 * @param height - User's height in cm
 * @param weight - User's weight in kg
 * @returns Calculated BMR
 * @throws ValidationError if inputs are invalid
 */
export function calculateBMR(
  gender: 'male' | 'female',
  age: number,
  height: number,
  weight: number
): number {
  // Validate inputs
  validateAge(age);
  validateHeight(height);
  validateWeight(weight);

  const baseBMR = MIFFLIN_ST_JEOR.WEIGHT_MULTIPLIER * weight +
                  MIFFLIN_ST_JEOR.HEIGHT_MULTIPLIER * height -
                  MIFFLIN_ST_JEOR.AGE_MULTIPLIER * age;

  if (gender === 'male') {
    return baseBMR + MIFFLIN_ST_JEOR.MALE_CONSTANT;
  } else {
    return baseBMR + MIFFLIN_ST_JEOR.FEMALE_CONSTANT;
  }
}

/**
 * Calculate daily calorie needs based on BMR, activity level, and goal
 * @param bmr - Basal Metabolic Rate
 * @param activity - Activity level
 * @param goal - User's fitness goal
 * @returns Daily calorie target
 * @throws Error if BMR is invalid
 */
export function calculateDailyCalories(
  bmr: number,
  activity: Profile['activity'],
  goal: Profile['goal']
): number {
  // Validate BMR
  if (!Number.isFinite(bmr) || bmr <= 0) {
    throw new Error('Invalid BMR value');
  }

  let calories = bmr * activityMultipliers[activity];

  // Adjust for goal
  if (goal === 'lose') calories -= CALORIE_ADJUSTMENT.DEFICIT;
  if (goal === 'gain') calories += CALORIE_ADJUSTMENT.SURPLUS;

  // Ensure minimum safe calorie level (never go below 1200 for safety)
  calories = Math.max(calories, 1200);

  return Math.round(calories);
}

/**
 * Calculate recommended macro distribution
 * @param calories - Daily calorie target
 * @param weight - User's weight in kg
 * @returns Object with protein, carbs, and fat in grams
 * @throws ValidationError if inputs are invalid
 */
export function calculateMacros(calories: number, weight: number) {
  // Validate inputs
  validateCalories(calories);
  validateWeight(weight);

  const protein = Math.round(weight * MACRO_CONSTANTS.PROTEIN_PER_KG);
  const fat = Math.round((calories * MACRO_CONSTANTS.FAT_PERCENTAGE) / MACRO_CONSTANTS.CALORIES_PER_GRAM_FAT);
  const proteinCalories = protein * MACRO_CONSTANTS.CALORIES_PER_GRAM_PROTEIN;
  const fatCalories = fat * MACRO_CONSTANTS.CALORIES_PER_GRAM_FAT;
  const remainingCalories = calories - proteinCalories - fatCalories;

  // Ensure carbs are never negative (if protein+fat exceed total, reduce fat)
  const carbs = remainingCalories >= 0
    ? Math.round(remainingCalories / MACRO_CONSTANTS.CALORIES_PER_GRAM_CARBS)
    : 0;

  return { protein, carbs, fat };
}

/**
 * Calculate nutritional values based on amount
 * @param food - Food item with base nutritional values
 * @param grams - Amount in grams
 * @returns Calculated nutritional values for the specified amount
 * @throws Error if inputs are invalid
 */
export function calculateNutrition(food: Food, grams: number) {
  // Validate inputs
  if (!food || typeof food.serving !== 'number' || food.serving <= 0) {
    throw new Error('Invalid food data: serving size must be greater than 0');
  }
  if (!Number.isFinite(grams) || grams < 0) {
    throw new Error('Invalid grams value: must be a non-negative number');
  }

  const ratio = grams / food.serving;
  return {
    calories: Math.round(food.calories * ratio),
    protein: Math.round(food.protein * ratio * 10) / 10,
    carbs: Math.round(food.carbs * ratio * 10) / 10,
    fat: Math.round(food.fat * ratio * 10) / 10
  };
}

/**
 * Calculate total nutrition from multiple foods/meals
 * @param items - Array of items with nutritional values
 * @returns Sum of all nutritional values
 */
export function calculateTotalNutrition(
  items: Array<{ calories: number; protein: number; carbs: number; fat: number }>
) {
  return items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

/**
 * Calculate BMI (Body Mass Index)
 * @param weight - Weight in kg
 * @param height - Height in cm
 * @returns BMI value
 * @throws ValidationError if inputs are invalid
 */
export function calculateBMI(weight: number, height: number): number {
  // Validate inputs
  validateWeight(weight);
  validateHeight(height);

  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

/**
 * Calculate recommended goal weight based on BMI and user's goal
 * Healthy BMI range: 18.5-24.9
 * @param height - User's height in cm
 * @param currentWeight - User's current weight in kg
 * @param goal - User's fitness goal ('lose', 'maintain', 'gain')
 * @returns Recommended goal weight in kg
 * @throws ValidationError if inputs are invalid
 */
export function calculateRecommendedGoalWeight(
  height: number,
  currentWeight: number,
  goal: Profile['goal']
): number {
  // Validate inputs (calculateBMI will validate height and weight)
  validateHeight(height);
  validateWeight(currentWeight);

  const heightInMeters = height / 100;
  const currentBMI = calculateBMI(currentWeight, height);

  if (goal === 'lose') {
    // Lose: nuanced approach based on current BMI
    if (currentBMI >= 30) {
      // Obese (BMI >= 30): aim for upper healthy range (BMI 24) - realistic, not aggressive
      return Math.round(BMI_CONSTANTS.TARGET_LOSE * heightInMeters * heightInMeters);
    } else if (currentBMI > BMI_CONSTANTS.HEALTHY_MAX) {
      // Overweight (BMI 25-30): aim for ideal middle (BMI 22)
      return Math.round(BMI_CONSTANTS.IDEAL * heightInMeters * heightInMeters);
    }
    // Already in healthy range: gentle weight loss (5% reduction)
    return Math.round(currentWeight * 0.95);
  } else if (goal === 'gain') {
    // Gain: nuanced approach based on current BMI
    if (currentBMI < 17) {
      // Severely underweight (BMI < 17): aim for lower healthy range (BMI 20) - realistic
      return Math.round(BMI_CONSTANTS.TARGET_GAIN * heightInMeters * heightInMeters);
    } else if (currentBMI < BMI_CONSTANTS.HEALTHY_MIN) {
      // Underweight (BMI 17-18.5): aim for ideal middle (BMI 22)
      return Math.round(BMI_CONSTANTS.IDEAL * heightInMeters * heightInMeters);
    }
    // Already in healthy range: gentle weight gain (5% increase for muscle building)
    return Math.round(currentWeight * 1.05);
  } else {
    // Maintain: aim for edge of healthy range or maintain current
    if (currentBMI > BMI_CONSTANTS.HEALTHY_MAX) {
      // Overweight: gradual approach to top of healthy range (BMI 24.9)
      return Math.round(BMI_CONSTANTS.HEALTHY_MAX * heightInMeters * heightInMeters);
    } else if (currentBMI < BMI_CONSTANTS.HEALTHY_MIN) {
      // Underweight: gradual approach to bottom of healthy range (BMI 18.5)
      return Math.round(BMI_CONSTANTS.HEALTHY_MIN * heightInMeters * heightInMeters);
    }
    // Already in healthy range: maintain current weight
    return currentWeight;
  }
}

/**
 * Calculate total calories burned from exercises
 * Eliminates duplicate reduce pattern in 5+ files
 * @param exercises - Array of exercises with caloriesBurned property
 * @returns Total calories burned
 */
export function calculateTotalCaloriesBurned(
  exercises: Array<{ caloriesBurned: number }>
): number {
  return exercises.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0);
}

/**
 * Calculate percentage with specified decimal places
 * Eliminates duplicate percentage calculation logic
 * @param value - Current value
 * @param total - Total/goal value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Percentage as string
 */
export function calculatePercentage(
  value: number,
  total: number,
  decimals: number = 1
): string {
  if (total === 0) return '0';
  return ((value / total) * 100).toFixed(decimals);
}
