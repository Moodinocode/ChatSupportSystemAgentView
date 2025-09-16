import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();


  if (loading) return <div></div>; 

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
