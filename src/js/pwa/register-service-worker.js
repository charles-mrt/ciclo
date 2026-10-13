/**
 * Registra o service worker na raiz do projeto (../../../sw.js),
 * cobrindo src/ e assets/ sem exigir cabeçalho Service-Worker-Allowed.
 *
 * Caminho relativo a este arquivo: src/js/pwa/ → ../../../sw.js
 */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
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
            console.info('[ciclo] Nova versão disponível. Recarregue para atualizar.')
          }
        })
      })

      return registration
    })
    .catch(error => {
      console.warn('[ciclo] Não foi possível registrar o service worker:', error)
      return null
    })
}
