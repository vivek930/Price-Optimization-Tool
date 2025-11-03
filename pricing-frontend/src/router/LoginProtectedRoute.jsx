import { Navigate } from "react-router-dom";

export default function LoginProtectedRoute({ children }) {
  const userId = localStorage.getItem("user_id");

  // If authenticated, redirect to dashboard
  if (userId) return <Navigate to="/dashboard" replace />;

  return children;
}
