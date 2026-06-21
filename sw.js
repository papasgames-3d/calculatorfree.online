const CACHE_NAME = 'calculatorfree-v1.0.1';
const STATIC_CACHE_NAME = 'calculatorfree-static-v1.0.1';

// Core files to cache for offline functionality
const CORE_CACHE_FILES = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/css/page.css',
  '/assets/css/home.css',
  '/assets/js/script.js',
  '/assets/js/nav.js',
  '/assets/css/scientific-calculator.css',
  '/assets/js/scientific-calculator.js',
  '/assets/js/search-index.js',
  '/assets/js/search.js',
  '/assets/js/pwa-lite.js',
  '/manifest.json',
  '/favicon.ico'
];

// Popular calculators to cache for offline use
const CALCULATOR_CACHE_FILES = [
  '/finance-calculator.html',
  '/mortgage-calculator.html',
  '/bmi-calculator.html',
  '/scientific-calculator.html',
  '/ip-subnet-calculator.html',
  '/conversion-calculator.html',
  '/standard-deviation-calculator.html',
  '/quadratic-formula-calculator.html',
  '/sitemap.html'
];

// External resources to cache
const EXTERNAL_CACHE_FILES = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

const ALL_CACHE_FILES = [
  ...CORE_CACHE_FILES,
  ...CALCULATOR_CACHE_FILES,
  ...EXTERNAL_CACHE_FILES
];

// Install Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache core files
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('Caching core files...');
        return cache.addAll(CORE_CACHE_FILES);
      }),
      // Cache calculator files
      caches.open(CACHE_NAME).then(cache => {
        console.log('Caching calculator files...');
        return cache.addAll(CALCULATOR_CACHE_FILES);
      }),
      // Cache external resources
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('Caching external resources...');
        return Promise.allSettled(
          EXTERNAL_CACHE_FILES.map(url => 
            cache.add(url).catch(err => console.log('Failed to cache:', url))
          )
        );
      })
    ]).then(() => {
      console.log('Service Worker installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            // Delete old caches
            return cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME;
          })
          .map(cacheName => {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log('Service Worker activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch Strategy: Cache First with Network Fallback
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      // Return cached version if available
      if (cachedResponse) {
        // For HTML files, update cache in background
        if (request.headers.get('accept')?.includes('text/html')) {
          event.waitUntil(updateCache(request));
        }
        return cachedResponse;
      }
      
      // Not in cache, fetch from network
      return fetch(request).then(response => {
        // Cache successful same-origin and opaque (cross-origin no-cors) responses.
        if (!isCacheableResponse(response)) {
          return response;
        }
        
        // Cache the response
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });
        
        return response;
      }).catch(error => {
        console.log('Network request failed:', error);
        
        // Return offline page for HTML requests
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
        
        // Return generic offline response for other requests
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});

// Update cache in background
async function updateCache(request) {
  try {
    const response = await fetch(request);
    if (isCacheableResponse(response)) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response);
    }
  } catch (error) {
    console.log('Background cache update failed:', error);
  }
}

function isCacheableResponse(response) {
  if (!response) {
    return false;
  }
  if (response.type === 'opaque') {
    return true;
  }
  return response.status === 200;
}

// Handle push notifications (future feature)
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: data.data,
    actions: [
      {
        action: 'open',
        title: 'Open Calculator',
        icon: '/assets/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/icon-72x72.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Handle background sync (future feature)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement background sync logic here
  console.log('Background sync triggered');
}

// Share Target API (future feature)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHARE_TARGET') {
    // Handle shared content
    console.log('Shared content received:', event.data);
  }
});

// Periodic background sync (future feature)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-calculators') {
    event.waitUntil(updateCalculatorCache());
  }
});

async function updateCalculatorCache() {
  // Update calculator files in background
  const cache = await caches.open(CACHE_NAME);
  const updatePromises = CALCULATOR_CACHE_FILES.map(url => 
    fetch(url).then(response => {
      if (response.status === 200) {
        return cache.put(url, response);
      }
    }).catch(err => console.log('Failed to update:', url))
  );
  
  return Promise.allSettled(updatePromises);
} 