import { useEffect, useRef } from 'react'

interface AdBannerProps {
  position: 'bottom' | 'middle'
}

// Tag de Monetag - In-Page Push
const MONETAG_ZONE = '11943416'
const MONETAG_SRC = 'https://nap5k.com/tag.min.js'

export default function AdBanner({ position }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Limpiar scripts anteriores
    containerRef.current.innerHTML = ''

    // Crear y ejecutar el script de Monetag
    const script = document.createElement('script')
    script.textContent = `(function(s){s.dataset.zone='${MONETAG_ZONE}',s.src='${MONETAG_SRC}'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
    containerRef.current.appendChild(script)
  }, [position])

  return (
    <div
      ref={containerRef}
      className={`w-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center overflow-hidden ${
        position === 'bottom' ? 'min-h-[50px]' : 'min-h-[90px]'
      }`}
      data-ad-slot={position}
    />
  )
}
