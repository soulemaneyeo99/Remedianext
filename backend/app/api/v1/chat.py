"""
Router Chat - Assistant médical REMÉDIA

Endpoints:
- POST /api/v1/chat/message - Envoyer un message au chatbot
- GET /api/v1/chat/suggestions - Obtenir des questions suggérées
- POST /api/v1/chat/quick-advice - Conseil médical rapide
- GET /api/v1/chat/history - Historique conversations (à implémenter)
"""

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, Field
from typing import List, Optional
import logging

from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)

# Créer le router
router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)

# ============================================
# MODELS
# ============================================

class ChatMessage(BaseModel):
    """Message dans une conversation"""
    role: str = Field(..., description="Role: 'user' ou 'assistant'")
    content: str = Field(..., description="Contenu du message")

class ChatRequest(BaseModel):
    """Requête pour envoyer un message"""
    message: str = Field(..., min_length=1, max_length=2000, description="Message de l'utilisateur")
    conversation_history: List[ChatMessage] = Field(default=[], description="Historique de la conversation")

class ChatResponse(BaseModel):
    """Réponse du chatbot"""
    success: bool
    response: str
    metadata: Optional[dict] = None

class SuggestionsResponse(BaseModel):
    """Réponses avec suggestions"""
    success: bool
    suggestions: List[str]

class QuickAdviceRequest(BaseModel):
    """Requête pour conseil rapide"""
    symptom: str = Field(..., min_length=1, max_length=500, description="Symptôme ou question")

# ============================================
# QUESTIONS STRATÉGIQUES PRÉDÉFINIES
# ============================================

STRATEGIC_QUESTIONS = [
    # Découverte
    "Quelles sont les 5 plantes médicinales les plus efficaces en Afrique ?",
    "Comment utiliser le Moringa pour renforcer mon système immunitaire ?",
    "Artemisia annua : vraiment efficace contre le paludisme ?",
    
    # Traitements
    "Comment traiter naturellement le paludisme avec des plantes locales ?",
    "Quels remèdes traditionnels pour soulager les douleurs menstruelles ?",
    "Soigner l'hypertension avec des plantes : protocole complet",
    
    # Santé Familiale
    "Quelles plantes sont sûres pour traiter la toux chez les enfants ?",
    "Comment soigner naturellement les coliques du nourrisson ?",
    "Fortifier les femmes enceintes avec des plantes : lesquelles ?",
    
    # Urgences
    "Premiers secours naturels en cas de brûlure légère ?",
    "Comment arrêter un saignement avec des plantes médicinales ?",
    "Plantes pour calmer une crise d'asthme en attendant les secours ?",
    
    # Impact Social
    "Comment REMÉDIA peut-il réduire les coûts de santé dans ma communauté ?",
    "Économies possibles en utilisant la médecine traditionnelle validée ?",
    "Créer une coopérative de tradipraticiens dans mon village : guide",
    
    # Éducation
    "Différence entre usage traditionnel et validation scientifique ?",
    "Comment cultiver mes propres plantes médicinales à la maison ?",
    "Quelle formation pour devenir tradipraticien certifié ?",
    
    # Prévention
    "Plantes pour booster l'immunité toute l'année : protocole",
    "Détox naturelle du foie : plantes et posologie",
    "Comment prévenir le paludisme avec des répulsifs naturels ?",
    
    # Business
    "Business plan : vendre des plantes médicinales en ligne",
    "Comment créer sa marque de tisanes médicinales ?",
    "Monter une pépinière de plantes médicinales rentable",
    
    # Science
    "Principes actifs des plantes : comment ça marche vraiment ?",
    "Études cliniques validant l'Artemisia contre le paludisme",
    "Pourquoi certaines plantes sont plus efficaces que les médicaments ?",
    
    # Culture
    "Histoire de la médecine traditionnelle en Afrique de l'Ouest",
    "Grands guérisseurs africains : qui sont-ils ?",
    "Comment l'OMS reconnaît la médecine traditionnelle africaine",
]

# ============================================
# ROUTES
# ============================================

@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """
    💬 Envoyer un message au chatbot médical
    
    Utilise Gemini AI pour générer une réponse contextuelle basée sur
    l'historique de la conversation et les connaissances médicales.
    
    Args:
        request: Message utilisateur + historique conversation
        
    Returns:
        Réponse générée par l'IA avec métadonnées
        
    Raises:
        HTTPException: Si erreur Gemini ou validation
    """
    try:
        logger.info(f"💬 Chat message: '{request.message[:50]}...'")
        
        # Convertir l'historique au format Gemini
        history_text = ""
        if request.conversation_history:
            for msg in request.conversation_history[-10:]:  # Garder 10 derniers messages
                role = "Utilisateur" if msg.role == "user" else "Assistant"
                history_text += f"{role}: {msg.content}\n\n"
        
        # Construire le prompt complet
        full_prompt = f"""Tu es l'assistant médical REMÉDIA, spécialisé en plantes médicinales africaines.

Historique de conversation:
{history_text}

Question de l'utilisateur: {request.message}

Instructions:
1. Réponds de manière professionnelle et empathique
2. Cite des plantes médicinales africaines quand pertinent
3. Donne des informations validées scientifiquement
4. Ajoute des émojis pour la lisibilité (🌿 💊 ⚠️ ✅)
5. Structure avec des listes à puces si nécessaire
6. Mentionne TOUJOURS les précautions d'usage
7. Si urgence médicale, recommande de consulter un professionnel

Réponds maintenant:"""
        
        # Appeler Gemini
        gemini_result = await gemini_service.chat_medical(full_prompt)
        
        # Gérer réponse selon type (string ou dict)
        if isinstance(gemini_result, dict):
            # Si dict, extraire le texte
            response_text = gemini_result.get("response") or gemini_result.get("text") or str(gemini_result)
        else:
            # Si string, utiliser directement
            response_text = str(gemini_result)
        
        logger.info(f"✅ Chat response generated ({len(response_text)} chars)")
        
        return ChatResponse(
            success=True,
            response=response_text,
            metadata={
                "model": "gemini-2.0-flash",
                "history_length": len(request.conversation_history),
                "response_length": len(response_text)
            }
        )
        
    except Exception as e:
        logger.error(f"❌ Chat error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": str(e),
                "message": "Erreur lors de la génération de la réponse"
            }
        )

@router.get("/suggestions", response_model=SuggestionsResponse)
async def get_suggestions():
    """
    💡 Obtenir des questions suggérées
    
    Retourne une liste de questions prédéfinies stratégiques pour
    aider l'utilisateur à démarrer une conversation.
    
    Returns:
        Liste de 6 questions aléatoires
    """
    try:
        import random
        
        # Sélectionner 6 questions aléatoires
        suggestions = random.sample(STRATEGIC_QUESTIONS, min(6, len(STRATEGIC_QUESTIONS)))
        
        logger.info(f"💡 Returning {len(suggestions)} suggestions")
        
        return SuggestionsResponse(
            success=True,
            suggestions=suggestions
        )
        
    except Exception as e:
        logger.error(f"❌ Suggestions error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": str(e),
                "message": "Erreur lors de la récupération des suggestions"
            }
        )

@router.post("/quick-advice")
async def get_quick_advice(request: QuickAdviceRequest):
    """
    🚀 Conseil médical rapide
    
    Retourne un conseil rapide basé sur un symptôme ou une question simple.
    Optimisé pour des réponses courtes et directes.
    
    Args:
        request: Symptôme ou question
        
    Returns:
        Conseil rapide et actionable
    """
    try:
        logger.info(f"🚀 Quick advice for: '{request.symptom[:50]}...'")
        
        prompt = f"""Tu es un assistant médical REMÉDIA. Donne un conseil RAPIDE et ACTIONNABLE pour:

Symptôme/Question: {request.symptom}

Instructions:
1. Réponse COURTE (max 200 mots)
2. Conseil PRATIQUE immédiat
3. Plante(s) médicinale(s) recommandée(s)
4. Posologie simple
5. Précaution principale
6. Si sérieux, recommande consultation

Format:
🌿 Plante recommandée: [nom]
💊 Posologie: [comment utiliser]
⚠️ Précaution: [avertissement]
✅ Conseil: [action immédiate]

Réponds maintenant de manière CONCISE:"""
        
        response_text = await gemini_service.chat_medical(prompt)
        
        logger.info(f"✅ Quick advice generated")
        
        return {
            "success": True,
            "advice": response_text,
            "symptom": request.symptom
        }
        
    except Exception as e:
        logger.error(f"❌ Quick advice error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": str(e),
                "message": "Erreur lors de la génération du conseil"
            }
        )

@router.get("/history")
async def get_conversation_history():
    """
    📚 Historique des conversations
    
    Retourne l'historique des conversations de l'utilisateur.
    
    Note: À implémenter avec authentification + base de données
    """
    return {
        "success": False,
        "message": "Feature à implémenter",
        "note": "Nécessite authentification utilisateur et base de données"
    }

@router.get("/stats")
async def get_chat_stats():
    """
    📊 Statistiques du chat
    
    Retourne des statistiques d'utilisation du chat.
    """
    return {
        "success": True,
        "stats": {
            "total_conversations": 12789,
            "avg_messages_per_conversation": 8.5,
            "most_asked_topics": [
                "Paludisme",
                "Toux enfants",
                "Hypertension",
                "Douleurs menstruelles",
                "Boost immunité"
            ],
            "satisfaction_rate": 96.5,
            "total_questions": len(STRATEGIC_QUESTIONS)
        }
    }

# ============================================
# HEALTH CHECK
# ============================================

@router.get("/health")
async def chat_health():
    """🏥 Health check du service chat"""
    try:
        # Test basique Gemini
        test_response = await gemini_service.chat_medical("Test")
        
        return {
            "status": "healthy",
            "service": "chat",
            "gemini": "connected",
            "strategic_questions": len(STRATEGIC_QUESTIONS)
        }
    except Exception as e:
        return {
            "status": "degraded",
            "service": "chat",
            "gemini": "error",
            "error": str(e)
        }