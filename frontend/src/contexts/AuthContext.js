import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext({
  token: null,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'token') {
        setToken(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  const login = useCallback(async (credentials) => {
    const { data } = await apiLogin(credentials);
    setToken(data.token);
    toast.success('Logged in');
  }, []);

  const signup = useCallback(async (payload) => {
    await apiRegister(payload);
    toast.success('Registered successfully');
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    toast.success('Logged out');
  }, []);

  const value = useMemo(() => ({ token, isAuthenticated, login, signup, logout }), [token, isAuthenticated, login, signup, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}