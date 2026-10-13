import {
  getTodayDateKey,
  isFutureDateKey,
  isValidDateKey
} from '../dates/date-keys.js'
import { getDayRecord, updateDayRecord } from '../persistence/day-records.js'
import { deepClone } from '../shared/clone.js'
import { getUserFacingErrorMessage } from '../shared/errors.js'
import { showToast } from '../shared/ui/toast.js'
import { renderCalendar } from './render.js'

export async function toggleDayCompletion(dateKey) {
  if (!isValidDateKey(dateKey)) return

  if (isFutureDateKey(dateKey)) {
    showToast('Não é possível marcar um dia futuro como concluído.')
    return
  }

  try {
    await updateDayRecord(dateKey, record => {
      record.completed = !record.completed
      return record
    })

    await renderCalendar()
  } catch (error) {
    showToast(getUserFacingErrorMessage('Erro ao alterar a conclusão', error))
  }
}

export async function clearDayCompletion(dateKey) {
  if (isFutureDateKey(dateKey)) {
    showToast('Não é possível alterar a conclusão de um dia futuro.')
    return
  }

  try {
    await updateDayRecord(dateKey, record => {
      record.completed = false
      return record
    })

    await renderCalendar()
    showToast('Conclusão limpa.')
  } catch (error) {
    showToast(getUserFacingErrorMessage('Erro ao limpar a conclusão', error))
  }
}

export async function promptCopyItemsFromDay(targetDateKey) {
  const sourceDateInput = prompt(
    `Copiar itens de qual data?\nDigite no formato AAAA-MM-DD (ex.: ${getTodayDateKey()})`,
    getTodayDateKey()
  )

  if (!sourceDateInput) return

  const sourceDateKey = sourceDateInput.trim()

  if (!isValidDateKey(sourceDateKey)) {
    showToast('Use uma data válida no formato AAAA-MM-DD.')
    return
  }

  try {
    const sourceRecord = await getDayRecord(sourceDateKey)

    if (!sourceRecord || !Array.isArray(sourceRecord.items)) {
      showToast('Nenhum registro encontrado para a data informada.')
      return
    }

    const copiedItems = deepClone(sourceRecord.items)

    await updateDayRecord(targetDateKey, record => {
      record.items = copiedItems
      return record
    })

    await renderCalendar()
    showToast('Itens copiados com sucesso!')
  } catch (error) {
    showToast(getUserFacingErrorMessage('Erro ao copiar os itens', error))
  }
}
