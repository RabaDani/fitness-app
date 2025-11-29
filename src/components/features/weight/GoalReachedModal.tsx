import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Trophy, Target } from 'lucide-preact';
import confetti from 'canvas-confetti';
import { useProfile } from '../../../context/ProfileContext';
import { useData } from '../../../context/DataContext';

interface GoalReachedModalProps {
  onClose: () => void;
}

/**
 * Congratulations modal shown when weight goal is reached
 * @param onClose - Callback to close the modal
 */
export function GoalReachedModal({ onClose }: GoalReachedModalProps) {
  const { profile, setProfile } = useProfile();
  const { weightHistory } = useData();
  const [showSetNewGoal, setShowSetNewGoal] = useState(false);
  const [newGoalWeight, setNewGoalWeight] = useState(profile?.goalWeight || 70);

  // Trigger confetti when modal opens
  useEffect(() => {
    confetti({
      particleCount: 100,
      angle: 90,
      spread: 160,
      startVelocity: 25,
      origin: { x: 0.5, y: 0.3 },
    });
  }, []);

  if (!profile) return null;

  /**
   * Update profile with new goal weight and automatically adjust goal type
   */
  const updateGoalWeight = (): void => {
    // Get current weight from latest weight history or profile
    const currentWeight = weightHistory.length > 0
      ? [...weightHistory].sort((a, b) => b.date.localeCompare(a.date))[0].weight
      : profile.weight;

    // Determine goal type based on new goal weight vs current weight
    let newGoalType: 'lose' | 'gain' | 'maintain';
    if (newGoalWeight < currentWeight) {
      newGoalType = 'lose';
    } else if (newGoalWeight > currentWeight) {
      newGoalType = 'gain';
    } else {
      newGoalType = 'maintain';
    }

    setProfile({ ...profile, weight: currentWeight, goalWeight: newGoalWeight, goal: newGoalType });
    onClose();
  };

  return (
    <div class="modal-overlay">
      <div class="modal-container max-w-md">
        <div class="p-6">
          {!showSetNewGoal ? (
            <>
              {/* Congratulations View */}
              <div class="text-center">
                <div class="mb-4 flex justify-center">
                  <Trophy size={64} class="text-yellow-500 animate-bounce" />
                </div>

                <h2 class="heading-2 mb-3">
                  Gratulálunk! 🎉
                </h2>

                <p class="text-primary mb-2">
                  Elérted a célsúlyodat!
                </p>

                <div class="card-secondary mb-6">
                  <p class="text-sm mb-2 text-secondary">
                    Célsúly
                  </p>
                  <p class="text-3xl font-bold text-accent">
                    {profile.goalWeight} kg
                  </p>
                </div>

                <p class="text-sm mb-6 text-secondary">
                  Fantasztikus munka! Szeretnél új célt kitűzni?
                </p>

                <div class="flex flex-col space-y-3">
                  <button
                    onClick={() => setShowSetNewGoal(true)}
                    class="btn-primary w-full py-3 flex items-center justify-center space-x-2"
                  >
                    <span>Új cél megadása</span>
                  </button>

                  <button
                    onClick={onClose}
                    class="btn-secondary w-full py-3"
                  >
                    Bezárás
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Set New Goal View */}
              <div class="flex justify-between items-center mb-4">
                <h2 class="heading-2">Új cél beállítása</h2>
                <button
                  onClick={() => setShowSetNewGoal(false)}
                  class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div class="mb-6">
                <label class="label">
                  Új célsúly (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newGoalWeight}
                  onInput={e => setNewGoalWeight(parseFloat((e.target as HTMLInputElement).value) || 0)}
                  class="input-field"
                  min="30"
                  max="300"
                />
                <p class="text-xs mt-2 text-tertiary">
                  Add meg az új célsúlyodat, amit el szeretnél érni
                </p>
              </div>

              <div class="flex space-x-3">
                <button
                  onClick={() => setShowSetNewGoal(false)}
                  class="btn-secondary flex-1"
                >
                  Vissza
                </button>
                <button
                  onClick={updateGoalWeight}
                  class="btn-primary flex-1"
                >
                  Mentés
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
