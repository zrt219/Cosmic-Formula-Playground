const CACHE='zspace-formula-playground-v3-7';
const ASSETS=['./','./index.html','./styles.css?v=3.7.0','./app.js?v=3.7.0','./formulas.mjs','./v3-model.mjs','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).catch(()=>{}));
});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(
    fetch(event.request).then(res=>{
      if(res&&res.status===200){
        const clone=res.clone();
        caches.open(CACHE).then(c=>c.put(event.request,clone));
      }
      return res;
    }).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html')||caches.match('./')))
  );
});
