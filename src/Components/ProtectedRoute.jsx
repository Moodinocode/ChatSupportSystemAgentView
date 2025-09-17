import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { WebSocketProvider } from "../Context/WebSocketContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();


  if (loading) return <div></div>; 

  return user ? <WebSocketProvider><Outlet /></WebSocketProvider> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
