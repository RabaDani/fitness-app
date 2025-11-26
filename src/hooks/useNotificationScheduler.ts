import { useEffect } from 'preact/hooks';

interface NotificationSchedule {
  /** Title of the notification */
  title: string;
  /** Body text of the notification */
  body: string;
  /** Hour (0-23) when to show the notification */
  hour: number;
  /** Minute (0-59) when to show the notification */
  minute: number;
  /** Unique tag for the notification */
  tag: string;
}

/**
 * Default notification schedule for daily reminders
 */
const DEFAULT_SCHEDULE: NotificationSchedule[] = [
  {
    title: 'Reggeli ideje! 🌅',
    body: 'Ne felejtsd el rögzíteni a reggelidet!',
    hour: 8,
    minute: 0,
    tag: 'breakfast-reminder'
  },
  {
    title: 'Ebéd ideje! 🍽️',
    body: 'Rögzítsd az ebédedet és kövesd a kalóriákat!',
    hour: 12,
    minute: 30,
    tag: 'lunch-reminder'
  },
  {
    title: 'Vacsora ideje! 🌙',
    body: 'Ne felejtsd el rögzíteni a vacsorádat!',
    hour: 18,
    minute: 30,
    tag: 'dinner-reminder'
  },
  {
    title: 'Napi összegzés 📊',
    body: 'Tekintsd meg a mai haladásodat és rögzítsd az esetleges edzéseket!',
    hour: 21,
    minute: 0,
    tag: 'daily-summary'
  }
];

/**
 * Hook to schedule daily notification reminders
 * Schedules notifications at specific times each day
 *
 * @param enabled - Whether notifications are enabled
 * @param schedule - Custom notification schedule (optional)
 */
export function useNotificationScheduler(
  enabled: boolean,
  schedule: NotificationSchedule[] = DEFAULT_SCHEDULE
) {
  useEffect(() => {
    if (!enabled) {
      // Cancel all scheduled notifications if disabled
      cancelAllNotifications();
      return;
    }

    if (!('Notification' in globalThis) || Notification.permission !== 'granted') {
      return;
    }

    // Schedule all notifications
    scheduleNotifications(schedule);

    // Cleanup function to cancel notifications when component unmounts or disabled
    return () => {
      if (!enabled) {
        cancelAllNotifications();
      }
    };
  }, [enabled, schedule]);
}

/**
 * Schedule notifications for the given schedule
 */
function scheduleNotifications(schedule: NotificationSchedule[]) {
  const now = new Date();

  schedule.forEach((notification) => {
    const scheduledTime = new Date();
    scheduledTime.setHours(notification.hour, notification.minute, 0, 0);

    // If the scheduled time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();

    // Schedule the notification
    const timeoutId = setTimeout(() => {
      showNotification(notification);
      // Reschedule for next day
      scheduleNextDay(notification);
    }, delay);

    // Store timeout ID for cleanup
    storeTimeoutId(notification.tag, timeoutId);
  });
}

/**
 * Schedule notification for the next day
 */
function scheduleNextDay(notification: NotificationSchedule) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(notification.hour, notification.minute, 0, 0);

  const delay = tomorrow.getTime() - Date.now();

  const timeoutId = setTimeout(() => {
    showNotification(notification);
    scheduleNextDay(notification);
  }, delay);

  storeTimeoutId(notification.tag, timeoutId);
}

/**
 * Show a notification
 */
async function showNotification(notification: NotificationSchedule) {
  if (!('Notification' in globalThis) || Notification.permission !== 'granted') {
    return;
  }

  // If service worker is available, use it to show the notification
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(notification.title, {
        body: notification.body,
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: notification.tag,
        requireInteraction: false,
        vibrate: [200, 100, 200],
        actions: [
          {
            action: 'open',
            title: 'Megnyitás'
          },
          {
            action: 'dismiss',
            title: 'Bezárás'
          }
        ]
      });
    } catch (error) {
      console.error('Error showing notification:', error);
      // Fallback to regular notification
      new Notification(notification.title, {
        body: notification.body,
        icon: '/logo192.png',
        tag: notification.tag
      });
    }
  } else {
    // Fallback to regular notification
    new Notification(notification.title, {
      body: notification.body,
      icon: '/logo192.png',
      tag: notification.tag
    });
  }
}

/**
 * Store timeout ID in memory for cleanup
 */
const timeoutIds = new Map<string, number>();

function storeTimeoutId(tag: string, timeoutId: number) {
  // Clear existing timeout if any
  const existingId = timeoutIds.get(tag);
  if (existingId !== undefined) {
    clearTimeout(existingId);
  }
  timeoutIds.set(tag, timeoutId);
}

/**
 * Cancel all scheduled notifications
 */
function cancelAllNotifications() {
  timeoutIds.forEach((timeoutId) => {
    clearTimeout(timeoutId);
  });
  timeoutIds.clear();
}
