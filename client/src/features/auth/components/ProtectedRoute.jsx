import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return <Navigate to="/auth" replace />;
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return <Navigate to="/auth" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default ProtectedRoute;
