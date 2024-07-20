import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    console.log("isAuthenticated: ", isAuthenticated);
  }, [isAuthenticated])

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  const validateToken = async (token: string) => {
    try {
      // Add token validation logic here (backend call, etc.)
      console.log("Token validated successfully");
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token validation failed', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const token = getCookie('authToken');
    if (token) {
      console.log("Token found, validating...");
      validateToken(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
