'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Leaf, Menu, X, Scan, MessageCircle, MapPin, BookOpen } from 'lucide-react'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Accueil', href: '/', icon: Leaf },
    { name: 'Scanner', href: '/scan', icon: Scan },
    { name: 'Assistant IA', href: '/chat', icon: MessageCircle },
    { name: 'Encyclopédie', href: '/plants', icon: BookOpen },
    { name: 'Carte', href: '/map', icon: MapPin },
  ]

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">REMÉDIA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/scan" className="btn-primary">
              <Scan className="h-4 w-4 mr-2" />
              Scanner
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-slide-up">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
