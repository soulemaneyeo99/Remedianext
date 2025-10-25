'use client'

/**
 * 💬 Chat Page - Layout Fullscreen Professionnel
 * 
 * Best practices 2025:
 * - Pas de footer (chat occupe tout l'écran)
 * - Layout 100vh propre
 * - Mobile-first
 * - Zero débordement
 * 
 * @version 2.0.0
 */

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Import dynamique pour éviter SSR issues
const ChatInterface = dynamic(
  () => import('@/components/chat/ChatInterface'),
  { ssr: false }
)

export default function ChatPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement du chat...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* SEO Meta */}
      <title>Chat REMÉDIA - Assistant Médical IA</title>
      <meta 
        name="description" 
        content="Discutez avec notre assistant médical IA spécialisé en plantes médicinales africaines" 
      />

      {/* Chat fullscreen - pas de wrapper, pas de footer */}
      <ChatInterface mode="fullscreen" />
    </>
  )
}