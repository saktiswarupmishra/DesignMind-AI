from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "DesignMind AI Service"
    ENVIRONMENT: str = "development"
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5000"

    class Config:
        env_file = ".env"


settings = Settings()
