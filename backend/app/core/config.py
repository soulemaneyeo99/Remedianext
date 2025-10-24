"""
Configuration settings pour REMEDIA Backend
Utilise pydantic-settings pour la validation des variables d'environnement
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Configuration principale de l'application"""
    
    # Application
    app_name: str = "Remedia API"
    app_version: str = "2.0.0"
    debug: bool = True
    environment: str = "development"
    
    # Security
    secret_key: str = "dev-secret-key-change-in-production-32-chars-min"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080
    
    # CORS
    allowed_origins: str = "http://localhost:3000,http://localhost:3001"
    
    # Database
    database_url: str = "sqlite:///./remedia.db"
    
    # API Limits
    max_upload_size: int = 10485760  # 10MB
    rate_limit_per_minute: int = 30
    
    # Gemini API
    gemini_api_key: str = ""
    gemini_model: str = "gemini-1.5-flash"
    gemini_temperature: float = 0.7
    gemini_max_tokens: int = 2048
    
    # ChromaDB
    chroma_persist_directory: str = "./chroma_db"
    chroma_collection_name: str = "remedia_plants"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )
    
    @property
    def cors_origins(self) -> List[str]:
        """Convertit la chaîne CORS en liste"""
        return [origin.strip() for origin in self.allowed_origins.split(",")]


# Instance globale des settings
settings = Settings()
