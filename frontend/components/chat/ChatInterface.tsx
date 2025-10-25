'use client'

/**
 * 💎 ChatInterface Ultimate v5.0 - Production Ready
 * 
 * Features:
 * - Markdown rendering (react-markdown)
 * - Bubble cachée sur /chat (pas de doublon)
 * - Mobile-first responsive
 * - Auto-scroll intelligent
 * - Zero débordement
 * 
 * @version 5.0.0
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Send,
  Loader2,
  Bot,
  User,
  Leaf,
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
  Check,
  ChevronDown
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
// MARKDOWN COMPONENTS
// ============================================

const MarkdownComponents = {
  // Paragraphs
  p: ({ children }: any) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  
  // Headers
  h1: ({ children }: any) => (
    <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-base font-semibold mb-2 mt-3 first:mt-0">{children}</h3>
  ),
  
  // Lists
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>
  ),
  li: ({ children }: any) => (
    <li className="leading-relaxed">{children}</li>
  ),
  
  // Code
  code: ({ inline, children }: any) => 
    inline ? (
      <code className="bg-black bg-opacity-10 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ) : (
      <code className="block bg-black bg-opacity-10 p-3 rounded-lg text-sm font-mono overflow-x-auto my-2">
        {children}
      </code>
    ),
  
  // Blockquote
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-green-500 pl-4 py-2 my-2 italic bg-green-50 bg-opacity-50 rounded-r">
      {children}
    </blockquote>
  ),
  
  // Strong/Bold
  strong: ({ children }: any) => (
    <strong className="font-bold">{children}</strong>
  ),
  
  // Em/Italic
  em: ({ children }: any) => (
    <em className="italic">{children}</em>
  ),
  
  // Links
  a: ({ href, children }: any) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-green-600 hover:text-green-700 underline"
    >
      {children}
    </a>
  ),
  
  // Horizontal rule
  hr: () => (
    <hr className="my-4 border-gray-300" />
  ),
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
  const pathname = usePathname()
  
  // ========== STATE ==========
  const [messages, setMessages] = useState<ExtendedMessage[]>([])
  const [inputMessage, setInputMessage] = useState(initialMessage || '')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isMinimized, setIsMinimized] = useState(mode === 'bubble')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  
  // ========== REFS ==========
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)
  const isAutoScrolling = useRef(true)

  // ========== BUBBLE VISIBILITY ==========
  // Cacher bubble si on est déjà sur /chat
  const shouldHideBubble = mode === 'bubble' && pathname === '/chat'
  
  if (shouldHideBubble) {
    return null // Ne rien render
  }

  // ========== AUTO-SCROLL ==========
  
  const scrollToBottom = useCallback((behavior: 'smooth' | 'auto' = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' })
  }, [])

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    
    setShowScrollButton(distanceFromBottom > 300)
    isAutoScrolling.current = distanceFromBottom < 100
  }, [])

  // ========== EFFECTS ==========

  useEffect(() => {
    scrollToBottom('smooth')
  }, [messages, streamingMessage, scrollToBottom])

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

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('remedia-chat-messages', JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    loadSuggestions()
  }, [])

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSendMessage(initialMessage)
    }
  }, [initialMessage])

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

    setTimeout(() => scrollToBottom('auto'), 50)

    try {
      const assistantId = `assistant-${Date.now()}`
      const history = messages.map(m => ({
        role: m.role,
        content: m.content
      }))

      const response = await chatAPI.sendMessage(trimmed, history)

      if (response.success && response.response) {
        const fullText = response.response
        const words = fullText.split(' ')
        let currentText = ''

        const assistantMessage: ExtendedMessage = {
          role: 'assistant',
          content: '',
          id: assistantId,
          timestamp: new Date(),
          isStreaming: true
        }

        setMessages(prev => [...prev, assistantMessage])

        for (let i = 0; i < words.length; i++) {
          currentText += (i > 0 ? ' ' : '') + words[i]
          setStreamingMessage(currentText)
          
          if (i % 5 === 0) {
            scrollToBottom('smooth')
          }
          
          await new Promise(resolve => setTimeout(resolve, 30))
        }

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
        content: '😔 Désolé, une erreur est survenue. Veuillez réessayer.',
        id: `error-${Date.now()}`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setTimeout(() => scrollToBottom('smooth'), 100)
    }
  }

  // ========== ACTIONS ==========

  const handleSuggestion = (suggestion: string) => {
    setInputMessage(suggestion)
    handleSendMessage(suggestion)
  }

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

        recognition.onerror = () => setIsListening(false)

        recognitionRef.current = recognition
        recognition.start()
      } else {
        alert('Votre navigateur ne supporte pas la reconnaissance vocale')
      }
    }
  }

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target
    target.style.height = 'auto'
    target.style.height = Math.min(target.scrollHeight, 120) + 'px'
    setInputMessage(target.value)
  }

  // ========== RENDER ==========

  // Bubble minimized
  if (mode === 'bubble' && isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:scale-110"
        aria-label="Ouvrir le chat"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </button>
    )
  }

  const containerClasses = cn(
    'flex flex-col bg-white',
    mode === 'fullscreen' ? [
      'h-screen w-full',
      'h-[100dvh]',
    ] : [
      'fixed z-50',
      'bottom-4 right-4 sm:bottom-6 sm:right-6',
      'w-[calc(100vw-2rem)]',
      'sm:w-[calc(100vw-3rem)]',
      'max-w-md',
      'h-[calc(100vh-2rem)]',
      'sm:h-[600px]',
      'max-h-[calc(100vh-2rem)]',
      'rounded-2xl shadow-2xl',
      'border border-gray-200'
    ],
    className
  )

  return (
    <div className={containerClasses}>
      {/* ========== HEADER ========== */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
              Assistant REMÉDIA
            </h2>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
              <span className="truncate">En ligne</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
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
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        style={{ 
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Bonjour ! 👋
            </h3>
            <p className="text-sm text-gray-600 max-w-xs">
              Je suis votre assistant médical REMÉDIA. Comment puis-je vous aider ?
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-2 sm:gap-3 animate-in slide-in-from-bottom-2 duration-300',
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
                'rounded-2xl px-3 sm:px-4 py-2 sm:py-3 max-w-[85%] break-words',
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              )}>
                {message.role === 'assistant' ? (
                  message.isStreaming ? (
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-green">
                      {streamingMessage}
                      <span className="inline-block w-0.5 h-4 bg-current ml-1 animate-pulse" />
                    </div>
                  ) : (
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-green">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={MarkdownComponents}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                )}
              </div>

              {/* Actions */}
              {message.role === 'assistant' && !message.isStreaming && (
                <div className="flex items-center gap-1 mt-1.5">
                  <button
                    onClick={() => handleCopy(message.content, message.id)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copier"
                  >
                    {copiedId === message.id ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-gray-400" />
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

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll button */}
      {showScrollButton && (
        <button
          onClick={() => {
            isAutoScrolling.current = true
            scrollToBottom('smooth')
          }}
          className="absolute bottom-20 right-4 w-10 h-10 bg-white border border-gray-300 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all z-10"
          title="Retour en bas"
        >
          <ChevronDown className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* ========== SUGGESTIONS ========== */}
      {messages.length === 0 && suggestions.length > 0 && (
        <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span className="text-xs font-medium text-gray-700">Questions suggérées</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestions.slice(0, 4).map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestion(suggestion)}
                className="text-left text-xs p-2.5 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <p className="line-clamp-2 text-gray-700 group-hover:text-green-700">
                  {suggestion}
                </p>
              </button>
            ))}
          </div>

          <button
            onClick={loadSuggestions}
            className="mt-2 w-full text-xs text-gray-600 hover:text-green-600 flex items-center justify-center gap-2 py-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Autres questions
          </button>
        </div>
      )}

      {/* ========== INPUT ========== */}
      <div className="flex-shrink-0 border-t border-gray-200 p-3 sm:p-4 bg-white">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            disabled={isLoading}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            style={{ maxHeight: '120px' }}
          />

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={toggleVoiceInput}
              disabled={isLoading}
              className={cn(
                'min-w-[44px] h-[44px] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center',
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
              className="min-w-[44px] h-[44px] bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-500 disabled:hover:to-emerald-600 flex items-center justify-center"
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
      </div>
    </div>
  )
}