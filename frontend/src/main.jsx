import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContext } from './context/AuthContext';
import { clearAuthToken, getAuthToken, setAuthToken } from './services/api';

function base64UrlToBase64(value) {
  return String(value || '')
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(String(value || '').length / 4) * 4, '=');
}

function decodeToken(token) {
  if (!token) return null;

  try {
    const decoded = window.atob(base64UrlToBase64(token));
    const separatorIndex = decoded.lastIndexOf('.');
    if (separatorIndex === -1) return null;
    const payload = JSON.parse(decoded.slice(0, separatorIndex));
    return {
      id: Number(payload.sub),
      email: payload.email,
      role: payload.role || 'user',
    };
  } catch (error) {
    return null;
  }
}

function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getAuthToken());
  const [user, setUser] = useState(() => decodeToken(getAuthToken()));

  useEffect(() => {
    const storedToken = getAuthToken();
    setTokenState(storedToken);
    setUser(decodeToken(storedToken));
  }, []);

  const authValue = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(token),
    login: (nextToken, nextUser) => {
      setAuthToken(nextToken);
      setTokenState(nextToken);
      setUser(nextUser || decodeToken(nextToken));
    },
    register: (nextToken, nextUser) => {
      setAuthToken(nextToken);
      setTokenState(nextToken);
      setUser(nextUser || decodeToken(nextToken));
    },
    logout: () => {
      clearAuthToken();
      setTokenState('');
      setUser(null);
    },
  }), [token, user]);

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
