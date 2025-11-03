"""
Product CRUD routes.
- Permission protected using role/permissions from JWT access_token
- Buyer: only read
- Supplier: create, read, update (own products)
- Admin: full control
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session

from ..db import get_db
from app.models import User, Product
from ..schemas import ProductBuyerOut, ProductIn, ProductOut
from fastapi.security import OAuth2PasswordBearer

from app.utils import calculate_demand_and_optimal_price, get_current_user_permissions

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
router = APIRouter()

# ----- Routes -----
@router.post("/", response_model=ProductOut)
def create_product(payload: ProductIn, db: Session = Depends(get_db), user_data=Depends(get_current_user_permissions)):
    user, permissions = user_data
    if "product:create" not in permissions:
        raise HTTPException(status_code=403, detail="Not allowed to create products")

    calculated_data = calculate_demand_and_optimal_price(payload.cost_price, payload.selling_price, payload.units_sold, payload.stock_available, payload.category)

    product = Product(
        name=payload.name,
        description=payload.description,
        category=payload.category,
        cost_price=payload.cost_price,
        selling_price=payload.selling_price,
        stock_available=payload.stock_available,
        units_sold=payload.units_sold,
        owner_id=user.id,
        demand=calculated_data["optimized"]["demand"],
        optimize_price=calculated_data["optimized"]["price"],
        selling_price_range=calculated_data["price"],
        demand_range=calculated_data["demand"]
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, payload: ProductIn, db: Session = Depends(get_db), user_data=Depends(get_current_user_permissions)):
    user, permissions = user_data
    if "product:update" not in permissions:
        raise HTTPException(status_code=403, detail="Not allowed to update products")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Supplier can only update their own products (admin can update any)
    if user.role.name == "supplier" and product.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Cannot edit products you don't own")

    for field, value in payload.dict().items():
        setattr(product, field, value)
    
    calculated_data = calculate_demand_and_optimal_price(product.cost_price, product.selling_price, product.units_sold, product.stock_available, product.category)
    product.demand = calculated_data["optimized"]["demand"]
    product.optimize_price = calculated_data["optimized"]["price"]
    product.selling_price_range = calculated_data["price"]
    product.demand_range = calculated_data["demand"]
    
    db.commit()
    db.refresh(product)
    return product

@router.get("/user/{user_id}")
def list_products_by_user(
    user_id: int,
    db: Session = Depends(get_db),
    user_data=Depends(get_current_user_permissions),
    # Search parameters
    search: Optional[str] = None,
    
    # Filter parameters
    category: Optional[str] = None,
):
    """
    Fetch products depending on the role of the given user_id:
    - Admin => all products with full details
    - Supplier => only their own products
    - Buyer => restricted product view
    """
    # First check that this user_id exists
    req_user = db.query(User).filter(User.id == user_id).first()
    if not req_user:
        raise HTTPException(status_code=404, detail="User not found")

    role_name = req_user.role.name

    if role_name == "admin":
        # return all products
        query = db.query(Product)
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Product.name.ilike(search_term),
                    Product.description.ilike(search_term)
                )
            )
            
        # Apply filters (if provided)
        if category:
            query = query.filter(Product.category == category)
            
        products = query.all()
        return products

    elif role_name == "supplier":
        # return only products owned by this supplier
        query = db.query(Product).filter(Product.owner_id == user_id)
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Product.name.ilike(search_term),
                    Product.description.ilike(search_term)
                )
            )
            
        # Apply filters (if provided)
        if category:
            query = query.filter(Product.category == category)
            
        products = query.all()
        return products

    elif role_name == "buyer":
        # restricted fields only
        query = db.query(Product)
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Product.name.ilike(search_term),
                    Product.description.ilike(search_term)
                )
            )
            
        # Apply filters (if provided)
        if category:
            query = query.filter(Product.category == category)
            
        products = query.all()
        
        return [
            ProductBuyerOut(
                id=p.id,
                category=p.category,
                selling_price=p.selling_price,
                description=p.description,
                stock_available=p.stock_available
            )
            for p in products
        ]

    else:
        raise HTTPException(status_code=403, detail="Unsupported role")

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), user_data=Depends(get_current_user_permissions)):
    user, permissions = user_data
    if "product:delete" not in permissions:
        raise HTTPException(status_code=403, detail="Not allowed to delete products")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product deleted"}
