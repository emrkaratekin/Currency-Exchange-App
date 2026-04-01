import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authenticated = await authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    if (authenticated) {
      setEmail(await authService.getEmail());
    }
    setIsLoading(false);
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setIsAuthenticated(true);
    setEmail(response.email);
    return response;
  };

  const register = async (email, password) => {
    const response = await authService.register(email, password);
    setIsAuthenticated(true);
    setEmail(response.email);
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, email, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
