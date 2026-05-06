import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  token: '',
  login: () => {},
  register: () => {},
  logout: () => {},
});
