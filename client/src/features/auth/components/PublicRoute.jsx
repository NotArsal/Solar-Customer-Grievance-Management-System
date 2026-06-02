import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role === 'admin' || user.role === 'superadmin') {
        return <Navigate to="/admin" replace />;
      }
      if (user.role === 'employee') {
        return <Navigate to="/employee" replace />;
      }
      if (user.role === 'customer') {
        return <Navigate to="/portal" replace />;
      }
    } catch (error) {
      // If parsing fails, just clear it and render the public route
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }

  return children;
};

export default PublicRoute;
