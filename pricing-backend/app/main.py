from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from app.routers import products
from .db import engine, bootstrap
from app.models import Base
from .routers import auth  # register router(s)

origins = [
    "http://localhost:3000",   # React dev server - EXACT match required
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    # This code runs once at startup
    # 1) create tables (if they do not exist)
    Base.metadata.create_all(bind=engine)
    # 2) seed roles/permissions/admin (idempotent)
    bootstrap()
    yield
    # on shutdown you could close connections or cleanup
    print("Shutting down app...")

app = FastAPI(title="PriceOptimizer", lifespan=lifespan)

# CORS configuration for cookies - debug version
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Essential for cookies
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "Cookie"
    ],
    expose_headers=[
        "Set-Cookie",
        "X-Debug-Cookies-Set",
        "X-Debug-Cookie-Error"
    ]
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(products.router, prefix="/products", tags=["products"])

@app.get("/")
def root():
    return {"ok": True}