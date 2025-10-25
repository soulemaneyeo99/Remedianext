'use client'

/**
 * 🎨 Root Layout - Gestion Footer Conditionnelle
 * 
 * Footer caché sur:
 * - /chat (fullscreen chat)
 * - /scan (camera fullscreen)
 * 
 * Footer visible sur:
 * - / (home)
 * - /plants (encyclopédie)
 * - etc.
 */

import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Routes sans footer (fullscreen)
  const hideFooter = pathname === '/chat' || pathname === '/scan'

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#10b981" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {/* Navbar toujours présent (sauf si chat en mode bubble) */}
        {pathname !== '/chat' && <Navbar />}

        {/* Main content */}
        <main className={hideFooter ? '' : 'min-h-screen'}>
          {children}
        </main>

        {/* Footer conditionnel */}
        {!hideFooter && <Footer />}
      </body>
    </html>
  )
}