import { createContext } from "preact";
import { useContext } from "preact/compat";
import { Profile, UserStats } from "../types";

/**
 * Profile context type definition
 * Manages user profile and gamification statistics
 */
export interface ProfileContextType {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  userStats: UserStats;
  setUserStats: (stats: UserStats) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

/**
 * Hook to access profile context
 * Provides user profile and gamification statistics
 * @returns ProfileContextType object with profile, setProfile, userStats, and setUserStats
 * @throws Error if used outside ProfileProvider
 */
export function useProfile(): ProfileContextType {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}

export default ProfileContext;
