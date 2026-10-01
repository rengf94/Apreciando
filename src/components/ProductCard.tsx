import { Unit } from '../lib/calculations'

interface ProductCardProps {
  label: string
  price: string
  quantity: string
  measurePerItem: string
  unit: Unit
  onPriceChange: (value: string) => void
  onQuantityChange: (value: string) => void
  onMeasurePerItemChange: (value: string) => void
  onUnitChange: (value: Unit) => void
  error?: string | null
}

const UNITS: { value: Unit; label: string }[] = [
  { value: 'metros', label: 'Metros (m)' },
  { value: 'litros', label: 'Litros (L)' },
  { value: 'kilos', label: 'Kilos (kg)' },
  { value: 'gramos', label: 'Gramos (g)' },
  { value: 'unidades', label: 'Unidades (pzs)' },
]

export default function ProductCard({
  label,
  price,
  quantity,
  measurePerItem,
  unit,
  onPriceChange,
  onQuantityChange,
  onMeasurePerItemChange,
  onUnitChange,
  error,
}: ProductCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 space-y-4">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{label}</h2>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Precio total del paquete
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-medium">
              $
            </span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-savings-500 focus:border-transparent transition-all text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Cantidad de ítems en el paquete
          </label>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            placeholder="Ej. 4"
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-savings-500 focus:border-transparent transition-all text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Medida por ítem
          </label>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={measurePerItem}
            onChange={(e) => onMeasurePerItemChange(e.target.value)}
            placeholder="Ej. 50"
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-savings-500 focus:border-transparent transition-all text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Unidad de medida
          </label>
          <select
            value={unit}
            onChange={(e) => onUnitChange(e.target.value as Unit)}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-savings-500 focus:border-transparent transition-all text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
          >
            {UNITS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}
    </div>
  )
}
