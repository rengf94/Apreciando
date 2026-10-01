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

export interface ProductResult {
  input: ProductInput
  totalMeasure: number
  pricePerUnit: number
}

export interface ComparisonResult {
  productA: ProductResult
  productB: ProductResult
  winner: 'A' | 'B' | 'tie'
  savingsPercentage: number
  savingsAmount: number
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
 * Compara dos productos y determina cuál es más barato por unidad.
 * Convierte automáticamente unidades compatibles (ej. kg ↔ g).
 * @throws Error si algún producto tiene datos inválidos o unidades incompatibles
 */
export function compareProducts(
  productA: ProductInput,
  productB: ProductInput
): ComparisonResult {
  if (!areUnitsCompatible(productA.unit, productB.unit)) {
    throw new Error(
      `No se pueden comparar ${productA.unit} con ${productB.unit}. Usa unidades del mismo tipo.`
    )
  }

  // Convertir ambos a la unidad base para comparar correctamente
  const baseA = convertToBase(productA.measurePerItem, productA.unit)
  const baseB = convertToBase(productB.measurePerItem, productB.unit)

  const convertedA: ProductInput = { ...productA, measurePerItem: baseA, unit: productA.unit }
  const convertedB: ProductInput = { ...productB, measurePerItem: baseB, unit: productB.unit }

  const resultA = calculatePricePerUnit(convertedA)
  const resultB = calculatePricePerUnit(convertedB)

  let winner: 'A' | 'B' | 'tie'
  let savingsPercentage: number
  let savingsAmount: number

  if (resultA.pricePerUnit < resultB.pricePerUnit) {
    winner = 'A'
    savingsAmount = resultB.pricePerUnit - resultA.pricePerUnit
    savingsPercentage = (savingsAmount / resultB.pricePerUnit) * 100
  } else if (resultB.pricePerUnit < resultA.pricePerUnit) {
    winner = 'B'
    savingsAmount = resultA.pricePerUnit - resultB.pricePerUnit
    savingsPercentage = (savingsAmount / resultA.pricePerUnit) * 100
  } else {
    winner = 'tie'
    savingsAmount = 0
    savingsPercentage = 0
  }

  return {
    productA: resultA,
    productB: resultB,
    winner,
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
