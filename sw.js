/* Mon Équilibre v1.2 - cache hors ligne; les pages sont récupérées du réseau quand c'est possible. */
const VERSION='v1.2';
const PREFIX='mon-equilibre:'+self.registration.scope+':';
const CACHE=PREFIX+VERSION;
const ASSETS=['./','./index.html','./style.css','./app.js','./db.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await cache.addAll(ASSETS.map(path=>new Request(path,{cache:'reload'})));
  // Ne pas forcer l'activation pendant la saisie d'un formulaire.
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url), scope=new URL(self.registration.scope);
  if(url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    // Network-first évite de bloquer indéfiniment l'interface sur un vieux fichier.
    // Cache fallback permet de rester hors ligne.
    try{
      const response=await fetch(request,{cache:'no-store'});
      if(response.ok)await cache.put(request,response.clone());
      return response;
    }catch(error){
      const cached=await cache.match(request,{ignoreSearch:true});
      if(cached)return cached;
      return new Response('Ressource indisponible hors ligne',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
    }
  })());
});
