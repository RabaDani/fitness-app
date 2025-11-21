import { h } from 'preact';
import { User } from 'lucide-preact';
import { Profile } from '../../../types';
import { useAppContext } from '../../../context/AppContext';
import { useToastContext } from '../../../hooks/useToastContext';
import { activityLabels, goalLabels } from '../../../utils/constants/ui';
import { BMIDisplay } from './BMIDisplay';
import { CaloriePreview } from './CaloriePreview';
import { MacroPreview } from './MacroPreview';
import { ProfileFormInput, ProfileSelect, InfoNote, ModalWrapper, ModalHeader, ModalFooter } from '../../shared';
import { useProfileForm } from '../../../hooks/useProfileForm';

interface EditProfileModalProps {
  onClose: () => void;
  profile: Profile;
}

/**
 * Modal for editing user profile data with enhanced UX
 * Uses universal useProfileForm hook with preview and change tracking enabled
 */
export function EditProfileModal({ onClose, profile }: EditProfileModalProps) {
  const { setProfile } = useAppContext();
  const { showSuccess } = useToastContext();

  // Use universal hook for all form logic
  const {
    formData: editData,
    updateField,
    validateField,
    validationErrors,
    autoCalculateGoal,
    setAutoCalculateGoal,
    preview,
    hasChanges,
    handleSubmit: saveProfile
  } = useProfileForm({
    initialData: profile,
    onSubmit: (updatedProfile: Profile) => {
      setProfile(updatedProfile);
      showSuccess('Profil frissítve');
      onClose();
    },
    trackChanges: true,
    calculatePreview: true
  });

  return (
    <ModalWrapper maxWidth="3xl" onBackdropClick={onClose}>
      <div class="max-h-[90vh] flex flex-col">
        <ModalHeader
          title="Profil szerkesztése"
          icon={<User size={20} />}
          onClose={onClose}
        />

        {/* Scrollable Content */}
        <div class="overflow-y-auto flex-1">
          <div class="p-4">
            {/* Compact 2-Column Grid */}
            <div class="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-4">
              {/* Left Column - Compact Form */}
              <div class="space-y-3">
                {/* Inline Fields: Gender + Age */}
                <div class="grid grid-cols-2 gap-3">
                  <ProfileSelect
                    label="Nem"
                    value={editData.gender}
                    onChange={(value) => updateField('gender', value as 'male' | 'female')}
                    options={{ male: 'Férfi', female: 'Nő' }}
                  />
                  <ProfileFormInput
                    label="Életkor"
                    value={editData.age}
                    onChange={value => updateField('age', value)}
                    onValidate={value => validateField('age', value, 'age')}
                    error={validationErrors.age}
                    min={10}
                    max={120}
                  />
                </div>

                {/* Inline Fields: Height + Weight */}
                <div class="grid grid-cols-2 gap-3">
                  <ProfileFormInput
                    label="Magasság (cm)"
                    value={editData.height}
                    onChange={value => updateField('height', value)}
                    onValidate={value => validateField('height', value, 'height')}
                    error={validationErrors.height}
                    min={100}
                    max={250}
                  />
                  <ProfileFormInput
                    label="Súly (kg)"
                    value={editData.weight}
                    onChange={value => updateField('weight', value)}
                    onValidate={value => validateField('weight', value, 'weight')}
                    error={validationErrors.weight}
                    min={30}
                    max={300}
                  />
                </div>

                {/* Goal Weight */}
                <ProfileFormInput
                  label="Célsúly (kg)"
                  value={editData.goalWeight}
                  onChange={value => {
                    setAutoCalculateGoal(false);
                    updateField('goalWeight', value);
                  }}
                  onValidate={value => validateField('goalWeight', value, 'goalWeight')}
                  error={validationErrors.goalWeight}
                  hint={autoCalculateGoal ? '(ajánlott)' : '(egyéni)'}
                  min={30}
                  max={300}
                />

                {/* Goal Type */}
                <ProfileSelect
                  label="Cél típusa"
                  value={editData.goal}
                  onChange={(value) => updateField('goal', value as Profile['goal'])}
                  options={goalLabels}
                />

                {/* Activity */}
                <ProfileSelect
                  label="Aktivitási szint"
                  value={editData.activity}
                  onChange={(value) => updateField('activity', value as Profile['activity'])}
                  options={activityLabels}
                />
              </div>

              {/* Right Column - Compact Preview */}
              <div class="space-y-3">
                {/* BMI Display */}
                {preview && (
                  <BMIDisplay
                    currentBMI={preview.currentBMI}
                    goalBMI={preview.goalBMI}
                    showComparison={true}
                  />
                )}

                {/* Calorie Preview */}
                {preview && (
                  <CaloriePreview
                    currentCalories={profile.dailyCalories}
                    newCalories={preview.calories}
                  />
                )}

                {/* Macro Preview */}
                {preview && (
                  <MacroPreview
                    currentMacros={profile.macros}
                    newMacros={preview.macros}
                  />
                )}

                {/* Info */}
                <InfoNote compact={true}>
                  A célok automatikusan újraszámításra kerülnek
                </InfoNote>
              </div>
            </div>
          </div>
        </div>

        <ModalFooter
          onCancel={onClose}
          onConfirm={saveProfile}
          cancelText="Mégse"
          confirmText={hasChanges ? 'Mentés' : 'Nincs változás'}
          disabled={Object.keys(validationErrors).length > 0 || !hasChanges}
        />
      </div>
    </ModalWrapper>
  );
}
