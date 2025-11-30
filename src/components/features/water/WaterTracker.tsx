import { Droplet, Plus, Minus, RotateCcw } from 'lucide-preact';
import { Glass } from './Glass';

interface WaterTrackerProps {
  currentIntake: number; // Current water intake in ml
  dailyGoal: number; // Daily goal in ml
  onAddWater: (amount: number) => void;
  onReset: () => void;
}

/**
 * Water Tracker Component with Visual Glass Representation
 * Displays daily water intake progress with visual glasses
 * Display unit: L (liters), Internal storage: ml
 */
export function WaterTracker({ currentIntake, dailyGoal, onAddWater, onReset }: WaterTrackerProps) {
  // 1 glass = 0.25 L (250ml)
  const totalGlasses = Math.ceil(dailyGoal / 250);
  const filledAmount = currentIntake / dailyGoal; // 0 to 1+ ratio
  const halfGlassAmount = 125; // 0.5 glass = 0.125 L (125ml)

  const canSubtract = currentIntake >= halfGlassAmount;
  const isGoalReached = currentIntake >= dailyGoal;

  // Convert ml to L for display
  const currentIntakeL = currentIntake / 1000;
  const dailyGoalL = dailyGoal / 1000;

  return (
    <div class="card">
      {/* Header */}
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center space-x-2">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Droplet size={24} class="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 class="heading-2">Folyadékbevitel</h2>
            <p class="text-xs text-secondary">
              {currentIntakeL.toFixed(1)} / {dailyGoalL.toFixed(1)} L
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          class="btn-icon"
          title="Nullázás"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Visual Glass Representation with Controls */}
      <div class="mb-4">
        <div class="flex flex-col lg:flex-row items-center justify-center gap-3 mb-3">
          {/* Subtract button - desktop left side */}
          <button
            onClick={() => onAddWater(-halfGlassAmount)}
            disabled={!canSubtract}
            class="btn-secondary p-3 disabled:opacity-30 flex-shrink-0 hidden lg:block"
            title="Fél pohár levonása"
          >
            <Minus size={20} />
          </button>

          {/* Glasses container */}
          <div class="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: totalGlasses }).map((_, index) => {
              const glassStart = index / totalGlasses;
              const glassEnd = (index + 1) / totalGlasses;

              // Determine fill level for this glass
              let fillPercentage = 0;
              if (filledAmount >= glassEnd) {
                fillPercentage = 100; // Fully filled
              } else if (filledAmount > glassStart) {
                fillPercentage = ((filledAmount - glassStart) / (glassEnd - glassStart)) * 100;
              }

              // Handle glass click - fill this glass and all glasses to the left
              const handleGlassClick = () => {
                const targetGlassIndex = index + 1; // +1 because we want to include this glass
                const targetAmount = targetGlassIndex * 250; // Each glass is 250ml
                const amountToAdd = targetAmount - currentIntake;
                
                if (amountToAdd !== 0) {
                  onAddWater(amountToAdd);
                }
              };

              return (
                <button
                  key={`glass-${index}-of-${totalGlasses}`}
                  onClick={handleGlassClick}
                  class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
                  title={`${index + 1}. pohár - kattintásra feltöltés`}
                  type="button"
                >
                  <Glass fillPercentage={fillPercentage} index={index} />
                </button>
              );
            })}
          </div>

          {/* Add button - desktop right side */}
          <button
            onClick={() => onAddWater(halfGlassAmount)}
            class="btn-secondary p-3 flex-shrink-0 hidden lg:block"
            title="Fél pohár hozzáadása"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Progress text */}
        <p class="text-center text-sm text-secondary">
          {isGoalReached
            ? 'Napi cél teljesítve! 🎉'
            : `Még ${Math.ceil((dailyGoal - currentIntake) / 250)} pohár van hátra`}
        </p>
      </div>
    </div>
  );
}
