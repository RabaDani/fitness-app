/**
 * Calculation constants
 */

export const BMI_CONSTANTS = {
  HEALTHY_MIN: 18.5,
  HEALTHY_MAX: 24.9,
  IDEAL: 22,
  TARGET_LOSE: 24,
  TARGET_GAIN: 20
} as const;

export const MACRO_CONSTANTS = {
  PROTEIN_PER_KG: 2,
  FAT_PERCENTAGE: 0.25,
  CALORIES_PER_GRAM_PROTEIN: 4,
  CALORIES_PER_GRAM_CARBS: 4,
  CALORIES_PER_GRAM_FAT: 9
} as const;

export const WEIGHT_ADJUSTMENT = {
  LOSE_PERCENTAGE: 0.92,
  GAIN_PERCENTAGE: 1.08
} as const;

export const CALORIE_ADJUSTMENT = {
  DEFICIT: 500,
  SURPLUS: 500
} as const;

export const MIFFLIN_ST_JEOR = {
  WEIGHT_MULTIPLIER: 10,
  HEIGHT_MULTIPLIER: 6.25,
  AGE_MULTIPLIER: 5,
  MALE_CONSTANT: 5,
  FEMALE_CONSTANT: -161
} as const;

export const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9
} as const;

export const WATER_CONSTANTS = {
  BASE_ML_PER_KG: 35, // Base water intake: 35ml per kg body weight
  ACTIVITY_MULTIPLIERS: {
    sedentary: 1.0,
    light: 1.1,
    moderate: 1.2,
    active: 1.3,
    veryActive: 1.4
  },
  ROUND_TO_ML: 250, // Round to nearest 250ml (half glass)
  MIN_WATER_ML: 1500, // Minimum 1.5L per day
  MAX_WATER_ML: 5000 // Maximum 5L per day
} as const;
