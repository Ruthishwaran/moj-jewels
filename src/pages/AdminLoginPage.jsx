import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Lock, User, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const { loginAdmin } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const success = loginAdmin(username, password);
    if (!success) {
      setErrorMsg('Invalid admin credentials. Contact management for access.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-amber-500/40 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-950 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400 gold-border-glow">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              RESTRICTED STORE MANAGEMENT
            </span>
            <h1 className="text-2xl font-serif font-bold text-white mt-2">
              MOJ Jewels Admin Desk
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Authorized management portal to verify payments, track orders & inventory.
            </p>
          </div>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Admin Username / Email</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="admin@mojjewels.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 p-1 transition-colors"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-rose-400 text-xs font-semibold bg-rose-950/40 border border-rose-800 p-2.5 rounded-xl text-center">
              {errorMsg}
            </p>
          )}

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="text-amber-400 font-bold block">Protected Access Credentials:</span>
            <p>Username: <code className="text-white font-mono bg-slate-950 px-1 py-0.5 rounded">admin@mojjewels.com</code></p>
            <p>Password: <code className="text-white font-mono bg-slate-950 px-1 py-0.5 rounded">MOJ@0606</code></p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 via-gold-500 to-amber-600 text-black font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xl hover:brightness-110 transition-all active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Login to Admin Desk</span>
          </button>
        </form>
      </div>
    </div>
  );
}
