"""
Hashing and JWT token helpers. Two tokens are created:
- access token (short lived)
- refresh token (longer lived)

Both are JWTs signed with SECRET_KEY from settings.
"""

from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any
from jose import jwt, JWTError, ExpiredSignatureError
from .settings import settings

ALGORITHM = settings.ALGORITHM

def create_access_token(subject: str, role: str, permissions: List[str]) -> str:
    """
    Create a short-lived access token.
    Embed subject (email), role, and permissions so frontend can also decode info (if needed).
    """
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=int(settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload: Dict[str, Any] = {
        "sub": subject,
        "role": role,
        "permissions": permissions,
        "type": "access",
        "exp": int(expire.timestamp())
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(subject: str) -> str:
    """
    Create a long-lived refresh token.
    Only embed subject and token type.
    """
    expire = datetime.now(timezone.utc) + timedelta(
        days=int(settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    payload = {
        "sub": subject,
        "type": "refresh",
        "exp": int(expire.timestamp())
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    """
    Decode and verify a JWT. 
    Raises ExpiredSignatureError if expired, JWTError for invalid tokens.
    """
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
    except ExpiredSignatureError:
        raise JWTError("Token has expired")
    except JWTError as e:
        raise JWTError(f"Invalid token: {str(e)}")
