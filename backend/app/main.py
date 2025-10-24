"""
REMEDIA Backend API v2.0
FastAPI + Gemini AI pour reconnaissance de plantes médicinales africaines
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import logging
import time
from pathlib import Path

from app.core.config import settings
from app.api.v1 import scan, chat, plants

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Créer l'application FastAPI
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="API pour la reconnaissance de plantes médicinales avec IA",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware pour logger les requêtes
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Middleware pour logger toutes les requêtes"""
    start_time = time.time()
    
    # Log de la requête entrante
    logger.info(f"Requête: {request.method} {request.url.path}")
    
    # Traiter la requête
    response = await call_next(request)
    
    # Calculer le temps de traitement
    process_time = time.time() - start_time
    logger.info(f"Réponse: {response.status_code} - Temps: {process_time:.2f}s")
    
    # Ajouter l'en-tête de temps de traitement
    response.headers["X-Process-Time"] = str(process_time)
    
    return response

# Inclure les routes API
app.include_router(scan.router)
app.include_router(chat.router)
app.include_router(plants.router)

# Route racine
@app.get("/")
async def root():
    """
    Endpoint racine - Informations sur l'API
    """
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "operational",
        "description": "API pour la reconnaissance et l'information sur les plantes médicinales africaines",
        "endpoints": {
            "documentation": "/docs",
            "scan": "/api/v1/scan",
            "chat": "/api/v1/chat",
            "plants": "/api/v1/plants"
        },
        "features": [
            "Reconnaissance de plantes par IA (Gemini Vision)",
            "Assistant médical conversationnel",
            "Base de données de plantes médicinales",
            "Validation scientifique"
        ]
    }

# Health check
@app.get("/health")
async def health_check():
    """
    Vérifie la santé de l'application
    """
    return {
        "status": "healthy",
        "environment": settings.environment,
        "gemini_configured": bool(settings.gemini_api_key),
        "services": {
            "scan": "operational",
            "chat": "operational",
            "plants": "operational"
        }
    }

# Route de test Gemini
@app.get("/test-gemini")
async def test_gemini():
    """
    Teste la connexion à l'API Gemini
    """
    try:
        if not settings.gemini_api_key:
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "message": "Clé API Gemini non configurée",
                    "help": "Ajoutez GEMINI_API_KEY dans votre fichier .env"
                }
            )
        
        # Test simple avec Gemini
        from app.services.gemini_service import gemini_service
        result = await gemini_service.chat_medical("Test de connexion")
        
        return {
            "success": True,
            "message": "Connexion Gemini OK",
            "model": settings.gemini_model
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e),
                "message": "Erreur de connexion à Gemini"
            }
        )

# Gestionnaire d'erreurs global
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Gestionnaire d'erreurs global
    """
    logger.error(f"Erreur non gérée: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Erreur interne du serveur",
            "message": str(exc) if settings.debug else "Une erreur est survenue"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
