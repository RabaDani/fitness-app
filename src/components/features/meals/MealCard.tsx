import { h } from 'preact';
import { Trash2 } from 'lucide-preact';
import { Meal } from '../../../types';

interface MealCardProps {
  meal: Meal;
  onRemove: () => void;
}

/**
 * Individual meal card with nutritional info and remove button
 * Displays meal details in a clean, readable format
 * @param meal - Meal to display
 * @param onRemove - Callback when remove button is clicked
 */
export function MealCard({ meal, onRemove }: MealCardProps) {
  return (
    <div class="card-list-item flex justify-between items-center">
      <div class="flex items-center space-x-3 flex-1">
        {meal.image && (
          <img
            src={meal.image}
            alt={meal.name}
            class="w-10 h-10 rounded object-cover flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <div>
          <p class="text-primary font-medium text-lg">
            {meal.name}
          </p>
          <p class="text-secondary text-sm">
            {meal.amount}g
          </p>
          <p class="text-tertiary text-xs mt-1">
            F: {meal.protein}g | SzH: {meal.carbs}g | Zs: {meal.fat}g
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <div class="text-right">
          <p class="text-accent text-2xl font-bold">
            {meal.calories}
          </p>
          <p class="text-secondary text-xs">kcal</p>
        </div>
        <button onClick={onRemove} class="btn-icon-danger hidden lg:flex">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
