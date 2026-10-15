
import { renderIconMarkup } from '../html.js'

export function closeDayMenus() {
  document.querySelectorAll('.menu-pop.open').forEach(menuElement => {
    menuElement.classList.remove('open')
  })

  document.querySelectorAll('.day-menu[aria-expanded="true"]').forEach(menuButton => {
    menuButton.setAttribute('aria-expanded', 'false')
    menuButton.innerHTML = renderIconMarkup('ellipsisVertical')
  })
}

export function toggleDayMenu(menuButton) {
  const dateKey = menuButton.dataset.menu
  const menuElement = document.querySelector(
    `.menu-pop[data-pop="${dateKey}"]`
  )

  if (!menuElement) return

  const isOpen = menuButton.getAttribute('aria-expanded') === 'true'

  closeDayMenus()

  if (isOpen) return

  menuElement.classList.add('open')
  menuButton.setAttribute('aria-expanded', 'true')
  menuButton.innerHTML = renderIconMarkup('close')
}
