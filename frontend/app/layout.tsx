import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'REMEDIA - Intelligence Verte pour l\'Afrique',
  description: 'Reconnaissance de plantes médicinales africaines par IA - Préservons notre patrimoine naturel',
  keywords: 'plantes médicinales, Afrique, IA, santé traditionnelle, phytothérapie',
  authors: [{ name: 'REMEDIA Team' }],
  openGraph: {
    title: 'REMEDIA - Intelligence Verte',
    description: 'Reconnaissance de plantes médicinales africaines par IA',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  )
}
