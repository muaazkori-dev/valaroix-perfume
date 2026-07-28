'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [userOrders, setUserOrders] = useState([]);

  // Mock initial orders for immediate demonstration
  const sampleOrders = [
    {
      id: 'VLX-98241',
      date: '2026-07-26',
      items: [
        { name: 'Valaroix Sauvage Imperial (100ml • 24 Hours+ Extrait)', pricePkr: 6499, size: '100ml', quantity: 1 }
      ],
      totalPkr: 6499,
      status: 'In Transit via DHL Express',
      trackingCode: 'DHL-VAL-88921',
      engraving: 'V.A. 2026'
    }
  ];

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch orders from Supabase or fallback
  useEffect(() => {
    if (user) {
      fetchUserOrders(user.id);
    } else {
      setUserOrders(sampleOrders);
    }
  }, [user]);

  const fetchUserOrders = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setUserOrders(data);
      } else {
        setUserOrders(sampleOrders);
      }
    } catch (e) {
      setUserOrders(sampleOrders);
    }
  };

  // 1-Click Continue with Google
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    if (error) throw error;
    return data;
  };

  // Email / Password Sign Up
  const signUpWithEmail = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    if (error) throw error;
    return data;
  };

  // Email / Password Sign In
  const signInWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  };

  // Sign Out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAccountModalOpen,
        setIsAccountModalOpen,
        userOrders,
        setUserOrders,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
