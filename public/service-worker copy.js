const APP_SHELL_CACHE = 'staticResoucesCache';
const DYNAMIC_CACHE = 'site-dynamic-v1'

const STATIC_ASSET_URLS = [
    '/apps',
    '/',
    '/pwa-fallback.html',
    '/images/logo.svg',

    //icons
    '/static/media/plug-logo-icon.33390238e800dc64b3869368660b3702.svg',
    '/static/media/search-input-icon.c02fd02f712d53b65f40e4a5a0899854.svg',
    '/static/media/notifications_icon.c9fa7309da23fc3e89d79e5456ab7593.svg',
    '/static/media/plug-logo.0dc1821eeffe63cd66f0f3c7f6ac6299.svg',
    '/static/media/nav-apps-inactive-icon.e36defb229a8e17dd45c513a7ff92b81.svg',
    '/static/media/dropdown-arrow-down-inactive.0cfb599e852159287d10aa5401c05186.svg',
    '/static/media/nav-analytics-inactive-icon.246498ede8166fd6eb742c71266a3ad0.svg',
    '/static/media/nav-integrations-inactive-icon.2cd7f85d4c287b6ec47324687890adc0.svg',
    '/static/media/nav-datasheets-inactive-icon.efce7b74653e6a0d6ff679452d0a372c.svg',
    '/static/media/nav-dashboards-inactive-icon.689c6aa8078ba0831b1da8f37a634170.svg',
    '/static/media/nav-settings-inactive-icon.06da7168424cb62055fea20f0b332c57.svg',
    '/static/media/nav-support-inactive-icon.8c65112d8b83dc50df429c2e1614e852.svg',
    '/static/media/nav-logout-inactive-icon.c53ec0b9e2d4dfd59ff2edec36609735.svg',
    '/static/media/applist-single-img.416df48c69be29650450db63767ca46a.svg',
    '/static/media/edit-icon.ea740037d670335d2e3056987577df18.svg',
    '/static/media/file-copy-icon.deac42c154a68bd0709929f5d7ff3ce4.svg',
    '/static/media/menu-dots-icon.7b2a9c10e83a78d98db6568242433ab5.svg',

    //fonts
    'https://fonts.gstatic.com/s/materialicons/v141/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',

    //js
    "https://apis.google.com/js/api.js",
    "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://cdn.rawgit.com/abdennour/react-csv/6424b500/cdn/react-csv-latest.min.js",
];

const cacheServerResponse = (cacheName, itemsToBeStored) => {
    caches.open(cacheName)
    .then((cache) => {
        cache.addAll(itemsToBeStored);
    })
    .catch((error) => console.log(''))
};

self.addEventListener('install', (event) => {
    // cache static assets whenever service worker is installed
    return event.waitUntil(
        cacheServerResponse(APP_SHELL_CACHE, STATIC_ASSET_URLS)
    )
});

self.addEventListener('activate', (event) => {
    // clear previous caches
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== APP_SHELL_CACHE)
                    .map(key => caches.delete(key))
            )
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((cacheResponse) => {
            if (cacheResponse) {
                return cacheResponse
            };
            
            //cache pages if they were not stored prior
            // return fetch(event.request)
            //         .then((fetchedResults) => {
            //             //do not cache responses, so we can return the error page
            //             // cache.put(event.request.url,  fetchedResults.clone());
            //             return fetchedResults;
            // });

        }).catch((e) => { 
            return caches.match('/pwa-fallback.html')
        })
    );
});