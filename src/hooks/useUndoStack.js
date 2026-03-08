import { useCallback, useState } from 'react'

export function useUndoStack(initialState) {
  const [history, setHistory] = useState([initialState])
  const [index, setIndex] = useState(0)

  const present = history[index]

  const push = useCallback((nextState) => {
    setHistory((current) => [...current.slice(0, index + 1), nextState])
    setIndex((prev) => prev + 1)
  }, [index])

  const undo = useCallback(() => setIndex((prev) => Math.max(0, prev - 1)), [])
  const redo = useCallback(() => setIndex((prev) => Math.min(history.length - 1, prev + 1)), [history.length])

  return {
    state: present,
    push,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
  }
}
