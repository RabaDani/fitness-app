import { h } from 'preact';
import { Weight } from 'lucide-preact';

interface BMIDisplayProps {
  currentBMI: number;
  goalBMI?: number;
  showComparison?: boolean;
}

/**
 * BMI display component with category coloring
 * Can show current BMI only or comparison with goal BMI
 */
export function BMIDisplay({ currentBMI, goalBMI, showComparison = false }: BMIDisplayProps) {
  const getBMICategory = (bmi: number): { label: string; color: string } => {
    if (bmi < 18.5) return { label: 'Sovány', color: 'text-blue-600' };
    if (bmi < 25) return { label: 'Normál', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Túlsúly', color: 'text-orange-600' };
    return { label: 'Elhízás', color: 'text-red-600' };
  };

  const currentCategory = getBMICategory(currentBMI);
  const goalCategory = goalBMI ? getBMICategory(goalBMI) : null;

  return (
    <div class="card-preview-blue">
      <h3 class="text-xs font-semibold mb-2 flex items-center space-x-1 text-primary">
        <Weight size={14} />
        <span>BMI</span>
      </h3>

      {showComparison && goalCategory ? (
        <div class="grid grid-cols-2 gap-2">
          <div>
            <p class="text-xs text-tertiary">Jelenlegi</p>
            <p class="text-xl font-bold text-primary">
              {currentBMI.toFixed(1)}
            </p>
            <p class={`text-xs font-medium ${currentCategory.color}`}>
              {currentCategory.label}
            </p>
          </div>
          <div>
            <p class="text-xs text-tertiary">Cél</p>
            <p class="text-xl font-bold text-primary">
              {goalBMI.toFixed(1)}
            </p>
            <p class={`text-xs font-medium ${goalCategory.color}`}>
              {goalCategory.label}
            </p>
          </div>
        </div>
      ) : (
        <div>
          <p class="text-3xl font-bold text-primary">
            {currentBMI.toFixed(1)}
          </p>
          <p class={`text-sm font-medium mt-1 ${currentCategory.color}`}>
            {currentCategory.label}
          </p>
        </div>
      )}
    </div>
  );
}
