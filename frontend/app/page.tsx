'use client'

/**
 * 🏠 Home Page - Landing Page Professionnelle
 * 
 * Features:
 * - Hero section avec image réelle (Moringa phone mockup)
 * - CTAs clairs
 * - Features cards
 * - Stats impact
 * - Responsive mobile-first
 * 
 * @version 2.0.0
 */

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Leaf, 
  Camera, 
  MessageCircle, 
  BookOpen, 
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  Play,
  Check
} from 'lucide-react'

export default function HomePage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">
                  IA Médicale Africaine
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Médecine Traditionnelle{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Intelligente
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Découvrez les plantes médicinales africaines grâce à l'intelligence artificielle. 
                Scannez, identifiez et apprenez avec REMÉDIA.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">
                    <strong className="font-semibold text-gray-900">200+</strong> plantes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">
                    <strong className="font-semibold text-gray-900">95%</strong> précision
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">
                    <strong className="font-semibold text-gray-900">10k+</strong> utilisateurs
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link
                  href="/scan"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105"
                >
                  <Camera className="h-5 w-5" />
                  Scanner une plante
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-500"
                >
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  Discuter avec l'IA
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="pt-8 flex items-center gap-4 justify-center lg:justify-start text-sm text-gray-600">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <p>
                  Approuvé par <strong>des milliers</strong> d'utilisateurs
                </p>
              </div>
            </div>

            {/* Right: Image Hero */}
            <div className="relative">
              {/* Main Image - Moringa Phone Mockup */}
              <div className="relative mx-auto max-w-md lg:max-w-lg">
                <Image
                  src="/images/plants/remedia-preview.png"
                  alt="REMÉDIA App - Identification du Moringa"
                  width={600}
                  height={800}
                  className="w-full h-auto drop-shadow-2xl"
                  priority
                />

                {/* Floating badges */}
                <div className="absolute -left-4 top-20 bg-white rounded-2xl shadow-xl p-4 animate-float hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Plante identifiée</p>
                      <p className="font-semibold text-gray-900">Moringa</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 bottom-32 bg-white rounded-2xl shadow-xl p-4 animate-float-delayed hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Award className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Précision</p>
                      <p className="font-semibold text-gray-900">98.5%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 sm:h-20 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Une plateforme complète pour la médecine traditionnelle
            </h2>
            <p className="text-lg text-gray-600">
              Trois outils puissants pour découvrir, identifier et apprendre les plantes médicinales africaines
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Scan */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Camera className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Scanner & Identifier
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Prenez une photo et identifiez instantanément n'importe quelle plante médicinale avec notre IA de pointe.
              </p>
              <Link
                href="/scan"
                className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 group-hover:gap-3 transition-all"
              >
                Essayer maintenant
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Feature 2: Chat */}
            <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <MessageCircle className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Assistant IA
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Posez vos questions à notre assistant médical spécialisé en phytothérapie africaine, disponible 24/7.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 group-hover:gap-3 transition-all"
              >
                Commencer à discuter
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Feature 3: Encyclopedia */}
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-purple-100 hover:border-purple-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Encyclopédie
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Explorez notre base de données complète de plantes avec images, propriétés et utilisations traditionnelles.
              </p>
              <Link
                href="/plants"
                className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 group-hover:gap-3 transition-all"
              >
                Découvrir
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Leaf className="h-8 w-8 opacity-80" />
              </div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">200+</div>
              <div className="text-green-100">Plantes référencées</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Users className="h-8 w-8 opacity-80" />
              </div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">10k+</div>
              <div className="text-green-100">Utilisateurs actifs</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="h-8 w-8 opacity-80" />
              </div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">95%</div>
              <div className="text-green-100">Taux de précision</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Award className="h-8 w-8 opacity-80" />
              </div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">4.8/5</div>
              <div className="text-green-100">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Prêt à découvrir la médecine traditionnelle ?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à REMÉDIA pour leurs besoins en phytothérapie
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scan"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Camera className="h-5 w-5" />
              Commencer gratuitement
            </Link>
            <Link
              href="/plants"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              <BookOpen className="h-5 w-5 text-green-600" />
              Explorer l'encyclopédie
            </Link>
          </div>
        </div>
      </section>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  )
}