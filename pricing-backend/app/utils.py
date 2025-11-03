import pandas as pd 
import numpy as np
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer
from app.constant import CATEGORY_PED
from sqlalchemy.orm import Session
from app.db import get_db, User
from app.security import decode_token

# Custom security scheme for cookie-based authentication
security = HTTPBearer(auto_error=False)

def calculate_demand_and_optimal_price(cost_price, selling_price, units_sold, stock, category):
    ped = CATEGORY_PED.get(category, -1.2) 
    price_range = [round(x, 2) for x in np.linspace(selling_price * 0.8, selling_price * 1.2, 20)]
    results = [] 
    for p_new in price_range: 
        q_new = units_sold * (1 + ped * ((p_new - selling_price) / selling_price)) 
        q_new = max(0, min(stock, q_new)) 
        profit = (p_new - cost_price) * q_new 
        results.append({ "Price": p_new, "ForecastDemand": round(q_new, 2), "Profit": round(profit, 2) })
    
    df = pd.DataFrame(results) 
    optimal_row = df.loc[df["Profit"].idxmax()].to_dict()
    model_data = {
        "price": df["Price"].tolist(), # X values 
        "demand": df["ForecastDemand"].tolist(), # Y values
        "optimized": { "price": optimal_row["Price"], "demand": optimal_row["ForecastDemand"], "profit": optimal_row["Profit"] }
    }

    return model_data

# Get verify user and got their permission 
def get_current_user_permissions(
    request: Request, 
    credentials=Depends(security),
    db: Session = Depends(get_db)
):
    """
    Get current user and permissions from either:
    1. HTTP-only cookie (primary method)
    2. Authorization header (fallback for Swagger/API testing)
    """
    token = None
    
    # Try to get token from cookie first
    token = request.cookies.get("access_token")
    
    # If no cookie, try Authorization header (for Swagger compatibility)
    if not token and credentials:
        token = credentials.credentials
    
    if not token:
        raise HTTPException(
            status_code=401, 
            detail="Authentication required. Please login.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    try:
        payload = decode_token(token)
    except Exception as e:
        raise HTTPException(
            status_code=401, 
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=401, 
            detail="Access token required",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code=401, 
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    permissions = payload.get("permissions", [])
    return user, permissions