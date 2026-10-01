import { HistoryEntry } from '../hooks/useHistory'
import { formatCurrency } from '../lib/calculations'

interface HistoryProps {
  entries: HistoryEntry[]
  onClear: () => void
  onRemove: (id: string) => void
  onReuse: (entry: HistoryEntry) => void
}

export default function History({ entries, onClear, onRemove, onReuse }: HistoryProps) {
  if (entries.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span>📋</span> Historial
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
          <HistoryItem key={entry.id} entry={entry} onRemove={onRemove} onReuse={onReuse} />
        ))}
      </div>
    </div>
  )
}

function HistoryItem({
  entry,
  onRemove,
  onReuse,
}: {
  entry: HistoryEntry
  onRemove: (id: string) => void
  onReuse: (entry: HistoryEntry) => void
}) {
  const { result, date } = entry
  const dateObj = new Date(date)
  const dateStr = dateObj.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
          {result.winner === 'tie' ? '🤝 Empate' : `🏆 Gana Producto ${result.winner}`}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {dateStr} · Ahorro: {formatCurrency(result.savingsAmount)}
        </p>
      </div>
      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={() => onReuse(entry)}
          className="text-savings-600 hover:text-savings-700 dark:text-savings-400 dark:hover:text-savings-300 p-1"
          aria-label="Reutilizar comparación"
          title="Reutilizar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={() => onRemove(entry.id)}
          className="text-gray-300 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-1"
          aria-label="Eliminar"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
