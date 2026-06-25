import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  
  if (userStr) {
    let user;
    try {
      user = JSON.parse(userStr);
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }

    if (user) {
      if (user.role === 'admin' || user.role === 'superadmin') {
        return <Navigate to="/admin" replace />;
      }
      if (user.role === 'employee') {
        return <Navigate to="/employee" replace />;
      }
      if (user.role === 'customer') {
        return <Navigate to="/portal" replace />;
      }
    }
  }

  return children;
};

export default PublicRoute;
