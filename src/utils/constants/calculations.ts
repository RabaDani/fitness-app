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
