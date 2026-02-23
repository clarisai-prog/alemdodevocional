import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Registrar Service Worker para PWA offline-first
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('✅ Service Worker registrado com sucesso:', registration);
        
        // Verificar por atualizações a cada 1 hora
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);

        // Notificar sobre atualizações disponíveis
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('ℹ️ Nova versão disponível! Recarregue para atualizar.');
              // Aqui você pode mostrar um toast/notification para o usuário
            }
          });
        });
      })
      .catch((error) => {
        console.error('❌ Erro ao registrar Service Worker:', error);
      });

    // Lidar com SW ativação
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker foi atualizado');
    });
  });
} else {
  console.warn('⚠️ Service Workers não suportados neste navegador');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
