"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CLIENT' | 'FREELANCER' | 'AGENCY';
  avatarUrl?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  totalEarnings?: number;
  rating?: number;
  totalReviews?: number;
  portfolioUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else if (res.status === 401) {
        // User not authenticated - this is expected
        setUser(null);
      } else {
        // Other errors
        console.error('Auth check error:', res.status, res.statusText);
        setUser(null);
      }
    } catch (error) {
      // API not available - this is OK in development mode
      console.log('API unavailable, but that\'s OK for demo mode');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function register(name: string, email: string, password: string, role: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Registration failed');
      }

      const data = await res.json();
      setUser(data.user);

      // Redirect based on role
      const redirectPath = getRedirectPath(data.user.role);
      router.push(redirectPath);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await res.json();
      setUser(data.user);

      // Redirect based on role
      const redirectPath = getRedirectPath(data.user.role);
      router.push(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function googleLogin(credential: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ credential }),
      });

      if (!res.ok) {
        throw new Error('Google login failed');
      }

      const data = await res.json();
      setUser(data.user);

      // Redirect based on role
      const redirectPath = getRedirectPath(data.user.role);
      router.push(redirectPath);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      router.push('/auth/login');
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

function getRedirectPath(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/dashboard/admin';
    case 'CLIENT':
      return '/dashboard/client';
    case 'FREELANCER':
    case 'AGENCY':
      return '/dashboard/freelancer';
    default:
      return '/';
  }
}
