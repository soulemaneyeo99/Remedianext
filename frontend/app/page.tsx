'use client'

import Link from 'next/link'
import { Leaf, Scan, MessageCircle, MapPin, TrendingUp, Users, Heart, ChevronRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-emerald-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-24 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Leaf className="h-5 w-5" />
                <span className="text-sm font-medium">Powered by Gemini AI</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                L'Intelligence
                <br />
                <span className="text-emerald-200">Verte</span> pour l'Afrique
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed max-w-xl">
                Identifiez instantanément les plantes médicinales africaines avec l'IA. 
                Préservons ensemble notre patrimoine naturel millénaire.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/scan" className="group inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                  <Scan className="mr-2 h-5 w-5" />
                  Scanner une plante
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link href="/chat" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Assistant médical IA
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm text-white/80">Plantes répertoriées</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">95%</div>
                  <div className="text-sm text-white/80">Précision IA</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">7</div>
                  <div className="text-sm text-white/80">Pays couverts</div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block animate-float">
              <div className="relative w-full aspect-square rounded-3xl bg-white/10 backdrop-blur-lg p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                <Leaf className="w-full h-full text-white/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Une plateforme <span className="gradient-text">révolutionnaire</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Technologie de pointe au service de la médecine traditionnelle africaine
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Scan className="h-8 w-8" />}
              title="Scan IA Instantané"
              description="Reconnaissance de plantes en 2 secondes avec Gemini Vision"
            />
            <FeatureCard
              icon={<MessageCircle className="h-8 w-8" />}
              title="Assistant Médical"
              description="Chatbot intelligent spécialisé en phytothérapie africaine"
            />
            <FeatureCard
              icon={<MapPin className="h-8 w-8" />}
              title="Géolocalisation"
              description="Carte interactive des plantes et tradipraticiens certifiés"
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Impact Mesurable"
              description="Statistiques en temps réel sur la biodiversité"
            />
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Un impact <span className="gradient-text">social</span> concret
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                REMEDIA connecte les communautés rurales aux savoirs ancestraux validés scientifiquement. 
                En 2024, nous avons déjà aidé plus de 5,000 personnes à accéder aux soins naturels.
              </p>

              <div className="space-y-4">
                <ImpactMetric icon={<Users />} label="Utilisateurs actifs" value="5,234" />
                <ImpactMetric icon={<Leaf />} label="Plantes identifiées" value="12,847" />
                <ImpactMetric icon={<Heart />} label="Consultations gratuites" value="3,456" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Témoignages</h3>
              <div className="space-y-6">
                <Testimonial
                  name="Dr. Aminata Touré"
                  role="Ethnobotaniste, Dakar"
                  text="REMEDIA préserve notre patrimoine médical tout en le rendant accessible à tous."
                />
                <Testimonial
                  name="Ibrahim Koné"
                  role="Tradipraticien, Bamako"
                  text="Grâce à cette app, je peux maintenant valider mes connaissances avec la science moderne."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à découvrir la puissance des plantes ?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Rejoignez des milliers d'africains qui utilisent REMEDIA pour se soigner naturellement
          </p>
          <Link href="/scan" className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-bold rounded-lg hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105">
            <Scan className="mr-2 h-5 w-5" />
            Commencer maintenant
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-emerald-600 rounded-lg flex items-center justify-center text-white mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function ImpactMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center space-x-4 bg-white rounded-lg p-4 shadow-md">
      <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-emerald-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  )
}

function Testimonial({ name, role, text }: { name: string; role: string; text: string }) {
  return (
    <div className="border-l-4 border-primary-600 pl-4">
      <p className="text-gray-700 italic mb-2">"{text}"</p>
      <div>
        <div className="font-semibold text-gray-900">{name}</div>
        <div className="text-sm text-gray-600">{role}</div>
      </div>
    </div>
  )
}
