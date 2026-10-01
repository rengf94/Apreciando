interface AdBannerProps {
  position: 'bottom' | 'middle'
}

/**
 * Placeholder para banner de Google AdSense.
 * Para producción, reemplazar con el componente <ins> de AdSense.
 */
export default function AdBanner({ position }: AdBannerProps) {
  return (
    <div
      className={`w-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center ${
        position === 'bottom' ? 'min-h-[50px]' : 'min-h-[90px]'
      }`}
      data-ad-slot={position}
    >
      <div className="text-center px-4">
        <p className="text-gray-400 dark:text-gray-500 text-[10px] font-medium uppercase tracking-wider">
          Espacio publicitario
        </p>
      </div>
    </div>
  )
}
