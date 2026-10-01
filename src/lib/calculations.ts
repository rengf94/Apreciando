/**
 * Lógica matemática pura para la calculadora comparativa.
 * Separada de la UI para facilitar pruebas unitarias.
 */

export type Unit = 'metros' | 'litros' | 'kilos' | 'gramos' | 'unidades'

export interface ProductInput {
  price: number
  quantity: number
  measurePerItem: number
  unit: Unit
}

export interface ProductResult {
  input: ProductInput
  totalMeasure: number
  pricePerUnit: number
}

export interface ComparisonResult {
  products: ProductResult[]
  winnerIndex: number | null // null = empate
  savingsPercentage: number
  savingsAmount: number
}

// Factores de conversión a la unidad base (gramos para peso, litros para volumen, metros para longitud)
const CONVERSION_FACTORS: Record<Unit, number> = {
  metros: 1,
  litros: 1,
  kilos: 1000,      // 1 kg = 1000 g
  gramos: 1,
  unidades: 1,
}

// Unidades base para agrupar conversiones válidas
const UNIT_GROUPS: Record<Unit, 'longitud' | 'volumen' | 'peso' | 'unidad'> = {
  metros: 'longitud',
  litros: 'volumen',
  kilos: 'peso',
  gramos: 'peso',
  unidades: 'unidad',
}

/**
 * Convierte una cantidad de una unidad a su unidad base.
 */
export function convertToBase(value: number, unit: Unit): number {
  return value * CONVERSION_FACTORS[unit]
}

/**
 * Convierte un valor de la unidad base a una unidad destino.
 */
export function convertFromBase(value: number, unit: Unit): number {
  return value / CONVERSION_FACTORS[unit]
}

/**
 * Verifica si dos unidades son compatibles para comparar.
 */
export function areUnitsCompatible(unitA: Unit, unitB: Unit): boolean {
  return UNIT_GROUPS[unitA] === UNIT_GROUPS[unitB]
}

/**
 * Valida que un producto tenga datos válidos para calcular.
 * Retorna un string de error o null si es válido.
 */
export function validateProduct(
  price: number,
  quantity: number,
  measurePerItem: number
): string | null {
  if (isNaN(price) || price <= 0) {
    return 'El precio debe ser un número mayor a 0'
  }
  if (isNaN(quantity) || quantity <= 0) {
    return 'La cantidad debe ser un número mayor a 0'
  }
  if (isNaN(measurePerItem) || measurePerItem <= 0) {
    return 'La medida por ítem debe ser un número mayor a 0'
  }
  return null
}

/**
 * Calcula el precio por unidad de medida de un producto.
 * @throws Error si los datos son inválidos
 */
export function calculatePricePerUnit(product: ProductInput): ProductResult {
  const error = validateProduct(product.price, product.quantity, product.measurePerItem)
  if (error) {
    throw new Error(error)
  }

  const totalMeasure = product.quantity * product.measurePerItem
  const pricePerUnit = product.price / totalMeasure

  return {
    input: product,
    totalMeasure,
    pricePerUnit,
  }
}

/**
 * Compara múltiples productos y determina cuál es más barato por unidad.
 * Convierte automáticamente unidades compatibles (ej. kg ↔ g).
 * @throws Error si algún producto tiene datos inválidos o unidades incompatibles
 */
export function compareProducts(products: ProductInput[]): ComparisonResult {
  if (products.length < 2) {
    throw new Error('Se necesitan al menos 2 productos para comparar')
  }

  // Verificar que todas las unidades sean compatibles
  const firstUnit = products[0].unit
  for (let i = 1; i < products.length; i++) {
    if (!areUnitsCompatible(firstUnit, products[i].unit)) {
      throw new Error(
        `No se pueden comparar ${firstUnit} con ${products[i].unit}. Usa unidades del mismo tipo.`
      )
    }
  }

  // Convertir todos a la unidad base para comparar correctamente
  const convertedProducts = products.map((p) => ({
    ...p,
    measurePerItem: convertToBase(p.measurePerItem, p.unit),
  }))

  const results = convertedProducts.map((p) => calculatePricePerUnit(p))

  // Encontrar el ganador (el de menor precio por unidad)
  let winnerIndex = 0
  let minPrice = results[0].pricePerUnit
  let isTie = false

  for (let i = 1; i < results.length; i++) {
    if (results[i].pricePerUnit < minPrice) {
      minPrice = results[i].pricePerUnit
      winnerIndex = i
      isTie = false
    } else if (results[i].pricePerUnit === minPrice) {
      isTie = true
    }
  }

  // Verificar empate entre todos los que tienen el precio mínimo
  const minPriceCount = results.filter((r) => r.pricePerUnit === minPrice).length
  if (minPriceCount > 1) {
    isTie = true
  }

  // Calcular ahorro vs el segundo más barato
  const sortedPrices = [...results].sort((a, b) => a.pricePerUnit - b.pricePerUnit)
  const secondCheapest = sortedPrices[1]?.pricePerUnit ?? sortedPrices[0].pricePerUnit

  const savingsAmount = secondCheapest - minPrice
  const savingsPercentage = secondCheapest > 0 ? (savingsAmount / secondCheapest) * 100 : 0

  return {
    products: results,
    winnerIndex: isTie ? null : winnerIndex,
    savingsPercentage,
    savingsAmount,
  }
}

/**
 * Formatea un número como moneda.
 */
export function formatCurrency(value: number, locale = 'es-MX', currency = 'MXN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Formatea un número con decimales apropiados para medidas.
 */
export function formatMeasure(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}
