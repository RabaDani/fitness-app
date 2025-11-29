import { Heart } from 'lucide-preact';
import { Food } from '../../../types';
import { useSettings } from '../../../context/SettingsContext';
import { FoodListItem } from './FoodListItem';

interface FavoritesFoodTabProps {
  favorites: Food[];
  selectedFood: Food | null;
  onSelectFood: (food: Food) => void;
  onToggleFavorite: (food: Food, e: Event) => void;
}

/**
 * Favorites tab content for food search modal
 * Displays user's favorite foods with empty state
 */
export function FavoritesFoodTab({
  favorites,
  selectedFood,
  onSelectFood,
  onToggleFavorite
}: FavoritesFoodTabProps) {
  const { darkMode } = useSettings();

  if (favorites.length === 0) {
    return (
      <div class="text-center py-12">
        <Heart size={40} class={`mx-auto mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
        <p class="text-secondary text-sm">Még nincs kedvenc étel</p>
        <p class="text-tertiary text-xs mt-1">
          Keress rá egy ételre és add hozzá a kedvencekhez!
        </p>
      </div>
    );
  }

  return (
    <div class="space-y-2 max-h-80 overflow-y-auto">
      {favorites.map(food => (
        <FoodListItem
          key={food.id}
          food={food}
          isSelected={selectedFood?.id === food.id}
          isFavorite={true}
          onClick={() => onSelectFood(food)}
          onToggleFavorite={(e) => onToggleFavorite(food, e)}
          variant="favorite"
        />
      ))}
    </div>
  );
}
