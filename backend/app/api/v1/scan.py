"""
API Route: Scan de plantes avec Gemini Vision
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
from typing import Dict, Any
import json
import logging

from app.services.gemini_service import gemini_service
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/scan", tags=["Scan"])


@router.post("/identify", response_model=Dict[str, Any])
async def identify_plant(
    image: UploadFile = File(..., description="Image de la plante à identifier")
):
    """
    Identifie une plante à partir d'une image uploadée
    
    - **image**: Image de la plante (JPEG, PNG, WebP)
    - Returns: Informations détaillées sur la plante identifiée
    """
    try:
        # Validation du fichier
        if not image.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le fichier doit être une image (JPEG, PNG, WebP)"
            )
        
        # Vérifier la taille du fichier
        contents = await image.read()
        if len(contents) > settings.max_upload_size:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"L'image ne doit pas dépasser {settings.max_upload_size / 1024 / 1024}MB"
            )
        
        logger.info(f"Traitement d'une image: {image.filename} ({len(contents)} bytes)")
        
        # Appeler le service Gemini
        result = await gemini_service.identify_plant(contents)
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("message", "Erreur lors de l'identification")
            )
        
        # Parser la réponse JSON de Gemini
        try:
            plant_data = json.loads(result["raw_response"])
        except json.JSONDecodeError:
            # Si Gemini n'a pas retourné du JSON valide, retourner la réponse brute
            plant_data = {
                "raw_text": result["raw_response"],
                "note": "La réponse n'est pas au format JSON structuré"
            }
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "data": plant_data,
                "message": "Plante identifiée avec succès",
                "filename": image.filename
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur inattendue: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur serveur: {str(e)}"
        )


@router.post("/validate/{plant_name}")
async def validate_plant(plant_name: str):
    """
    Valide et enrichit les informations d'une plante avec des sources scientifiques
    
    - **plant_name**: Nom scientifique ou commun de la plante
    - Returns: Informations validées avec sources
    """
    try:
        result = await gemini_service.validate_plant_info(plant_name)
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("message", "Erreur lors de la validation")
            )
        
        # Parser les données
        try:
            validation_data = json.loads(result["data"])
        except json.JSONDecodeError:
            validation_data = {"raw_text": result["data"]}
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "data": validation_data,
                "message": "Validation effectuée avec succès"
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur lors de la validation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur serveur: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Vérifie que le service de scan est opérationnel"""
    return {
        "status": "healthy",
        "service": "scan",
        "gemini_configured": bool(settings.gemini_api_key)
    }
