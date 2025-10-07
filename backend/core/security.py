from datetime import timedelta, datetime, UTC
from typing import Optional
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from passlib.hash import sha256_crypt
from jose import jwt, JWTError, ExpiredSignatureError
from core.constants import JWT_TOKEN_EXPIRATION, JWT_SECRET_KEY, JWT_ALGORITHM, JwtTokenScope

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
bearer_scheme = HTTPBearer(auto_error=True)

class SecurityManager:
    hasher = sha256_crypt
    jwt_key = JWT_SECRET_KEY
    jwt_algorithm = JWT_ALGORITHM

    def hash_password(self, password):
        return self.hasher.hash(password)

    def verify_password(self, password, hashed_password):
        """
        :param password: The password to verify
        :param hashed_password: The password on file
        :return: If the password is valid
        """
        return self.hasher.verify(password, hashed_password)

    def create_access_token(self, user_email: str, scope: str, ttl: Optional[timedelta] = None) -> str:
        expiration = datetime.now(UTC) + (ttl or timedelta(minutes=JWT_TOKEN_EXPIRATION))
        to_encode = {
            "sub": user_email,
            "exp": expiration,
            "scope": scope,
        }
        print(f"Token payload: {to_encode}")  # --- IGNORE ---
        encoded_jwt = jwt.encode(to_encode, self.jwt_key, algorithm=self.jwt_algorithm)
        return encoded_jwt

    def decode_access_token(self, token: str, require_scope: str):
        try:
            payload = jwt.decode(token, self.jwt_key, algorithms=[self.jwt_algorithm])
            user_email = payload.get("sub")
            scope = payload.get("scope")
            if not user_email or scope != require_scope:
                raise HTTPException(status_code=401, detail="Invalid token. Scope doesn't match")
            return user_email
        except ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Invalid token. Token expired")
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token. Decoding failed")

    def get_current_user(self, credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
        return self.decode_access_token(credentials.credentials, JwtTokenScope.auth)

    def verify_reset_token(self, credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
        return self.decode_access_token(credentials.credentials, JwtTokenScope.password_reset)


security_manager = SecurityManager()
