interface NutritionCardProps {
  title: string;
  value: number;
  unit: string;
  color: string;
}

/**
 * Nutrition card component for displaying key metrics
 * Used for showing calorie and macro goals/values
 * @param title - Card title
 * @param value - Numeric value to display
 * @param unit - Unit of measurement
 * @param color - Tailwind color class for styling (light mode background)
 */
export function NutritionCard({
  title,
  value,
  unit,
  color
}: NutritionCardProps) {
  return (
    <div class={`rounded-lg p-4 ${color} dark:bg-gray-700`}>
      <p class="text-sm text-secondary">{title}</p>
      <p class="text-3xl font-bold text-primary">{value}{unit}</p>
    </div>
  );
}
