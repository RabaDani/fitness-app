import { h } from 'preact';
import { Food } from '../../../types';
import { FoodImage } from './FoodImage';
import { calculateNutrition, calculateTotalNutrition, calculatePercentage } from '../../../utils/calculations';
import { useAppContext } from '../../../context/AppContext';
import { Flame, TrendingUp } from 'lucide-preact';

interface SelectedFoodDetailsProps {
  food: Food;
  amount: number;
  onAmountChange: (amount: number) => void;
}

/**
 * Selected food details component
 * Shows food image, name, amount input, and calculated nutrition
 */
export function SelectedFoodDetails({
  food,
  amount,
  onAmountChange
}: SelectedFoodDetailsProps) {
  const { darkMode, profile, dailyMeals } = useAppContext();
  const nutrition = calculateNutrition(food, amount);

  // Calculate current daily totals
  const currentTotals = calculateTotalNutrition(dailyMeals);

  // Calculate percentages
  const caloriePercentage = calculatePercentage(nutrition.calories, profile.dailyCalories);
  const proteinPercentage = calculatePercentage(nutrition.protein, profile.macros.protein);
  const carbsPercentage = calculatePercentage(nutrition.carbs, profile.macros.carbs);
  const fatPercentage = calculatePercentage(nutrition.fat, profile.macros.fat);

  return (
    <div class="space-y-3">
      {/* Food Info */}
      <div class="card-secondary">
        <div class="flex items-start space-x-3 mb-3">
          <div class={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${
            darkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <FoodImage food={food} size={12} iconSize={24} />
          </div>
          <h3 class="text-primary text-sm font-semibold flex-1">{food.name}</h3>
        </div>

        <div>
          <label class="label-sm">
            Mennyiség (g)
          </label>
          <input
            type="number"
            value={amount}
            onInput={e => onAmountChange(parseInt((e.target as HTMLInputElement).value) || 0)}
            class="input-field-sm"
            min="1"
          />
        </div>
      </div>

      {/* Calorie Impact */}
      <div class="card-preview-orange">
        <h3 class="text-primary text-xs font-semibold mb-2 flex items-center space-x-1">
          <Flame size={14} />
          <span>Kalória hatás</span>
        </h3>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-tertiary text-xs">Ez az étel</p>
            <p class="text-2xl font-bold text-orange-600">
              {nutrition.calories}
            </p>
            <p class="text-tertiary text-xs">kcal</p>
          </div>
          <TrendingUp size={20} class="text-orange-600" />
          <div class="text-right">
            <p class="text-tertiary text-xs">Napi cél</p>
            <p class="text-primary text-base font-semibold">
              {caloriePercentage}%
            </p>
            <p class="text-tertiary text-xs">
              {profile.dailyCalories} kcal-ból
            </p>
          </div>
        </div>
      </div>

      {/* Macros */}
      <div class="card-preview-green">
        <h3 class="text-primary text-xs font-semibold mb-2">Makrók</h3>
        <div class="grid grid-cols-3 gap-2 text-xs">
          <div class="card-secondary">
            <p class="text-tertiary">Fehérje</p>
            <p class="text-primary text-base font-bold">{nutrition.protein}g</p>
            <p class="text-green-600 font-medium">{proteinPercentage}%</p>
          </div>
          <div class="card-secondary">
            <p class="text-tertiary">Szénhidrát</p>
            <p class="text-primary text-base font-bold">{nutrition.carbs}g</p>
            <p class="text-green-600 font-medium">{carbsPercentage}%</p>
          </div>
          <div class="card-secondary">
            <p class="text-tertiary">Zsír</p>
            <p class="text-primary text-base font-bold">{nutrition.fat}g</p>
            <p class="text-green-600 font-medium">{fatPercentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
