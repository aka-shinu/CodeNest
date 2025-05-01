"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { signIn, signOut } from 'next-auth/react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  signupWithProvider: (provider: 'github' | 'google') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to sign up');
      }

      // After successful signup, log the user in
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/snippets',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithProvider = async (provider: 'github' | 'google') => {
    setIsLoading(true);
    try {
      await signIn(provider, {
        callbackUrl: '/snippets',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut({ callbackUrl: '/' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, signupWithProvider, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 