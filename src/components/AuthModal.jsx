'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.14C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.29A11.967 11.967 0 0 0 0 12c0 1.92.45 3.74 1.29 5.41l3.99-3.14z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.59l3.99 3.14c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, signInWithGoogle, signInAsVIP } = useAuth();
  
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleClick = () => {
    setLoading(true);
    signInWithGoogle();
  };

  const handleInstantVIP = () => {
    signInAsVIP('VALAROIX VIP Patron', 'patron@valaroix.com');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    signInAsVIP(fullName || email.split('@')[0] || 'VIP Patron', email);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-valaroix-dark border border-valaroix-gold/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)] z-10 space-y-5"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full glass-panel text-gray-400 hover:text-valaroix-gold"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full border border-valaroix-gold/60 p-0.5 bg-valaroix-dark mx-auto shadow-lg overflow-hidden">
              <img src="/logo.jpg" alt="VALAROIX Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
              {mode === 'login' ? 'VALAROIX PATRON SIGN IN' : 'SIGN UP FOR VALAROIX'}
            </h3>
            <p className="text-xs text-gray-400 font-light">
              Sign in to view your order history, track shipments, and access VIP Vault discounts.
            </p>
          </div>

          {/* 1-CLICK CONTINUE WITH GOOGLE */}
          <button
            onClick={handleGoogleClick}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-xl border border-gray-200"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          {/* INSTANT 1-CLICK QUICK VIP SIGN IN */}
          <button
            onClick={handleInstantVIP}
            className="w-full py-3 px-4 rounded-2xl glass-panel-gold border border-valaroix-gold text-valaroix-gold font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:bg-valaroix-gold hover:text-valaroix-dark shadow-md"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Instant 1-Click VIP Sign In</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-valaroix-gold/20 w-full" />
            <span className="bg-valaroix-dark px-3 text-[10px] uppercase font-mono text-gray-500">Or Email</span>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div className="relative">
                <User className="w-4 h-4 text-valaroix-gold absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Full Name (e.g. VIP Patron)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black border border-valaroix-gold/30 rounded-xl pl-11 pr-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-valaroix-gold"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="w-4 h-4 text-valaroix-gold absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-valaroix-gold/30 rounded-xl pl-11 pr-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-valaroix-gold"
              />
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-valaroix-gold absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-valaroix-gold/30 rounded-xl pl-11 pr-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-valaroix-gold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3.5 rounded-xl text-xs uppercase font-bold tracking-widest shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'SIGN IN TO ACCOUNT' : 'CREATE ACCOUNT'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Mode Switcher - Changed Create VIP Account to Sign Up */}
          <div className="text-center pt-2 border-t border-valaroix-gold/15">
            {mode === 'login' ? (
              <p className="text-xs text-gray-400">
                New to VALAROIX?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-valaroix-gold font-bold hover:underline ml-1 uppercase border border-valaroix-gold/40 px-2.5 py-0.5 rounded-md bg-valaroix-gold/10"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-xs text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-valaroix-gold font-bold hover:underline ml-1 uppercase border border-valaroix-gold/40 px-2.5 py-0.5 rounded-md bg-valaroix-gold/10"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
