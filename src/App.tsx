import { useState } from 'react'
import ProductCard from './components/ProductCard'
import ComparisonResult from './components/ComparisonResult'
import AdBanner from './components/AdBanner'
import History from './components/History'
import { useHistory, HistoryEntry } from './hooks/useHistory'
import { useDarkMode } from './hooks/useDarkMode'
import { useInstallPrompt } from './hooks/useInstallPrompt'
import {
  Unit,
  ProductInput,
  ComparisonResult as ComparisonResultType,
  compareProducts,
} from './lib/calculations'

function App() {
  // Producto A
  const [priceA, setPriceA] = useState('')
  const [quantityA, setQuantityA] = useState('')
  const [measureA, setMeasureA] = useState('')
  const [unitA, setUnitA] = useState<Unit>('metros')

  // Producto B
  const [priceB, setPriceB] = useState('')
  const [quantityB, setQuantityB] = useState('')
  const [measureB, setMeasureB] = useState('')
  const [unitB, setUnitB] = useState<Unit>('metros')

  const [result, setResult] = useState<ComparisonResultType | null>(null)
  const [errorA, setErrorA] = useState<string | null>(null)
  const [errorB, setErrorB] = useState<string | null>(null)

  const { history, addEntry, clearHistory, removeEntry } = useHistory()
  const { isDark, toggle: toggleDark } = useDarkMode()
  const { isInstallable, isInstalled, installApp } = useInstallPrompt()

  const handleCompare = () => {
    setErrorA(null)
    setErrorB(null)
    setResult(null)

    const pA = parseFloat(priceA)
    const qA = parseFloat(quantityA)
    const mA = parseFloat(measureA)

    const pB = parseFloat(priceB)
    const qB = parseFloat(quantityB)
    const mB = parseFloat(measureB)

    let hasError = false

    if (isNaN(pA) || pA <= 0) {
      setErrorA('Ingresa un precio válido')
      hasError = true
    }
    if (isNaN(qA) || qA <= 0) {
      setErrorA('Ingresa una cantidad válida')
      hasError = true
    }
    if (isNaN(mA) || mA <= 0) {
      setErrorA('Ingresa una medida válida')
      hasError = true
    }

    if (isNaN(pB) || pB <= 0) {
      setErrorB('Ingresa un precio válido')
      hasError = true
    }
    if (isNaN(qB) || qB <= 0) {
      setErrorB('Ingresa una cantidad válida')
      hasError = true
    }
    if (isNaN(mB) || mB <= 0) {
      setErrorB('Ingresa una medida válida')
      hasError = true
    }

    if (hasError) return

    const productA: ProductInput = {
      price: pA,
      quantity: qA,
      measurePerItem: mA,
      unit: unitA,
    }

    const productB: ProductInput = {
      price: pB,
      quantity: qB,
      measurePerItem: mB,
      unit: unitB,
    }

    try {
      const comparison = compareProducts(productA, productB)
      setResult(comparison)
      addEntry(comparison)
    } catch (err) {
      if (err instanceof Error) {
        setErrorA(err.message)
      }
    }
  }

  const handleReuse = (entry: HistoryEntry) => {
    const { productA, productB } = entry.result
    setPriceA(productA.input.price.toString())
    setQuantityA(productA.input.quantity.toString())
    setMeasureA(productA.input.measurePerItem.toString())
    setUnitA(productA.input.unit)
    setPriceB(productB.input.price.toString())
    setQuantityB(productB.input.quantity.toString())
    setMeasureB(productB.input.measurePerItem.toString())
    setUnitB(productB.input.unit)
    setResult(null)
    setErrorA(null)
    setErrorB(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <span className="text-2xl">⚖️</span>
              ComparaPrecios
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Descubre qué producto es realmente más barato
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isInstallable && !isInstalled && (
              <button
                onClick={installApp}
                className="bg-savings-600 hover:bg-savings-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
              >
                Instalar app
              </button>
            )}
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-5 pb-24">
        <ProductCard
          label="Producto A"
          price={priceA}
          quantity={quantityA}
          measurePerItem={measureA}
          unit={unitA}
          onPriceChange={setPriceA}
          onQuantityChange={setQuantityA}
          onMeasurePerItemChange={setMeasureA}
          onUnitChange={setUnitA}
          error={errorA}
        />

        <ProductCard
          label="Producto B"
          price={priceB}
          quantity={quantityB}
          measurePerItem={measureB}
          unit={unitB}
          onPriceChange={setPriceB}
          onQuantityChange={setQuantityB}
          onMeasurePerItemChange={setMeasureB}
          onUnitChange={setUnitB}
          error={errorB}
        />

        {/* Botón comparar */}
        <button
          onClick={handleCompare}
          className="w-full bg-savings-600 hover:bg-savings-700 active:bg-savings-800 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-savings-600/30 transition-all active:scale-[0.98] text-lg"
        >
          Comparar precios
        </button>

        {/* Resultados */}
        {result && (
          <>
            <AdBanner position="middle" />
            <ComparisonResult result={result} />
          </>
        )}

        {/* Historial */}
        <History
          entries={history}
          onClear={clearHistory}
          onRemove={removeEntry}
          onReuse={handleReuse}
        />
      </main>

      {/* Banner inferior fijo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-3">
        <div className="max-w-lg mx-auto">
          <AdBanner position="bottom" />
        </div>
      </div>
    </div>
  )
}

export default App
