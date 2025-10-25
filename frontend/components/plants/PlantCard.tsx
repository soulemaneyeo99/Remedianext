'use client'

/**
 * 🌿 PlantCard Component - Design Professionnel
 * 
 * Features:
 * - Images réelles optimisées
 * - Fallback gracieux si image manquante
 * - Lazy loading pour performance
 * - Hover effects premium
 * - Responsive mobile-first
 * 
 * @version 2.0.0
 */

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Leaf, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlantCardProps {
  id: string
  name: string
  scientificName: string
  description: string
  image?: string
  className?: string
}

export default function PlantCard({
  id,
  name,
  scientificName,
  description,
  image,
  className
}: PlantCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Construire path image depuis nom scientifique
  const getImagePath = () => {
    if (image) return image
    
    // Mapping nom scientifique → filename
    const imageMap: Record<string, string> = {
      'Aloe vera': 'aloe.jpg',
      'Artemisia annua': 'annua.jpg',
      'Azadirachta indica': 'Azadirachtaindica.jpg',
      'Moringa oleifera': 'moringa.jpg',
      'Zingiber officinale': 'Zingiberofficinale.jpg',
      // Ajouter autres mappings
    }

    const filename = imageMap[scientificName]
    return filename ? `/images/plants/${filename}` : null
  }

  const imagePath = getImagePath()

  return (
    <Link
      href={`/plants/${id}`}
      className={cn(
        'group block bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-green-500 transition-all duration-300 hover:shadow-xl',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
        {imagePath && !imageError ? (
          <>
            {/* Loading skeleton */}
            {imageLoading && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-green-100 to-emerald-100" />
            )}
            
            {/* Image */}
            <Image
              src={imagePath}
              alt={name}
              fill
              className={cn(
                'object-cover transition-all duration-500',
                'group-hover:scale-110',
                imageLoading ? 'opacity-0' : 'opacity-100'
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true)
                setImageLoading(false)
              }}
              priority={false}
            />
          </>
        ) : (
          /* Fallback si image manquante */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Leaf className="h-10 w-10 text-green-600" />
              </div>
              <p className="text-sm text-gray-600 font-medium">{name}</p>
            </div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge catégorie (optionnel) */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-green-700 shadow-lg">
          Plante médicinale
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Nom commun */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors line-clamp-1">
          {name}
        </h3>

        {/* Nom scientifique */}
        <p className="text-sm italic text-gray-600 mb-3">
          {scientificName}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* CTA */}
        <div className="mt-4 flex items-center text-green-600 font-medium text-sm group-hover:text-green-700">
          <span>En savoir plus</span>
          <svg 
            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}