import { useState, useEffect, useMemo } from 'preact/hooks';
import { Profile } from '../types';
import { calculateBMR, calculateDailyCalories, calculateMacros, calculateRecommendedGoalWeight, calculateBMI } from '../utils/calculations';
import { validateInputField, validateInputFieldStrict } from '../utils/validation';

interface ProfilePreview {
  bmr: number;
  calories: number;
  macros: Profile['macros'];
  currentBMI: number;
  goalBMI: number;
  adjustedGoal: 'lose' | 'gain' | 'maintain';
}

interface UseProfileFormOptions {
  /** Initial profile data (for edit mode) or default values (for setup mode) */
  initialData: Partial<Profile>;
  /** Callback when form is successfully submitted */
  onSubmit: (profile: Profile) => void;
  /** Whether to track changes (for edit mode) */
  trackChanges?: boolean;
  /** Whether to calculate preview values (for edit mode with preview display) */
  calculatePreview?: boolean;
}

/**
 * Universal custom hook for profile form logic
 * Handles both ProfileSetup and EditProfileModal use cases
 *
 * Features:
 * - Form state management
 * - Real-time and strict validation
 * - Auto-calculation of recommended goal weight
 * - Optional preview calculations (BMI, calories, macros)
 * - Optional change tracking
 * - Reusable across setup and edit scenarios
 */
export function useProfileForm({
  initialData,
  onSubmit,
  trackChanges = false,
  calculatePreview = false
}: UseProfileFormOptions) {
  // Default values for new profile setup
  const defaultFormData: Profile = {
    gender: 'male',
    age: 25,
    height: 170,
    weight: 70,
    goalWeight: 70,
    activity: 'moderate',
    goal: 'maintain',
    dailyCalories: 0,
    macros: { protein: 0, carbs: 0, fat: 0 },
    ...initialData
  };

  const [formData, setFormData] = useState<Profile>(defaultFormData);
  const [autoCalculateGoal, setAutoCalculateGoal] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  /**
   * Auto-calculate recommended goal weight
   */
  useEffect(() => {
    if (autoCalculateGoal && formData.height >= 100 && formData.weight >= 30) {
      try {
        const recommendedWeight = calculateRecommendedGoalWeight(
          formData.height,
          formData.weight,
          formData.goal
        );
        setFormData(prev => ({ ...prev, goalWeight: recommendedWeight }));
      } catch (error) {
        // Skip goal weight calculation if input is invalid
      }
    }
  }, [formData.height, formData.weight, formData.goal, autoCalculateGoal]);

  /**
   * Calculate preview values (optional, for edit mode with preview)
   */
  const preview = useMemo((): ProfilePreview | null => {
    if (!calculatePreview) return null;

    try {
      if (formData.age < 15 || formData.height < 100 || formData.weight < 30) {
        return null;
      }

      let adjustedGoal: 'lose' | 'gain' | 'maintain';
      if (formData.goalWeight < formData.weight) {
        adjustedGoal = 'lose';
      } else if (formData.goalWeight > formData.weight) {
        adjustedGoal = 'gain';
      } else {
        adjustedGoal = 'maintain';
      }

      const bmr = calculateBMR(formData.gender, formData.age, formData.height, formData.weight);
      const calories = calculateDailyCalories(bmr, formData.activity, adjustedGoal);
      const macros = calculateMacros(calories, formData.weight);
      const currentBMI = calculateBMI(formData.weight, formData.height);
      const goalBMI = calculateBMI(formData.goalWeight, formData.height);

      return {
        bmr,
        calories,
        macros,
        currentBMI,
        goalBMI,
        adjustedGoal
      };
    } catch {
      return null;
    }
  }, [formData, calculatePreview]);

  /**
   * Check if values changed from initial (optional, for edit mode)
   */
  const hasChanges = useMemo(() => {
    if (!trackChanges) return true; // Always allow submit in setup mode

    return formData.gender !== defaultFormData.gender ||
           formData.age !== defaultFormData.age ||
           formData.height !== defaultFormData.height ||
           formData.weight !== defaultFormData.weight ||
           formData.goalWeight !== defaultFormData.goalWeight ||
           formData.activity !== defaultFormData.activity ||
           formData.goal !== defaultFormData.goal;
  }, [formData, defaultFormData, trackChanges]);

  /**
   * Update form field value
   */
  const updateField = <K extends keyof Profile>(
    field: K,
    value: Profile[K]
  ): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Validate input field in real-time
   */
  const validateField = (
    field: string,
    value: number,
    type: 'age' | 'height' | 'weight' | 'goalWeight'
  ): void => {
    const validation = validateInputField(value, type);
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (!validation.valid && validation.error) {
        newErrors[field] = validation.error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  /**
   * Handle form submission with strict validation
   */
  const handleSubmit = (e?: Event): void => {
    if (e) e.preventDefault();

    const { gender, age, height, weight, activity, goalWeight } = formData;

    // Strict validation before submission
    const ageValidation = validateInputFieldStrict(age, 'age');
    const heightValidation = validateInputFieldStrict(height, 'height');
    const weightValidation = validateInputFieldStrict(weight, 'weight');
    const goalWeightValidation = validateInputFieldStrict(goalWeight, 'goalWeight');

    const errors: Record<string, string> = {};
    if (!ageValidation.valid && ageValidation.error) errors.age = ageValidation.error;
    if (!heightValidation.valid && heightValidation.error) errors.height = heightValidation.error;
    if (!weightValidation.valid && weightValidation.error) errors.weight = weightValidation.error;
    if (!goalWeightValidation.valid && goalWeightValidation.error) errors.goalWeight = goalWeightValidation.error;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Determine adjusted goal based on goal weight vs current weight
    let adjustedGoal: 'lose' | 'gain' | 'maintain';
    if (goalWeight < weight) {
      adjustedGoal = 'lose';
    } else if (goalWeight > weight) {
      adjustedGoal = 'gain';
    } else {
      adjustedGoal = 'maintain';
    }

    // Calculate final values
    const bmr = calculateBMR(gender, age, height, weight);
    const calories = calculateDailyCalories(bmr, activity, adjustedGoal);
    const macros = calculateMacros(calories, weight);

    // Submit with calculated values
    onSubmit({
      ...formData,
      goal: adjustedGoal,
      dailyCalories: calories,
      macros
    });
  };

  return {
    formData,
    updateField,
    validateField,
    validationErrors,
    autoCalculateGoal,
    setAutoCalculateGoal,
    preview, // null if calculatePreview is false
    hasChanges, // always true if trackChanges is false
    handleSubmit
  };
}
