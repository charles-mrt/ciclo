import {
  formatShortWeekday,
  getTodayDateKey,
  parseDateKey
} from '../dates/date-keys.js'
import { getCycleStartDateKey } from '../cycle/cycle-state.js'
import { getCycleDayFlags } from '../cycle/schedule.js'
import { getItemsTemplate } from '../persistence/template-store.js'
import { escapeHtml, renderIconMarkup } from '../shared/html.js'
import { normalizeItem } from '../shared/items.js'

function renderItemMarkup(item, itemIndex) {
  const itemName = escapeHtml(item.name || 'Nada')
  const itemDetail = [item.quantity, item.instruction].filter(Boolean).join(' · ')

  return `<div class="item-line item-${itemIndex + 1}">
    <span class="item-dot"></span>
    <span>
      <span class="item-name">${itemName}</span>
      ${itemDetail ? ` <span class="item-detail">${escapeHtml(itemDetail)}</span>` : '<img class="dose-icon" src="../assets/icons/droplet-off.svg" alt="" aria-hidden="true">'}
      </span>
  </div>`
}

export function renderDayMarkup(dayRecord) {
  const dateKey = dayRecord.date
  const date = parseDateKey(dateKey)
  const todayDateKey = getTodayDateKey()
  const isToday = dateKey === todayDateKey
  const isCompleted = Boolean(dayRecord.completed)
  const isNotCompleted = Boolean(dayRecord.notCompleted)
  const isFuture = dateKey > todayDateKey
  const dayItems = Array.isArray(dayRecord.items) ? dayRecord.items : getItemsTemplate()

  const {
    isOutsideCycle,
    isCycleStart,
    isCycleEnd
  } = getCycleDayFlags(getCycleStartDateKey(), dateKey)

  return `<div class="day ${isToday ? 'today' : ''} ${isCompleted ? 'completed' : ''} ${isNotCompleted ? 'not-completed' : ''}  ${isFuture ? 'future' : ''} ${isOutsideCycle ? 'outside-cycle' : ''}"
    data-date="${dateKey}"
    role="button"
    tabindex="${isFuture ? '-1' : '0'}"
    aria-disabled="${isFuture ? 'true' : 'false'}"
    aria-label="${date.toLocaleDateString('pt-BR', { dateStyle: 'full' })}${isFuture ? ', dia futuro, indisponível' : isCompleted ? ', concluído' : isNotCompleted ? ', não realizado' : ', não marcado'}"
    aria-pressed="${isCompleted}">
    <div class="day-head">
      <div class="day-date">
        <span class="day-num">${date.getDate()}</span>
        <span class="day-name">${formatShortWeekday(date)}</span>
        ${isToday ? '<span class="today-tag">Hoje</span>' : ''}
        ${isCycleStart ? '<span class="cycle-badge start">Início</span>' : ''}
        ${isCycleEnd ? '<span class="cycle-badge end">Fim</span>' : ''}
      </div>
     <button
  class="day-menu"
  data-menu="${dateKey}"
  aria-label="Ações para ${date.toLocaleDateString('pt-BR')}"
  aria-expanded="false"
>
  ${renderIconMarkup('ellipsisVertical')}
</button>
    </div>

    <div class="items">
      ${[0, 1, 2].map(itemIndex =>
        renderItemMarkup(normalizeItem(dayItems[itemIndex] || { name: 'Nada' }), itemIndex)
      ).join('')}
    </div>

    <div class="day-status">
      ${
        isCompleted
          ? renderIconMarkup('completed')
          : isNotCompleted
            ? renderIconMarkup('notCompleted')
            : '<span class="status-empty" aria-hidden="true"></span>'
      }
      <span>${
        isCompleted
          ? 'Concluído'
          : isNotCompleted
            ? 'Não realizado'
            : isFuture
              ? 'Dia futuro'
              : 'Não marcado'
      }</span>
    </div>

    <div class="menu-pop" data-pop="${dateKey}" role="menu">
      <button data-action="edit" data-date="${dateKey}" role="menuitem">
        ${renderIconMarkup('edit')}Editar itens do dia
      </button>
      
      <button data-action="toggle" data-date="${dateKey}" role="menuitem" ${isFuture ? 'disabled aria-disabled="true" title="Não é possível concluir um dia futuro"' : ''}>
        ${renderIconMarkup('completed')}${isCompleted ? 'Desmarcar conclusão' : 'Marcar como concluído'}
      </button>
      
      <button data-action="mark-not-completed" data-date="${dateKey}" role="menuitem" ${isFuture ? 'disabled aria-disabled="true" title="Não é possível alterar um dia futuro"' : ''}>
        ${renderIconMarkup('notCompleted')}${isNotCompleted ? 'Desmarcar como não realizado' : 'Marcar como não realizado'}
      </button>
      
      <button data-action="copy" data-date="${dateKey}" role="menuitem">${renderIconMarkup('copy')}
        Copiar itens de outro dia
      </button>
      
      <button data-action="clear" data-date="${dateKey}" role="menuitem" class="danger" ${isFuture ? 'disabled aria-disabled="true" title="Não é possível alterar a conclusão de um dia futuro"' : ''}>
       ${renderIconMarkup('clear')}Limpar conclusão
      </button>
    </div>
  </div>`
}
