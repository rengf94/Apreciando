interface InstallPromptModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InstallPromptModal({ isOpen, onClose }: InstallPromptModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="text-center">
          <span className="text-4xl">📱</span>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-3">
            ¡Instala Apreciando!
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Agrega esta app a tu pantalla de inicio para acceder rápidamente
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
            <span className="text-lg">1️⃣</span>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Toca el botón <strong>"Compartir"</strong> en tu navegador
            </p>
          </div>
          <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
            <span className="text-lg">2️⃣</span>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Selecciona <strong>"Añadir a pantalla de inicio"</strong>
            </p>
          </div>
          <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
            <span className="text-lg">3️⃣</span>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              ¡Listo! Ya tienes <strong>Apreciando</strong> en tu inicio
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-savings-600 hover:bg-savings-700 text-white font-medium py-3 rounded-xl transition-colors"
        >
          ¡Entendido!
        </button>
      </div>
    </div>
  )
}
