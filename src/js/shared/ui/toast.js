import { getElement } from '../dom.js'

let toastHideTimeoutId = null

export function showToast(message) {
  const toastElement = getElement('toast')
  toastElement.textContent = message
  toastElement.classList.add('show')

  clearTimeout(toastHideTimeoutId)

  toastHideTimeoutId = setTimeout(() => {
    toastElement.classList.remove('show')
  }, 3000)
}
