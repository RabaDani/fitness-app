import { h } from 'preact';
import { Flame, Trophy } from 'lucide-preact';
import { useAppContext } from '../../../context/AppContext';

/**
 * Streak counter component showing current and longest streaks
 * Motivates users to maintain daily logging habits
 */
export function StreakCounter() {
  const { userStats } = useAppContext();

  return (
    <div class="card-theme">
      <div class="grid grid-cols-2 gap-4 text-white">
        {/* Current Streak */}
        <div class="flex items-center space-x-3">
          <Flame size={32} class="text-yellow-300" />
          <div>
            <p class="text-sm opacity-90">Jelenlegi sorozat</p>
            <p class="text-3xl font-bold">{userStats.currentStreak}</p>
            <p class="text-xs opacity-75">nap</p>
          </div>
        </div>

        {/* Longest Streak */}
        <div class="flex items-center space-x-3">
          <Trophy size={32} class="text-yellow-300" />
          <div>
            <p class="text-sm opacity-90">Leghosszabb</p>
            <p class="text-3xl font-bold">{userStats.longestStreak}</p>
            <p class="text-xs opacity-75">nap</p>
          </div>
        </div>
      </div>

      {/* Motivational message */}
      {userStats.currentStreak > 0 && (
        <div class="mt-4 pt-4 border-t border-white/20 text-white text-center">
          <p class="text-sm font-medium">
            {userStats.currentStreak >= 7
              ? 'Hihetetlen! Folytasd így!'
              : userStats.currentStreak >= 3
              ? 'Remekül haladsz!'
              : 'Nagyszerű kezdés!'}
          </p>
        </div>
      )}
    </div>
  );
}
