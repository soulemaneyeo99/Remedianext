"""
REMEDIA Backend API v2.0
FastAPI + Gemini AI pour reconnaissance de plantes médicinales africaines

Architecture:
- FastAPI pour l'API REST
- Gemini AI pour reconnaissance et chat
- MongoDB/JSON pour base de données plantes
- CORS configuré pour production Vercel
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
import logging
import time
from pathlib import Path
from typing import Callable

from app.core.config import settings
from app.api.v1 import scan, chat, plants

# ============================================
# CONFIGURATION LOGGING
# ============================================
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
    ]
)
logger = logging.getLogger(__name__)

# ============================================
# CRÉATION APPLICATION FASTAPI
# ============================================
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="API pour la reconnaissance de plantes médicinales avec IA",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    # Métadonnées pour documentation
    contact={
        "name": "REMEDIA Team",
        "email": "contact@remedia.africa",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# ============================================
# MIDDLEWARE 1: CORS (EN PREMIER - CRITIQUE!)
# ============================================
# Configuration CORS complète pour production
app.add_middleware(
    CORSMiddleware,
    # Origines autorisées (production + développement)
    allow_origins=[
        "http://localhost:3000",              # Dev local
        "http://localhost:3001",              # Dev alternatif
        "https://remedianext.vercel.app",     # Production Vercel
        "https://remediav2.vercel.app",       # Production Vercel v2
        "https://*.vercel.app",               # Previews Vercel
        "https://remedia-henna.vercel.app",   # Ancien domaine (si encore utilisé)
        "https://remedianext-*.vercel.app",   # Pattern previews
    ],
    # Autoriser les credentials (cookies, auth)
    allow_credentials=True,
    # Méthodes HTTP autorisées
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    # Headers autorisés (important pour Content-Type)
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "User-Agent",
        "DNT",
        "Cache-Control",
        "X-Requested-With",
    ],
    # Headers exposés au client
    expose_headers=[
        "Content-Length",
        "Content-Range",
        "X-Process-Time",
    ],
    # Cache preflight requests (1 heure)
    max_age=3600,
)

# ============================================
# MIDDLEWARE 2: LOGGING PERSONNALISÉ
# ============================================
class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware pour logger toutes les requêtes HTTP.
    
    CRITIQUE: Ignore les requêtes OPTIONS pour ne pas bloquer CORS!
    """
    
    async def dispatch(self, request: Request, call_next: Callable):
        # ✅ CRITIQUE: Laisser passer OPTIONS immédiatement
        # Sans logging ni validation, pour que CORS puisse répondre
        if request.method == "OPTIONS":
            return await call_next(request)
        
        # Pour les autres méthodes, logger normalement
        start_time = time.time()
        
        # Log requête entrante
        logger.info(
            f"➡️  {request.method} {request.url.path} "
            f"from {request.client.host if request.client else 'unknown'}"
        )
        
        try:
            # Traiter la requête
            response = await call_next(request)
            
            # Calculer temps de traitement
            process_time = time.time() - start_time
            
            # Log réponse
            status_emoji = "✅" if response.status_code < 400 else "❌"
            logger.info(
                f"{status_emoji} {request.method} {request.url.path} → "
                f"{response.status_code} ({process_time:.3f}s)"
            )
            
            # Ajouter header temps de traitement
            response.headers["X-Process-Time"] = f"{process_time:.3f}"
            
            return response
            
        except Exception as e:
            # Log erreur
            process_time = time.time() - start_time
            logger.error(
                f"💥 {request.method} {request.url.path} → "
                f"ERROR: {str(e)} ({process_time:.3f}s)"
            )
            raise

# Ajouter le middleware logging
app.add_middleware(RequestLoggingMiddleware)

# ============================================
# MIDDLEWARE 3: SÉCURITÉ (Optionnel)
# ============================================
# Ajout headers de sécurité
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Ajoute des headers de sécurité aux réponses"""
    # Skip pour OPTIONS
    if request.method == "OPTIONS":
        return await call_next(request)
    
    response = await call_next(request)
    
    # Headers de sécurité
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    
    return response

# ============================================
# INCLUSION DES ROUTES API
# ============================================
app.include_router(
    scan.router,
    prefix="/api/v1",
    tags=["scan"]
)
app.include_router(
    chat.router,
    prefix="/api/v1",
    tags=["chat"]
)
app.include_router(
    plants.router,
    prefix="/api/v1",
    tags=["plants"]
)

# ============================================
# ROUTES SYSTÈME
# ============================================

@app.get("/", tags=["system"])
async def root():
    """
    🏠 Endpoint racine - Informations sur l'API
    
    Retourne les informations générales sur l'API REMEDIA
    et les endpoints disponibles.
    """
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "operational",
        "description": "API pour la reconnaissance et l'information sur les plantes médicinales africaines",
        "documentation": {
            "swagger": f"{request.url}docs",
            "redoc": f"{request.url}redoc",
            "openapi": f"{request.url}openapi.json"
        },
        "endpoints": {
            "health": "/health",
            "scan": "/api/v1/scan",
            "chat": "/api/v1/chat",
            "plants": "/api/v1/plants"
        },
        "features": [
            "🔍 Reconnaissance de plantes par IA (Gemini Vision)",
            "💬 Assistant médical conversationnel",
            "📚 Base de données de plantes médicinales (150+)",
            "✅ Validation scientifique",
            "🌍 Focus plantes médicinales africaines"
        ],
        "links": {
            "frontend": "https://remedianext.vercel.app",
            "github": "https://github.com/votre-repo/remedia",
            "docs": "https://docs.remedia.africa"
        }
    }

@app.get("/health", tags=["system"])
async def health_check():
    """
    ❤️ Health Check - Vérifie la santé de l'application
    
    Retourne le statut de tous les services et composants.
    """
    # Vérifier configuration Gemini
    gemini_configured = bool(settings.gemini_api_key)
    
    # Statut global
    all_healthy = gemini_configured
    
    return {
        "status": "healthy" if all_healthy else "degraded",
        "timestamp": time.time(),
        "environment": settings.environment,
        "version": settings.app_version,
        "services": {
            "api": "operational",
            "gemini": "operational" if gemini_configured else "not_configured",
            "scan": "operational" if gemini_configured else "degraded",
            "chat": "operational" if gemini_configured else "degraded",
            "plants": "operational"
        },
        "config": {
            "gemini_configured": gemini_configured,
            "gemini_model": settings.gemini_model if gemini_configured else None,
            "debug_mode": settings.debug
        }
    }

@app.get("/test-gemini", tags=["system"])
async def test_gemini():
    """
    🧪 Test Gemini - Teste la connexion à l'API Gemini
    
    Vérifie que la clé API Gemini est configurée et fonctionnelle.
    """
    try:
        # Vérifier que la clé existe
        if not settings.gemini_api_key:
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "message": "❌ Clé API Gemini non configurée",
                    "help": "Ajoutez GEMINI_API_KEY dans votre fichier .env ou variables d'environnement",
                    "documentation": "https://ai.google.dev/gemini-api/docs/api-key"
                }
            )
        
        # Test simple avec Gemini
        from app.services.gemini_service import gemini_service
        
        logger.info("🧪 Test de connexion Gemini...")
        result = await gemini_service.chat_medical("Test de connexion - répondre juste 'OK'")
        
        return {
            "success": True,
            "message": "✅ Connexion Gemini fonctionnelle",
            "model": settings.gemini_model,
            "response_preview": result[:100] + "..." if len(result) > 100 else result,
            "timestamp": time.time()
        }
        
    except Exception as e:
        logger.error(f"❌ Erreur test Gemini: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e),
                "message": "❌ Erreur de connexion à Gemini",
                "help": "Vérifiez que votre clé API est valide et que vous avez accès à l'API Gemini"
            }
        )

@app.get("/stats", tags=["system"])
async def get_stats():
    """
    📊 Statistiques - Métriques de l'API
    
    Retourne des statistiques d'utilisation (à implémenter avec Redis/DB).
    """
    # TODO: Implémenter avec vraies métriques depuis Redis
    return {
        "total_scans": 3456,
        "total_chats": 12789,
        "plants_database": 150,
        "uptime_hours": 720,
        "avg_response_time_ms": 234,
        "success_rate_percent": 98.5,
        "note": "Données temps réel à implémenter avec Redis"
    }

# ============================================
# GESTIONNAIRES D'ERREURS
# ============================================

@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    """Handler pour erreurs 404"""
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "error": "Not Found",
            "message": f"L'endpoint {request.url.path} n'existe pas",
            "available_endpoints": [
                "/docs",
                "/api/v1/scan",
                "/api/v1/chat",
                "/api/v1/plants"
            ]
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    """Handler pour erreurs 500"""
    logger.error(f"💥 Erreur interne: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal Server Error",
            "message": "Une erreur interne est survenue",
            "details": str(exc) if settings.debug else None
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Gestionnaire d'erreurs global
    
    Capture toutes les exceptions non gérées pour éviter les crashes.
    """
    logger.error(f"💥 Erreur non gérée: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Erreur interne du serveur",
            "message": str(exc) if settings.debug else "Une erreur inattendue est survenue",
            "timestamp": time.time(),
            "path": request.url.path,
            "method": request.method
        }
    )

# ============================================
# ÉVÉNEMENTS LIFECYCLE
# ============================================

@app.on_event("startup")
async def startup_event():
    """Exécuté au démarrage de l'application"""
    logger.info("🚀 REMEDIA API Starting...")
    logger.info(f"📋 Environment: {settings.environment}")
    logger.info(f"📦 Version: {settings.app_version}")
    logger.info(f"🔑 Gemini API: {'✅ Configured' if settings.gemini_api_key else '❌ Not configured'}")
    logger.info(f"🌍 CORS: Enabled for Vercel + localhost")
    logger.info("✅ REMEDIA API Started Successfully!")

@app.on_event("shutdown")
async def shutdown_event():
    """Exécuté à l'arrêt de l'application"""
    logger.info("🛑 REMEDIA API Shutting down...")
    # Cleanup si nécessaire (fermer connexions DB, etc.)
    logger.info("✅ REMEDIA API Stopped")

# ============================================
# POINT D'ENTRÉE
# ============================================

if __name__ == "__main__":
    import uvicorn
    
    logger.info("🚀 Starting REMEDIA API via uvicorn...")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info",
        access_log=True,
        use_colors=True,
    )