import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('adminUser'));
  return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;