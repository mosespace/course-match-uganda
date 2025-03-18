// Service Worker for Push Notifications

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: data.icon || '/icon-192x192.png',
      badge: data.badge || '/icon-192x192.png',
      data: data.data || {},
      tag: data.tag || 'default',
      actions: data.actions || [],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const notificationData = event.notification.data;
  let url = '/';

  // Handle different notification types
  if (notificationData.type === 'CHECKIN_REMINDER') {
    url = '/attendance/check-in';
  } else if (notificationData.type === 'CHECKOUT_REMINDER') {
    url = '/attendance/check-out';
  } else if (notificationData.type === 'ADMIN_NOTICE') {
    url = '/notices';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // If a window client is already open, focus it
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }

      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }),
  );
});
