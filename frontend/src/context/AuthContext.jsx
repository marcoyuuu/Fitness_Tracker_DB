import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { setAuthToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(localStorage.getItem('access') || null);

  useEffect(() => {
    setAuthToken(access);
    if (access) {
      api.get('/users/me').then(({ data }) => setUser(data)).catch(() => {
        setUser(null);
        setAccess(null);
        localStorage.removeItem('access');
      });
    }
  }, [access]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAccess(data.access);
    localStorage.setItem('access', data.access);
    setAuthToken(data.access);
    const me = await api.get('/users/me');
    setUser(me.data);
  };

  const register = async (email, password, name) => {
    const { data } = await api.post('/auth/register', { email, password, name });
    setAccess(data.access);
    localStorage.setItem('access', data.access);
    setAuthToken(data.access);
    const me = await api.get('/users/me');
    setUser(me.data);
  };

  const logout = () => {
    setUser(null);
    setAccess(null);
    localStorage.removeItem('access');
    setAuthToken(null);
  };

  const value = useMemo(() => ({ user, access, login, register, logout }), [user, access]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
