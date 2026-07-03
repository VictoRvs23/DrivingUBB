import { useState } from 'react';
import { loginRequest } from '../services/auth.services';
import { AuthContext } from './authContext';

const getTokenPayload = (token) => {
  try {
    const payload = token?.split('.')[1];
    if (!payload) return null;

    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const normalizeUser = (user, token) => {
  if (!user) return null;

  const payload = getTokenPayload(token);
  return {
    ...user,
    id: user.id ?? payload?.id ?? null,
  };
};

const getInitialUser = () => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');

  if (!token || !savedUser) {
    return null;
  }

  return normalizeUser(JSON.parse(savedUser), token);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);
  const loading = false;

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    const normalizedUser = normalizeUser(data.user, data.token);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);

    return normalizedUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
