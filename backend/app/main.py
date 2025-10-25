"""
REMEDIA Backend API v2.0
FastAPI + Gemini AI pour reconnaissance de plantes médicinales africaines

Architecture professionnelle:
- FastAPI pour l'API REST haute performance
- Gemini AI pour reconnaissance et chat médical
- Design pattern: Middleware Chain of Responsibility
- CORS: Configuration production-grade
- Logging: Structured logging avec rotation
- Error Handling: Graceful degradation

Author: REMEDIA Team
License: MIT
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
import logging
import time
import sys
from pathlib import Path
from typing import Callable, Optional
from datetime import datetime

from app.core.config import settings
from app.api.v1 import scan, chat, plants

# ============================================
# CONFIGURATION LOGGING PROFESSIONNELLE
# ============================================

class ColoredFormatter(logging.Formatter):
    """Formatter avec couleurs pour meilleure lisibilité en production"""
    
    grey = "\x1b[38;21m"
    blue = "\x1b[38;5;39m"
    yellow = "\x1b[38;5;226m"
    red = "\x1b[38;5;196m"
    bold_red = "\x1b[31;1m"
    reset = "\x1b[0m"

    FORMATS = {
        logging.DEBUG: grey + "%(asctime)s - %(name)s - %(levelname)s - %(message)s" + reset,
        logging.INFO: blue + "%(asctime)s - %(name)s - %(levelname)s - %(message)s" + reset,
        logging.WARNING: yellow + "%(asctime)s - %(name)s - %(levelname)s - %(message)s" + reset,
        logging.ERROR: red + "%(asctime)s - %(name)s - %(levelname)s - %(message)s" + reset,
        logging.CRITICAL: bold_red + "%(asctime)s - %(name)s - %(levelname)s - %(message)s" + reset,
    }

    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt, datefmt='%Y-%m-%d %H:%M:%S')
        return formatter.format(record)

# Configuration handlers
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(ColoredFormatter())

# Logger root
logging.basicConfig(
    level=logging.INFO if settings.environment == "production" else logging.DEBUG,
    handlers=[console_handler],
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)

# ============================================
# CRÉATION APPLICATION FASTAPI
# ============================================

def create_application() -> FastAPI:
    """
    Factory pattern pour créer l'application FastAPI
    Permet testing et configuration flexible
    """
    
    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="🌿 API professionnelle pour la reconnaissance de plantes médicinales avec IA",
        docs_url="/docs" if settings.debug else None,  # Désactiver docs en prod
        redoc_url="/redoc" if settings.debug else None,
        openapi_url="/openapi.json" if settings.debug else None,
        contact={
            "name": "REMEDIA Team",
            "email": "contact@remedia.africa",
            "url": "https://remedia.africa"
        },
        license_info={
            "name": "MIT",
            "url": "https://opensource.org/licenses/MIT",
        },
        # Optimisations production
        swagger_ui_parameters={
            "defaultModelsExpandDepth": -1,
            "displayRequestDuration": True,
            "filter": True,
        }
    )
    
    return application

app = create_application()

# ============================================
# CORS MIDDLEWARE - PREMIÈRE PRIORITÉ
# ============================================

def configure_cors(application: FastAPI) -> None:
    """
    Configuration CORS production-grade
    
    Best practices:
    1. CORS doit être le PREMIER middleware (ordre critique)
    2. Liste explicite d'origines (pas de wildcard * avec credentials)
    3. Cache preflight pour performance
    4. Headers explicites pour sécurité
    """
    
    # Origines autorisées (whitelist stricte)
    allowed_origins = [
        # Développement local
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        
        # Production Vercel
        "https://remedianext.vercel.app",
        "https://remediav2.vercel.app",
        "https://remedia-henna.vercel.app",
    ]
    
    # Ajouter pattern previews Vercel si pas en production stricte
    if settings.environment != "production":
        # Note: FastAPI CORS ne supporte pas vraiment les wildcards complexes
        # En dev, on peut être plus permissif
        allowed_origins.extend([
            "https://remedianext-git-main.vercel.app",
            "https://remediav2-git-main.vercel.app",
        ])
    
    application.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
        allow_headers=[
            "Content-Type",
            "Authorization",
            "Accept",
            "Accept-Language",
            "Origin",
            "User-Agent",
            "DNT",
            "Cache-Control",
            "X-Requested-With",
            "X-CSRF-Token",
        ],
        expose_headers=[
            "Content-Length",
            "Content-Range",
            "Content-Type",
            "X-Process-Time",
            "X-Request-ID",
        ],
        max_age=3600,  # Cache preflight 1h
    )
    
    logger.info("✅ CORS middleware configured")

# Appliquer CORS EN PREMIER
configure_cors(app)

# ============================================
# MIDDLEWARE: REQUEST ID (Traçabilité)
# ============================================

class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Ajoute un ID unique à chaque requête pour traçabilité
    """
    
    async def dispatch(self, request: Request, call_next: Callable):
        # Générer ID unique
        request_id = f"{int(time.time() * 1000)}-{id(request)}"
        request.state.request_id = request_id
        
        # Traiter requête
        response = await call_next(request)
        
        # Ajouter ID dans headers réponse
        response.headers["X-Request-ID"] = request_id
        
        return response

app.add_middleware(RequestIDMiddleware)

# ============================================
# MIDDLEWARE: LOGGING STRUCTURÉ
# ============================================

class StructuredLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware de logging professionnel
    
    Caractéristiques:
    - Skip OPTIONS (ne pas polluer logs avec preflight CORS)
    - Timing précis des requêtes
    - Logging structuré (JSON-compatible)
    - Emojis pour lisibilité humaine
    - Gestion erreurs gracieuse
    """
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
        self.logger = logging.getLogger("remedia.http")
    
    async def dispatch(self, request: Request, call_next: Callable):
        # ✅ CRITIQUE: Ignorer OPTIONS complètement
        # Permet au CORS middleware de gérer sans pollution des logs
        if request.method == "OPTIONS":
            return await call_next(request)
        
        # Extraire infos requête
        method = request.method
        path = request.url.path
        client_host = request.client.host if request.client else "unknown"
        request_id = getattr(request.state, "request_id", "no-id")
        
        # Timer
        start_time = time.perf_counter()
        
        # Log entrée
        self.logger.info(
            f"➡️  {method} {path} | "
            f"from {client_host} | "
            f"id={request_id}"
        )
        
        try:
            # Traiter requête
            response = await call_next(request)
            
            # Calculer durée
            duration_ms = (time.perf_counter() - start_time) * 1000
            
            # Status emoji
            if response.status_code < 300:
                emoji = "✅"
            elif response.status_code < 400:
                emoji = "↪️"
            elif response.status_code < 500:
                emoji = "⚠️"
            else:
                emoji = "❌"
            
            # Log sortie
            self.logger.info(
                f"{emoji} {method} {path} → "
                f"{response.status_code} | "
                f"{duration_ms:.2f}ms | "
                f"id={request_id}"
            )
            
            # Ajouter timing dans headers
            response.headers["X-Process-Time"] = f"{duration_ms:.2f}ms"
            
            return response
            
        except Exception as e:
            # Calculer durée même en cas d'erreur
            duration_ms = (time.perf_counter() - start_time) * 1000
            
            # Log erreur
            self.logger.error(
                f"💥 {method} {path} → "
                f"ERROR: {str(e)[:100]} | "
                f"{duration_ms:.2f}ms | "
                f"id={request_id}",
                exc_info=True
            )
            
            # Re-raise pour error handlers
            raise

app.add_middleware(StructuredLoggingMiddleware)

# ============================================
# MIDDLEWARE: SÉCURITÉ HEADERS
# ============================================

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Ajoute headers de sécurité standards
    
    Best practices OWASP:
    - X-Content-Type-Options: Prévient MIME sniffing
    - X-Frame-Options: Prévient clickjacking
    - X-XSS-Protection: Protection XSS legacy browsers
    - Referrer-Policy: Contrôle fuite info
    """
    
    async def dispatch(self, request: Request, call_next: Callable):
        # Skip OPTIONS (déjà géré par CORS)
        if request.method == "OPTIONS":
            return await call_next(request)
        
        response = await call_next(request)
        
        # Headers sécurité
        response.headers.update({
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "X-Powered-By": "REMEDIA",  # Custom branding
        })
        
        return response

app.add_middleware(SecurityHeadersMiddleware)

# ============================================
# INCLUSION ROUTES API
# ============================================

def register_routers(application: FastAPI) -> None:
    """
    Enregistre tous les routers API
    Organisation modulaire et scalable
    """
    
    # Router scan (reconnaissance plantes)
    application.include_router(
        scan.router,
        prefix="/api/v1",
        tags=["scan"]
    )
    
    # Router chat (assistant médical)
    application.include_router(
        chat.router,
        prefix="/api/v1",
        tags=["chat"]
    )
    
    # Router plants (encyclopédie)
    application.include_router(
        plants.router,
        prefix="/api/v1",
        tags=["plants"]
    )
    
    logger.info("✅ API routers registered")

register_routers(app)

# ============================================
# ROUTES SYSTÈME
# ============================================

@app.get("/", tags=["system"], status_code=status.HTTP_200_OK)
async def root(request: Request):
    """
    🏠 Endpoint racine - Informations API
    
    Retourne métadonnées et découverte endpoints
    """
    base_url = str(request.base_url).rstrip("/")
    
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "operational",
        "environment": settings.environment,
        "timestamp": datetime.utcnow().isoformat(),
        "description": "🌿 API de reconnaissance de plantes médicinales africaines avec IA",
        "documentation": {
            "swagger": f"{base_url}/docs" if settings.debug else None,
            "redoc": f"{base_url}/redoc" if settings.debug else None,
            "openapi": f"{base_url}/openapi.json" if settings.debug else None,
        },
        "endpoints": {
            "health": f"{base_url}/health",
            "scan": f"{base_url}/api/v1/scan",
            "chat": f"{base_url}/api/v1/chat",
            "plants": f"{base_url}/api/v1/plants",
        },
        "features": [
            "🔍 Reconnaissance plantes par IA (Gemini Vision)",
            "💬 Assistant médical conversationnel",
            "📚 Encyclopédie 150+ plantes médicinales",
            "✅ Validation scientifique",
            "🌍 Focus Afrique subsaharienne"
        ],
    }

@app.get("/health", tags=["system"], status_code=status.HTTP_200_OK)
async def health_check():
    """
    ❤️ Health Check - Monitoring
    
    Utilisé par:
    - Railway/Render pour auto-healing
    - Uptime monitors (UptimeRobot, etc.)
    - Load balancers
    """
    gemini_configured = bool(settings.gemini_api_key)
    
    return {
        "status": "healthy" if gemini_configured else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "uptime_seconds": int(time.time() - app.state.start_time),
        "version": settings.app_version,
        "environment": settings.environment,
        "services": {
            "api": "operational",
            "gemini": "operational" if gemini_configured else "not_configured",
            "scan": "operational" if gemini_configured else "degraded",
            "chat": "operational" if gemini_configured else "degraded",
            "plants": "operational",
        },
        "config": {
            "gemini_model": settings.gemini_model if gemini_configured else None,
            "debug_mode": settings.debug,
        }
    }

@app.get("/test-gemini", tags=["system"])
async def test_gemini():
    """
    🧪 Test Gemini - Validation connexion API
    
    pour:
    - Vérifier config en production
    - Diagnostiquer problèmes API
    - CI/CD health checks
    """
    try:
        if not settings.gemini_api_key:
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "success": False,
                    "message": "❌ GEMINI_API_KEY non configurée",
                    "help": "Ajouter GEMINI_API_KEY dans variables d'environnement",
                    "documentation": "https://ai.google.dev/gemini-api/docs/api-key"
                }
            )
        
        from app.services.gemini_service import gemini_service
        
        logger.info("🧪 Testing Gemini API connection...")
        result = await gemini_service.chat_medical("Health check - répondre juste 'OK'")
        
        return {
            "success": True,
            "message": "✅ Gemini API fonctionnelle",
            "model": settings.gemini_model,
            "response_length": len(result),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"❌ Gemini test failed: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": str(e),
                "message": "❌ Erreur connexion Gemini",
                "help": "Vérifier clé API et quotas Gemini"
            }
        )

# ============================================
# ERROR HANDLERS PROFESSIONNELS
# ============================================

@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    """Handler pour erreurs 404 avec aide contextuelle"""
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "success": False,
            "error": "Not Found",
            "message": f"Endpoint {request.url.path} introuvable",
            "suggestion": "Consultez /docs pour la liste complète",
            "available_endpoints": [
                "/",
                "/health",
                "/api/v1/scan",
                "/api/v1/chat",
                "/api/v1/plants"
            ],
            "timestamp": datetime.utcnow().isoformat()
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    """Handler pour erreurs 500 avec tracking"""
    request_id = getattr(request.state, "request_id", "unknown")
    logger.error(f"💥 Internal error (id={request_id}): {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal Server Error",
            "message": "Erreur interne - équipe notifiée",
            "request_id": request_id,
            "timestamp": datetime.utcnow().isoformat(),
            "details": str(exc) if settings.debug else None
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Handler global - Fallback pour toutes exceptions non gérées
    Évite les crashes et assure logging complet
    """
    request_id = getattr(request.state, "request_id", "unknown")
    logger.critical(
        f"💥 Unhandled exception (id={request_id}): {str(exc)}",
        exc_info=True
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Unexpected Error",
            "message": "Une erreur inattendue est survenue",
            "request_id": request_id,
            "path": request.url.path,
            "method": request.method,
            "timestamp": datetime.utcnow().isoformat(),
            "details": str(exc) if settings.debug else "Contact support"
        }
    )

# ============================================
# LIFECYCLE EVENTS
# ============================================

@app.on_event("startup")
async def startup_event():
    """
    Événement démarrage - Initialisation
    
    Best practices:
    - Vérifier config critique
    - Initialiser connexions externes
    - Warmup caches
    - Logger environnement
    """
    app.state.start_time = time.time()
    
    logger.info("=" * 60)
    logger.info("🚀 REMEDIA API STARTING")
    logger.info("=" * 60)
    logger.info(f"📋 Environment: {settings.environment}")
    logger.info(f"📦 Version: {settings.app_version}")
    logger.info(f"🔑 Gemini: {'✅ Configured' if settings.gemini_api_key else '❌ Missing'}")
    logger.info(f"🐛 Debug: {'ON' if settings.debug else 'OFF'}")
    logger.info(f"🌍 CORS: Configured for Vercel + localhost")
    logger.info(f"📊 Logging: Structured with request IDs")
    logger.info("=" * 60)
    logger.info("✅ REMEDIA API READY")
    logger.info("=" * 60)

@app.on_event("shutdown")
async def shutdown_event():
    """
    Événement arrêt - Cleanup gracieux
    
    Best practices:
    - Fermer connexions DB
    - Flush logs
    - Cleanup ressources
    - Logger durée uptime
    """
    uptime = time.time() - app.state.start_time
    
    logger.info("=" * 60)
    logger.info("🛑 REMEDIA API SHUTTING DOWN")
    logger.info(f"⏱️  Uptime: {uptime:.2f} seconds")
    logger.info("=" * 60)

# ============================================
# POINT D'ENTRÉE
# ============================================

if __name__ == "__main__":
    import uvicorn
    import os
    
    # Port dynamique (Railway/Render)
    port = int(os.getenv("PORT", 8000))
    
    logger.info(f"🚀 Starting uvicorn on port {port}...")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=settings.debug,
        log_level="info",
        access_log=False,  # On utilise notre propre logging middleware
        use_colors=True,
        workers=1,  # Single worker pour éviter issues avec state
    )
    