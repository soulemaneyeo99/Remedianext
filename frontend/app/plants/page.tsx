'use client'

/**
 * 🌿 Plants Page - Encyclopédie Plantes Médicinales
 * 
 * Features:
 * - Grid responsive avec images réelles
 * - Filtres par catégorie/propriété
 * - Search bar
 * - Loading states
 * - SEO optimized
 * 
 * @version 2.0.0
 */

import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, Leaf, Loader2 } from 'lucide-react'
import PlantCard from '@/components/plants/PlantCard'
import { getPlantImagePath } from '@/lib/plant-images'

interface Plant {
  id: string
  name: string
  scientificName: string
  description: string
  properties: string[]
  uses: string[]
}

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<string>('all')

  // Charger plantes depuis API
  useEffect(() => {
    loadPlants()
  }, [])

  const loadPlants = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/plants/list`)
      const data = await response.json()
      
      if (data.success && data.plants) {
        setPlants(data.plants)
      }
    } catch (error) {
      console.error('Failed to load plants:', error)
      // Fallback: plantes par défaut
      setPlants(DEFAULT_PLANTS)
    } finally {
      setLoading(false)
    }
  }

  // Filtrage et recherche
  const filteredPlants = useMemo(() => {
    let filtered = plants

    // Filtre par catégorie
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(plant => 
        plant.properties?.some(prop => 
          prop.toLowerCase().includes(selectedFilter.toLowerCase())
        )
      )
    }

    // Recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(plant =>
        plant.name.toLowerCase().includes(query) ||
        plant.scientificName.toLowerCase().includes(query) ||
        plant.description.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [plants, searchQuery, selectedFilter])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              🌿 Encyclopédie des Plantes Médicinales
            </h1>
            <p className="text-lg sm:text-xl text-green-100 leading-relaxed">
              Découvrez notre collection de plantes médicinales africaines avec images, 
              propriétés et utilisations traditionnelles validées scientifiquement.
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une plante..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative sm:w-64">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white cursor-pointer"
              >
                <option value="all">Toutes les propriétés</option>
                <option value="antibactérien">Antibactérien</option>
                <option value="antiviral">Antiviral</option>
                <option value="anti-inflammatoire">Anti-inflammatoire</option>
                <option value="antioxydant">Antioxydant</option>
                <option value="digestif">Digestif</option>
                <option value="immunité">Immunité</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Chargement...
              </span>
            ) : (
              <span>
                {filteredPlants.length} plante{filteredPlants.length > 1 ? 's' : ''} trouvée{filteredPlants.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Plants Grid */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {loading ? (
          /* Loading skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200 animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPlants.length > 0 ? (
          /* Plants Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlants.map((plant) => (
              <PlantCard
                key={plant.id}
                id={plant.id}
                name={plant.name}
                scientificName={plant.scientificName}
                description={plant.description}
                image={getPlantImagePath(plant.scientificName, plant.name)}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Leaf className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune plante trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos filtres ou votre recherche
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedFilter('all')
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Plantes par défaut (fallback)
const DEFAULT_PLANTS: Plant[] = [
  {
    id: 'aloe-vera',
    name: 'Aloe Vera',
    scientificName: 'Aloe vera',
    description: 'Plante succulente aux propriétés cicatrisantes et hydratantes exceptionnelles.',
    properties: ['cicatrisant', 'hydratant', 'anti-inflammatoire'],
    uses: ['Brûlures', 'Peau sèche', 'Constipation']
  },
  {
    id: 'artemisia',
    name: 'Armoise',
    scientificName: 'Artemisia annua',
    description: 'Plante médicinale efficace contre le paludisme, contient de l\'artémisinine.',
    properties: ['antipaludique', 'antibactérien', 'antiviral'],
    uses: ['Paludisme', 'Fièvres', 'Infections']
  },
  {
    id: 'neem',
    name: 'Neem',
    scientificName: 'Azadirachta indica',
    description: 'Arbre aux multiples vertus médicinales, antibactérien puissant.',
    properties: ['antibactérien', 'antifongique', 'antiparasitaire'],
    uses: ['Peau', 'Dents', 'Parasites']
  },
  {
    id: 'moringa',
    name: 'Moringa',
    scientificName: 'Moringa oleifera',
    description: 'Super-aliment riche en nutriments, vitamines et minéraux.',
    properties: ['nutritif', 'antioxydant', 'anti-inflammatoire'],
    uses: ['Malnutrition', 'Fatigue', 'Immunité']
  },
  {
    id: 'gingembre',
    name: 'Gingembre',
    scientificName: 'Zingiber officinale',
    description: 'Rhizome aux propriétés digestives et anti-inflammatoires reconnues.',
    properties: ['digestif', 'anti-inflammatoire', 'antioxydant'],
    uses: ['Nausées', 'Digestion', 'Douleurs']
  }
]