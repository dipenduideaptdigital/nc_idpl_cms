import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Securely verify user on initial load
  const verifySession = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsInitializing(false);
        return;
      }

      const res = await apiClient.get('/users/me');
      
      if (res.data.success) {
        setUser(res.data.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  // Handle global logout event dispatched by apiClient
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    };

    window.addEventListener('auth:logout', handleLogout);
    
    // Initial verification
    verifySession();

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [verifySession]);

  const loginContext = (userData, token) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logoutContext = async () => {
    try {
      // Inform backend to revoke refresh token
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error("Logout API failed, forcing local logout", error);
    } finally {
      // Force local logout regardless of API success
      window.dispatchEvent(new Event('auth:logout'));
    }
  };

  // Provide a global loading screen while verifying initial session
  if (isInitializing) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};