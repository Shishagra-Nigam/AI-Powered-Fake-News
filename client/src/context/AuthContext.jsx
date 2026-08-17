import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginApi, registerApi, getMeApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('veritas_jwt_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await getMeApi();
          if (res.user) {
            setUser(res.user);
          }
        } catch (err) {
          console.warn('[AUTH] Saved session invalid or expired.');
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    if (data.token) {
      localStorage.setItem('veritas_jwt_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await registerApi(userData);
    if (data.token) {
      localStorage.setItem('veritas_jwt_token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('veritas_jwt_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
