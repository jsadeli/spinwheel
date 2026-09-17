const CACHE_NAME = "spinwheel-v48";
const ASSETS = [
  "./",
  "./scripts/components/AchievementsList.js",
  "./scripts/components/ChallengesList.js",
  "./scripts/components/CoinChip.js",
  "./scripts/components/CoinStoreModal.js",
  "./scripts/components/LevelCard.js",
  "./scripts/components/Modal.js",
  "./scripts/components/OutOfOrderOverlay.js",
  "./scripts/components/ThemeIcon.js",
  "./scripts/components/Toast.js",
  "./scripts/components/WinnerModal.js",
  "./scripts/core/AchievementManager.js",
  "./scripts/core/ChallengeManager.js",
  "./scripts/core/GeminiError.js",
  "./scripts/core/Stats.js",
  "./scripts/lib/babel.min.js",
  "./scripts/lib/react-dom-client.esm.js",
  "./scripts/lib/react.esm.js",
  "./scripts/lib/tailwindcss.js",
  "./scripts/achievements.js",
  "./scripts/ai.js",
  "./scripts/animations.js",
  "./scripts/colors.js",
  "./scripts/commands.js",
  "./scripts/configs.js",
  "./scripts/challenges.js",
  "./scripts/icons.js",
  "./scripts/levels.js",
  "./scripts/physics.js",
  "./scripts/sounds.js",
  "./scripts/themes.js",
  "./scripts/utils.js",
  "./scripts/wheel.js",
  "./styles/main.css",
  "./icon.png",
  "./index.html",
  "./manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
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
