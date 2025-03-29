from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional
import logging
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Weather API"
    OPENWEATHER_API_KEY: str
    OPENWEATHER_BASE_URL: str = "http://api.openweathermap.org/data/2.5"
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    
    # Additional settings
    ENVIRONMENT: str = "development"
    WEATHER_API_BASE_URL: str = "https://api.openweathermap.org/data/2.5/weather"
    WEATHER_API_TIMEOUT: int = 10
    WEATHER_API_MAX_RETRIES: int = 3
    
    class Config:
        env_file = "/app/.env"  # Use absolute path in container
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    # Log environment variables (without exposing sensitive data)
    env_file_path = "/app/.env"
    logger.info(f"Loading settings from .env file: {os.path.exists(env_file_path)}")
    logger.info(f"Environment variables present: {list(os.environ.keys())}")
    
    settings = Settings()
    logger.info(f"Settings loaded successfully")
    return settings

settings = get_settings() 