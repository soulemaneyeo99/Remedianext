'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Leaf, 
  Scan, 
  BookOpen, 
  LayoutDashboard,
  Menu, 
  X,
  ChevronDown,
  Sparkles,
  Heart,
  Users,
  ArrowRight
} from 'lucide-react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const pathname = usePathname()

  // Effet de scroll pour navbar transparente
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { 
      name: 'Accueil', 
      href: '/', 
      icon: Sparkles,
      description: 'Découvrir REMÉDIA'
    },
    { 
      name: 'Scanner', 
      href: '/scan', 
      icon: Scan,
      description: 'Identifier une plante',
      highlight: true
    },
    { 
      name: 'Encyclopédie', 
      href: '/plants', 
      icon: BookOpen,
      description: 'Base de données'
    },
    { 
      name: 'Impact', 
      href: '/dashboard', 
      icon: LayoutDashboard,
      description: 'Nos métriques'
    },
  ]

  const resources = [
    {
      name: 'Communauté',
      href: '#community',
      icon: Users,
      description: 'Rejoignez notre réseau'
    },
    {
      name: 'À propos',
      href: '#about',
      icon: Heart,
      description: 'Notre mission'
    }
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Navbar */}
      <nav 
        className={`
          fixed top-0 left-0 right-0 z-40 transition-all duration-300
          ${scrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
            : 'bg-white/80 backdrop-blur-sm'
          }
        `}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <Leaf className="h-7 w-7 text-white" />
                </div>
              </div>
              
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  REMÉDIA
                </span>
                <p className="text-xs text-gray-600 -mt-1">
                  L'intelligence verte
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group relative px-4 py-2.5 rounded-xl font-medium text-sm
                      transition-all duration-200
                      ${active
                        ? 'text-green-600'
                        : 'text-gray-700 hover:text-green-600'
                      }
                      ${item.highlight
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100'
                        : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-4 w-4 ${active ? 'text-green-600' : 'text-gray-500 group-hover:text-green-600'} transition-colors`} />
                      <span>{item.name}</span>
                      {item.highlight && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    
                    {/* Active indicator */}
                    {active && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
                    )}
                  </Link>
                )
              })}

              {/* Resources Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className="flex items-center space-x-1 px-4 py-2.5 rounded-xl font-medium text-sm text-gray-700 hover:text-green-600 hover:bg-gray-50 transition-all"
                >
                  <span>Ressources</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {resourcesOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setResourcesOpen(false)}
                    ></div>
                    
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20 animate-slide-in">
                      {resources.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                            onClick={() => setResourcesOpen(false)}
                          >
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                              <Icon className="h-5 w-5 text-green-600" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                                {item.name}
                              </div>
                              <div className="text-xs text-gray-600 mt-0.5">
                                {item.description}
                              </div>
                            </div>

                            <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link 
                href="/scan" 
                className="group relative px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative flex items-center space-x-2">
                  <Scan className="h-4 w-4" />
                  <span>Scanner une plante</span>
                </div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-xl transition-all
                      ${active
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 ${active ? 'text-green-600' : 'text-gray-500'}`} />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                      </div>
                    </div>
                    
                    {item.highlight && (
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    )}
                  </Link>
                )
              })}

              {/* Resources in mobile */}
              <div className="pt-4 border-t border-gray-100">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Ressources
                </p>
                {resources.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* CTA in mobile */}
              <div className="pt-4">
                <Link
                  href="/scan"
                  className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Scan className="h-5 w-5" />
                  <span>Scanner une plante</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer pour éviter que le contenu soit caché sous la navbar */}
      <div className="h-20"></div>
    </>
  )
}