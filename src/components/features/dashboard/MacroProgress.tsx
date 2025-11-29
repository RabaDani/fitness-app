import { useSettings } from '../../../context/SettingsContext';

interface MacroProgressProps {
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}

/**
 * Macro progress bar component
 * Shows current vs goal with a visual progress bar
 * @param label - Macro nutrient name (e.g., "Fehérje", "Szénhidrát")
 * @param current - Current amount consumed
 * @param goal - Daily goal amount
 * @param unit - Unit of measurement (e.g., "g")
 * @param color - Tailwind color class for the progress bar
 */
export function MacroProgress({
  label,
  current,
  goal,
  unit,
  color
}: MacroProgressProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const { darkMode } = useSettings();

  return (
    <div>
      <div class="text-secondary flex justify-between text-sm mb-1">
        <span class="font-medium">{label}</span>
        <span class="text-secondary">
          {current}
          {unit} / {goal}
          {unit}
        </span>
      </div>
      <div class={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3`}>
        <div
          class={`${color} h-3 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
