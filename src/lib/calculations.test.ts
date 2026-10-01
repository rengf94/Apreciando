import { describe, it, expect } from 'vitest'
import {
  validateProduct,
  calculatePricePerUnit,
  compareProducts,
  formatCurrency,
  formatMeasure,
  convertToBase,
  convertFromBase,
  areUnitsCompatible,
  ProductInput,
} from './calculations'

describe('validateProduct', () => {
  it('retorna null para valores válidos', () => {
    expect(validateProduct(100, 4, 50)).toBeNull()
  })

  it('retorna error para precio inválido', () => {
    expect(validateProduct(0, 4, 50)).toBe('El precio debe ser un número mayor a 0')
    expect(validateProduct(-10, 4, 50)).toBe('El precio debe ser un número mayor a 0')
    expect(validateProduct(NaN, 4, 50)).toBe('El precio debe ser un número mayor a 0')
  })

  it('retorna error para cantidad inválida', () => {
    expect(validateProduct(100, 0, 50)).toBe('La cantidad debe ser un número mayor a 0')
    expect(validateProduct(100, -1, 50)).toBe('La cantidad debe ser un número mayor a 0')
  })

  it('retorna error para medida inválida', () => {
    expect(validateProduct(100, 4, 0)).toBe('La medida por ítem debe ser un número mayor a 0')
    expect(validateProduct(100, 4, -5)).toBe('La medida por ítem debe ser un número mayor a 0')
  })
})

describe('calculatePricePerUnit', () => {
  it('calcula correctamente el precio por unidad', () => {
    const product: ProductInput = {
      price: 100,
      quantity: 4,
      measurePerItem: 50,
      unit: 'metros',
    }
    const result = calculatePricePerUnit(product)
    expect(result.totalMeasure).toBe(200)
    expect(result.pricePerUnit).toBe(0.5)
  })

  it('lanza error para datos inválidos', () => {
    expect(() =>
      calculatePricePerUnit({ price: 0, quantity: 4, measurePerItem: 50, unit: 'metros' })
    ).toThrow('El precio debe ser un número mayor a 0')
  })
})

describe('compareProducts', () => {
  it('identifica correctamente al Producto A como ganador', () => {
    const productA: ProductInput = {
      price: 100,
      quantity: 4,
      measurePerItem: 50,
      unit: 'metros',
    }
    const productB: ProductInput = {
      price: 70,
      quantity: 4,
      measurePerItem: 30,
      unit: 'metros',
    }
    const result = compareProducts(productA, productB)
    expect(result.winner).toBe('A')
    expect(result.savingsPercentage).toBeCloseTo(13.33, 1)
  })

  it('identifica correctamente al Producto B como ganador', () => {
    const productA: ProductInput = {
      price: 70,
      quantity: 4,
      measurePerItem: 30,
      unit: 'metros',
    }
    const productB: ProductInput = {
      price: 100,
      quantity: 4,
      measurePerItem: 50,
      unit: 'metros',
    }
    const result = compareProducts(productA, productB)
    expect(result.winner).toBe('B')
  })

  it('detecta empate correctamente', () => {
    const productA: ProductInput = {
      price: 100,
      quantity: 4,
      measurePerItem: 50,
      unit: 'metros',
    }
    const productB: ProductInput = {
      price: 100,
      quantity: 4,
      measurePerItem: 50,
      unit: 'metros',
    }
    const result = compareProducts(productA, productB)
    expect(result.winner).toBe('tie')
    expect(result.savingsPercentage).toBe(0)
  })
})

describe('formatCurrency', () => {
  it('formatea correctamente como moneda mexicana', () => {
    expect(formatCurrency(100)).toBe('$100.00')
    expect(formatCurrency(0.5)).toBe('$0.50')
  })
})

describe('formatMeasure', () => {
  it('formatea medidas correctamente', () => {
    expect(formatMeasure(200)).toBe('200')
    expect(formatMeasure(1500.5)).toBe('1,500.5')
  })
})

describe('convertToBase', () => {
  it('convierte kilos a gramos', () => {
    expect(convertToBase(2, 'kilos')).toBe(2000)
  })

  it('convierte gramos a gramos (base)', () => {
    expect(convertToBase(500, 'gramos')).toBe(500)
  })

  it('convierte litros a litros (base)', () => {
    expect(convertToBase(1.5, 'litros')).toBe(1.5)
  })
})

describe('convertFromBase', () => {
  it('convierte gramos a kilos', () => {
    expect(convertFromBase(2000, 'kilos')).toBe(2)
  })

  it('convierte gramos a gramos', () => {
    expect(convertFromBase(500, 'gramos')).toBe(500)
  })
})

describe('areUnitsCompatible', () => {
  it('kilos y gramos son compatibles', () => {
    expect(areUnitsCompatible('kilos', 'gramos')).toBe(true)
  })

  it('metros y litros no son compatibles', () => {
    expect(areUnitsCompatible('metros', 'litros')).toBe(false)
  })

  it('unidades y kilos no son compatibles', () => {
    expect(areUnitsCompatible('unidades', 'kilos')).toBe(false)
  })
})

describe('compareProducts con conversión', () => {
  it('compara correctamente kg vs g (A en kg, B en g)', () => {
    const productA: ProductInput = {
      price: 100,
      quantity: 1,
      measurePerItem: 2, // 2 kg = 2000 g
      unit: 'kilos',
    }
    const productB: ProductInput = {
      price: 60,
      quantity: 1,
      measurePerItem: 1500, // 1500 g
      unit: 'gramos',
    }
    const result = compareProducts(productA, productB)
    // A: $100/2000g = $0.05/g, B: $60/1500g = $0.04/g → B gana
    expect(result.winner).toBe('B')
  })

  it('lanza error con unidades incompatibles', () => {
    const productA: ProductInput = {
      price: 100,
      quantity: 1,
      measurePerItem: 500,
      unit: 'metros',
    }
    const productB: ProductInput = {
      price: 60,
      quantity: 1,
      measurePerItem: 2,
      unit: 'litros',
    }
    expect(() => compareProducts(productA, productB)).toThrow(
      'No se pueden comparar metros con litros'
    )
  })
})
