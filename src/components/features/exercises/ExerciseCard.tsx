import { Trash2 } from 'lucide-preact';
import { Exercise } from '../../../types';

interface ExerciseCardProps {
  exercise: Exercise;
  onRemove: () => void;
}

/**
 * Individual exercise card with details and remove button
 * @param exercise - Exercise to display
 * @param onRemove - Callback when remove button is clicked
 */
export function ExerciseCard({ exercise, onRemove }: ExerciseCardProps) {
  return (
    <div class="card-list-item flex justify-between items-center">
      <div>
        <p class="text-primary font-medium text-lg">
          {exercise.name}
          {exercise.isCustom && (
            <span class="badge-info ml-2">
              Egyéni
            </span>
          )}
        </p>
        <p class="text-secondary text-sm">
          {exercise.duration} perc
        </p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="text-right">
          <p class="text-2xl font-bold text-orange-600">{exercise.caloriesBurned}</p>
          <p class="text-secondary text-xs">kcal</p>
        </div>
        <button onClick={onRemove} class="btn-icon-danger hidden lg:flex">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
