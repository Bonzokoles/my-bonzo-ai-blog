import { useEffect, useRef, useState } from 'react'

interface HeyGenSession {
    session_id: string
    sdp: {
        answer: string
        type: string
    }
    ice_servers: Array<{
        urls: string[]
    }>
}

export default function InteractiveAvatar() {
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'bot'; text: string }>>([])

    const videoRef = useRef<HTMLVideoElement>(null)
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

    const startSession = async () => {
        setIsLoading(true)
        try {
            // Create HeyGen streaming session
            const response = await fetch('/api/ai/avatar-stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create' }),
            })

            if (!response.ok) throw new Error('Failed to create session')

            const data: HeyGenSession = await response.json()
            setSessionId(data.session_id)

            // Setup WebRTC connection
            const pc = new RTCPeerConnection({
                iceServers: data.ice_servers,
            })

            pc.ontrack = (event) => {
                if (videoRef.current && event.streams[0]) {
                    videoRef.current.srcObject = event.streams[0]
                }
            }

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('ICE candidate:', event.candidate)
                }
            }

            pc.oniceconnectionstatechange = () => {
                console.log('ICE state:', pc.iceConnectionState)
                setIsConnected(pc.iceConnectionState === 'connected')
            }

            // Set remote description
            await pc.setRemoteDescription(
                new RTCSessionDescription({
                    type: 'answer',
                    sdp: data.sdp.answer,
                })
            )

            // Create and set local description
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)

            peerConnectionRef.current = pc
            setIsConnected(true)
        } catch (error) {
            console.error('Failed to start session:', error)
            alert('Nie udało się uruchomić avatara. Sprawdź konfigurację HeyGen.')
        } finally {
            setIsLoading(false)
        }
    }

    const stopSession = async () => {
        if (sessionId) {
            try {
                await fetch('/api/ai/avatar-stream', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'close', sessionId }),
                })
            } catch (error) {
                console.error('Failed to close session:', error)
            }
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close()
            peerConnectionRef.current = null
        }

        setSessionId(null)
        setIsConnected(false)
        setChatHistory([])
    }

    const sendMessage = async () => {
        if (!message.trim() || !sessionId) return

        const userMessage = message
        setMessage('')
        setChatHistory((prev) => [...prev, { role: 'user', text: userMessage }])

        try {
            const response = await fetch('/api/ai/avatar-stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'talk',
                    sessionId,
                    message: userMessage,
                }),
            })

            if (!response.ok) throw new Error('Failed to send message')

            const data = await response.json()
            setChatHistory((prev) => [...prev, { role: 'bot', text: data.reply }])
        } catch (error) {
            console.error('Failed to send message:', error)
            setChatHistory((prev) => [
                ...prev,
                { role: 'bot', text: 'Przepraszam, wystąpił problem z połączeniem.' },
            ])
        }
    }

    useEffect(() => {
        return () => {
            stopSession()
        }
    }, [])

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Video Stream */}
                <div className="space-y-4">
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        {!isConnected && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90">
                                <div className="text-center text-white">
                                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-5xl">🤖</span>
                                    </div>
                                    <p className="text-lg">Avatar Bonzo czeka na połączenie</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {!isConnected ? (
                            <button
                                onClick={startSession}
                                disabled={isLoading}
                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? '⏳ Łączenie...' : '🎥 Uruchom Avatara'}
                            </button>
                        ) : (
                            <button
                                onClick={stopSession}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                            >
                                🛑 Zakończ Sesję
                            </button>
                        )}
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="flex flex-col">
                    <div className="flex-1 overflow-y-auto mb-4 space-y-3 h-80 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        {chatHistory.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                        }`}
                                >
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            sendMessage()
                        }}
                        className="flex gap-2"
                    >
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Zapytaj o drzwi PORTA..."
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
                            disabled={!isConnected}
                        />
                        <button
                            type="submit"
                            disabled={!isConnected || !message.trim()}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Wyślij
                        </button>
                    </form>
                </div>
            </div>

            {isConnected && (
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200 text-center">
                        ✅ Avatar połączony i gotowy do rozmowy
                    </p>
                </div>
            )}
        </div>
    )
}
