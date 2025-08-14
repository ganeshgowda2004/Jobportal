import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext({
  token: null,
  role: null,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (role) localStorage.setItem('role', role);
    else localStorage.removeItem('role');
  }, [role]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'token') {
        setToken(e.newValue);
      }
      if (e.key === 'role') {
        setRole(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  const login = useCallback(async (credentials) => {
    const { data } = await apiLogin(credentials);
    setToken(data.token);
    setRole(data.role || null);
    toast.success('Logged in');
    return data.role;
  }, []);

  const signup = useCallback(async (payload) => {
    await apiRegister(payload);
    toast.success('Registered successfully');
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setRole(null);
    toast.success('Logged out');
  }, []);

  const value = useMemo(() => ({ token, role, isAuthenticated, login, signup, logout }), [token, role, isAuthenticated, login, signup, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}