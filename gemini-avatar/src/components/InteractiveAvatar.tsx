import { useRef, useState } from 'react'

/**
 * Google Gemini Multimodal Live Avatar
 * Text-based chat with video placeholder for future video support
 */
export default function InteractiveAvatar() {
    const [isConnected, setIsConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'bot'; text: string }>>([])

    const videoRef = useRef<HTMLVideoElement>(null)

    const startSession = async () => {
        setIsLoading(true)
        try {
            // Get user's camera for future video support
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })

            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }

            setIsConnected(true)
            setChatHistory([{
                role: 'bot',
                text: 'Cześć! Jestem Bonzo, ekspert od drzwi PORTA. Jak mogę Ci pomóc?'
            }])
        } catch (error) {
            console.error('Failed to start camera:', error)
            alert('Nie udało się uruchomić kamery. Sprawdź uprawnienia przeglądarki.')
        } finally {
            setIsLoading(false)
        }
    }

    const stopSession = () => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream
            stream.getTracks().forEach(track => track.stop())
            videoRef.current.srcObject = null
        }

        setIsConnected(false)
        setChatHistory([])
    }

    const sendMessage = async () => {
        if (!message.trim()) return

        const userMessage = message
        setMessage('')
        setChatHistory((prev) => [...prev, { role: 'user', text: userMessage }])

        try {
            const response = await fetch('/api/ai/gemini-avatar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'talk',
                    message: userMessage,
                }),
            })

            if (!response.ok) throw new Error('Failed to send message')

            const data = await response.json() as { reply: string }
            setChatHistory((prev) => [...prev, { role: 'bot', text: data.reply }])
        } catch (error) {
            console.error('Failed to send message:', error)
            setChatHistory((prev) => [
                ...prev,
                { role: 'bot', text: 'Przepraszam, wystąpił błąd. Spróbuj ponownie.' },
            ])
        }
    }

    return (
        <div className="flex h-screen bg-gray-900">
            {/* Video Section */}
            <div className="w-1/2 p-4 flex flex-col">
                <div className="relative flex-1 bg-black rounded-lg overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />

                    {/* Status Overlay */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-gray-900 bg-opacity-80 text-white rounded-lg text-sm">
                        {isConnected ? '🟢 Połączony' : '⚪ Nieaktywny'}
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {!isConnected ? (
                            <button
                                onClick={startSession}
                                disabled={isLoading}
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-semibold shadow-lg transition-colors"
                            >
                                {isLoading ? '⏳ Łączenie...' : '🎥 Uruchom'}
                            </button>
                        ) : (
                            <button
                                onClick={stopSession}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-lg transition-colors"
                            >
                                🛑 Zatrzymaj
                            </button>
                        )}
                    </div>

                    {/* Placeholder when disconnected */}
                    {!isConnected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90">
                            <div className="text-center text-white">
                                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-5xl">🤖</span>
                                </div>
                                <p className="text-lg font-semibold">Google Gemini Avatar</p>
                                <p className="text-sm text-gray-400 mt-2">Kliknij "Uruchom" aby rozpocząć</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Section */}
            <div className="w-1/2 p-4 flex flex-col">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-white">Google Gemini 2.0</h1>
                    <p className="text-sm text-gray-400">Multimodal Chat (Wideo w przyszłej wersji)</p>
                </div>

                <div className="flex-1 bg-gray-800 rounded-lg p-4 overflow-y-auto mb-4 space-y-3">
                    {chatHistory.length === 0 && !isConnected && (
                        <div className="text-center text-gray-500 mt-8">
                            Uruchom sesję aby rozpocząć rozmowę
                        </div>
                    )}
                    {chatHistory.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg ${msg.role === 'user'
                                    ? 'bg-blue-600 ml-auto max-w-[80%]'
                                    : 'bg-gray-700 mr-auto max-w-[80%]'
                                }`}
                        >
                            <p className="text-sm text-white">{msg.text}</p>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder={isConnected ? "Napisz wiadomość..." : "Najpierw uruchom sesję"}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={!isConnected}
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!isConnected || !message.trim()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                    >
                        Wyślij
                    </button>
                </div>
            </div>
        </div>
    )
}
