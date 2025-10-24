'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Send,
  Loader2,
  Bot,
  User,
  AlertCircle,
  Info,
  Leaf,
  Shield,
  CheckCircle,
  Pill
} from 'lucide-react'
import { chatAPI, type ChatMessage } from '@/lib/api'

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        '**Bonjour !** 👋\n\nJe suis votre **assistant médical REMÉDIA**, spécialisé en plantes médicinales africaines. Comment puis-je vous aider aujourd\'hui ?'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Auto-scroll on new messages / streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingMessage])

  // Load suggestions once
  useEffect(() => {
    void loadSuggestions()
  }, [])

  const loadSuggestions = async () => {
    try {
      const res = await chatAPI.getSuggestions()
      if (res.success && Array.isArray(res.suggestions)) {
        setSuggestions(res.suggestions)
      }
    } catch (err) {
      console.warn('Suggestions unavailable', err)
    }
  }

  // Typing animation for streaming content
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

  // Send message flow (uses chatAPI -> FastAPI -> Gemini)
  const handleSendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? inputMessage).trim()
    if (!text || isLoading || isTyping) return

    const userMessage: ChatMessage = { role: 'user', content: text }
    setMessages((m) => [...m, userMessage])
    setInputMessage('')
    inputRef.current?.focus()
    setIsLoading(true)

    try {
      const res = await chatAPI.sendMessage(text, messages)
      if (res.success && typeof res.response === 'string') {
        // Stream/typing effect for better UX
        await typeMessage(res.response)
        // Push final assistant message
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: res.response
        }
        setMessages((m) => [...m, assistantMessage])
        setStreamingMessage('')
      } else {
        throw new Error('Invalid response structure')
      }
    } catch (err) {
      console.error('Chat error:', err)
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content:
          '😔 **Désolé**, une erreur est survenue. Veuillez réessayer dans quelques instants.'
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Bot className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Assistant Médical REMÉDIA</h1>
              <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>En ligne • Propulsé par Gemini AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="container mx-auto px-4 py-3 max-w-4xl">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Informations importantes</p>
              <p>
                Cet assistant fournit des informations éducatives sur les plantes médicinales.
                En cas d'urgence ou pour un diagnostic, consultez un professionnel de santé.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-4 pb-32">
          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} />
          ))}

          {/* Streaming typing message */}
          {isTyping && streamingMessage && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%] shadow-md border border-gray-100">
                <FormattedMessage content={streamingMessage} />
                <span className="inline-block w-1 h-4 bg-green-600 ml-1 animate-pulse" />
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && !isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-green-600 animate-spin" />
                  <span className="text-sm text-gray-600">L'assistant réfléchit...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions (show only at start) */}
        {messages.length <= 1 && suggestions.length > 0 && (
          <div className="pb-6">
            <p className="text-sm text-gray-600 mb-3 font-medium">💡 Questions suggérées :</p>
            <div className="grid gap-3 md:grid-cols-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestion(s)}
                  className="text-left p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <span className="text-gray-700 group-hover:text-green-700">{s}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input area fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
            <AlertCircle className="h-3 w-3" />
            <span>REMÉDIA peut faire des erreurs. Vérifiez les informations importantes.</span>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question sur les plantes médicinales..."
                disabled={isLoading || isTyping}
                className="w-full px-4 py-3 pr-12 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />

              {inputMessage.trim() && (
                <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                  {inputMessage.length}/1000
                </div>
              )}
            </div>

            <button
              onClick={() => void handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading || isTyping}
              className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {isLoading || isTyping ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 mt-2">
            REMÉDIA • pharmacie naturelle & bio — visualisation des composés et vertus (ambition en cours)
          </p>
        </div>
      </div>
    </div>
  )
}

/* ----------------------
   MessageBubble component
   ---------------------- */
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  const content = message.content

  if (isUser) {
    return (
      <div className="flex items-start justify-end space-x-3 animate-slide-in-right">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%] shadow-md break-words">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>

        <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-5 w-5 text-white" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start space-x-3 animate-slide-in-left">
      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="h-5 w-5 text-white" />
      </div>

      <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%] shadow-md border border-gray-100">
        <FormattedMessage content={content} />
      </div>
    </div>
  )
}

/* ----------------------
   FormattedMessage component
   ---------------------- */
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
            <li key={idx} className="flex items-start space-x-2">
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
    // bullet list (• - *)
    if (line.match(/^[•\-\*]\s+/)) {
      currentList.push(line.replace(/^[•\-\*]\s+/, ''))
      return
    }

    // flush list if leaving it
    if (currentList.length > 0 && !line.match(/^[•\-\*]\s+/)) {
      flushList()
    }

    if (!line) {
      elements.push(<div key={`br-${idx}`} className="h-2" />)
      return
    }

    // headings
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

    // warning
    if (line.includes('⚠️') || line.toLowerCase().includes('attention') || line.toLowerCase().includes('précaution')) {
      elements.push(
        <div key={`warn-${idx}`} className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg border border-amber-200 my-2">
          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-amber-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
        </div>
      )
      return
    }

    // medical info (posologie / dosage / pills)
    if (
      line.includes('💊') ||
      line.includes('🏥') ||
      line.toLowerCase().includes('posologie') ||
      line.toLowerCase().includes('dosage')
    ) {
      elements.push(
        <div key={`med-${idx}`} className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200 my-2">
          <Pill className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-blue-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
        </div>
      )
      return
    }

    // success / advice
    if (line.includes('✅') || line.includes('✓') || line.toLowerCase().startsWith('conseil')) {
      elements.push(
        <div key={`ok-${idx}`} className="flex items-start gap-2 bg-green-50 p-3 rounded-lg border border-green-200 my-2">
          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-green-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
        </div>
      )
      return
    }

    // info / note
    if (line.includes('ℹ️') || line.includes('💡') || line.toLowerCase().startsWith('note') || line.toLowerCase().startsWith('remarque')) {
      elements.push(
        <div key={`info-${idx}`} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 my-2">
          <Info className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
        </div>
      )
      return
    }

    // normal paragraph
    elements.push(
      <p key={`p-${idx}`} className="text-sm text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
    )
  })

  // flush if any remaining list
  flushList()

  return <div className="space-y-1">{elements}</div>
}

/* ----------------------
   Inline markdown formatter
   ---------------------- */
function formatInlineMarkdown(text: string): string {
  // bold **text**
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
  // italic *text*
  text = text.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
  // inline code `code`
  text = text.replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 text-green-700 rounded text-xs font-mono">$1</code>')
  // links [text](url)
  text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-green-600 hover:text-green-700 underline" target="_blank" rel="noopener noreferrer">$1</a>')
  return text
}
