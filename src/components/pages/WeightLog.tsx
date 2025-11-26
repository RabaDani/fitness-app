import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Plus, TrendingDown, TrendingUp, Scale } from 'lucide-preact';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useProfile } from '../../context/ProfileContext';
import { useData } from '../../context/DataContext';
import { useSettings } from '../../context/SettingsContext';
import { ConfirmationModal, SwipeableItem } from '../shared';
import { WeightEntryCard, AddWeightModal, GoalReachedModal } from '../features/weight';
import { BMIDisplay } from '../features/profile/BMIDisplay';
import { calculateBMI } from '../../utils/calculations';
import { getChartColors } from '../../utils/chartColors';

/**
 * Weight tracking component for monitoring weight progress over time
 * Shows current weight, goal, progress, and historical chart
 */
export function WeightLog() {
  const { profile } = useProfile();
  const { weightHistory, setWeightHistory } = useData();
  const { showSuccess } = useSettings();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGoalReachedModal, setShowGoalReachedModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  if (!profile) return null;

  // Get latest weight
  const latestWeight = weightHistory.length > 0
    ? [...weightHistory].sort((a, b) => b.date.localeCompare(a.date))[0].weight
    : profile.weight;

  // Calculate progress using manual goal weight
  const startWeight = profile.weight;
  const targetWeight = profile.goalWeight;

  const weightChange = latestWeight - startWeight;
  const progressPercent = targetWeight === startWeight
    ? 0
    : Math.abs(weightChange / (targetWeight - startWeight) * 100);

  // Calculate BMI values
  const currentBMI = calculateBMI(latestWeight, profile.height);
  const goalBMI = calculateBMI(targetWeight, profile.height);

  /**
   * Show confirmation modal for weight entry deletion (desktop)
   * @param date - Date of entry to remove
   */
  const removeEntry = (date: string): void => {
    setEntryToDelete(date);
  };

  /**
   * Delete weight entry directly without confirmation (mobile swipe)
   * @param date - Date of entry to remove
   */
  const deleteEntryDirectly = (date: string): void => {
    const entry = weightHistory.find(e => e.date === date);
    const historyBeforeDelete = [...weightHistory];

    setWeightHistory(weightHistory.filter(e => e.date !== date));

    if (entry) {
      showSuccess('Súlymérés törölve', () => {
        setWeightHistory(historyBeforeDelete);
      });
    }
  };

  /**
   * Confirm and delete the weight entry
   */
  const confirmDelete = (): void => {
    if (entryToDelete) {
      const historyBeforeDelete = [...weightHistory];

      setWeightHistory(weightHistory.filter(e => e.date !== entryToDelete));
      setEntryToDelete(null);

      showSuccess('Súlymérés törölve', () => {
        setWeightHistory(historyBeforeDelete);
      });
    }
  };

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="heading-1">Súly Követés</h1>
        <button
          onClick={() => setShowAddModal(true)}
          class="btn-primary hidden lg:flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Súly rögzítése</span>
        </button>
      </div>


      {/* Current weight & progress cards */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="card">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-secondary">Jelenlegi súly</p>
            <Scale size={24} class="text-indigo-600" />
          </div>
          <p class="text-4xl font-bold text-primary">{latestWeight} kg</p>
        </div>

        <div class="card">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-secondary">Változás</p>
            {weightChange < 0 ? (
              <TrendingDown size={24} class="text-green-600" />
            ) : (
              <TrendingUp size={24} class="text-orange-600" />
            )}
          </div>
          <p class={`text-4xl font-bold ${weightChange < 0 ? 'text-green-600' : 'text-orange-600'}`}>
            {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
          </p>
        </div>

         {/* BMI Display */}
        <div class="card">
          <BMIDisplay
            currentBMI={currentBMI}
            goalBMI={goalBMI}
            showComparison={true}
          />
        </div>

        <div class="card">
          <p class="text-sm mb-2 text-secondary">Cél súly</p>
          <p class="text-4xl font-bold text-primary">{targetWeight} kg</p>
          <div class="mt-2 w-full rounded-full h-2 bg-gray-200 dark:bg-gray-700">
            <div
              class={`h-2 rounded-full
              transition-all ${progressPercent > 100 ? 'bg-green-400' : progressPercent > 80 ? 'bg-gradient-to-r from-indigo-600 to-green-400' : 'bg-indigo-600'}
              `}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            ></div>
          </div>
          <p class="text-xs mt-1 text-secondary">{progressPercent.toFixed(0)}% elérve</p>
        </div>


      </div>

      {/* Weight chart and history side by side on desktop */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight chart */}
        {weightHistory.length > 0 && (
          <div class="card">
            <h2 class="heading-2 mb-4">Súly Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={[...weightHistory]
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map(entry => ({
                    date: new Date(entry.date).toLocaleDateString('hu-HU', {
                      month: 'short',
                      day: 'numeric'
                    }),
                    weight: entry.weight
                  }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().grid} />
                <XAxis dataKey="date" stroke={getChartColors().axis} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke={getChartColors().axis} />
                <Tooltip contentStyle={getChartColors().tooltip} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#6366f1"
                  strokeWidth={3}
                  name="Súly (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Weight history list */}
        <div class="card">
          <h2 class="heading-2 mb-4">Mérési Napló</h2>
          {weightHistory.length > 0 ? (
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
              {[...weightHistory]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map(entry => (
                  <SwipeableItem
                    key={entry.date}
                    onDelete={() => deleteEntryDirectly(entry.date)}
                  >
                    <WeightEntryCard entry={entry} onRemove={() => removeEntry(entry.date)} />
                  </SwipeableItem>
                ))}
            </div>
          ) : (
            <div class="text-center py-12">
              <Scale size={48} class="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p class="mb-3 text-secondary">
                Még nincs rögzített súlymérés
              </p>
              <p class="text-sm mb-4 text-secondary">
                Kezdd el követni a súlyodat a célod eléréséhez!
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                class="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                + Súly rögzítése
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button - Mobile only */}
      <button
        onClick={() => setShowAddModal(true)}
        class="lg:hidden fixed bottom-24 right-4 w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg flex items-center justify-center z-40 transition-all active:scale-90 hover:scale-105"
        aria-label="Súly rögzítése"
      >
        <Plus size={28} class="text-white" strokeWidth={2.5} />
      </button>

      {showAddModal && (
        <AddWeightModal
          onClose={() => setShowAddModal(false)}
          onGoalReached={() => setShowGoalReachedModal(true)}
        />
      )}

      {showGoalReachedModal && (
        <GoalReachedModal onClose={() => setShowGoalReachedModal(false)} />
      )}

      {entryToDelete && (
        <ConfirmationModal
          title="Súlymérés törlése"
          message="Biztosan törölni szeretnéd ezt a súlymérést?"
          details={(() => {
            const entry = weightHistory.find(e => e.date === entryToDelete);
            if (!entry) return '';
            const formattedDate = new Date(entry.date).toLocaleDateString('hu-HU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            return entry.note
              ? `${formattedDate} - ${entry.weight} kg\n${entry.note}`
              : `${formattedDate} - ${entry.weight} kg`;
          })()}
          onConfirm={confirmDelete}
          onCancel={() => setEntryToDelete(null)}
          confirmText="Törlés"
          cancelText="Mégse"
        />
      )}
    </div>
  );
};
