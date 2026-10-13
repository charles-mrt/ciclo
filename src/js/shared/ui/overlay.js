import { getElement } from '../dom.js'
import { closeDayMenus } from './menus.js'

export function closeOverlay(overlayId) {
  getElement(overlayId).classList.remove('open')
}

export function openOverlay(overlayId) {
  closeDayMenus()
  getElement(overlayId).classList.add('open')
}

export function bindOverlayEvents() {
  document.querySelectorAll('[data-close]').forEach(closeButton => {
    closeButton.addEventListener('click', () => {
      closeOverlay(closeButton.getAttribute('data-close'))
    })
  })

  document.querySelectorAll('.overlay').forEach(overlayElement => {
    overlayElement.addEventListener('click', event => {
      if (event.target === overlayElement) closeOverlay(overlayElement.id)
    })
  })

  window.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return

    document.querySelectorAll('.overlay.open').forEach(overlayElement => {
      closeOverlay(overlayElement.id)
    })
    closeDayMenus()
  })
}
