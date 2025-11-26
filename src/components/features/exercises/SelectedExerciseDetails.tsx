import { h } from 'preact';
import { Flame, TrendingDown, Info } from 'lucide-preact';
import { exerciseDatabase } from '../../../utils/constants/database';
import { UI_CONSTANTS } from '../../../utils/constants/ui';
import { useProfile } from '../../../context/ProfileContext';

interface SelectedExerciseDetailsProps {
  exercise: typeof exerciseDatabase[0];
  duration: number;
  onDurationChange: (duration: number) => void;
  preview: {
    caloriesBurned: number;
    todayCaloriesBurned: number;
    totalAfter: number;
    percentOfDaily: string;
  };
}

/**
 * Details panel for selected exercise with duration input and calorie preview
 */
export function SelectedExerciseDetails({
  exercise,
  duration,
  onDurationChange,
  preview
}: SelectedExerciseDetailsProps) {
  const { profile } = useProfile();

  return (
    <div class="space-y-3">
      {/* Exercise Info */}
      <div class="card-secondary">
        <h3 class="text-primary text-sm font-semibold mb-2">
          {exercise.name}
        </h3>

        <div>
          <label class="label-sm">
            Időtartam (perc)
          </label>
          <input
            type="number"
            value={duration}
            onInput={e => onDurationChange(parseInt((e.target as HTMLInputElement).value) || 0)}
            class="input-field-sm"
            min={UI_CONSTANTS.INPUT.EXERCISE_DURATION_MIN}
            max={UI_CONSTANTS.INPUT.EXERCISE_DURATION_MAX}
          />
        </div>
      </div>

      {/* Calorie Burn Impact */}
      <div class="card-preview-orange">
        <h3 class="text-primary text-xs font-semibold mb-2 flex items-center space-x-1">
          <Flame size={14} />
          <span>Kalóriaégetés</span>
        </h3>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-tertiary text-xs">Ez az edzés</p>
            <p class="text-2xl font-bold text-orange-600">
              {preview.caloriesBurned}
            </p>
            <p class="text-tertiary text-xs">kcal</p>
          </div>
          <TrendingDown size={20} class="text-orange-600" />
          <div class="text-right">
            <p class="text-tertiary text-xs">Napi célból</p>
            <p class="text-primary text-base font-semibold">
              {preview.percentOfDaily}%
            </p>
            <p class="text-tertiary text-xs">
              {profile.dailyCalories} kcal-ból
            </p>
          </div>
        </div>
      </div>

      {/* Today's Total */}
      <div class="card-preview-green">
        <h3 class="text-primary text-xs font-semibold mb-2 flex items-center space-x-1">
          <Info size={14} />
          <span>Mai összesítés</span>
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <div class="card-secondary">
            <p class="text-tertiary text-xs">Eddig égetett</p>
            <p class="text-primary text-lg font-bold">
              {preview.todayCaloriesBurned}
            </p>
            <p class="text-tertiary text-xs">kcal</p>
          </div>
          <div class="card-secondary">
            <p class="text-tertiary text-xs">Után lesz</p>
            <p class="text-lg font-bold text-green-600">
              {preview.totalAfter}
            </p>
            <p class="text-tertiary text-xs">kcal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
