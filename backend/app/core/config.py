from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")
    DATABASE_URL: str = "sqlite:///./app.db"
    STORAGE_ROOT: str = "./storage"
    HST_RATE: float = 0.13
    CURRENCY: str = "CAD"
    AP_EMAIL: str | None = None
    PDF_BRAND_LOGO: str | None = None


settings = Settings()
