import { useEffect, useRef } from 'react'

interface AdBannerProps {
  position: 'bottom' | 'middle'
}

// Monetag — Vignette Banner (fijo, no genera redirecciones)
const MONETAG_ZONE = '11943454'
const MONETAG_SRC = 'https://n6wxm.com/vignette.min.js'

/**
 * Banner fijo de Monetag (Vignette).
 * No usa <ins> de AdSense; inserta el script de Monetag en el contenedor.
 */
export default function AdBanner({ position }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''
    const script = document.createElement('script')
    script.textContent = `(function(s){s.dataset.zone='${MONETAG_ZONE}',s.src='${MONETAG_SRC}'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
    containerRef.current.appendChild(script)
  }, [position])

  return (
    <div
      ref={containerRef}
      data-ad-slot={position}
      className={`w-full rounded-xl flex items-center justify-center ${
        position === 'bottom' ? 'min-h-[50px]' : 'min-h-[90px]'
      }`}
    />
  )
}
