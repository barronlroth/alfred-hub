const CACHE='sf-party-bingo-shell-v3';
const BASE=new URL('./',self.location).href;
const ASSETS=['./','./index.html','./style.css','./cards.js','./app.js'].map(p=>new URL(p,BASE).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||!event.request.url.startsWith(BASE))return;event.respondWith(fetch(event.request).catch(async()=>{const c=await caches.open(CACHE);return (await c.match(event.request))||(event.request.mode==='navigate'?await c.match(BASE):Response.error());}));});
