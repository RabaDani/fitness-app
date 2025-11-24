import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Plus } from 'lucide-preact';
import { Meal } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { useToastContext } from '../../hooks/useToastContext';
import { MealCard, FoodSearchModal } from '../features/meals';
import { ConfirmationModal, SwipeableItem } from '../shared';
import { mealTypeLabels } from '../../utils/constants/ui';

/**
 * Meals log view for adding and managing daily meals
 * Organizes meals by type (breakfast, lunch, dinner, snack)
 */
export function MealsLog() {
  const { dailyMeals, setDailyMeals } = useAppContext();
  const { showSuccess } = useToastContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<Meal['mealType']>('breakfast');
  const [mealToDelete, setMealToDelete] = useState<number | null>(null);

  const mealTypes: Array<{ id: Meal['mealType']; label: string }> = [
    { id: 'breakfast', label: mealTypeLabels.breakfast },
    { id: 'lunch', label: mealTypeLabels.lunch },
    { id: 'dinner', label: mealTypeLabels.dinner },
    { id: 'snack', label: mealTypeLabels.snack }
  ];

  /**
   * Show confirmation modal for meal deletion (desktop)
   * @param index - Index of meal to remove
   */
  const removeMeal = (index: number): void => {
    setMealToDelete(index);
  };

  /**
   * Delete meal directly without confirmation (mobile swipe)
   * @param index - Index of meal to remove
   */
  const deleteMealDirectly = (index: number): void => {
    const deletedMeal = dailyMeals[index];
    const mealName = deletedMeal.name;
    const mealsBeforeDelete = [...dailyMeals];

    setDailyMeals(dailyMeals.filter((_, i) => i !== index));

    // Show toast with undo option
    showSuccess(`${mealName} törölve`, () => {
      // Undo: restore all meals to previous state
      setDailyMeals(mealsBeforeDelete);
    });
  };

  /**
   * Confirm and delete the meal
   */
  const confirmDelete = (): void => {
    if (mealToDelete !== null) {
      const deletedMeal = dailyMeals[mealToDelete];
      const mealName = deletedMeal.name;
      const mealsBeforeDelete = [...dailyMeals];

      setDailyMeals(dailyMeals.filter((_, i) => i !== mealToDelete));
      setMealToDelete(null);

      // Show toast with undo option
      showSuccess(`${mealName} törölve`, () => {
        // Undo: restore all meals to previous state
        setDailyMeals(mealsBeforeDelete);
      });
    }
  };

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="heading-1">Étkezések</h1>
        <button
          onClick={() => setShowAddModal(true)}
          class="btn-primary hidden lg:flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Étel hozzáadása</span>
        </button>
      </div>

      {/* Grid layout for meal types on desktop */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mealTypes.map(type => {
          return (
            <div key={type.id} class="card">
              <h2 class="heading-2 mb-4">{type.label}</h2>
              {dailyMeals.filter(meal => meal.mealType === type.id).length > 0 ? (
                <div class="space-y-2">
                  {dailyMeals.map((meal, absoluteIndex) =>
                    meal.mealType === type.id ? (
                      <SwipeableItem
                        key={absoluteIndex}
                        onDelete={() => deleteMealDirectly(absoluteIndex)}
                      >
                        <MealCard
                          meal={meal}
                          onRemove={() => removeMeal(absoluteIndex)}
                        />
                      </SwipeableItem>
                    ) : null
                  )}
                </div>
              ) : (
                <div class="text-center py-12">
                  <p class="mb-2 text-secondary">
                    Nincs étel ebben az étkezésben
                  </p>
                  <button
                    onClick={() => {
                      setSelectedMealType(type.id);
                      setShowAddModal(true);
                    }}
                  class="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                  + Étel hozzáadása
                </button>
                </div>
          )
        }
            </div>
      );
        })}
    </div>

      {/* Floating Action Button - Mobile only */ }
  <button
    onClick={() => setShowAddModal(true)}
    class="lg:hidden fixed bottom-24 right-4 w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg flex items-center justify-center z-40 transition-all active:scale-90 hover:scale-105"
    aria-label="Étel hozzáadása"
  >
    <Plus size={28} class="text-white" strokeWidth={2.5} />
  </button>

  {
    showAddModal && (
      <FoodSearchModal
        onClose={() => setShowAddModal(false)}
        mealType={selectedMealType}
        setMealType={setSelectedMealType}
      />
    )
  }

  {
    mealToDelete !== null && (
      <ConfirmationModal
        title="Étel törlése"
        message="Biztosan törölni szeretnéd ezt az ételt?"
        details={`${dailyMeals[mealToDelete].name} - ${dailyMeals[mealToDelete].calories} kcal`}
        onConfirm={confirmDelete}
        onCancel={() => setMealToDelete(null)}
        confirmText="Törlés"
        cancelText="Mégse"
      />
    )
  }
    </div >
  );
};
