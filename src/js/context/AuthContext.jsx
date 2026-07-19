import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, tokenStorage, userStorage } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userStorage.get());
  const [loading, setLoading] = useState(true);

  // On mount: validate stored token with /api/auth/me
  useEffect(() => {
    const validate = async () => {
      const token = tokenStorage.get();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await authApi.me();
        setUser(userData);
        userStorage.set(userData);
      } catch {
        // Token invalid/expired
        tokenStorage.clear();
        userStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    validate();
  }, []);

  const login = useCallback((token, userData) => {
    tokenStorage.set(token);
    userStorage.set(userData);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch (_) {}
    tokenStorage.clear();
    userStorage.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
