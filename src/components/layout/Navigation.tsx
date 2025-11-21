import { h } from 'preact';
import { User, TrendingUp, House, Activity, Scale, Salad } from 'lucide-preact';
import { ThemeToggle } from '../shared';

interface NavigationProps {
  currentView: 'dashboard' | 'meals' | 'stats' | 'profile' | 'exercise' | 'weight';
  setCurrentView: (view: 'dashboard' | 'meals' | 'stats' | 'profile' | 'exercise' | 'weight') => void;
}

/**
 * Navigation component for switching between different views
 * Desktop: Top bar with icons and labels
 * Mobile: Bottom bar with icons only
 * @param currentView - Currently active view
 * @param setCurrentView - Function to change the current view
 */
export function Navigation({
  currentView,
  setCurrentView
}: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Kezdőlap', icon: House },
    { id: 'meals' as const, label: 'Étkezések', icon: Salad },
    { id: 'exercise' as const, label: 'Edzés', icon: Activity },
    { id: 'weight' as const, label: 'Súly', icon: Scale },
    { id: 'stats' as const, label: 'Statisztikák', icon: TrendingUp },
    { id: 'profile' as const, label: 'Profil', icon: User }
  ];

  return (
    <>
      {/* Desktop Navigation - Top */}
      <nav class="hidden lg:block bg-white dark:bg-gray-800 shadow-md">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center">
            {/* App Logo/Brand */}
            <div class="flex items-center space-x-2 py-4 mr-8">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="TheBestOfYou Logo" class="w-8 h-8" />
              <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                TheBestOfYou
              </h1>
            </div>

            {/* Navigation Items */}
            <div class="flex space-x-1 flex-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    class={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${isActive
                      ? 'border-b-4 border-indigo-600 text-indigo-600'
                      : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }`}
                  >
                    {Icon && <Icon size={20} />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom */}
      <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 z-50 safe-area-inset-bottom rounded-t-2xl shadow-lg">
        <div class="flex justify-around items-center px-2 py-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                class={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all min-w-[60px] ${isActive
                  ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                aria-label={item.label}
              >
                {Icon && <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />}
                <span class="text-[10px] mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Header - Top (Logo and Theme Toggle) */}
      <div class="lg:hidden bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
        <div class="flex justify-between items-center px-4 py-3">
          <div class="flex items-center space-x-2">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="TheBestOfYou Logo" class="w-7 h-7" />
            <h1 class="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              TheBestOfYou
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
