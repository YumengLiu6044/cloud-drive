import base64
from dotenv import load_dotenv
from fastapi_mail import ConnectionConfig

load_dotenv()

from enum import Enum
import os

# Database Config
DATABASE_URL = os.getenv("MONGO_DB_URI")
DATABASE_NAME = "cloud-drive-data"

class COLLECTIONS(str, Enum):
    USERS = "users"

# Password Config
PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 32

# JWT Config
JWT_TOKEN_EXPIRATION = 60 # The expiration time in minutes
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"

class JWT_TOKEN_SCOPES(str, Enum):
    auth = "auth"
    password_reset = "password_reset"

# Email Config
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_SERVER = "smtp.gmail.com"

MAIL_CONFIG = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_SERVER=MAIL_SERVER,
    MAIL_PORT=587,
    MAIL_FROM=MAIL_USERNAME,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

# Frontend URL
FRONTEND_URL = os.getenv("FRONTEND_URL")