/* Ciclo PWA — service worker (escopo: pasta do projeto) */
'use strict'

const CACHE_VERSION = 'ciclo-static-v2'
const CACHE_NAME = CACHE_VERSION

const PRECACHE_URLS = [
  './src/ciclo.html',
  './src/manifest.webmanifest',
  './src/css/styles.css',
  './src/css/base.css',
  './src/css/layout.css',
  './src/css/calendar.css',
  './src/css/dialogs.css',
  './src/css/responsive.css',
  './src/js/main.js',
  './src/js/pwa/register-service-worker.js',
  './src/js/calendar/day-actions.js',
  './src/js/calendar/day-markup.js',
  './src/js/calendar/interactions.js',
  './src/js/calendar/render.js',
  './src/js/calendar/view-state.js',
  './src/js/cycle/cycle-state.js',
  './src/js/cycle/progress.js',
  './src/js/cycle/schedule.js',
  './src/js/cycle/start-cycle.js',
  './src/js/dates/date-keys.js',
  './src/js/day-editor/day-editor.js',
  './src/js/day-editor/item-fields.js',
  './src/js/day-editor/template-editor.js',
  './src/js/persistence/database.js',
  './src/js/persistence/day-records.js',
  './src/js/persistence/template-store.js',
  './src/js/restore/restore-database.js',
  './src/js/shared/clone.js',
  './src/js/shared/dom.js',
  './src/js/shared/errors.js',
  './src/js/shared/html.js',
  './src/js/shared/items.js',
  './src/js/shared/ui/menus.js',
  './src/js/shared/ui/overlay.js',
  './src/js/shared/ui/toast.js',
  './assets/logo.png',
  './assets/icons/calendar-clock.svg',
  './assets/icons/calendar-cog.svg',
  './assets/icons/check.svg',
  './assets/icons/chevron-left.svg',
  './assets/icons/chevron-right.svg',
  './assets/icons/close.svg',
  './assets/icons/copy.svg',
  './assets/icons/database-restore.svg',
  './assets/icons/droplet-off.svg',
  './assets/icons/maximize.svg',
  './assets/icons/pen-line.svg',
  './assets/icons/trash.svg',
  './assets/icons/triangle-alert.svg',
  './assets/icons/pwa/icon-192.png',
  './assets/icons/pwa/icon-512.png',
  './assets/icons/pwa/icon-maskable-512.png',
  './assets/icons/pwa/apple-touch-icon.png'
]

const APP_SHELL_URL = './src/ciclo.html'

function toAbsoluteUrl(path) {
  return new URL(path, self.location.href).href
}

const PRECACHE_ABSOLUTE = PRECACHE_URLS.map(toAbsoluteUrl)
const APP_SHELL_ABSOLUTE = toAbsoluteUrl(APP_SHELL_URL)

async function precacheAppShell() {
  const cache = await caches.open(CACHE_NAME)

  await Promise.all(
    PRECACHE_URLS.map(async path => {
      const request = new Request(path, { cache: 'reload' })

      try {
        const response = await fetch(request)

        if (!response.ok) {
          throw new Error(`Falha ao precachear ${path}: ${response.status}`)
        }

        await cache.put(request, response.clone())
      } catch (error) {
        console.warn('[ciclo-sw] Precache incompleto:', path, error)
        throw error
      }
    })
  )
}

async function deleteOutdatedCaches() {
  const keys = await caches.keys()

  await Promise.all(
    keys
      .filter(key => key.startsWith('ciclo-static-') && key !== CACHE_NAME)
      .map(key => caches.delete(key))
  )
}

function isSameOrigin(requestUrl) {
  return requestUrl.origin === self.location.origin
}

function shouldHandleFetch(request) {
  if (request.method !== 'GET') return false

  const url = new URL(request.url)

  if (!isSameOrigin(url)) return false

  // Não intercepta APIs externas; só recursos do app.
  return true
}

async function respondFromCacheOrNetwork(request) {
  const cachedResponse = await caches.match(request, { ignoreSearch: true })

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)

    // Em navegação sem cache, tenta o shell do app.
    if (!networkResponse.ok && request.mode === 'navigate') {
      const shell = await caches.match(APP_SHELL_ABSOLUTE, { ignoreSearch: true })
      if (shell) return shell
    }

    return networkResponse
  } catch (error) {
    if (request.mode === 'navigate') {
      const shell = await caches.match(APP_SHELL_ABSOLUTE, { ignoreSearch: true })
      if (shell) return shell
    }

    const fallback = await caches.match(request, { ignoreSearch: true })
    if (fallback) return fallback

    throw error
  }
}

self.addEventListener('install', event => {
  event.waitUntil(
    precacheAppShell()
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error('[ciclo-sw] Instalação falhou:', error)
        throw error
      })
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    deleteOutdatedCaches()
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  if (!shouldHandleFetch(event.request)) return

  event.respondWith(respondFromCacheOrNetwork(event.request))
})

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
