// lib/plant-images.ts

/**
 * 🌿 Configuration Images Plantes
 * 
 * Mapping nom scientifique → filename image
 * Logique de fallback intelligente
 * 
 * @version 2.1.0 - TypeScript compatible
 */

/**
 * Mapping nom scientifique/commun → filename image
 */
export const PLANT_IMAGES: Record<string, string> = {
  // Aloe
  'Aloe vera': 'aloe.jpg',
  'Aloe barbadensis': 'aloe.jpg',
  'Aloe': 'aloe.jpg',
  
  // Artemisia (Armoise)
  'Artemisia annua': 'annua.jpg',
  'Artemisia': 'annua.jpg',
  'Armoise': 'annua.jpg',
  
  // Neem
  'Azadirachta indica': 'Azadirachtaindica.jpg',
  'Azadirachta': 'Azadirachtaindica.jpg',
  'Neem': 'neem.jpg',
  
  // Moringa
  'Moringa oleifera': 'moringa.jpg',
  'Moringa': 'moringa.jpg',
  
  // Gingembre
  'Zingiber officinale': 'Zingiberofficinale.jpg',
  'Zingiber': 'Zingiberofficinale.jpg',
  'Gingembre': 'Zingiberofficinale.jpg',
}

/**
 * Obtenir path image pour une plante
 * @param scientificName - Nom scientifique de la plante
 * @param commonName - Nom commun (optionnel)
 * @returns Path image ou undefined si non trouvée
 */
export function getPlantImagePath(
  scientificName: string,
  commonName?: string
): string | undefined {
  // Essayer nom scientifique exact
  let filename = PLANT_IMAGES[scientificName]
  
  // Essayer nom commun si échec
  if (!filename && commonName) {
    filename = PLANT_IMAGES[commonName]
  }
  
  // Essayer match partiel sur premier mot
  // Ex: "Artemisia annua L." → "Artemisia"
  if (!filename) {
    const firstWord = scientificName.split(' ')[0]
    filename = PLANT_IMAGES[firstWord]
  }
  
  // Retourner path complet ou undefined
  return filename ? `/images/plants/${filename}` : undefined
}

/**
 * Obtenir URL complète image (pour SEO, Open Graph, etc.)
 * @param scientificName - Nom scientifique
 * @param commonName - Nom commun (optionnel)
 * @returns URL complète avec domaine
 */
export function getPlantImageUrl(
  scientificName: string,
  commonName?: string
): string {
  const path = getPlantImagePath(scientificName, commonName)
  
  // Si pas d'image, retourner placeholder
  if (!path) {
    return `${process.env.NEXT_PUBLIC_SITE_URL || ''}/images/plants/placeholder.svg`
  }
  
  return `${process.env.NEXT_PUBLIC_SITE_URL || ''}${path}`
}

/**
 * Vérifier si une plante a une image
 * @param scientificName - Nom scientifique
 * @param commonName - Nom commun (optionnel)
 * @returns true si image disponible
 */
export function hasPlantImage(
  scientificName: string,
  commonName?: string
): boolean {
  return getPlantImagePath(scientificName, commonName) !== undefined
}