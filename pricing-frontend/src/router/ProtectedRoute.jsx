import { Navigate } from "react-router-dom";

const ROLE_PERMISSIONS = {
  supplier: ["/manage-products", "/price-optimization"],
  buyer: ["/product-listing"],
  admin: ["/manage-products", "/price-optimization", "/product-listing"],
};

export default function ProtectedRoute({ children, requiredRoute = null }) {
  const userId = localStorage.getItem("user_id");
  const userRole = localStorage.getItem("role");

  // Check authentication first
  if (!userId) return <Navigate to="/" replace />;

  // If no specific route required, just check auth (for dashboard)
  if (!requiredRoute) return children;

  // Check role permissions
  const allowedRoutes = ROLE_PERMISSIONS[userRole] || [];

  if (!allowedRoutes.includes(requiredRoute)) {
    const defaultRoute = "/dashboard";
    return <Navigate to={defaultRoute} replace />;
  }

  return children;
}

//latest working code
