import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function PrivateRoute( {children} ){
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Loading...</p>; 

return isAuthenticated ? children : <Navigate to="/login" replace />;
}