import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { useRegisterSW } from 'virtual:pwa-register/preact';
import { RefreshCw, X } from 'lucide-preact';

/**
 * UpdatePrompt component displays a notification when a new version is available
 * Allows users to update the app immediately or dismiss the notification
 */
export function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (offlineReady || needRefresh) {
      setShowPrompt(true);
    }
  }, [offlineReady, needRefresh]);

  const close = () => {
    setShowPrompt(false);
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  if (!showPrompt) return null;

  return (
    <div class="fixed bottom-20 lg:bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:max-w-md z-[200] animate-slideIn">
      <div class="card shadow-2xl border-2 border-indigo-500">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
              <RefreshCw size={20} class="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="heading-3 mb-1">
              {needRefresh ? 'Új verzió érhető el!' : 'App készen áll offline használatra'}
            </h3>
            <p class="text-sm text-secondary mb-3">
              {needRefresh
                ? 'Egy új verzió elérhető. Frissítsd az appot a legújabb funkciókért.'
                : 'Az alkalmazás most már offline is használható.'}
            </p>
            <div class="flex space-x-2">
              {needRefresh && (
                <button onClick={handleUpdate} class="btn-primary-sm">
                  <RefreshCw size={14} class="mr-1" />
                  Frissítés
                </button>
              )}
              <button onClick={close} class="btn-secondary px-3 py-1.5 rounded text-xs">
                {needRefresh ? 'Később' : 'Rendben'}
              </button>
            </div>
          </div>
          <button onClick={close} class="btn-icon flex-shrink-0">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
