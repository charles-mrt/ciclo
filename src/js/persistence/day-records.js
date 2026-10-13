import { deepClone } from '../shared/clone.js'
import {
  DAYS_OBJECT_STORE,
  getDatabase,
  getInMemoryRecords,
  isUsingMemoryFallback
} from './database.js'
import { createDefaultDayRecord } from './template-store.js'

export function getDayRecord(dateKey) {
  if (isUsingMemoryFallback()) {
    const record = getInMemoryRecords().get(dateKey)
    return Promise.resolve(record ? deepClone(record) : null)
  }

  const database = getDatabase()
  if (!database) return Promise.reject(new Error('Banco de dados indisponível.'))

  return new Promise((resolve, reject) => {
    try {
      const transaction = database.transaction(DAYS_OBJECT_STORE, 'readonly')
      const getRequest = transaction.objectStore(DAYS_OBJECT_STORE).get(dateKey)

      getRequest.onsuccess = () => {
        resolve(getRequest.result ? deepClone(getRequest.result) : null)
      }

      getRequest.onerror = () => reject(getRequest.error)
      transaction.onabort = () => reject(transaction.error || new Error('Leitura cancelada.'))
    } catch (error) {
      reject(error)
    }
  })
}

export function getAllDayRecords() {
  if (isUsingMemoryFallback()) {
    return Promise.resolve(
      [...getInMemoryRecords().values()].map(record => deepClone(record))
    )
  }

  const database = getDatabase()
  if (!database) return Promise.reject(new Error('Banco de dados indisponível.'))

  return new Promise((resolve, reject) => {
    try {
      const transaction = database.transaction(DAYS_OBJECT_STORE, 'readonly')
      const getAllRequest = transaction.objectStore(DAYS_OBJECT_STORE).getAll()

      getAllRequest.onsuccess = () => resolve(getAllRequest.result || [])
      getAllRequest.onerror = () => reject(getAllRequest.error)
      transaction.onabort = () => reject(transaction.error || new Error('Leitura cancelada.'))
    } catch (error) {
      reject(error)
    }
  })
}

export function updateDayRecord(dateKey, updateRecord) {
  if (isUsingMemoryFallback()) {
    const memoryStore = getInMemoryRecords()
    const currentRecord = memoryStore.get(dateKey)
    const workingRecord = currentRecord ? deepClone(currentRecord) : createDefaultDayRecord(dateKey)
    const updatedRecord = updateRecord(workingRecord) || workingRecord

    updatedRecord.date = dateKey
    updatedRecord.updatedAt = new Date().toISOString()
    memoryStore.set(dateKey, deepClone(updatedRecord))

    return Promise.resolve(deepClone(updatedRecord))
  }

  const database = getDatabase()
  if (!database) return Promise.reject(new Error('Banco de dados indisponível.'))

  return new Promise((resolve, reject) => {
    let transaction
    let savedRecord
    let hasSettled = false

    const rejectOnce = error => {
      if (hasSettled) return
      hasSettled = true
      reject(error || new Error('Falha ao atualizar o registro.'))
    }

    try {
      transaction = database.transaction(DAYS_OBJECT_STORE, 'readwrite')
      const objectStore = transaction.objectStore(DAYS_OBJECT_STORE)
      const getRequest = objectStore.get(dateKey)

      getRequest.onsuccess = () => {
        try {
          const currentRecord = getRequest.result
            ? deepClone(getRequest.result)
            : createDefaultDayRecord(dateKey)

          const updatedRecord = updateRecord(currentRecord) || currentRecord
          updatedRecord.date = dateKey
          updatedRecord.updatedAt = new Date().toISOString()

          savedRecord = deepClone(updatedRecord)
          objectStore.put(savedRecord)
        } catch (error) {
          try { transaction.abort() } catch (_) {}
          rejectOnce(error)
        }
      }

      getRequest.onerror = () => rejectOnce(getRequest.error)

      transaction.oncomplete = () => {
        if (hasSettled) return
        hasSettled = true
        resolve(savedRecord)
      }

      transaction.onerror = () => rejectOnce(transaction.error)
      transaction.onabort = () => rejectOnce(transaction.error || new Error('Transação cancelada.'))
    } catch (error) {
      rejectOnce(error)
    }
  })
}

export async function ensureDayRecord(dateKey) {
  return updateDayRecord(dateKey, record => record)
}

export async function getMonthDayRecords(year, monthIndex) {
  const allRecords = await getAllDayRecords()
  const monthPrefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}-`

  return new Map(
    allRecords.filter(record => record?.date?.startsWith(monthPrefix))
      .map(record => [record.date, record])
  )
}
