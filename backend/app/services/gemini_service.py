"""
Service Gemini AI pour REMEDIA
Gère la reconnaissance de plantes et le chat médical
"""
import google.generativeai as genai
from typing import Optional, Dict, Any, List
from PIL import Image
import io
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class GeminiService:
    """Service pour interagir avec l'API Gemini de Google"""
    
    def __init__(self):
        """Initialise le service Gemini"""
        if not settings.gemini_api_key:
            raise ValueError("GEMINI_API_KEY non configurée. Vérifiez votre fichier .env")
        
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel(settings.gemini_model)
        logger.info(f"Service Gemini initialisé avec le modèle: {settings.gemini_model}")
    
    async def identify_plant(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Identifie une plante à partir d'une image
        
        Args:
            image_bytes: Bytes de l'image uploadée
            
        Returns:
            Dict contenant les informations sur la plante identifiée
        """
        try:
            # Charger l'image
            image = Image.open(io.BytesIO(image_bytes))
            
            # Prompt optimisé pour les plantes médicinales africaines
            prompt = """Tu es un expert en botanique et plantes médicinales africaines.
            
Analyse cette image et identifie la plante. Fournis ta réponse au format JSON suivant:

{
  "plant_name": "Nom scientifique (Nom local)",
  "confidence": 0.85,
  "family": "Famille botanique",
  "description": "Description brève de la plante",
  "traditional_uses": ["Usage 1", "Usage 2", "Usage 3"],
  "medicinal_properties": ["Propriété 1", "Propriété 2"],
  "preparation": "Mode de préparation traditionnel",
  "warnings": ["Contre-indication 1", "Contre-indication 2"],
  "found_in": ["Pays/région 1", "Pays/région 2"]
}

Si tu ne reconnais pas la plante avec certitude, indique confidence < 0.6 et explique pourquoi.
Focus sur les plantes d'Afrique de l'Ouest (Côte d'Ivoire, Mali, Guinée, Sénégal, Togo, Bénin).
"""
            
            # Générer la réponse
            response = self.model.generate_content([prompt, image])
            
            # Parser la réponse JSON
            result_text = response.text.strip()
            
            # Nettoyer la réponse (supprimer les balises markdown si présentes)
            if result_text.startswith("```json"):
                result_text = result_text.replace("```json", "").replace("```", "").strip()
            
            logger.info(f"Plante identifiée avec succès")
            
            return {
                "success": True,
                "raw_response": result_text,
                "message": "Plante identifiée avec succès"
            }
            
        except Exception as e:
            logger.error(f"Erreur lors de l'identification: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "message": "Erreur lors de l'identification de la plante"
            }
    
    async def chat_medical(
        self, 
        user_message: str, 
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Assistant médical conversationnel avec RAG
        
        Args:
            user_message: Message de l'utilisateur
            conversation_history: Historique de la conversation
            
        Returns:
            Dict avec la réponse de l'assistant
        """
        try:
            # Construire le contexte avec l'historique
            context_parts = []
            
            if conversation_history:
                for msg in conversation_history[-5:]:  # Garder les 5 derniers messages
                    role = "Utilisateur" if msg["role"] == "user" else "Assistant"
                    context_parts.append(f"{role}: {msg['content']}")
            
            # Prompt système pour l'assistant médical
            system_prompt = """Tu es un assistant médical spécialisé en médecine traditionnelle africaine.

RÈGLES IMPORTANTES:
1. Toujours rappeler de consulter un professionnel de santé pour les urgences
2. Donner des informations basées sur des sources scientifiques quand possible
3. Mentionner les contre-indications et précautions
4. Être empathique et rassurant
5. Utiliser un langage simple accessible aux populations rurales
6. Focus sur les plantes médicinales d'Afrique de l'Ouest

STRUCTURE DE RÉPONSE:
- Reconnaissance du problème
- Suggestions de plantes traditionnelles (avec noms locaux)
- Mode de préparation
- Posologie
- Avertissements/contre-indications
- Quand consulter un médecin

"""
            
            # Construire le prompt complet
            full_prompt = system_prompt
            if context_parts:
                full_prompt += "\n\nHISTORIQUE:\n" + "\n".join(context_parts)
            full_prompt += f"\n\nUtilisateur: {user_message}\n\nAssistant:"
            
            # Générer la réponse
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=settings.gemini_temperature,
                    max_output_tokens=settings.gemini_max_tokens,
                )
            )
            
            assistant_response = response.text.strip()
            
            logger.info(f"Réponse médicale générée avec succès")
            
            return {
                "success": True,
                "response": assistant_response,
                "message": "Réponse générée avec succès"
            }
            
        except Exception as e:
            logger.error(f"Erreur lors de la génération de réponse: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "response": "Désolé, je rencontre une erreur. Veuillez réessayer.",
                "message": "Erreur lors de la génération de la réponse"
            }
    
    async def validate_plant_info(self, plant_name: str) -> Dict[str, Any]:
        """
        Valide et enrichit les informations d'une plante
        
        Args:
            plant_name: Nom de la plante à valider
            
        Returns:
            Dict avec les informations validées
        """
        try:
            prompt = f"""Fournis des informations scientifiques validées sur la plante: {plant_name}

Format de réponse JSON:
{{
  "scientific_name": "Nom scientifique complet",
  "common_names": ["Nom français", "Nom local"],
  "verified": true/false,
  "scientific_sources": ["Source 1", "Source 2"],
  "medical_validation": "Résumé de la validation scientifique",
  "safety_profile": "Profil de sécurité (sûr/précaution/risque)",
  "clinical_studies": "Résumé des études cliniques disponibles"
}}

Si la plante n'a pas de validation scientifique claire, indique "verified": false
"""
            
            response = self.model.generate_content(prompt)
            result_text = response.text.strip()
            
            if result_text.startswith("```json"):
                result_text = result_text.replace("```json", "").replace("```", "").strip()
            
            return {
                "success": True,
                "data": result_text,
                "message": "Validation effectuée avec succès"
            }
            
        except Exception as e:
            logger.error(f"Erreur lors de la validation: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "message": "Erreur lors de la validation"
            }


# Instance globale du service
gemini_service = GeminiService()
