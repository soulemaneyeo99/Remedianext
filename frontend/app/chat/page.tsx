'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Loader2, 
  Sparkles,
  Bot,
  User,
  AlertCircle,
  Info,
  Leaf,
  Heart,
  Shield
} from 'lucide-react'
import { chatAPI, type ChatMessage } from '@/lib/api'

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Bonjour ! 👋 Je suis votre assistant médical spécialisé en plantes médicinales africaines. Comment puis-je vous aider aujourd\'hui ?'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load suggestions on mount
  useEffect(() => {
    loadSuggestions()
  }, [])

  const loadSuggestions = async () => {
    try {
      const response = await chatAPI.getSuggestions()
      if (response.success) {
        setSuggestions(response.suggestions)
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error)
    }
  }

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim()
    
    if (!textToSend || isLoading) return

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: textToSend
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await chatAPI.sendMessage(textToSend, messages)
      
      if (response.success) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.response
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error: any) {
      console.error('Chat error:', error)
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: '😔 Désolé, une erreur est survenue. Veuillez réessayer dans quelques instants.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Bot className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                Assistant Médical REMÉDIA
              </h1>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>En ligne • Propulsé par Gemini AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Informations importantes</p>
              <p className="text-blue-700">
                Cet assistant fournit des informations sur la médecine traditionnelle à titre éducatif. 
                En cas d'urgence médicale, consultez immédiatement un professionnel de santé.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-4 pb-32">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-6 w-6 text-white" />
              </div>
              
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-md border border-gray-100">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 text-green-600 animate-spin" />
                  <span className="text-sm text-gray-600">L'assistant réfléchit...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions (shown when no messages or at start) */}
        {messages.length <= 1 && suggestions.length > 0 && (
          <div className="pb-6">
            <p className="text-sm text-gray-600 mb-3 font-medium">
              💡 Questions suggérées :
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <span className="text-gray-700 group-hover:text-green-700">
                    {suggestion}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area (Fixed at bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          {/* Warning */}
          <div className="flex items-center space-x-2 mb-3 text-xs text-gray-600">
            <AlertCircle className="h-3 w-3" />
            <span>
              REMÉDIA peut faire des erreurs. Vérifiez les informations importantes.
            </span>
          </div>

          {/* Input */}
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question sur les plantes médicinales..."
                disabled={isLoading}
                className="w-full px-4 py-3 pr-12 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              
              {inputMessage.trim() && (
                <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                  {inputMessage.length}/1000
                </div>
              )}
            </div>

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:hover:shadow-md"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Send className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Message Bubble Component
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex items-start justify-end space-x-3">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%] shadow-md">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-6 w-6 text-white" />
        </div>
      </div>
    )
  }

  // Assistant message
  return (
    <div className="flex items-start space-x-3">
      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="h-6 w-6 text-white" />
      </div>

      <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%] shadow-md border border-gray-100">
        <div className="prose prose-sm max-w-none">
          <FormattedMessage content={message.content} />
        </div>
      </div>
    </div>
  )
}

// Formatted Message Component (handles markdown-like formatting)
function FormattedMessage({ content }: { content: string }) {
  // Simple formatting: bold, lists, etc.
  const lines = content.split('\n')

  return (
    <div className="text-sm text-gray-800 leading-relaxed space-y-2">
      {lines.map((line, index) => {
        // Bold text **text**
        const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
        
        // Lists
        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
          return (
            <div key={index} className="flex items-start space-x-2">
              <Leaf className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span dangerouslySetInnerHTML={{ __html: boldFormatted.replace(/^[•\-]\s*/, '') }} />
            </div>
          )
        }

        // Warning lines
        if (line.includes('⚠️') || line.toLowerCase().includes('attention') || line.toLowerCase().includes('précaution')) {
          return (
            <div key={index} className="flex items-start space-x-2 bg-amber-50 p-2 rounded-lg border border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="text-amber-800" dangerouslySetInnerHTML={{ __html: boldFormatted }} />
            </div>
          )
        }

        // Health/medical lines
        if (line.includes('💊') || line.includes('🏥')) {
          return (
            <div key={index} className="flex items-start space-x-2 bg-blue-50 p-2 rounded-lg border border-blue-200">
              <Shield className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-blue-800" dangerouslySetInnerHTML={{ __html: boldFormatted }} />
            </div>
          )
        }

        // Regular lines
        if (line.trim()) {
          return (
            <p key={index} dangerouslySetInnerHTML={{ __html: boldFormatted }} />
          )
        }

        return <br key={index} />
      })}
    </div>
  )
}
