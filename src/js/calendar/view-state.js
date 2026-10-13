let viewedYear = new Date().getFullYear()
let viewedMonth = new Date().getMonth()

export function getViewedYear() {
  return viewedYear
}

export function getViewedMonth() {
  return viewedMonth
}

export function setViewedMonth(year, monthIndex) {
  viewedYear = year
  viewedMonth = monthIndex
}

export function goToPreviousMonth() {
  viewedMonth--

  if (viewedMonth < 0) {
    viewedMonth = 11
    viewedYear--
  }
}

export function goToNextMonth() {
  viewedMonth++

  if (viewedMonth > 11) {
    viewedMonth = 0
    viewedYear++
  }
}

export function goToCurrentMonth() {
  const now = new Date()
  viewedYear = now.getFullYear()
  viewedMonth = now.getMonth()
}
