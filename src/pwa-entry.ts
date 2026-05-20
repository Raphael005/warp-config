// Self-hosted PWA install component (replaces CDN script)
import '@pwabuilder/pwainstall';

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered. Scope:', registration.scope);

        // Notify when a new SW version is waiting
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              console.log('New version available. Refresh to update.');
              // Optionally show a "Update available" UI banner here
            }
          });
        });
      })
      .catch((error: Error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
} else {
  console.warn('Service Workers are not supported in this browser.');
}
