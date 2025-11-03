"""
Database models and startup seeder.

- Defines Role, Permission, RolePermission, User (and Product as example)
- Contains SessionLocal and get_db() dependency
- bootstrap() seeds roles, permissions, and a single admin user (idempotent)
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.constant import DEFAULT_PERMISSIONS, DEFAULT_ROLES, ROLE_PERMISSION_MAP
from .settings import settings
from passlib.context import CryptContext
from app.models import Permission, Role, RolePermission, User

# Password hashing helper (used in bootstrap)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# SQLAlchemy engine & session
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# ----- Utility helpers -----
def get_db():
    """DB dependency for FastAPI endpoints. Use `db = next(get_db())` or Depends(get_db)."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)

# ----- Permission lookups -----
def get_permissions_for_role(db, role_id: int):
    """
    Return a list of permission names for a given role_id.
    """
    perms = db.query(Permission.name).join(RolePermission, RolePermission.permission_id == Permission.id)\
        .filter(RolePermission.role_id == role_id).all()
    return [p[0] for p in perms]

# ----- Bootstrap seeder (idempotent) -----

def bootstrap():
    """
    Idempotent function to seed required roles, permissions, mappings, and a single admin user.
    Run at app startup. Safe to run multiple times.
    """
    with SessionLocal() as db:
        # 1) create roles if missing
        existing_roles = {r.name: r for r in db.query(Role).all()}
        for rn in DEFAULT_ROLES:
            if rn not in existing_roles:
                db.add(Role(name=rn))
        db.commit()
        existing_roles = {r.name: r for r in db.query(Role).all()}

        # 2) create permissions if missing
        existing_perms = {p.name: p for p in db.query(Permission).all()}
        for pn in DEFAULT_PERMISSIONS:
            if pn not in existing_perms:
                db.add(Permission(name=pn))
        db.commit()
        existing_perms = {p.name: p for p in db.query(Permission).all()}

        # 3) map role -> permissions
        for role_name, perm_list in ROLE_PERMISSION_MAP.items():
            role = existing_roles.get(role_name)
            if not role:
                continue
            for perm_name in perm_list:
                perm = existing_perms.get(perm_name)
                if not perm:
                    continue
                # check if mapping exists
                exists = db.query(RolePermission).filter_by(role_id=role.id, permission_id=perm.id).first()
                if not exists:
                    db.add(RolePermission(role_id=role.id, permission_id=perm.id))
        db.commit()

        # 4) create admin user if not exists (password hashed)
        admin = db.query(User).filter_by(email=settings.ADMIN_EMAIL).first()
        if not admin:
            admin_role = existing_roles.get("admin")
            if not admin_role:
                raise RuntimeError("Admin role missing in bootstrap")
            admin_user = User(
                name="Admin",
                email=settings.ADMIN_EMAIL,
                password_hash=hash_password(settings.ADMIN_PASSWORD),
                role_id=admin_role.id,
                is_verified=True
            )
            db.add(admin_user)
            db.commit()
            print(f"[BOOTSTRAP] Admin created: {settings.ADMIN_EMAIL} (please change password in production)")
