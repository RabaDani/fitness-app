/**
 * Validation utilities for user input
 * Ensures data integrity and prevents calculation errors
 */

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validation options
 */
export interface ValidationOptions {
  /**
   * If true, allows partial/incomplete values (e.g., user still typing)
   * Useful for real-time validation in input fields
   */
  allowPartial?: boolean;
}

/**
 * Validation constraints
 */
export const VALIDATION_CONSTRAINTS = {
  age: { min: 15, max: 120 },
  height: { min: 100, max: 250 }, // cm
  weight: { min: 30, max: 300 }, // kg
  goalWeight: { min: 30, max: 300 }, // kg
  calories: { min: 500, max: 10000 }, // kcal per day
  macros: {
    protein: { min: 0, max: 500 }, // g
    carbs: { min: 0, max: 1000 }, // g
    fat: { min: 0, max: 500 } // g
  }
};

/**
 * Validate age value
 * @param age - Age in years
 * @param options - Validation options (allowPartial)
 * @throws ValidationError if age is out of valid range (15-120)
 */
export function validateAge(age: number, options: ValidationOptions = {}): void {
  if (!Number.isFinite(age)) {
    throw new ValidationError('Az életkor érvénytelen szám');
  }

  // If partial input is allowed, skip range validation for incomplete values
  if (options.allowPartial && age > 0 && age < VALIDATION_CONSTRAINTS.age.min) {
    return; // Early return to skip validation for partial input
  }

  if (age < VALIDATION_CONSTRAINTS.age.min) {
    throw new ValidationError(`Az életkornak legalább ${VALIDATION_CONSTRAINTS.age.min} évnek kell lennie`);
  }
  if (age > VALIDATION_CONSTRAINTS.age.max) {
    throw new ValidationError(`Az életkor nem lehet több mint ${VALIDATION_CONSTRAINTS.age.max} év`);
  }
}

/**
 * Validate height value
 * @param height - Height in centimeters
 * @param options - Validation options (allowPartial)
 * @throws ValidationError if height is out of valid range (100-250 cm)
 */
export function validateHeight(height: number, options: ValidationOptions = {}): void {
  if (!Number.isFinite(height)) {
    throw new ValidationError('A magasság érvénytelen szám');
  }

  // If partial input is allowed, skip range validation for incomplete values
  // e.g., user typing "180" and currently at "1" or "18"
  if (options.allowPartial && height > 0 && height < VALIDATION_CONSTRAINTS.height.min) {
    return; // Early return to skip validation for partial input
  }

  if (height < VALIDATION_CONSTRAINTS.height.min) {
    throw new ValidationError(`A magasságnak legalább ${VALIDATION_CONSTRAINTS.height.min} cm-nek kell lennie`);
  }
  if (height > VALIDATION_CONSTRAINTS.height.max) {
    throw new ValidationError(`A magasság nem lehet több mint ${VALIDATION_CONSTRAINTS.height.max} cm`);
  }
}

/**
 * Validate weight value
 * @param weight - Weight in kilograms
 * @param options - Validation options (allowPartial)
 * @throws ValidationError if weight is out of valid range (30-300 kg)
 */
export function validateWeight(weight: number, options: ValidationOptions = {}): void {
  if (!Number.isFinite(weight)) {
    throw new ValidationError('A súly érvénytelen szám');
  }

  // If partial input is allowed, skip range validation for incomplete values
  if (options.allowPartial && weight > 0 && weight < VALIDATION_CONSTRAINTS.weight.min) {
    return; // Early return to skip validation for partial input
  }

  if (weight < VALIDATION_CONSTRAINTS.weight.min) {
    throw new ValidationError(`A súlynak legalább ${VALIDATION_CONSTRAINTS.weight.min} kg-nak kell lennie`);
  }
  if (weight > VALIDATION_CONSTRAINTS.weight.max) {
    throw new ValidationError(`A súly nem lehet több mint ${VALIDATION_CONSTRAINTS.weight.max} kg`);
  }
}

/**
 * Validate goal weight value
 * @param goalWeight - Target weight in kilograms
 * @param options - Validation options (allowPartial)
 * @throws ValidationError if goal weight is out of valid range (30-300 kg)
 */
export function validateGoalWeight(goalWeight: number, options: ValidationOptions = {}): void {
  if (!Number.isFinite(goalWeight)) {
    throw new ValidationError('A célsúly érvénytelen szám');
  }

  // If partial input is allowed, skip range validation for incomplete values
  if (options.allowPartial && goalWeight > 0 && goalWeight < VALIDATION_CONSTRAINTS.goalWeight.min) {
    return; // Early return to skip validation for partial input
  }

  if (goalWeight < VALIDATION_CONSTRAINTS.goalWeight.min) {
    throw new ValidationError(`A célsúlynak legalább ${VALIDATION_CONSTRAINTS.goalWeight.min} kg-nak kell lennie`);
  }
  if (goalWeight > VALIDATION_CONSTRAINTS.goalWeight.max) {
    throw new ValidationError(`A célsúly nem lehet több mint ${VALIDATION_CONSTRAINTS.goalWeight.max} kg`);
  }
}

/**
 * Validate calorie value
 * @param calories - Daily calorie target in kcal
 * @param options - Validation options (allowPartial)
 * @throws ValidationError if calories are out of valid range (500-10000 kcal)
 */
export function validateCalories(calories: number, options: ValidationOptions = {}): void {
  if (!Number.isFinite(calories)) {
    throw new ValidationError('A kalória érvénytelen szám');
  }

  // If partial input is allowed, skip range validation for incomplete values
  if (options.allowPartial && calories > 0 && calories < VALIDATION_CONSTRAINTS.calories.min) {
    return; // Early return to skip validation for partial input
  }

  if (calories < VALIDATION_CONSTRAINTS.calories.min) {
    throw new ValidationError(`A kalóriának legalább ${VALIDATION_CONSTRAINTS.calories.min} kcal-nak kell lennie`);
  }
  if (calories > VALIDATION_CONSTRAINTS.calories.max) {
    throw new ValidationError(`A kalória nem lehet több mint ${VALIDATION_CONSTRAINTS.calories.max} kcal`);
  }
}

/**
 * Validate complete profile object
 * @param profile - Profile object containing age, height, weight, and optional goal weight
 * @param options - Validation options (allowPartial)
 * @throws ValidationError if any profile field is invalid
 */
export function validateProfile(
  profile: {
    age: number;
    height: number;
    weight: number;
    goalWeight?: number;
  },
  options: ValidationOptions = {}
): void {
  validateAge(profile.age, options);
  validateHeight(profile.height, options);
  validateWeight(profile.weight, options);
  if (profile.goalWeight !== undefined) {
    validateGoalWeight(profile.goalWeight, options);
  }
}

/**
 * Helper function for real-time input validation
 * Use this in onChange handlers to avoid errors while user is typing
 * @param value - Value to validate
 * @param type - Type of input field (age, height, weight, goalWeight, calories)
 * @returns Validation result with valid boolean and optional error message
 */
export function validateInputField(
  value: number,
  type: 'age' | 'height' | 'weight' | 'goalWeight' | 'calories'
): { valid: boolean; error?: string } {
  try {
    const options: ValidationOptions = { allowPartial: true };

    switch (type) {
      case 'age':
        validateAge(value, options);
        break;
      case 'height':
        validateHeight(value, options);
        break;
      case 'weight':
        validateWeight(value, options);
        break;
      case 'goalWeight':
        validateGoalWeight(value, options);
        break;
      case 'calories':
        validateCalories(value, options);
        break;
    }

    return { valid: true };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { valid: false, error: error.message };
    }
    return { valid: false, error: 'Érvénytelen érték' };
  }
}

/**
 * Helper function for final validation (on blur or submit)
 * Use this when user finishes entering the value
 * @param value - Value to validate
 * @param type - Type of input field (age, height, weight, goalWeight, calories)
 * @returns Validation result with valid boolean and optional error message
 */
export function validateInputFieldStrict(
  value: number,
  type: 'age' | 'height' | 'weight' | 'goalWeight' | 'calories'
): { valid: boolean; error?: string } {
  try {
    switch (type) {
      case 'age':
        validateAge(value);
        break;
      case 'height':
        validateHeight(value);
        break;
      case 'weight':
        validateWeight(value);
        break;
      case 'goalWeight':
        validateGoalWeight(value);
        break;
      case 'calories':
        validateCalories(value);
        break;
    }

    return { valid: true };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { valid: false, error: error.message };
    }
    return { valid: false, error: 'Érvénytelen érték' };
  }
}
