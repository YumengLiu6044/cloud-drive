from datetime import timedelta, datetime, UTC
from typing import Optional, Annotated

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from passlib.hash import sha256_crypt
from jose import jwt, JWTError, ExpiredSignatureError

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
    def create_access_token(user_email: str, ttl: Optional[timedelta] = None, scope: str=None) -> str:
        expiration = datetime.now(UTC) + (ttl or timedelta(minutes=JWT_TOKEN_EXPIRATION))
        exp_time_string = str(int(expiration.timestamp()))
        to_encode = {
            "sub": user_email,
            "exp": exp_time_string,
            "scope": scope,
        }
        encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return encoded_jwt

    @staticmethod
    def decode_access_token(token: str):
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            return payload
        except ExpiredSignatureError:
            return None
        except JWTError:
            return None

    @staticmethod
    async def get_current_user(token: Annotated[oauth2_scheme, Depends()]):
        user_email = SecurityManager.decode_access_token(token).get("sub")
        if not user_email:
            raise HTTPException(status_code=404, detail="Invalid token")
        return user_email

security_manager = SecurityManager()
