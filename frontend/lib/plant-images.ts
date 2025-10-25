// lib/plant-images.ts

/**
 * 🌿 Configuration Images Plantes - COMPLÈTE
 * 
 * Mapping nom scientifique/commun → filename image
 * Toutes les 8+ plantes avec images
 * 
 * @version 3.0.0 - Toutes images ajoutées
 */

/**
 * Mapping nom scientifique/commun → filename image
 * 
 * Images disponibles:
 * - aloe.jpg
 * - annua.jpg
 * - Azadirachtaindica.jpg
 * - Baobab.jpg ← NOUVEAU
 * - Bissap.jpg ← NOUVEAU
 * - Kinkeliba.jpg ← NOUVEAU
 * - moringa.jpg
 * - neem.jpg
 * - Zingiberofficinale.jpg
 */
export const PLANT_IMAGES: Record<string, string> = {
  // Aloe Vera
  'Aloe vera': 'aloe.jpg',
  'Aloe barbadensis': 'aloe.jpg',
  'Aloe': 'aloe.jpg',
  
  // Artemisia (Armoise)
  'Artemisia annua': 'annua.jpg',
  'Artemisia': 'annua.jpg',
  'Armoise': 'annua.jpg',
  'Armoise Annuelle': 'annua.jpg',
  
  // Neem / Azadirachta
  'Azadirachta indica': 'Azadirachtaindica.jpg',
  'Azadirachta': 'Azadirachtaindica.jpg',
  'Neem': 'neem.jpg',
  
  // Baobab ← NOUVEAU
  'Adansonia digitata': 'Baobab.jpg',
  'Adansonia': 'Baobab.jpg',
  'Baobab': 'Baobab.jpg',
  
  // Bissap / Hibiscus ← NOUVEAU
  'Hibiscus sabdariffa': 'Bissap.jpg',
  'Hibiscus': 'Bissap.jpg',
  'Bissap': 'Bissap.jpg',
  'Bissap (Hibiscus)': 'Bissap.jpg',
  
  // Kinkeliba ← NOUVEAU
  'Combretum micranthum': 'Kinkeliba.jpg',
  'Combretum': 'Kinkeliba.jpg',
  'Kinkeliba': 'Kinkeliba.jpg',
  'Kinkéliba': 'Kinkeliba.jpg',
  
  // Moringa
  'Moringa oleifera': 'moringa.jpg',
  'Moringa': 'moringa.jpg',
  
  // Gingembre / Zingiber
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
  if (!filename && scientificName) {
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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
    return `${siteUrl}/images/plants/placeholder.svg`
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  return `${siteUrl}${path}`
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

/**
 * Obtenir toutes les plantes avec images disponibles
 * @returns Array de noms scientifiques
 */
export function getAvailablePlants(): string[] {
  return Object.keys(PLANT_IMAGES).filter(key => {
    // Retourner seulement les noms scientifiques (avec espace)
    return key.includes(' ')
  })
}

/**
 * Statistiques images
 */
export function getImageStats() {
  const uniqueImages = new Set(Object.values(PLANT_IMAGES))
  return {
    totalMappings: Object.keys(PLANT_IMAGES).length,
    uniqueImages: uniqueImages.size,
    images: Array.from(uniqueImages)
  }
}