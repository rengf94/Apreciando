import { useEffect, useRef } from 'react'

interface AdBannerProps {
  position: 'bottom' | 'middle'
}

const ADSENSE_CLIENT = 'ca-pub-3801301989672398'
const AD_SLOTS = {
  bottom: '3370866344',
  middle: '9134503925',
}

export default function AdBanner({ position }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null)
  const slotId = AD_SLOTS[position]

  useEffect(() => {
    try {
      if (adRef.current) {
        ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
        ;(window as any).adsbygoogle.push({})
      }
    } catch (err) {
      // AdSense no cargado todavía
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
