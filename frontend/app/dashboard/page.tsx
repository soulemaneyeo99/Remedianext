'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Users,
  Leaf,
  Scan,
  DollarSign,
  Award,
  MapPin,
  Heart,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react'

// Types stricts pour éviter les erreurs TypeScript
type ColorType = 'blue' | 'green' | 'emerald' | 'yellow'
type ImpactColorType = 'green' | 'blue' | 'purple'

interface MetricCardProps {
  icon: React.ElementType
  title: string
  value: string
  change: number
  isPositive: boolean
  color: ColorType
}

interface ImpactCardProps {
  icon: React.ElementType
  title: string
  value: string
  description: string
  color: ImpactColorType
}

export default function DashboardPage() {
  const [metrics] = useState({
    totalScans: 3456,
    activeUsers: 1289,
    plantsIdentified: 127,
    communities: 7,
    moneySaved: 3250000,
    co2Reduced: 847,
    tradipractioners: 89,
    satisfactionRate: 96
  })

  const [growth] = useState({
    scans: 23.5,
    users: 15.2,
    plants: 8.7,
    satisfaction: 2.3
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Activity className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Dashboard Impact
              </h1>
              <p className="text-gray-600 mt-1">
                Métriques en temps réel • Mis à jour il y a 2 minutes
              </p>
            </div>
          </div>

          {/* Alert Banner */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-start space-x-4">
              <Sparkles className="h-6 w-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  🎉 Nouveau record battu !
                </h3>
                <p className="text-green-100">
                  REMÉDIA a franchi la barre des 3,000 scans cette semaine avec une précision de 98%. 
                  Merci à notre communauté grandissante !
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={Scan}
            title="Scans Effectués"
            value={metrics.totalScans.toLocaleString()}
            change={growth.scans}
            isPositive={true}
            color="blue"
          />

          <MetricCard
            icon={Users}
            title="Utilisateurs Actifs"
            value={metrics.activeUsers.toLocaleString()}
            change={growth.users}
            isPositive={true}
            color="green"
          />

          <MetricCard
            icon={Leaf}
            title="Plantes Répertoriées"
            value={metrics.plantsIdentified.toString()}
            change={growth.plants}
            isPositive={true}
            color="emerald"
          />

          <MetricCard
            icon={Award}
            title="Taux de Satisfaction"
            value={`${metrics.satisfactionRate}%`}
            change={growth.satisfaction}
            isPositive={true}
            color="yellow"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <ImpactCard
            icon={DollarSign}
            title="Économies Générées"
            value={`${(metrics.moneySaved / 1000000).toFixed(2)}M FCFA`}
            description="Coût évité vs médecine conventionnelle"
            color="green"
          />

          <ImpactCard
            icon={Heart}
            title="CO₂ Évité"
            value={`${metrics.co2Reduced} kg`}
            description="Impact écologique positif"
            color="blue"
          />

          <ImpactCard
            icon={MapPin}
            title="Tradipraticiens Certifiés"
            value={metrics.tradipractioners.toString()}
            description="Réseau de partenaires qualifiés"
            color="purple"
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Tendances d'Utilisation (7 derniers jours)
            </h3>
            <UsageChart />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Plantes Les Plus Recherchées
            </h3>
            <TopPlantsList />
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Distribution Géographique
          </h3>
          <GeographicStats />
        </div>

        {/* Impact Stories */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">
            Témoignages d'Impact
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Grâce à REMÉDIA, j'ai pu identifier la plante qui a soulagé les maux de ventre de ma fille."
              author="Aminata K."
              location="Abidjan, Côte d'Ivoire"
            />
            <TestimonialCard
              quote="En tant que tradipraticien, cette plateforme m'a aidé à moderniser ma pratique tout en préservant nos traditions."
              author="Dr. Kouassi"
              location="Bouaké, Côte d'Ivoire"
            />
            <TestimonialCard
              quote="L'application m'a sauvé 15,000 FCFA en consultations inutiles. Merci REMÉDIA !"
              author="Marie T."
              location="Dakar, Sénégal"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Components
function MetricCard({ icon: Icon, title, value, change, isPositive, color }: MetricCardProps) {
  const colorClasses: Record<ColorType, string> = {
    blue: 'from-blue-500 to-cyan-600',
    green: 'from-green-500 to-emerald-600',
    emerald: 'from-emerald-500 to-teal-600',
    yellow: 'from-yellow-500 to-orange-500'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        
        <div className={`flex items-center space-x-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          <span>{change}%</span>
        </div>
      </div>

      <div className="text-3xl font-bold text-gray-900 mb-1">
        {value}
      </div>

      <div className="text-sm text-gray-600">
        {title}
      </div>
    </div>
  )
}

function ImpactCard({ icon: Icon, title, value, description, color }: ImpactCardProps) {
  const colorClasses: Record<ImpactColorType, string> = {
    green: 'text-green-600 bg-green-100',
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${colorClasses[color]}`}>
        <Icon className="h-6 w-6" />
      </div>

      <div className="text-2xl font-bold text-gray-900 mb-1">
        {value}
      </div>

      <div className="text-sm font-semibold text-gray-700 mb-1">
        {title}
      </div>

      <div className="text-xs text-gray-500">
        {description}
      </div>
    </div>
  )
}

function UsageChart() {
  const data = [
    { day: 'Lun', scans: 420 },
    { day: 'Mar', scans: 385 },
    { day: 'Mer', scans: 510 },
    { day: 'Jeu', scans: 467 },
    { day: 'Ven', scans: 592 },
    { day: 'Sam', scans: 678 },
    { day: 'Dim', scans: 404 }
  ]

  const maxValue = Math.max(...data.map(d => d.scans))

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="w-12 text-sm font-medium text-gray-600">
            {item.day}
          </div>

          <div className="flex-1 relative">
            <div className="w-full h-8 bg-gray-100 rounded-lg overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg transition-all duration-500"
                style={{ width: `${(item.scans / maxValue) * 100}%` }}
              />
            </div>
          </div>

          <div className="w-16 text-sm font-semibold text-gray-900 text-right">
            {item.scans}
          </div>
        </div>
      ))}
    </div>
  )
}

function TopPlantsList() {
  const plants = [
    { name: 'Artemisia annua', scans: 234, color: 'bg-green-500' },
    { name: 'Moringa oleifera', scans: 198, color: 'bg-emerald-500' },
    { name: 'Aloe vera', scans: 176, color: 'bg-teal-500' },
    { name: 'Neem (Azadirachta)', scans: 145, color: 'bg-cyan-500' },
    { name: 'Gingembre', scans: 123, color: 'bg-blue-500' }
  ]

  const maxScans = plants[0].scans

  return (
    <div className="space-y-4">
      {plants.map((plant, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">{plant.name}</span>
            <span className="text-gray-600">{plant.scans} scans</span>
          </div>
          
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${plant.color} rounded-full transition-all duration-500`}
              style={{ width: `${(plant.scans / maxScans) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function GeographicStats() {
  const countries = [
    { name: 'Côte d\'Ivoire', users: 487, percentage: 38 },
    { name: 'Sénégal', users: 312, percentage: 24 },
    { name: 'Mali', users: 198, percentage: 15 },
    { name: 'Guinée', users: 154, percentage: 12 },
    { name: 'Togo', users: 89, percentage: 7 },
    { name: 'Bénin', users: 49, percentage: 4 }
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {countries.map((country, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0">
            <MapPin className="h-8 w-8 text-green-600" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-900">{country.name}</span>
              <span className="text-sm text-gray-600">{country.percentage}%</span>
            </div>
            
            <div className="text-sm text-gray-600">{country.users} utilisateurs</div>
            
            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-green-600 rounded-full"
                style={{ width: `${country.percentage}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TestimonialCard({ quote, author, location }: { quote: string; author: string; location: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="text-4xl text-green-300 mb-3">"</div>
      <p className="text-green-50 leading-relaxed mb-4">
        {quote}
      </p>
      <div className="border-t border-white/20 pt-4">
        <div className="font-semibold text-white">{author}</div>
        <div className="text-sm text-green-200">{location}</div>
      </div>
    </div>
  )
}