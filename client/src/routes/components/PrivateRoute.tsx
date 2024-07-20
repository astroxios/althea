import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext';

type PrivateRouteProps = {
  element: ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }): ReactElement => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;