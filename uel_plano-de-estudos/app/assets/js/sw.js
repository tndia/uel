// sw.js — tiny offline cache for GH Pages (PWA-ish). Safe: no network analytics.
const CACHE = "uel-planner-pro-v2";
const CORE = [
  "./",
  "./index.html",
  "./setup.html",
  "./planner.html",
  "./modules.html",
  "./module.html",
  "./reviews.html",
  "./exercises.html",
  "./writing.html",
  "./literature.html",
  "./simulados.html",
  "./calendar.html",
  "./stats.html",
  "./about.html",
  "./assets/css/app.css",
  "./assets/css/print.css",
  "./assets/js/app.js",
  "./assets/js/storage.js",
  "./assets/js/ui.js",
  "./assets/js/content.js",
  "./assets/js/spaced.js",
  "./assets/js/planner.js",
  "./assets/data/content.json",
  "./assets/data/exercises.json",
  "./assets/data/writing_prompts.json",
  "./assets/data/references.json"
];

self.addEventListener("install", (e)=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate", (e)=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.map(k => (k===CACHE ? null : caches.delete(k)))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", (e)=>{
  const req = e.request;
  const url = new URL(req.url);
  if(url.origin !== location.origin) return;

  e.respondWith(
    caches.match(req).then(hit => {
      if(hit) return hit;
      return fetch(req).then(res=>{
        const copy = res.clone();
        caches.open(CACHE).then(c=>c.put(req, copy)).catch(()=>{});
        return res;
      }).catch(()=>hit);
    })
  );
});
