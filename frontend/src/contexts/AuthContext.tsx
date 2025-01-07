'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SessionManager = {
  checkSession() {
    const lastActivity = localStorage.getItem('lastActivity');
    const sessionTimeout = 30 * 60 * 1000; // 30 phút
    
    if (lastActivity && Date.now() - parseInt(lastActivity) > sessionTimeout) {
      return false;
    }
    return true;
  },

  updateLastActivity() {
    localStorage.setItem('lastActivity', Date.now().toString());
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = authService.getCurrentUser();
    setUser(user);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, remember: boolean = false) => {
    try {
      const response = await authService.login(email, password, remember);
      
      if (response) {
        const userData = {
          id: response.id,
          email: response.email,
          role: response.role,
          username: response.username,
          is_verify: response.is_verify
        };
        setUser(userData);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return { 
          result: true,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken 
        };
      }
      return { result: false };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/auth/sign-in');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 