'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const GOOGLE_CLIENT_ID = '771679769786-95dd7ibn0qa037vc5p9f3o79j0obgo02.apps.googleusercontent.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Initialize with empty orders array for real users
  const [userOrders, setUserOrders] = useState([]);

  // Check saved patron session on load or URL hash token from Google OAuth
  useEffect(() => {
    try {
      // Check Google OAuth URL response token
      if (window.location.hash.includes('access_token')) {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('access_token');
        if (accessToken) {
          fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
          })
            .then((res) => res.json())
            .then((data) => {
              if (data && data.email) {
                const googleUser = {
                  id: data.sub || 'google-user-' + Date.now(),
                  email: data.email,
                  user_metadata: { full_name: data.name || data.email.split('@')[0] }
                };
                setUser(googleUser);
                localStorage.setItem('valaroix_patron_user', JSON.stringify(googleUser));
                setIsAccountModalOpen(true);
                window.history.replaceState(null, null, window.location.pathname);
              }
            })
            .catch(() => {});
          return;
        }
      }

      // Check local storage for signed in user
      const savedUser = localStorage.getItem('valaroix_patron_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {}
  }, []);

  // Real 1-Click Google OAuth Sign In using official Client ID
  const signInWithGoogle = () => {
    const origin = window.location.origin.replace(/\/$/, '');
    const redirectUri = encodeURIComponent(origin + '/');
    const scope = encodeURIComponent('email profile');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&prompt=select_account`;
    window.location.assign(authUrl);
  };

  // Instant 1-Click VIP Patron Sign In
  const signInAsVIP = (name = 'VIP Patron', email = 'patron@valaroix.com') => {
    const vipUser = {
      id: 'vip-user-99',
      email: email,
      user_metadata: { full_name: name }
    };
    setUser(vipUser);
    localStorage.setItem('valaroix_patron_user', JSON.stringify(vipUser));
    setIsAuthModalOpen(false);
    setIsAccountModalOpen(true);
  };

  // Email / Password Sign Up
  const signUpWithEmail = async (email, password, fullName) => {
    const newUser = {
      id: 'user-' + Date.now(),
      email: email,
      user_metadata: { full_name: fullName || email.split('@')[0] }
    };
    setUser(newUser);
    localStorage.setItem('valaroix_patron_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    setIsAccountModalOpen(true);
    return newUser;
  };

  // Email / Password Sign In
  const signInWithEmail = async (email, password) => {
    const newUser = {
      id: 'user-' + Date.now(),
      email: email,
      user_metadata: { full_name: email.split('@')[0] }
    };
    setUser(newUser);
    localStorage.setItem('valaroix_patron_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    setIsAccountModalOpen(true);
    return newUser;
  };

  // Sign Out
  const signOut = () => {
    setUser(null);
    setSession(null);
    setUserOrders([]);
    localStorage.removeItem('valaroix_patron_user');
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
        signInAsVIP,
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
