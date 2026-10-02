import { useEffect, useRef } from 'react'

interface AdBannerProps {
  position: 'bottom' | 'middle'
}

// ⚠️ Reemplaza con tus valores de Google AdSense
const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX' // Tu ID de editor
const AD_SLOTS = {
  bottom: 'YYYYYYYYYY', // Slot ID para banner inferior
  middle: 'ZZZZZZZZZZ', // Slot ID para banner entre resultados
}

export default function AdBanner({ position }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null)
  const slotId = AD_SLOTS[position]

  useEffect(() => {
    // Cargar el script de AdSense solo una vez
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`
      script.crossOrigin = 'anonymous'
      document.head.appendChild(script)
    }

    // Push del anuncio
    try {
      if (adRef.current) {
        ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
        ;(window as any).adsbygoogle.push({})
      }
    } catch (err) {
      // AdSense no cargado (bloqueador de anuncios, etc.)
    }
  }, [slotId])

  return (
    <div
      className={`w-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center overflow-hidden ${
        position === 'bottom' ? 'min-h-[50px]' : 'min-h-[90px]'
      }`}
      data-ad-slot={position}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
