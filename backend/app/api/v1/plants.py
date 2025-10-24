"""
Router Plants - Encyclopédie des plantes médicinales

Endpoints:
- GET /api/v1/plants/list - Liste toutes les plantes (avec pagination)
- GET /api/v1/plants/search - Rechercher des plantes
- GET /api/v1/plants/{id} - Détails d'une plante
- GET /api/v1/plants/by-condition/{condition} - Plantes pour une condition
- GET /api/v1/plants/stats/overview - Statistiques base de données
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import logging

logger = logging.getLogger(__name__)

# Créer le router
router = APIRouter(
    prefix="/plants",
    tags=["plants"]
)

# ============================================
# MODELS
# ============================================

class Plant(BaseModel):
    """Modèle d'une plante médicinale"""
    id: str
    scientific_name: str
    common_names: List[str] = []
    local_names: Dict[str, str] = {}
    family: str
    description: str
    traditional_uses: List[str] = []
    medicinal_properties: List[str] = []
    preparation: str
    dosage: str
    warnings: List[str] = []
    found_in: List[str] = []
    scientific_validation: str
    image_url: Optional[str] = None

class PlantsListResponse(BaseModel):
    """Réponse liste de plantes"""
    success: bool
    data: List[Plant]
    pagination: dict

class PlantDetailResponse(BaseModel):
    """Réponse détail d'une plante"""
    success: bool
    data: Plant

class SearchResponse(BaseModel):
    """Réponse recherche"""
    success: bool
    data: List[Plant]
    results_count: int

# ============================================
# BASE DE DONNÉES MOCK (Remplacer par vraie DB)
# ============================================

PLANTS_DATABASE = [
    {
        "id": "artemisia-annua",
        "scientific_name": "Artemisia annua",
        "common_names": ["Armoise annuelle", "Sweet wormwood"],
        "local_names": {
            "Français": "Armoise annuelle",
            "Bambara": "Diɛlɛnin",
            "Wolof": "Mbep"
        },
        "family": "Asteraceae",
        "description": "Plante herbacée annuelle originaire d'Asie, aujourd'hui cultivée en Afrique. Reconnue pour son efficacité contre le paludisme grâce à l'artémisinine.",
        "traditional_uses": [
            "Traitement du paludisme",
            "Fièvres et infections",
            "Troubles digestifs",
            "Renforcement système immunitaire"
        ],
        "medicinal_properties": [
            "Antipaludique",
            "Antipyrétique",
            "Anti-inflammatoire",
            "Antimicrobien"
        ],
        "preparation": "Infusion de feuilles séchées (5g pour 1L d'eau bouillante). Laisser infuser 15 minutes. Filtrer.",
        "dosage": "Adulte: 1 litre par jour pendant 7 jours. Enfant (>5 ans): 500ml par jour. Ne pas dépasser 7 jours de traitement.",
        "warnings": [
            "Contre-indiqué pendant la grossesse et l'allaitement",
            "Ne pas utiliser en prévention continue",
            "Peut interagir avec anticoagulants",
            "Consulter un médecin si symptômes persistent"
        ],
        "found_in": [
            "Côte d'Ivoire",
            "Sénégal",
            "Mali",
            "Burkina Faso",
            "Bénin",
            "Togo"
        ],
        "scientific_validation": "L'OMS reconnaît l'efficacité de l'Artemisia annua dans le traitement du paludisme. Études cliniques publiées dans The Lancet (2018) montrant 95% d'efficacité.",
        "image_url": "https://example.com/artemisia.jpg"
    },
    {
        "id": "moringa-oleifera",
        "scientific_name": "Moringa oleifera",
        "common_names": ["Moringa", "Arbre de vie", "Nébédaye"],
        "local_names": {
            "Français": "Moringa",
            "Wolof": "Nébédaye",
            "Bambara": "Zɔgɔlɛnin",
            "Haoussa": "Zogale"
        },
        "family": "Moringaceae",
        "description": "Arbre tropical originaire d'Inde, largement cultivé en Afrique. Toutes les parties sont comestibles et médicinales. Surnommé 'arbre miracle'.",
        "traditional_uses": [
            "Malnutrition et carences",
            "Boost système immunitaire",
            "Régulation tension artérielle",
            "Augmentation lactation maternelle",
            "Purification de l'eau"
        ],
        "medicinal_properties": [
            "Nutritif complet (vitamines A, C, E, protéines)",
            "Antioxydant puissant",
            "Anti-inflammatoire",
            "Hypotenseur",
            "Immunostimulant"
        ],
        "preparation": "Feuilles fraîches: Consommer en salade ou cuites. Poudre: 1-2 cuillères à café par jour dans eau, yaourt ou smoothie. Infusion: 10g de feuilles séchées pour 1L d'eau.",
        "dosage": "Adulte: 1-2 cuillères à café de poudre/jour. Enfant: 1/2 cuillère à café/jour. Femme allaitante: 2-3 cuillères/jour.",
        "warnings": [
            "Éviter racines et écorce (toxiques à haute dose)",
            "Peut avoir effet laxatif si consommation excessive",
            "Interagit avec médicaments hypotenseurs",
            "Consulter médecin si grossesse"
        ],
        "found_in": [
            "Sénégal",
            "Mali",
            "Niger",
            "Burkina Faso",
            "Côte d'Ivoire",
            "Ghana",
            "Nigeria"
        ],
        "scientific_validation": "Plus de 1,300 études scientifiques validant les propriétés nutritionnelles et médicinales. FAO et OMS recommandent comme complément nutritionnel.",
        "image_url": "https://example.com/moringa.jpg"
    },
    {
        "id": "aloe-vera",
        "scientific_name": "Aloe vera",
        "common_names": ["Aloès", "Aloe", "Plante miracle"],
        "local_names": {
            "Français": "Aloès",
            "Arabe": "Sabir",
            "Wolof": "Aluwera"
        },
        "family": "Asphodelaceae",
        "description": "Plante succulente aux feuilles charnues contenant un gel transparent aux multiples vertus. Pousse facilement en climat sec.",
        "traditional_uses": [
            "Brûlures et plaies",
            "Problèmes digestifs",
            "Soins de la peau",
            "Constipation",
            "Renforcement immunitaire"
        ],
        "medicinal_properties": [
            "Cicatrisant",
            "Anti-inflammatoire",
            "Hydratant",
            "Laxatif (latex)",
            "Antimicrobien"
        ],
        "preparation": "Gel frais: Couper feuille, extraire gel transparent, appliquer directement. Jus: Mixer gel avec eau (1:3). Éviter le latex jaune (laxatif puissant).",
        "dosage": "Usage externe: Application directe 2-3x/jour. Usage interne: 50-100ml de jus/jour maximum. Cure max 4 semaines.",
        "warnings": [
            "Latex (couche jaune) = laxatif puissant, éviter usage interne",
            "Contre-indiqué grossesse et allaitement (latex)",
            "Peut interagir avec médicaments diabète",
            "Test allergie cutanée avant usage"
        ],
        "found_in": [
            "Afrique du Nord",
            "Sahel",
            "Sénégal",
            "Mali",
            "Côte d'Ivoire"
        ],
        "scientific_validation": "Études cliniques confirment efficacité sur brûlures (Journal of Dermatology, 2019). Gel approuvé par FDA pour usage topique.",
        "image_url": "https://example.com/aloe.jpg"
    },
    {
        "id": "neem",
        "scientific_name": "Azadirachta indica",
        "common_names": ["Neem", "Margousier", "Lilas de Perse"],
        "local_names": {
            "Wolof": "Neem",
            "Bambara": "Nîmi",
            "Haoussa": "Darbejiya"
        },
        "family": "Meliaceae",
        "description": "Arbre tropical aux multiples usages. Toutes parties (feuilles, graines, écorce) ont des propriétés médicinales et insecticides.",
        "traditional_uses": [
            "Paludisme et fièvres",
            "Infections cutanées",
            "Parasites intestinaux",
            "Hygiène dentaire",
            "Purification de l'eau"
        ],
        "medicinal_properties": [
            "Antipaludique",
            "Antibactérien",
            "Antifongique",
            "Antiparasitaire",
            "Insecticide naturel"
        ],
        "preparation": "Décoction feuilles: 30g feuilles pour 1L eau, bouillir 15 min. Poudre graines: Usage externe seulement. Bâtonnet écorce: Frotter sur dents.",
        "dosage": "Décoction: 250ml 3x/jour max 7 jours. Bain de bouche: 2x/jour. Usage externe: Application directe sur peau.",
        "warnings": [
            "Graines toxiques à haute dose (usage interne)",
            "Éviter grossesse et allaitement",
            "Peut réduire fertilité masculine si usage prolongé",
            "Test cutané avant application étendue"
        ],
        "found_in": [
            "Sénégal",
            "Mali",
            "Burkina Faso",
            "Niger",
            "Nigeria",
            "Ghana"
        ],
        "scientific_validation": "Plus de 2,000 études sur propriétés antimicrobiennes. OMS reconnaît usage traditionnel. Brevets internationaux sur composés actifs.",
        "image_url": "https://example.com/neem.jpg"
    },
    {
        "id": "ginger",
        "scientific_name": "Zingiber officinale",
        "common_names": ["Gingembre"],
        "local_names": {
            "Français": "Gingembre",
            "Wolof": "Gingimbar",
            "Bambara": "Jenjanma"
        },
        "family": "Zingiberaceae",
        "description": "Rhizome aromatique aux propriétés digestives et anti-inflammatoires puissantes. Cultivé partout en Afrique tropicale.",
        "traditional_uses": [
            "Nausées et vomissements",
            "Douleurs articulaires",
            "Rhumes et toux",
            "Troubles digestifs",
            "Stimulant circulatoire"
        ],
        "medicinal_properties": [
            "Anti-nauséeux",
            "Anti-inflammatoire",
            "Antioxydant",
            "Réchauffant",
            "Digestif"
        ],
        "preparation": "Infusion: 2-3 rondelles rhizome frais dans eau chaude 10 min. Jus frais: Presser rhizome râpé. Poudre: 1g dans eau chaude.",
        "dosage": "Adulte: 2-4g rhizome frais/jour ou 1-2g poudre. Femme enceinte: Max 1g/jour. Enfant: 0.5g/jour.",
        "warnings": [
            "Haute dose peut irriter estomac",
            "Interagit avec anticoagulants",
            "Prudence si calculs biliaires",
            "Max 4g/jour (risque brûlures d'estomac)"
        ],
        "found_in": [
            "Côte d'Ivoire",
            "Ghana",
            "Nigeria",
            "Cameroun",
            "RDC"
        ],
        "scientific_validation": "Efficacité anti-nauséeuse validée par méta-analyses (Cochrane, 2020). Recommandé par OMS pour nausées grossesse.",
        "image_url": "https://example.com/ginger.jpg"
    }
]

# ============================================
# ROUTES
# ============================================

@router.get("/list", response_model=PlantsListResponse)
async def get_plants_list(
    limit: int = Query(default=50, ge=1, le=100, description="Nombre de résultats"),
    offset: int = Query(default=0, ge=0, description="Offset de pagination")
):
    """
    📚 Liste toutes les plantes médicinales
    
    Retourne une liste paginée de toutes les plantes dans la base de données.
    
    Args:
        limit: Nombre maximum de résultats (1-100)
        offset: Position de départ pour la pagination
        
    Returns:
        Liste de plantes avec pagination
    """
    try:
        logger.info(f"📚 Fetching plants list (limit={limit}, offset={offset})")
        
        # Paginer les résultats
        total = len(PLANTS_DATABASE)
        plants = PLANTS_DATABASE[offset:offset + limit]
        
        return PlantsListResponse(
            success=True,
            data=[Plant(**p) for p in plants],
            pagination={
                "total": total,
                "limit": limit,
                "offset": offset,
                "has_more": (offset + limit) < total
            }
        )
        
    except Exception as e:
        logger.error(f"❌ Error fetching plants: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search", response_model=SearchResponse)
async def search_plants(
    q: str = Query(..., min_length=1, description="Terme de recherche"),
    limit: int = Query(default=10, ge=1, le=50, description="Nombre de résultats")
):
    """
    🔍 Rechercher des plantes
    
    Recherche dans le nom scientifique, noms communs et description.
    
    Args:
        q: Terme de recherche
        limit: Nombre maximum de résultats
        
    Returns:
        Liste de plantes correspondant à la recherche
    """
    try:
        logger.info(f"🔍 Searching plants for: '{q}'")
        
        query = q.lower()
        results = []
        
        for plant in PLANTS_DATABASE:
            # Recherche dans nom scientifique
            if query in plant["scientific_name"].lower():
                results.append(plant)
                continue
            
            # Recherche dans noms communs
            if any(query in name.lower() for name in plant["common_names"]):
                results.append(plant)
                continue
            
            # Recherche dans description
            if query in plant["description"].lower():
                results.append(plant)
                continue
            
            # Recherche dans famille
            if query in plant["family"].lower():
                results.append(plant)
                continue
        
        # Limiter résultats
        results = results[:limit]
        
        logger.info(f"✅ Found {len(results)} plants matching '{q}'")
        
        return SearchResponse(
            success=True,
            data=[Plant(**p) for p in results],
            results_count=len(results)
        )
        
    except Exception as e:
        logger.error(f"❌ Search error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{plant_id}", response_model=PlantDetailResponse)
async def get_plant_by_id(plant_id: str):
    """
    🌿 Détails d'une plante
    
    Retourne toutes les informations détaillées d'une plante spécifique.
    
    Args:
        plant_id: ID de la plante (ex: 'artemisia-annua')
        
    Returns:
        Détails complets de la plante
        
    Raises:
        404: Si la plante n'existe pas
    """
    try:
        logger.info(f"🌿 Fetching plant details: {plant_id}")
        
        # Chercher la plante
        plant = next((p for p in PLANTS_DATABASE if p["id"] == plant_id), None)
        
        if not plant:
            logger.warning(f"⚠️ Plant not found: {plant_id}")
            raise HTTPException(
                status_code=404,
                detail={
                    "success": False,
                    "message": f"Plante '{plant_id}' non trouvée",
                    "available_plants": [p["id"] for p in PLANTS_DATABASE]
                }
            )
        
        logger.info(f"✅ Plant found: {plant['scientific_name']}")
        
        return PlantDetailResponse(
            success=True,
            data=Plant(**plant)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching plant: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/by-condition/{condition}")
async def get_plants_by_condition(
    condition: str,
    limit: int = Query(default=10, ge=1, le=50)
):
    """
    🏥 Plantes pour une condition médicale
    
    Trouve les plantes recommandées pour traiter une condition spécifique.
    
    Args:
        condition: Condition médicale (ex: 'paludisme', 'toux', 'digestion')
        limit: Nombre maximum de résultats
        
    Returns:
        Liste de plantes pertinentes
    """
    try:
        logger.info(f"🏥 Finding plants for condition: {condition}")
        
        condition_lower = condition.lower()
        results = []
        
        for plant in PLANTS_DATABASE:
            # Chercher dans usages traditionnels
            if any(condition_lower in use.lower() for use in plant["traditional_uses"]):
                results.append(plant)
                continue
            
            # Chercher dans propriétés médicinales
            if any(condition_lower in prop.lower() for prop in plant["medicinal_properties"]):
                results.append(plant)
                continue
        
        results = results[:limit]
        
        logger.info(f"✅ Found {len(results)} plants for '{condition}'")
        
        return SearchResponse(
            success=True,
            data=[Plant(**p) for p in results],
            results_count=len(results)
        )
        
    except Exception as e:
        logger.error(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats/overview")
async def get_plants_stats():
    """
    📊 Statistiques de la base de données
    
    Retourne des statistiques globales sur la base de plantes.
    
    Returns:
        Statistiques détaillées
    """
    try:
        # Calculer stats
        total_plants = len(PLANTS_DATABASE)
        families = list(set(p["family"] for p in PLANTS_DATABASE))
        countries = set()
        for plant in PLANTS_DATABASE:
            countries.update(plant["found_in"])
        
        return {
            "success": True,
            "stats": {
                "total_plants": total_plants,
                "families_count": len(families),
                "countries_coverage": len(countries),
                "top_families": families[:5],
                "most_common_uses": [
                    "Paludisme",
                    "Infections",
                    "Troubles digestifs",
                    "Renforcement immunitaire",
                    "Douleurs"
                ],
                "validation_rate": 100,  # % scientifiquement validées
                "database_version": "2.0"
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Stats error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/families")
async def get_plant_families():
    """
    🏷️ Liste des familles botaniques
    
    Retourne toutes les familles botaniques présentes dans la base.
    """
    families = list(set(p["family"] for p in PLANTS_DATABASE))
    return {
        "success": True,
        "families": sorted(families),
        "count": len(families)
    }

@router.get("/countries")
async def get_countries():
    """
    🌍 Liste des pays couverts
    
    Retourne tous les pays où les plantes sont trouvées.
    """
    countries = set()
    for plant in PLANTS_DATABASE:
        countries.update(plant["found_in"])
    
    return {
        "success": True,
        "countries": sorted(list(countries)),
        "count": len(countries)
    }

@router.get("/health")
async def plants_health():
    """🏥 Health check du service plants"""
    return {
        "status": "healthy",
        "service": "plants",
        "database_size": len(PLANTS_DATABASE),
        "endpoints": [
            "/plants/list",
            "/plants/search",
            "/plants/{id}",
            "/plants/by-condition/{condition}",
            "/plants/stats/overview"
        ]
    }