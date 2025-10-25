// lib/plant-images.ts

/**
 * Mapping nom scientifique → filename image
 */
export const PLANT_IMAGES: Record<string, string> = {
  // Aloe
  'Aloe vera': 'aloe.jpg',
  'Aloe barbadensis': 'aloe.jpg',
  
  // Artemisia (Armoise)
  'Artemisia annua': 'annua.jpg',
  'Artemisia': 'annua.jpg',
  
  // Neem
  'Azadirachta indica': 'Azadirachtaindica.jpg',
  'Neem': 'Azadirachtaindica.jpg',
  
  // Moringa
  'Moringa oleifera': 'moringa.jpg',
  'Moringa': 'moringa.jpg',
  
  // Gingembre
  'Zingiber officinale': 'Zingiberofficinale.jpg',
  'Gingembre': 'Zingiberofficinale.jpg',
  'Zingiber': 'Zingiberofficinale.jpg',
}

/**
 * Obtenir path image pour une plante
 */
export function getPlantImagePath(
  scientificName: string,
  commonName?: string
): string | null {
  // Essayer nom scientifique
  let filename = PLANT_IMAGES[scientificName]
  
  // Essayer nom commun si échec
  if (!filename && commonName) {
    filename = PLANT_IMAGES[commonName]
  }
  
  // Essayer match partiel (ex: "Artemisia annua L." → "Artemisia")
  if (!filename) {
    const firstWord = scientificName.split(' ')[0]
    filename = PLANT_IMAGES[firstWord]
  }
  
  return filename ? `/images/plants/${filename}` : null
}

/**
 * Obtenir URL complète (pour SEO, partage social)
 */
export function getPlantImageUrl(
  scientificName: string,
  commonName?: string
): string {
  const path = getPlantImagePath(scientificName, commonName)
  if (!path) return `${process.env.NEXT_PUBLIC_SITE_URL}/images/plants/placeholder.jpg`
  
  return `${process.env.NEXT_PUBLIC_SITE_URL}${path}`
}