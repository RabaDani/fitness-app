import { h } from 'preact';
import { Meal } from '../../../types';
import { mealTypeLabels } from '../../../utils/constants';

interface MealSummaryCardProps {
  meal: Meal;
}

/**
 * @param meal - Meal object with nutritional information
 */
export function MealSummaryCard({ meal }: MealSummaryCardProps) {
  return (
    <div class="card-secondary flex justify-between items-center">
      <div>
        <p class="text-primary font-medium">{meal.name}</p>
        <p class="text-secondary text-sm">
          {mealTypeLabels[meal.mealType]} - {meal.amount}g
        </p>
      </div>
      <div class="text-right">
        <p class="font-semibold text-indigo-600">{meal.calories} kcal</p>
        <p class="text-secondary text-xs">
          F: {meal.protein}g | SzH: {meal.carbs}g | Zs: {meal.fat}g
        </p>
      </div>
    </div>
  );
}
