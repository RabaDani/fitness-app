import { h } from 'preact';
import { User } from 'lucide-preact';
import { Profile } from '../../../types';
import { useAppContext } from '../../../context/AppContext';
import { activityLabels, goalLabels, UI_CONSTANTS } from '../../../utils/constants/ui';
import { useProfileForm } from '../../../hooks/useProfileForm';
import { ProfileFormInput, ProfileSelect, InfoNote, ThemeToggle } from '../../shared';
import { BMIDisplay, CaloriePreview, MacroPreview } from './';

/**
 * Profile setup form for first-time users with enhanced UX
 * Features: BMI preview, 2-column layout, dark mode support, real-time calculations
 */
export function ProfileSetup() {
  const { setProfile, darkMode } = useAppContext();

  const {
    formData,
    updateField,
    validateField,
    validationErrors,
    autoCalculateGoal,
    setAutoCalculateGoal,
    preview,
    handleSubmit
  } = useProfileForm({
    initialData: {},
    onSubmit: setProfile,
    trackChanges: false,
    calculatePreview: true  // Enable preview for BMI and calorie display
  });

  return (
    <div class="flex items-center justify-center min-h-screen p-4 bg-app">
      <div class="card rounded-lg shadow-xl p-6 max-w-4xl w-full">
        {/* Header */}
        <div class="grid grid-cols-3 items-center mb-6">
          <div class="flex justify-start">
            <h2 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              TheBestOfYou
            </h2>
          </div>
          <div class="flex justify-center items-center space-x-3">
            <User size={32} class="text-indigo-600" />
            <h1 class="heading-1">
              Profil Beállítás
            </h1>
          </div>
          <div class="flex justify-end">
            <ThemeToggle />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div class="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6">
            {/* Left Column - Form Fields */}
            <div class="space-y-4">
              {/* Gender & Age Row */}
              <div class="grid grid-cols-2 gap-4">
                <ProfileSelect
                  label="Nem"
                  value={formData.gender}
                  onChange={(value) => updateField('gender', value as 'male' | 'female')}
                  options={{ male: 'Férfi', female: 'Nő' }}
                />

                <ProfileFormInput
                  label="Életkor"
                  value={formData.age}
                  onChange={value => updateField('age', value)}
                  onValidate={value => validateField('age', value, 'age')}
                  error={validationErrors.age}
                  min={UI_CONSTANTS.INPUT.AGE_MIN}
                  max={UI_CONSTANTS.INPUT.AGE_MAX}
                  darkMode={darkMode}
                />
              </div>

              {/* Height & Weight Row */}
              <div class="grid grid-cols-2 gap-4">
                <ProfileFormInput
                  label="Magasság (cm)"
                  value={formData.height}
                  onChange={value => updateField('height', value)}
                  onValidate={value => validateField('height', value, 'height')}
                  error={validationErrors.height}
                  min={UI_CONSTANTS.INPUT.HEIGHT_MIN}
                  max={UI_CONSTANTS.INPUT.HEIGHT_MAX}
                  darkMode={darkMode}
                />

                <ProfileFormInput
                  label="Jelenlegi súly (kg)"
                  value={formData.weight}
                  onChange={value => updateField('weight', value)}
                  onValidate={value => validateField('weight', value, 'weight')}
                  error={validationErrors.weight}
                  min={UI_CONSTANTS.INPUT.WEIGHT_MIN}
                  max={UI_CONSTANTS.INPUT.WEIGHT_MAX}
                  darkMode={darkMode}
                />
              </div>

              {/* Goal Weight */}
              <ProfileFormInput
                label="Célsúly (kg)"
                value={formData.goalWeight}
                onChange={value => {
                  setAutoCalculateGoal(false);
                  updateField('goalWeight', value);
                }}
                onValidate={value => validateField('goalWeight', value, 'goalWeight')}
                error={validationErrors.goalWeight}
                hint={autoCalculateGoal ? '(ajánlott érték)' : '(egyéni)'}
                min={UI_CONSTANTS.INPUT.WEIGHT_MIN}
                max={UI_CONSTANTS.INPUT.WEIGHT_MAX}
                darkMode={darkMode}
              />

              {/* Activity Level */}
              <ProfileSelect
                label="Aktivitási szint"
                value={formData.activity}
                onChange={(value) => updateField('activity', value as Profile['activity'])}
                options={activityLabels}
              />

              {/* Goal */}
              <ProfileSelect
                label="Cél"
                value={formData.goal}
                onChange={(value) => updateField('goal', value as Profile['goal'])}
                options={goalLabels}
              />
            </div>

            {/* Right Column - Preview Panel */}
            <div class="space-y-4">
              {/* BMI Display */}
              {preview && (
                <BMIDisplay
                  currentBMI={preview.currentBMI}
                  goalBMI={preview.goalBMI}
                  showComparison={true}
                />
              )}

              {/* Calorie Info */}
              {preview && (
                <CaloriePreview
                  newCalories={preview.calories}
                  bmr={preview.bmr}
                  showComparison={false}
                />
              )}

              {/* Macros Info */}
              {preview && (
                <MacroPreview
                  newMacros={preview.macros}
                  showComparison={false}
                />
              )}

              {/* Info Note */}
              <InfoNote>
                Az értékek automatikusan frissülnek, ahogy kitöltöd az űrlapot
              </InfoNote>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={Object.keys(validationErrors).length > 0}
            class={`w-full px-6 py-3 rounded-lg font-semibold transition-colors mt-6 ${Object.keys(validationErrors).length > 0
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'btn-primary'
              }`}
          >
            Profil Létrehozása
          </button>
        </form>
      </div>
    </div>
  );
}
