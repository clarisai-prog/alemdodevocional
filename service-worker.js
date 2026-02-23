// Service Worker v1 para Além do Devocional
const CACHE_NAME = 'alem-devocional-v1';

// Lista de versões antigas para limpeza
const OLD_CACHE_VERSIONS = [];

// Assets a cachear (usando caminhos relativos à base)
const ASSETS_TO_CACHE = [
  '/al-m-do-devocional/',
  '/al-m-do-devocional/index.html',
  '/al-m-do-devocional/manifest.json',
  '/al-m-do-devocional/icon-192.png',
  '/al-m-do-devocional/icon-192-maskable.png',
  '/al-m-do-devocional/icon-512.png',
  '/al-m-do-devocional/icon-512-maskable.png'
];

// Install event - cachear assets na instalação
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v1...');
  
  event.waitUntil(
    // Limpar caches antigos
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && OLD_CACHE_VERSIONS.includes(cacheName)) {
            console.log('[SW] Deletando cache antiga:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Abrir novo cache
      return caches.open(CACHE_NAME);
    }).then((cache) => {
      console.log('[SW] Cacheando assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch((error) => {
      console.error('[SW] Erro ao cachear:', error);
    })
  );
  
  // Força a ativação imediata
  self.skipWaiting();
});

// Fetch event - stratégia Cache-First
self.addEventListener('fetch', (event) => {
  // Ignorar requisições do Chrome extension
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se encontrou no cache, retorna
        if (response) {
          console.log('[SW] Cache hit:', event.request.url);
          return response;
        }

        // Se não encontrou, faz fetch
        return fetch(event.request)
          .then((response) => {
            // Se não é uma resposta válida, retorna
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clona a resposta para cachear
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
      .catch((error) => {
        console.error('[SW] Fetch failed:', error);
        
        // Retorna página offline se disponível
        return caches.match('/al-m-do-devocional/index.html');
      })
  );
});

// Activate event - limpeza de caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Limpando cache antiga:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Força o novo SW a assumir o controle imediatamente
  self.clients.claim();
});

// Message event - comunicação com cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
