from datetime import timedelta, datetime, UTC
from typing import Optional
from fastapi.security import OAuth2PasswordBearer
from passlib.hash import sha256_crypt
from jose import jwt, JWTError

from core.constants import JWT_TOKEN_EXPIRATION, JWT_SECRET_KEY, JWT_ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

class SecurityManager:
    hasher = sha256_crypt

    def hash_password(self, password):
        return self.hasher.hash(password)

    def verify_password(self, password, hashed_password):
        """
        :param password: The password to verify
        :param hashed_password: The password on file
        :return: If the password is valid
        """
        return self.hasher.verify(password, hashed_password)

    @staticmethod
    def create_access_token(user_email: str, ttl: Optional[timedelta] = None) -> str:
        to_encode = {
            "sub": user_email
        }
        expiration = datetime.now(UTC) + (ttl or timedelta(minutes=JWT_TOKEN_EXPIRATION))
        to_encode["exp"] = str(int(expiration.timestamp()))
        encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return encoded_jwt

    @staticmethod
    def decode_access_token(token: str):
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            return payload
        except JWTError:
            return None



security_manager = SecurityManager()
