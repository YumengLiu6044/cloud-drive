import base64
from dotenv import load_dotenv
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
JWT_SECRET_KEY = base64.urlsafe_b64encode(os.urandom(32)).decode()
JWT_ALGORITHM = "HS256"