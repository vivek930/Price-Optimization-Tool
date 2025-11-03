CATEGORY_PED = { "Electronics": -1.3, "Furniture": -1.1, "Home Decor": -1.8, "Fashion": -2.0, "Beauty": -1.6, "Groceries": -0.5, "Books": -1.2, "Sports": -1.4 }
DEFAULT_ROLES = ["admin", "buyer", "supplier"]
DEFAULT_PERMISSIONS = [
    "product:create",
    "product:read",
    "product:update",
    "product:delete"
]
ROLE_PERMISSION_MAP = {
    "admin": DEFAULT_PERMISSIONS,
    "supplier": ["product:create", "product:read", "product:update"],
    "buyer": ["product:read"]
}