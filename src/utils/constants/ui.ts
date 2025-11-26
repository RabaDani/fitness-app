/**
 * UI constants and labels
 */

import { VALIDATION_CONSTRAINTS } from '../validation';

export const UI_CONSTANTS = {
  MODAL: {
    WIDTH_SM: 'max-w-md',
    WIDTH_MD: 'max-w-2xl',
    WIDTH_LG: 'max-w-4xl',
    HEIGHT: 'max-h-[90vh]',
    SCROLL_HEIGHT_SM: 'max-h-64',
    SCROLL_HEIGHT_MD: 'max-h-80',
    SCROLL_HEIGHT_LG: 'max-h-[300px]'
  },
  INPUT: {
    AGE_MIN: VALIDATION_CONSTRAINTS.age.min,
    AGE_MAX: VALIDATION_CONSTRAINTS.age.max,
    HEIGHT_MIN: VALIDATION_CONSTRAINTS.height.min,
    HEIGHT_MAX: VALIDATION_CONSTRAINTS.height.max,
    WEIGHT_MIN: VALIDATION_CONSTRAINTS.weight.min,
    WEIGHT_MAX: VALIDATION_CONSTRAINTS.weight.max,
    EXERCISE_DURATION_MIN: 1,
    EXERCISE_DURATION_MAX: 300,
    CALORIES_PER_MINUTE_MIN: 1,
    CALORIES_PER_MINUTE_MAX: 20,
    FOOD_AMOUNT_MIN: 1
  },
  PLACEHOLDER: {
    FOOD_SEARCH: 'Pl. csirkemell, alma...',
    EXERCISE_NAME: 'pl. Jóga, Spinning...'
  }
} as const;

export const mealTypeLabels = {
  breakfast: 'Reggeli',
  lunch: 'Ebéd',
  dinner: 'Vacsora',
  snack: 'Snack'
} as const;

export const activityLabels = {
  sedentary: 'Ülő életmód',
  light: 'Könnyű aktivitás',
  moderate: 'Mérsékelt aktivitás',
  active: 'Aktív',
  veryActive: 'Nagyon aktív'
} as const;

export const goalLabels = {
  lose: 'Fogyás',
  maintain: 'Súlytartás',
  gain: 'Hízás'
} as const;

export const exerciseCategoryLabels = {
  cardio: 'Kardió',
  strength: 'Erősítő',
  mobility: 'Mobilitás',
  sports: 'Sport'
} as const;

export const dayNames = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];

export const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY || '';
