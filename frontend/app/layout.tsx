// app/layout.tsx
'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import {Footer} from '@/components/layout/Footer'
import FloatingChatBubble from '@/components/FloatingChatBubble'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hideFooter = pathname === '/chat' || pathname === '/scan'

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" 
        />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body className={inter.className}>
        {/* Navbar (caché sur /chat) */}
        {pathname !== '/chat' && <Navbar />}

        {/* Main content */}
        <main className={hideFooter ? '' : 'min-h-screen'}>
          {children}
        </main>

        {/* Footer conditionnel */}
        {!hideFooter && <Footer />}

        {/* Bubble flottante (cachée auto sur /chat) */}
        <FloatingChatBubble />
      </body>
    </html>
  )
}