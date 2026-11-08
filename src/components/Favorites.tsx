import { useState } from 'react'
import { FavoriteEntry } from '../hooks/useFavorites'
import { formatCurrency, formatMeasure } from '../lib/calculations'

interface FavoritesProps {
  entries: FavoriteEntry[]
  onRemove: (id: string) => void
  onClear: () => void
}

export default function Favorites({ entries, onRemove, onClear }: FavoritesProps) {
  if (entries.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span>⭐</span> Favoritos
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
        >
          Limpiar todo
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {entries.map((entry) => (
          <FavoriteItem key={entry.id} entry={entry} onRemove={onRemove} />
        ))}
      </div>
    </div>
  )
}

function FavoriteItem({ entry, onRemove }: { entry: FavoriteEntry; onRemove: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
          ⭐ {entry.name}
        </p>
        {entry.note && (
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
            {entry.note}
          </p>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {formatCurrency(entry.pricePerUnit)} / {entry.unit.slice(0, -1)} · {formatMeasure(entry.price)} x {entry.quantity} x {formatMeasure(entry.measurePerItem)} {entry.unit}
        </p>
      </div>
      <button
        onClick={() => onRemove(entry.id)}
        className="text-gray-300 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-1 ml-2"
        aria-label="Quitar de favoritos"
      >
        ✕
      </button>
    </div>
  )
}

// Formulario para agregar favorito desde el resultado
interface AddFavoriteFormProps {
  winnerIndex: number | null
  productInput: { price: number; quantity: number; measurePerItem: number; unit: string } | null
  pricePerUnit: number | null
  onAdd: (name: string, note: string) => void
  onClose: () => void
}

export function AddFavoriteForm({ onAdd, onClose }: AddFavoriteFormProps) {
  const [name, setName] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed, note.trim())
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-savings-200 dark:border-savings-800 p-5 space-y-3 animate-fade-in">
      <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <span>⭐</span> Agregar a favoritos
      </h3>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nombre / Marca</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Pepsi 2L"
          required
          maxLength={60}
          autoFocus
          className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-savings-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Detalle (opcional)</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ej: Comprado en súper X, 1/11/2026"
          maxLength={80}
          className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-savings-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400"
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-savings-600 hover:bg-savings-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
          Guardar favorito
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
          Cancelar
        </button>
      </div>
    </form>
  )
}
