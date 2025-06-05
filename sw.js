const CACHE_NAME = 'calculator-free-v1.2.0';
const STATIC_CACHE = 'calculator-static-v1.2.0';
const DYNAMIC_CACHE = 'calculator-dynamic-v1.2.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/vi/index.html',
  '/assets/css/common.css',
  '/assets/css/index.css',
  '/assets/js/index.js',
  '/favico.png',
  '/favicon.ico',
  '/manifest.json'
];

// Cache essential calculator pages
const CALCULATOR_PAGES = [
  '/en/age-calculator-en.html',
  '/vi/may-tinh-tuoi.html',
  '/en/date-calculator-en.html',
  '/vi/may-tinh-ngay-thang.html',
  '/en/time-calculator-en.html',
  '/vi/time-calculator.html',
  '/vi/tinh-phan-tram.html',
  '/assets/css/age-calculator.css',
  '/assets/css/date-calculator.css',
  '/assets/css/time-calculator.css',
  '/assets/css/percentage-calculator.css',
  '/assets/js/age-calculator.js',
  '/assets/js/date-calculator.js',
  '/assets/js/percentage-calculator.js'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching static files...');
        return cache.addAll(STATIC_FILES);
      }),
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('Caching calculator pages...');
        return cache.addAll(CALCULATOR_PAGES.map(url => new Request(url, {
          credentials: 'same-origin'
        })));
      })
    ]).then(() => {
      console.log('All files cached successfully');
      return self.skipWaiting();
    }).catch(error => {
      console.error('Cache installation failed:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache with fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then(response => {
      if (response) {
        console.log('Serving from cache:', request.url);
        return response;
      }

      // Clone the request for cache storage
      const fetchRequest = request.clone();
      
      return fetch(fetchRequest).then(response => {
        // Check if response is valid
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response for cache storage
        const responseToCache = response.clone();
        
        // Determine which cache to use
        let cacheName = DYNAMIC_CACHE;
        if (STATIC_FILES.includes(url.pathname) || 
            CALCULATOR_PAGES.includes(url.pathname)) {
          cacheName = STATIC_CACHE;
        }

        // Cache the response
        caches.open(cacheName).then(cache => {
          console.log('Caching new resource:', request.url);
          cache.put(request, responseToCache);
        });

        return response;
      }).catch(error => {
        console.error('Fetch failed:', error);
        
        // Return offline page for HTML requests
        if (request.headers.get('accept').includes('text/html')) {
          return caches.match('/offline.html').then(response => {
            return response || new Response('Offline - Please check your connection', {
              status: 200,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
        }
        
        // Return cached version or empty response
        return new Response('Resource unavailable offline', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'calculator-sync') {
    event.waitUntil(syncCalculatorData());
  }
});

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New calculator features available!',
    icon: '/favico.png',
    badge: '/favico.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore Calculators',
        icon: '/favico.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favico.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Calculator Free Online', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler for client communication
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME
    });
  }
});

// Helper function for syncing data
async function syncCalculatorData() {
  try {
    // Sync any pending calculator data
    console.log('Syncing calculator data...');
    
    // Get stored calculation history if any
    const calculatorData = await getStoredCalculatorData();
    
    if (calculatorData.length > 0) {
      // Send data to server if needed
      await sendCalculatorAnalytics(calculatorData);
      
      // Clear stored data after successful sync
      await clearStoredCalculatorData();
    }
    
    console.log('Calculator data sync completed');
  } catch (error) {
    console.error('Sync failed:', error);
    throw error;
  }
}

// Helper functions for data management
async function getStoredCalculatorData() {
  // Implementation for getting stored data
  return [];
}

async function sendCalculatorAnalytics(data) {
  // Implementation for sending analytics
  console.log('Sending analytics:', data);
}

async function clearStoredCalculatorData() {
  // Implementation for clearing stored data
  console.log('Clearing stored data');
}

// Performance monitoring
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/assets/')) {
    // Track asset loading performance
    const start = performance.now();
    
    event.respondWith(
      caches.match(event.request).then(response => {
        const end = performance.now();
        console.log(`Asset load time: ${end - start}ms for ${event.request.url}`);
        return response || fetch(event.request);
      })
    );
  }
});

console.log('Service Worker script loaded successfully'); 