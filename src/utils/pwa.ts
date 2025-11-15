/// <reference types="vite/client" />

class Pwa {
  #serviceWorkerRegistration?: ServiceWorkerRegistration;

  constructor() {
    if ('serviceWorker' in navigator && isSecureContext) {
      this.registerServiceWorker();
    }
  }

  private async registerServiceWorker() {
    try {
      const baseUrl = import.meta.env.BASE_URL;
      this.#serviceWorkerRegistration = await navigator.serviceWorker.register(`${baseUrl}sw.js`, {
        scope: baseUrl
      });

      console.log('✅ Service Worker registered successfully');

      // Check for updates
      this.#serviceWorkerRegistration.addEventListener('updatefound', () => {
        console.log('🔄 Service Worker update found');
      });
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  }
}

export const pwa = new Pwa();
