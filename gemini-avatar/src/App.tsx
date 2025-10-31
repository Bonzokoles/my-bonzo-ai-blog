import { useState } from 'react'
import Chat from './components/Chat'
import InteractiveAvatar from './components/InteractiveAvatar'
import './App.css'

function App() {
  const [mode, setMode] = useState<'chat' | 'avatar'>('chat')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Gemini Avatar - Bonzo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Rozmawiaj z AI przez tekst lub z interaktywnym avatarem HeyGen
          </p>
        </header>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode('chat')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              mode === 'chat'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            💬 Czat Tekstowy
          </button>
          <button
            onClick={() => setMode('avatar')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              mode === 'avatar'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            🤖 Avatar HeyGen
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {mode === 'chat' ? <Chat /> : <InteractiveAvatar />}
        </div>

        <footer className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by Google Gemini 2.0 Flash • MyBonzo AI Blog</p>
        </footer>
      </div>
    </div>
  )
}

export default App
