const DATABASE_NAME = 'ciclo-calendar-db'
const DATABASE_VERSION = 1
export const DAYS_OBJECT_STORE = 'days'

let database = null
let usesMemoryFallback = false
const inMemoryRecords = new Map()

export function isUsingMemoryFallback() {
  return usesMemoryFallback
}

export function getDatabase() {
  return database
}

export function getInMemoryRecords() {
  return inMemoryRecords
}

export function enableMemoryFallback() {
  usesMemoryFallback = true
  database = null
}

export function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB não está disponível.'))
      return
    }

    const openRequest = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    openRequest.onupgradeneeded = () => {
      const upgradeDatabase = openRequest.result

      if (!upgradeDatabase.objectStoreNames.contains(DAYS_OBJECT_STORE)) {
        upgradeDatabase.createObjectStore(DAYS_OBJECT_STORE, { keyPath: 'date' })
      }
    }

    openRequest.onsuccess = () => {
      const openedDatabase = openRequest.result

      openedDatabase.onversionchange = () => {
        openedDatabase.close()
        if (database === openedDatabase) database = null
      }

      openedDatabase.onclose = () => {
        if (database === openedDatabase) database = null
      }

      database = openedDatabase
      usesMemoryFallback = false
      resolve(openedDatabase)
    }

    openRequest.onerror = () => {
      reject(openRequest.error || new Error('Falha ao abrir o banco.'))
    }

    openRequest.onblocked = () => {
      console.warn('[ciclo] A abertura do banco está bloqueada por outra conexão.')
    }
  })
}

export function clearAllDatabaseRecords() {
  if (usesMemoryFallback) {
    inMemoryRecords.clear()
    return Promise.resolve()
  }

  if (!database) return Promise.reject(new Error('Banco de dados indisponível.'))

  return new Promise((resolve, reject) => {
    try {
      const transaction = database.transaction(DAYS_OBJECT_STORE, 'readwrite')
      transaction.objectStore(DAYS_OBJECT_STORE).clear()

      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error || new Error('Falha ao limpar o banco.'))
      transaction.onabort = () => reject(transaction.error || new Error('Limpeza do banco cancelada.'))
    } catch (error) {
      reject(error)
    }
  })
}
