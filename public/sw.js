const staticCache = 'static-app-files-v1'
const dynamicCache = 'dinamic-app-files-v1'

const ASSETS = [
    '/',
    '/index.html',
    '/app-sw.js',
    '/manifest.json',
    '/assets/icon-48.png',
    '/assets/icon-192.png',
    '/offline.html'
]

self.addEventListener('install', async (e) => {
    const cashe = await caches.open(staticCache)
    await cashe.addAll(ASSETS)
})

self.addEventListener('activate', async () => {
    const cachesKeys = await caches.keys()
    await Promise.all(cachesKeys.filter(key => key !== staticCache && key !== dynamicCache).map(key => caches.delete(key)))
})

self.addEventListener('fetch', (event) => {
    event.respondWith(cacheFirst(event.request))
})

async function cacheFirst(request) {
    const cached = await caches.match(request)
    try {
        return cached ?? await fetch(request).then(() => {
            return networkFirst(request)
        })
    } catch (e) {
        return networkFirst(request)
    }
}

async function networkFirst(request) {
    const cache = await caches.open(dynamicCache)
    try {
        const response = await fetch(request)
        await cache.put(request, response.clone())
        return response
    } catch (e) {
        const cached = await cache.match(request)
        if (cached) return cached
        else if (request.mode === 'navigate') {
            return await caches.match('/offline.html')
        }
        return new Response('', { status: 503, statusText: 'Offline'}) 
    }
}