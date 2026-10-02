import { useState } from 'react'
import ProductCard from './components/ProductCard'
import ComparisonResult from './components/ComparisonResult'
import AdBanner from './components/AdBanner'
import History from './components/History'
import InstallPromptModal from './components/InstallPromptModal'
import { useHistory, HistoryEntry } from './hooks/useHistory'
import { useDarkMode } from './hooks/useDarkMode'
import { useInstallPrompt } from './hooks/useInstallPrompt'
import {
  Unit,
  ProductInput,
  ComparisonResult as ComparisonResultType,
  compareProducts,
} from './lib/calculations'

interface ProductForm {
  price: string
  quantity: string
  measurePerItem: string
}

const UNITS: { value: Unit; label: string }[] = [
  { value: 'metros', label: 'Metros (m)' },
  { value: 'litros', label: 'Litros (L)' },
  { value: 'kilos', label: 'Kilos (kg)' },
  { value: 'gramos', label: 'Gramos (g)' },
  { value: 'unidades', label: 'Unidades (pzs)' },
]

function App() {
  // Unidad global compartida
  const [unit, setUnit] = useState<Unit>('metros')

  // Productos (2 o 3)
  const [products, setProducts] = useState<ProductForm[]>([
    { price: '', quantity: '', measurePerItem: '' },
    { price: '', quantity: '', measurePerItem: '' },
  ])

  const [result, setResult] = useState<ComparisonResultType | null>(null)
  const [errors, setErrors] = useState<(string | null)[]>([null, null])
  const [showInstallModal, setShowInstallModal] = useState(false)

  const { history, addEntry, clearHistory, removeEntry } = useHistory()
  const { isDark, toggle: toggleDark } = useDarkMode()
  const { isInstallable, isInstalled, installApp } = useInstallPrompt()

  const updateProduct = (index: number, field: keyof ProductForm, value: string) => {
    setProducts((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const addThirdProduct = () => {
    if (products.length < 3) {
      setProducts((prev) => [...prev, { price: '', quantity: '', measurePerItem: '' }])
      setErrors((prev) => [...prev, null])
    }
  }

  const handleCompare = () => {
    setErrors(products.map(() => null))
    setResult(null)

    const parsed = products.map((p) => ({
      price: parseFloat(p.price),
      quantity: parseFloat(p.quantity),
      measurePerItem: parseFloat(p.measurePerItem),
    }))

    let hasError = false
    const newErrors = parsed.map((p) => {
      if (isNaN(p.price) || p.price <= 0) {
        hasError = true
        return 'Ingresa un precio válido'
      }
      if (isNaN(p.quantity) || p.quantity <= 0) {
        hasError = true
        return 'Ingresa una cantidad válida'
      }
      if (isNaN(p.measurePerItem) || p.measurePerItem <= 0) {
        hasError = true
        return 'Ingresa una medida válida'
      }
      return null
    })

    setErrors(newErrors)
    if (hasError) return

    const productInputs: ProductInput[] = parsed.map((p) => ({
      price: p.price,
      quantity: p.quantity,
      measurePerItem: p.measurePerItem,
      unit,
    }))

    try {
      const comparison = compareProducts(productInputs)
      setResult(comparison)
      addEntry(comparison)
    } catch (err) {
      if (err instanceof Error) {
        setErrors((prev) => [err.message, ...prev.slice(1)])
      }
    }
  }

  const handleReuse = (entry: HistoryEntry) => {
    const { products: entryProducts } = entry.result
    const reused: ProductForm[] = entryProducts.map((p) => ({
      price: p.input.price.toString(),
      quantity: p.input.quantity.toString(),
      measurePerItem: p.input.measurePerItem.toString(),
    }))
    setProducts(reused)
    setUnit(entryProducts[0].input.unit)
    setResult(null)
    setErrors(reused.map(() => null))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              Apreciando
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Descubre qué producto es realmente más barato
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInstallModal(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Cómo instalar la app"
              title="Cómo instalar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
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
      <main className="max-w-lg mx-auto px-4 py-6 space-y-5 pb-28">
        {/* Selector global de unidad */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Unidad de medida para todos los productos
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-savings-500 focus:border-transparent transition-all text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
          >
            {UNITS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tarjetas de productos */}
        {products.map((product, index) => (
          <ProductCard
            key={index}
            label={`Producto ${String.fromCharCode(65 + index)}`}
            price={product.price}
            quantity={product.quantity}
            measurePerItem={product.measurePerItem}
            onPriceChange={(v) => updateProduct(index, 'price', v)}
            onQuantityChange={(v) => updateProduct(index, 'quantity', v)}
            onMeasurePerItemChange={(v) => updateProduct(index, 'measurePerItem', v)}
            error={errors[index]}
          />
        ))}

        {/* Botón agregar tercer producto */}
        {products.length < 3 && (
          <button
            onClick={addThirdProduct}
            className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 font-medium py-3 px-6 rounded-2xl hover:border-savings-500 hover:text-savings-600 dark:hover:border-savings-400 dark:hover:text-savings-400 transition-colors"
          >
            + Agregar tercer producto
          </button>
        )}

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
            {/* AdSense banner - descomentar cuando se use AdSense */}
            {/* <AdBanner position="middle" /> */}
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

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 pt-4">
          Creado por Abacus usando OpenCode
        </div>
      </main>

      {/* Banner inferior fijo - descomentar cuando se use AdSense */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-2">
        <div className="max-w-lg mx-auto">
          <AdBanner position="bottom" />
        </div>
      </div> */}

      {/* Modal de instalación */}
      <InstallPromptModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  )
}

export default App
