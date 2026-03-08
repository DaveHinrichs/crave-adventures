import { useEffect, useRef, useState } from 'react'

export function useAutosave(value, onSave, delay = 800) {
  const [status, setStatus] = useState('idle')
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }

    const timer = setTimeout(async () => {
      setStatus('saving')
      try {
        await onSave(value)
        setStatus('saved')
      } catch {
        setStatus('error')
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, onSave, value])

  return status
}
