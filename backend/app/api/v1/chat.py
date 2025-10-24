"""
API Route: Chatbot médical intelligent
"""
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import logging

from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/chat", tags=["Chat"])


class Message(BaseModel):
    """Modèle pour un message de chat"""
    role: str = Field(..., description="'user' ou 'assistant'")
    content: str = Field(..., description="Contenu du message")


class ChatRequest(BaseModel):
    """Requête pour le chatbot"""
    message: str = Field(..., min_length=1, max_length=2000, description="Message de l'utilisateur")
    conversation_history: Optional[List[Message]] = Field(default=None, description="Historique de la conversation")


class ChatResponse(BaseModel):
    """Réponse du chatbot"""
    success: bool
    response: str
    message: str


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """
    Envoie un message à l'assistant médical et reçoit une réponse
    
    - **message**: Question ou message de l'utilisateur
    - **conversation_history**: Historique optionnel de la conversation
    - Returns: Réponse de l'assistant médical
    """
    try:
        logger.info(f"Nouveau message reçu: {request.message[:50]}...")
        
        # Convertir l'historique en format dict
        history = None
        if request.conversation_history:
            history = [msg.model_dump() for msg in request.conversation_history]
        
        # Appeler le service Gemini
        result = await gemini_service.chat_medical(
            user_message=request.message,
            conversation_history=history
        )
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("message", "Erreur lors de la génération de la réponse")
            )
        
        return ChatResponse(
            success=True,
            response=result["response"],
            message="Réponse générée avec succès"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur inattendue dans le chat: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur serveur: {str(e)}"
        )


@router.post("/quick-advice")
async def get_quick_advice(symptom: str):
    """
    Obtient un conseil médical rapide pour un symptôme
    
    - **symptom**: Symptôme ou problème de santé
    - Returns: Conseil médical bref avec plantes recommandées
    """
    try:
        prompt = f"""Donne un conseil médical bref (3-4 lignes) pour: {symptom}

Inclus:
- 1-2 plantes médicinales africaines recommandées
- Mode de préparation simple
- Rappel de consulter un médecin si symptômes persistent

Sois concis et accessible."""
        
        result = await gemini_service.chat_medical(prompt)
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de la génération du conseil"
            )
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "advice": result["response"],
                "symptom": symptom
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur lors du conseil rapide: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur serveur: {str(e)}"
        )


@router.get("/suggestions")
async def get_common_questions():
    """
    Retourne une liste de questions fréquentes suggérées
    """
    suggestions = [
        "Comment traiter naturellement le paludisme ?",
        "Quelles plantes pour améliorer la digestion ?",
        "Remèdes traditionnels contre la toux ?",
        "Plantes pour renforcer le système immunitaire",
        "Comment soigner une plaie avec des plantes ?",
        "Traitement naturel de l'hypertension",
        "Quelles plantes pour le diabète ?",
        "Remèdes contre les maux de tête"
    ]
    
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "success": True,
            "suggestions": suggestions
        }
    )


@router.get("/health")
async def health_check():
    """Vérifie que le service de chat est opérationnel"""
    return {
        "status": "healthy",
        "service": "chat",
        "model": "gemini-1.5-flash"
    }
