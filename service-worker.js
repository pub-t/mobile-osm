const APP_CACHE_NAME = 'mosm-app-v1';
const TILE_CACHE_NAME = 'mosm-tiles-v1';

const urlsToCache = [
  '/',
  'https://unpkg.com/leaflet@0.7.7/dist/leaflet.css',
  'https://unpkg.com/leaflet@0.7.7/dist/leaflet.js',
];

self.addEventListener('install', function(event) {
  console.log('install');

  // Perform install steps
  const cachePromise = caches.open(APP_CACHE_NAME)
    .then(function(cache) {
      console.log('install: opened cache');
      return cache.addAll(urlsToCache);
    })
    .then(() => {
      console.log('install: added all urls to cache');
    });

  debugger;
  event.waitUntil(cachePromise);
});

self.addEventListener('fetch', function(event) {
  console.log('there is a fetch');
  const { url } = event.request;

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log('responding from cache', url);
          return response;
        }
        console.log('fetching and adding to cache', url);
        caches.open(TILE_CACHE_NAME).then(cache => cache.add(url));

        return fetch(event.request);
      }
    )
  );
});
