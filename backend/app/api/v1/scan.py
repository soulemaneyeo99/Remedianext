"""
Routes API Scan - Identification plantes par image
Utilise Gemini Vision API pour reconnaissance
"""

from fastapi import APIRouter, File, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import logging
from io import BytesIO
from PIL import Image
import base64

from app.core.config import settings
from app.services.gemini_service import gemini_service

router = APIRouter()
logger = logging.getLogger(__name__)

# ============================================
# MODELS
# ============================================

class PlantIdentification(BaseModel):
    """Modèle de réponse identification"""
    name: str
    scientificName: str
    confidence: float
    description: str
    properties: List[str]
    uses: List[str]
    family: Optional[str] = None
    habitat: Optional[str] = None

class ScanResponse(BaseModel):
    """Réponse complète scan"""
    success: bool
    plant: Optional[PlantIdentification] = None
    error: Optional[str] = None
    message: Optional[str] = None

# ============================================
# ROUTES
# ============================================

@router.post("/identify", response_model=ScanResponse)
async def identify_plant(file: UploadFile = File(...)):
    """
    🔍 Identifier une plante depuis une image
    
    - **file**: Image de la plante (JPG, PNG, WebP)
    - Taille max: 10MB
    - Résolution recommandée: 800x800px minimum
    
    Returns:
        ScanResponse avec identification ou erreur
    """
    
    try:
        # Validation fichier
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le fichier doit être une image (JPG, PNG, WebP)"
            )
        
        # Lire image
        logger.info(f"📸 Reading image: {file.filename} ({file.content_type})")
        image_data = await file.read()
        
        # Validation taille
        if len(image_data) > 10 * 1024 * 1024:  # 10MB
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Image trop grande (max 10MB)"
            )
        
        # Vérifier Gemini configuré
        if not settings.gemini_api_key:
            logger.warning("⚠️ Gemini API key not configured - using demo data")
            return ScanResponse(
                success=True,
                plant=get_demo_plant(),
                message="Mode démonstration (API Gemini non configurée)"
            )
        
        # Identifier avec Gemini Vision
        logger.info("🤖 Calling Gemini Vision API...")
        result = await gemini_service.identify_plant(image_data)
        
        logger.info(f"✅ Plant identified: {result.get('name', 'Unknown')}")
        
        return ScanResponse(
            success=True,
            plant=PlantIdentification(**result)
        )
        
    except HTTPException:
        raise
        
    except Exception as e:
        logger.error(f"❌ Identification error: {str(e)}", exc_info=True)
        
        # En cas d'erreur, retourner démo
        return ScanResponse(
            success=True,
            plant=get_demo_plant(),
            message=f"Erreur API - Mode démo activé: {str(e)}"
        )

@router.post("/batch", response_model=List[ScanResponse])
async def identify_plants_batch(files: List[UploadFile] = File(...)):
    """
    🔍 Identifier plusieurs plantes (batch)
    
    - **files**: Liste d'images (max 5)
    
    Returns:
        Liste de ScanResponse
    """
    
    if len(files) > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 5 images par batch"
        )
    
    results = []
    
    for file in files:
        try:
            result = await identify_plant(file)
            results.append(result)
        except Exception as e:
            logger.error(f"Error processing {file.filename}: {e}")
            results.append(ScanResponse(
                success=False,
                error=str(e)
            ))
    
    return results

# ============================================
# HELPERS
# ============================================

def get_demo_plant() -> PlantIdentification:
    """
    Plante démo pour fallback quand API indisponible
    """
    return PlantIdentification(
        name="Moringa",
        scientificName="Moringa oleifera",
        confidence=85.0,
        description="Le Moringa est un super-aliment exceptionnel, riche en vitamines, minéraux et protéines. Ses feuilles sont utilisées en médecine traditionnelle africaine pour leurs nombreuses vertus nutritives et thérapeutiques.",
        properties=[
            "Nutritif",
            "Antioxydant",
            "Anti-inflammatoire",
            "Énergisant",
            "Immunostimulant"
        ],
        uses=[
            "Malnutrition",
            "Fatigue chronique",
            "Renforcement du système immunitaire",
            "Problèmes digestifs",
            "Anémie"
        ],
        family="Moringaceae",
        habitat="Zones tropicales et subtropicales"
    )