import { h } from 'preact';
import { TrendingDown, TrendingUp, Minus, Flame } from 'lucide-preact';

interface CaloriePreviewProps {
  currentCalories?: number;
  newCalories: number;
  bmr?: number;
  showComparison?: boolean;
}

/**
 * Calorie display with optional comparison mode
 * - Comparison mode: shows old vs new with trend indicator
 * - Single value mode: shows just the calorie value (optionally with BMR)
 */
export function CaloriePreview({
  currentCalories,
  newCalories,
  bmr,
  showComparison = true
}: CaloriePreviewProps) {
  const getTrendIcon = () => {
    if (!currentCalories) return null;
    if (newCalories > currentCalories) {
      return <TrendingUp size={20} class="text-green-600" />;
    } else if (newCalories < currentCalories) {
      return <TrendingDown size={20} class="text-orange-600" />;
    }
    return <Minus size={20} class="text-gray-600" />;
  };

  // Single value mode
  if (!showComparison || currentCalories === undefined) {
    return (
      <div class="card-preview-orange-lg">
        <h3 class="text-sm font-semibold mb-3 flex items-center space-x-1 text-primary">
          <Flame size={16} class="text-orange-500" />
          <span>Napi Kalória Igény</span>
        </h3>
        <div class="text-center">
          <p class="text-4xl font-bold text-primary">
            {newCalories}
          </p>
          <p class="text-sm mt-1 text-secondary">
            kcal/nap
          </p>
          {bmr !== undefined && (
            <p class="text-xs mt-2 text-tertiary">
              BMR: {bmr.toFixed(0)} kcal
            </p>
          )}
        </div>
      </div>
    );
  }

  // Comparison mode
  return (
    <div class="card-preview-orange">
      <h3 class="text-xs font-semibold mb-2 text-primary">
        Napi kalória
      </h3>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs text-tertiary">Régi</p>
          <p class="text-base font-semibold text-secondary">
            {currentCalories}
          </p>
        </div>
        <div class="px-2">
          {getTrendIcon()}
        </div>
        <div class="text-right">
          <p class="text-xs text-tertiary">Új</p>
          <p class="text-2xl font-bold text-primary">
            {newCalories}
          </p>
        </div>
      </div>
    </div>
  );
}
