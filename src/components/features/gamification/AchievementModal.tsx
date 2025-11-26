import { h } from 'preact';
import { X } from 'lucide-preact';
import { useProfile } from '../../../context/ProfileContext';
import { achievementsDatabase } from '../../../utils/constants/database';
import { Achievement } from '../../../types';

interface AchievementModalProps {
  onClose: () => void;
}

/**
 * Achievement modal component
 * Displays all achievements with their unlock status and progress
 */
export function AchievementModal({ onClose }: AchievementModalProps) {
  const { userStats } = useProfile();

  /**
   * Calculate progress for each achievement based on user stats
   */
  const getAchievementProgress = (achievement: typeof achievementsDatabase[0]): Achievement => {
    const isUnlocked = userStats.achievementsUnlocked.includes(achievement.id);

    let progress = 0;
    let currentValue = 0;

    switch (achievement.category) {
      case 'streak':
        currentValue = userStats.currentStreak;
        progress = Math.min((currentValue / achievement.target) * 100, 100);
        break;
      case 'meals':
        currentValue = userStats.totalMealsLogged;
        progress = Math.min((currentValue / achievement.target) * 100, 100);
        break;
      case 'exercise':
        if (achievement.id.startsWith('burn-')) {
          currentValue = userStats.totalCaloriesBurned;
        } else {
          currentValue = userStats.totalExercises;
        }
        progress = Math.min((currentValue / achievement.target) * 100, 100);
        break;
    }

    return {
      ...achievement,
      progress,
      unlockedAt: isUnlocked ? userStats.lastLogDate : undefined
    };
  };

  const achievements = achievementsDatabase.map(getAchievementProgress);

  // Group achievements by category
  const groupedAchievements = {
    streak: achievements.filter(a => a.category === 'streak'),
    meals: achievements.filter(a => a.category === 'meals'),
    exercise: achievements.filter(a => a.category === 'exercise')
  };

  const categoryLabels = {
    streak: 'Sorozat Kitüntetések',
    meals: 'Étkezés Kitüntetések',
    exercise: 'Edzés Kitüntetések'
  };

  return (
    <div
      class="modal-overlay"
      onClick={onClose}
    >
      <div
        class="modal-container max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div class="modal-header sticky top-0 z-10 bg-white dark:bg-gray-800">
          <h2 class="heading-2">Kitüntetések</h2>
          <button
            onClick={onClose}
            class="btn-icon"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div class="p-6 space-y-8">
          {/* Summary Stats */}
          <div class="text-center">
            <p class="text-4xl font-bold text-accent">
              {userStats.achievementsUnlocked.length}/{achievements.length}
            </p>
            <p class="text-sm text-secondary">
              Feloldott kitüntetések
            </p>
          </div>

          {/* Achievement Groups */}
          {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
            <div key={category}>
              <h3 class="heading-3 mb-4">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryAchievements.map((achievement) => {
                  const isUnlocked = userStats.achievementsUnlocked.includes(achievement.id);

                  return (
                    <div
                      key={achievement.id}
                      class={`p-4 rounded-lg border transition-all ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 border-indigo-300 dark:border-indigo-600'
                          : 'card-secondary border border-gray-300 dark:border-gray-600 opacity-60'
                      }`}
                    >
                      <div class="flex items-start space-x-4">
                        {/* Icon */}
                        <div
                          class={`text-4xl ${
                            isUnlocked ? '' : 'filter grayscale opacity-50'
                          }`}
                        >
                          {achievement.icon}
                        </div>

                        {/* Details */}
                        <div class="flex-1 min-w-0">
                          <h4 class="font-semibold text-base mb-1 text-primary">
                            {achievement.name}
                          </h4>
                          <p class="text-sm mb-2 text-secondary">
                            {achievement.description}
                          </p>

                          {/* Progress Bar */}
                          {!isUnlocked && (
                            <div class="space-y-1">
                              <div class="h-2 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600">
                                <div
                                  class="h-full bg-indigo-600 transition-all duration-300"
                                  style={{ width: `${achievement.progress}%` }}
                                />
                              </div>
                              <p class="text-xs text-tertiary">
                                {Math.floor(achievement.progress)}% teljesítve
                              </p>
                            </div>
                          )}

                          {/* Unlocked Badge */}
                          {isUnlocked && (
                            <div class="badge-success">
                              ✓ Feloldva
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
