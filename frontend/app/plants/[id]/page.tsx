'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Leaf,
  Book,
  Shield,
  AlertTriangle,
  MapPin,
  Heart,
  Share2,
  Bookmark,
  CheckCircle,
  Info,
  MessageCircle,
  Loader2
} from 'lucide-react'
import { plantsAPI, type Plant } from '@/lib/api'

export default function PlantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const plantId = params.id as string

  const [plant, setPlant] = useState<Plant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (plantId) {
      loadPlant()
    }
  }, [plantId])

  const loadPlant = async () => {
    try {
      setIsLoading(true)
      const response = await plantsAPI.getById(plantId)
      
      if (response.success) {
        setPlant(response.data)
      }
    } catch (err: any) {
      console.error('Error loading plant:', err)
      setError('Impossible de charger les détails de cette plante')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share && plant) {
      try {
        await navigator.share({
          title: plant.scientific_name,
          text: plant.description,
          url: window.location.href
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Lien copié dans le presse-papier !')
    }
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    // TODO: Implement actual save functionality
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error || !plant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Plante non trouvée</h2>
          <p className="text-gray-600 mb-6">
            {error || 'Cette plante n\'existe pas dans notre base de données.'}
          </p>
          <Link href="/plants" className="btn-primary">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour à l'encyclopédie
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 py-12 relative z-10">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 text-green-100 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              {plant.image_url ? (
                <Image
                  src={plant.image_url}
                  alt={plant.scientific_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf className="h-32 w-32 text-white opacity-30" />
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Leaf className="h-4 w-4" />
                <span className="text-sm font-medium">{plant.family}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {plant.scientific_name}
              </h1>

              {plant.common_names && plant.common_names.length > 0 && (
                <div className="mb-6">
                  <p className="text-green-100 text-lg">
                    Noms communs: {plant.common_names.join(', ')}
                  </p>
                </div>
              )}

              {plant.local_names && Object.keys(plant.local_names).length > 0 && (
                <div className="mb-6 space-y-2">
                  <p className="text-green-100 font-medium">Noms locaux:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(plant.local_names).map(([lang, name]) => (
                      <span
                        key={lang}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                      >
                        {lang}: {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Partager
                </button>

                <button
                  onClick={handleSave}
                  className={`inline-flex items-center px-6 py-3 rounded-xl transition-all ${
                    isSaved
                      ? 'bg-white text-green-700'
                      : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
                  }`}
                >
                  <Bookmark className={`h-5 w-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Enregistré' : 'Enregistrer'}
                </button>

                <Link
                  href="/chat"
                  className="inline-flex items-center px-6 py-3 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Poser une question
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
                <Book className="h-6 w-6 text-green-600 mr-3" />
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {plant.description}
              </p>
            </section>

            {/* Traditional Uses */}
            {plant.traditional_uses && plant.traditional_uses.length > 0 && (
              <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
                  <Heart className="h-6 w-6 text-green-600 mr-3" />
                  Usages Traditionnels
                </h2>
                <ul className="space-y-3">
                  {plant.traditional_uses.map((use, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{use}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Preparation & Dosage */}
            <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
                <Shield className="h-6 w-6 text-green-600 mr-3" />
                Préparation et Posologie
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Préparation</h3>
                  <p className="text-gray-700">{plant.preparation}</p>
                </div>

                {plant.dosage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Posologie</h3>
                    <p className="text-green-800">{plant.dosage}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Warnings */}
            {plant.warnings && plant.warnings.length > 0 && (
              <section className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <h2 className="flex items-center text-2xl font-bold text-red-900 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                  Précautions et Contre-indications
                </h2>
                <ul className="space-y-3">
                  {plant.warnings.map((warning, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-red-800">{warning}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Scientific Validation */}
            {plant.scientific_validation && (
              <section className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
                <h2 className="flex items-center text-2xl font-bold text-blue-900 mb-4">
                  <Info className="h-6 w-6 text-blue-600 mr-3" />
                  Validation Scientifique
                </h2>
                <p className="text-blue-800 leading-relaxed">
                  {plant.scientific_validation}
                </p>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Properties */}
            {plant.medicinal_properties && plant.medicinal_properties.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">
                  Propriétés Médicinales
                </h3>
                <div className="flex flex-wrap gap-2">
                  {plant.medicinal_properties.map((prop, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                    >
                      {prop}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Geographic Distribution */}
            {plant.found_in && plant.found_in.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="flex items-center font-bold text-gray-900 mb-4">
                  <MapPin className="h-5 w-5 text-green-600 mr-2" />
                  Distribution Géographique
                </h3>
                <div className="space-y-2">
                  {plant.found_in.map((location, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{location}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Facts */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-4">Faits Rapides</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-green-100 mb-1">Famille</div>
                  <div className="font-semibold">{plant.family}</div>
                </div>
                {plant.common_names && plant.common_names.length > 0 && (
                  <div>
                    <div className="text-green-100 mb-1">Noms communs</div>
                    <div className="font-semibold">{plant.common_names.length}</div>
                  </div>
                )}
                {plant.traditional_uses && (
                  <div>
                    <div className="text-green-100 mb-1">Usages traditionnels</div>
                    <div className="font-semibold">{plant.traditional_uses.length}</div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Besoin de plus d'informations sur cette plante ?
              </p>
              <Link href="/chat" className="btn-primary w-full justify-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Consulter l'Assistant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
