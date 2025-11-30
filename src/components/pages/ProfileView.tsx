import { useState } from 'preact/hooks';
import { useProfile } from '../../context/ProfileContext';
import { useData } from '../../context/DataContext';
import { useSettings } from '../../context/SettingsContext';
import { ConfirmationModal } from '../shared';
import { EditProfileModal, ProfileField, NutritionCard } from '../features/profile';
import { activityLabels, goalLabels } from '../../utils/constants/ui';
import { initialFoodsDB } from '../../utils/constants/database';

/**
 * Profile view for editing user settings and viewing goals
 * Allows users to update their profile and recalculate macro targets
 */
export function ProfileView() {
  const { profile, setProfile, setUserStats } = useProfile();
  const { setDailyMeals, setDailyHistory, weightHistory, setWeightHistory, setDailyExercises, setDailyWater, setWaterGoal } = useData();
  const { setCustomExercises, setFavorites, setFoodsDB } = useSettings();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!profile) return null;

  // Get latest weight from weight history or fall back to profile weight
  const currentWeight = weightHistory.length > 0
    ? [...weightHistory].sort((a, b) => b.date.localeCompare(a.date))[0].weight
    : profile.weight;

  /**
   * Reset all application data
   */
  const handleReset = (): void => {
    setShowResetConfirm(true);
  };

  /**
   * Confirm and execute reset
   */
  const confirmReset = (): void => {
    // Remove only app-specific localStorage keys (don't use localStorage.clear() - it removes ALL keys)
    const appKeys = [
      'fitnessProfile',
      'userStats',
      'dailyMeals',
      'dailyExercises',
      'dailyHistory',
      'weightHistory',
      'dailyWater',
      'waterGoal',
      'darkMode',
      'foodsDB',
      'favorites',
      'customExercises',
      'lastAppOpenDate',
      'viewedAchievements'
    ];

    appKeys.forEach(key => localStorage.removeItem(key));

    setProfile(null);
    setDailyMeals([]);
    setDailyHistory([]);
    setWeightHistory([]);
    setDailyExercises([]);
    setDailyWater(0);
    setWaterGoal(2000);
    setCustomExercises([]);
    setFavorites([]);
    setFoodsDB(initialFoodsDB);
    setUserStats({
      currentStreak: 0,
      longestStreak: 0,
      totalMealsLogged: 0,
      totalExercises: 0,
      totalCaloriesBurned: 0,
      achievementsUnlocked: [],
      lastLogDate: '',
      totalWaterLogged: 0
    });
    setShowResetConfirm(false);
  };

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="heading-1">Profil</h1>
        <button
          onClick={() => setShowEditModal(true)}
          class="btn-primary"
        >
          Szerkesztés
        </button>
      </div>

      {/* Profile info and daily goals side by side on desktop */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile basic data */}
        <div class="card">
          <h2 class="heading-2 mb-4">Alapadatok</h2>
          <div class="grid grid-cols-2 gap-4">
            <ProfileField label="Nem" value={profile.gender === 'male' ? 'Férfi' : 'Nő'} />
            <ProfileField label="Életkor" value={`${profile.age} év`} />
            <ProfileField label="Magasság" value={`${profile.height} cm`} />
            <ProfileField label="Jelenlegi súly" value={`${currentWeight} kg`} />
            <ProfileField label="Célsúly" value={`${profile.goalWeight} kg`} />
            <ProfileField label="Napi folyadék cél" value={`${((profile.waterGoal || 2000) / 1000).toFixed(1)} liter`} />
            <ProfileField label="Aktivitás" value={activityLabels[profile.activity]} />
            <ProfileField label="Cél" value={goalLabels[profile.goal]} />
          </div>
        </div>

        {/* Daily goals */}
        <div class="card">
          <h2 class="heading-2 mb-4">Napi Célok</h2>
          <div class="grid grid-cols-2 gap-4">
            <NutritionCard
              title="Napi Kalória"
              value={profile.dailyCalories}
              unit=" kcal"
              color="bg-indigo-50"
            />
            <NutritionCard title="Fehérje" value={profile.macros.protein} unit="g" color="bg-blue-50" />
            <NutritionCard title="Szénhidrát" value={profile.macros.carbs} unit="g" color="bg-green-50" />
            <NutritionCard title="Zsír" value={profile.macros.fat} unit="g" color="bg-orange-50" />
            <NutritionCard
              title="Folyadék"
              value={(profile.waterGoal || 2000) / 1000}
              unit=" L"
              color="bg-cyan-50"
            />
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div class="card">
        <h2 class="heading-2 mb-4 text-red-600">Veszélyes zóna</h2>
        <p class="mb-4 text-secondary">
          Az összes adat törlése az alkalmazásból. Ez a művelet nem visszavonható!
        </p>
        <button onClick={handleReset} class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
          Minden adat törlése
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} profile={profile} />}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <ConfirmationModal
          title="Összes adat törlése"
          message="Biztosan törölni szeretnéd az összes adatot?"
          details="Ez a művelet törli a profilt, étkezéseket, edzéseket, súlyméréseket és minden egyéb adatot. Ez nem visszavonható!"
          onConfirm={confirmReset}
          onCancel={() => setShowResetConfirm(false)}
          confirmText="Minden törlése"
          cancelText="Mégse"
          variant="danger"
        />
      )}
    </div>
  );
};
