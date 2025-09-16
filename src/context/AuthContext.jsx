import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import CSS once in your app root (if not already)

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          bio: userData.bio,
          avatar: userData.avatar,
          joinDate: userData.createdAt,
        })
      );

      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        bio: userData.bio,
        avatar: userData.avatar,
        joinDate: userData.createdAt,
      });

      setLoading(false);
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      setLoading(false);
      return false;
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          bio: newUser.bio,
          avatar: newUser.avatar,
          joinDate: newUser.createdAt,
        })
      );

      setUser({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        bio: newUser.bio,
        avatar: newUser.avatar,
        joinDate: newUser.createdAt,
      });

      setLoading(false);
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Signup failed';
      toast.error(errorMessage);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
