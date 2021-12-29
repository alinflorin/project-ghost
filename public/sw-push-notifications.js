/* eslint-disable no-undef */
function receivePushNotification(event) {
  const {
    icon,
    data,
    title,
    body,
    vibrate,
    badge,
    renotify,
    requireInteraction,
    timestamp,
  } = event.data.json().notification;

  const options = {
    data: data,
    body: body,
    icon: icon,
    vibrate: vibrate,
    badge: badge,
    renotify: renotify,
    requireInteraction: requireInteraction,
    timestamp: timestamp,
  };
  event.waitUntil(self.registration.showNotification(title, options));
}

function openPushNotification(event) {
  event.notification.close();
  let url = "/";
  if (
    event.notification.data.absoluteRouteUrl != null &&
    event.notification.data.absoluteRouteUrl.length > 0
  ) {
    url = event.notification.data.absoluteRouteUrl;
  }
  url = `/from-notification/${
    event.notification.data.id
  }?returnUrl=${encodeURIComponent(url)}`;
  // Attempt to fetch open tabs
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function (clientList) {
      // No match by default
      var matchFound = false;

      // Traverse clients list
      for (var client of clientList) {
        // Parse url

        // Check host matches
        if ("focus" in client) {
          // Update URL
          client.navigate(url);

          // Focus existing window
          client.focus();
        }
      }

      // If no open tabs, or none match the host, open a new window
      if (!matchFound) {
        event.waitUntil(clients.openWindow(url));
      }
    })
  );
}

self.addEventListener("push", receivePushNotification);
self.addEventListener("notificationclick", openPushNotification);
