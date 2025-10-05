from dotenv import load_dotenv
load_dotenv()

from enum import Enum
import os

# Database Config
DATABASE_URL = os.getenv("MONGO_DB_URI")
DATABASE_NAME = "cloud-drive-data"

class COLLECTIONS(str, Enum):
    USERS = "users"

class USER_FIELDS(str, Enum):
    EMAIL = "email"
    PASSWORD = "password"
    USERNAME = "username"


# Password Config
PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 32