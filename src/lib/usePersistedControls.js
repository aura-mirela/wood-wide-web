import { useControls } from 'leva'
import { useEffect, useState } from 'react'

function readPersisted(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function applyPersistedValues(schema, persisted) {
  if (!persisted || typeof persisted !== 'object') {
    return schema
  }

  const next = {}

  for (const [key, definition] of Object.entries(schema)) {
    const persistedValue = persisted[key]
    const isInputObject =
      typeof definition === 'object' && definition !== null && 'value' in definition

    if (isInputObject && typeof persistedValue === typeof definition.value) {
      next[key] = { ...definition, value: persistedValue }
    } else if (!isInputObject && typeof persistedValue === typeof definition) {
      next[key] = persistedValue
    } else {
      next[key] = definition
    }
  }

  return next
}

export function usePersistedControls(folderName, schema, storageKey = `leva:${folderName}`) {
  const [initialSchema] = useState(() => applyPersistedValues(schema, readPersisted(storageKey)))
  const values = useControls(folderName, initialSchema)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(values))
  }, [storageKey, values])

  return values
}
