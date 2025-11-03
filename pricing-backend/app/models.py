from sqlalchemy import (
    Column, Integer, String, Boolean, ForeignKey,
    DateTime, Text, Float, UniqueConstraint, Index
)
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ARRAY

class Base(DeclarativeBase):
    pass

# ----- Models -----
class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True, index=True)
    description = Column(String(255), nullable=True)

    # relationship to users and role_permissions
    users = relationship("User", back_populates="role")
    role_permissions = relationship("RolePermission", back_populates="role")

class Permission(Base):
    __tablename__ = "permissions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(String(255), nullable=True)

    role_permissions = relationship("RolePermission", back_populates="permission")

class RolePermission(Base):
    __tablename__ = "role_permissions"
    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("roles.id", ondelete="CASCADE"), nullable=False, index=True)
    permission_id = Column(Integer, ForeignKey("permissions.id", ondelete="CASCADE"), nullable=False, index=True)

    role = relationship("Role", back_populates="role_permissions")
    permission = relationship("Permission", back_populates="role_permissions")

    __table_args__ = (UniqueConstraint("role_id", "permission_id", name="uq_role_permission"),)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id", ondelete="RESTRICT"), nullable=False, index=True)
    is_verified = Column(Boolean, default=True)  # keep True for simple flow
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    role = relationship("Role", back_populates="users")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), index=True, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), index=True, nullable=False)
    cost_price = Column(Float, nullable=False)
    selling_price = Column(Float, nullable=False)
    stock_available = Column(Integer, default=0)
    units_sold = Column(Integer, default=0)
    demand = Column(Integer, default=0)
    optimize_price = Column(Float, nullable=True)
    selling_price_range = Column(ARRAY(Float), nullable=True)
    demand_range = Column(ARRAY(Float), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)

Index("ix_products_category_name", Product.category, Product.name)