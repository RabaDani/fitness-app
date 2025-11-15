import { h } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import { ListCheck, Plus } from 'lucide-preact';
import { Exercise } from '../../../types';
import { useAppContext } from '../../../context/AppContext';
import { exerciseDatabase } from '../../../utils/constants/database';
import { exerciseCategoryLabels } from '../../../utils/constants/ui';
import { calculateTotalCaloriesBurned, calculatePercentage } from '../../../utils/calculations';
import { ModalWrapper, ModalHeader, ModalFooter } from '../../shared';
import { CustomExerciseForm } from './CustomExerciseForm';
import { ExerciseList } from './ExerciseList';
import { SelectedExerciseDetails } from './SelectedExerciseDetails';

interface AddExerciseModalProps {
  onClose: () => void;
  category: Exercise['category'];
  setCategory: (category: Exercise['category']) => void;
  customExercises: typeof exerciseDatabase;
  setCustomExercises: (exercises: typeof exerciseDatabase) => void;
}

/**
 * Modal for adding new exercises
 */
export function AddExerciseModal({
  onClose,
  category,
  setCategory,
  customExercises,
  setCustomExercises
}: AddExerciseModalProps) {
  const { dailyExercises, setDailyExercises, profile } = useAppContext();
  const [selectedExercise, setSelectedExercise] = useState<typeof exerciseDatabase[0] | null>(null);
  const [duration, setDuration] = useState(30);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCaloriesPerMinute, setCustomCaloriesPerMinute] = useState(5);

  // Calculate preview stats
  const preview = useMemo(() => {
    if (!selectedExercise) return null;
    const caloriesBurned = Math.round(selectedExercise.caloriesPerMinute * duration);
    const todayCaloriesBurned = calculateTotalCaloriesBurned(dailyExercises);
    const totalAfter = todayCaloriesBurned + caloriesBurned;
    const percentOfDaily = calculatePercentage(caloriesBurned, profile.dailyCalories);
    return { caloriesBurned, todayCaloriesBurned, totalAfter, percentOfDaily };
  }, [selectedExercise, duration, dailyExercises, profile.dailyCalories]);

  // Merge default and custom exercises
  const allExercises = [...exerciseDatabase, ...customExercises];

  // Filter exercises by selected category
  const filteredExercises = allExercises.filter(ex => ex.category === category);

  /**
   * Create a new custom exercise
   */
  const createCustomExercise = (): void => {
    if (!customName.trim()) return;

    const newCustomExercise = {
      id: Date.now(),
      name: customName.trim(),
      caloriesPerMinute: customCaloriesPerMinute,
      category
    };

    setCustomExercises([...customExercises, newCustomExercise]);
    setSelectedExercise(newCustomExercise);
    setIsCreatingCustom(false);
    setCustomName('');
    setCustomCaloriesPerMinute(5);
  };

  /**
   * Add selected exercise to daily log
   */
  const addExercise = (): void => {
    if (!selectedExercise) return;

    const caloriesBurned = Math.round(selectedExercise.caloriesPerMinute * duration);

    const newExercise: Exercise = {
      id: Date.now(),
      name: selectedExercise.name,
      caloriesBurned,
      duration,
      timestamp: new Date().toISOString(),
      category: selectedExercise.category,
      isCustom: customExercises.some(ex => ex.id === selectedExercise.id)
    };

    setDailyExercises([...dailyExercises, newExercise]);
    onClose();
  };

  return (
    <ModalWrapper
      maxWidth={selectedExercise && !isCreatingCustom ? '3xl' : 'xl'}
      onBackdropClick={onClose}
    >
      <div class="max-h-[90vh] flex flex-col transition-all duration-500">
        <ModalHeader
          title="Edzés hozzáadása"
          onClose={onClose}
        />

        {/* Scrollable Content */}
        <div class="overflow-y-auto flex-1">
          <div class="p-4">
            {/* Category selector - Full Width */}
            <div class="mb-3">
              <label class="label-sm">
                Kategória
              </label>
              <select
                value={category}
                onChange={e => setCategory((e.target as HTMLSelectElement).value as Exercise['category'])}
                class="select-field"
              >
                {Object.entries(exerciseCategoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Compact Tabs - Full Width */}
            <div class="flex mb-3 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsCreatingCustom(false)}
                class={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                  !isCreatingCustom
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <div class="flex items-center justify-center space-x-1.5">
                  <ListCheck size={16} />
                  <span>Listából</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setIsCreatingCustom(true);
                  setSelectedExercise(null);
                }}
                class={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                  isCreatingCustom
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <div class="flex items-center justify-center space-x-1.5">
                  <Plus size={16} />
                  <span>Egyéni</span>
                </div>
              </button>
            </div>

            {/* 2-Column Grid: List | Details */}
            <div class={`grid gap-3 ${selectedExercise && !isCreatingCustom ? 'grid-cols-1 lg:grid-cols-[1fr,1fr]' : 'grid-cols-1'}`}>
              {/* Left Column: Exercise List or Custom Form */}
              <div>
                {isCreatingCustom ? (
                  <CustomExerciseForm
                    customName={customName}
                    setCustomName={setCustomName}
                    customCaloriesPerMinute={customCaloriesPerMinute}
                    setCustomCaloriesPerMinute={setCustomCaloriesPerMinute}
                    onCreateCustomExercise={createCustomExercise}
                  />
                ) : (
                  <ExerciseList
                    exercises={filteredExercises}
                    customExercises={customExercises}
                    selectedExercise={selectedExercise}
                    onSelectExercise={setSelectedExercise}
                  />
                )}
              </div>

              {/* Right Column: Duration Input & Preview */}
              {selectedExercise && !isCreatingCustom && preview && (
                <div class="lg:border-l lg:pl-3 border-gray-200 dark:border-gray-700">
                  <SelectedExerciseDetails
                    exercise={selectedExercise}
                    duration={duration}
                    onDurationChange={setDuration}
                    preview={preview}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <ModalFooter
          onCancel={onClose}
          onConfirm={addExercise}
          cancelText="Mégse"
          confirmText="Hozzáadás"
          disabled={!selectedExercise}
        />
      </div>
    </ModalWrapper>
  );
}
