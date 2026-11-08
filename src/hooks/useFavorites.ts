import { useState, useEffect, useCallback } from 'react'
import { ProductInput } from '../lib/calculations'

export interface FavoriteEntry {
  id: string
  name: string
  note: string
  unit: string
  price: number
  quantity: number
  measurePerItem: number
  pricePerUnit: number
  addedAt: string
}

const STORAGE_KEY = 'apreciando_favorites'

function loadFavorites(): FavoriteEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveFavorites(entries: FavoriteEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch { /* ignorar */ }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>(loadFavorites)

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  const addFavorite = useCallback((input: ProductInput, pricePerUnit: number, name: string, note: string) => {
    const entry: FavoriteEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      name,
      note,
      unit: input.unit,
      price: input.price,
      quantity: input.quantity,
      measurePerItem: input.measurePerItem,
      pricePerUnit,
      addedAt: new Date().toISOString(),
    }
    setFavorites((prev) => [entry, ...prev])
    return entry
  }, [])

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const clearFavorites = useCallback(() => setFavorites([]), [])

  return { favorites, addFavorite, removeFavorite, clearFavorites }
}
