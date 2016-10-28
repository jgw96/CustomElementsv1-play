const CACHE = 'Landmark-Viewer';

self.addEventListener('install', (evt) => {
  console.log('The service worker is being installed.');
  evt.waitUntil(precache());
});

self.addEventListener('fetch', (evt) => {
  console.log('The service worker is serving the asset.');
  evt.respondWith(fromCache(evt.request).catch((err) => console.error(err)));
  evt.waitUntil(update(evt.request));
});


function precache() {
  return caches.open(CACHE).then((cache) => {
    return cache.addAll([
      'index.html',
      'styles.css',
      'info-popover/info-popover.html',
      'info-popover/info-popover.js',
      'custom-header/custom-header.html',
      'custom-header/custom-header.js',
      'custom-camera/custom-camera.js',
      'custom-camera/custom-camera.html'
    ]);
  });
};

function fromCache(request) {
  return caches.open(CACHE).then((cache) => {
    return cache.match(request).then((matching) => {
      return matching || Promise.reject('no-match');
    });
  });
};

function update(request) {
  return caches.open(CACHE).then((cache) => {
    return fetch(request).then((response) => {
      return cache.put(request, response);
    });
  });
};