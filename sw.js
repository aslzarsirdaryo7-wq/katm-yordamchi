const C='katm-v11';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==C).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const own=new URL(e.request.url).origin===location.origin;
  e.respondWith(caches.open(C).then(async c=>{
    const put=r=>{if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone());return r};
    if(own){ // o'z fayllarimiz: avval internetdan (yangilanish darhol keladi), internet yo'q bo'lsa keshdan
      try{return put(await fetch(e.request))}catch(x){const h=await c.match(e.request);if(h)return h;throw x}
    }
    const hit=await c.match(e.request); // OCR kutubxonasi: keshdan
    return hit||put(await fetch(e.request));
  }));
});
