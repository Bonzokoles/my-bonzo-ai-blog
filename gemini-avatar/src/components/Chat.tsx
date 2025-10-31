import { useEffect, useRef, useState } from 'react'
import geminiService from '../services/geminiService'

interface Message {
    role: 'user' | 'model'
    text: string
    timestamp: Date
}

const DOOR_KNOWLEDGE = `
You are Bonzo, expert on PORTA doors. Knowledge base:

1. The Urbanist - Modern steel exterior, matte black aluminum (U-value: 0.8)
2. The Highlander - Rustic oak traditional with acoustic insulation
3. The Sentinel - High-security RC3 certified, anthracite grey
4. The Lumina - Interior frosted glass, modern bright style
5. The EcoScape - Eco-friendly 95% reclaimed wood, Scandinavian style

**IMPORTANT**: Respond in POLISH language as Bonzo, friendly door expert.
`

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            role: 'user',
            text: input,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const response = await geminiService.sendMessage(
                `${DOOR_KNOWLEDGE}\n\nUser: ${input}\n\nBonzo:`
            )

            const botMessage: Message = {
                role: 'model',
                text: response,
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, botMessage])
        } catch (error) {
            console.error('Chat error:', error)
            const errorMessage: Message = {
                role: 'model',
                text: 'Przepraszam, wystąpił problem. Spróbuj ponownie.',
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="h-96 overflow-y-auto mb-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                }`}
                        >
                            <p className="text-sm">{msg.text}</p>
                            <span className="text-xs opacity-70">
                                {msg.timestamp.toLocaleTimeString('pl-PL', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
                            <p className="text-sm text-gray-900 dark:text-white">Bonzo pisze...</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Zapytaj o drzwi PORTA..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Wyślij
                </button>
            </form>
        </div>
    )
}
