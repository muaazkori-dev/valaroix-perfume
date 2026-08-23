// VALAROIX Service Worker for Mobile Notifications & Background Sync
const CACHE_NAME = 'valaroix-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Native Mobile Notification Listener
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_MOBILE_NOTIFICATION') {
    const { title, body, icon, tag, data } = event.data;
    self.registration.showNotification(title, {
      body: body || 'New Order Received at VALAROIX Store',
      icon: icon || '/icon.jpg',
      badge: '/icon.jpg',
      vibrate: [300, 100, 300, 100, 300],
      tag: tag || 'valaroix-order',
      renotify: true,
      requireInteraction: true,
      data: data || { url: '/admin' }
    });
  }
});

// Notification Click Handler - Open Admin Dashboard
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/admin';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
