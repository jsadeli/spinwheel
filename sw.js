const CACHE_NAME = 'spinwheel-v6';
const ASSETS = [
    './',
    './index.html',
    './icon.png',
    './manifest.json',
    './scripts/animations.js',
    './scripts/babel.min.js',
    './scripts/icons.js',
    './scripts/react-dom.production.min.js',
    './scripts/react.production.min.js',
    './scripts/tailwindcss.js',
    './scripts/themes.js',
    './scripts/utils.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
