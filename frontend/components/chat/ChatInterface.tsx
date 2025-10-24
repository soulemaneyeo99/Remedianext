'use client'

/**
 * 🎯 ChatInterface - Composant Unifié Pro
 * 
 * Features:
 * - Mode fullscreen OU bubble flottante
 * - Streaming avec typing effect
 * - Export conversation (JSON, MD, TXT)
 * - Voice input (Web Speech API)
 * - Persistence localStorage
 * - Feedback thumbs up/down
 * - Copy messages
 * - Suggestions dynamiques
 * - Markdown pro formatting
 * 
 * @usage
 * <ChatInterface mode="fullscreen" />
 * <ChatInterface mode="bubble" />
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send,
  Loader2,
  Bot,
  User,
  AlertCircle,
  Info,
  Leaf,
  CheckCircle,
  Pill,
  MessageCircle,
  X,
  Minimize2,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Mic,
  MicOff,
  Trash2,
  RotateCcw,
  Sparkles,
  Heart,
  TrendingUp,
  ArrowRight
} from 'lucide-react'
import { chatAPI, type ChatMessage } from '@/lib/api'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

interface ChatInterfaceProps {
  mode?: 'fullscreen' | 'bubble'
  initialMessage?: string
  onClose?: () => void
  className?: string
}

interface ExtendedMessage extends ChatMessage {
  id: string
  timestamp: Date
  feedback?: 'positive' | 'negative' | null
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ChatInterface({
  mode = 'fullscreen',
  initialMessage,
  onClose,
  className
}: ChatInterfaceProps) {
  // ========== STATE ==========
  const [messages, setMessages] = useState<ExtendedMessage[]>([])
  const [inputMessage, setInputMessage] = useState(initialMessage || '')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isMinimized, setIsMinimized] = useState(mode === 'bubble')
  
  // ========== REFS ==========
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  // ========== EFFECTS ==========

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingMessage])

  // Load from localStorage
  useEffect(() => {
    loadConversationHistory()
    loadSuggestions()
    setupSpeechRecognition()
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      saveConversationHistory()
    }
  }, [messages])

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ExtendedMessage = {
        id: generateId(),
        role: 'assistant',
        content: '**Bonjour !** 👋\n\nJe suis votre **assistant médical REMÉDIA**, spécialisé en plantes médicinales africaines.\n\nComment puis-je vous aider aujourd\'hui ?',
        timestamp: new Date(),
        feedback: null
      }
      setMessages([welcomeMessage])
    }
  }, [])

  // ========== FUNCTIONS ==========

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const loadConversationHistory = () => {
    try {
      const saved = localStorage.getItem('remedia_chat_history')
      if (saved) {
        const parsed = JSON.parse(saved)
        setMessages(parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })))
      }
    } catch (err) {
      console.warn('Failed to load chat history', err)
    }
  }

  const saveConversationHistory = () => {
    try {
      localStorage.setItem('remedia_chat_history', JSON.stringify(messages))
    } catch (err) {
      console.warn('Failed to save chat history', err)
    }
  }

  const loadSuggestions = async () => {
    try {
      // Essayer de charger depuis le backend d'abord
      const res = await chatAPI.getSuggestions()
      if (res.success && Array.isArray(res.suggestions) && res.suggestions.length > 0) {
        setSuggestions(res.suggestions)
        return
      }
    } catch (err) {
      console.warn('Backend suggestions unavailable, using strategic questions', err)
    }

    // Fallback : utiliser les questions stratégiques
    // Import dynamique pour éviter d'alourdir le bundle
    const { getRandomQuestions } = await import('@/lib/strategic-questions')
    const randomQuestions = getRandomQuestions(6)
    setSuggestions(randomQuestions)
  }

  const setupSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'fr-FR'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }

  const typeMessage = (text: string, speed = 12) =>
    new Promise<void>((resolve) => {
      setIsTyping(true)
      setStreamingMessage('')
      let i = 0
      const tick = () => {
        if (i < text.length) {
          setStreamingMessage((s) => s + text[i])
          i++
          setTimeout(tick, speed)
        } else {
          setIsTyping(false)
          resolve()
        }
      }
      tick()
    })

  const handleSendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? inputMessage).trim()
    if (!text || isLoading || isTyping) return

    const userMessage: ExtendedMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      feedback: null
    }

    setMessages((m) => [...m, userMessage])
    setInputMessage('')
    inputRef.current?.focus()
    setIsLoading(true)

    try {
      // Convert to simple ChatMessage for API
      const history: ChatMessage[] = messages.map(m => ({
        role: m.role,
        content: m.content
      }))

      const res = await chatAPI.sendMessage(text, history)
      
      if (res.success && typeof res.response === 'string') {
        await typeMessage(res.response)

        const assistantMessage: ExtendedMessage = {
          id: generateId(),
          role: 'assistant',
          content: res.response,
          timestamp: new Date(),
          feedback: null
        }

        setMessages((m) => [...m, assistantMessage])
        setStreamingMessage('')
      } else {
        throw new Error('Invalid response')
      }
    } catch (err) {
      console.error('Chat error:', err)
      const errorMessage: ExtendedMessage = {
        id: generateId(),
        role: 'assistant',
        content: '😔 **Désolé**, une erreur est survenue. Veuillez réessayer dans quelques instants.',
        timestamp: new Date(),
        feedback: null
      }
      setMessages((m) => [...m, errorMessage])
      setStreamingMessage('')
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSendMessage()
    }
  }

  const handleSuggestion = (s: string) => {
    void handleSendMessage(s)
  }

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleClearConversation = () => {
    if (confirm('Êtes-vous sûr de vouloir effacer la conversation ?')) {
      setMessages([])
      localStorage.removeItem('remedia_chat_history')
    }
  }

  const handleRegenerateResponse = async () => {
    if (messages.length < 2) return
    
    // Get last user message
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')
    if (!lastUserMsg) return

    // Remove last assistant response
    setMessages(m => m.slice(0, -1))
    
    // Regenerate
    await handleSendMessage(lastUserMsg.content)
  }

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(m =>
      m.map(msg =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    )
    // TODO: Send feedback to backend analytics
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // TODO: Show toast notification
  }

  const handleExportConversation = (format: 'json' | 'md' | 'txt') => {
    let content = ''
    const timestamp = new Date().toISOString().split('T')[0]

    if (format === 'json') {
      content = JSON.stringify(messages, null, 2)
    } else if (format === 'md') {
      content = '# Conversation REMÉDIA\n\n'
      messages.forEach(m => {
        content += `## ${m.role === 'user' ? 'Vous' : 'Assistant'}\n`
        content += `_${m.timestamp.toLocaleString('fr-FR')}_\n\n`
        content += `${m.content}\n\n---\n\n`
      })
    } else {
      messages.forEach(m => {
        content += `[${m.timestamp.toLocaleString('fr-FR')}] ${m.role === 'user' ? 'VOUS' : 'ASSISTANT'}:\n`
        content += `${m.content}\n\n`
      })
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `remedia-conversation-${timestamp}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ========== RENDER ==========

  if (mode === 'bubble' && isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all hover:scale-110 flex items-center justify-center group"
      >
        <MessageCircle className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
        {messages.length > 1 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
            {messages.length - 1}
          </span>
        )}
      </button>
    )
  }

  const containerClass = mode === 'bubble'
    ? 'fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col'
    : 'min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col'

  return (
    <div className={cn(containerClass, className)}>
      {/* Header */}
      <div className={cn(
        "bg-white border-b border-gray-200 shadow-sm",
        mode === 'bubble' ? 'rounded-t-2xl' : 'sticky top-0 z-20'
      )}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Assistant REMÉDIA</h3>
              <div className="flex items-center gap-1.5 text-xs text-green-600">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span>En ligne</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export dropdown */}
            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="h-4 w-4 text-gray-600" />
              </button>
              <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[120px]">
                <button
                  onClick={() => handleExportConversation('json')}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => handleExportConversation('md')}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Export Markdown
                </button>
                <button
                  onClick={() => handleExportConversation('txt')}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Export TXT
                </button>
              </div>
            </div>

            <button
              onClick={handleClearConversation}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Effacer la conversation"
            >
              <Trash2 className="h-4 w-4 text-gray-600" />
            </button>

            {mode === 'bubble' && (
              <>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Minimize2 className="h-4 w-4 text-gray-600" />
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
        <div className="flex items-start gap-2 text-xs text-blue-800">
          <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          <p>Informations éducatives uniquement. Consultez un professionnel pour un diagnostic.</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className={cn(
        "flex-1 overflow-y-auto px-4 py-4 space-y-4",
        mode === 'fullscreen' && 'pb-32'
      )}>
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onFeedback={handleFeedback}
            onCopy={handleCopyMessage}
          />
        ))}

        {/* Streaming message */}
        {isTyping && streamingMessage && (
          <div className="flex items-start gap-3 animate-slide-in-left">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%] shadow-md border border-gray-100">
              <FormattedMessage content={streamingMessage} />
              <span className="inline-block w-1 h-4 bg-green-600 ml-1 animate-pulse" />
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && !isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 text-green-600 animate-spin" />
                <span className="text-sm text-gray-600">L'assistant réfléchit...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions - Enhanced UI */}
      {messages.length <= 1 && suggestions.length > 0 && mode === 'fullscreen' && (
        <div className="px-4 pb-6">
          <div className="max-w-4xl mx-auto">
            {/* Header avec animation */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full mb-3">
                <Sparkles className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Questions populaires</span>
              </div>
              <p className="text-xs text-gray-600">
                Cliquez sur une question pour démarrer la conversation
              </p>
            </div>

            {/* Grid de suggestions avec catégories visuelles */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((question, idx) => {
                // Détecter la catégorie par mots-clés
                let icon = Leaf
                let colorClass = 'from-green-500 to-emerald-600'
                let bgClass = 'hover:border-green-500 hover:bg-green-50'
                
                if (question.toLowerCase().includes('traiter') || question.toLowerCase().includes('soigner')) {
                  icon = Pill
                  colorClass = 'from-blue-500 to-cyan-600'
                  bgClass = 'hover:border-blue-500 hover:bg-blue-50'
                } else if (question.toLowerCase().includes('enfant') || question.toLowerCase().includes('bébé')) {
                  icon = Heart
                  colorClass = 'from-pink-500 to-rose-600'
                  bgClass = 'hover:border-pink-500 hover:bg-pink-50'
                } else if (question.toLowerCase().includes('urgence') || question.toLowerCase().includes('premiers secours')) {
                  icon = AlertCircle
                  colorClass = 'from-red-500 to-orange-600'
                  bgClass = 'hover:border-red-500 hover:bg-red-50'
                } else if (question.toLowerCase().includes('économie') || question.toLowerCase().includes('coût')) {
                  icon = TrendingUp
                  colorClass = 'from-purple-500 to-indigo-600'
                  bgClass = 'hover:border-purple-500 hover:bg-purple-50'
                }

                const Icon = icon

                return (
                  <button
                    key={idx}
                    onClick={() => handleSuggestion(question)}
                    className={`group relative text-left p-4 bg-white border-2 border-gray-200 rounded-xl transition-all duration-200 ${bgClass} transform hover:-translate-y-1 hover:shadow-lg`}
                  >
                    {/* Icon badge */}
                    <div className={`absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br ${colorClass} rounded-full shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>

                    {/* Question text */}
                    <p className="text-sm text-gray-700 group-hover:text-gray-900 leading-relaxed pr-8">
                      {question}
                    </p>

                    {/* Arrow indicator */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                )
              })}
            </div>

            {/* CTA pour plus de questions */}
            <div className="text-center mt-6">
              <button
                onClick={loadSuggestions}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Voir d'autres questions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className={cn(
        "bg-white border-t border-gray-200 px-4 py-3",
        mode === 'fullscreen' && 'fixed bottom-0 left-0 right-0 shadow-lg',
        mode === 'bubble' && 'rounded-b-2xl'
      )}>
        {mode === 'fullscreen' && (
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
              <AlertCircle className="h-3 w-3" />
              <span>REMÉDIA peut faire des erreurs. Vérifiez les informations importantes.</span>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez votre question..."
                  disabled={isLoading || isTyping}
                  maxLength={1000}
                  className="w-full px-4 py-3 pr-20 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                />
                {inputMessage.trim() && (
                  <div className="absolute right-12 bottom-3 text-xs text-gray-400">
                    {inputMessage.length}/1000
                  </div>
                )}
              </div>

              {recognitionRef.current && (
                <button
                  onClick={handleVoiceInput}
                  className={cn(
                    "p-3 rounded-xl transition-all",
                    isListening
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              )}

              <button
                onClick={() => void handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading || isTyping}
                className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {isLoading || isTyping ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>

            {messages.length > 1 && (
              <div className="flex justify-center mt-2">
                <button
                  onClick={handleRegenerateResponse}
                  className="text-xs text-gray-600 hover:text-green-600 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Régénérer la réponse
                </button>
              </div>
            )}
          </div>
        )}

        {mode === 'bubble' && (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Votre question..."
              disabled={isLoading || isTyping}
              className="flex-1 px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={() => void handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading || isTyping}
              className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
            >
              {isLoading || isTyping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// MESSAGE BUBBLE COMPONENT
// ============================================

interface MessageBubbleProps {
  message: ExtendedMessage
  onFeedback: (id: string, feedback: 'positive' | 'negative') => void
  onCopy: (content: string) => void
}

function MessageBubble({ message, onFeedback, onCopy }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-3 group animate-slide-in-right">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%] shadow-md">
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
          <div className="text-xs text-green-100 mt-1">
            {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 group animate-slide-in-left">
      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="h-4 w-4 text-white" />
      </div>

      <div className="flex-1 max-w-[85%]">
        <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-md border border-gray-100">
          <FormattedMessage content={message.content} />
          
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onCopy(message.content)}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Copier"
              >
                <Copy className="h-3.5 w-3.5 text-gray-600" />
              </button>
              
              <button
                onClick={() => onFeedback(message.id, 'positive')}
                className={cn(
                  "p-1.5 hover:bg-green-100 rounded transition-colors",
                  message.feedback === 'positive' && "bg-green-100"
                )}
                title="Utile"
              >
                <ThumbsUp className={cn(
                  "h-3.5 w-3.5",
                  message.feedback === 'positive' ? "text-green-600 fill-current" : "text-gray-600"
                )} />
              </button>

              <button
                onClick={() => onFeedback(message.id, 'negative')}
                className={cn(
                  "p-1.5 hover:bg-red-100 rounded transition-colors",
                  message.feedback === 'negative' && "bg-red-100"
                )}
                title="Pas utile"
              >
                <ThumbsDown className={cn(
                  "h-3.5 w-3.5",
                  message.feedback === 'negative' ? "text-red-600 fill-current" : "text-gray-600"
                )} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// FORMATTED MESSAGE COMPONENT
// ============================================

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: JSX.Element[] = []
  let currentList: string[] = []
  let listKey = 0

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="space-y-2 my-2">
          {currentList.map((it, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Leaf className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(it) }} />
            </li>
          ))}
        </ul>
      )
      currentList = []
    }
  }

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim()

    if (line.match(/^[•\-\*]\s+/)) {
      currentList.push(line.replace(/^[•\-\*]\s+/, ''))
      return
    }

    if (currentList.length > 0 && !line.match(/^[•\-\*]\s+/)) {
      flushList()
    }

    if (!line) {
      elements.push(<div key={`br-${idx}`} className="h-2" />)
      return
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={`h3-${idx}`} className="text-base font-bold text-gray-900 mt-3 mb-2 flex items-center gap-2">
          <div className="w-1 h-5 bg-green-600 rounded-full" />
          <span>{line.replace('## ', '')}</span>
        </h3>
      )
      return
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={`h4-${idx}`} className="text-sm font-semibold text-gray-800 mt-2 mb-1">
          {line.replace('### ', '')}
        </h4>
      )
      return
    }

    if (line.includes('⚠️') || line.toLowerCase().includes('attention')) {
      elements.push(
        <div key={`warn-${idx}`} className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg border border-amber-200 my-2">
          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-amber-900" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
        </div>
      )
      return
    }

    if (line.includes('💊') || line.includes('🏥')) {
      elements.push(
        <div key={`med-${idx}`} className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200 my-2">
          <Pill className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-blue-900" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
        </div>
      )
      return
    }

    if (line.includes('✅') || line.toLowerCase().startsWith('conseil')) {
      elements.push(
        <div key={`ok-${idx}`} className="flex items-start gap-2 bg-green-50 p-3 rounded-lg border border-green-200 my-2">
          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-green-900" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
        </div>
      )
      return
    }

    if (line.includes('ℹ️') || line.toLowerCase().startsWith('note')) {
      elements.push(
        <div key={`info-${idx}`} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 my-2">
          <Info className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
        </div>
      )
      return
    }

    elements.push(
      <p key={`p-${idx}`} className="text-sm text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
    )
  })

  flushList()

  return <div className="space-y-1">{elements}</div>
}

function formatInlineMarkdown(text: string): string {
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
  text = text.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
  text = text.replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 text-green-700 rounded text-xs font-mono">$1</code>')
  text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-green-600 hover:text-green-700 underline" target="_blank" rel="noopener noreferrer">$1</a>')
  return text
}