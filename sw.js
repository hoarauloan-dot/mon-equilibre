/* Modifier VERSION lors de chaque publication de nouveaux fichiers (v2, v3...). */
const VERSION='v1';
const PREFIX='mon-equilibre:'+self.registration.scope+':';
const CACHE=PREFIX+VERSION;
const ASSETS=['./','./index.html','./style.css','./app.js','./db.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);/* Pas de skipWaiting automatique : les formulaires ouverts sont préservés. */})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})());});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;const u=new URL(event.request.url);if(!u.pathname.startsWith(new URL(self.registration.scope).pathname))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);const found=await cache.match(event.request,{ignoreSearch:true});if(found)return found;try{return await fetch(event.request)}catch{return new Response('Ressource indisponible hors ligne',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})}})());});
