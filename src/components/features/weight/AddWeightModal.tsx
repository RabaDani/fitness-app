import { h } from 'preact';
import { useState } from 'preact/hooks';
import { WeightEntry } from '../../../types';
import { useAppContext } from '../../../context/AppContext';
import { getTodayString } from '../../../utils/dateHelpers';
import { ModalWrapper, ModalHeader, ModalFooter } from '../../shared';

interface AddWeightModalProps {
  onClose: () => void;
  onGoalReached: () => void;
}

/**
 * Modal for adding new weight entries
 * @param onClose - Callback to close the modal
 * @param onGoalReached - Callback when weight goal is reached
 */
export function AddWeightModal({ onClose, onGoalReached }: AddWeightModalProps) {
  const { weightHistory, setWeightHistory, profile, darkMode } = useAppContext();
  const today = getTodayString();

  // Get the latest weight measurement to pre-fill
  const latestWeight = weightHistory.length > 0
    ? [...weightHistory].sort((a, b) => b.date.localeCompare(a.date))[0].weight
    : profile?.weight || 70;

  const [date, setDate] = useState(today);
  const [weight, setWeight] = useState(latestWeight);
  const [note, setNote] = useState('');

  /**
   * Add new weight entry and check if goal is reached
   */
  const addEntry = (): void => {
    if (!profile) return;

    const newEntry: WeightEntry = {
      date,
      weight,
      note: note.trim() || undefined
    };

    // Remove existing entry for the same date if exists
    const updatedHistory = weightHistory.filter(entry => entry.date !== date);
    setWeightHistory([...updatedHistory, newEntry]);

    // Check if goal is reached (only for lose/gain, not maintain)
    let goalReached = false;
    if (profile.goal === 'lose') {
      goalReached = weight <= profile.goalWeight;
    } else if (profile.goal === 'gain') {
      goalReached = weight >= profile.goalWeight;
    }

    onClose();

    if (goalReached) {
      onGoalReached();
    }
  };

  return (
    <ModalWrapper maxWidth="md" onBackdropClick={onClose}>
      <div>
        <ModalHeader title="Súly rögzítése" onClose={onClose} />

        <div class="p-6">

          <div class="space-y-4">
            {/* Date input */}
            <div>
              <label class="label">
                Dátum
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate((e.target as HTMLInputElement).value)}
                max={today}
                class="input-field"
              />
            </div>

            {/* Weight input */}
            <div>
              <label class="label">
                Súly (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onInput={e => setWeight(parseFloat((e.target as HTMLInputElement).value) || 0)}
                class="input-field"
                min="30"
                max="300"
              />
            </div>

            {/* Note input */}
            <div>
              <label class="label">
                Megjegyzés (opcionális)
              </label>
              <input
                type="text"
                value={note}
                onInput={e => setNote((e.target as HTMLInputElement).value)}
                placeholder="pl. reggel mérés, edzés után..."
                class="input-field"
              />
            </div>
          </div>
        </div>

        <ModalFooter
          onCancel={onClose}
          onConfirm={addEntry}
          cancelText="Mégse"
          confirmText="Mentés"
        />
      </div>
    </ModalWrapper>
  );
}
