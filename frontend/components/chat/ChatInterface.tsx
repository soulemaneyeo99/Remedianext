'use client'

/**
 * 💎 ChatInterface Professional - UX Mobile-First
 * 
 * Best practices 2025:
 * - Mobile-first responsive design
 * - Smooth streaming avec auto-scroll intelligent
 * - Layout adaptatif (mobile/tablet/desktop)
 * - Touch-friendly interactions
 * - Accessible (WCAG 2.1 AA)
 * - Performance optimisée
 * 
 * @version 3.0.0
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send,
  Loader2,
  Bot,
  User,
  AlertCircle,
  Leaf,
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
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
  ArrowRight,
  Check
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
  isStreaming?: boolean
}

// ============================================
// COMPONENT
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
  const [streamingMessage, setStreamingMessage] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isMinimized, setIsMinimized] = useState(mode === 'bubble')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  // ========== REFS ==========
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)
  const isAutoScrolling = useRef(true)

  // ========== AUTO-SCROLL INTELLIGENT ==========
  
  const scrollToBottom = useCallback((behavior: 'smooth' | 'auto' = 'smooth') => {
    if (messagesEndRef.current && isAutoScrolling.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' })
    }
  }, [])

  // Détecter si l'user scroll manuellement
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    
    isAutoScrolling.current = isNearBottom
  }, [])

  // ========== EFFECTS ==========

  // Auto-scroll pendant streaming
  useEffect(() => {
    scrollToBottom('smooth')
  }, [messages, streamingMessage, scrollToBottom])

  // Charger messages du localStorage
  useEffect(() => {
    const saved = localStorage.getItem('remedia-chat-messages')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMessages(parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })))
      } catch (e) {
        console.error('Failed to load messages:', e)
      }
    }
  }, [])

  // Sauvegarder messages dans localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('remedia-chat-messages', JSON.stringify(messages))
    }
  }, [messages])

  // Charger suggestions au démarrage
  useEffect(() => {
    loadSuggestions()
  }, [])

  // Message initial
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSendMessage(initialMessage)
    }
  }, [initialMessage])

  // Focus input quand minimized change
  useEffect(() => {
    if (!isMinimized && mode === 'bubble') {
      inputRef.current?.focus()
    }
  }, [isMinimized, mode])

  // ========== SUGGESTIONS ==========

  const loadSuggestions = async () => {
    try {
      const res = await chatAPI.getSuggestions()
      if (res.success && Array.isArray(res.suggestions)) {
        setSuggestions(res.suggestions)
        return
      }
    } catch (err) {
      console.warn('Suggestions unavailable, using fallback', err)
    }

    // Fallback: Import dynamique
    try {
      const { getRandomQuestions } = await import('@/lib/strategic-questions')
      const randomQuestions = getRandomQuestions(6)
      setSuggestions(randomQuestions)
    } catch (e) {
      console.error('Failed to load strategic questions:', e)
    }
  }

  // ========== SEND MESSAGE ==========

  const handleSendMessage = async (messageText: string = inputMessage) => {
    const trimmed = messageText.trim()
    if (!trimmed || isLoading) return

    // User message
    const userMessage: ExtendedMessage = {
      role: 'user',
      content: trimmed,
      id: `user-${Date.now()}`,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setStreamingMessage('')
    isAutoScrolling.current = true

    // Scroll immédiatement après user message
    setTimeout(() => scrollToBottom('auto'), 50)

    try {
      // Assistant message (placeholder pour streaming)
      const assistantId = `assistant-${Date.now()}`
      
      // Appeler API
      const history = messages.map(m => ({
        role: m.role,
        content: m.content
      }))

      const response = await chatAPI.sendMessage(trimmed, history)

      if (response.success && response.response) {
        // Simuler streaming pour UX fluide
        const fullText = response.response
        const words = fullText.split(' ')
        let currentText = ''

        // Assistant message
        const assistantMessage: ExtendedMessage = {
          role: 'assistant',
          content: '',
          id: assistantId,
          timestamp: new Date(),
          isStreaming: true
        }

        setMessages(prev => [...prev, assistantMessage])

        // Stream words
        for (let i = 0; i < words.length; i++) {
          currentText += (i > 0 ? ' ' : '') + words[i]
          setStreamingMessage(currentText)
          
          // Scroll pendant streaming
          if (i % 5 === 0) {
            scrollToBottom('smooth')
          }
          
          await new Promise(resolve => setTimeout(resolve, 30))
        }

        // Finaliser
        setMessages(prev => prev.map(m => 
          m.id === assistantId 
            ? { ...m, content: fullText, isStreaming: false }
            : m
        ))
        setStreamingMessage('')

      } else {
        throw new Error(response.error || 'Réponse invalide')
      }

    } catch (error: any) {
      console.error('Chat error:', error)
      
      const errorMessage: ExtendedMessage = {
        role: 'assistant',
        content: '😔 Désolé, une erreur est survenue. Veuillez réessayer dans quelques instants.',
        id: `error-${Date.now()}`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setTimeout(() => scrollToBottom('smooth'), 100)
    }
  }

  // ========== SUGGESTION CLICK ==========

  const handleSuggestion = (suggestion: string) => {
    setInputMessage(suggestion)
    handleSendMessage(suggestion)
  }

  // ========== VOICE INPUT ==========

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        const recognition = new SpeechRecognition()
        
        recognition.lang = 'fr-FR'
        recognition.continuous = false
        recognition.interimResults = false

        recognition.onstart = () => setIsListening(true)
        recognition.onend = () => setIsListening(false)
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInputMessage(transcript)
          inputRef.current?.focus()
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognitionRef.current = recognition
        recognition.start()
      } else {
        alert('Votre navigateur ne supporte pas la reconnaissance vocale')
      }
    }
  }

  // ========== ACTIONS ==========

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const handleFeedback = (messageId: string, type: 'positive' | 'negative') => {
    setMessages(prev => prev.map(m =>
      m.id === messageId
        ? { ...m, feedback: m.feedback === type ? null : type }
        : m
    ))
  }

  const handleClearChat = () => {
    if (confirm('Effacer toute la conversation ?')) {
      setMessages([])
      setStreamingMessage('')
      localStorage.removeItem('remedia-chat-messages')
    }
  }

  const handleExport = () => {
    const data = JSON.stringify(messages, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `remedia-chat-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ========== KEYBOARD ==========

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // ========== RENDER ==========

  // Bubble minimized
  if (mode === 'bubble' && isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:scale-110"
        aria-label="Ouvrir le chat"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </button>
    )
  }

  // Container classes
  const containerClasses = cn(
    'flex flex-col bg-white',
    mode === 'fullscreen' ? [
      'h-screen w-full'
    ] : [
      'fixed bottom-6 right-6 z-50',
      'w-[calc(100vw-3rem)] max-w-md',
      'h-[600px] max-h-[calc(100vh-6rem)]',
      'rounded-2xl shadow-2xl',
      'border border-gray-200'
    ],
    className
  )

  return (
    <div className={containerClasses}>
      {/* ========== HEADER ========== */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm sm:text-base">
              Assistant REMÉDIA
            </h2>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              En ligne
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <>
              <button
                onClick={handleExport}
                className="p-2 hover:bg-white rounded-lg transition-colors"
                title="Exporter"
              >
                <Download className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={handleClearChat}
                className="p-2 hover:bg-white rounded-lg transition-colors"
                title="Effacer"
              >
                <Trash2 className="h-4 w-4 text-gray-600" />
              </button>
            </>
          )}
          
          {mode === 'bubble' && (
            <>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 hover:bg-white rounded-lg transition-colors"
                title="Réduire"
              >
                <Minimize2 className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-lg transition-colors"
                title="Fermer"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ========== MESSAGES ========== */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 scroll-smooth"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Bonjour ! 👋
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-sm">
              Je suis votre assistant médical REMÉDIA, spécialisé en plantes médicinales africaines. 
              Comment puis-je vous aider aujourd'hui ?
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3 animate-in slide-in-from-bottom-2 duration-300',
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            {/* Avatar */}
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
              message.role === 'user'
                ? 'bg-blue-500'
                : 'bg-gradient-to-br from-green-500 to-emerald-600'
            )}>
              {message.role === 'user' ? (
                <User className="h-4 w-4 text-white" />
              ) : (
                <Bot className="h-4 w-4 text-white" />
              )}
            </div>

            {/* Content */}
            <div className={cn(
              'flex-1 min-w-0',
              message.role === 'user' ? 'flex flex-col items-end' : 'flex flex-col items-start'
            )}>
              <div className={cn(
                'rounded-2xl px-4 py-3 max-w-[85%] sm:max-w-[75%] break-words',
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              )}>
                <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
                  {message.isStreaming ? streamingMessage : message.content}
                </p>
                
                {message.isStreaming && (
                  <span className="inline-block w-1 h-4 bg-current ml-1 animate-pulse" />
                )}
              </div>

              {/* Actions (assistant only) */}
              {message.role === 'assistant' && !message.isStreaming && (
                <div className="flex items-center gap-2 mt-2 ml-2">
                  <button
                    onClick={() => handleCopy(message.content, message.id)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group"
                    title="Copier"
                  >
                    {copiedId === message.id ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600" />
                    )}
                  </button>

                  <button
                    onClick={() => handleFeedback(message.id, 'positive')}
                    className={cn(
                      'p-1.5 hover:bg-gray-100 rounded-lg transition-colors',
                      message.feedback === 'positive' && 'bg-green-100'
                    )}
                    title="Utile"
                  >
                    <ThumbsUp className={cn(
                      'h-3.5 w-3.5',
                      message.feedback === 'positive' ? 'text-green-600' : 'text-gray-400'
                    )} />
                  </button>

                  <button
                    onClick={() => handleFeedback(message.id, 'negative')}
                    className={cn(
                      'p-1.5 hover:bg-gray-100 rounded-lg transition-colors',
                      message.feedback === 'negative' && 'bg-red-100'
                    )}
                    title="Pas utile"
                  >
                    <ThumbsDown className={cn(
                      'h-3.5 w-3.5',
                      message.feedback === 'negative' ? 'text-red-600' : 'text-gray-400'
                    )} />
                  </button>

                  <span className="text-xs text-gray-400 ml-1">
                    {message.timestamp.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ========== SUGGESTIONS ========== */}
      {messages.length === 0 && suggestions.length > 0 && (
        <div className="px-4 sm:px-6 pb-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-gray-700">Questions suggérées</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestions.slice(0, 4).map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestion(suggestion)}
                  className="text-left text-xs sm:text-sm p-3 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <p className="line-clamp-2 text-gray-700 group-hover:text-green-700">
                    {suggestion}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={loadSuggestions}
              className="mt-3 w-full text-xs text-gray-600 hover:text-green-600 flex items-center justify-center gap-2 py-2"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Autres questions
            </button>
          </div>
        </div>
      )}

      {/* ========== INPUT ========== */}
      <div className="border-t border-gray-200 p-4 sm:p-6 bg-white flex-shrink-0">
        <div className="flex gap-2 sm:gap-3">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question sur les plantes médicinales..."
            disabled={isLoading}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ maxHeight: '120px' }}
          />

          <div className="flex flex-col gap-2">
            <button
              onClick={toggleVoiceInput}
              disabled={isLoading}
              className={cn(
                'p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
              title={isListening ? 'Arrêter' : 'Dicter'}
            >
              {isListening ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-500 disabled:hover:to-emerald-600"
              title="Envoyer"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 mt-3 text-center">
          💡 Appuyez sur Entrée pour envoyer, Maj+Entrée pour nouvelle ligne
        </p>
      </div>
    </div>
  )
}