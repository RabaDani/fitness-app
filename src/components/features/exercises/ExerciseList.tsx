import { exerciseDatabase } from '../../../utils/constants/database';

interface ExerciseListProps {
  exercises: typeof exerciseDatabase;
  customExercises: typeof exerciseDatabase;
  selectedExercise: typeof exerciseDatabase[0] | null;
  onSelectExercise: (exercise: typeof exerciseDatabase[0]) => void;
}

/**
 * List of exercises with custom badge
 */
export function ExerciseList({
  exercises,
  customExercises,
  selectedExercise,
  onSelectExercise
}: ExerciseListProps) {
  const getCardClass = (isSelected: boolean) => {
    return isSelected ? 'card-list-item-selected' : 'card-list-item cursor-pointer';
  };

  return (
    <div>
      <label class="label-sm">
        Edzés típusa
      </label>
      <div class="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
        {exercises.map(exercise => {
          const isCustom = customExercises.some(ex => ex.id === exercise.id);
          const isSelected = selectedExercise?.id === exercise.id;
          return (
            <div
              key={exercise.id}
              onClick={() => onSelectExercise(exercise)}
              class={getCardClass(isSelected)}
            >
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-2">
                  <p class="text-primary text-sm font-medium">
                    {exercise.name}
                  </p>
                  {isCustom && (
                    <span class="badge-info">
                      Egyéni
                    </span>
                  )}
                </div>
                <p class="text-secondary text-xs">
                  ~{exercise.caloriesPerMinute} kcal/perc
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
