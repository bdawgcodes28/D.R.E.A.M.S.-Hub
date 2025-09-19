import { Navigate } from "react-router-dom";
import { useUser } from "./context_provider";



const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  // If no user, send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
