"""
Service Gemini - Interface avec Google Gemini AI

Gestion professionnelle:
- Retry automatique sur erreurs temporaires
- Rate limiting
- Logging détaillé
- Error handling gracieux
"""

import google.generativeai as genai
from typing import Optional, Dict, Any
import logging
from functools import lru_cache
import asyncio
from app.core.config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    """
    Service wrapper pour Google Gemini AI
    
    Features:
    - Configuration centralisée
    - Retry logic
    - Error handling
    - Caching (pour prompts système)
    """
    
    def __init__(self):
        """Initialize Gemini service"""
        self.api_key = settings.gemini_api_key
        self.model_name = settings.gemini_model
        self._model = None
        self._configured = False
        
        if self.api_key:
            self._configure()
    
    def _configure(self):
        """Configure Gemini API"""
        try:
            genai.configure(api_key=self.api_key)
            self._model = genai.GenerativeModel(self.model_name)
            self._configured = True
            logger.info(f"✅ Gemini configured with model: {self.model_name}")
        except Exception as e:
            logger.error(f"❌ Gemini configuration failed: {str(e)}")
            self._configured = False
    
    async def chat_medical(self, prompt: str, max_retries: int = 3) -> str:
        """
        Chat médical avec Gemini
        
        Args:
            prompt: Question ou contexte utilisateur
            max_retries: Nombre de tentatives en cas d'erreur
            
        Returns:
            str: Réponse textuelle de Gemini
            
        Raises:
            Exception: Si toutes les tentatives échouent
        """
        if not self._configured:
            error_msg = "Gemini API non configurée. Vérifier GEMINI_API_KEY."
            logger.error(f"❌ {error_msg}")
            raise ValueError(error_msg)
        
        # Prompt système pour contexte médical
        system_prompt = """Tu es un assistant médical expert en plantes médicinales africaines.

RÈGLES IMPORTANTES:
1. Réponds TOUJOURS en français
2. Sois professionnel mais empathique
3. Utilise des emojis pour la lisibilité (🌿 💊 ⚠️ ✅)
4. Structure tes réponses avec des listes à puces
5. Cite TOUJOURS les sources scientifiques si disponibles
6. Mentionne TOUJOURS les précautions d'usage
7. Si c'est une urgence médicale, recommande de consulter un professionnel
8. Base-toi sur des connaissances validées scientifiquement

CONTEXTE:
Tu travailles pour REMÉDIA, une plateforme qui démocratise l'accès aux plantes médicinales africaines en combinant savoirs traditionnels et validation scientifique.

RÉPONDEZ MAINTENANT:"""
        
        # Combiner système + user prompt
        full_prompt = f"{system_prompt}\n\n{prompt}"
        
        # Retry loop
        for attempt in range(max_retries):
            try:
                logger.info(f"🤖 Calling Gemini API (attempt {attempt + 1}/{max_retries})")
                
                # Générer réponse (sync call dans async context)
                response = await asyncio.to_thread(
                    self._model.generate_content,
                    full_prompt
                )
                
                # Extraire texte de la réponse
                if hasattr(response, 'text'):
                    response_text = response.text
                elif hasattr(response, 'parts'):
                    # Si réponse en parties, combiner
                    response_text = ' '.join([part.text for part in response.parts if hasattr(part, 'text')])
                else:
                    # Fallback: convertir en string
                    response_text = str(response)
                
                logger.info(f"✅ Gemini response received ({len(response_text)} chars)")
                
                # CRITIQUE: Retourner STRING, pas dict
                return response_text
                
            except Exception as e:
                logger.warning(f"⚠️ Gemini attempt {attempt + 1} failed: {str(e)}")
                
                if attempt < max_retries - 1:
                    # Attendre avant retry (exponential backoff)
                    wait_time = 2 ** attempt  # 1s, 2s, 4s
                    logger.info(f"⏳ Retrying in {wait_time}s...")
                    await asyncio.sleep(wait_time)
                else:
                    # Toutes tentatives échouées
                    logger.error(f"❌ All Gemini attempts failed: {str(e)}")
                    raise Exception(f"Erreur Gemini après {max_retries} tentatives: {str(e)}")
    
    async def identify_plant(self, image_data: bytes, prompt: Optional[str] = None) -> str:
        """
        Identifier une plante depuis une image
        
        Args:
            image_data: Bytes de l'image
            prompt: Prompt additionnel optionnel
            
        Returns:
            str: Identification de la plante
        """
        if not self._configured:
            raise ValueError("Gemini API non configurée")
        
        try:
            # Prompt système pour identification
            system_prompt = """Tu es un expert botaniste spécialisé dans les plantes médicinales africaines.

MISSION:
Identifie la plante dans cette image et fournis:
1. Nom scientifique (latin)
2. Noms communs (français + locaux africains)
3. Famille botanique
4. Usages médicinaux traditionnels
5. Propriétés médicinales validées scientifiquement
6. Préparation recommandée
7. Dosage sûr
8. Précautions et contre-indications

FORMAT:
Utilise emojis (🌿 pour le nom, 💊 pour usages, ⚠️ pour précautions).
Structure en sections claires.

IMPORTANT:
- Si l'identification est incertaine, le dire clairement
- Si la plante est toxique, l'indiquer en GRAS
- Toujours mentionner de consulter un expert en cas de doute

RÉPONDEZ MAINTENANT:"""
            
            full_prompt = system_prompt
            if prompt:
                full_prompt += f"\n\nContexte additionnel: {prompt}"
            
            # Préparer image pour Gemini
            from PIL import Image
            import io
            
            image = Image.open(io.BytesIO(image_data))
            
            # Générer avec image
            logger.info("🔍 Identifying plant with Gemini Vision...")
            response = await asyncio.to_thread(
                self._model.generate_content,
                [full_prompt, image]
            )
            
            # Extraire texte
            if hasattr(response, 'text'):
                response_text = response.text
            else:
                response_text = str(response)
            
            logger.info(f"✅ Plant identified ({len(response_text)} chars)")
            
            # CRITIQUE: Retourner STRING
            return response_text
            
        except Exception as e:
            logger.error(f"❌ Plant identification failed: {str(e)}")
            raise Exception(f"Erreur identification plante: {str(e)}")
    
    @lru_cache(maxsize=100)
    def get_cached_plant_info(self, plant_name: str) -> Optional[Dict[str, Any]]:
        """
        Cache pour infos plantes fréquemment demandées
        
        Note: Utilise lru_cache pour éviter appels API répétés
        """
        # TODO: Implémenter cache Redis en production
        return None


# Singleton instance
gemini_service = GeminiService()


# Export pour imports directs
__all__ = ['gemini_service', 'GeminiService']