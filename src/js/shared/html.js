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
  clear: 'trash.svg'
}

export function renderIconMarkup(iconName) {
  if (iconName === 'dots') {
    return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round"
      aria-hidden="true">
      <circle cx="5" cy="12" r="1"/>
      <circle cx="12" cy="12" r="1"/>
      <circle cx="19" cy="12" r="1"/>
    </svg>`
  }

  const iconFileName = ICON_FILES_BY_NAME[iconName]
  if (!iconFileName) return ''

  return `<img class="ui-icon" src="../assets/icons/${iconFileName}" alt="" aria-hidden="true">`
}
