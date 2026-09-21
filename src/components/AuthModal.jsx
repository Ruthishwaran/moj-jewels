import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, User, ShieldCheck, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    user,
    setUser,
    switchRole
  } = useStore();

  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState(user.email || '');
  const [name, setName] = useState(user.name || '');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({
      name: name || (mode === 'login' ? 'Valued Customer' : name),
      email: email || 'customer@mojjewels.com',
      role: 'customer'
    });
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-modal border border-gold-500/30 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">
            {mode === 'login' ? 'Welcome Back to MOJ Jewels' : 'Create Customer Account'}
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to track orders, save wishlists & receive VIP coupon codes.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-gold-shimmer py-3 rounded-xl font-semibold text-xs shadow-lg"
          >
            {mode === 'login' ? 'Sign In to Account' : 'Register Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              New to MOJ Jewels?{' '}
              <button onClick={() => setMode('signup')} className="text-gold-400 underline font-semibold">
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button onClick={() => setMode('login')} className="text-gold-400 underline font-semibold">
                Sign in here
              </button>
            </p>
          )}
        </div>

        {/* Demo Fast Switch Box */}
        <div className="pt-4 border-t border-slate-800 bg-slate-950/60 p-3 rounded-xl text-xs space-y-2">
          <span className="text-slate-400 font-semibold block text-[11px]">Instant Role Switcher for Store Demo:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                switchRole('customer');
                setIsAuthModalOpen(false);
              }}
              className="py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1"
            >
              <User className="w-3.5 h-3.5" /> Customer
            </button>
            <button
              type="button"
              onClick={() => {
                switchRole('admin');
                setIsAuthModalOpen(false);
              }}
              className="py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Store Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
