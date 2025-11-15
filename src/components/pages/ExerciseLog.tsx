import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Plus, Flame } from 'lucide-preact';
import { Exercise } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { ConfirmationModal } from '../shared';
import { ExerciseCard, AddExerciseModal } from '../features/exercises';
import { exerciseCategoryLabels } from '../../utils/constants/ui';

/**
 * Exercise log view for tracking daily workouts and calories burned
 * Helps users monitor their calorie expenditure and activity levels
 */
export function ExerciseLog() {
  const { dailyExercises, setDailyExercises, customExercises, setCustomExercises } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Exercise['category']>('cardio');
  const [exerciseToDelete, setExerciseToDelete] = useState<number | null>(null);

  // Calculate total calories burned today
  const totalCaloriesBurned = dailyExercises.reduce(
    (sum, exercise) => sum + exercise.caloriesBurned,
    0
  );

  /**
   * Show confirmation modal for exercise deletion
   * @param index - Index of exercise to remove
   */
  const removeExercise = (index: number): void => {
    setExerciseToDelete(index);
  };

  /**
   * Confirm and delete the exercise
   */
  const confirmDelete = (): void => {
    if (exerciseToDelete !== null) {
      setDailyExercises(dailyExercises.filter((_, i) => i !== exerciseToDelete));
      setExerciseToDelete(null);
    }
  };

  const categories: Array<{ id: Exercise['category']; label: string }> = [
    { id: 'cardio', label: exerciseCategoryLabels.cardio },
    { id: 'strength', label: exerciseCategoryLabels.strength },
    { id: 'mobility', label: exerciseCategoryLabels.mobility },
    { id: 'sports', label: exerciseCategoryLabels.sports }
  ];

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="heading-1">Edzésnapló</h1>
        <button
          onClick={() => setShowAddModal(true)}
          class="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Edzés hozzáadása</span>
        </button>
      </div>

      {/* Total calories burned card */}
      <div class="rounded-lg shadow-md p-6 bg-gradient-to-r from-orange-500 to-red-500 dark:from-blue-800 dark:to-blue-900 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90">Mai kalóriaégetés</p>
            <p class="text-4xl font-bold">{totalCaloriesBurned} kcal</p>
          </div>
          <Flame size={48} class="opacity-80 text-yellow-300" />
        </div>
      </div>

      {/* Exercise categories in grid layout on desktop */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map(category => {
          return (
            <div key={category.id} class="card">
              <h2 class="heading-2 mb-4">
                {category.label}
              </h2>
              {dailyExercises.filter(ex => ex.category === category.id).length > 0 ? (
                <div class="space-y-2">
                  {dailyExercises.map((exercise, absoluteIndex) =>
                    exercise.category === category.id ? (
                      <ExerciseCard
                        key={absoluteIndex}
                        exercise={exercise}
                        onRemove={() => removeExercise(absoluteIndex)}
                      />
                    ) : null
                  )}
                </div>
              ) : (
                <div class="text-center py-12">
                  <p class="mb-2 text-secondary">
                    Nincs rögzített edzés ebben a kategóriában
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setShowAddModal(true);
                    }}
                    class="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    + Edzés hozzáadása
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <AddExerciseModal
          onClose={() => setShowAddModal(false)}
          category={selectedCategory}
          setCategory={setSelectedCategory}
          customExercises={customExercises}
          setCustomExercises={setCustomExercises}
        />
      )}

      {exerciseToDelete !== null && (
        <ConfirmationModal
          title="Edzés törlése"
          message="Biztosan törölni szeretnéd ezt az edzést?"
          details={`${dailyExercises[exerciseToDelete].name} - ${dailyExercises[exerciseToDelete].duration} perc, ${dailyExercises[exerciseToDelete].caloriesBurned} kcal`}
          onConfirm={confirmDelete}
          onCancel={() => setExerciseToDelete(null)}
          confirmText="Törlés"
          cancelText="Mégse"
        />
      )}
    </div>
  );
};
