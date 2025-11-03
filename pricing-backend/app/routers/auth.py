# Debug version of auth.py with extensive logging
"""
Authentication endpoints - Cookie debugging version
"""

from fastapi import APIRouter, Depends, HTTPException, status, Body, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime

from ..db import get_db, User, Role, get_permissions_for_role, hash_password
from ..schemas import SignupIn, LoginResponse, LoginJsonResponse, RefreshResponse
from ..security import create_access_token, create_refresh_token, decode_token
from ..settings import settings
from passlib.context import CryptContext

router = APIRouter()

# Cookie settings - very permissive for debugging
COOKIE_SETTINGS = {
    "httponly": True,
    "secure": False,  # Must be False for HTTP
    "samesite": 'lax',  # Most permissive
    "path": "/",
}

@router.post("/signup", status_code=201)
def signup(payload: SignupIn, db: Session = Depends(get_db)):
    if payload.role not in ("buyer", "supplier"):
        raise HTTPException(status_code=400, detail="Role must be 'buyer' or 'supplier'")

    exists = db.query(User).filter(User.email == payload.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Email already registered")

    role_obj = db.query(Role).filter(Role.name == payload.role).first()
    if not role_obj:
        raise HTTPException(status_code=500, detail=f"Role '{payload.role}' not found in DB. Please run bootstrap.")

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role_id=role_obj.id,
        is_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Signup complete. Please log in to continue."}

@router.post("/login", response_model=LoginJsonResponse)
def login_json(
    response: Response,
    credentials: dict = Body(...),
    db: Session = Depends(get_db)
):    
    email = credentials.get("email")
    password = credentials.get("password")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    if not pwd_context.verify(password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    role = db.query(Role).filter(Role.id == user.role_id).first()
    permissions = get_permissions_for_role(db, user.role_id)

    access_token = create_access_token(subject=user.email, role=role.name, permissions=permissions)
    refresh_token = create_refresh_token(subject=user.email)

    # Set cookies with debugging
    access_max_age = int(settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    refresh_max_age = int(settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60)
    
    try:
        response.set_cookie(
            key="access_token",
            value=access_token,
            max_age=access_max_age,
            **COOKIE_SETTINGS
        )
        print("LOGIN-JSON: Access token cookie set")
        
        response.set_cookie(
            key="refresh_token", 
            value=refresh_token,
            max_age=refresh_max_age,
            **COOKIE_SETTINGS
        )
        print("LOGIN-JSON: Refresh token cookie set")
        
        # Add debug response headers
        response.headers["X-Debug-Cookies-Set"] = "true"
        
    except Exception as e:
        response.headers["X-Debug-Cookie-Error"] = str(e)

    expires_in = access_max_age

    return {
        "user_name": user.name,
        "user_id": user.id,
        "role": role.name,
        "expires_in": expires_in
    }

@router.post("/refresh", response_model=RefreshResponse)
def refresh_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):    
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token not found in cookies")

    try:
        data = decode_token(refresh_token)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    if data.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Token is not a refresh token")

    email = data.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    role = db.query(Role).filter(Role.id == user.role_id).first()
    permissions = get_permissions_for_role(db, user.role_id)

    new_access_token = create_access_token(subject=user.email, role=role.name, permissions=permissions)
    new_refresh_token = create_refresh_token(subject=user.email)
    
    # Set new cookies
    access_max_age = int(settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    refresh_max_age = int(settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60)
    
    try:
        response.set_cookie(
            key="access_token",
            value=new_access_token,
            max_age=access_max_age,
            **COOKIE_SETTINGS
        )
        response.set_cookie(
            key="refresh_token",
            value=new_refresh_token,
            max_age=refresh_max_age,
            **COOKIE_SETTINGS
        )
        print("REFRESH: New cookies set successfully")
    except Exception as e:
        print(f"REFRESH: Error setting new cookies: {e}")
    
    expires_in = access_max_age

    return {
        "user_name": user.name,
        "user_id": user.id,
        "role": role.name,
        "expires_in": expires_in
    }