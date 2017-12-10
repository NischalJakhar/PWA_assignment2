var CACHE_STATIC_NAME = 'static-v2';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';


self.addEventListener('install',function (event) {
    console.log('[Service Worker] Installing Service Worker ...', event);

    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(function (cache) {
                console.log('[Service Worker] Precaching App Shell');
                cache.addAll([
                    '/',
                    '/index.html',
                    '/src/css/app.css',
                    'https://fonts.googleapis.com/css?family=Roboto:400,700',
                    'https://fonts.googleapis.com/icon?family=Material+Icons',
                    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
                    'src/css/main.css',
                    '/src/js/material.min.js',
                    '/src/js/main.js'



                ])
            })
    )

});

self.addEventListener('activate',function (event) {
    console.log('[Service Worker] Activating Service Worker ...', event);

    event.waitUntill(
      caches.keys()
          .then(function(keyList){
              return Promise.all(keyList.map(function (key) {
                  if(key !==CACHE_STATIC_NAME && key !== CACHE_STATIC_NAME){
                      return caches.delete(key);
                  }
              }));
          })
    );


    return self.clients.claim();
});

self.addEventListener('fetch',function (event) {

    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if(response){
                    return response;
                }
                else{
                    return fetch(event.request)
                        .then(function (newResponse) {
                            return caches.open(CACHE_DYNAMIC_NAME)
                                .then(function (cache) {
                                    cache.put(event.request.url , newResponse.clone());
                                    return newResponse;
                                })
                        })
                        .catch(function (err) {

                        });
                }
            })
    )

});
