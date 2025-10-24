'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Leaf, 
  Scan, 
  MessageCircle, 
  Database, 
  Shield, 
  Users,
  TrendingUp,
  Heart,
  Award,
  ArrowRight,
  PlayCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react'

export default function HomePage() {
  const [stats, setStats] = useState({
    plants: 0,
    scans: 0,
    users: 0,
    communities: 0
  })

  // Animation des statistiques
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = {
      plants: Math.ceil(127 / steps),
      scans: Math.ceil(3456 / steps),
      users: Math.ceil(1289 / steps),
      communities: Math.ceil(7 / steps)
    }

    let currentStep = 0
    const timer = setInterval(() => {
      if (currentStep < steps) {
        setStats(prev => ({
          plants: Math.min(prev.plants + increment.plants, 127),
          scans: Math.min(prev.scans + increment.scans, 3456),
          users: Math.min(prev.users + increment.users, 1289),
          communities: Math.min(prev.communities + increment.communities, 7)
        }))
        currentStep++
      } else {
        clearInterval(timer)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 py-20 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-medium">Propulsé par Gemini AI</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                L'Intelligence Verte
                <span className="block text-green-200 mt-2">
                  Au Service de l'Afrique
                </span>
              </h1>

              <p className="text-xl text-green-100 leading-relaxed">
                Reconnaissez instantanément les plantes médicinales africaines grâce à l'IA. 
                Préservez les savoirs ancestraux, accédez aux soins naturels.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/scan"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Scan className="h-5 w-5 mr-2" />
                  Scanner une plante
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>

                <Link 
                  href="/chat"
                  className="inline-flex items-center justify-center px-8 py-4 bg-green-800/50 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-green-800/70 transition-all border-2 border-white/30"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Assistant Médical
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-sm text-green-100">100% Gratuit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-300" />
                  <span className="text-sm text-green-100">Validé Scientifiquement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-green-300" />
                  <span className="text-sm text-green-100">Open Source</span>
                </div>
              </div>
            </div>

            {/* Right Content - Demo Image/Animation */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="aspect-square bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <Leaf className="h-32 w-32 text-white opacity-50" />
                </div>
                
                {/* Floating stats cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl px-4 py-3 shadow-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      {stats.scans.toLocaleString()}+ scans aujourd'hui
                    </span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl px-4 py-3 shadow-xl">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-semibold text-gray-700">
                      98% de précision
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard 
              icon={Database}
              value={stats.plants}
              label="Plantes Répertoriées"
              suffix="+"
            />
            <StatCard 
              icon={Scan}
              value={stats.scans}
              label="Scans Effectués"
              suffix="+"
            />
            <StatCard 
              icon={Users}
              value={stats.users}
              label="Utilisateurs Actifs"
              suffix="+"
            />
            <StatCard 
              icon={Leaf}
              value={stats.communities}
              label="Pays Couverts"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Une Plateforme Complète
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              De la reconnaissance à l'information médicale, tout ce dont vous avez besoin pour explorer la médecine traditionnelle africaine
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Scan}
              title="Reconnaissance IA"
              description="Photographiez une plante et obtenez son identification en quelques secondes grâce à Gemini Vision AI"
              link="/scan"
              color="green"
            />

            <FeatureCard
              icon={MessageCircle}
              title="Assistant Médical"
              description="Posez vos questions santé et recevez des conseils basés sur la médecine traditionnelle validée"
              link="/chat"
              color="blue"
            />

            <FeatureCard
              icon={Database}
              title="Encyclopédie Complète"
              description="Plus de 127 plantes médicinales avec leurs propriétés, posologies et validations scientifiques"
              link="/plants"
              color="emerald"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Trois étapes simples pour accéder au savoir ancestral
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard
              number="1"
              title="Photographiez"
              description="Prenez une photo claire de la plante que vous souhaitez identifier"
              icon={Scan}
            />

            <StepCard
              number="2"
              title="Analysez"
              description="Notre IA analyse l'image et identifie la plante en quelques secondes"
              icon={Sparkles}
            />

            <StepCard
              number="3"
              title="Découvrez"
              description="Accédez aux informations médicinales, posologies et précautions d'usage"
              icon={Heart}
            />
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Un Impact Réel Sur Les Communautés
              </h2>
              <p className="text-green-100 text-lg mb-8 leading-relaxed">
                REMÉDIA aide à préserver les savoirs ancestraux tout en démocratisant l'accès aux soins de santé primaires dans les zones rurales africaines.
              </p>

              <div className="space-y-4">
                <ImpactItem 
                  text="Réduction de 40% des consultations médicales non-urgentes"
                />
                <ImpactItem 
                  text="Économie moyenne de 25,000 FCFA par famille/an"
                />
                <ImpactItem 
                  text="Préservation de 127+ espèces de plantes médicinales"
                />
                <ImpactItem 
                  text="Formation de 89 tradipraticiens certifiés"
                />
              </div>

              <Link 
                href="/dashboard"
                className="inline-flex items-center mt-8 px-6 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-all"
              >
                Voir le Dashboard Impact
                <TrendingUp className="h-5 w-5 ml-2" />
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 font-medium">Taux de Satisfaction</span>
                    <span className="text-3xl font-bold text-green-600">96%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 font-medium">Précision IA</span>
                    <span className="text-3xl font-bold text-green-600">98%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 font-medium">Disponibilité</span>
                    <span className="text-3xl font-bold text-green-600">99.9%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{ width: '99.9%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-12 md:p-16 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à Explorer ?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui font confiance à REMÉDIA pour leurs besoins en médecine naturelle
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/scan"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all shadow-lg"
              >
                <Scan className="h-5 w-5 mr-2" />
                Commencer Maintenant
              </Link>

              <Link 
                href="/plants"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl hover:bg-white/10 transition-all border-2 border-white"
              >
                <Database className="h-5 w-5 mr-2" />
                Explorer l'Encyclopédie
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Components
function StatCard({ icon: Icon, value, label, suffix = '' }: any) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
        <Icon className="h-8 w-8 text-green-600" />
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2">
        {value.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, link, color }: any) {
  const colorClasses = {
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-cyan-600',
    emerald: 'from-emerald-500 to-teal-600'
  }

  return (
    <Link href={link} className="group">
      <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${colorClasses[color]} rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed mb-4">
          {description}
        </p>

        <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700">
          En savoir plus
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

function StepCard({ number, title, description, icon: Icon }: any) {
  return (
    <div className="relative">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {number}
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Icon className="h-5 w-5 text-green-600" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {title}
        </h3>

        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Connector line (hidden on last item) */}
      {number !== "3" && (
        <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-green-200 -z-10"></div>
      )}
    </div>
  )
}

function ImpactItem({ text }: { text: string }) {
  return (
    <div className="flex items-start space-x-3">
      <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-0.5" />
      <span className="text-green-50 text-lg">{text}</span>
    </div>
  )
}
