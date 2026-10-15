/**
 * Registra o Service Worker na raiz do projeto para a versão publicada.
 * Durante o desenvolvimento com Live Server, evita interferência do cache.
 *
 * Caminho relativo a este arquivo: src/js/pwa/ → ../../../sw.js
 */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return Promise.resolve(null)
  }

  // O Live Server usa JavaScript nativo, sem import.meta.env do Vite.
  // Controle o ambiente por uma configuração explícita no HTML.
  if (document.documentElement.dataset.environment === 'development') {
    return Promise.resolve(null)
  }

  const serviceWorkerUrl = new URL('../../../sw.js', import.meta.url)
  const scopeUrl = new URL('../../../', import.meta.url)

  return navigator.serviceWorker
    .register(serviceWorkerUrl, { scope: scopeUrl.pathname })
    .then(registration => {
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing

        if (!installingWorker) return

        installingWorker.addEventListener('statechange', () => {
          if (
            installingWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            console.info(
              '[ciclo] Nova versão disponível. Recarregue para atualizar.'
            )
          }
        })
      })

      return registration
    })
    .catch(error => {
      console.warn(
        '[ciclo] Não foi possível registrar o Service Worker:',
        error
      )

      return null
    })
}