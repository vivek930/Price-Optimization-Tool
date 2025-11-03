from pydantic import BaseModel, EmailStr
from typing import List, Optional

# Signup input
class SignupIn(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str  # either "buyer" or "supplier"
    
class RefreshIn(BaseModel):
    refresh_token: str

# Login response for OAuth2/Swagger compatibility (includes placeholder token fields)
class LoginResponse(BaseModel):
    user_name: str
    user_id: int
    role: str
    token_type: str = "bearer"
    expires_in: int  # seconds until access token expires

# JSON login response (cleaner, without token fields)
class LoginJsonResponse(BaseModel):
    user_name: str
    user_id: int
    role: str
    expires_in: int  # seconds until access token expires

# Refresh response (for cookie-based refresh)
class RefreshResponse(BaseModel):
    user_name: str
    user_id: int
    role: str
    expires_in: int  # seconds until access token expires
    
# ----- Pydantic Schemas for Product -----
class ProductIn(BaseModel):
    name: str
    description: str
    category: str
    cost_price: float
    selling_price: float
    stock_available: int
    units_sold: int

class ProductOut(BaseModel):
    id: int
    name: str
    description: str
    category: str
    cost_price: float
    selling_price: float
    stock_available: int
    units_sold: int
    optimize_price: float
    demand: int
    selling_price_range: list[float]
    demand_range: list[float]
    owner_id: int

    class Config:
        from_attributes = True
        
# A restricted product view for buyers
class ProductBuyerOut(BaseModel):
    id: int
    category: str
    selling_price: float
    description: str
    stock_available: int

    class Config:
        from_attributes = True