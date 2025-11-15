import { createContext } from "preact";
import { useContext } from "preact/compat";
import { Profile, UserStats } from "../types";

export interface ProfileContextType {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  userStats: UserStats;
  setUserStats: (stats: UserStats) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function useProfile(): ProfileContextType {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}

export default ProfileContext;
