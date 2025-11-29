import { useMemo } from 'preact/hooks';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Calendar } from 'lucide-preact';
import { useProfile } from '../../context/ProfileContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../features/statistics';
import { ChartData } from '../../types';
import { dayNames } from '../../utils/constants/ui';
import { getChartColors } from '../../utils/chartColors';
import { getDateString } from '../../utils/dateHelpers';

/**
 * Statistics view with weekly charts and trends
 * Shows calorie intake and macro distribution over the last 7 days
 */
export function Statistics() {
  const { profile } = useProfile();
  const { dailyHistory, dailyMeals } = useData();

  /**
   * Generate weekly data from actual history
   */
  const weeklyData: ChartData[] = useMemo(() => {
    const today = new Date();
    const last7Days: ChartData[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = getDateString(date);

      // Find history for this date
      const historyEntry = dailyHistory.find(h => h.date === dateStr);

      // Get day name
      const dayName = dayNames[date.getDay()];

      last7Days.push({
        day: dayName,
        calories: historyEntry?.calories || 0,
        protein: historyEntry?.protein || 0,
        carbs: historyEntry?.carbs || 0,
        fat: historyEntry?.fat || 0,
        dailyCalories: profile ? profile.dailyCalories : 0,
        dailyMacros: profile ? profile.macros : { protein: 0, carbs: 0, fat: 0 }
      });
    }

    return last7Days;
  }, [dailyHistory, profile]);

  /**
   * Calculate derived statistics - memoized to avoid recalculation on every render
   */
  const todayTotal = useMemo(() => dailyMeals.reduce((sum, meal) => sum + meal.calories, 0), [dailyMeals]);
  const weeklyAverage = useMemo(() => Math.round(weeklyData.reduce((sum, d) => sum + d.calories, 0) / 7), [weeklyData]);
  const loggedDays = useMemo(() => dailyHistory.length, [dailyHistory]);

  return (
    <div class="space-y-6">
      <h1 class="heading-1">Statisztikák</h1>

      {/* Summary stats at the top */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Mai Kalória" value={todayTotal} unit="kcal" color="bg-indigo-500" />
        <StatCard title="Heti Átlag" value={weeklyAverage} unit="kcal" color="bg-green-500" />
        <StatCard title="Rögzített napok" value={loggedDays} unit="/ 30 nap" color="bg-orange-500" />
      </div>

      {/* Main charts side by side on desktop */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly calorie chart */}
        <div class="card">
          <h2 class="heading-2 mb-4 flex items-center space-x-2">
            <Calendar size={20} />
            <span>Heti Kalóriabevitel</span>
          </h2>
          {weeklyData.some(d => d.calories > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().grid} />
                <XAxis dataKey="day" stroke={getChartColors().axis} />
                <YAxis stroke={getChartColors().axis} />
                <Tooltip contentStyle={getChartColors().tooltip} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="#6366f1"
                  strokeWidth={3}
                  name="Bevitt kalória"
                />
                <Line
                  type="monotone"
                  dataKey="dailyCalories"
                  stroke="#9b9cffff"
                  strokeWidth={2}
                  strokeDasharray="15 5"
                  name="Napi cél"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div class="text-center py-12">
              <p class="mb-2 text-secondary">
                Még nincs elég adat a grafikonhoz
              </p>
              <p class="text-sm text-secondary">
                Kezdd el naplózni az étkezéseidet legalább 3 napig!
              </p>
            </div>
          )}
        </div>

        {/* Weekly macro trends */}
        <div class="card">
          <h2 class="heading-2 mb-4">Heti Makró Trendek</h2>
          {weeklyData.some(d => d.calories > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().grid} />
                <XAxis dataKey="day" stroke={getChartColors().axis} />
                <YAxis stroke={getChartColors().axis} />
                <Tooltip contentStyle={getChartColors().tooltip} />
                <Legend />
                <Bar dataKey="protein" fill="#3b82f6" name="Fehérje (g)" />
                <Bar dataKey="carbs" fill="#10b981" name="Szénhidrát (g)" />
                <Bar dataKey="fat" fill="#f59e0b" name="Zsír (g)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div class="text-center py-12">
              <p class="mb-2 text-secondary">
                Még nincs elég adat a grafikonhoz
              </p>
              <p class="text-sm text-secondary">
                Rögzíts étkezéseket az elmúlt héten!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Macro comparison: Actual vs Goal */}
      {profile && weeklyData.some(d => d.calories > 0) && (
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Protein comparison */}
          <div class="card">
            <h3 class="heading-3 mb-4 text-blue-600">Fehérje (g)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().grid} />
                <XAxis dataKey="day" hide />
                <YAxis stroke={getChartColors().axis} />
                <Tooltip contentStyle={getChartColors().tooltip} />
                <Legend />
                <Bar dataKey="dailyMacros.protein" fill="#93c5fd" name="Cél" />
                <Bar dataKey="protein" fill="#3b82f6" name="Bevitt" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Carbs comparison */}
          <div class="card">
            <h3 class="heading-3 mb-4 text-green-600">Szénhidrát (g)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().grid} />
                <XAxis dataKey="day" hide />
                <YAxis stroke={getChartColors().axis} />
                <Tooltip contentStyle={getChartColors().tooltip} />
                <Legend />
                <Bar dataKey="dailyMacros.carbs" fill="#86efac" name="Cél" />
                <Bar dataKey="carbs" fill="#10b981" name="Bevitt" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fat comparison */}
          <div class="card">
            <h3 class="heading-3 mb-4 text-orange-600">Zsír (g)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().grid} />
                <XAxis dataKey="day" hide />
                <YAxis stroke={getChartColors().axis} />
                <Tooltip contentStyle={getChartColors().tooltip} />
                <Legend />
                <Bar dataKey="dailyMacros.fat" fill="#fed7aa" name="Cél" />
                <Bar dataKey="fat" fill="#f59e0b" name="Bevitt" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
