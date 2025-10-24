"""
API Route: Base de données de plantes médicinales
"""
from fastapi import APIRouter, HTTPException, status, Query
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict, Any
import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/plants", tags=["Plants"])

# Charger la base de données de plantes
PLANTS_DB_PATH = Path(__file__).parent.parent.parent / "data" / "plants_database.json"

def load_plants_db() -> Dict[str, Any]:
    """Charge la base de données de plantes"""
    try:
        with open(PLANTS_DB_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error(f"Base de données introuvable: {PLANTS_DB_PATH}")
        return {"plants": []}
    except json.JSONDecodeError as e:
        logger.error(f"Erreur de parsing JSON: {e}")
        return {"plants": []}


@router.get("/list")
async def get_all_plants(
    limit: int = Query(default=50, ge=1, le=100, description="Nombre de plantes à retourner"),
    offset: int = Query(default=0, ge=0, description="Décalage pour la pagination")
):
    """
    Retourne la liste de toutes les plantes de la base de données
    
    - **limit**: Nombre maximum de résultats (1-100)
    - **offset**: Position de départ pour la pagination
    - Returns: Liste de plantes avec pagination
    """
    try:
        db = load_plants_db()
        plants = db.get("plants", [])
        
        # Pagination
        total = len(plants)
        paginated_plants = plants[offset:offset + limit]
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "data": paginated_plants,
                "pagination": {
                    "total": total,
                    "limit": limit,
                    "offset": offset,
                    "has_more": (offset + limit) < total
                }
            }
        )
    
    except Exception as e:
        logger.error(f"Erreur lors du chargement des plantes: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur serveur: {str(e)}"
        )


@router.get("/search")
async def search_plants(
    q: str = Query(..., min_length=2, description="Terme de recherche"),
    limit: int = Query(default=10, ge=1, le=50)
):
    """
    Recherche des plantes par nom, usage ou propriété
    
    - **q**: Terme de recherche (nom, usage, propriété)
    - **limit**: Nombre maximum de résultats
    - Returns: Plantes correspondant à la recherche
    """
    try:
        db = load_plants_db()
        plants = db.get("plants", [])
        
        # Recherche dans différents champs
        search_term = q.lower()
        results = []
        
        for plant in plants:
            # Recherche dans le nom scientifique
            if search_term in plant.get("scientific_name", "").lower():
                results.append(plant)
                continue
            
            # Recherche dans les noms communs
            common_names = plant.get("common_names", [])
            if any(search_term in name.lower() for name in common_names):
                results.append(plant)
                continue
            
            # Recherche dans les usages traditionnels
            uses = plant.get("traditional_uses", [])
            if any(search_term in use.lower() for use in uses):
                results.append(plant)
                continue
            
            # Recherche dans les propriétés médicinales
            properties = plant.get("medicinal_properties", [])
            if any(search_term in prop.lower() for prop in properties):
                results.append(plant)
                continue
        
        # Limiter les résultats
        results = results[:limit]
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "query": q,
                "results_count": len(results),
                "data": results
            }
        )
    
    except Exception as e:
        logger.error(f"Erreur lors de la recherche: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur serveur: {str(e)}"
        )


@router.get("/{plant_id}")
async def get_plant_by_id(plant_id: str):
    """
    Récupère les détails d'une plante par son ID
    
    - **plant_id**: Identifiant unique de la plante
    - Returns: Détails complets de la plante
    """
    try:
        db = load_plants_db()
        plants = db.get("plants", [])
        
        # Rechercher la plante par ID
        plant = next((p for p in plants if p["id"] == plant_id), None)
        
        if not plant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Plante avec l'ID {plant_id} introuvable"
            )
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "data": plant
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur lors de la récupération de la plante: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur serveur: {str(e)}"
        )


@router.get("/by-condition/{condition}")
async def get_plants_by_condition(condition: str):
    """
    Récupère les plantes recommandées pour une condition médicale
    
    - **condition**: Condition médicale (ex: paludisme, diabète, hypertension)
    - Returns: Liste de plantes recommandées
    """
    try:
        db = load_plants_db()
        plants = db.get("plants", [])
        
        condition_lower = condition.lower()
        matching_plants = []
        
        for plant in plants:
            # Rechercher dans les usages traditionnels
            uses = [use.lower() for use in plant.get("traditional_uses", [])]
            if any(condition_lower in use for use in uses):
                matching_plants.append({
                    "id": plant["id"],
                    "scientific_name": plant["scientific_name"],
                    "common_names": plant["common_names"],
                    "traditional_uses": plant["traditional_uses"],
                    "preparation": plant.get("preparation", ""),
                    "warnings": plant.get("warnings", [])
                })
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "condition": condition,
                "results_count": len(matching_plants),
                "data": matching_plants
            }
        )
    
    except Exception as e:
        logger.error(f"Erreur lors de la recherche par condition: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur serveur: {str(e)}"
        )


@router.get("/stats/overview")
async def get_database_stats():
    """
    Retourne des statistiques sur la base de données de plantes
    """
    try:
        db = load_plants_db()
        plants = db.get("plants", [])
        
        # Calculer des statistiques
        total_plants = len(plants)
        families = set(plant.get("family", "") for plant in plants)
        countries = set()
        for plant in plants:
            countries.update(plant.get("found_in", []))
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "stats": {
                    "total_plants": total_plants,
                    "total_families": len(families),
                    "total_countries": len(countries),
                    "countries": sorted(list(countries))
                }
            }
        )
    
    except Exception as e:
        logger.error(f"Erreur lors du calcul des statistiques: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur serveur: {str(e)}"
        )
