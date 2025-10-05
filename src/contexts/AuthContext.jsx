import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasValidInvite, setHasValidInvite] = useState(false);
  const [loading, setLoading] = useState(true);

  // Google OAuth Client ID (you'll need to replace this with your actual client ID)
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id';

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('curry2cakes_user');
    const savedInviteStatus = localStorage.getItem('curry2cakes_invite_status');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setHasValidInvite(savedInviteStatus === 'true');
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('curry2cakes_user');
        localStorage.removeItem('curry2cakes_invite_status');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('curry2cakes_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setHasValidInvite(false);
    localStorage.removeItem('curry2cakes_user');
    localStorage.removeItem('curry2cakes_invite_status');
  };

  const validateInviteCode = (code) => {
    // In a real implementation, this would validate against a backend API
    // For demo purposes, we'll use a simple validation
    const validCodes = ['C2C2023', 'SPICY2SWEET', 'EXCLUSIVE2023', 'INNER_CIRCLE'];
    
    if (validCodes.includes(code.toUpperCase())) {
      setHasValidInvite(true);
      localStorage.setItem('curry2cakes_invite_status', 'true');
      return true;
    }
    
    return false;
  };

  const requestInviteCode = async (email) => {
    // This will be implemented in the next phase with GoDaddy email integration
    // For now, return a promise that resolves after a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Invite code request sent! Check your email in a few minutes.'
        });
      }, 2000);
    });
  };

  const value = {
    user,
    isAuthenticated,
    hasValidInvite,
    loading,
    login,
    logout,
    validateInviteCode,
    requestInviteCode,
    GOOGLE_CLIENT_ID
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default AuthContext;
