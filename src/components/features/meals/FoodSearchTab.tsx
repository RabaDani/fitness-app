import { h } from 'preact';
import { Search } from 'lucide-preact';
import { Food } from '../../../types';
import { FoodListItem } from './FoodListItem';
import { UI_CONSTANTS } from '../../../utils/constants/ui';

interface FoodSearchTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: Food[];
  isSearching: boolean;
  searchError: string | null;
  handleSearch: () => Promise<void>;
  selectedFood: Food | null;
  favorites: Food[];
  onSelectFood: (food: Food) => void;
  onToggleFavorite: (food: Food, e: Event) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

/**
 * Search tab content for food search modal
 * Handles search input, results display, and loading/error states
 */
export function FoodSearchTab({
  searchTerm,
  setSearchTerm,
  searchResults,
  isSearching,
  searchError,
  handleSearch,
  selectedFood,
  favorites,
  onSelectFood,
  onToggleFavorite,
  searchInputRef
}: FoodSearchTabProps) {
  return (
    <div class="space-y-3">
      {/* Compact Search box */}
      <div>
        <label class="label-sm text-secondary">
          Étel keresése
        </label>
        <div class="flex space-x-2">
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onInput={e => setSearchTerm((e.target as HTMLInputElement).value)}
            onKeyPress={e => e.key === 'Enter' && handleSearch()}
            placeholder={UI_CONSTANTS.PLACEHOLDER.FOOD_SEARCH}
            class="input-field-sm flex-1"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            class="btn-primary-sm flex items-center space-x-1.5"
          >
            <Search size={16} />
            <span>{isSearching ? 'Keresés...' : 'Keresés'}</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isSearching && (
        <div class="flex justify-center items-center py-12">
          <div class="spinner-md"></div>
          <p class="text-secondary ml-2 text-sm">Keresés...</p>
        </div>
      )}

      {/* Error state */}
      {searchError && (
        <div class="alert-error">
          <p class="text-sm">{searchError}</p>
        </div>
      )}

      {/* Search results */}
      {!isSearching && searchResults.length > 0 && (
        <div>
          <p class="text-secondary text-xs font-medium mb-2">Találatok:</p>
          <div class="space-y-2 max-h-80 overflow-y-auto">
            {searchResults.map(food => (
              <FoodListItem
                key={food.id}
                food={food}
                isSelected={selectedFood?.id === food.id}
                isFavorite={favorites.some(f => f.id === food.id)}
                onClick={() => onSelectFood(food)}
                onToggleFavorite={(e) => onToggleFavorite(food, e)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
