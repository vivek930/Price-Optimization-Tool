# Central place for config values read from the .env file.
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int  # short-lived access token
    REFRESH_TOKEN_EXPIRE_DAYS: int    # refresh token lifetime
    ADMIN_EMAIL: str     # used for bootstrap admin
    ADMIN_PASSWORD: str  # used for bootstrap admin
    APP_NAME: str
    ALGORITHM:str

    class Config:
        env_file = ".env"

settings = Settings()
