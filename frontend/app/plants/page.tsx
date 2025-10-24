'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  Filter,
  Leaf,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { plantsAPI, type Plant } from '@/lib/api'

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFamily, setSelectedFamily] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPlants()
  }, [])

  useEffect(() => {
    filterPlants()
  }, [searchQuery, selectedFamily, plants])

  const loadPlants = async () => {
    try {
      setIsLoading(true)
      const response = await plantsAPI.getAll(100, 0)
      
      if (response.success) {
        setPlants(response.data)
        setFilteredPlants(response.data)
      }
    } catch (err: any) {
      console.error('Error loading plants:', err)
      setError('Impossible de charger les plantes')
    } finally {
      setIsLoading(false)
    }
  }

  const filterPlants = () => {
    let filtered = plants

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(plant =>
        plant.scientific_name.toLowerCase().includes(query) ||
        plant.common_names.some(name => name.toLowerCase().includes(query)) ||
        plant.description.toLowerCase().includes(query)
      )
    }

    // Family filter
    if (selectedFamily !== 'all') {
      filtered = filtered.filter(plant => plant.family === selectedFamily)
    }

    setFilteredPlants(filtered)
  }

  const families = ['all', ...Array.from(new Set(plants.map(p => p.family)))]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de l'encyclopédie...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-800 font-semibold mb-2">Erreur de chargement</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadPlants}
            className="btn-primary"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Encyclopédie des Plantes
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez {plants.length}+ plantes médicinales africaines avec leurs propriétés et usages traditionnels
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une plante..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Family Filter */}
            <div className="relative md:w-64">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {families.map((family) => (
                  <option key={family} value={family}>
                    {family === 'all' ? 'Toutes les familles' : family}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredPlants.length} plante{filteredPlants.length > 1 ? 's' : ''} trouvée{filteredPlants.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Plants Grid */}
        {filteredPlants.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune plante trouvée
            </h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos critères de recherche
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedFamily('all')
              }}
              className="btn-secondary"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Stats Banner */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{plants.length}+</div>
              <div className="text-green-100">Plantes répertoriées</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{families.length - 1}</div>
              <div className="text-green-100">Familles botaniques</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">7</div>
              <div className="text-green-100">Pays couverts</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-green-100">Validées scientifiquement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlantCard({ plant }: { plant: Plant }) {
  return (
    <Link href={`/plants/${plant.id}`}>
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden">
          {plant.image_url ? (
            <Image
              src={plant.image_url}
              alt={plant.scientific_name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf className="h-20 w-20 text-green-300" />
            </div>
          )}
          
          {/* Family badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
            {plant.family}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
            {plant.scientific_name}
          </h3>

          {plant.common_names && plant.common_names.length > 0 && (
            <p className="text-sm text-gray-600 mb-3">
              {plant.common_names.slice(0, 2).join(', ')}
            </p>
          )}

          <p className="text-sm text-gray-700 mb-4 line-clamp-3">
            {plant.description}
          </p>

          {/* Properties tags */}
          {plant.medicinal_properties && plant.medicinal_properties.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {plant.medicinal_properties.slice(0, 3).map((prop, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                >
                  {prop}
                </span>
              ))}
              {plant.medicinal_properties.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  +{plant.medicinal_properties.length - 3}
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-green-600 font-semibold group-hover:text-green-700">
              En savoir plus
            </span>
            <ChevronRight className="h-5 w-5 text-green-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}
