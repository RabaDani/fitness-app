import { useState, useEffect } from 'preact/hooks';
import { Bell, BellOff, Check, X } from 'lucide-preact';

interface NotificationSettingsProps {
  /** Whether daily reminders are enabled */
  remindersEnabled: boolean;
  /** Callback when reminders setting changes */
  onRemindersChange: (enabled: boolean) => void;
  /** Show success message */
  showSuccess: (message: string) => void;
  /** Show error message */
  showError: (message: string) => void;
}

/**
 * NotificationSettings component manages push notification permissions and preferences
 * Handles browser notification permission requests and subscription management
 */
export function NotificationSettings({
  remindersEnabled,
  onRemindersChange,
  showSuccess,
  showError
}: NotificationSettingsProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check current notification permission and subscription status
  useEffect(() => {
    if ('Notification' in globalThis) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  /**
   * Check if user is currently subscribed to push notifications
   */
  const checkSubscription = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in globalThis) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    }
  };

  /**
   * Request notification permission from the user
   */
  const requestPermission = async () => {
    if (!('Notification' in globalThis)) {
      showError('Ez a böngésző nem támogatja az értesítéseket');
      return;
    }

    setIsLoading(true);

    try {
      const result = await Notification.permission === 'default'
        ? await Notification.requestPermission()
        : Notification.permission;

      setPermission(result);

      if (result === 'granted') {
        await subscribeToPush();
        showSuccess('Értesítések engedélyezve!');
      } else if (result === 'denied') {
        showError('Értesítések letiltva. Engedélyezd a böngésző beállításaiban.');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      showError('Hiba történt az engedély kérése során');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Subscribe to push notifications
   */
  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in globalThis)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      // In a production app, you would get this key from your push service
      // For now, we'll just set up the subscription structure
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          // This is a placeholder VAPID public key - replace with your own
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrm-TkBXwoWHQBGQU3d4eqCTTUWrPxIBrQf9YLqXqJ1N99EH6Do'
        )
      });

      // In production, send this subscription to your backend server
      console.log('Push subscription:', subscription);

      setIsSubscribed(true);
      onRemindersChange(true);
    } catch (error) {
      console.error('Error subscribing to push:', error);
      showError('Nem sikerült feliratkozni az értesítésekre');
    }
  };

  /**
   * Unsubscribe from push notifications
   */
  const unsubscribeFromPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in globalThis)) {
      return;
    }

    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        onRemindersChange(false);
        showSuccess('Értesítések kikapcsolva');
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      showError('Hiba történt a leiratkozás során');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Convert base64 string to Uint8Array for VAPID key
   */
  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = globalThis.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Don't render if notifications are not supported
  if (!('Notification' in globalThis)) {
    return null;
  }

  return (
    <div class="card">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h2 class="heading-2 mb-2">Értesítések</h2>
          <p class="text-secondary text-sm">
            Kapj napi emlékeztetőket az étkezések és edzések rögzítéséhez
          </p>
        </div>
        <div class={`p-2 rounded-full ${isSubscribed ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
          {isSubscribed ? (
            <Bell size={20} class="text-green-600 dark:text-green-400" />
          ) : (
            <BellOff size={20} class="text-gray-400" />
          )}
        </div>
      </div>

      {/* Permission status */}
      <div class="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">Engedély státusz:</span>
          <div class="flex items-center space-x-2">
            {permission === 'granted' && (
              <>
                <Check size={16} class="text-green-600 dark:text-green-400" />
                <span class="text-sm text-green-600 dark:text-green-400">Engedélyezve</span>
              </>
            )}
            {permission === 'denied' && (
              <>
                <X size={16} class="text-red-600 dark:text-red-400" />
                <span class="text-sm text-red-600 dark:text-red-400">Letiltva</span>
              </>
            )}
            {permission === 'default' && (
              <span class="text-sm text-secondary">Nincs kérve</span>
            )}
          </div>
        </div>
      </div>

      {/* Subscription status */}
      {permission === 'granted' && (
        <div class="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Feliratkozás:</span>
            <span class="text-sm text-secondary">
              {isSubscribed ? 'Aktív' : 'Inaktív'}
            </span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div class="space-y-3">
        {permission === 'default' && (
          <button
            onClick={requestPermission}
            disabled={isLoading}
            class="btn-primary w-full"
          >
            <Bell size={16} class="mr-2" />
            {isLoading ? 'Folyamatban...' : 'Értesítések engedélyezése'}
          </button>
        )}

        {permission === 'granted' && !isSubscribed && (
          <button
            onClick={subscribeToPush}
            disabled={isLoading}
            class="btn-primary"
          >
            {isLoading ? 'Folyamatban...' : 'Feliratkozás az értesítésekre'}
          </button>
        )}

        {permission === 'granted' && isSubscribed && (
          <button
            onClick={unsubscribeFromPush}
            disabled={isLoading}
            class="btn-secondary w-full"
          >
            {isLoading ? 'Folyamatban...' : 'Leiratkozás'}
          </button>
        )}

        {permission === 'denied' && (
          <div class="text-sm text-secondary">
            Az értesítések le vannak tiltva. Engedélyezd őket a böngésző beállításaiban, majd frissítsd az oldalt.
          </div>
        )}
      </div>

      {/* Info about notifications */}
      {isSubscribed && (
        <div class="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p class="text-sm text-blue-800 dark:text-blue-300">
            <strong>Tipp:</strong> Az emlékeztetők segítenek konzisztensen rögzíteni az étkezéseket és edzéseket.
          </p>
        </div>
      )}
    </div>
  );
}
