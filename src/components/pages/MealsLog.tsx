import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Plus, UtensilsCrossed, Sparkles } from 'lucide-preact';
import { Meal } from '../../types';
import { useData } from '../../context/DataContext';
import { useSettings } from '../../context/SettingsContext';
import { MealCard, FoodSearchModal } from '../features/meals';
import { ConfirmationModal, SwipeableItem, FloatingActionButton, EmptyState } from '../shared';
import { mealTypeLabels } from '../../utils/constants/ui';

/**
 * Meals log view for adding and managing daily meals
 * Organizes meals by type (breakfast, lunch, dinner, snack)
 */
export function MealsLog() {
  const { dailyMeals, setDailyMeals } = useData();
  const { showSuccess } = useSettings();
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

  // Check if there are no meals at all
  const hasNoMeals = dailyMeals.length === 0;

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

      {hasNoMeals ? (
        /* Empty state when no meals logged */
        <div class="card">
          <EmptyState
            icon={<Sparkles size={48} class="text-green-600 dark:text-green-400" />}
            title="Kezdd el a mai napot!"
            message="Még nem rögzítettél egyetlen ételt sem ma. Kezdd el nyomon követni az étkezéseidet, és érj el célokat könnyedén!"
            action={{
              label: 'Első étel hozzáadása',
              onClick: () => setShowAddModal(true)
            }}
          />
        </div>
      ) : (
        /* Grid layout for meal types on desktop */
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
                  <EmptyState
                    icon={<UtensilsCrossed size={40} class="text-gray-400 dark:text-gray-500" />}
                    title="Nincs étel ebben az étkezésben"
                    message="Adj hozzá ételt, hogy nyomon kövesd a kalóriákat és makrókat!"
                    action={{
                      label: 'Étel hozzáadása',
                      onClick: () => {
                        setSelectedMealType(type.id);
                        setShowAddModal(true);
                      }
                    }}
                  />
                )
                }
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Button - Mobile only */}
      <FloatingActionButton
        onClick={() => setShowAddModal(true)}
        aria-label="Étel hozzáadása"
      />

      {showAddModal && (
        <FoodSearchModal
          onClose={() => setShowAddModal(false)}
          mealType={selectedMealType}
          setMealType={setSelectedMealType}
        />
      )}

      {mealToDelete !== null && (
        <ConfirmationModal
          title="Étel törlése"
          message="Biztosan törölni szeretnéd ezt az ételt?"
          details={`${dailyMeals[mealToDelete].name} - ${dailyMeals[mealToDelete].calories} kcal`}
          onConfirm={confirmDelete}
          onCancel={() => setMealToDelete(null)}
          confirmText="Törlés"
          cancelText="Mégse"
        />
      )}
    </div>
  );
};
