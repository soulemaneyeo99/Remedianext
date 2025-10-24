'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Loader2, CheckCircle2, AlertCircle, Camera, X } from 'lucide-react'
import { scanAPI, type PlantIdentification } from '@/lib/api'
import Image from 'next/image'

export default function ScanPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PlantIdentification | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
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
    multiple: false
  })

  const handleScan = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)

    try {
      const response = await scanAPI.identifyPlant(selectedFile)
      
      if (response.success && response.data) {
        // Parser la réponse JSON si c'est une string
        let plantData = response.data
        if (typeof response.data === 'string') {
          plantData = JSON.parse(response.data)
        }
        setResult(plantData as PlantIdentification)
      } else {
        setError('Impossible d\'identifier la plante. Veuillez réessayer.')
      }
    } catch (err: any) {
      console.error('Erreur scan:', err)
      setError(err.response?.data?.detail || 'Erreur lors du scan. Vérifiez que le backend est en ligne.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full mb-4">
            <Camera className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">Scan IA - Powered by Gemini</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Identifiez vos <span className="gradient-text">plantes médicinales</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Uploadez une photo et laissez notre IA identifier la plante en quelques secondes
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              {!preview ? (
                <div
                  {...getRootProps()}
                  className={`border-3 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {isDragActive ? 'Déposez l\'image ici' : 'Uploadez une photo'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Glissez-déposez ou cliquez pour sélectionner
                  </p>
                  <p className="text-sm text-gray-500">
                    JPG, PNG ou WebP - Max 10MB
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={preview}
                      alt="Aperçu"
                      className="w-full h-96 object-cover"
                    />
                    <button
                      onClick={handleReset}
                      className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>

                  {!result && !loading && (
                    <button
                      onClick={handleScan}
                      className="w-full btn-primary py-4 text-lg"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Scanner maintenant
                    </button>
                  )}
                </div>
              )}

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 text-primary-600 animate-spin mr-3" />
                  <span className="text-lg text-gray-700">Analyse en cours...</span>
                </div>
              )}

              {error && (
                <div className="flex items-start space-x-3 bg-red-50 border border-red-200 rounded-lg p-4">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Erreur</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">💡 Conseils pour de meilleurs résultats</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
                  Photographiez la plante en pleine lumière naturelle
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
                  Capturez les feuilles, fleurs ou fruits si possible
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
                  Évitez les photos floues ou trop sombres
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
                  Utilisez un fond uni si possible
                </li>
              </ul>
            </div>
          </div>

          {/* Results Section */}
          <div>
            {result && (
              <div className="bg-white rounded-2xl p-8 shadow-xl space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Résultats</h2>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      (result.confidence || 0) > 0.7 ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      Confiance: {((result.confidence || 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Nom de la plante */}
                <div>
                  <h3 className="text-3xl font-bold text-primary-600 mb-2">
                    {result.plant_name}
                  </h3>
                  <p className="text-gray-600">Famille: {result.family}</p>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">📖 Description</h4>
                  <p className="text-gray-700">{result.description}</p>
                </div>

                {/* Usages traditionnels */}
                {result.traditional_uses && result.traditional_uses.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🌿 Usages traditionnels</h4>
                    <ul className="space-y-1">
                      {result.traditional_uses.map((use, idx) => (
                        <li key={idx} className="text-gray-700 flex items-start">
                          <span className="text-primary-600 mr-2">•</span>
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Propriétés médicinales */}
                {result.medicinal_properties && result.medicinal_properties.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">💊 Propriétés médicinales</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.medicinal_properties.map((prop, idx) => (
                        <span key={idx} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                          {prop}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Préparation */}
                {result.preparation && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🧪 Mode de préparation</h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{result.preparation}</p>
                  </div>
                )}

                {/* Avertissements */}
                {result.warnings && result.warnings.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 mb-2 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      ⚠️ Précautions
                    </h4>
                    <ul className="space-y-1">
                      {result.warnings.map((warning, idx) => (
                        <li key={idx} className="text-amber-800 text-sm flex items-start">
                          <span className="mr-2">•</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Répartition géographique */}
                {result.found_in && result.found_in.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🗺️ Où la trouver</h4>
                    <p className="text-gray-700">{result.found_in.join(', ')}</p>
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="flex gap-3 pt-4 border-t">
                  <button onClick={handleReset} className="flex-1 btn-secondary">
                    Nouvelle analyse
                  </button>
                  <button className="flex-1 btn-primary">
                    Enregistrer
                  </button>
                </div>
              </div>
            )}

            {!result && !loading && !error && (
              <div className="bg-white rounded-2xl p-12 shadow-xl text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucune analyse en cours
                </h3>
                <p className="text-gray-600">
                  Uploadez une image pour commencer l'identification
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
