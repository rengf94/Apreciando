import { ComparisonResult as ComparisonResultType, formatCurrency, formatMeasure } from '../lib/calculations'

interface ComparisonResultProps {
  result: ComparisonResultType
}

export default function ComparisonResult({ result }: ComparisonResultProps) {
  const { productA, productB, winner, savingsPercentage, savingsAmount } = result

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Banner de ahorro */}
      {winner !== 'tie' && (
        <div className="bg-gradient-to-r from-savings-500 to-savings-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="font-bold text-lg">
                ¡El Producto {winner} es más barato!
              </p>
              <p className="text-savings-100 text-sm">
                Ahorras {formatCurrency(savingsAmount)} por {productA.input.unit.slice(0, -1)}
              </p>
            </div>
          </div>
          <div className="mt-3 bg-white/20 rounded-xl px-4 py-2 inline-block">
            <span className="text-2xl font-bold">{savingsPercentage.toFixed(1)}%</span>
            <span className="text-sm ml-1">de ahorro</span>
          </div>
        </div>
      )}

      {winner === 'tie' && (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-5 text-center">
          <span className="text-3xl">🤝</span>
          <p className="font-bold text-gray-700 dark:text-gray-200 mt-2">Ambos productos tienen el mismo precio por unidad</p>
        </div>
      )}

      {/* Tarjetas de resultados */}
      <div className="grid grid-cols-2 gap-3">
        <ResultCard
          label="Producto A"
          pricePerUnit={productA.pricePerUnit}
          totalMeasure={productA.totalMeasure}
          unit={productA.input.unit}
          isWinner={winner === 'A'}
        />
        <ResultCard
          label="Producto B"
          pricePerUnit={productB.pricePerUnit}
          totalMeasure={productB.totalMeasure}
          unit={productB.input.unit}
          isWinner={winner === 'B'}
        />
      </div>
    </div>
  )
}

interface ResultCardProps {
  label: string
  pricePerUnit: number
  totalMeasure: number
  unit: string
  isWinner: boolean
}

function ResultCard({ label, pricePerUnit, totalMeasure, unit, isWinner }: ResultCardProps) {
  return (
    <div
      className={`rounded-2xl p-4 border-2 transition-all ${
        isWinner
          ? 'bg-savings-50 dark:bg-savings-900/20 border-savings-500 shadow-md scale-[1.02]'
          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
        {isWinner && <span className="text-lg">✅</span>}
      </div>
      <p className={`text-2xl font-bold ${isWinner ? 'text-savings-700 dark:text-savings-400' : 'text-gray-800 dark:text-gray-100'}`}>
        {formatCurrency(pricePerUnit)}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        por {unit.slice(0, -1)}
      </p>
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Total: {formatMeasure(totalMeasure)} {unit}
        </p>
      </div>
    </div>
  )
}
