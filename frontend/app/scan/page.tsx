'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  Camera, 
  Upload, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  X,
  Info,
  Leaf,
  Shield,
  Book,
  MapPin,
  ArrowRight
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { scanAPI, type PlantIdentification } from '@/lib/api'

export default function ScanPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<PlantIdentification | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const handleScan = async () => {
    if (!selectedImage) return

    setIsScanning(true)
    setError(null)

    try {
      const response = await scanAPI.identifyPlant(selectedImage)
      
      if (response.success) {
        setResult(response.data)
      } else {
        setError('Impossible d\'identifier cette plante. Essayez avec une autre image.')
      }
    } catch (err: any) {
      console.error('Scan error:', err)
      setError(
        err.response?.data?.message || 
        'Une erreur est survenue lors du scan. Veuillez réessayer.'
      )
    } finally {
      setIsScanning(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Camera className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Scanner une Plante
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Identifiez instantanément n'importe quelle plante médicinale africaine grâce à notre IA
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              {!previewUrl ? (
                // Dropzone
                <div
                  {...getRootProps()}
                  className={`
                    border-3 border-dashed rounded-xl p-12 text-center cursor-pointer
                    transition-all duration-200
                    ${isDragActive 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-green-400 hover:bg-green-50/50'
                    }
                  `}
                >
                  <input {...getInputProps()} />
                  
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                      <Upload className="h-10 w-10 text-green-600" />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {isDragActive 
                          ? 'Déposez l\'image ici' 
                          : 'Glissez une image ou cliquez'
                        }
                      </h3>
                      <p className="text-gray-600">
                        JPG, PNG ou WEBP (max. 10MB)
                      </p>
                    </div>

                    <button className="btn-primary">
                      <Camera className="h-5 w-5 mr-2" />
                      Choisir une photo
                    </button>
                  </div>
                </div>
              ) : (
                // Preview
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    
                    <button
                      onClick={handleReset}
                      className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {!result && !isScanning && (
                    <button
                      onClick={handleScan}
                      className="w-full btn-primary py-4 text-lg"
                    >
                      <Camera className="h-6 w-6 mr-2" />
                      Identifier cette plante
                    </button>
                  )}

                  {isScanning && (
                    <div className="flex items-center justify-center space-x-3 py-6">
                      <Loader2 className="h-6 w-6 text-green-600 animate-spin" />
                      <span className="text-lg text-gray-700 font-medium">
                        Analyse en cours...
                      </span>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-800 font-medium">Erreur</p>
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Conseils pour une meilleure identification
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Photographiez la plante en lumière naturelle</li>
                    <li>• Capturez les feuilles, fleurs ou fruits si possible</li>
                    <li>• Évitez les images floues ou trop sombres</li>
                    <li>• Prenez la photo à une distance de 20-50 cm</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            {result ? (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-6 w-6" />
                      <span className="font-semibold">Identification réussie</span>
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      {Math.round(result.confidence * 100)}% confiance
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold mt-4">
                    {result.plant_name}
                  </h2>
                  
                  <p className="text-green-100 mt-2">
                    Famille: {result.family}
                  </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <Leaf className="h-5 w-5 text-green-600 mr-2" />
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {result.description}
                    </p>
                  </div>

                  {/* Traditional Uses */}
                  {result.traditional_uses && result.traditional_uses.length > 0 && (
                    <div>
                      <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                        <Book className="h-5 w-5 text-green-600 mr-2" />
                        Usages Traditionnels
                      </h3>
                      <ul className="space-y-2">
                        {result.traditional_uses.map((use, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{use}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Medicinal Properties */}
                  {result.medicinal_properties && result.medicinal_properties.length > 0 && (
                    <div>
                      <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                        <Shield className="h-5 w-5 text-green-600 mr-2" />
                        Propriétés Médicinales
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.medicinal_properties.map((prop, idx) => (
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

                  {/* Preparation */}
                  {result.preparation && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h3 className="font-semibold text-amber-900 mb-2">
                        Préparation
                      </h3>
                      <p className="text-amber-800 text-sm leading-relaxed">
                        {result.preparation}
                      </p>
                    </div>
                  )}

                  {/* Warnings */}
                  {result.warnings && result.warnings.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-red-900 mb-2">
                            Précautions
                          </h3>
                          <ul className="text-sm text-red-800 space-y-1">
                            {result.warnings.map((warning, idx) => (
                              <li key={idx}>• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Found In */}
                  {result.found_in && result.found_in.length > 0 && (
                    <div>
                      <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                        <MapPin className="h-5 w-5 text-green-600 mr-2" />
                        Zones Géographiques
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.found_in.map((location, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {location}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Link
                      href="/chat"
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Poser une question
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                    
                    <button
                      onClick={handleReset}
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Scanner une autre plante
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Empty state
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <Camera className="h-10 w-10 text-gray-400" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucune plante identifiée
                </h3>
                
                <p className="text-gray-600">
                  Téléchargez une image pour commencer l'identification
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Banner */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">127+</div>
              <div className="text-green-100">Plantes répertoriées</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-green-100">Précision</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3,456+</div>
              <div className="text-green-100">Scans effectués</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
