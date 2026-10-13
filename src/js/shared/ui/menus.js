export function closeDayMenus() {
  document.querySelectorAll('.menu-pop.open').forEach(menuElement => {
    menuElement.classList.remove('open')
  })

  document.querySelectorAll('.day-menu[aria-expanded="true"]').forEach(menuButton => {
    menuButton.setAttribute('aria-expanded', 'false')
  })
}
