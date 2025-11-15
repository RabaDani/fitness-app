import { h } from 'preact';
import { User, TrendingUp, House, Activity, Scale, Salad, Menu, X } from 'lucide-preact';
import { ThemeToggle } from '../shared';
import { useState } from 'preact/compat';

interface NavigationProps {
  currentView: 'dashboard' | 'meals' | 'stats' | 'profile' | 'exercise' | 'weight';
  setCurrentView: (view: 'dashboard' | 'meals' | 'stats' | 'profile' | 'exercise' | 'weight') => void;
}

/**
 * Navigation component for switching between different views
 * Provides a tabbed interface for the main app sections with dark mode toggle
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

  const [open, setOpen] = useState(false);

  return (
    <nav class="bg-white dark:bg-gray-800 shadow-md">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center">
          {/* App Logo/Brand + Mobile Hamburger */}
          <div class="flex items-center space-x-2 py-4 mr-8">
            <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              TheBestOfYou
            </h1>
            <button
              class="lg:hidden p-2 rounded-lg transition-colors bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-controls="mobile-nav"
              aria-expanded={open}
              onClick={() => setOpen(prev => !prev)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation Items */}
          <div class="hidden lg:flex space-x-1 flex-1">
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

        {/* Mobile dropdown (visible when open) */}
        {open && (
          <div id="mobile-nav" class="lg:hidden mt-2 pb-4 bg-white dark:bg-gray-800">
            <nav class="flex flex-col">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setOpen(false);
                    }}
                    class={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${isActive
                    ? 'border-b-4 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                  >
                    {Icon && <Icon size={18} />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </nav>
  );
}
