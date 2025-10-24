'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Send,
  Loader2,
  Bot,
  User,
  Leaf,
  AlertCircle,
  Info,
  CheckCircle,
  Pill
} from 'lucide-react'
import { chatAPI, type ChatMessage } from '@/lib/api'

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '**Bonjour !** 👋\n\nJe suis votre **assistant médical REMÉDIA**, spécialisé en plantes médicinales africaines.\n\nComment puis-je vous aider aujourd\'hui ?'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingMessage])

  // Focus input
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Typing progressif
  const typeMessage = (text: string) => {
    return new Promise<void>((resolve) => {
      setIsTyping(true)
      setStreamingMessage('')
      let index = 0
      const typingSpeed = 15
      const typeNextChar = () => {
        if (index < text.length) {
          setStreamingMessage(prev => prev + text[index])
          index++
          setTimeout(typeNextChar, typingSpeed)
        } else {
          setIsTyping(false)
          resolve()
        }
      }
      typeNextChar()
    })
  }

  const handleSendMessage = async () => {
    const textToSend = inputMessage.trim()
    if (!textToSend || isLoading || isTyping) return

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
        await typeMessage(response.response)

        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.response
        }
        setMessages(prev => [...prev, assistantMessage])
        setStreamingMessage('')
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: '😔 **Désolé**, une erreur est survenue.\n\nVeuillez réessayer dans quelques instants.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Assistant Médical REMÉDIA</h1>
        <p className="text-sm text-green-600">En ligne • Propulsé par Gemini AI</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200 p-4">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            Cet assistant fournit des informations sur la médecine traditionnelle à titre éducatif. 
            En cas d'urgence médicale, consultez immédiatement un professionnel de santé.
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}

        {isTyping && streamingMessage && (
          <div className="flex items-start space-x-2 animate-fade-in">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 max-w-[75%] shadow-md border border-gray-100">
              <FormattedMessage content={streamingMessage} />
              <span className="inline-block w-1 h-4 bg-green-600 ml-1 animate-pulse"></span>
            </div>
          </div>
        )}

        {isLoading && !isTyping && (
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 text-green-600 animate-spin" />
                <span className="text-sm text-gray-600">L'assistant réfléchit...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 flex items-end space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Posez votre question sur les plantes médicinales..."
          disabled={isLoading || isTyping}
          className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 text-sm"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading || isTyping}
          className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
        >
          {isLoading || isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}

// Message Bubble Component
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex items-start justify-end space-x-2 animate-slide-in-right">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[75%] shadow-md break-words">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-5 w-5 text-white" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start space-x-2 animate-slide-in-left">
      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="h-5 w-5 text-white" />
      </div>
      <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 max-w-[75%] shadow-md border border-gray-100">
        <FormattedMessage content={message.content} />
      </div>
    </div>
  )
}

// Formatted Message Component avec markdown pro
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: JSX.Element[] = []
  let currentList: string[] = []
  let listKey = 0

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="space-y-2 my-2 list-disc list-inside">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <Leaf className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
            </li>
          ))}
        </ul>
      )
      currentList = []
    }
  }

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()

    if (trimmedLine.match(/^[•\-\*]\s+/)) {
      currentList.push(trimmedLine.replace(/^[•\-\*]\s+/, ''))
      return
    }

    if (currentList.length > 0 && !trimmedLine.match(/^[•\-\*]\s+/)) {
      flushList()
    }

    if (!trimmedLine) {
      elements.push(<div key={`br-${index}`} className="h-2" />)
      return
    }

    if (trimmedLine.startsWith('## ')) {
      elements.push(<h3 key={`h3-${index}`} className="text-base font-bold text-gray-900 mt-3 mb-2">{trimmedLine.replace('## ', '')}</h3>)
      return
    }

    if (trimmedLine.startsWith('### ')) {
      elements.push(<h4 key={`h4-${index}`} className="text-sm font-semibold text-gray-800 mt-2 mb-1">{trimmedLine.replace('### ', '')}</h4>)
      return
    }

    if (trimmedLine.includes('⚠️') || trimmedLine.toLowerCase().includes('attention')) {
      elements.push(
        <div key={`warning-${index}`} className="flex items-start space-x-2 bg-amber-50 p-3 rounded-lg border border-amber-200 my-2">
          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-amber-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmedLine) }} />
        </div>
      )
      return
    }

    if (trimmedLine.includes('💊') || trimmedLine.includes('🏥')) {
      elements.push(
        <div key={`medical-${index}`} className="flex items-start space-x-2 bg-blue-50 p-3 rounded-lg border border-blue-200 my-2">
          <Pill className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-blue-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmedLine) }} />
        </div>
      )
      return
    }

    if (trimmedLine.includes('✅') || trimmedLine.toLowerCase().startsWith('conseil')) {
      elements.push(
        <div key={`success-${index}`} className="flex items-start space-x-2 bg-green-50 p-3 rounded-lg border border-green-200 my-2">
          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-green-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmedLine) }} />
        </div>
      )
      return
    }

    if (trimmedLine.includes('ℹ️') || trimmedLine.toLowerCase().startsWith('note')) {
      elements.push(
        <div key={`info-${index}`} className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200 my-2">
          <Info className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmedLine) }} />
        </div>
      )
      return
    }

    elements.push(
      <p key={`p-${index}`} className="text-sm text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmedLine) }} />
    )
  })

  flushList()

  return <div className="space-y-1">{elements}</div>
}

// Markdown inline formatter
function formatInlineMarkdown(text: string): string {
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
  text = text.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
  text = text.replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 text-green-700 rounded text-xs font-mono">$1</code>')
  text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-green-600 hover:text-green-700 underline" target="_blank" rel="noopener">$1</a>')
  return text
}
