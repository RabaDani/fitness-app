import { h } from 'preact';
import { Heart } from 'lucide-preact';
import { Food } from '../../../types';
import { FoodImage } from './FoodImage';
import { useAppContext } from '../../../context/AppContext';

interface FoodListItemProps {
  food: Food;
  isSelected: boolean;
  isFavorite: boolean;
  onClick: () => void;
  onToggleFavorite: (e: Event) => void;
  variant?: 'default' | 'favorite';
}

/**
 * Reusable food list item component
 * Displays food info with image, nutrition, and favorite toggle
 */
export function FoodListItem({
  food,
  isSelected,
  isFavorite,
  onClick,
  onToggleFavorite,
  variant = 'default'
}: FoodListItemProps) {
  const { darkMode } = useAppContext();

  const getCardClass = () => {
    if (isSelected) {
      return 'card-list-item-selected';
    }
    return 'card-list-item cursor-pointer';
  };

  return (
    <div
      onClick={onClick}
      class={getCardClass()}
    >
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-3 flex-1">
          <div class={`w-12 h-12 rounded flex items-center justify-center flex-shrink-0 ${
            darkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <FoodImage food={food} size={12} iconSize={24} />
          </div>
          <div>
            <p class="text-primary font-medium">
              {food.name}
            </p>
            <p class="text-secondary text-sm">
              {food.calories} kcal / {food.serving}g
            </p>
          </div>
        </div>
        <button
          onClick={onToggleFavorite}
          class="btn-icon"
        >
          <Heart
            size={20}
            class={
              isFavorite
                ? 'fill-red-500 text-red-500'
                : darkMode ? 'text-gray-400' : 'text-gray-400'
            }
          />
        </button>
      </div>
    </div>
  );
}
