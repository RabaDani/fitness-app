import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Plus, Flame, Dumbbell } from 'lucide-preact';
import { Exercise } from '../../types';
import { useData } from '../../context/DataContext';
import { useSettings } from '../../context/SettingsContext';
import { ConfirmationModal, SwipeableItem, FloatingActionButton, EmptyState } from '../shared';
import { ExerciseCard, AddExerciseModal } from '../features/exercises';
import { exerciseCategoryLabels } from '../../utils/constants/ui';

/**
 * Exercise log view for tracking daily workouts and calories burned
 * Helps users monitor their calorie expenditure and activity levels
 */
export function ExerciseLog() {
  const { dailyExercises, setDailyExercises } = useData();
  const { customExercises, setCustomExercises, showSuccess } = useSettings();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Exercise['category']>('cardio');
  const [exerciseToDelete, setExerciseToDelete] = useState<number | null>(null);

  // Calculate total calories burned today
  const totalCaloriesBurned = dailyExercises.reduce(
    (sum, exercise) => sum + exercise.caloriesBurned,
    0
  );

  /**
   * Show confirmation modal for exercise deletion (desktop)
   * @param index - Index of exercise to remove
   */
  const removeExercise = (index: number): void => {
    setExerciseToDelete(index);
  };

  /**
   * Delete exercise directly without confirmation (mobile swipe)
   * @param index - Index of exercise to remove
   */
  const deleteExerciseDirectly = (index: number): void => {
    const exerciseName = dailyExercises[index].name;
    const exercisesBeforeDelete = [...dailyExercises];

    setDailyExercises(dailyExercises.filter((_, i) => i !== index));

    showSuccess(`${exerciseName} törölve`, () => {
      setDailyExercises(exercisesBeforeDelete);
    });
  };

  /**
   * Confirm and delete the exercise
   */
  const confirmDelete = (): void => {
    if (exerciseToDelete !== null) {
      const exerciseName = dailyExercises[exerciseToDelete].name;
      const exercisesBeforeDelete = [...dailyExercises];

      setDailyExercises(dailyExercises.filter((_, i) => i !== exerciseToDelete));
      setExerciseToDelete(null);

      showSuccess(`${exerciseName} törölve`, () => {
        setDailyExercises(exercisesBeforeDelete);
      });
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
          class="btn-primary hidden lg:flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Edzés hozzáadása</span>
        </button>
      </div>

      {/* Total calories burned card */}
      <div class="card-theme">
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
                      <SwipeableItem
                        key={absoluteIndex}
                        onDelete={() => deleteExerciseDirectly(absoluteIndex)}
                      >
                        <ExerciseCard
                          exercise={exercise}
                          onRemove={() => removeExercise(absoluteIndex)}
                        />
                      </SwipeableItem>
                    ) : null
                  )}
                </div>
              ) : (
                <EmptyState
                  icon={<Dumbbell size={40} class="text-gray-400 dark:text-gray-500" />}
                  title="Nincs rögzített edzés"
                  message="Rögzítsd az edzésedet és kövesd nyomon a kalóriaégetést!"
                  action={{
                    label: 'Edzés hozzáadása',
                    onClick: () => {
                      setSelectedCategory(category.id);
                      setShowAddModal(true);
                    }
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Action Button - Mobile only */}
      < FloatingActionButton onClick={() =>
        setShowAddModal(true)
      } aria-label="Edzés hozzáadása" />

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
