import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, businessName: string, password?: string) => Promise<void>;
  updateProfile: (businessName: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUserState = (sessionUser: any) => {
    if (sessionUser) {
      setUser({
        id: sessionUser.id,
        email: sessionUser.email || '',
        business_name: sessionUser.user_metadata?.business_name || 'আমার দোকান'
      });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateUserState(session?.user);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateUserState(session?.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: password || 'password123',
    });
    if (error) throw error;
  };

  const signup = async (email: string, businessName: string, password?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password: password || 'password123',
      options: {
        data: {
          business_name: businessName,
        }
      }
    });
    if (error) throw error;
  };

  const updateProfile = async (businessName: string) => {
    const { data, error } = await supabase.auth.updateUser({
      data: { business_name: businessName }
    });
    if (error) throw error;
    if (data.user) {
      updateUserState(data.user);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, updateProfile, logout, loading }}>
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
