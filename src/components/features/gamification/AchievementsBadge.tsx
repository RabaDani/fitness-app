import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Award } from 'lucide-preact';
import { useAppContext } from '../../../context/AppContext';
import { AchievementModal } from './AchievementModal';
import { useViewedAchievements } from '../../../hooks/useViewedAchievements';

/**
 * Achievements badge button component
 * Shows count of unlocked achievements and opens modal on click
 * Displays notification dot if there are new unseen achievements
 */
export function AchievementsBadge() {
  const { userStats } = useAppContext();
  const [showModal, setShowModal] = useState(false);

  const unlockedCount = userStats.achievementsUnlocked.length;
  const { hasNewAchievements, markAllAsViewed } = useViewedAchievements(
    userStats.achievementsUnlocked
  );

  const handleOpenModal = () => {
    setShowModal(true);
    markAllAsViewed();
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        class="badge-achievement relative"
      >
        <Award size={20} /><span class="text-sm font-medium">Kitüntetés</span>

        {hasNewAchievements && (
          <span class="absolute -top-1 -right-1 flex size-3">
            <span class="absolute inline-flex h-full w-full animate-pulse rounded-full bg-red-500 dark:bg-yellow-400 opacity-75"></span>

          </span>
        )}
      </button>

      {showModal && <AchievementModal onClose={() => setShowModal(false)} />}
    </>
  );
}
