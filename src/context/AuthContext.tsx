import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';
import type { User, AuthResponse, LoginDto, RegisterDto } from '../types/user';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (loginDto: LoginDto) => Promise<void>;
  signup: (registerDto: RegisterDto) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user: User = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  };

  const login = async (loginDto: LoginDto): Promise<void> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', loginDto);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const signup = async (registerDto: RegisterDto): Promise<void> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/signup', registerDto);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    // Clear state first
    setCurrentUser(null);
    // Then clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Navigate to home after state is cleared
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 0);
  };

  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';

  const value: AuthContextType = {
    currentUser,
    isAuthenticated,
    isAdmin,
    login,
    signup,
    logout,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
