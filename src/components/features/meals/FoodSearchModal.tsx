import { useState, useRef } from 'preact/hooks';
import { Search, Heart } from 'lucide-preact';
import { Food, Meal } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useSettings } from '../../../context/SettingsContext';
import { SelectedFoodDetails } from './SelectedFoodDetails';
import { FoodSearchTab } from './FoodSearchTab';
import { FavoritesFoodTab } from './FavoritesFoodTab';
import { useFoodSearch } from '../../../hooks/useFoodSearch';
import { ModalWrapper, ModalHeader, ModalFooter } from '../../shared';

interface FoodSearchModalProps {
  onClose: () => void;
  mealType: Meal['mealType'];
  setMealType: (type: Meal['mealType']) => void;
}

/**
 * Modal for adding new meals with tabbed interface (Search | Favorites)
 * Refactored with extracted tab components and search hook
 */
export function FoodSearchModal({
  onClose,
  mealType,
  setMealType
}: FoodSearchModalProps) {
  const { dailyMeals, setDailyMeals } = useData();
  const { foodsDB, setFoodsDB, favorites, setFavorites, showSuccess } = useSettings();
  const [activeTab, setActiveTab] = useState<'search' | 'favorites'>('search');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [amount, setAmount] = useState(100);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Use custom search hook
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    searchError,
    handleSearch
  } = useFoodSearch(foodsDB, setFoodsDB);

  /**
   * Add selected food to daily meals
   */
  const addMeal = (): void => {
    if (!selectedFood || amount <= 0) return;

    const newMeal: Meal = {
      id: selectedFood.id,
      name: selectedFood.name,
      mealType,
      amount,
      calories: Math.round((selectedFood.calories * amount) / selectedFood.serving),
      protein: Math.round(((selectedFood.protein * amount) / selectedFood.serving) * 10) / 10,
      carbs: Math.round(((selectedFood.carbs * amount) / selectedFood.serving) * 10) / 10,
      fat: Math.round(((selectedFood.fat * amount) / selectedFood.serving) * 10) / 10,
      timestamp: new Date().toISOString(),
      image: selectedFood.image
    };

    setDailyMeals([...dailyMeals, newMeal]);
    showSuccess(`${selectedFood.name} hozzáadva`);
    onClose();
  };

  /**
   * Toggle food in favorites list
   */
  const toggleFavorite = (food: Food, e: Event): void => {
    e.stopPropagation();
    const isFavorite = favorites.some(f => f.id === food.id);

    if (isFavorite) {
      setFavorites(favorites.filter(f => f.id !== food.id));
      showSuccess(`${food.name} eltávolítva a kedvencekből`);
    } else {
      setFavorites([...favorites, food]);
      showSuccess(`${food.name} hozzáadva a kedvencekhez`);
    }
  };

  /**
   * Select food from list
   */
  const selectFood = (food: Food): void => {
    setSelectedFood(food);
    setAmount(food.serving);
  };

  return (
    <ModalWrapper
      maxWidth={selectedFood ? '3xl' : 'xl'}
      onBackdropClick={onClose}
    >
      <div class="max-h-[90vh] flex flex-col transition-all duration-500">
        <ModalHeader
          title="Étel hozzáadása"
          onClose={onClose}
        />

        {/* Scrollable Content */}
        <div class="modal-body">
          {/* Meal type selector */}
          <div class="mb-3">
            <label class="label-sm text-secondary">
              Étkezés típusa
            </label>
            <select
              value={mealType}
              onChange={e => setMealType((e.target as HTMLSelectElement).value as Meal['mealType'])}
              class="select-field"
            >
              <option value="breakfast">Reggeli</option>
              <option value="lunch">Ebéd</option>
              <option value="dinner">Vacsora</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          {/* Tabs */}
          <div class="flex mb-3 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('search')}
              class={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                activeTab === 'search'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <div class="flex items-center justify-center space-x-1.5">
                <Search size={16} />
                <span>Keresés</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              class={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                activeTab === 'favorites'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <div class="flex items-center justify-center space-x-1.5">
                <Heart size={16} />
                <span>Kedvencek ({favorites.length})</span>
              </div>
            </button>
          </div>

          {/* 2-Column Grid: List | Details */}
          <div class={`grid gap-3 ${selectedFood ? 'grid-cols-1 lg:grid-cols-[1fr,1fr]' : 'grid-cols-1'}`}>
            {/* Left Column: Tab Content */}
            <div>
              {activeTab === 'search' && (
                <FoodSearchTab
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  searchResults={searchResults}
                  isSearching={isSearching}
                  searchError={searchError}
                  handleSearch={handleSearch}
                  selectedFood={selectedFood}
                  favorites={favorites}
                  onSelectFood={selectFood}
                  onToggleFavorite={toggleFavorite}
                  searchInputRef={searchInputRef}
                />
              )}

              {activeTab === 'favorites' && (
                <FavoritesFoodTab
                  favorites={favorites}
                  selectedFood={selectedFood}
                  onSelectFood={selectFood}
                  onToggleFavorite={toggleFavorite}
                />
              )}
            </div>

            {/* Right Column: Selected Food Details */}
            {selectedFood && (
              <div class="lg:border-l border-gray-300 dark:border-gray-600 lg:pl-3">
                <SelectedFoodDetails
                  food={selectedFood}
                  amount={amount}
                  onAmountChange={setAmount}
                />
              </div>
            )}
          </div>
        </div>

        <ModalFooter
          onCancel={onClose}
          onConfirm={addMeal}
          cancelText="Mégse"
          confirmText="Hozzáadás"
          disabled={!selectedFood || amount <= 0}
        />
      </div>
    </ModalWrapper>
  );
}
