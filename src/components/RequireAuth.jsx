import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="page-loader-wrap"><div className="page-loader">Checking your account…</div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default RequireAuth;
