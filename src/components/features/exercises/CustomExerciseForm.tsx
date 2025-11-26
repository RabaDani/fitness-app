import { h } from 'preact';
import { UI_CONSTANTS } from '../../../utils/constants/ui';
import { useSettings } from '../../../context/SettingsContext';

interface CustomExerciseFormProps {
  customName: string;
  setCustomName: (name: string) => void;
  customCaloriesPerMinute: number;
  setCustomCaloriesPerMinute: (calories: number) => void;
  onCreateCustomExercise: () => void;
}

/**
 * Form for creating custom exercises
 */
export function CustomExerciseForm({
  customName,
  setCustomName,
  customCaloriesPerMinute,
  setCustomCaloriesPerMinute,
  onCreateCustomExercise
}: CustomExerciseFormProps) {
  const { darkMode } = useSettings();

  return (
    <div class="card-preview-blue">
      <h3 class="text-primary text-sm font-semibold mb-2">Új egyéni edzés</h3>

      <div class="space-y-2">
        <div>
          <label class="label-sm">
            Edzés neve
          </label>
          <input
            type="text"
            value={customName}
            onInput={e => setCustomName((e.target as HTMLInputElement).value)}
            placeholder={UI_CONSTANTS.PLACEHOLDER.EXERCISE_NAME}
            class="input-field-sm"
          />
        </div>

        <div>
          <label class="label-sm">
            Kalóriaégetés (kcal/perc)
          </label>
          <input
            type="number"
            value={customCaloriesPerMinute}
            onInput={e => setCustomCaloriesPerMinute(parseInt((e.target as HTMLInputElement).value) || 0)}
            class="input-field-sm"
            min={UI_CONSTANTS.INPUT.CALORIES_PER_MINUTE_MIN}
            max={UI_CONSTANTS.INPUT.CALORIES_PER_MINUTE_MAX}
          />
        </div>

        <button
          onClick={onCreateCustomExercise}
          disabled={!customName.trim()}
          class="btn-primary w-full"
        >
          Létrehozás
        </button>
      </div>
    </div>
  );
}
