import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';
import { parseJwt } from '../utils/jwtHelper'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const verifySession = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsInitializing(false);
        return;
      }

      const res = await apiClient.get('/auth/me'); 
      
      if (res.data.success) {
        const userWithFreshPerms = {
          ...res.data.data,
          permissions: res.data.data.permissions || []
        };

        setUser(userWithFreshPerms);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
    };

    window.addEventListener('auth:logout', handleLogout);
    verifySession();

    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [verifySession]);

  const loginContext = (userData, token) => {
    const tokenPayload = parseJwt(token); 
    const userWithPerms = {
      ...userData,
      permissions: userData.permissions || tokenPayload?.permissions || []
    };

    localStorage.setItem('accessToken', token);
    setUser(userWithPerms);
    setIsAuthenticated(true);
  };

  const logoutContext = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error("Logout API failed, forcing local logout", error);
    } finally {
      window.dispatchEvent(new Event('auth:logout'));
    }
  };

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
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};