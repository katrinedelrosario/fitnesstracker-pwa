const staticCacheName = 'site-static-v1.2'

const assets = [
  '/index.html',
  '/app.js',
  '/style.css',
]

//register sw
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
  .then(reg => console.log('sw registered', reg))
  .catch(err => console.error('sw not registered', err))
}

//install sw & creates cache
self.addEventListener('install', (event) => {

  event.waitUntil(
      //creates cache & adds
      caches.open(staticCacheName)
      .then(cache => {
          cache.addAll(assets)
          console.log('caching all assets')
      })
  )
  console.log('sw installed')
}
)
//activate sw
self.addEventListener('activate', (event) => {
  console.log('activated sw', event)
  //filters and deletes caches that doesnt match updated new version
     event.waitUntil(
         caches.keys().then(keys => {
             const filteredkeys = keys.filter(key => key !== staticCacheName)
             filteredkeys.map(key => {
                 caches.delete(key)
             })
         })
    )    
})

//fetches
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cacheRes) => {
        if (cacheRes) {
          return cacheRes
        }
        return fetch(event.request)
          .then((networkResponse) => {
            const clonedResponse = networkResponse.clone()
            caches.open(staticCacheName).then((cache) => {
              cache.put(event.request, clonedResponse)
            })
            return networkResponse
          })
          .catch(() => {
            // handles requests that isnt in cache or fetched
            return new Response('offline content here')
          })
      })
  )
})