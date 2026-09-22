import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, User, Mail, Lock, Sparkles, Phone, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    user,
    registerCustomer,
    loginCustomer,
    setCurrentPage
  } = useStore();

  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [accountType, setAccountType] = useState('retail'); // 'retail' or 'wholesale'
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'signup') {
      if (!name || !email || !password) {
        setErrorMsg('Please fill in all required fields.');
        return;
      }
      const res = await registerCustomer({ name, email, password, phone, accountType });
      if (!res.success) {
        setErrorMsg(res.message);
        return;
      }
      setSuccessMsg(res.message || 'Account created successfully!');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setCurrentPage('customer-dashboard');
      }, 1200);
    } else {
      if (!email) {
        setErrorMsg('Please enter your email address.');
        return;
      }
      const res = loginCustomer(email, password);
      if (!res.success) {
        setErrorMsg(res.message);
        return;
      }
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setCurrentPage('customer-dashboard');
      }, 800);
    }
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
            {mode === 'login'
              ? 'Sign in to access your orders, track shipments & saved wishlist.'
              : 'Register now for 10% OFF VIP discounts & fast wholesale checkout.'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 px-3 py-2 rounded-xl text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-2 rounded-xl text-xs text-center font-medium flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="text-xs text-gold-300 font-semibold block mb-1">Select Account Type *</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setAccountType('retail')}
                    className={`p-2.5 rounded-xl border font-semibold flex flex-col items-center justify-center text-center transition-all ${
                      accountType === 'retail'
                        ? 'bg-gold-500/20 border-gold-500 text-gold-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🛍️ Retail Customer</span>
                    <span className="text-[10px] text-slate-400 font-normal">Single piece purchases</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('wholesale')}
                    className={`p-2.5 rounded-xl border font-semibold flex flex-col items-center justify-center text-center transition-all ${
                      accountType === 'wholesale'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🏢 Wholesale Partner</span>
                    <span className="text-[10px] text-slate-400 font-normal">Bulk minimum orders</span>
                  </button>
                </div>
                {accountType === 'wholesale' && (
                  <p className="text-[10px] text-amber-300/80 mt-1 italic">
                    * Wholesale accounts require Store Admin approval for bulk ordering privileges (Min 5 pcs / ₹25,000 total).
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ruthi Shwaran"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="ruthi@mojjewels.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Mobile Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+91 82488 75865"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-gold-400 p-1 transition-colors"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-gold-shimmer py-3 rounded-xl font-bold text-xs shadow-lg transition-transform active:scale-95"
          >
            {mode === 'login' ? 'Sign In to Account' : 'Create VIP Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          {mode === 'login' ? (
            <p>
              New customer?{' '}
              <button onClick={() => { setMode('signup'); setErrorMsg(''); }} className="text-gold-400 underline font-semibold">
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setErrorMsg(''); }} className="text-gold-400 underline font-semibold">
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
