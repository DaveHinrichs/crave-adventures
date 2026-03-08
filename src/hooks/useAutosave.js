import { useEffect, useRef, useState } from 'react'

export function useAutosave(value, onSave, delay = 800) {
  const [status, setStatus] = useState('idle')
  const first = useRef(true)
  const lastSavedValue = useRef(null)

  useEffect(() => {
    if (!value) return

    const serializedValue = JSON.stringify(value)

    if (first.current) {
      first.current = false
      lastSavedValue.current = serializedValue
      return
    }

    if (lastSavedValue.current === serializedValue) {
      return
    }

    const timer = setTimeout(async () => {
      setStatus('saving')
      try {
        await onSave(value)
        lastSavedValue.current = serializedValue
        setStatus('saved')
      } catch {
        setStatus('error')
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, onSave, value])

  return status
}
