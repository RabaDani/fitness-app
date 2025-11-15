class Pwa {
  #serviceWorkerRegistration?: ServiceWorkerRegistration;

  constructor() {
    if ('serviceWorker' in navigator && isSecureContext) {
      this.registerServiceWorker();
    }
  }

  private async registerServiceWorker() {
    try {
      this.#serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
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
