import { useMemo } from 'preact/hooks';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useProfile } from '../../context/ProfileContext';
import { useData } from '../../context/DataContext';
import { StreakCounter, AchievementsBadge } from '../features/gamification';
import { MealSummaryCard, MacroProgress } from '../features/dashboard';
import { calculateTotalNutrition, calculateTotalCaloriesBurned } from '../../utils/calculations';
import { MACRO_CONSTANTS } from '../../utils/constants';

/**
 * Dashboard view showing daily calorie and macro summary
 * Displays progress bars, pie charts, meal summaries, and exercise tracking
 */
export function Dashboard() {
  const { profile } = useProfile();
  const { dailyMeals, dailyExercises } = useData();

  if (!profile) return null;

  /**
   * Calculate total nutritional values for all meals today
   */
  const totals = useMemo(() => calculateTotalNutrition(dailyMeals), [dailyMeals]);

  /**
   * Calculate total calories burned from exercises
   */
  const caloriesBurned = useMemo(() => calculateTotalCaloriesBurned(dailyExercises), [dailyExercises]);

  /**
   * Calculate derived values - memoized to avoid recalculation on every render
   */
  const netCalories = useMemo(() => totals.calories - caloriesBurned, [totals.calories, caloriesBurned]);
  const caloriesLeft = useMemo(() => profile.dailyCalories - netCalories, [profile.dailyCalories, netCalories]);
  const progress = useMemo(() => (netCalories / profile.dailyCalories) * 100, [netCalories, profile.dailyCalories]);

  /**
   * Data for macro pie chart - memoized to avoid recreating array on every render
   */
  const macroData = useMemo(() => [
    { name: 'Fehérje', value: totals.protein * MACRO_CONSTANTS.CALORIES_PER_GRAM_PROTEIN, fill: '#3b82f6' },
    { name: 'Szénhidrát', value: totals.carbs * MACRO_CONSTANTS.CALORIES_PER_GRAM_CARBS, fill: '#10b981' },
    { name: 'Zsír', value: totals.fat * MACRO_CONSTANTS.CALORIES_PER_GRAM_FAT, fill: '#f59e0b' }
  ], [totals.protein, totals.carbs, totals.fat]);

  return (
    <div class="space-y-6">
      {/* Header with title, achievements badge, and theme toggle */}
      <div class="flex justify-between items-center">
        <h1 class="heading-1">
          Mai Összesítő
        </h1>
          <AchievementsBadge />
      </div>

      {/* Calorie progress card and Streak counter in same row */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie progress card with net calories */}
        <div class="card">
          <div class="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p class="text-sm text-secondary">Bevitt</p>
              <p class="text-2xl font-bold text-green-600">+{totals.calories}</p>
              <p class="text-xs text-secondary">kcal</p>
            </div>
            <div>
              <p class="text-sm text-secondary">Elégetett</p>
              <p class="text-2xl font-bold text-orange-600">-{caloriesBurned}</p>
              <p class="text-xs text-secondary">kcal</p>
            </div>
            <div>
              <p class="text-sm text-secondary">Nettó</p>
              <p class="text-3xl font-bold text-indigo-600">{netCalories}</p>
              <p class="text-xs text-secondary">kcal</p>
            </div>
          </div>

          <div class="mb-2">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-secondary">Napi cél</span>
              <span class="font-semibold text-primary">
                {profile.dailyCalories} kcal
              </span>
            </div>
            <div class="w-full rounded-full h-4 bg-gray-200 dark:bg-gray-700">
              <div
                class={`h-4 rounded-full transition-all ${
                  progress > 100 ? 'bg-red-500' : progress > 90 ? 'bg-orange-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>

          <p class="text-center text-secondary">
            {caloriesLeft > 0
              ? `Még ${caloriesLeft} kcal van hátra`
              : `${Math.abs(caloriesLeft)} kcal túllépés`}
          </p>
        </div>

        {/* Streak counter */}
        <StreakCounter />
      </div>

      {/* Macro distribution */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card">
          <h2 class="heading-2 mb-4">
            Makró Eloszlás
          </h2>
          {totals.calories > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(Number(percent) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p class="text-center py-12 text-secondary">
              Még nincs bevitt étel ma
            </p>
          )}
        </div>

        <div class="card">
          <h2 class="heading-2 mb-4">
            Makrók Részletesen
          </h2>
          <div class="space-y-4">
            <MacroProgress
              label="Fehérje"
              current={totals.protein}
              goal={profile.macros.protein}
              unit="g"
              color="bg-blue-500"
            />
            <MacroProgress
              label="Szénhidrát"
              current={totals.carbs}
              goal={profile.macros.carbs}
              unit="g"
              color="bg-green-500"
            />
            <MacroProgress
              label="Zsír"
              current={totals.fat}
              goal={profile.macros.fat}
              unit="g"
              color="bg-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Today's meals summary */}
      <div class="card">
        <h2 class="heading-2 mb-4">
          Mai Étkezések
        </h2>
        {dailyMeals.length > 0 ? (
          <div class="space-y-2">
            {dailyMeals.map((meal, idx) => (
              <MealSummaryCard key={idx} meal={meal} />
            ))}
          </div>
        ) : (
          <div class="text-center py-12">
            <p class="mb-3 text-secondary">
              Még nem adtál hozzá ételt ma
            </p>
            <p class="text-sm text-secondary">
              Menj az Étkezések fülre és kezdd el rögzíteni az ételeid!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
