const CACHE_NAME = 'devocional-v1';
const RUNTIME_CACHE = 'devocional-runtime-v1';

// Assets críticos para funcionamento offline
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - cachear assets críticos
self.addEventListener('install', (event) => {
  console.log('[PWA] Service Worker instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[PWA] Cacheando assets críticos');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch((error) => {
      console.error('[PWA] Erro ao instalar SW:', error);
    })
  );
  
  // Força ativação imediata
  self.skipWaiting();
});

// Fetch event - estratégia Cache-First com fallback para Network
self.addEventListener('fetch', (event) => {
  // Ignora requisições de chrome extension
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Ignora requisições de web socket
  if (event.request.url.startsWith('ws://') || event.request.url.startsWith('wss://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna do cache se disponível
        if (response) {
          console.log('[PWA] Cache HIT:', event.request.url);
          return response;
        }

        // Tenta fazer fetch
        return fetch(event.request)
          .then((networkResponse) => {
            // Valida resposta
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Se é GET, caches a resposta para próximas requisições
            if (event.request.method === 'GET') {
              const responseToCache = networkResponse.clone();
              caches.open(RUNTIME_CACHE)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }

            return networkResponse;
          })
          .catch((error) => {
            console.error('[PWA] Fetch falhou:', event.request.url, error);
            
            // Fallback: retorna página offline se disponível
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // Para outros tipos, retorna erro
            return new Response('Recurso não disponível offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Activate event - limpeza de caches antigos
self.addEventListener('activate', (event) => {
  console.log('[PWA] Service Worker ativando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Remove caches antigos
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[PWA] Removendo cache antiga:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Toma controle de todas as páginas abertas imediatamente
  self.clients.claim();
});

// Message event - permite comunicação com página principal
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

