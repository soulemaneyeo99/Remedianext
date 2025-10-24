import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/toaster'
import FloatingChatBubble from '@/components/FloatingChatBubble'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'REMÉDIA - L\'intelligence verte au service de l\'Afrique',
  description: 'Reconnaissez instantanément les plantes médicinales africaines grâce à l\'IA. Préservez les savoirs ancestraux, accédez aux soins naturels.',
  keywords: 'plantes médicinales, Afrique, IA, santé naturelle, médecine traditionnelle',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Navbar />
        
        <main className="min-h-screen">
          {children}
        </main>

        <Footer />

        {/* Chat Bubble Flottant - Disponible sur toutes les pages */}
        <FloatingChatBubble />
      </body>
    </html>
  )
}
