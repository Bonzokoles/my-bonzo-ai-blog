import { useState } from 'react'

export default function LiveConversation() {
  const [isConnected, setIsConnected] = useState(false)

  const handleConnect = () => {
    alert('Live conversation feature coming soon! Requires WebRTC setup.')
    setIsConnected(!isConnected)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <div className="text-center">
        <div className="mb-6">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-6xl">🤖</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Rozmowa na żywo z Bonzo
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Rozmawiaj głosowo w czasie rzeczywistym z AI asystentem
        </p>

        <button
          onClick={handleConnect}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${
            isConnected
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isConnected ? '🛑 Rozłącz' : '🎙️ Połącz z Bonzo'}
        </button>

        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          <p>💡 Funkcja w budowie - wymaga konfiguracji Google Gemini Live API</p>
        </div>
      </div>
    </div>
  )
}
