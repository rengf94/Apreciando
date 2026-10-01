import { useState, useEffect, useCallback } from 'react'
import { ComparisonResult } from '../lib/calculations'

export interface HistoryEntry {
  id: string
  date: string
  result: ComparisonResult
}

const STORAGE_KEY = 'compareprecios_history'
const MAX_ENTRIES = 20

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // Storage lleno o no disponible — ignorar silenciosamente
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory)

  useEffect(() => {
    saveHistory(history)
  }, [history])

  const addEntry = useCallback((result: ComparisonResult) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      date: new Date().toISOString(),
      result,
    }
    setHistory((prev) => [entry, ...prev].slice(0, MAX_ENTRIES))
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return { history, addEntry, clearHistory, removeEntry }
}
