'use client'

/**
 * 💬 Floating Chat Bubble
 * 
 * Bubble flottante qui apparaît sur toutes les pages SAUF /chat
 * (pour éviter doublon avec le chat fullscreen)
 * 
 * @version 2.0.0
 */

import { useState, useEffect, type ComponentType } from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

// Import dynamique pour éviter SSR issues
const ChatInterface = dynamic(
  () => import('./chat/ChatInterface'),
  { ssr: false }
) as ComponentType<{ mode?: string }>

export default function FloatingChatBubble() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Cacher sur /chat et /scan (fullscreen pages)
  const shouldHide = pathname === '/chat' || pathname === '/scan'

  if (!mounted || shouldHide) {
    return null
  }

  return (
    <ChatInterface 
      mode="bubble"
    />
  )
}