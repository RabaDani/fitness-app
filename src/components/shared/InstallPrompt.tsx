import { useState, useEffect } from 'preact/hooks';
import { Download, X } from 'lucide-preact';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * InstallPrompt component displays a prompt to install the PWA
 * Shows after 3 visits and can be dismissed permanently
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useLocalStorage('install-prompt-dismissed', false);
  const [visits, setVisits] = useLocalStorage('app-visits', 0);

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      // Check if user has dismissed the prompt
      if (dismissed) return;

      // Show prompt after 3 visits
      if (visits >= 2) {
        // Only prevent default if we're actually going to show our custom prompt
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShowPrompt(true);
      }

      // Increment visit count AFTER checking
      setVisits(visits + 1);
    };

    globalThis.addEventListener('beforeinstallprompt', handler);

    return () => {
      globalThis.removeEventListener('beforeinstallprompt', handler);
    };
  }, [dismissed, visits, setVisits]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div class="fixed bottom-20 lg:bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:max-w-md z-[200] animate-slideIn">
      <div class="card shadow-2xl border-2 border-indigo-500">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
              <Download size={20} class="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="heading-3 mb-1">Telepítsd az appot!</h3>
            <p class="text-sm text-secondary mb-3">
              Gyors hozzáférés a kezdőképernyődről, offline működés és natív app élmény.
            </p>
            <div class="flex space-x-2">
              <button onClick={handleInstall} class="btn-primary-sm">
                Telepítés
              </button>
              <button onClick={handleDismiss} class="btn-secondary px-3 py-1.5 rounded text-xs">
                Ne mutasd újra
              </button>
            </div>
          </div>
          <button onClick={() => setShowPrompt(false)} class="btn-icon flex-shrink-0">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
