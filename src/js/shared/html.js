export const escapeHtml = value =>
  String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character])

const ICON_FILES_BY_NAME = {
  check: 'check.svg',
  edit: 'pen-line.svg',
  copy: 'copy.svg',
  clear: 'trash.svg',
  notCompleted:'droplet-off.svg',
  completed:'droplets.svg',
  ellipsisVertical:'ellipsis-vertical.svg',
  close:'close.svg'
}

export function renderIconMarkup(iconName) {
  const iconFileName = ICON_FILES_BY_NAME[iconName]
  if (!iconFileName) return ''

  return `<img class="ui-icon" src="../assets/icons/${iconFileName}" alt="" aria-hidden="true">`
}
