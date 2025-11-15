import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for tracking which achievements have been viewed by the user
 * Manages localStorage persistence and syncs with unlocked achievements
 *
 * @param unlockedAchievements - Array of currently unlocked achievement IDs
 * @returns Object with notification status and mark function
 */
export function useViewedAchievements(unlockedAchievements: string[]) {
  const [viewedAchievements, setViewedAchievements] = useLocalStorage<string[]>(
    'viewedAchievements',
    []
  );

  // Check if there are new achievements that haven't been viewed
  const hasNewAchievements = unlockedAchievements.some(
    id => !viewedAchievements.includes(id)
  );

  // Mark all current achievements as viewed
  const markAllAsViewed = () => {
    setViewedAchievements([...unlockedAchievements]);
  };

  return {
    hasNewAchievements,
    markAllAsViewed
  };
}
